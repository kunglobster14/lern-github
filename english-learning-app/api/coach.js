const FREE_MODELS=['qwen/qwen3.6-27b','openai/gpt-oss-20b'];
const SCENARIOS={daily:'daily life and friendly small talk',coffee:'ordering food and drinks at a cafe',travel:'travel, transportation, hotels, and asking for directions',work:'simple workplace conversation',restaurant:'ordering food and paying at a restaurant',shopping:'shopping, prices, sizes, colors, and payment',hotel:'hotel check-in and simple hotel needs',airport:'airport check-in, gates, baggage, and flight questions'};

function cleanHistory(v){return Array.isArray(v)?v.slice(-10).map(x=>({role:x?.role==='user'?'user':'assistant',content:String(x?.text||x?.content||'').slice(0,500)})).filter(x=>x.content):[]}
function strip(s){return String(s||'').replace(/<think>[\s\S]*?<\/think>/gi,'').replace(/```(?:json)?/gi,'').replace(/```/g,'').trim()}
function parse(raw){const s=strip(raw);try{return JSON.parse(s)}catch{}const a=s.indexOf('{'),b=s.lastIndexOf('}');if(a>=0&&b>a){try{return JSON.parse(s.slice(a,b+1))}catch{}}throw new Error('parse_failed')}
async function call(model,messages,system){const key=process.env.GROQ_API_KEY;if(!key)throw new Error('missing_key');const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model,messages:[{role:'system',content:system},...messages],temperature:.35,max_completion_tokens:260,stream:false})});if(!r.ok)throw new Error('groq_'+r.status);const d=await r.json();return parse(d?.choices?.[0]?.message?.content||'')}
export default async function handler(req,res){if(req.method!=='POST'){res.status(405).json({error:'method_not_allowed'});return}try{const body=req.body||{},message=String(body.message||'').trim().slice(0,700);if(!message){res.status(400).json({error:'message_required'});return}const scenario=SCENARIOS[body.scenario]||SCENARIOS.daily,learner=String(body.name||'learner').slice(0,30);const wantsVoice=/\b(speak|listen|pronounc|say it|read it|voice)\b/i.test(message);const system=`You are an English teacher for a Thai beginner named ${learner}. Practice ${scenario}.
Your job is to TEACH, not just chat.
For every learner message:
1) Understand the learner's intention first.
2) If their English is unnatural or incorrect, give ONE natural corrected sentence.
3) Give a very short Thai explanation.
4) Continue the conversation with exactly ONE easy related question.
5) Never repeat the same generic coaching phrase from recent turns.
6) If the learner says they are not good at English, asks you to teach them, or asks what to do, switch to beginner-teacher mode: use very easy English, give one model sentence, and ask them to repeat or answer one simple question.
7) If the learner asks to listen, speak, hear pronunciation, or says "can you speak", provide a short sentence suitable for text-to-speech and set speak=true.
Keep text to 1-3 short English sentences total. Thai must be concise.
Return ONLY JSON: {"text":"English reply","thai":"Thai coaching note","corrected":"corrected learner sentence or empty string","speak":true}`;const messages=[...cleanHistory(body.history),{role:'user',content:message}];let out=null;for(const model of FREE_MODELS){try{out=await call(model,messages,system);break}catch{}}if(!out)throw new Error('free_ai_unavailable');res.status(200).json({text:String(out.text||''),thai:String(out.thai||''),corrected:String(out.corrected||''),speak:Boolean(out.speak||wantsVoice),source:'groq-free-plan'})}catch(e){res.status(503).json({error:'free_ai_unavailable',fallback:'local_coach'})}}
