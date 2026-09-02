(()=>{
  const AI_VALUE='ai';

  function withView(value){
    const u=new URL(location.href);
    if(value)u.searchParams.set('view',value);else u.searchParams.delete('view');
    return `${u.pathname}${u.search}${u.hash}`;
  }
  const aiHref=()=>withView(AI_VALUE);
  const homeHref=()=>withView('');

  function enrichScenarios(){
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
  }

  function normalizeScenario(){
    enrichScenarios();
    try{
      if(typeof state!=='undefined'&&state&&(!scenarios||!scenarios[state.scenario])){
        state.scenario='daily';
        if(typeof saveState==='function')saveState();
      }
    }catch{}
  }

  function closeBlocking(){
    document.querySelector('#gameLabModal')?.remove();
    document.querySelector('#learningGuideModal')?.remove();
  }

  function bindAiDom(){
    try{
      const app=document.querySelector('#app');
      app?.querySelectorAll('[data-scenario]').forEach(b=>b.onclick=()=>{try{changeScenario(b.dataset.scenario)}catch{}});
      const form=app?.querySelector('#chatForm');
      if(form&&!form.dataset.routeBound){form.dataset.routeBound='1';form.addEventListener('submit',sendChat)}
      const mic=app?.querySelector('#micBtn');
      if(mic&&!mic.dataset.routeBound){mic.dataset.routeBound='1';mic.addEventListener('click',startListening)}
      const messages=document.querySelector('#messages');if(messages)messages.scrollTop=messages.scrollHeight;
      const input=document.querySelector('#chatInput');if(input&&!input.disabled)setTimeout(()=>input.focus(),40);
    }catch{}
  }

  function enterAI(){
    closeBlocking();normalizeScenario();
    try{
      if(typeof go==='function'){
        go('ai');
        if(document.querySelector('#chatForm')){bindAiDom();return true}
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
      if(!state.gameLab.rewarded.aiMissionAccepted){
        state.gameLab.rewarded.aiMissionAccepted=true;
        state.xp=(Number(state.xp)||0)+15;
      }
      if(typeof saveState==='function')saveState();
    }catch{}
  }

  function replaceWithLink(el,href){
    if(!el||el.tagName==='A'){
      if(el)el.href=href;
      return el;
    }
    const a=document.createElement('a');
    [...el.attributes].forEach(attr=>{if(attr.name!=='type')a.setAttribute(attr.name,attr.value)});
    a.href=href;
    a.innerHTML=el.innerHTML;
    a.style.textDecoration='none';
    a.style.boxSizing='border-box';
    el.replaceWith(a);
    return a;
  }

  function upgradeNativeFallbacks(root=document){
    try{
      root.querySelectorAll?.('[data-go="ai"],.nav-btn[data-view="ai"],#guideGoAI,#missionGo').forEach(el=>replaceWithLink(el,aiHref()));
      const modal=root.querySelector?.('#gameLabModal')||document.querySelector('#gameLabModal');
      const title=(modal?.querySelector('.game-panel-head h2')?.textContent||'').toLowerCase();
      if(modal&&title.includes('ai surprise mission')){
        modal.querySelectorAll('#missionClose,.game-close').forEach(el=>replaceWithLink(el,homeHref()));
      }
    }catch{}
  }

  document.addEventListener('click',event=>{
    const t=event.target?.closest?.('#missionGo,#missionClose,.game-close,[data-go="ai"],.nav-btn[data-view="ai"],#guideGoAI');
    if(!t)return;
    const modal=t.closest('#gameLabModal');
    const modalTitle=(modal?.querySelector('.game-panel-head h2')?.textContent||'').toLowerCase();
    if((t.id==='missionClose'||t.matches('.game-close'))&&modalTitle.includes('ai surprise mission')){
      closeBlocking();
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if(t.id==='missionGo')acceptMission();
    const ok=enterAI();
    if(ok){
      try{history.replaceState(null,'',aiHref())}catch{}
      event.preventDefault();
    }else if(t.tagName!=='A'){
      location.assign(aiHref());
      event.preventDefault();
    }
    event.stopImmediatePropagation();
  },true);

  const observer=new MutationObserver(records=>{
    for(const r of records){
      for(const n of r.addedNodes){if(n.nodeType===1)upgradeNativeFallbacks(n)}
    }
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});

  enrichScenarios();
  upgradeNativeFallbacks();
  const bootRoute=()=>{
    upgradeNativeFallbacks();
    if(new URL(location.href).searchParams.get('view')===AI_VALUE){
      if(!enterAI())setTimeout(enterAI,150);
    }
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootRoute,{once:true});else setTimeout(bootRoute,0);
  window.__enterAI=enterAI;
})();
