(()=>{
  const VERSION='v60';
  const previousGet=window.getDailyLesson;
  if(typeof previousGet!=='function')return;
  const norm=v=>String(v||'').toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const levels=cefr=>['A1','A2','B1','B2'].filter(x=>String(cefr||'').includes(x));
  const uniqBy=(arr,key)=>{const s=new Set();return arr.filter(x=>{const k=key(x);if(!k||s.has(k))return false;s.add(k);return true})};
  let rows=[],ready=false,map=new Map(),loading=null;

  function readRows(){
    let list=[];try{list=window.getOxford3000?.()||[]}catch{}
    return (Array.isArray(list)?list:[]).map((r,i)=>({id:r.id??i+1,word:String(r.word||'').trim(),thai:String(r.thai||'').trim(),level:String(r.level||'').toUpperCase(),example:String(r.example||'').trim(),exampleThai:String(r.exampleThai||'').trim()})).filter(r=>r.word&&r.thai&&r.example&&r.exampleThai);
  }
  async function ensure(){
    if(ready&&rows.length)return rows;if(loading)return loading;
    loading=(async()=>{try{if(typeof window.ensureOxford3000==='function')await window.ensureOxford3000()}catch{}rows=readRows();ready=rows.length>0;if(ready)rebuild();return rows})().finally(()=>loading=null);return loading;
  }
  function score(row,terms){const w=norm(row.word),ex=` ${norm(row.example)} `;let n=0;terms.forEach((t,i)=>{if(w===t)n+=100-i*5;if(t.length>2&&ex.includes(` ${t} `))n+=20-i});return n}
  function unused(row,used){return !used.words.has(norm(row.word))&&!used.examples.has(norm(row.example))}
  function choosePrimary(allowed,terms,day,used){
    const ranked=allowed.map(r=>({r,s:score(r,terms)})).sort((a,b)=>b.s-a.s||(Number(a.r.id)||0)-(Number(b.r.id)||0));
    const exact=ranked.filter(x=>x.s>=80&&unused(x.r,used));if(exact.length)return exact[(day-1)%exact.length].r;
    const related=ranked.filter(x=>x.s>0&&unused(x.r,used));if(related.length)return related[(day*7)%related.length].r;
    const rest=ranked.filter(x=>unused(x.r,used));return rest[(day*17)%Math.max(1,rest.length)]?.r||ranked[0]?.r||null;
  }
  function buildOne(base,day,used){
    const allowedSet=new Set(levels(base.cefr)),allowed=rows.filter(r=>!allowedSet.size||allowedSet.has(r.level));
    const terms=uniqBy((base.vocab||[]).map(v=>norm(v.en)).filter(Boolean),x=>x).slice(0,10),primary=choosePrimary(allowed,terms,day,used);
    if(!primary)return {...base,contentVersion:'v60-pending'};
    used.words.add(norm(primary.word));used.examples.add(norm(primary.example));
    const ranked=allowed.filter(r=>String(r.id)!==String(primary.id)).map(r=>({r,s:score(r,terms)})).sort((a,b)=>b.s-a.s||(Number(a.r.id)||0)-(Number(b.r.id)||0));
    const companions=[];const seenWords=new Set([norm(primary.word)]),seenExamples=new Set([norm(primary.example)]);
    for(const {r} of ranked){const w=norm(r.word),e=norm(r.example);if(seenWords.has(w)||seenExamples.has(e))continue;companions.push(r);seenWords.add(w);seenExamples.add(e);if(companions.length>=8)break}
    const rowPool=[primary,...companions];
    const baseVocab=(base.vocab||[]).map(v=>({en:v.en,th:v.th,source:v.source||'course'}));
    let vocab=uniqBy([{en:primary.word,th:primary.thai,source:'oxford-v60',oxfordId:primary.id},...baseVocab.slice(0,2),...rowPool.slice(1).map(r=>({en:r.word,th:r.thai,source:'oxford-v60',oxfordId:r.id}))],v=>norm(v.en));
    if(vocab.length<6){for(const r of allowed){if(vocab.some(v=>norm(v.en)===norm(r.word)))continue;vocab.push({en:r.word,th:r.thai,source:'oxford-v60',oxfordId:r.id});if(vocab.length>=6)break}}
    vocab=vocab.slice(0,6);
    let pairRows=uniqBy(rowPool,r=>norm(r.example));
    if(pairRows.length<4){for(const r of allowed){if(pairRows.some(x=>norm(x.example)===norm(r.example)))continue;pairRows.push(r);if(pairRows.length>=4)break}}
    pairRows=pairRows.slice(0,4);
    const examplePairs=pairRows.map(r=>({en:r.example,th:r.exampleThai,word:r.word,wordThai:r.thai,id:r.id}));
    const examples=examplePairs.map(p=>p.en);
    const title=`${String(base.title||'').replace(/\s*·\s*[^·]+$/,'')} · ${primary.word}`;
    const goal=`${String(base.goal||'').replace(/\s*·\s*(?:โฟกัสการใช้|บทนี้เน้น).*$/,'')} · ฝึก “${primary.word}” (${primary.thai}) ด้วยประโยคใหม่ของบทเรียนนี้`;
    const scenario=`${String(base.scenario||'').replace(/\s*·\s*(?:ฝึกใช้|ใช้).*$/,'')} · นำ ${primary.word} ไปใช้จริงในบริบทนี้`;
    const prompt=`ฟังและพูด “${primary.example}” (${primary.exampleThai}) แล้วแต่งประโยคของคุณเองด้วย ${primary.word}`;
    return {...base,title,goal,scenario,prompt,vocab,examples,example:examples[0],examplePairs,focusWord:{en:primary.word,th:primary.thai,source:'oxford-v60',oxfordId:primary.id},contentVersion:VERSION};
  }
  function rebuild(){
    const used={words:new Set(),examples:new Set()},next=new Map();for(let day=1;day<=210;day++)next.set(day,buildOne(previousGet(day),day,used));map=next;
    setTimeout(()=>{patchCard();patchMini();window.patchLearningExperienceV55?.();document.dispatchEvent(new CustomEvent('curriculum-v60:ready',{detail:{lessons:210}}))},0);
  }
  function getLesson(day){const n=Math.max(1,Math.min(210,Number(day)||Number(window.getDailyCourseProgress?.().currentDay)||1));return map.get(n)||previousGet(n)}
  window.getDailyLesson=getLesson;

  function patchCard(){
    const card=document.querySelector('#dailyCourseCard');if(!card)return;const l=getLesson(window.getDailyCourseProgress?.().currentDay);if(!l)return;
    const title=card.querySelector('.daily-today-main h3'),goal=card.querySelector('.daily-today-main p'),pattern=card.querySelector('.daily-pattern b'),vocab=card.querySelector('.daily-vocab');
    if(title)title.textContent=l.title;if(goal)goal.textContent=l.goal;if(pattern)pattern.textContent=l.pattern;if(vocab)vocab.innerHTML=l.vocab.map(v=>`<span><b>${esc(v.en)}</b> ${esc(v.th)}</span>`).join('');window.patchLessonTerminologyV58?.();
  }
  function patchMini(day){
    const d=document.querySelector('#lessonExperienceV55');if(!d)return;const l=getLesson(day||window.getDailyCourseProgress?.().currentDay),examples=(l.examples||[]).filter(Boolean),correct=examples[1]||examples[0]||'',pair=(l.examplePairs||[]).find(p=>norm(p.en)===norm(correct)),thai=pair?.th||'';
    const section=d.querySelector('[data-act="dialog"]');if(!section)return;const h=section.querySelector('header h2'),p=section.querySelector('header p'),bubble=section.querySelector('.lx55-bubble.other');
    if(h)h.textContent='Mini Response · เลือกประโยคให้ตรงความหมาย';if(p)p.textContent='อ่านความหมายภาษาไทย แล้วเลือกประโยคอังกฤษที่ตรงกัน';if(bubble)bubble.textContent=thai?`สถานการณ์: คุณต้องการพูดว่า “${thai}”`:`สถานการณ์: ${l.scenario}`;const q=bubble?.nextElementSibling;if(q)q.textContent=thai?'ประโยคไหนตรงกับความหมายนี้?':'ประโยคไหนเหมาะกับสถานการณ์นี้มากที่สุด?';section.dataset.v60='coherent';window.patchLessonTerminologyV58?.();
  }
  window.addEventListener('click',e=>{const t=e.target instanceof Element?e.target:null,trigger=t?.closest?.('#dailyOpenLesson,[data-choose-day],[data-skill-lesson]');if(!trigger)return;const day=Number(trigger.dataset.chooseDay||trigger.dataset.skillLesson||window.getDailyCourseProgress?.().currentDay)||1;setTimeout(()=>patchMini(day),20);setTimeout(()=>patchMini(day),120)},true);
  const prevOpen=window.openDailyLesson;if(typeof prevOpen==='function')window.openDailyLesson=(day)=>{const out=prevOpen(day);setTimeout(()=>patchMini(day),20);setTimeout(()=>patchMini(day),120);return out};
  document.addEventListener('app:rendered',()=>setTimeout(patchCard,0));document.addEventListener('daily-course:changed',()=>setTimeout(patchCard,0));document.addEventListener('learner-level:changed',()=>setTimeout(patchCard,0));
  setTimeout(()=>ensure().then(()=>{patchCard();patchMini()}),0);
  window.auditCurriculumV60=()=>{const lessons=Array.from({length:210},(_,i)=>getLesson(i+1)),p=new Map(),w=new Map(),dupExamples=[],dupFocus=[];lessons.forEach(l=>{const e=norm(l.examples?.[0]),f=norm(l.focusWord?.en);if(p.has(e))dupExamples.push([p.get(e),l.day]);else p.set(e,l.day);if(w.has(f))dupFocus.push([w.get(f),l.day]);else w.set(f,l.day)});return {version:VERSION,totalLessons:210,distinctPrimaryExamples:p.size,distinctFocusWords:w.size,duplicatePrimaryExamples:dupExamples,duplicateFocusWords:dupFocus}};
  window.CURRICULUM_VARIETY_VERSION=VERSION;
})();
