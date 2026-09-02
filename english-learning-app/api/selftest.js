import crypto from 'crypto';
import { getDbConfig, getPool, ensureSchema } from './_db.js';
import { hashPassword, verifyPassword } from './_auth-core.js';

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET'){res.status(405).json({error:'method_not_allowed'});return}
  const cfg=getDbConfig();
  if(!cfg.configured||cfg.mode!=='temporary'){res.status(403).json({ok:false,error:'temporary_database_required'});return}
  try{
    await ensureSchema();
    const pool=getPool();
    const client=await pool.connect();
    const tag=crypto.randomBytes(5).toString('hex');
    const ua=`selftest_a_${tag}`, ub=`selftest_b_${tag}`;
    const {salt,hash}=hashPassword(`SelfTest-${tag}-Pass!`);
    const passwordOk=verifyPassword(`SelfTest-${tag}-Pass!`,salt,hash)&&!verifyPassword('wrong-password',salt,hash);
    let isolation=false, uniqueUsernames=false, rows=0;
    try{
      await client.query('BEGIN');
      const a=(await client.query("INSERT INTO app_users(username,username_key,display_name,password_salt,password_hash,role) VALUES($1,$1,$2,$3,$4,'learner') RETURNING id",[ua,'Test A',salt,hash])).rows[0];
      const b=(await client.query("INSERT INTO app_users(username,username_key,display_name,password_salt,password_hash,role) VALUES($1,$1,$2,$3,$4,'learner') RETURNING id",[ub,'Test B',salt,hash])).rows[0];
      await client.query('INSERT INTO learner_state(user_id,state,revision) VALUES($1,$2::jsonb,1),($3,$4::jsonb,1)',[a.id,JSON.stringify({core3000Plan:{mastered:12},course:{completed:['a0u1']}}),b.id,JSON.stringify({core3000Plan:{mastered:36},course:{completed:['a0u1','a0u2']}})]);
      const check=await client.query('SELECT u.username,s.state FROM app_users u JOIN learner_state s ON s.user_id=u.id WHERE u.id=ANY($1::uuid[]) ORDER BY u.username',[ [a.id,b.id] ]);
      rows=check.rowCount;
      const map=Object.fromEntries(check.rows.map(r=>[r.username,r.state]));
      isolation=map[ua]?.core3000Plan?.mastered===12&&map[ub]?.core3000Plan?.mastered===36&&map[ua]?.course?.completed?.length===1&&map[ub]?.course?.completed?.length===2;
      try{await client.query("INSERT INTO app_users(username,username_key,display_name,password_salt,password_hash,role) VALUES($1,$1,'Duplicate',$2,$3,'learner')",[ua,salt,hash])}catch(error){uniqueUsernames=error?.code==='23505'}
      await client.query('ROLLBACK');
    }catch(error){await client.query('ROLLBACK').catch(()=>{});throw error}finally{client.release()}
    const ok=passwordOk&&isolation&&uniqueUsernames&&rows===2;
    res.status(ok?200:500).json({ok,databaseMode:cfg.mode,schemaReady:true,passwordHashing:passwordOk,userIsolation:isolation,uniqueUsernames,checkedUsers:rows,rolledBack:true});
  }catch(error){res.status(500).json({ok:false,error:'selftest_failed',detail:String(error?.code||error?.message||error).slice(0,120)})}
}
