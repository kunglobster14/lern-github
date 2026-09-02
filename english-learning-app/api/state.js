import { getDbConfig, getPool, ensureSchema } from './_db.js';
import { currentUser } from './_auth-core.js';

const MAX_BYTES=350000;
function json(res,status,body){res.status(status).json(body)}

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  const cfg=getDbConfig();
  if(!cfg.configured){json(res,503,{error:'database_not_configured'});return}
  try{
    await ensureSchema();
    const user=await currentUser(req);
    if(!user){json(res,401,{error:'not_authenticated'});return}
    const pool=getPool();
    if(req.method==='GET'){
      const result=await pool.query('SELECT state,revision,updated_at FROM learner_state WHERE user_id=$1 LIMIT 1',[user.id]);
      const row=result.rows?.[0];
      json(res,200,{ok:true,state:row?.state||{},revision:Number(row?.revision||0),updatedAt:row?.updated_at||null,user:{id:user.id,username:user.username,displayName:user.display_name}});return;
    }
    if(req.method!=='POST'){json(res,405,{error:'method_not_allowed'});return}
    const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    const snapshot=body.state&&typeof body.state==='object'?body.state:{};
    const encoded=JSON.stringify(snapshot);
    if(Buffer.byteLength(encoded,'utf8')>MAX_BYTES){json(res,413,{error:'state_too_large'});return}
    const result=await pool.query(`
      INSERT INTO learner_state(user_id,state,revision,updated_at)
      VALUES($1,$2::jsonb,1,now())
      ON CONFLICT(user_id) DO UPDATE SET state=EXCLUDED.state, revision=learner_state.revision+1, updated_at=now()
      RETURNING revision,updated_at
    `,[user.id,encoded]);
    json(res,200,{ok:true,revision:Number(result.rows[0].revision),updatedAt:result.rows[0].updated_at});
  }catch(error){json(res,503,{error:'state_service_unavailable',detail:String(error?.message||error).slice(0,120),databaseMode:cfg.mode})}
}
