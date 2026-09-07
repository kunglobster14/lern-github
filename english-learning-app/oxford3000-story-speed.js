(()=>{
  const STORAGE_KEY='oxfordStoryNarrationSpeedV1';
  const SPEEDS={slow:{label:'ช้า',rate:.6},medium:{label:'กลาง',rate:.9},fast:{label:'เร็ว',rate:1.15}};
  const VERSION='v82-ios-story-audio';
  let speedName='medium';
  try{const saved=localStorage.getItem(STORAGE_KEY);if(saved&&SPEEDS[saved])speedName=saved}catch{}
  let player={root:null,sentences:[],index:0,active:false,paused:false,utterance:null,started:false,retry:0};

  function synth(){return window.speechSynthesis||null}
  function currentRate(){return SPEEDS[speedName]?.rate||SPEEDS.medium.rate}
  function modal(){return document.querySelector('#oxfordStoriesModal')}
  function sentences(root){return [...root.querySelectorAll('.story-authored-sentence')].map((el,index)=>({el,index,text:String(el.textContent||'').replace(/\s+/g,' ').trim()})).filter(x=>x.text)}
  function englishVoice(){try{const voices=synth()?.getVoices?.()||[];return voices.find(v=>/^en-US$/i.test(v.lang||''))||voices.find(v=>/^en-GB$/i.test(v.lang||''))||voices.find(v=>/^en/i.test(v.lang||''))||null}catch{return null}}
  function clearMark(){player.root?.querySelectorAll('.story-sentence.is-speaking').forEach(el=>el.classList.remove('is-speaking'))}
  function status(root,text=''){const el=root?.querySelector('[data-story-audio-status]');if(el)el.textContent=text}
  function syncUI(root=player.root){
    if(!root)return;
    const play=root.querySelector('#storyReadAll'),pause=root.querySelector('#storyPause'),stop=root.querySelector('#storyStop');
    if(play)play.textContent=player.active?(player.paused?'▶ อ่านต่อ':'🔊 กำลังอ่าน...'):'🔊 ฟังทั้งเรื่อง';
    if(pause){pause.disabled=!player.active;pause.textContent=player.paused?'▶ อ่านต่อ':'⏸ พัก'}
    if(stop)stop.disabled=!player.active;
    root.querySelectorAll('[data-story-speed]').forEach(btn=>{const active=btn.dataset.storySpeed===speedName;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active))});
    const label=root.querySelector('[data-story-speed-status]');if(label)label.textContent=`${SPEEDS[speedName].label} · ${currentRate().toFixed(2)}×`;
  }
  function cancelSpeech(){try{const s=synth();if(s&&(s.speaking||s.pending||player.utterance))s.cancel()}catch{}}
  function resetPlayer(root=null,cancel=true){
    if(cancel)cancelSpeech();
    clearMark();
    player={root,sentences:[],index:0,active:false,paused:false,utterance:null,started:false,retry:0};
    syncUI(root);status(root,'');
  }
  function finish(){const root=player.root;resetPlayer(root,true)}
  function fail(root,message){resetPlayer(root,true);status(root,message||'ไม่สามารถเล่นเสียงได้ กรุณากดฟังอีกครั้ง')}
  function speakCurrent(){
    if(!player.active||player.paused)return;
    if(player.index>=player.sentences.length){finish();return}
    const s=synth();if(!s||typeof window.SpeechSynthesisUtterance!=='function'){fail(player.root,'อุปกรณ์นี้ไม่รองรับเสียงอ่าน');return}
    clearMark();
    const current=player.sentences[player.index];current.el?.classList.add('is-speaking');
    try{
      const u=new SpeechSynthesisUtterance(current.text);u.lang='en-US';u.rate=currentRate();u.pitch=1;const voice=englishVoice();if(voice)u.voice=voice;
      const token=`${player.index}-${Date.now()}`;u.datasetToken=token;player.started=false;
      u.onstart=()=>{if(player.utterance!==u)return;player.started=true;player.retry=0;status(player.root,'')};
      u.onend=()=>{if(player.utterance!==u||!player.active||player.paused)return;player.index++;player.retry=0;player.utterance=null;speakCurrent()};
      u.onerror=()=>{if(player.utterance!==u||!player.active)return;player.utterance=null;if(player.retry<1){player.retry++;setTimeout(()=>{if(player.active&&!player.paused)speakCurrent()},120)}else fail(player.root,'เสียงอ่านเริ่มไม่ได้ กรุณากด “ฟังทั้งเรื่อง” อีกครั้ง')};
      player.utterance=u;
      try{s.resume()}catch{}
      s.speak(u);syncUI();status(player.root,`กำลังอ่านประโยค ${player.index+1}/${player.sentences.length}`);
      setTimeout(()=>{if(!player.active||player.paused||player.utterance!==u||player.started)return;try{if(!s.speaking){player.utterance=null;if(player.retry<1){player.retry++;speakCurrent()}else fail(player.root,'เสียงอ่านไม่เริ่ม กรุณากดฟังอีกครั้ง')}}catch{}},700);
    }catch{fail(player.root,'เสียงอ่านเริ่มไม่ได้ กรุณากดฟังอีกครั้ง')}
  }
  function start(root){
    if(player.active&&player.root===root&&player.paused){
      player.paused=false;
      try{synth()?.resume()}catch{}
      if(!player.utterance)speakCurrent();syncUI(root);return;
    }
    if(player.active&&player.root===root&&!player.paused)return;
    const list=sentences(root);if(!list.length){status(root,'ไม่พบข้อความสำหรับอ่าน');return}
    const s=synth();if(!s){status(root,'อุปกรณ์นี้ไม่รองรับเสียงอ่าน');return}
    const hadAudio=!!(s.speaking||s.pending||player.utterance);if(hadAudio)cancelSpeech();
    clearMark();player={root,sentences:list,index:0,active:true,paused:false,utterance:null,started:false,retry:0};syncUI(root);status(root,'กำลังเตรียมเสียง...');
    if(hadAudio)setTimeout(()=>{if(player.active&&!player.paused)speakCurrent()},90);else speakCurrent();
  }
  function pause(root){
    if(!player.active||player.root!==root)return;
    try{
      const s=synth();
      if(player.paused){player.paused=false;s?.resume();if(!player.utterance)speakCurrent()}
      else{s?.pause();player.paused=true;status(root,'พักเสียงแล้ว')}
      syncUI(root);
    }catch{}
  }
  function stop(root){resetPlayer(root,true)}
  function setSpeed(name,root){
    if(!SPEEDS[name])return;
    speedName=name;try{localStorage.setItem(STORAGE_KEY,name)}catch{}
    if(player.active&&player.root===root){
      const wasPaused=player.paused;cancelSpeech();player.utterance=null;clearMark();player.retry=0;
      if(!wasPaused)setTimeout(()=>{if(player.active&&!player.paused)speakCurrent()},90);else syncUI(root);
    }else syncUI(root);
  }
  function inject(root){
    if(!root||root.querySelector('[data-story-speed-control]'))return;
    const play=root.querySelector('#storyReadAll');if(!play)return;
    const wrap=document.createElement('div');wrap.className='story-speed-picker';wrap.dataset.storySpeedControl='1';wrap.setAttribute('role','group');wrap.setAttribute('aria-label','ความเร็วเสียงอ่านนิยาย');
    wrap.innerHTML=`<span class="story-speed-title">ความเร็ว <b data-story-speed-status></b></span><div class="story-speed-buttons">${Object.entries(SPEEDS).map(([key,item])=>`<button type="button" data-story-speed="${key}" aria-pressed="${key===speedName}">${item.label}<small>${item.rate.toFixed(2)}×</small></button>`).join('')}</div><small class="story-audio-status" data-story-audio-status aria-live="polite"></small>`;
    play.insertAdjacentElement('afterend',wrap);syncUI(root);
  }
  function ensure(){const root=modal();if(root)inject(root);else if(player.active)resetPlayer()}

  const style=document.createElement('style');style.textContent=`.story-speed-picker{display:flex;align-items:center;gap:8px;padding:4px;border:1px solid rgba(148,163,184,.2);border-radius:12px;background:rgba(15,34,56,.78);flex-wrap:wrap}.story-speed-title{padding:0 7px;color:#94a3b8;font-size:11px;white-space:nowrap}.story-speed-title b{display:block;color:#67e8f9;font-size:10px;margin-top:1px}.story-speed-buttons{display:flex;gap:4px}.story-speed-buttons button{min-height:38px!important;padding:6px 9px!important;border-radius:9px!important;background:transparent!important;color:#cbd5e1!important}.story-speed-buttons button small{display:block;font-size:9px;color:#64748b}.story-speed-buttons button.active{border-color:rgba(34,211,238,.6)!important;background:rgba(8,145,178,.16)!important;color:#fff!important}.story-speed-buttons button.active small{color:#a5f3fc}.story-speed-buttons button:focus-visible{outline:2px solid #67e8f9;outline-offset:2px}.story-audio-status{width:100%;padding:0 7px 4px;color:#67e8f9;font-size:10px}@media(max-width:760px){.story-speed-picker{width:100%;justify-content:space-between}.story-speed-buttons{flex:1;justify-content:flex-end}.story-speed-buttons button{min-width:62px}}`;
  document.head.appendChild(style);

  document.addEventListener('click',e=>{
    const root=e.target.closest?.('#oxfordStoriesModal');if(!root)return;
    const speed=e.target.closest?.('[data-story-speed]');if(speed){e.preventDefault();e.stopImmediatePropagation();setSpeed(speed.dataset.storySpeed,root);return}
    if(e.target.closest?.('#storyReadAll')){e.preventDefault();e.stopImmediatePropagation();start(root);return}
    if(e.target.closest?.('#storyPause')){e.preventDefault();e.stopImmediatePropagation();pause(root);return}
    if(e.target.closest?.('#storyStop')){e.preventDefault();e.stopImmediatePropagation();stop(root);return}
    if(e.target.closest?.('#oxfordStoryBack,.oxford-extra-close,[data-say],[data-glossary-say],[data-focus-say],.story-pop-say')){if(player.root===root)stop(root)}
  },true);

  try{const s=synth();if(s){s.onvoiceschanged=()=>{if(player.active&&!player.started&&!player.utterance)speakCurrent()}}}catch{}
  const observer=new MutationObserver(()=>queueMicrotask(ensure));observer.observe(document.body,{childList:true,subtree:true});ensure();
  window.OXFORD_STORY_SPEEDS={slow:SPEEDS.slow.rate,medium:SPEEDS.medium.rate,fast:SPEEDS.fast.rate,version:VERSION};
})();
