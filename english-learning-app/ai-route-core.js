(()=>{
  try{
    if(typeof scenarios==='object'&&scenarios){
      Object.assign(scenarios,{
        restaurant:{label:'🍽️ ร้านอาหาร',opening:'Hello! Welcome to the restaurant. What would you like to order?',hint:'ลองตอบ: I would like chicken and rice, please.'},
        shopping:{label:'🛍️ ซื้อของ',opening:'Hello! Can I help you find something?',hint:'ลองตอบ: How much is this? หรือ Do you have a larger size?'},
        hotel:{label:'🏨 โรงแรม',opening:'Hello! Welcome to the hotel. How can I help you?',hint:'ลองตอบ: I have a reservation.'},
        airport:{label:'🛫 สนามบิน',opening:'Hello! How can I help you at the airport today?',hint:'ลองตอบ: Where is gate twelve?'}
      });
    }
  }catch{}

  function closeBlocking(){
    document.querySelector('#gameLabModal')?.remove();
    document.querySelector('#learningGuideModal')?.remove();
  }

  function normalizeScenario(){
    try{
      if(typeof state!=='undefined'&&state){
        if(typeof scenarios!=='object'||!scenarios||!scenarios[state.scenario])state.scenario='daily';
      }
    }catch{}
  }

  function bindAiDom(){
    try{
      const app=document.querySelector('#app');
      app?.querySelectorAll('[data-scenario]').forEach(b=>b.onclick=()=>{try{changeScenario(b.dataset.scenario)}catch{}});
      app?.querySelector('#chatForm')?.addEventListener('submit',sendChat);
      app?.querySelector('#micBtn')?.addEventListener('click',startListening);
      const m=document.querySelector('#messages');if(m)m.scrollTop=m.scrollHeight;
      const input=document.querySelector('#chatInput');if(input&&!input.disabled)setTimeout(()=>input.focus(),50);
    }catch{}
  }

  function enterAI(){
    closeBlocking();normalizeScenario();
    try{
      if(typeof go==='function'){
        go('ai');
        if(document.querySelector('#chatForm')){bindAiDom();return true;}
      }
    }catch{}
    try{
      if(typeof view!=='undefined')view='ai';
      const app=document.querySelector('#app');
      if(app&&typeof aiView==='function'){
        app.innerHTML=aiView();
        document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view==='ai'));
        bindAiDom();
        return Boolean(document.querySelector('#chatForm'));
      }
    }catch{}
    return false;
  }

  function acceptMission(){
    try{
      const mission=state?.gameLab?.aiMission;
      if(!mission)return;
      state.chat=Array.isArray(state.chat)?state.chat:[];
      const text=String(mission.text||'Complete today’s English mission.');
      if(!state.chat.some(m=>m?.role==='ai'&&String(m?.text||'').includes(text))){
        state.chat.push({role:'ai',text:`🎯 Mission: ${text}`,thai:String(mission.thai||'ลองทำภารกิจนี้เป็นภาษาอังกฤษ แล้วส่งคำตอบมาให้ฉันช่วยตรวจ')});
      }
      state.chat=state.chat.slice(-16);
      state.gameLab.rewarded=state.gameLab.rewarded||{};
      if(!state.gameLab.rewarded.aiMissionAccepted){state.gameLab.rewarded.aiMissionAccepted=true;state.xp=(Number(state.xp)||0)+15;}
      if(typeof saveState==='function')saveState();
    }catch{}
  }

  document.addEventListener('click',event=>{
    const t=event.target?.closest?.('#missionGo,#missionClose,.game-close,[data-go="ai"],.nav-btn[data-view="ai"]');
    if(!t)return;
    if(t.id==='missionClose'||t.matches('.game-close')){
      event.preventDefault();event.stopImmediatePropagation();closeBlocking();return;
    }
    event.preventDefault();event.stopImmediatePropagation();
    if(t.id==='missionGo')acceptMission();
    enterAI();
  },true);

  window.__enterAI=enterAI;
})();