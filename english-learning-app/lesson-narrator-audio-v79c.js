(()=>{
const V='v79c-thai-speech-runtime';
const AUTO='myEnglishV2.v79cAutoNarration';
try{localStorage.setItem('myEnglishV2.v79AutoNarration','0');localStorage.setItem('myEnglishV2.v79bAutoNarration','0')}catch{}
const synth=window.speechSynthesis;
const thaiFemale=/premwadee|kanya|narisa|pattara|siri|female|หญิง/i;
const thaiMale=/niwat|male|ชาย/i;
let voiceCache=[];
function refreshVoices(){try{const xs=synth?.getVoices?.()||[];if(xs.length)voiceCache=xs;return xs.length?xs:voiceCache}catch{return voiceCache}}
try{synth?.addEventListener?.('voiceschanged',refreshVoices)}catch{}
refreshVoices();
function thaiVoices(){return refreshVoices().filter(v=>/^th(?:-|_)/i.test(String(v.lang||''))||String(v.lang||'').toLowerCase()==='th')}
function chooseThai(gender){const xs=thaiVoices();if(!xs.length)return null;const re=gender==='male'?thaiMale:thaiFemale;return xs.find(v=>re.test(v.name||''))||xs[0]}
function thaiText(text){return String(text||'')
 .replace(/Verb to be/gi,'เวิร์บ ทู บี')
 .replace(/Present Simple/gi,'เพรสเซนต์ ซิมเพิล')
 .replace(/Present Continuous/gi,'เพรสเซนต์ คอนทินิวอัส')
 .replace(/Past Simple/gi,'พาสต์ ซิมเพิล')
 .replace(/Past Continuous/gi,'พาสต์ คอนทินิวอัส')
 .replace(/Present Perfect/gi,'เพรสเซนต์ เพอร์เฟกต์')
 .replace(/Past Perfect/gi,'พาสต์ เพอร์เฟกต์')
 .replace(/Future Continuous/gi,'ฟิวเจอร์ คอนทินิวอัส')
 .replace(/Future Perfect/gi,'ฟิวเจอร์ เพอร์เฟกต์')
 .replace(/Grammar/gi,'แกรมมาร์').replace(/TOEIC/gi,'โทอิค')
 .replace(/Part\s*5\s*\/\s*6/gi,'พาร์ต ห้า และ หก')
 .replace(/Part\s*([1-7])/gi,(_,n)=>'พาร์ต '+({1:'หนึ่ง',2:'สอง',3:'สาม',4:'สี่',5:'ห้า',6:'หก',7:'เจ็ด'}[n]||n))
 .replace(/Subject/gi,'ประธาน').replace(/auxiliary/gi,'กริยาช่วย').replace(/verb form/gi,'รูปกริยา')
 .replace(/connector/gi,'คำเชื่อม').replace(/clue/gi,'คำใบ้')
 .replace(/adjective/gi,'คำคุณศัพท์').replace(/adverb/gi,'คำกริยาวิเศษณ์').replace(/noun/gi,'คำนาม')
 .replace(/\bverb\b/gi,'กริยา').replace(/\bam\b/gi,'แอม').replace(/\bis\b/gi,'อิส').replace(/\bare\b/gi,'อาร์').replace(/\bbe\b/gi,'บี')
 .replace(/\bV1\b/gi,'กริยาช่องหนึ่ง').replace(/\bV2\b/gi,'กริยาช่องสอง').replace(/\bV3\b/gi,'กริยาช่องสาม');}
function statusFor(el){let box=el?.closest?.('.v79-narrator,.v77-card');if(!box)return null;let s=box.querySelector('[data-v79c-status]');if(!s){s=document.createElement('div');s.dataset.v79cStatus='1';s.style.cssText='margin-top:8px;font-size:12px;font-weight:800;color:#4b5f7d';(el.parentElement||box).appendChild(s)}return s}
function setStatus(el,msg){const s=statusFor(el);if(s)s.textContent=msg}
function makeUtterance(text,gender,withVoice=true){const u=new SpeechSynthesisUtterance(thaiText(text));u.lang='th-TH';u.rate=.84;u.pitch=gender==='female'?1.04:.9;const v=withVoice?chooseThai(gender):null;if(v)u.voice=v;return {u,v}}
function speakNow(text,gender,button,attempt=0){
 if(!synth||!window.SpeechSynthesisUtterance){setStatus(button,'อุปกรณ์นี้ไม่รองรับเสียงพูด');return}
 try{synth.resume?.()}catch{}
 const {u,v}=makeUtterance(text,gender,attempt===0);
 let started=false,done=false;
 u.onstart=()=>{started=true;setStatus(button,v?`กำลังพูดภาษาไทย · ${v.name}`:'กำลังพูดภาษาไทย · ใช้เสียงไทยของระบบ')};
 u.onend=()=>{done=true;setStatus(button,'จบการบรรยายภาษาไทยแล้ว')};
 u.onerror=()=>{if(done)return;done=true;if(attempt===0){setStatus(button,'กำลังลองเสียงไทยของระบบอีกครั้ง…');setTimeout(()=>speakNow(text,gender,button,1),90)}else setStatus(button,'ยังเปิดเสียงไทยไม่ได้บนอุปกรณ์นี้')};
 try{synth.speak(u)}catch{if(attempt===0)setTimeout(()=>speakNow(text,gender,button,1),90)}
 setTimeout(()=>{if(!started&&!done&&attempt===0){try{synth.cancel()}catch{};setStatus(button,'กำลังโหลดเสียงไทย…');setTimeout(()=>speakNow(text,gender,button,1),120)}},1300);
}
function speakThai(text,gender,button){
 if(!String(text||'').trim())return;
 try{synth?.resume?.()}catch{}
 if(synth?.speaking||synth?.pending){try{synth.cancel()}catch{};setTimeout(()=>speakNow(text,gender,button,0),70)}else speakNow(text,gender,button,0);
}
function mayText(btn){return btn.closest('.v79-narrator')?.querySelector('.v79-bubble p')?.textContent?.trim()||btn.closest('.v77-teacher')?.querySelector('p')?.textContent?.trim()||''}
function peteText(btn){let el=btn.closest('.v79-narrator')?.querySelector('.v79-pete');if(!el)return'';let c=el.cloneNode(true);c.querySelectorAll('button').forEach(x=>x.remove());return c.textContent.replace(/^\s*พีททบทวน:\s*/,'').trim()}
function intercept(e){
 const btn=e.target?.closest?.('[data-may],[data-pete],[data-th]');if(!btn||!btn.closest?.('#lessonV77'))return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
 if(btn.matches('[data-pete]'))speakThai(peteText(btn),'male',btn);else speakThai(mayText(btn),'female',btn);
}
document.addEventListener('click',intercept,true);
function patchLabels(){document.querySelectorAll('#lessonV77 [data-may]').forEach(b=>b.textContent='▶ ฟังครูเมย์พูดภาษาไทย');document.querySelectorAll('#lessonV77 [data-pete]').forEach(b=>b.textContent='▶ ฟังพีทพูดภาษาไทย');document.querySelectorAll('#lessonV77 [data-th]').forEach(b=>b.textContent='▶ ฟังคำอธิบายภาษาไทย')}
const ob=new MutationObserver(()=>requestAnimationFrame(patchLabels));ob.observe(document.documentElement,{childList:true,subtree:true});patchLabels();
window.V79C_THAI_SPEECH={version:V,manualGestureFirst:true,thaiLocale:'th-TH',explicitThaiVoicePreferred:true,systemThaiFallback:true,englishFallback:false,oldAutoDisabled:true};
})();