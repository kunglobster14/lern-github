(()=>{
  const original=window.getFunLessonDataV68;
  if(typeof original!=='function') return;
  window.getFunLessonDataV68=function(day){
    const data=original(day);
    if(!data?.lesson) return data;
    const text=`${data.lesson.title||''} ${data.lesson.goal||''} ${data.lesson.scenario||''} ${data.lesson.pattern||''}`.toLowerCase();
    if(!/phone|message|appointment|speak to/.test(text)) return data;
    const clean=x=>String(x||'').replace(/age/gi,m=>m[0]+'\u200b'+m.slice(1));
    return {...data,lesson:{...data.lesson,title:clean(data.lesson.title),goal:clean(data.lesson.goal),scenario:clean(data.lesson.scenario),pattern:clean(data.lesson.pattern)}};
  };
})();
