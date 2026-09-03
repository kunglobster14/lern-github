(()=>{
  let busy=false;
  const fallback={text:'Say three sentences about your day.',thai:'พูด 3 ประโยคสั้น ๆ เกี่ยวกับวันนี้'};

  function cleanup(){
    try{window.__gameLabV31?.close?.()}catch{}
    document.querySelectorAll('#gameLabModal').forEach(d=>{
      try{if(d.open&&d.close)d.close()}catch{}
      try{d.remove()}catch{}
    });
    document.querySelectorAll('.app-shell,#app,.bottom-nav,.topbar').forEach(el=>{
      try{el.inert=false}catch{}
      el.removeAttribute('inert');
      if(el.getAttribute('aria-hidden')==='true')el.removeAttribute('aria-hidden');
    });
  }

  async function fetchMission(){
    const ctrl=new AbortController();
    const timer=setTimeout(()=>ctrl.abort(),9000);
    try{
      const r=await fetch('./api/ai',{method:'POST',headers:{'content-type':'application/json'},signal:ctrl.signal,body:JSON.stringify({mode:'mission',level:typeof level==='function'?level():1,name:state?.name||'ผู้เรียน',scenario:state?.scenario||'daily',message:'Create one short English mission'})});
      if(!r.ok)throw new Error('mission unavailable');
      const data=await r.json();
      return{text:String(data?.text||fallback.text),thai:String(data?.thai||fallback.thai)};
    }catch{return fallback}
    finally{clearTimeout(timer)}
  }

  async function openMission(){
    if(busy)return;
    busy=true;
    cleanup();
    const token=`mission_${Date.now()}`;
    try{
      if(!Array.isArray(state.chat))state.chat=[];
      state.chat.push({role:'ai',text:'🎯 AI Surprise Mission',thai:'กำลังสร้างภารกิจ...',missionToken:token});
      state.chat=state.chat.slice(-16);
      saveState();
      view='ai';
      if(typeof setNav==='function')setNav('ai');
      render();

      const mission=await fetchMission();
      const index=state.chat.findIndex(m=>m?.missionToken===token);
      const message={role:'ai',text:`🎯 Mission: ${mission.text}`,thai:mission.thai};
      if(index>=0)state.chat[index]=message;else state.chat.push(message);
      state.chat=state.chat.slice(-16);
      state.gameLab=state.gameLab&&typeof state.gameLab==='object'?state.gameLab:{};
      state.gameLab.aiMission={date:new Date().toLocaleDateString('en-CA'),text:mission.text,thai:mission.thai};
      state.xp=(Number(state.xp)||0)+15;
      saveState();
      if(view==='ai')render();
    }finally{busy=false}
  }

  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target.closest('[data-game="mission"]'):null;
    if(!target)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openMission();
  },true);

  window.__aiMissionCoreV33={open:openMission,version:'33'};
})();