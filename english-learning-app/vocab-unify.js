(()=>{
  const TARGET=3000;
  const CARD_CACHE='myEnglishCore3000CardsV2';

  function plan(){
    state.core3000Plan=state.core3000Plan||{daily:12,daysPerWeek:6,mastered:0,startedAt:new Date().toISOString(),sourceReady:false};
    return state.core3000Plan;
  }

  function mastered(){
    return Math.max(0,Math.min(TARGET,Number(plan().mastered)||0));
  }

  function daily(){
    return Math.max(1,Math.min(20,Number(plan().daily)||12));
  }

  function pct(){
    return Math.min(100,Math.round(mastered()/TARGET*100));
  }

  function cards(){
    try{return JSON.parse(localStorage.getItem(CARD_CACHE)||'{}')||{}}catch{return{}}
  }

  function esc(v){
    return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function openCore(){
    if(typeof window.openCore3000Study==='function'){
      window.openCore3000Study();
      return;
    }
    try{baseGo('home')}catch{}
  }

  // The old `learn` route was the 60-word Vocabulary Flow. Retire it completely.
  const baseGo=go;
  go=function(next){
    if(next==='learn'){
      baseGo('home');
      requestAnimationFrame(openCore);
      return;
    }
    return baseGo(next);
  };

  // Review now reads Core 3000 card data instead of the retired 60-word array.
  reviewView=function(){
    const weak=[...new Set(Array.isArray(state.weak)?state.weak:[])];
    if(!weak.length){
      return `<div class="empty"><h2>🎉 วันนี้ไม่มีคำที่ต้องทบทวน</h2><p>เรียนคำใหม่จาก Core 3000 ต่อได้เลย</p><button class="primary-btn" id="reviewCoreStart" type="button">เรียน ${daily()} คำวันนี้</button></div>`;
    }
    const cache=cards();
    return `<div class="section-title"><h2>Core 3000 · ทบทวน</h2><span>${weak.length} คำ</span></div><div class="review-list">${weak.map(word=>{
      const c=cache[word]||{};
      const meaning=c.thai||'คำนี้จะมีความหมายเมื่อเปิดเรียนซ้ำใน Core 3000';
      const example=c.example||'';
      return `<div class="review-item"><div><b>${esc(word)} — ${esc(meaning)}</b>${example?`<small>${esc(example)}</small>`:''}</div><button class="secondary-btn core-review-speak" data-word="${esc(word)}" type="button">🔊</button></div>`;
    }).join('')}</div><div style="margin-top:16px"><button class="primary-btn" id="reviewCoreStart" type="button">กลับไปเรียน Core 3000</button></div>`;
  };

  function syncHome(){
    const p=plan(),done=mastered(),percent=pct();
    const hero=document.querySelector('.hero');
    hero?.querySelector('.progress-fill')?.setAttribute('style',`width:${percent}%`);

    document.querySelectorAll('.section-title').forEach(section=>{
      const h=section.querySelector('h2');
      if(h?.textContent?.trim()==='เลือกฝึกวันนี้'){
        const span=section.querySelector('span');
        if(span)span.textContent=`Core 3000 ${done}/${TARGET} คำ`;
      }
    });

    document.querySelectorAll('.action-card').forEach(card=>{
      const h=card.querySelector('h3');
      if(h?.textContent?.trim()!=='คำศัพท์'&&h?.textContent?.trim()!=='คำศัพท์วันนี้')return;
      h.textContent='คำศัพท์วันนี้';
      const desc=card.querySelector('p');
      if(desc)desc.textContent=`Core 3000 • รวม ${done}/${TARGET} คำ • เป้าหมาย ${p.daily} คำ/วัน`;
      const button=card.querySelector('.card-action');
      if(button){
        button.removeAttribute('data-go');
        button.textContent=`เรียน ${p.daily} คำ`;
        button.onclick=(event)=>{event.preventDefault();openCore();};
      }
    });
  }

  function syncProgress(){
    if(view!=='progress')return;
    const done=mastered(),percent=pct();
    document.querySelectorAll('.stat-card').forEach(card=>{
      const label=card.querySelector('span')?.textContent?.trim();
      if(label==='คำที่จำได้')card.querySelector('b').textContent=String(done);
    });
    const levelCard=document.querySelector('.level-card');
    if(levelCard){
      const title=levelCard.querySelector('b');
      if(title)title.textContent=`Core 3000 • ${done}/${TARGET} คำ • ${percent}%`;
      levelCard.querySelector('.progress-fill')?.setAttribute('style',`width:${percent}%`);
      const note=levelCard.querySelector('p');
      if(note)note.textContent='คำศัพท์ทั้งหมดใช้ระบบ Core 3000 เพียงระบบเดียว พร้อมความหมายไทย ฟัง พูด ตัวอย่าง และการทบทวน';
    }
  }

  function syncNav(){
    const learn=document.querySelector('.bottom-nav [data-view="learn"]');
    if(!learn)return;
    const labels=learn.querySelectorAll('span');
    if(labels.length)labels[labels.length-1].textContent='คำศัพท์';
    learn.setAttribute('aria-label','เปิดคำศัพท์ Core 3000');
  }

  function sync(){
    syncNav();
    if(view==='home')syncHome();
    syncProgress();
    document.querySelector('#reviewCoreStart')?.addEventListener('click',openCore,{once:true});
    document.querySelectorAll('.core-review-speak').forEach(btn=>{
      btn.onclick=()=>{
        const word=btn.dataset.word||'';
        if(typeof speak==='function')speak(word);
        else{const u=new SpeechSynthesisUtterance(word);u.lang='en-US';speechSynthesis.speak(u);}
      };
    });
  }

  const baseRender=render;
  render=function(){
    baseRender();
    requestAnimationFrame(sync);
  };

  // Capture any stale buttons from cached markup before their old onclick runs.
  document.addEventListener('click',event=>{
    const target=event.target?.closest?.('[data-go="learn"]');
    if(!target)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openCore();
  },true);

  window.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(sync));
})();
