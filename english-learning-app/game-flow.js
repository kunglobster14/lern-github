(()=>{
  const ORDER=['match','builder','listen','story','sprint'];
  const LABELS={match:'Word Match',builder:'Sentence Builder',listen:'Listening Hunt',story:'English Adventure',sprint:'Flash Sprint','ai-mission':'AI Surprise Mission'};
  const QUEST_TARGET={learn:3,quiz:3,ai:1,game:1,listen:2};

  function currentType(modal){
    const title=(modal.querySelector('.game-panel-head h2')?.textContent||'').toLowerCase();
    if(title.includes('word match'))return 'match';
    if(title.includes('sentence builder'))return 'builder';
    if(title.includes('listening hunt'))return 'listen';
    if(title.includes('flash sprint'))return 'sprint';
    if(title.includes('ai surprise'))return 'ai-mission';
    if(title.includes('gate 12')||title.includes('ร้านกาแฟ')||title.includes('เช็กอิน'))return 'story';
    return 'match';
  }

  function nextType(type){
    const i=ORDER.indexOf(type);
    return ORDER[(i<0?0:i+1)%ORDER.length];
  }

  function launch(type){
    const card=document.querySelector(`[data-lab="${type}"]`);
    if(card){card.click();return true}
    return false;
  }

  function closeModal(){document.querySelector('#gameLabModal .game-close')?.click()}

  function pendingQuest(){
    try{
      const l=state?.gameLab;
      if(!l||!Array.isArray(l.dailyQuestIds))return null;
      return l.dailyQuestIds.find(id=>(Number(l.progress?.[id])||0)<(QUEST_TARGET[id]||1))||null;
    }catch{return null}
  }

  function questLabel(id){
    return {learn:'คำศัพท์',quiz:'Quiz',ai:'AI Coach',game:'Mini Game',listen:'Listening'}[id]||'Quest';
  }

  function continueQuest(current){
    const q=pendingQuest();
    if(q==='listen')return launch('listen');
    if(q==='game')return launch(nextType(current));
    if(q==='ai'){
      closeModal();
      try{go('ai')}catch{}
      return;
    }
    if(q==='quiz'){
      closeModal();
      setTimeout(()=>{
        const start=document.querySelector('#quizStart');
        if(start)start.click();else try{go('quiz')}catch{}
      },0);
      return;
    }
    if(q==='learn'){
      closeModal();
      setTimeout(()=>{
        if(typeof window.openCore3000Study==='function')window.openCore3000Study();
        else try{go('learn')}catch{}
      },0);
      return;
    }
    launch(nextType(current));
  }

  function enhance(modal){
    const done=modal.querySelector('#labDone');
    if(!done||done.dataset.flowReady==='1')return;
    done.dataset.flowReady='1';
    const type=currentType(modal),next=nextType(type),q=pendingQuest();
    const box=document.createElement('div');
    box.className='game-flow-actions';
    box.innerHTML=`
      <button class="lab-primary game-flow-main" type="button" data-flow="again">▶ เล่น ${LABELS[type]||'เกมนี้'} อีกรอบ</button>
      <div class="game-flow-row">
        <button class="lab-secondary" type="button" data-flow="next">🎮 เกมถัดไป · ${LABELS[next]}</button>
        <button class="lab-secondary" type="button" data-flow="quest">🎯 ${q?`ทำ Quest ต่อ · ${questLabel(q)}`:'Quest ครบแล้ว · เล่นต่อ'}</button>
      </div>
      <button class="game-flow-close" type="button" data-flow="close">✕ ปิดเมื่อพอแล้ว</button>
      <p class="game-flow-note">เล่นต่อได้เรื่อย ๆ ระบบจะไม่เด้งกลับหน้าแรกจนกว่าคุณจะกดปิดเอง</p>`;
    done.replaceWith(box);
    box.querySelector('[data-flow="again"]').onclick=()=>launch(type);
    box.querySelector('[data-flow="next"]').onclick=()=>launch(next);
    box.querySelector('[data-flow="quest"]').onclick=()=>continueQuest(type);
    box.querySelector('[data-flow="close"]').onclick=closeModal;
  }

  function scan(){const modal=document.querySelector('#gameLabModal');if(modal)enhance(modal)}
  const observer=new MutationObserver(scan);
  observer.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',scan);
})();