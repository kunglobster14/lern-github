(()=>{
const V='v79c-strict-thai-voice';
const OLD_AUTO='myEnglishV2.v79AutoNarration';
const OLD_AUTO_B='myEnglishV2.v79bAutoNarration';
const AUTO='myEnglishV2.v79cAutoNarration';
try{localStorage.setItem(OLD_AUTO,'0');localStorage.setItem(OLD_AUTO_B,'0')}catch{}
const imageCache={};
const thaiFemale=/premwadee|kanya|narisa|pattara|female|หญิง|siri/i;
const thaiMale=/niwat|male|ชาย/i;
const enMale=/daniel|alex|fred|thomas|david|ravi|lee|aaron|arthur|oliver|gordon|male/i;
function allVoices(){try{return speechSynthesis.getVoices?.()||[]}catch{return[]}}
function thaiVoices(){return allVoices().filter(v=>/^th(?:-|_)/i.test(String(v.lang||''))||String(v.lang||'').toLowerCase()==='th')}
function chooseThai(gender){const xs=thaiVoices();if(!xs.length)return null;const re=gender==='male'?thaiMale:thaiFemale;return xs.find(v=>re.test(v.name||''))||(gender==='male'&&xs.length>1?xs[xs.length-1]:xs[0])}
function chooseEnglishMale(){const xs=allVoices().filter(v=>/^en(?:-|_)/i.test(String(v.lang||''))||String(v.lang||'').toLowerCase()==='en');return xs.find(v=>enMale.test(v.name||''))||xs[0]||null}
function thaiText(text){return String(text||'')
 .replace(/Verb to be/gi,'เวิร์บ ทู บี')
 .replace(/Present Simple/gi,'เพรสเซนต์ ซิมเพิล')
 .replace(/Present Continuous/gi,'เพรสเซนต์ คอนทินิวอัส')
 .replace(/Past Simple/gi,'พาสต์ ซิมเพิล')
 .replace(/Past Continuous/gi,'พาสต์ คอนทินิวอัส')
 .replace(/Present Perfect/gi,'เพรสเซนต์ เพอร์เฟกต์')
 .replace(/Past Perfect/gi,'พาสต์ เพอร์เฟกต์')
 .replace(/Future Perfect/gi,'ฟิวเจอร์ เพอร์เฟกต์')
 .replace(/Future Continuous/gi,'ฟิวเจอร์ คอนทินิวอัส')
 .replace(/Grammar/gi,'แกรมมาร์')
 .replace(/TOEIC/gi,'โทอิค')
 .replace(/Part\s*5\s*\/\s*6/gi,'พาร์ต ห้า และ หก')
 .replace(/Part\s*([1-7])/gi,(_,n)=>'พาร์ต '+({1:'หนึ่ง',2:'สอง',3:'สาม',4:'สี่',5:'ห้า',6:'หก',7:'เจ็ด'}[n]||n))
 .replace(/Subject/gi,'ซับเจกต์').replace(/auxiliary/gi,'กริยาช่วย').replace(/verb form/gi,'รูปกริยา')
 .replace(/verb/gi,'เวิร์บ').replace(/noun/gi,'นาวน์').replace(/adjective/gi,'แอดเจกทีฟ').replace(/adverb/gi,'แอดเวิร์บ').replace(/connector/gi,'คอนเน็กเตอร์').replace(/clue/gi,'คลู')
 .replace(/\bam\b/gi,'แอม').replace(/\bis\b/gi,'อิส').replace(/\bare\b/gi,'อาร์').replace(/\bbe\b/gi,'บี');}
function waitThaiVoice(gender,timeout=5000){return new Promise(resolve=>{let done=false,timer=null,poll=null;const finish=v=>{if(done)return;done=true;clearTimeout(timer);clearInterval(poll);try{speechSynthesis.removeEventListener?.('voiceschanged',check)}catch{}resolve(v||null)};const check=()=>{let v=chooseThai(gender);if(v)finish(v)};check();if(done)return;try{speechSynthesis.addEventListener?.('voiceschanged',check)}catch{};poll=setInterval(check,120);timer=setTimeout(()=>finish(chooseThai(gender)),timeout)})}
function setStatus(host,msg,ok=false){if(!host)return;let root=host.closest?.('.v79-narrator,.v77-teacher')||host.parentElement;if(!root)return;let s=root.querySelector?.('.v79c-voice-status');if(!s){s=document.createElement('div');s.className='v79c-voice-status';s.style.cssText='margin-top:8px;font-size:12px;font-weight:800;color:#8a4b08';root.appendChild(s)}s.style.color=ok?'#166534':'#8a4b08';s.textContent=msg}
async function speakThai(text,gender='female',host=null){
 try{
  speechSynthesis.cancel();try{speechSynthesis.resume()}catch{}
  if(host){host.dataset.oldText=host.dataset.oldText||host.textContent;host.textContent='⏳ กำลังเตรียมเสียงภาษาไทย...'}
  const v=await waitThaiVoice(gender,5000);
  if(!v){if(host)host.textContent=host.dataset.oldText||'▶ ฟังเสียงไทย';setStatus(host,'ไม่พบเสียงภาษาไทยในอุปกรณ์นี้ ระบบจะไม่ใช้เสียงอังกฤษแทน กรุณาเปิด/ดาวน์โหลดเสียงภาษาไทยในเครื่อง');return false}
  const u=new SpeechSynthesisUtterance(thaiText(text));u.voice=v;u.lang=String(v.lang||'th-TH');u.rate=.86;u.pitch=gender==='female'?1.04:.9;
  u.onstart=()=>{if(host){host.textContent='🔊 กำลังพูดภาษาไทย';setStatus(host,`ใช้เสียงไทย: ${v.name}`,true)}};
  u.onend=()=>{if(host)host.textContent=host.dataset.oldText||'▶ ฟังเสียงไทย'};
  u.onerror=()=>{if(host){host.textContent=host.dataset.oldText||'▶ ฟังเสียงไทย';setStatus(host,'เสียงภาษาไทยเล่นไม่สำเร็จ ลองกดอีกครั้ง')}};
  speechSynthesis.speak(u);return true;
 }catch{if(host)host.textContent=host.dataset.oldText||'▶ ฟังเสียงไทย';return false}
}
function speakEnglish(text){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text||''));u.lang='en-US';u.rate=.78;u.pitch=.9;const v=chooseEnglishMale();if(v)u.voice=v;speechSynthesis.speak(u)}catch{}}
async function directImage(path){if(imageCache[path])return imageCache[path];imageCache[path]=fetch(path+'?v=79c',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('image '+r.status);return r.text()}).then(t=>{const m=t.match(/href=["'](data:image\/(?:jpeg|jpg|png);base64,[^"']+)["']/i);return m?.[1]||path}).catch(()=>path);return imageCache[path]}
function fallback(label,bg){return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="150" height="218"><rect width="150" height="218" rx="24" fill="${bg}"/><circle cx="75" cy="72" r="36" fill="#fff" opacity=".9"/><text x="75" y="82" text-anchor="middle" font-size="40">☺</text><text x="75" y="145" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="700" fill="#0f172a">${label}</text></svg>`)}
async function fixImages(box){const may=box.querySelector('.v79-person.may img'),pete=box.querySelector('.v79-person.pete img');if(may){may.src=fallback('ครูเมย์','#fce7f3');may.style.objectFit='cover';const src=await directImage('teacher-may-v79.svg');if(document.body.contains(may))may.src=src}if(pete){pete.src=fallback('พีท','#dbeafe');pete.style.objectFit='cover';const src=await directImage('student-pete-v79.svg');if(document.body.contains(pete))pete.src=src}}
function dayFromLesson(){const t=document.querySelector('#lessonV77 .v77-head small')?.textContent||'';return +(t.match(/L(\d+)/i)?.[1]||1)}
function currentExample(){const d=window.getCurriculumLessonV76?.(dayFromLesson())||window.getGrammarToeicV76?.(dayFromLesson());return d?.lesson?.teachingPairs?.[0]?.en||''}
function autoOn(){try{return localStorage.getItem(AUTO)!=='0'}catch{return true}}
function stripPete(box){let el=box.querySelector('.v79-pete');if(!el)return'';let clone=el.cloneNode(true);clone.querySelectorAll('button').forEach(b=>b.remove());return clone.textContent.replace(/^\s*พีททบทวน:\s*/,'').trim()}
function cloneBind(box,sel,fn,mark='v79c'){const old=box.querySelector(sel);if(!old||old.dataset[mark]==='1')return old;const n=old.cloneNode(true);n.dataset[mark]='1';old.replaceWith(n);n.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();fn(n)});return n}
function patchNarrator(box){if(!box||box.dataset.v79c==='1')return;box.dataset.v79c='1';try{speechSynthesis.cancel()}catch{};fixImages(box);const mayText=box.querySelector('.v79-bubble p')?.textContent?.trim()||'',peteText=stripPete(box);cloneBind(box,'[data-may]',b=>speakThai(mayText,'female',b));cloneBind(box,'[data-pete]',b=>speakThai(peteText,'male',b));cloneBind(box,'[data-en]',()=>speakEnglish(currentExample()));cloneBind(box,'[data-stop]',()=>{try{speechSynthesis.cancel()}catch{}});const autoBtn=cloneBind(box,'[data-auto]',btn=>{const on=autoOn();try{localStorage.setItem(AUTO,on?'0':'1')}catch{}btn.textContent=!on?'🔊 บรรยายอัตโนมัติ: เปิด':'🔇 บรรยายอัตโนมัติ: ปิด'});if(autoBtn)autoBtn.textContent=autoOn()?'🔊 บรรยายอัตโนมัติ: เปิด':'🔇 บรรยายอัตโนมัติ: ปิด';if(autoOn())setTimeout(()=>{if(document.body.contains(box))speakThai(mayText,'female',autoBtn)},420)}
function patchV77Thai(root=document){root.querySelectorAll?.('#lessonV77 [data-th]').forEach(btn=>{if(btn.dataset.v79cThai==='1')return;const text=btn.closest('.v77-teacher')?.querySelector('p')?.textContent?.trim()||'';btn.dataset.v79cThai='1';btn.onclick=null;btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();speakThai(text,'female',btn)},true)})}
function scan(){document.querySelectorAll('.v79-narrator').forEach(patchNarrator);patchV77Thai(document)}
try{speechSynthesis.getVoices?.()}catch{}
const ob=new MutationObserver(()=>requestAnimationFrame(scan));ob.observe(document.documentElement,{childList:true,subtree:true});scan();
window.V79C_THAI_VOICE={version:V,strictThaiVoice:true,noEnglishFallbackForThai:true,waitsForThaiVoices:true,patchesV77ThaiButtons:true,directCharacterImages:true};
})();