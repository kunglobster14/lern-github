(()=>{
  const VERSION='v85-story-sentence-controls';
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function root(){return document.querySelector('#oxfordStoriesModal')}
  function englishVoice(){try{const voices=speechSynthesis.getVoices?.()||[];return voices.find(v=>/^en-US$/i.test(v.lang||''))||voices.find(v=>/^en-GB$/i.test(v.lang||''))||voices.find(v=>/^en/i.test(v.lang||''))||null}catch{return null}}
  function rate(){try{return Number(window.OXFORD_STORY_SPEEDS?.getRate?.()||.52)}catch{return .52}}
  function speak(text){text=String(text||'').replace(/\s+/g,' ').trim();if(!text)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=rate();u.pitch=1;const v=englishVoice();if(v)u.voice=v;speechSynthesis.speak(u)}catch{}}
  function info(btn){const section=btn.closest('.story-paragraph');if(!section)return null;const en=String(btn.textContent||'').replace(/\s+/g,' ').trim();const th=String(section.querySelector('.story-paragraph-translation p')?.textContent||'').replace(/\s+/g,' ').trim();return{section,en,th}}
  function pop(r){let p=r.querySelector('#storyTranslationPopover');if(p)return p;const article=r.querySelector('.oxford-story-article')||r.querySelector('#oxfordStoriesBody')||r;p=document.createElement('aside');p.id='storyTranslationPopover';p.className='story-translation-popover';p.hidden=true;p.setAttribute('aria-live','polite');p.innerHTML='<div class="story-translation-popover-head"><b>🇹🇭 คำแปลประโยค</b><button type="button" data-pop-close aria-label="ปิดคำแปล">×</button></div><p class="story-pop-en"></p><p class="story-pop-th"></p><button type="button" class="story-pop-say">🔊 ฟังประโยค</button>';article.appendChild(p);return p}
  function show(btn){const r=btn.closest('#oxfordStoriesModal')||root(),data=info(btn);if(!r||!data)return false;const p=pop(r),en=p.querySelector('.story-pop-en'),th=p.querySelector('.story-pop-th');if(en)en.textContent=data.en;if(th)th.textContent=data.th||'ยังไม่มีคำแปลสำหรับประโยคนี้';p.dataset.v85Speech=data.en;p.hidden=false;const rect=btn.getBoundingClientRect(),w=Math.min(430,Math.max(286,window.innerWidth-24)),left=Math.max(12,Math.min(rect.left,window.innerWidth-w-12));let top=rect.bottom+8;if(top+250>window.innerHeight)top=Math.max(12,rect.top-250);Object.assign(p.style,{position:'fixed',left:`${left}px`,top:`${top}px`,width:`${w}px`,zIndex:'2147483000'});return true}
  function addActions(r=root()){
    if(!r)return 0;let added=0;
    r.querySelectorAll('.story-authored-sentence').forEach(btn=>{
      const section=btn.closest('.story-paragraph');if(!section||section.querySelector('.v85-sentence-actions'))return;
      const bar=document.createElement('div');bar.className='v85-sentence-actions';bar.innerHTML='<button type="button" data-v85-translate>🇹🇭 แปลประโยค</button><button type="button" data-v85-say>🔊 ฟังประโยค</button>';
      btn.insertAdjacentElement('afterend',bar);added++;
    });return added;
  }
  function bounded(){[0,30,80,180,400,800,1400].forEach(ms=>setTimeout(()=>addActions(),ms))}
  const style=document.createElement('style');style.textContent=`
  .v85-sentence-actions{display:flex;gap:7px;flex-wrap:wrap;margin:7px 0 2px 12px}
  .v85-sentence-actions button{border:1px solid rgba(103,232,249,.28);background:#10243d;color:#e6f7ff;border-radius:10px;padding:7px 10px;font-size:12px;font-weight:800;min-height:36px}
  .v85-sentence-actions button:active{transform:translateY(1px);background:#173251}
  .story-authored-sentence{cursor:pointer;touch-action:manipulation}
  .story-translation-popover{max-height:58vh;overflow:auto}
  @media(max-width:640px){.v85-sentence-actions{margin-left:0}.v85-sentence-actions button{flex:1;min-width:0}}
  `;document.head.appendChild(style);
  document.addEventListener('click',e=>{
    const r=e.target.closest?.('#oxfordStoriesModal');if(!r)return;
    addActions(r);
    const translate=e.target.closest?.('[data-v85-translate]');if(translate){e.preventDefault();e.stopImmediatePropagation();const btn=translate.closest('.story-paragraph')?.querySelector('.story-authored-sentence');if(btn)show(btn);return}
    const sayBtn=e.target.closest?.('[data-v85-say]');if(sayBtn){e.preventDefault();e.stopImmediatePropagation();const btn=sayBtn.closest('.story-paragraph')?.querySelector('.story-authored-sentence');if(btn)speak(info(btn)?.en);return}
    const popSay=e.target.closest?.('.story-pop-say');if(popSay){const p=popSay.closest('#storyTranslationPopover');if(p?.dataset.v85Speech){e.preventDefault();e.stopImmediatePropagation();speak(p.dataset.v85Speech);return}}
    const close=e.target.closest?.('[data-pop-close]');if(close){const p=close.closest('#storyTranslationPopover');if(p){e.preventDefault();p.hidden=true;return}}
    const sentence=e.target.closest?.('.story-authored-sentence');if(sentence){show(sentence)}
  },true);
  document.addEventListener('pointerup',e=>{const sentence=e.target.closest?.('.story-authored-sentence');if(sentence)requestAnimationFrame(()=>show(sentence))},false);
  document.addEventListener('click',e=>{if(e.target.closest?.('.oxford-story-card,#oxfordStoryBack,[data-v80-stories]'))bounded()},false);
  window.addEventListener('DOMContentLoaded',bounded);setTimeout(bounded,250);
  window.STORY_SENTENCE_CONTROLS_V85={version:VERSION,reliableSentenceTap:true,explicitTranslateButton:true,explicitSentenceAudioButton:true,noGlobalMutationObserver:true};
})();
