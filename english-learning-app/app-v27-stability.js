(()=>{
  const VALID_SCENARIOS={
    restaurant:{label:'🍽️ ร้านอาหาร',opening:'Hello! Welcome to the restaurant. What would you like to order?',hint:'ลองตอบ: I would like chicken and rice, please.'},
    shopping:{label:'🛍️ ซื้อของ',opening:'Hello! Can I help you find something?',hint:'ลองตอบ: How much is this? หรือ Do you have a larger size?'},
    hotel:{label:'🏨 โรงแรม',opening:'Hello! Welcome to the hotel. How can I help you?',hint:'ลองตอบ: I have a reservation.'},
    airport:{label:'🛫 สนามบิน',opening:'Hello! How can I help you at the airport today?',hint:'ลองตอบ: Where is gate twelve?'}
  };
  try{if(typeof scenarios==='object'&&scenarios)Object.assign(scenarios,VALID_SCENARIOS)}catch{}
  function normalize(){try{if(typeof state!=='undefined'&&state&&(!scenarios||!scenarios[state.scenario])){state.scenario='daily';if(typeof saveState==='function')saveState()}}catch{}}
  function closeGame(){document.querySelector('#gameLabModal')?.remove()}
  document.addEventListener('click',e=>{
    const close=e.target?.closest?.('.game-close,#missionClose,[data-plus-close]');
    if(close){closeGame();e.preventDefault();e.stopImmediatePropagation();return}
    const nav=e.target?.closest?.('.nav-btn[data-view],[data-go]');
    if(nav&&document.querySelector('#gameLabModal'))closeGame();
  },true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeGame()});
  normalize();
  const oldAiView=typeof aiView==='function'?aiView:null;
  if(oldAiView){aiView=function(){normalize();return oldAiView()}}
  const oldChange=typeof changeScenario==='function'?changeScenario:null;
  if(oldChange){changeScenario=function(key){normalize();if(!scenarios[key])key='daily';return oldChange(key)}}
  const oldGo=typeof go==='function'?go:null;
  if(oldGo){go=function(next){closeGame();normalize();return oldGo(next)}}
  const oldRequest=typeof requestAI==='function'?requestAI:null;
  if(oldRequest){requestAI=async function(...args){const timeout=new Promise((_,reject)=>setTimeout(()=>reject(new Error('ai_timeout')),12000));return Promise.race([oldRequest.apply(this,args),timeout])}}
})();