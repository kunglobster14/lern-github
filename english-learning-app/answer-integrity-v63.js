(()=>{
  const VERSION='v63';
  const norm=v=>String(v||'').toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
  const uniqBy=(arr,key)=>{const seen=new Set();return arr.filter(x=>{const k=key(x);if(!k||seen.has(k))return false;seen.add(k);return true})};
  const progress=()=>window.getDailyCourseProgress?.()||{currentDay:1};
  const instituteOpen=window.INSTITUTE_COURSE_VERSION==='v62'&&typeof window.openDailyLesson==='function'?window.openDailyLesson:null;
  let lookupCache=null;

  function answerLookup(){
    if(lookupCache)return lookupCache;
    const map=new Map();
    for(let day=1;day<=210;day++){
      const l=window.getDailyLesson?.(day);if(!l)continue;
      (l.vocab||[]).forEach(v=>{if(v?.en&&v?.th)map.set(norm(v.en),String(v.th).trim())});
      (l.examplePairs||[]).forEach(p=>{if(p?.en&&p?.th)map.set(norm(p.en),String(p.th).trim())});
    }
    lookupCache=map;return map;
  }

  function spec(day){
    day=Math.max(1,Math.min(210,Number(day)||1));
    const lesson=window.getDailyLesson?.(day),vocab=(lesson?.vocab||[]).filter(v=>v?.en&&v?.th).slice(0,6);
    if(!vocab.length)return null;
    const quizWord=vocab[(day+1)%vocab.length];
    const wrong=uniqBy(vocab.filter(v=>norm(v.en)!==norm(quizWord.en)),v=>norm(v.th)).slice(0,3);
    return {day,quizWord,choices:[quizWord,...wrong],lesson};
  }

  function answerLabel(q,id){
    const key=norm(id),lookup=answerLookup(),known=lookup.get(key);if(known)return known;
    const answer=String(q?.answer||'').trim();
    if(q?.type==='wordMeaning'&&answer.includes('='))return answer.split('=').slice(1).join('=').trim()||String(id||'').trim();
    if(['englishThai','listening'].includes(q?.type)&&answer.includes('·'))return answer.split('·').slice(1).join('·').trim()||String(id||'').trim();
    if(q?.type==='gap'&&answer.includes('·'))return answer.split('·')[0].trim()||String(id||'').trim();
    return String(id||'').trim();
  }

  function sanitizeQuestion(q){
    q=q||{};const correct=String(q.correct||''),seen=new Set(),options=[];
    (Array.isArray(q.options)?q.options:[]).forEach(o=>{
      const id=String(o?.id||'').trim();if(!id||seen.has(id))return;seen.add(id);
      const label=String(o?.label||'').trim()||answerLabel(q,id);
      options.push({...o,id,label});
    });
    if(correct&&!seen.has(correct))options.push({id:correct,label:answerLabel(q,correct)});
    const correctOption=options.find(o=>o.id===correct);if(correctOption&&!String(correctOption.label||'').trim())correctOption.label=answerLabel(q,correct);
    return {...q,options};
  }

  function dialogDay(d){
    const text=d?.querySelector?.('.lx55-head small')?.textContent||'';
    const m=text.match(/(?:บทเรียน|DAY|Day)\s*(\d+)/i);
    return Number(m?.[1])||Number(progress().currentDay)||1;
  }

  function repairInstituteQuestions(root=document){
    let repaired=0;
    root.querySelectorAll?.('.v62-question[data-correct]').forEach(group=>{
      const correct=String(group.dataset.correct||'').trim(),answer=String(group.dataset.answer||'').trim(),buttons=[...group.querySelectorAll('[data-opt]')];
      const pseudo={correct,answer,type:group.querySelector('[data-listen]')?'listening':''};
      buttons.forEach(btn=>{if(!String(btn.textContent||'').trim()){btn.textContent=answerLabel(pseudo,btn.dataset.opt);repaired++}});
      if(correct&&!buttons.some(btn=>String(btn.dataset.opt)===correct)){
        const box=group.querySelector('.v62-options');if(box){const btn=document.createElement('button');btn.type='button';btn.dataset.opt=correct;btn.textContent=answerLabel(pseudo,correct);btn.onclick=()=>{group.querySelectorAll('[data-opt]').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected')};box.appendChild(btn);repaired++}
      }
    });
    const d=root.querySelector?.('#instituteLessonV62')||document.querySelector('#instituteLessonV62');if(d)d.dataset.answerIntegrityV63='checked';
    return repaired;
  }

  function repairLegacy(day){
    const d=document.querySelector('#lessonExperienceV55');if(!d)return false;
    day=Number(day)||dialogDay(d);
    if(instituteOpen&&window.INSTITUTE_COURSE_VERSION==='v62'){
      try{if(d.open)d.close()}catch{}d.remove();
      instituteOpen(day);setTimeout(()=>repairInstituteQuestions(document),0);
      return 'redirected';
    }
    const promptWord=String(d.querySelector('.lx55-quiz p b')?.textContent||'').trim(),lesson=window.getDailyLesson?.(day),vocab=(lesson?.vocab||[]).filter(v=>v?.en&&v?.th),fallback=spec(day);
    const target=vocab.find(v=>norm(v.en)===norm(promptWord))||fallback?.quizWord;
    const buttons=[...d.querySelectorAll('.lx55-quiz [data-meaning]')];
    if(!target||!buttons.length)return false;
    let correct=buttons.find(b=>norm(b.dataset.meaning)===norm(target.en));
    if(!correct){correct=buttons[0];correct.dataset.meaning=target.en;correct.textContent=target.th}
    const choices=[target,...uniqBy(vocab.filter(v=>norm(v.en)!==norm(target.en)),v=>norm(v.th)).slice(0,3)],used=new Set();
    buttons.forEach(b=>{
      let label=norm(b.textContent);
      if(!label||used.has(label)){
        const replacement=choices.find(c=>!used.has(norm(c.th)));
        if(replacement){b.dataset.meaning=replacement.en;b.textContent=replacement.th;label=norm(replacement.th)}
      }
      if(label)used.add(label);
    });
    d.dataset.answerIntegrityV63='fixed';
    return true;
  }

  if(instituteOpen){
    window.openDailyLesson=day=>{document.querySelector('#lessonExperienceV55')?.remove();const result=instituteOpen(day);setTimeout(()=>repairInstituteQuestions(document),0);return result};
  }
  const schedule=day=>setTimeout(()=>{repairLegacy(day);repairInstituteQuestions(document)},0);
  document.addEventListener('app:rendered',()=>schedule(progress().currentDay));
  document.addEventListener('daily-course:changed',()=>{lookupCache=null;schedule(progress().currentDay)});
  document.addEventListener('learner-level:changed',()=>{lookupCache=null;schedule(progress().currentDay)});
  window.addEventListener('click',e=>{
    const t=e.target instanceof Element?e.target:null;if(!t)return;
    const trigger=t.closest?.('#dailyOpenLesson,[data-choose-day],[data-skill-lesson],[data-v62-lesson]');if(!trigger)return;
    const day=Number(trigger.dataset.v62Lesson||trigger.dataset.chooseDay||trigger.dataset.skillLesson||progress().currentDay)||1;
    schedule(day);
  },true);
  setTimeout(()=>{repairLegacy(progress().currentDay);repairInstituteQuestions(document)},250);

  function audit(){
    const missingCorrect=[],duplicateLabels=[],missingData=[];
    for(let day=1;day<=210;day++){
      const s=spec(day);
      if(!s){missingData.push(day);continue}
      if(!s.choices.some(c=>norm(c.en)===norm(s.quizWord.en)))missingCorrect.push(day);
      if(new Set(s.choices.map(c=>norm(c.th))).size!==s.choices.length)duplicateLabels.push(day);
      if(!String(s.quizWord.th||'').trim())missingData.push(day);
    }
    return {version:VERSION,totalLessons:210,legacyQuickChecks:210-missingData.length,missingCorrect,duplicateLabels,missingData,allCorrect:missingCorrect.length===0&&missingData.length===0};
  }
  window.getSafeQuickCheckSpecV63=spec;
  window.sanitizeAssessmentQuestionV63=sanitizeQuestion;
  window.repairInstituteQuestionsV63=repairInstituteQuestions;
  window.auditAnswerIntegrityV63=audit;
  window.ANSWER_INTEGRITY_VERSION=VERSION;
})();
