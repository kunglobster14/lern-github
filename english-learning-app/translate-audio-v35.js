(()=>{
  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target.closest('#gameLabModal .lab-choice'):null;
    if(!target)return;
    const title=document.querySelector('#gameLabModal .game-panel-head h2');
    if(!title||!title.textContent.includes('Thai → English'))return;
    setTimeout(()=>{
      if(!target.classList.contains('correct'))return;
      const text=String(target.textContent||'').trim();
      if(!text)return;
      try{if(typeof speak==='function')speak(text)}catch{}
    },0);
  });
  window.__translateAudioV35={version:'35'};
})();
