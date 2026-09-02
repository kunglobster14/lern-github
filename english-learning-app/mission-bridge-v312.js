(()=>{
  const KEY='myEnglishPendingMissionV31';

  function savePendingMission(){
    let mission=null;
    try{mission=state?.gameLab?.aiMission||null}catch{}
    try{sessionStorage.setItem(KEY,JSON.stringify(mission||{}))}catch{}
    try{
      if(typeof state!=='undefined'&&state){
        state.xp=(Number(state.xp)||0)+15;
        if(typeof saveState==='function')saveState();
      }
    }catch{}
    return mission;
  }

  function hardEnterAI(){
    try{window.__gameLabV31?.close?.()}catch{}
    const u=new URL(location.href);
    u.searchParams.set('view','ai');
    u.searchParams.set('fromMission','1');
    location.assign(u.toString());
  }

  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target.closest('#missionGo'):null;
    if(!target)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    savePendingMission();
    hardEnterAI();
  },true);

  function restoreMission(){
    const u=new URL(location.href);
    if(u.searchParams.get('view')!=='ai'||u.searchParams.get('fromMission')!=='1')return;
    let mission=null;
    try{
      const raw=sessionStorage.getItem(KEY);
      if(raw)mission=JSON.parse(raw);
      sessionStorage.removeItem(KEY);
    }catch{}
    u.searchParams.delete('fromMission');
    try{history.replaceState(null,'',u)}catch{}
    const enter=()=>{
      try{window.__gameLabV31?.close?.()}catch{}
      if(window.__aiCoreV31?.enter){window.__aiCoreV31.enter(mission?{mission}:{});return true}
      return false;
    };
    setTimeout(()=>{if(!enter())setTimeout(enter,80)},60);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',restoreMission,{once:true});else restoreMission();
  window.__missionBridgeV312={version:'31.2'};
})();
