(()=>{
  function acceptMission(){
    try{
      const mission=state?.gameLab?.aiMission;
      if(!mission)return false;

      state.chat=Array.isArray(state.chat)?state.chat:[];
      const alreadyShown=state.chat.some(m=>m?.role==='ai'&&String(m?.text||'').includes(String(mission.text||'')));
      if(!alreadyShown){
        state.chat.push({
          role:'ai',
          text:`🎯 Mission: ${String(mission.text||'Complete today’s English mission.')}`,
          thai:String(mission.thai||'ลองทำภารกิจนี้เป็นภาษาอังกฤษ แล้วส่งคำตอบมาให้ฉันช่วยตรวจ')
        });
        state.chat=state.chat.slice(-16);
      }

      state.gameLab.rewarded=state.gameLab.rewarded||{};
      if(!state.gameLab.rewarded.aiMissionAccepted){
        state.gameLab.rewarded.aiMissionAccepted=true;
        state.xp=(Number(state.xp)||0)+15;
      }
      saveState();
      return true;
    }catch{return false}
  }

  document.addEventListener('click',event=>{
    const button=event.target?.closest?.('#missionGo');
    if(!button)return;

    event.preventDefault();
    event.stopImmediatePropagation();

    acceptMission();
    document.querySelector('#gameLabModal')?.remove();

    try{
      go('ai');
    }catch{
      try{view='ai';render()}catch{}
    }

    setTimeout(()=>{
      document.querySelector('#chatInput')?.focus();
      const messages=document.querySelector('#messages');
      if(messages)messages.scrollTop=messages.scrollHeight;
    },80);
  },true);
})();
