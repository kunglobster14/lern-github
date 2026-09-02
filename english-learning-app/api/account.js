import { getDbConfig, getPool, ensureSchema, schemaStatus } from './_db.js';
import { normalizeUsername, validatePassword, hashPassword, verifyPassword, createSession, destroySession, currentUser } from './_auth-core.js';

function json(res,status,body){res.status(status).json(body)}
function safeName(value,fallback){return String(value||fallback||'ผู้เรียน').trim().slice(0,40)||'ผู้เรียน'}
async function userCount(pool){const r=await pool.query('SELECT count(*)::int AS count FROM app_users WHERE is_active=true');return Number(r.rows?.[0]?.count||0)}

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  const cfg=getDbConfig();
  if(!cfg.configured){json(res,200,{ok:true,dbConfigured:false,databaseMode:'none',authenticated:false});return}

  try{
    await ensureSchema();
    const pool=getPool();
    if(req.method==='GET'){
      const user=await currentUser(req);
      const count=await userCount(pool);
      json(res,200,{ok:true,dbConfigured:true,dbReady:true,databaseMode:cfg.mode,authenticated:Boolean(user),user:user?{id:user.id,username:user.username,displayName:user.display_name,role:user.role}:null,userCount:count,maxUsers:10,publicRegistration:cfg.mode==='temporary'||count===0});
      return;
    }
    if(req.method!=='POST'){json(res,405,{error:'method_not_allowed'});return}
    const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    const action=String(body.action||'').toLowerCase();

    if(action==='logout'){
      await destroySession(req,res);json(res,200,{ok:true});return;
    }

    if(action==='login'){
      const {key}=normalizeUsername(body.username);
      const password=validatePassword(body.password);
      const result=await pool.query('SELECT id,username,display_name,password_salt,password_hash,role,is_active FROM app_users WHERE username_key=$1 LIMIT 1',[key]);
      const row=result.rows?.[0];
      if(!row||!row.is_active||!verifyPassword(password,row.password_salt,row.password_hash)){
        await new Promise(r=>setTimeout(r,250));json(res,401,{error:'invalid_credentials'});return;
      }
      await pool.query('UPDATE app_users SET last_login_at=now() WHERE id=$1',[row.id]);
      await createSession(res,row.id);
      json(res,200,{ok:true,user:{id:row.id,username:row.username,displayName:row.display_name,role:row.role}});return;
    }

    if(action==='register'){
      const count=await userCount(pool);
      const allow=cfg.mode==='temporary'||count===0||process.env.MYENGLISH_REGISTRATION_OPEN==='1';
      if(!allow){json(res,403,{error:'registration_closed'});return}
      if(count>=10){json(res,409,{error:'user_limit_reached'});return}
      const {username,key}=normalizeUsername(body.username);
      const password=validatePassword(body.password);
      const displayName=safeName(body.displayName,username);
      const {salt,hash}=hashPassword(password);
      const role=count===0?'admin':'learner';
      try{
        const created=await pool.query('INSERT INTO app_users(username,username_key,display_name,password_salt,password_hash,role) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,username,display_name,role',[username,key,displayName,salt,hash,role]);
        const user=created.rows[0];
        await pool.query('INSERT INTO learner_state(user_id,state) VALUES($1,$2::jsonb) ON CONFLICT(user_id) DO NOTHING',[user.id,'{}']);
        await createSession(res,user.id);
        json(res,201,{ok:true,user:{id:user.id,username:user.username,displayName:user.display_name,role:user.role}});return;
      }catch(error){if(error?.code==='23505'){json(res,409,{error:'username_taken'});return}throw error}
    }

    if(action==='create-user'){
      const admin=await currentUser(req);
      if(!admin||admin.role!=='admin'){json(res,403,{error:'admin_required'});return}
      const count=await userCount(pool);
      if(count>=10){json(res,409,{error:'user_limit_reached'});return}
      const {username,key}=normalizeUsername(body.username);
      const password=validatePassword(body.password);
      const displayName=safeName(body.displayName,username);
      const {salt,hash}=hashPassword(password);
      try{
        const created=await pool.query('INSERT INTO app_users(username,username_key,display_name,password_salt,password_hash,role) VALUES($1,$2,$3,$4,$5,$6) RETURNING id,username,display_name,role',[username,key,displayName,salt,hash,'learner']);
        await pool.query('INSERT INTO learner_state(user_id,state) VALUES($1,$2::jsonb)',[created.rows[0].id,'{}']);
        json(res,201,{ok:true,user:{id:created.rows[0].id,username:created.rows[0].username,displayName:created.rows[0].display_name,role:'learner'}});return;
      }catch(error){if(error?.code==='23505'){json(res,409,{error:'username_taken'});return}throw error}
    }

    if(action==='list-users'){
      const admin=await currentUser(req);
      if(!admin||admin.role!=='admin'){json(res,403,{error:'admin_required'});return}
      const users=await pool.query('SELECT id,username,display_name,role,is_active,created_at,last_login_at FROM app_users ORDER BY created_at');
      json(res,200,{ok:true,users:users.rows,maxUsers:10});return;
    }

    json(res,400,{error:'unknown_action'});
  }catch(error){
    const status=await schemaStatus().catch(()=>({}));
    json(res,503,{error:'account_service_unavailable',databaseMode:cfg.mode,dbReady:Boolean(status?.ready),detail:String(error?.message||error).slice(0,120)});
  }
}
