(()=>{
  const VERSION='v58';
  const term=text=>String(text??'')
    .replace(/\b(?:DAY|Day)\s+(\d+)\s*[–-]\s*(\d+)\b/g,'บทเรียนที่ $1–$2')
    .replace(/\b(?:DAY|Day)\s+(\d+)\b/g,'บทเรียนที่ $1')
    .replace(/\b(?:DAY|Day)\s+ถัดไป\b/g,'บทเรียนถัดไป')
    .replace(/\b(?:DAY|Day)\s+ปัจจุบัน\b/g,'บทเรียนปัจจุบัน')
    .replace(/\b(?:DAY|Day)\s+นี้\b/g,'บทเรียนนี้')
    .replace(/\b(?:DAY|Day)\s+ของ\b/g,'บทเรียนของ')
    .replace(/\b(?:DAY|Day)\b/g,'บทเรียน');

  const SKIP=new Set(['SCRIPT','STYLE','TEXTAREA','CODE','PRE']);
  function patchNode(root){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
      const p=node.parentElement;
      if(!p||SKIP.has(p.tagName))return NodeFilter.FILTER_REJECT;
      return /\b(?:DAY|Day)\b/.test(node.nodeValue||'')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
    }});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{n.nodeValue=term(n.nodeValue)});
    root.querySelectorAll?.('[aria-label],[title],[placeholder]').forEach(el=>{
      for(const a of ['aria-label','title','placeholder'])if(el.hasAttribute(a)){const v=el.getAttribute(a);if(/\b(?:DAY|Day)\b/.test(v||''))el.setAttribute(a,term(v))}
    });
  }
  function patchAll(){
    const roots=['#dailyCourseCard','#dailyChooserModal','#dailyLessonModal','#lessonExperienceV55','#skillRoadmapV55','#learnerLevelSetup','#learnerLevelHelp','#profileDialog'];
    roots.forEach(sel=>document.querySelectorAll(sel).forEach(patchNode));
    document.querySelectorAll('.learner-level-card,.learner-level-help,.daily-course-card,.sr55').forEach(patchNode);
  }
  function schedule(){requestAnimationFrame(()=>patchAll());setTimeout(patchAll,40);setTimeout(patchAll,160)}
  document.addEventListener('app:rendered',schedule);
  document.addEventListener('daily-course:changed',schedule);
  document.addEventListener('learner-level:changed',schedule);
  document.addEventListener('click',()=>{setTimeout(patchAll,0);setTimeout(patchAll,90)},true);
  const originalOpen=window.openDailyLesson;
  if(typeof originalOpen==='function')window.openDailyLesson=(...args)=>{const out=originalOpen(...args);schedule();return out};
  setTimeout(schedule,80);setTimeout(patchAll,700);
  window.toLessonTerminologyV58=term;
  window.patchLessonTerminologyV58=patchAll;
  window.TERMINOLOGY_VERSION=VERSION;
})();
