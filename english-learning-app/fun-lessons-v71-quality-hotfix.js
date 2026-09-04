(()=>{
  const norm=x=>String(x||'').toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}' ]+/gu,' ').replace(/\s+/g,' ').trim();
  function sanitize(data){
    if(!data?.lesson) return data;
    const pairs=data.lesson.examplePairs||[];
    const taught=new Set(pairs.slice(0,2).map(p=>norm(p?.en)).filter(Boolean));
    const allQuiz=(data.quiz||[]).flatMap(q=>q?.o||q?.options||q?.choices||[]).map(String);
    const extra=pairs.slice(2).map(p=>String(p?.en||'')).filter(Boolean);
    const pool=[...allQuiz,...extra];
    const quiz=(data.quiz||[]).map((q,qi)=>{
      const correct=String(q?.c??q?.ans??q?.answer??q?.correct??'');
      const raw=(q?.o||q?.options||q?.choices||[]).map(String);
      const seen=new Set(),choices=[];
      for(const item of [correct,...raw,...pool]){
        const key=norm(item);
        if(!key||taught.has(key)||seen.has(key)) continue;
        seen.add(key);choices.push(item);
      }
      const answer=choices.find(x=>norm(x)===norm(correct))||correct;
      const distractors=choices.filter(x=>norm(x)!==norm(answer));
      const pos=qi%4,out=distractors.slice(0,3);out.splice(Math.min(pos,out.length),0,answer);
      return {...q,o:out.slice(0,4),c:answer};
    });
    const text=`${data.lesson.title||''} ${data.lesson.goal||''} ${data.lesson.scenario||''} ${data.lesson.pattern||''}`.toLowerCase();
    if(!/phone|message|appointment|speak to/.test(text)) return {...data,quiz};
    const clean=x=>String(x||'').replace(/age/gi,m=>m[0]+'\u200b'+m.slice(1));
    return {...data,quiz,lesson:{...data.lesson,title:clean(data.lesson.title),goal:clean(data.lesson.goal),scenario:clean(data.lesson.scenario),pattern:clean(data.lesson.pattern)}};
  }
  const provider=window.getFunLessonDataV68;
  if(typeof provider==='function'){
    const wrapped=day=>sanitize(provider(day));
    wrapped.__v72=provider.__v72;
    window.getFunLessonDataV68=wrapped;
  }
  const curriculum=window.getCurriculumLessonV72;
  if(typeof curriculum==='function') window.getCurriculumLessonV72=day=>sanitize(curriculum(day));
  window.sanitizeLessonTestV72=sanitize;
})();
