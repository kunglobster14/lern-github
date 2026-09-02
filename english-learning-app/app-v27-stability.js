(()=>{
  const EXTRA_SCENARIOS={
    restaurant:{label:'🍽️ ร้านอาหาร',opening:'Hello! Welcome to the restaurant. What would you like to order?',hint:'ลองตอบ: I would like chicken and rice, please.'},
    shopping:{label:'🛍️ ซื้อของ',opening:'Hello! Can I help you find something?',hint:'ลองตอบ: How much is this? หรือ Do you have a larger size?'},
    hotel:{label:'🏨 โรงแรม',opening:'Hello! Welcome to the hotel. How can I help you?',hint:'ลองตอบ: I have a reservation.'},
    airport:{label:'🛫 สนามบิน',opening:'Hello! How can I help you at the airport today?',hint:'ลองตอบ: Where is gate twelve?'}
  };

  function normalizeScenario(){
    try{
      if(typeof scenarios==='object'&&scenarios)Object.assign(scenarios,EXTRA_SCENARIOS);
      if(typeof state!=='undefined'&&state&&(!scenarios||!scenarios[state.scenario])){
        state.scenario='daily';
        if(typeof saveState==='function')saveState();
      }
    }catch{}
  }

  function closeGame(){
    const modal=document.querySelector('#gameLabModal');
    if(modal)modal.remove();
    document.documentElement.classList.remove('game-open');
    document.body?.classList.remove('game-open');
  }

  function bindAiView(){
    const app=document.querySelector('#app');
    if(!app)return false;
    app.querySelectorAll('[data-scenario]').forEach(btn=>{
      btn.onclick=()=>stableChangeScenario(btn.dataset.scenario);
    });
    const form=app.querySelector('#chatForm');
    if(form)form.onsubmit=stableSendChat;
    const mic=app.querySelector('#micBtn');
    if(mic)mic.onclick=()=>{try{startListening()}catch{}};
    requestAnimationFrame(()=>{
      const messages=document.querySelector('#messages');
      if(messages)messages.scrollTop=messages.scrollHeight;
      const input=document.querySelector('#chatInput');
      if(input&&!input.disabled)input.focus();
    });
    return Boolean(form);
  }

  function enterAI(){
    closeGame();
    normalizeScenario();
    try{
      if(typeof view!=='undefined')view='ai';
      document.querySelectorAll('.nav-btn[data-view]').forEach(btn=>btn.classList.toggle('active',btn.dataset.view==='ai'));
      const app=document.querySelector('#app');
      if(!app||typeof aiView!=='function')return false;
      app.innerHTML=aiView();
      if(typeof saveState==='function')saveState();
      return bindAiView();
    }catch(err){
      console.error('AI navigation failed',err);
      return false;
    }
  }

  function stableChangeScenario(key){
    normalizeScenario();
    try{
      const safe=scenarios&&scenarios[key]?key:'daily';
      state.scenario=safe;
      state.chat=[{role:'ai',text:scenarios[safe].opening,thai:'เลือกสถานการณ์ใหม่แล้ว ลองตอบเป็นอังกฤษดูครับ'}];
      if(typeof saveState==='function')saveState();
      enterAI();
    }catch(err){console.error('Scenario change failed',err)}
  }

  async function stableSendChat(event){
    event?.preventDefault?.();
    if(typeof aiBusy!=='undefined'&&aiBusy)return;
    const input=document.querySelector('#chatInput');
    const text=String(input?.value||'').trim();
    if(!text)return;
    try{
      state.chat=Array.isArray(state.chat)?state.chat:[];
      state.chat.push({role:'user',text});
      state.chat=state.chat.slice(-16);
      if(input)input.value='';
      aiBusy=true;
      if(typeof saveState==='function')saveState();
      enterAI();
      let reply;
      try{reply=await requestAI(text)}catch{reply=typeof localCoach==='function'?localCoach(text):{text:'Good try! Please try one more short sentence.',thai:'ลองอีกครั้งด้วยประโยคสั้น ๆ ได้เลย'}}
      state.chat.push({role:'ai',text:String(reply?.text||''),thai:String(reply?.thai||'')});
      state.chat=state.chat.slice(-16);
      state.xp=(Number(state.xp)||0)+2;
      try{if(reply?.text&&typeof speak==='function')speak(reply.text)}catch{}
    }catch(err){console.error('AI send failed',err)}
    finally{
      aiBusy=false;
      try{if(typeof saveState==='function')saveState()}catch{}
      enterAI();
    }
  }

  function acceptMission(){
    try{
      const mission=state?.gameLab?.aiMission;
      if(!mission)return;
      state.chat=Array.isArray(state.chat)?state.chat:[];
      const text=String(mission.text||'Complete today’s English mission.');
      if(!state.chat.some(m=>m?.role==='ai'&&String(m?.text||'').includes(text))){
        state.chat.push({role:'ai',text:`🎯 Mission: ${text}`,thai:String(mission.thai||'ลองทำภารกิจนี้เป็นภาษาอังกฤษ แล้วส่งคำตอบมาให้ฉันช่วยตรวจ')});
        state.chat=state.chat.slice(-16);
        if(typeof saveState==='function')saveState();
      }
    }catch{}
  }

  document.addEventListener('click',event=>{
    const target=event.target;
    if(!(target instanceof Element))return;

    const close=target.closest('.game-close,#missionClose,[data-plus-close],#labDone');
    if(close&&close.closest('#gameLabModal')){
      event.preventDefault();
      event.stopImmediatePropagation();
      closeGame();
      return;
    }
    if(target.id==='gameLabModal'){
      event.preventDefault();
      event.stopImmediatePropagation();
      closeGame();
      return;
    }

    const ai=target.closest('.nav-btn[data-view="ai"],[data-go="ai"],#missionGo,#guideGoAI');
    if(ai){
      event.preventDefault();
      event.stopImmediatePropagation();
      if(ai.id==='missionGo')acceptMission();
      if(!enterAI()){
        const u=new URL(location.href);
        u.searchParams.set('view','ai');
        location.assign(u.toString());
      }
      return;
    }

    const nav=target.closest('.nav-btn[data-view]');
    if(nav&&document.querySelector('#gameLabModal'))closeGame();
  },true);

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&document.querySelector('#gameLabModal')){
      event.preventDefault();
      closeGame();
    }
  },true);

  normalizeScenario();

  try{
    if(typeof requestAI==='function'&&!requestAI.__v29Wrapped){
      const original=requestAI;
      const wrapped=async function(...args){
        let timer;
        const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('ai_timeout')),12000)});
        try{return await Promise.race([original.apply(this,args),timeout])}finally{clearTimeout(timer)}
      };
      wrapped.__v29Wrapped=true;
      requestAI=wrapped;
    }
  }catch{}

  try{sendChat=stableSendChat}catch{}
  try{changeScenario=stableChangeScenario}catch{}

  const boot=()=>{
    normalizeScenario();
    if(new URL(location.href).searchParams.get('view')==='ai')setTimeout(enterAI,0);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();

  window.__appStability={enterAI,closeGame,version:'29'};
})();