export async function onRequestPost(context){
  try{
    if(!context.env.AI){return Response.json({error:'AI binding not configured'},{status:503})}
    const body=await context.request.json();
    const message=String(body?.message||'').trim().slice(0,1200);
    if(!message)return Response.json({error:'message required'},{status:400});
    const scenario=String(body?.scenario||'daily');
    const name=String(body?.name||'student').slice(0,40);
    const history=Array.isArray(body?.history)?body.history.slice(-8):[];
    const scenarioText={coffee:'ordering at a cafe',travel:'travel and asking directions',work:'simple workplace conversation',daily:'daily life small talk'}[scenario]||'daily life small talk';
    const messages=[{role:'system',content:`You are My English Coach for a Thai beginner named ${name}. Practice ${scenarioText}. Keep every reply short: 1-3 simple English sentences. Be warm, practical, and continue the conversation with one easy question. If the student's English has a meaningful mistake, gently show the corrected English. Never overwhelm with grammar. Return ONLY valid JSON with keys text and thai. text is the English reply. thai is a short Thai explanation/correction.`},...history.map(item=>({role:item.role==='user'?'user':'assistant',content:String(item.text||'').slice(0,500)})),{role:'user',content:message}];
    const result=await context.env.AI.run('@cf/google/gemma-4-26b-a4b-it',{messages,chat_template_kwargs:{enable_thinking:false}});
    const raw=String(result?.response||result?.result?.response||'').trim();
    let parsed;
    try{parsed=JSON.parse(raw.replace(/^```json\s*|\s*```$/g,''))}catch{parsed={text:raw||'Good try! Please tell me a little more.',thai:'ลองตอบเพิ่มอีกนิดได้เลยครับ'}}
    return Response.json({text:String(parsed.text||'Good try!').slice(0,900),thai:String(parsed.thai||'').slice(0,700)},{headers:{'cache-control':'no-store'}})
  }catch(error){return Response.json({error:'AI request failed'},{status:500})}
}

export async function onRequest(context){
  if(context.request.method==='OPTIONS')return new Response(null,{status:204,headers:{'access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'content-type'}});
  if(context.request.method!=='POST')return Response.json({error:'method not allowed'},{status:405});
  return onRequestPost(context)
}
