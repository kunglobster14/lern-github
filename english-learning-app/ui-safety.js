(()=>{
  const closeGame=()=>document.querySelector('#gameLabModal')?.remove();
  const closeGuide=()=>document.querySelector('#learningGuideModal')?.remove();

  function acceptMission(){
    try{
      const mission=state?.gameLab?.aiMission;
      if(mission){
        state.chat=Array.isArray(state.chat)?state.chat:[];
        const exists=state.chat.some(m=>m?.role==='ai'&&String(m?.text||'').includes(String(mission.text||'')));
        if(!exists)state.chat.push({role:'ai',text:`🎯 Mission: ${String(mission.text||'Complete today’s English mission.')}`,thai:String(mission.thai||'ลองทำภารกิจนี้เป็นภาษาอังกฤษ แล้วส่งคำตอบมาให้ฉันช่วยตรวจ')});
        state.chat=state.chat.slice(-16);
        state.gameLab.rewarded=state.gameLab.rewarded||{};
        if(!state.gameLab.rewarded.aiMissionAccepted){state.gameLab.rewarded.aiMissionAccepted=true;state.xp=(Number(state.xp)||0)+15}
        if(typeof saveState==='function')saveState();
      }
    }catch{}
  }

  function goSafe(next){
    closeGame();closeGuide();
    try{if(typeof go==='function'){go(next);return true}}catch{}
    try{view=next;if(typeof render==='function'){render();return true}}catch{}
    return false;
  }

  document.addEventListener('click',event=>{
    const t=event.target?.closest?.('button,[data-go],[data-view]');
    if(!t)return;

    if(t.matches('.game-close,#missionClose')){
      event.preventDefault();event.stopImmediatePropagation();closeGame();return;
    }
    if(t.id==='missionGo'){
      event.preventDefault();event.stopImmediatePropagation();acceptMission();closeGame();goSafe('ai');setTimeout(()=>document.querySelector('#chatInput')?.focus(),80);return;
    }
    if(t.matches('.learning-guide-close,#learningGuideClose')){
      event.preventDefault();event.stopImmediatePropagation();closeGuide();return;
    }

    const nav=t.closest('.nav-btn[data-view]');
    if(nav&&document.querySelector('#gameLabModal')){
      event.preventDefault();event.stopImmediatePropagation();goSafe(nav.dataset.view);return;
    }
  },true);

  document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeGame();closeGuide()}});

  window.__uiSafety={go:goSafe,closeGame,closeGuide};
})();
