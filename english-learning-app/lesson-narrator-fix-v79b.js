(()=>{
const V='v79b-thai-narrator-fix';
const OLD_AUTO='myEnglishV2.v79AutoNarration';
const AUTO='myEnglishV2.v79bAutoNarration';
try{localStorage.setItem(OLD_AUTO,'0')}catch{}
const imageCache={};
const thaiFemale=/premwadee|kanya|narisa|pattara|female|หญิง|siri/i;
const thaiMale=/niwat|male|ชาย/i;
const enMale=/daniel|alex|fred|thomas|david|ravi|lee|aaron|arthur|oliver|gordon|male/i;
function allVoices(){try{return speechSynthesis.getVoices?.()||[]}catch{return[]}}
function langVoices(prefix){return allVoices().filter(v=>String(v.lang||'').toLowerCase().startsWith(prefix.toLowerCase()))}
function chooseThai(gender){
  const xs=langVoices('th');
  if(!xs.length)return null;
  const re=gender==='male'?thaiMale:thaiFemale;
  return xs.find(v=>re.test(v.name||'')) || (gender==='male'&&xs.length>1?xs[xs.length-1]:xs[0]);
}
function chooseEnglishMale(){const xs=langVoices('en');return xs.find(v=>enMale.test(v.name||''))||xs[0]||null}
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
 .replace(/subject/gi,'ซับเจกต์')
 .replace(/auxiliary/gi,'กริยาช่วย')
 .replace(/verb form/gi,'รูปกริยา')
 .replace(/verb/gi,'เวิร์บ')
 .replace(/noun/gi,'นาวน์')
 .replace(/adjective/gi,'แอดเจกทีฟ')
 .replace(/adverb/gi,'แอดเวิร์บ')
 .replace(/connector/gi,'คอนเน็กเตอร์')
 .replace(/clue/gi,'คลู')
 .replace(/\bam\b/gi,'แอม').replace(/\bis\b/gi,'อิส').replace(/\bare\b/gi,'อาร์').replace(/\bbe\b/gi,'บี');}
function speakThai(text,gender='female'){
 try{
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(thaiText(text));
  u.lang='th-TH';u.rate=.86;u.pitch=gender==='female'?1.06:.88;
  const v=chooseThai(gender);if(v)u.voice=v;
  speechSynthesis.speak(u);
 }catch{}
}
function speakEnglish(text){
 try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text||''));u.lang='en-US';u.rate=.78;u.pitch=.9;const v=chooseEnglishMale();if(v)u.voice=v;speechSynthesis.speak(u)}catch{}
}
async function directImage(path){
 if(imageCache[path])return imageCache[path];
 imageCache[path]=fetch(path+'?v=79b',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('image '+r.status);return r.text()}).then(t=>{
  const m=t.match(/href=["'](data:image\/(?:jpeg|jpg|png);base64,[^"']+)["']/i);
  return m?.[1]||path;
 }).catch(()=>path);
 return imageCache[path];
}
function fallback(label,bg){return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="150" height="218"><rect width="150" height="218" rx="24" fill="${bg}"/><circle cx="75" cy="72" r="36" fill="#fff" opacity=".9"/><text x="75" y="82" text-anchor="middle" font-size="40">☺</text><text x="75" y="145" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="700" fill="#0f172a">${label}</text></svg>`)}
async function fixImages(box){
 const may=box.querySelector('.v79-person.may img'),pete=box.querySelector('.v79-person.pete img');
 if(may){may.src=fallback('ครูเมย์','#fce7f3');may.style.objectFit='cover';const src=await directImage('teacher-may-v79.svg');if(document.body.contains(may))may.src=src}
 if(pete){pete.src=fallback('พีท','#dbeafe');pete.style.objectFit='cover';const src=await directImage('student-pete-v79.svg');if(document.body.contains(pete))pete.src=src}
}
function dayFromLesson(){const t=document.querySelector('#lessonV77 .v77-head small')?.textContent||'';return +(t.match(/L(\d+)/i)?.[1]||1)}
function currentExample(){const d=window.getCurriculumLessonV76?.(dayFromLesson())||window.getGrammarToeicV76?.(dayFromLesson());return d?.lesson?.teachingPairs?.[0]?.en||''}
function autoOn(){try{return localStorage.getItem(AUTO)!=='0'}catch{return true}}
function stripPete(box){let el=box.querySelector('.v79-pete');if(!el)return'';let clone=el.cloneNode(true);clone.querySelectorAll('button').forEach(b=>b.remove());return clone.textContent.replace(/^\s*พีททบทวน:\s*/,'').trim()}
function cloneBind(box,sel,fn){const old=box.querySelector(sel);if(!old)return null;const n=old.cloneNode(true);old.replaceWith(n);n.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();fn(n)});return n}
function patch(box){
 if(!box||box.dataset.v79b==='1')return;box.dataset.v79b='1';
 try{speechSynthesis.cancel()}catch{}
 fixImages(box);
 const mayText=box.querySelector('.v79-bubble p')?.textContent?.trim()||'';
 const peteText=stripPete(box);
 cloneBind(box,'[data-may]',()=>speakThai(mayText,'female'));
 cloneBind(box,'[data-pete]',()=>speakThai(peteText,'male'));
 cloneBind(box,'[data-en]',()=>speakEnglish(currentExample()));
 cloneBind(box,'[data-stop]',()=>{try{speechSynthesis.cancel()}catch{}});
 const autoBtn=cloneBind(box,'[data-auto]',btn=>{const on=autoOn();try{localStorage.setItem(AUTO,on?'0':'1')}catch{}btn.textContent=!on?'🔊 บรรยายอัตโนมัติ: เปิด':'🔇 บรรยายอัตโนมัติ: ปิด'});
 if(autoBtn)autoBtn.textContent=autoOn()?'🔊 บรรยายอัตโนมัติ: เปิด':'🔇 บรรยายอัตโนมัติ: ปิด';
 if(autoOn())setTimeout(()=>{if(document.body.contains(box))speakThai(mayText,'female')},260);
}
function scan(){document.querySelectorAll('.v79-narrator').forEach(patch)}
const ob=new MutationObserver(()=>requestAnimationFrame(scan));ob.observe(document.documentElement,{childList:true,subtree:true});
scan();
try{speechSynthesis.addEventListener?.('voiceschanged',()=>{})}catch{}
window.V79B_NARRATOR_FIX={version:V,thaiOnlyNarration:true,directCharacterImages:true,genderMappedThaiVoices:true,oldAutoDisabled:true};
})();