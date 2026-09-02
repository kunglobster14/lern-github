(()=>{
  const EXTRA={restaurant:{label:'🍽️ ร้านอาหาร',opening:'Hello! Welcome to the restaurant. What would you like to order?',hint:'ลองตอบ: I would like chicken and rice, please.'},shopping:{label:'🛍️ ซื้อของ',opening:'Hello! Can I help you find something?',hint:'ลองตอบ: How much is this?'},hotel:{label:'🏨 โรงแรม',opening:'Hello! Welcome to the hotel. How can I help you?',hint:'ลองตอบ: I have a reservation.'},airport:{label:'🛫 สนามบิน',opening:'Hello! How can I help you at the airport today?',hint:'ลองตอบ: Where is gate twelve?'}};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  function normalize(){try{Object.assign(scenarios,EXTRA);if(!scenarios[state.scenario])state.scenario='daily';if(!Array.isArray(state.chat))state.chat=[]}catch{}}
  function releaseModalLayer(){
    let hadModal=false;
    document.querySelectorAll('dialog[open],#gameLabModal').forEach(d=>{
      if(d.id==='profileDialog'&&!d.open)return;
      hadModal=true;
      try{if(typeof d.close==='function'&&d.open)d.close()}catch{}
      if(d.id==='gameLabModal')try{d.remove()}catch{}
    });
    document.querySelectorAll('.app-shell,#app,.bottom-nav,.topbar').forEach(el=>{try{el.inert=false}catch{}el.removeAttribute('inert');if(el.getAttribute('aria-hidden')==='true')el.removeAttribute('aria-hidden')});
    document.documentElement.classList.remove('game-open');
    document.body?.classList.remove('game-open');
    return hadModal;
  }
  function afterModalRelease(fn){
    const hadModal=releaseModalLayer();
    if(!hadModal)return fn();
    requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>{releaseModalLayer();fn()},0)));
    return true;
  }
  function template(){normalize();const sc=scenarios[state.scenario];const msgs=state.chat.length?state.chat:[{role:'ai',text:sc.opening,thai:'เริ่มจากประโยคสั้น ๆ ได้เลย ไม่ต้องกลัวผิด'}];return `<section class="glass-card chat-shell"><div class="ai-head"><div class="ai-avatar">✦</div><div><h2>AI Coach</h2><p><span class="status-dot"></span>English partner • พูดช้าและช่วยแก้ให้</p></div></div><div class="scenario-row">${Object.entries(scenarios).map(([k,v])=>`<button class="scenario ${k===state.scenario?'active':''}" data-ai-scenario="${k}" type="button">${v.label}</button>`).join('')}</div><div class="messages" id="messages">${msgs.map(m=>`<div class="bubble ${m.role==='user'?'user':'ai'}">${esc(m.text)}${m.thai?`<span class="thai">${esc(m.thai)}</span>`:''}</div>`).join('')}</div><div class="example"><b>💡 ตัวช่วย</b><small>${esc(sc.hint)}</small></div><form class="chat-form" id="chatForm"><button class="mic-btn" id="micBtn" type="button">🎙️</button><input class="chat-input" id="chatInput" autocomplete="off" placeholder="พิมพ์อังกฤษหรือไทยก็ได้..." ${aiBusy?'disabled':''}><button class="send-btn" type="submit" ${aiBusy?'disabled':''}>➤</button></form></section>`}
  function renderAI(){normalize();window.__gameLabV31?.close?.();releaseModalLayer();view='ai';document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view==='ai'));const app=document.querySelector('#app');if(!app)return false;app.innerHTML=template();app.querySelectorAll('[data-ai-scenario]').forEach(b=>b.onclick=()=>change(b.dataset.aiScenario));app.querySelector('#chatForm').onsubmit=send;app.querySelector('#micBtn').onclick=()=>{try{startListening()}catch{}};try{saveState()}catch{};requestAnimationFrame(()=>{const m=document.querySelector('#messages');if(m)m.scrollTop=m.scrollHeight});return true}
  function enter(opts={}){normalize();if(opts.mission){const text=String(opts.mission.text||'');if(text&&!state.chat.some(m=>m.role==='ai'&&String(m.text||'').includes(text)))state.chat.push({role:'ai',text:`🎯 Mission: ${text}`,thai:String(opts.mission.thai||'ลองทำภารกิจนี้แล้วส่งคำตอบมาให้ฉันตรวจ')})}try{history.replaceState(null,'',(()=>{const u=new URL(location.href);u.searchParams.set('view','ai');return u})())}catch{};return afterModalRelease(renderAI)}
  function change(key){normalize();key=scenarios[key]?key:'daily';state.scenario=key;state.chat=[{role:'ai',text:scenarios[key].opening,thai:'เลือกสถานการณ์ใหม่แล้ว ลองตอบเป็นอังกฤษดูครับ'}];saveState();renderAI()}
  async function online(message){const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),12000);try{const r=await fetch('/api/ai',{method:'POST',headers:{'content-type':'application/json'},signal:ctrl.signal,body:JSON.stringify({message,scenario:state.scenario,name:state.name,history:state.chat.slice(-10)})});if(!r.ok)throw new Error('AI unavailable');const d=await r.json();if(!d?.text)throw new Error('Invalid AI response');return d}finally{clearTimeout(timer)}}
  async function send(e){e?.preventDefault?.();if(aiBusy)return;const input=document.querySelector('#chatInput');const text=String(input?.value||'').trim();if(!text)return;state.chat.push({role:'user',text});state.chat=state.chat.slice(-16);aiBusy=true;saveState();renderAI();let reply;try{reply=await online(text)}catch{reply=typeof localCoach==='function'?localCoach(text):{text:'Good try! Please tell me one more short sentence.',thai:'ตอนนี้ใช้ Local Coach ชั่วคราว ลองตอบอีกหนึ่งประโยคสั้น ๆ'}}state.chat.push({role:'ai',text:String(reply.text||''),thai:String(reply.thai||'')});state.chat=state.chat.slice(-16);state.xp=(Number(state.xp)||0)+2;window.__gameLabV31?.addProgress?.('ai',1);aiBusy=false;saveState();renderAI();try{if(reply.text)speak(reply.text)}catch{}}
  normalize();
  const originalGo=typeof go==='function'?go:null;
  if(originalGo)go=function(next){if(next==='ai')return enter();releaseModalLayer();const u=new URL(location.href);u.searchParams.delete('view');try{history.replaceState(null,'',u)}catch{}return originalGo(next)};
  document.addEventListener('click',e=>{const nav=e.target instanceof Element?e.target.closest('.nav-btn[data-view]'):null;if(nav&&nav.dataset.view!=='ai')releaseModalLayer()},true);
  try{sendChat=send;changeScenario=change}catch{}
  const boot=()=>{normalize();if(new URL(location.href).searchParams.get('view')==='ai')setTimeout(()=>enter(),0)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  window.__aiCoreV31={enter,render:renderAI,send,releaseModalLayer,version:'31.1'};
})();