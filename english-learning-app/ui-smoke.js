(()=>{
  function test(){
    const checks=[];
    const add=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail});
    try{add('go()',typeof go==='function')}catch{add('go()',false)}
    try{add('render()',typeof render==='function')}catch{add('render()',false)}
    try{add('home',typeof homeView==='function'&&/AI Conversation Coach/.test(homeView()))}catch(e){add('home',false,String(e))}
    try{add('learn',typeof learnView==='function'&&/Vocabulary Flow/.test(learnView()))}catch(e){add('learn',false,String(e))}
    try{add('ai',typeof aiView==='function'&&/chatForm/.test(aiView()))}catch(e){add('ai',false,String(e))}
    try{add('review',typeof reviewView==='function'&&String(reviewView()).length>20)}catch(e){add('review',false,String(e))}
    try{add('progress',typeof progressView==='function'&&/Your Progress/.test(progressView()))}catch(e){add('progress',false,String(e))}
    try{add('quiz',typeof quizView==='function'&&String(quizView()).length>20)}catch(e){add('quiz',false,String(e))}
    try{const nav=[...document.querySelectorAll('.nav-btn[data-view]')].map(x=>x.dataset.view);add('bottom-nav',['home','learn','ai','review','progress'].every(x=>nav.includes(x)),nav.join(','))}catch(e){add('bottom-nav',false,String(e))}
    try{add('ui-safety',Boolean(window.__uiSafety))}catch{add('ui-safety',false)}
    const ok=checks.every(x=>x.ok);window.__uiSmokeReport={ok,checks,at:new Date().toISOString()};
    if(!ok)console.warn('UI smoke check failed',window.__uiSmokeReport);
  }
  window.addEventListener('DOMContentLoaded',()=>setTimeout(test,300));
})();
