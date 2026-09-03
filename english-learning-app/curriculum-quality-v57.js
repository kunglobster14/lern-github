(()=>{
  const VERSION='v57';
  const originalGet=window.getDailyLesson;
  if(typeof originalGet!=='function')return;
  const CEFR=['A1','A2','B1','B2'];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=v=>String(v||'').toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
  const uniqBy=(arr,key)=>{const seen=new Set();return arr.filter(x=>{const k=key(x);if(!k||seen.has(k))return false;seen.add(k);return true})};
  const levelsFor=cefr=>{const hit=CEFR.filter(x=>String(cefr||'').includes(x));return hit.length?hit:['A1']};
  const oxford=()=>{try{return typeof window.getOxford3000==='function'?window.getOxford3000():[]}catch{return[]}};
  function allowedRows(base){
    const allowed=new Set(levelsFor(base.cefr));
    return oxford().filter(r=>r&&allowed.has(String(r.level||'').toUpperCase())&&String(r.word||'').trim()&&String(r.thai||'').trim()&&String(r.example||'').trim());
  }
  function relatedRows(base,allowed){
    const terms=uniqBy((base.vocab||[]).map(v=>norm(v.en)).filter(Boolean),x=>x);
    return allowed.filter(r=>{const word=norm(r.word),example=` ${norm(r.example)} `;return terms.includes(word)||terms.some(t=>t.length>2&&example.includes(` ${t} `))});
  }
  function takeWindow(pool,seed,count){
    if(!pool.length)return[];
    const sorted=[...pool].sort((a,b)=>(Number(a.id)||0)-(Number(b.id)||0)||String(a.word).localeCompare(String(b.word)));
    const out=[];let idx=Math.abs(seed)%sorted.length,step=17;
    for(let i=0;i<sorted.length&&out.length<count;i++){const row=sorted[(idx+i*step)%sorted.length];if(!out.some(x=>String(x.id)===String(row.id)))out.push(row)}
    return out;
  }
  function decorate(base){
    if(!base||base.contentVersion===VERSION)return base;
    const allowed=allowedRows(base),related=relatedRows(base,allowed),extra=takeWindow(related,Number(base.day)*97+31,5);
    const baseVocab=(base.vocab||[]).map(v=>({en:v.en,th:v.th,source:'course'}));
    const focusWord=baseVocab[0]||{en:'practice',th:'ฝึก',source:'course'};
    const mixed=uniqBy([
      ...baseVocab.slice(0,4),
      ...extra.map(r=>({en:r.word,th:r.th,source:'oxford-related',oxfordId:r.id})),
      ...baseVocab.slice(4)
    ],v=>norm(v.en)).slice(0,6);
    const typeIndex=(Number(base.day)-1)%7,extraExamples=extra.map(r=>r.example).filter(Boolean);
    const primary=typeIndex<2?base.example:(extraExamples[0]||base.example);
    const examplePool=uniqBy([
      primary,
      ...extraExamples,
      base.example,
      ...(base.examples||[])
    ].filter(Boolean),x=>norm(x));
    const examples=examplePool.slice(0,4);
    const focusThai=focusWord.th?` (${focusWord.th})`:'';
    const goal=`${base.goal} · โฟกัสการใช้ “${focusWord.en}”${focusThai}`;
    const scenario=`${base.scenario} · ฝึกใช้ ${focusWord.en} ในบริบทของบทนี้`;
    const prompt=`${base.prompt} · ใช้คำ ${focusWord.en} และอย่างน้อย 1 ประโยคใหม่จากตัวอย่างของบทนี้`;
    return {...base,goal,scenario,prompt,vocab:mixed,examples,example:examples[0]||base.example,focusWord,contentVersion:VERSION};
  }
  function getLesson(day){return decorate(originalGet(day))}
  window.getDailyLesson=getLesson;
  function quickCheckSpec(day){
    const l=getLesson(day),vocab=(l?.vocab||[]).slice(0,6);if(!vocab.length)return null;
    const quizWord=vocab[(Number(day)+1)%vocab.length];
    const wrong=uniqBy(vocab.filter(v=>norm(v.en)!==norm(quizWord.en)),v=>norm(v.th)).slice(0,3);
    const choices=[quizWord,...wrong];
    return {quizWord,choices};
  }
  function fixQuickCheck(day){
    const d=document.querySelector('#lessonExperienceV55');if(!d)return false;
    const spec=quickCheckSpec(day||window.getDailyCourseProgress?.().currentDay);if(!spec)return false;
    const buttons=[...d.querySelectorAll('.lx55-quiz [data-meaning]')];if(!buttons.length)return false;
    const correct=buttons.find(b=>norm(b.dataset.meaning)===norm(spec.quizWord.en));
    if(!correct){const b=buttons[0];b.dataset.meaning=spec.quizWord.en;b.textContent=spec.quizWord.th}
    const seen=new Set();buttons.forEach((b,i)=>{const label=norm(b.textContent);if(seen.has(label)&&spec.choices[i]){b.dataset.meaning=spec.choices[i].en;b.textContent=spec.choices[i].th}seen.add(norm(b.textContent))});
    d.dataset.quickCheckV57='fixed';
    return true;
  }
  const originalOpen=window.openDailyLesson;
  if(typeof originalOpen==='function')window.openDailyLesson=(day)=>{const out=originalOpen(day);setTimeout(()=>fixQuickCheck(day),0);return out};
  window.addEventListener('click',e=>{
    const t=e.target instanceof Element?e.target:null;if(!t)return;
    const trigger=t.closest('#dailyOpenLesson,[data-choose-day],[data-skill-lesson]');if(!trigger)return;
    const day=Number(trigger.dataset.chooseDay||trigger.dataset.skillLesson||window.getDailyCourseProgress?.().currentDay)||1;
    setTimeout(()=>fixQuickCheck(day),0);
  },true);
  function patchCard(){
    const card=document.querySelector('#dailyCourseCard');if(!card)return;
    const day=window.getDailyCourseProgress?.().currentDay,l=getLesson(day);if(!l)return;
    const title=card.querySelector('.daily-today-main h3'),goal=card.querySelector('.daily-today-main p'),pattern=card.querySelector('.daily-pattern b'),vocab=card.querySelector('.daily-vocab');
    if(title)title.textContent=l.title;if(goal)goal.textContent=l.goal;if(pattern)pattern.textContent=l.pattern;
    if(vocab)vocab.innerHTML=l.vocab.map(v=>`<span><b>${esc(v.en)}</b> ${esc(v.th)}</span>`).join('');
  }
  function coreSignature(l){return JSON.stringify([l.goal,l.pattern,l.scenario,[...(l.vocab||[])].map(v=>norm(v.en)).sort(),(l.examples||[]).map(norm)])}
  function audit(){
    const seen=new Map(),duplicates=[];
    for(let day=1;day<=210;day++){const l=getLesson(day),sig=coreSignature(l);if(seen.has(sig))duplicates.push([seen.get(sig),day]);else seen.set(sig,day)}
    return {version:VERSION,totalLessons:210,distinctCoreSignatures:seen.size,duplicatePairs:duplicates,quickChecksWithCorrectChoice:Array.from({length:210},(_,i)=>quickCheckSpec(i+1)).filter(x=>x&&x.choices.some(c=>norm(c.en)===norm(x.quizWord.en))).length};
  }
  document.addEventListener('app:rendered',()=>setTimeout(patchCard,0));
  document.addEventListener('daily-course:changed',()=>setTimeout(patchCard,0));
  document.addEventListener('learner-level:changed',()=>setTimeout(patchCard,0));
  setTimeout(()=>{patchCard();window.patchLearningExperienceV55?.()},50);
  window.getQuickCheckSpecV57=quickCheckSpec;
  window.auditDailyCourseV57=audit;
  window.CURRICULUM_QUALITY_VERSION=VERSION;
})();