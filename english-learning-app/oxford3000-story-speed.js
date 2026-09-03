(()=>{
  const STORAGE_KEY='oxfordStoryNarrationSpeedV1';
  const SPEEDS={slow:{label:'ช้า',rate:.6},medium:{label:'กลาง',rate:.9},fast:{label:'เร็ว',rate:1.15}};
  let speedName='medium';
  try{const saved=localStorage.getItem(STORAGE_KEY);if(saved&&SPEEDS[saved])speedName=saved}catch{}
  let player={root:null,sentences:[],index:0,active:false,paused:false,utterance:null};

  function currentRate(){return SPEEDS[speedName]?.rate||SPEEDS.medium.rate}
  function modal(){return document.querySelector('#oxfordStoriesModal')}
  function sentences(root){return [...root.querySelectorAll('.story-authored-sentence')].map((el,index)=>({el,index,text:String(el.textContent||'').replace(/\s+/g,' ').trim()})).filter(x=>x.text)}
  function clearMark(){player.root?.querySelectorAll('.story-sentence.is-speaking').forEach(el=>el.classList.remove('is-speaking'))}
  function syncUI(root=player.root){
    if(!root)return;
    const play=root.querySelector('#storyReadAll'),pause=root.querySelector('#storyPause'),stop=root.querySelector('#storyStop');
    if(play)play.textContent=player.active?(player.paused?'▶ อ่านต่อ':'🔊 กำลังอ่าน...'):'🔊 ฟังทั้งเรื่อง';
    if(pause){pause.disabled=!player.active;pause.textContent=player.paused?'▶ อ่านต่อ':'⏸ พัก'}
    if(stop)stop.disabled=!player.active;
    root.querySelectorAll('[data-story-speed]').forEach(btn=>{const active=btn.dataset.storySpeed===speedName;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active))});
    const label=root.querySelector('[data-story-speed-status]');if(label)label.textContent=`${SPEEDS[speedName].label} · ${currentRate().toFixed(2)}×`;
  }
  function resetPlayer(root=null){
    try{speechSynthesis.cancel()}catch{}
    clearMark();
    player={root,sentences:[],index:0,active:false,paused:false,utterance:null};
    syncUI(root);
  }
  function finish(){const root=player.root;resetPlayer(root)}
  function speakCurrent(){
    if(!player.active||player.paused)return;
    if(player.index>=player.sentences.length){finish();return}
    clearMark();
    const current=player.sentences[player.index];current.el?.classList.add('is-speaking');
    try{
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(current.text);u.lang='en-US';u.rate=currentRate();u.pitch=1;
      u.onend=()=>{if(!player.active||player.paused)return;player.index++;speakCurrent()};
      u.onerror=()=>finish();
      player.utterance=u;speechSynthesis.speak(u);syncUI();
    }catch{finish()}
  }
  function start(root){
    if(player.active&&player.root===root&&player.paused){
      player.paused=false;
      if(player.utterance){try{speechSynthesis.resume();syncUI();return}catch{}}
      speakCurrent();return;
    }
    if(player.active&&player.root===root&&!player.paused)return;
    resetPlayer(root);
    const list=sentences(root);if(!list.length)return;
    player={root,sentences:list,index:0,active:true,paused:false,utterance:null};
    speakCurrent();
  }
  function pause(root){
    if(!player.active||player.root!==root)return;
    try{
      if(player.paused){player.paused=false;if(player.utterance)speechSynthesis.resume();else speakCurrent()}
      else{speechSynthesis.pause();player.paused=true}
      syncUI(root);
    }catch{}
  }
  function stop(root){resetPlayer(root)}
  function setSpeed(name,root){
    if(!SPEEDS[name])return;
    speedName=name;try{localStorage.setItem(STORAGE_KEY,name)}catch{}
    if(player.active&&player.root===root){
      const wasPaused=player.paused;
      try{speechSynthesis.cancel()}catch{}
      player.utterance=null;clearMark();
      if(!wasPaused)speakCurrent();else syncUI(root);
    }else syncUI(root);
  }
  function inject(root){
    if(!root||root.querySelector('[data-story-speed-control]'))return;
    const play=root.querySelector('#storyReadAll');if(!play)return;
    const wrap=document.createElement('div');wrap.className='story-speed-picker';wrap.dataset.storySpeedControl='1';wrap.setAttribute('role','group');wrap.setAttribute('aria-label','ความเร็วเสียงอ่านนิยาย');
    wrap.innerHTML=`<span class="story-speed-title">ความเร็ว <b data-story-speed-status></b></span><div class="story-speed-buttons">${Object.entries(SPEEDS).map(([key,item])=>`<button type="button" data-story-speed="${key}" aria-pressed="${key===speedName}">${item.label}<small>${item.rate.toFixed(2)}×</small></button>`).join('')}</div>`;
    play.insertAdjacentElement('afterend',wrap);syncUI(root);
  }
  function ensure(){const root=modal();if(root)inject(root);else if(player.active)resetPlayer()}

  const style=document.createElement('style');style.textContent=`.story-speed-picker{display:flex;align-items:center;gap:8px;padding:4px;border:1px solid rgba(148,163,184,.2);border-radius:12px;background:rgba(15,34,56,.78)}.story-speed-title{padding:0 7px;color:#94a3b8;font-size:11px;white-space:nowrap}.story-speed-title b{display:block;color:#67e8f9;font-size:10px;margin-top:1px}.story-speed-buttons{display:flex;gap:4px}.story-speed-buttons button{min-height:38px!important;padding:6px 9px!important;border-radius:9px!important;background:transparent!important;color:#cbd5e1!important}.story-speed-buttons button small{display:block;font-size:9px;color:#64748b}.story-speed-buttons button.active{border-color:rgba(34,211,238,.6)!important;background:rgba(8,145,178,.16)!important;color:#fff!important}.story-speed-buttons button.active small{color:#a5f3fc}.story-speed-buttons button:focus-visible{outline:2px solid #67e8f9;outline-offset:2px}@media(max-width:760px){.story-speed-picker{width:100%;justify-content:space-between;flex-wrap:wrap}.story-speed-buttons{flex:1;justify-content:flex-end}.story-speed-buttons button{min-width:62px}}`;
  document.head.appendChild(style);

  document.addEventListener('click',e=>{
    const root=e.target.closest?.('#oxfordStoriesModal');if(!root)return;
    const speed=e.target.closest?.('[data-story-speed]');if(speed){e.preventDefault();e.stopImmediatePropagation();setSpeed(speed.dataset.storySpeed,root);return}
    if(e.target.closest?.('#storyReadAll')){e.preventDefault();e.stopImmediatePropagation();start(root);return}
    if(e.target.closest?.('#storyPause')){e.preventDefault();e.stopImmediatePropagation();pause(root);return}
    if(e.target.closest?.('#storyStop')){e.preventDefault();e.stopImmediatePropagation();stop(root);return}
    if(e.target.closest?.('#oxfordStoryBack,.oxford-extra-close,[data-say],[data-glossary-say],[data-focus-say],.story-pop-say')){if(player.root===root)stop(root)}
  },true);

  const observer=new MutationObserver(()=>queueMicrotask(ensure));observer.observe(document.body,{childList:true,subtree:true});ensure();
  window.OXFORD_STORY_SPEEDS={slow:SPEEDS.slow.rate,medium:SPEEDS.medium.rate,fast:SPEEDS.fast.rate};
})();
