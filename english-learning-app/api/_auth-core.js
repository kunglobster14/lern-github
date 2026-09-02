import crypto from 'crypto';
import { getPool, ensureSchema, getDbConfig } from './_db.js';

const COOKIE='myenglish_session';
const SESSION_DAYS=30;

export function normalizeUsername(value){
  const username=String(value||'').trim();
  const key=username.toLowerCase();
  if(!/^[a-zA-Z0-9._-]{3,30}$/.test(username)) throw new Error('invalid_username');
  return {username,key};
}

export function validatePassword(value){
  const password=String(value||'');
  if(password.length<8||password.length>128) throw new Error('invalid_password');
  return password;
}

export function hashPassword(password,salt=crypto.randomBytes(16).toString('hex')){
  const hash=crypto.scryptSync(password,salt,64).toString('hex');
  return {salt,hash};
}

export function verifyPassword(password,salt,expected){
  try{
    const actual=crypto.scryptSync(password,String(salt),64);
    const target=Buffer.from(String(expected),'hex');
    return target.length===actual.length&&crypto.timingSafeEqual(actual,target);
  }catch{return false}
}

function sha256(value){return crypto.createHash('sha256').update(value).digest('hex')}
function parseCookies(req){
  const raw=String(req.headers?.cookie||'');
  const out={};
  raw.split(';').forEach(part=>{const i=part.indexOf('=');if(i>0)out[part.slice(0,i).trim()]=decodeURIComponent(part.slice(i+1).trim())});
  return out;
}

export function clearSessionCookie(res){
  res.setHeader('Set-Cookie',`${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
}

export async function createSession(res,userId){
  const pool=getPool();
  const token=crypto.randomBytes(32).toString('base64url');
  const tokenHash=sha256(token);
  const expires=new Date(Date.now()+SESSION_DAYS*86400000);
  await pool.query('DELETE FROM app_sessions WHERE expires_at < now()');
  await pool.query('INSERT INTO app_sessions(user_id,token_hash,expires_at) VALUES($1,$2,$3)',[userId,tokenHash,expires]);
  res.setHeader('Set-Cookie',`${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_DAYS*86400}`);
}

export async function destroySession(req,res){
  const pool=getPool();
  const token=parseCookies(req)[COOKIE];
  if(pool&&token) await pool.query('DELETE FROM app_sessions WHERE token_hash=$1',[sha256(token)]).catch(()=>{});
  clearSessionCookie(res);
}

export async function currentUser(req){
  const cfg=getDbConfig();
  if(!cfg.configured) return null;
  await ensureSchema();
  const pool=getPool();
  const token=parseCookies(req)[COOKIE];
  if(!token) return null;
  const result=await pool.query(`
    SELECT u.id,u.username,u.display_name,u.role
    FROM app_sessions s JOIN app_users u ON u.id=s.user_id
    WHERE s.token_hash=$1 AND s.expires_at>now() AND u.is_active=true
    LIMIT 1
  `,[sha256(token)]);
  const user=result.rows?.[0]||null;
  if(user) pool.query('UPDATE app_sessions SET last_seen_at=now() WHERE token_hash=$1',[sha256(token)]).catch(()=>{});
  return user;
}
