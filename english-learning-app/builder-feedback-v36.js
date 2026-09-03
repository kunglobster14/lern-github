(()=>{
  function patchBuilder(dialog){
    if(!dialog||dialog.id!=='gameLabModal')return;
    const title=dialog.querySelector('.game-panel-head h2')?.textContent||'';
    if(!title.includes('Sentence Builder'))return;
    const check=dialog.querySelector('#check');
    if(!check||check.dataset.builderFeedback==='1')return;
    const original=check.onclick;
    if(typeof original!=='function')return;
    check.dataset.builderFeedback='1';
    check.onclick=function(event){
      const answer=String(dialog.querySelector('#answer')?.textContent||'').trim();
      original.call(this,event);
      if(dialog.querySelector('.game-finish')){
        try{if(answer&&typeof speak==='function')speak(answer)}catch{}
        return;
      }
      let feedback=dialog.querySelector('#builderFeedback');
      if(!feedback){
        feedback=document.createElement('div');
        feedback.id='builderFeedback';
        feedback.setAttribute('role','status');
        feedback.style.cssText='margin:12px 0 0;padding:12px 14px;border-radius:12px;background:rgba(239,68,68,.12);border:1px solid rgba(248,113,113,.45);color:#fecaca;font-weight:800;text-align:center';
        const actions=dialog.querySelector('.lab-actions');
        (actions?.parentNode||dialog.querySelector('#gameLabBody'))?.insertBefore(feedback,actions||null);
      }
      feedback.textContent='❌ ผิด — ลองเรียงใหม่';
    };
  }
  const scan=()=>document.querySelectorAll('#gameLabModal').forEach(patchBuilder);
  const observer=new MutationObserver(()=>requestAnimationFrame(scan));
  observer.observe(document.body,{childList:true,subtree:true});
  requestAnimationFrame(scan);
})();
