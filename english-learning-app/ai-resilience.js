(()=>{
  const TIMEOUT_MS=12000;

  if(typeof requestAI==='function'){
    const originalRequestAI=requestAI;
    requestAI=async function(...args){
      let timer;
      try{
        return await Promise.race([
          originalRequestAI.apply(this,args),
          new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('ai_request_timeout')),TIMEOUT_MS)})
        ]);
      }finally{clearTimeout(timer)}
    };
  }

  function clearBlockingOverlays(){
    document.querySelector('#gameLabModal')?.remove();
    document.querySelector('#learningGuideModal')?.remove();
  }

  document.addEventListener('click',event=>{
    const target=event.target?.closest?.('[data-go="ai"],#guideGoAI,#missionGo');
    if(!target)return;
    if(target.id!=='missionGo')clearBlockingOverlays();
    setTimeout(()=>{
      if(typeof view!=='undefined'&&view==='ai'){
        const input=document.querySelector('#chatInput');
        if(input&&!input.disabled)input.focus();
      }
    },120);
  },true);

  document.addEventListener('submit',event=>{
    if(event.target?.id!=='chatForm')return;
    const started=Date.now();
    setTimeout(()=>{
      try{
        if(typeof view==='undefined'||view!=='ai'||typeof aiBusy==='undefined'||!aiBusy)return;
        if(Date.now()-started<TIMEOUT_MS)return;
        aiBusy=false;
        if(typeof render==='function')render();
        const input=document.querySelector('#chatInput');
        if(input){input.disabled=false;input.focus()}
      }catch{}
    },TIMEOUT_MS+800);
  },true);
})();
