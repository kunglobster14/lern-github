(()=>{
  const VERSION='v63';
  const norm=v=>String(v||'').toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
  const uniqBy=(arr,key)=>{const seen=new Set();return arr.filter(x=>{const k=key(x);if(!k||seen.has(k))return false;seen.add(k);return true})};
  const progress=()=>window.getDailyCourseProgress?.()||{currentDay:1};
  const instituteOpen=window.INSTITUTE_COURSE_VERSION==='v62'&&typeof window.openDailyLesson==='function'?window.openDailyLesson:null;

  function spec(day){
    day=Math.max(1,Math.min(210,Number(day)||1));
    const lesson=window.getDailyLesson?.(day),vocab=(lesson?.vocab||[]).filter(v=>v?.en&&v?.th).slice(0,6);
    if(!vocab.length)return null;
    const quizWord=vocab[(day+1)%vocab.length];
    const wrong=uniqBy(vocab.filter(v=>norm(v.en)!==norm(quizWord.en)),v=>norm(v.th)).slice(0,3);
    return {day,quizWord,choices:[quizWord,...wrong],lesson};
  }

  function dialogDay(d){
    const text=d?.querySelector?.('.lx55-head small')?.textContent||'';
    const m=text.match(/(?:บทเรียน|DAY|Day)\s*(\d+)/i);
    return Number(m?.[1])||Number(progress().currentDay)||1;
  }

  function repairLegacy(day){
    const d=document.querySelector('#lessonExperienceV55');if(!d)return false;
    day=Number(day)||dialogDay(d);
    if(instituteOpen&&window.INSTITUTE_COURSE_VERSION==='v62'){
      try{if(d.open)d.close()}catch{}d.remove();
      instituteOpen(day);
      return 'redirected';
    }
    const promptWord=String(d.querySelector('.lx55-quiz p b')?.textContent||'').trim(),lesson=window.getDailyLesson?.(day),vocab=(lesson?.vocab||[]).filter(v=>v?.en&&v?.th),fallback=spec(day);
    const target=vocab.find(v=>norm(v.en)===norm(promptWord))||fallback?.quizWord;
    const buttons=[...d.querySelectorAll('.lx55-quiz [data-meaning]')];
    if(!target||!buttons.length)return false;
    let correct=buttons.find(b=>norm(b.dataset.meaning)===norm(target.en));
    if(!correct){correct=buttons[0];correct.dataset.meaning=target.en;correct.textContent=target.th}
    const choices=[target,...uniqBy(vocab.filter(v=>norm(v.en)!==norm(target.en)),v=>norm(v.th)).slice(0,3)],used=new Set();
    buttons.forEach((b,i)=>{
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
    window.openDailyLesson=day=>{document.querySelector('#lessonExperienceV55')?.remove();return instituteOpen(day)};
  }
  const schedule=day=>setTimeout(()=>repairLegacy(day),0);
  document.addEventListener('app:rendered',()=>schedule(progress().currentDay));
  document.addEventListener('daily-course:changed',()=>schedule(progress().currentDay));
  window.addEventListener('click',e=>{
    const t=e.target instanceof Element?e.target:null;if(!t)return;
    const trigger=t.closest?.('#dailyOpenLesson,[data-choose-day],[data-skill-lesson]');if(!trigger)return;
    const day=Number(trigger.dataset.chooseDay||trigger.dataset.skillLesson||progress().currentDay)||1;
    schedule(day);
  },true);
  setTimeout(()=>repairLegacy(progress().currentDay),250);

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
  window.auditAnswerIntegrityV63=audit;
  window.ANSWER_INTEGRITY_VERSION=VERSION;
})();
