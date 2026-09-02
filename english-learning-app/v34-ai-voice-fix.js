(()=>{
'use strict';
const originalFetch=window.fetch.bind(window);
const KEY='myEnglishV2';
let listening=false,recognition=null;
const pick=(arr,seed)=>arr[Math.abs(seed)%arr.length];
const hash=s=>{let h=0;for(const ch of String(s||''))h=((h<<5)-h+ch.charCodeAt(0))|0;return h};
function recentAi(){try{const s=JSON.parse(localStorage.getItem(KEY)||'{}');return (Array.isArray(s.chat)?s.chat:[]).filter(x=>x?.role==='ai').slice(-4).map(x=>String(x.text||''))}catch{return[]}}
function avoidRepeat(candidates,seed){const recent=recentAi();const fresh=candidates.filter(x=>!recent.includes(x.text));return pick(fresh.length?fresh:candidates,seed)}
function coach(message,scenario='daily'){
  const raw=String(message||'').trim(),t=raw.toLowerCase(),seed=hash(raw+Date.now().toString().slice(-4));
  if(/[ก-๙]/.test(raw))return avoidRepeat([
    {text:'Try saying that in English with one short sentence. Start with “I am…”, “I want…”, or “I need…”.',thai:'ลองพูดเป็นอังกฤษสั้น ๆ 1 ประโยค เริ่มด้วย I am, I want หรือ I need'},
    {text:'Let’s turn that into English. Tell me the main idea in a short sentence.',thai:'ลองเปลี่ยนใจความสำคัญเป็นภาษาอังกฤษสั้น ๆ'},
    {text:'Use simple English first. One clear sentence is enough, and I will help you improve it.',thai:'เริ่มจากอังกฤษง่าย ๆ เพียงหนึ่งประโยค แล้วฉันจะช่วยปรับให้'}
  ],seed);
  if(/^i want you help\b/.test(t))return{text:'A natural correction is: “I want you to help me.” Even better for a request: “Can you help me, please?” What do you need help with?',thai:'ประโยคที่ถูกคือ I want you to help me หรือถ้าขอความช่วยเหลือใช้ Can you help me, please? แล้วลองบอกว่าต้องการให้ช่วยเรื่องอะไร'};
  if(/\bi am busy\b/.test(t))return avoidRepeat([
    {text:'Good. A more natural sentence is: “I am very busy today.” Why are you busy today?',thai:'ธรรมชาติกว่าคือ I am very busy today. แล้วลองบอกต่อว่าทำไมวันนี้ถึงยุ่ง'},
    {text:'Nice try. Say: “I am very busy today.” What are you working on?',thai:'ลองพูดว่า I am very busy today. แล้วตอบต่อว่ากำลังทำอะไรอยู่'},
    {text:'Almost! “I am very busy today” sounds more natural. Are you busy because of work?',thai:'I am very busy today ฟังเป็นธรรมชาติกว่า วันนี้ยุ่งเพราะงานหรือไม่?'}
  ],seed);
  if(/\bi am tired\b/.test(t))return avoidRepeat([
    {text:'That sentence works well. What made you tired today?',thai:'ประโยคนี้ใช้ได้ดี วันนี้อะไรทำให้คุณเหนื่อย?'},
    {text:'Good sentence. You can continue: “I am tired because…” What happened today?',thai:'ดีมาก ลองต่อด้วย I am tired because… แล้วเล่าว่าเกิดอะไรขึ้น'},
    {text:'Nice. Are you tired from work, travel, or something else?',thai:'ดีมาก คุณเหนื่อยจากงาน การเดินทาง หรืออย่างอื่น?'}
  ],seed);
  if(/^i am\b/.test(t))return avoidRepeat([
    {text:'Good start. Tell me why, using “because”.',thai:'เริ่มได้ดี ลองบอกเหตุผลต่อโดยใช้ because'},
    {text:'Nice. Add one detail about where, when, or why.',thai:'ดีมาก ลองเพิ่มรายละเอียดเรื่องที่ไหน เมื่อไร หรือทำไม'},
    {text:'Good sentence. Now tell me what happened next.',thai:'ประโยคดีแล้ว ต่อไปลองเล่าว่าเกิดอะไรต่อ'}
  ],seed);
  if(/\b(work|project|meeting|office)\b/.test(t))return avoidRepeat([
    {text:'Good. What is the most important thing you need to finish at work today?',thai:'ดีมาก วันนี้งานสำคัญที่สุดที่คุณต้องทำให้เสร็จคืออะไร?'},
    {text:'Tell me a little more about your work. Is it easy or difficult today?',thai:'ลองเล่าเรื่องงานเพิ่ม วันนี้งานง่ายหรือยาก?'},
    {text:'Nice. What time do you usually finish work?',thai:'ดีมาก ปกติคุณเลิกงานกี่โมง?'}
  ],seed);
  if(/\b(coffee|tea|drink|water)\b/.test(t)||scenario==='coffee')return avoidRepeat([
    {text:'Great. How do you like your drink — hot, iced, sweet, or not sweet?',thai:'ดีมาก คุณชอบเครื่องดื่มแบบร้อน เย็น หวาน หรือไม่หวาน?'},
    {text:'Good. What size would you like?',thai:'ดีครับ ต้องการขนาดไหน?'},
    {text:'Nice. Would you like anything to eat with that?',thai:'ดีมาก ต้องการอาหารอะไรทานคู่ด้วยไหม?'}
  ],seed);
  if(/\b(hotel|reservation|room)\b/.test(t)||scenario==='hotel')return avoidRepeat([
    {text:'Good. What name is the reservation under?',thai:'ดีมาก การจองใช้ชื่ออะไร?'},
    {text:'Nice. How many nights will you stay?',thai:'ดีครับ คุณจะพักกี่คืน?'},
    {text:'Great. Would you like to ask about breakfast or check-out time?',thai:'ดีมาก อยากถามเรื่องอาหารเช้าหรือเวลาเช็กเอาต์ไหม?'}
  ],seed);
  if(/\b(airport|flight|gate|plane)\b/.test(t)||scenario==='airport'||scenario==='travel')return avoidRepeat([
    {text:'Good. Where are you traveling to?',thai:'ดีมาก คุณกำลังเดินทางไปที่ไหน?'},
    {text:'Nice. What time is your flight?',thai:'ดีครับ เที่ยวบินของคุณกี่โมง?'},
    {text:'Great. Do you need help finding your gate or checking in?',thai:'ดีมาก ต้องการให้ช่วยหาเกตหรือเช็กอินไหม?'}
  ],seed);
  return avoidRepeat([
    {text:'Good try. Tell me one more thing about that.',thai:'ทำได้ดี ลองเล่าเรื่องนั้นเพิ่มอีกหนึ่งอย่าง'},
    {text:'Nice. Can you give me one example?',thai:'ดีมาก ลองยกตัวอย่างหนึ่งอย่างได้ไหม?'},
    {text:'Good. What happened next?',thai:'ดีครับ แล้วเกิดอะไรขึ้นต่อ?'},
    {text:'I understand. How do you feel about it?',thai:'เข้าใจแล้ว คุณรู้สึกอย่างไรกับเรื่องนั้น?'},
    {text:'That makes sense. Can you explain why?',thai:'เข้าใจได้ครับ ลองอธิบายว่าทำไมได้ไหม?'}
  ],seed);
}
window.fetch=async function(input,init){
  const url=typeof input==='string'?input:(input?.url||'');
  if(!url.includes('/api/ai'))return originalFetch(input,init);
  let body={};try{body=JSON.parse(init?.body||'{}')}catch{}
  if(body?.mode==='vocab_batch')return originalFetch(input,init);
  try{
    const r=await originalFetch(input,init);
    if(r.ok)return r;
  }catch{}
  const reply=coach(body?.message||'',body?.scenario||'daily');
  return new Response(JSON.stringify(reply),{status:200,headers:{'content-type':'application/json','x-myenglish-fallback':'local-v342'}});
};
function supported(){return window.SpeechRecognition||window.webkitSpeechRecognition}
function setMicVisual(btn,on,text){btn.classList.toggle('mic-live',on);btn.textContent=on?'⏹️':'🎤';btn.title=text|| (on?'หยุดฟัง':'พูดกับ AI')}
function startMic(btn){
  const SR=supported();
  if(!SR){alert('เบราว์เซอร์นี้ยังไม่รองรับ Speech Recognition โดยตรง กรุณาใช้ Chrome/Edge ที่รองรับ หรือใช้ปุ่มไมโครโฟนของคีย์บอร์ด');return}
  if(listening){try{recognition?.stop()}catch{};return}
  recognition=new SR();recognition.lang='en-US';recognition.interimResults=true;recognition.continuous=false;recognition.maxAlternatives=1;
  const input=document.querySelector('#chatInput');if(!input)return;
  let finalText='';
  recognition.onstart=()=>{listening=true;setMicVisual(btn,true,'กำลังฟัง... กดอีกครั้งเพื่อหยุด');input.placeholder='กำลังฟังภาษาอังกฤษ...'};
  recognition.onresult=e=>{let interim='';for(let i=e.resultIndex;i<e.results.length;i++){const txt=e.results[i][0].transcript;if(e.results[i].isFinal)finalText+=txt;else interim+=txt}input.value=(finalText||interim).trim();input.dispatchEvent(new Event('input',{bubbles:true}))};
  recognition.onerror=e=>{if(e.error!=='no-speech')console.warn('speech recognition',e.error)};
  recognition.onend=()=>{listening=false;setMicVisual(btn,false);input.placeholder='พิมพ์อังกฤษหรือไทยก็ได้...';if(finalText.trim())input.value=finalText.trim()};
  try{recognition.start()}catch{listening=false;setMicVisual(btn,false)}
}
function enhanceComposer(){
  const form=document.querySelector('#chatForm');if(!form||form.querySelector('.voice-btn'))return;
  const input=form.querySelector('#chatInput');if(!input)return;
  form.style.gridTemplateColumns='auto 1fr auto';
  const mic=document.createElement('button');mic.type='button';mic.className='secondary voice-btn';mic.textContent='🎤';mic.title='พูดกับ AI';mic.setAttribute('aria-label','พูดกับ AI');mic.style.minWidth='52px';mic.onclick=()=>startMic(mic);form.insertBefore(mic,input);
  const note=document.createElement('div');note.className='muted voice-note';note.textContent=supported()?'🎤 กดไมค์ → พูดอังกฤษ → ตรวจข้อความ → กดส่ง':'ไมโครโฟนสนทนาต้องใช้เบราว์เซอร์ที่รองรับ Speech Recognition';note.style.gridColumn='1 / -1';note.style.fontSize='12px';note.style.padding='2px 4px';form.appendChild(note);
}
const style=document.createElement('style');style.textContent='.voice-btn{padding:12px 14px!important;font-size:20px}.voice-btn.mic-live{outline:2px solid #ef4444;background:#3b1721!important}@media(max-width:520px){.composer{grid-template-columns:auto 1fr auto!important}.voice-btn{min-width:48px!important;padding:10px!important}}';document.head.appendChild(style);
new MutationObserver(enhanceComposer).observe(document.documentElement,{subtree:true,childList:true});enhanceComposer();
window.__myEnglishV342={version:'34.2',voiceSupported:!!supported()};
})();
