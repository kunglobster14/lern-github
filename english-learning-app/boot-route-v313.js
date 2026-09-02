(()=>{
  const EXTRA={
    restaurant:{label:'🍽️ ร้านอาหาร',opening:'Hello! Welcome to the restaurant. What would you like to order?',hint:'ลองตอบ: I would like chicken and rice, please.'},
    shopping:{label:'🛍️ ซื้อของ',opening:'Hello! Can I help you find something?',hint:'ลองตอบ: How much is this?'},
    hotel:{label:'🏨 โรงแรม',opening:'Hello! Welcome to the hotel. How can I help you?',hint:'ลองตอบ: I have a reservation.'},
    airport:{label:'🛫 สนามบิน',opening:'Hello! How can I help you at the airport today?',hint:'ลองตอบ: Where is gate twelve?'}
  };
  try{Object.assign(scenarios,EXTRA)}catch{}
  try{if(!scenarios[state.scenario]){state.scenario='daily';saveState()}}catch{}
  let requested='';
  try{requested=new URL(location.href).searchParams.get('view')||''}catch{}
  if(requested==='ai'){
    try{go('ai')}catch{}
  }
  window.__bootRouteV313={version:'31.3',requested};
})();
