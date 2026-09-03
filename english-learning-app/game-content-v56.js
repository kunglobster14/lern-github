(()=>{
  const VERSION='v56';
  const CUSTOM=new Set(['builder','gap','translate','dialog','context']);
  const recent={word:[],sentence:[],type:[]};
  const originalLesson=window.getDailyLesson;
  let expandedCache={modal:null,key:'',lesson:null};
  let sentenceCache={key:'',rows:[]};
  let oldOpen=null;

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const norm=v=>String(v||'').trim().toLowerCase().replace(/[.!?,;:]+$/,'').replace(/\s+/g,' ');
  const level=()=>{try{return window.getLearnerLevel?.()||'starter'}catch{return'starter'}};
  const info=()=>window.getLearnerLevelInfo?.()||{cefr:level(),label:level()};
  const say=text=>{try{if(typeof speak==='function')return speak(text);speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.86;speechSynthesis.speak(u)}catch{}};

  function pushRecent(bucket,key,max=120){const a=recent[bucket];a.push(String(key));if(a.length>max)a.splice(0,a.length-max)}
  function pickNR(bucket,arr,key=x=>x.id??x.word,maxBlock=90){
    if(!arr.length)return null;const blocked=new Set(recent[bucket].slice(-Math.min(maxBlock,Math.max(1,arr.length-1))));
    const pool=arr.filter(x=>!blocked.has(String(key(x)))),q=(pool.length?pool:arr)[Math.floor(Math.random()*(pool.length||arr.length))];pushRecent(bucket,key(q),Math.max(120,maxBlock+20));return q;
  }
  function rows(){
    let list=[];try{list=window.getOxford3000?.()||[]}catch{};try{list=window.filterOxfordByLearnerLevel?.(list)||list}catch{}
    return (Array.isArray(list)?list:[]).map((r,i)=>({id:r.id??i+1,word:String(r.word||'').trim(),thai:String(r.thai||'').trim(),level:String(r.level||''),part:String(r.part||''),example:String(r.example||'').trim(),exampleThai:String(r.exampleThai||'').trim()})).filter(x=>x.word&&x.thai);
  }
  function sentenceRows(){
    const base=originalLesson?.(),key=`${level()}|${base?.day||0}`;if(sentenceCache.key===key&&sentenceCache.rows.length)return sentenceCache.rows;
    const list=rows().filter(x=>x.example&&x.exampleThai&&x.example.split(/\s+/).length>=3&&x.example.split(/\s+/).length<=18);
    sentenceCache={key,rows:list};return list;
  }
  function expandLesson(base,modal){
    if(!base)return base;const key=`${level()}|${base.day||0}`;if(expandedCache.modal===modal&&expandedCache.key===key&&expandedCache.lesson)return expandedCache.lesson;
    const pool=shuffle(rows()),sample=pool.slice(0,Math.min(360,pool.length)),seen=new Set(),vocab=[];
    for(const v of [...(base.vocab||[]).map(x=>({en:x.en,th:x.th})),...sample.map(x=>({en:x.word,th:x.thai}))]){const k=norm(v.en);if(!k||seen.has(k))continue;seen.add(k);vocab.push(v)}
    expandedCache={modal,key,lesson:{...base,vocab}};return expandedCache.lesson;
  }
  if(typeof originalLesson==='function')window.getDailyLesson=(...args)=>{
    const base=originalLesson(...args),modal=document.querySelector('#adaptiveGameV54');return modal?expandLesson(base,modal):base;
  };

  function close(){const d=document.querySelector('#gameContentV56');if(!d)return;try{if(d.open)d.close()}catch{}d.remove()}
  function modal(type){
    close();document.querySelector('#adaptiveGameV54')?.remove();window.__gameLabV31?.close?.();
    const meta={builder:['🧱','Sentence Builder'],gap:['🔤','Missing Word'],translate:['🇹🇭','Thai → English'],dialog:['🗣️','Survival Dialog'],context:['🔎','Context Detective']}[type]||['🎮','Game'];
    const d=document.createElement('dialog');d.id='gameContentV56';d.className='game-dialog';
    d.innerHTML=`<section class="game-panel"><header class="game-panel-head"><div><h2>${meta[0]} ${meta[1]}</h2><small>${esc(info().cefr||level())} · คลังประโยค Oxford ตามระดับ</small><small id="gc56Status"></small></div><button class="game-close" type="button">×</button></header><div id="gc56Body"></div></section>`;
    document.body.appendChild(d);d.querySelector('.game-close').onclick=close;d.addEventListener('cancel',e=>{e.preventDefault();close()});d.addEventListener('click',e=>{if(e.target===d)close()});if(d.showModal)d.showModal();else d.setAttribute('open','');return d;
  }
  let session={count:0,streak:0};
  function status(d){const e=d.querySelector('#gc56Status');if(e)e.textContent=`ข้อ ${session.count+1} · ต่อเนื่อง ${session.streak} · ประโยค ${sentenceRows().length.toLocaleString()}`}
  function award(xp=8){session.count++;session.streak++;try{if(typeof state==='object'&&state){state.xp=(Number(state.xp)||0)+xp;if(typeof saveState==='function')saveState()}window.__gameLabV31?.addProgress?.('game',1)}catch{}}
  function miss(){session.count++;session.streak=0}
  function feedback(b,text,ok=true){let e=b.querySelector('.gc56-feedback');if(!e){e=document.createElement('div');e.className='gc56-feedback';b.appendChild(e)}e.innerHTML=`<b>${ok?'✓ ถูกต้อง':'เฉลย'}</b><span>${esc(text)}</span>`}
  function next(d,type,delay=1200){status(d);setTimeout(()=>{if(document.body.contains(d))render(d,type)},delay)}
  function q(){return pickNR('sentence',sentenceRows(),x=>x.id,120)}
  function alternatives(target,n=3){return shuffle(sentenceRows().filter(x=>x.id!==target.id)).slice(0,n)}

  function builder(d){
    const x=q();if(!x)return;const b=d.querySelector('#gc56Body'),target=x.example.replace(/[.!?]$/,''),tokens=target.split(/\s+/),chosen=[],objs=tokens.map((t,i)=>({t,i}));
    b.innerHTML=`<p class="game-prompt">${esc(x.exampleThai)}</p><p class="game-sub">ใช้คำหลัก: <b>${esc(x.word)}</b> = ${esc(x.thai)}</p><div class="builder-answer" id="gc56Built"></div><div class="builder-pool" id="gc56Tokens"></div><div class="lab-actions"><button class="lab-secondary" id="gc56Reset">เริ่มใหม่</button><button class="lab-primary" id="gc56Check">ตรวจ</button></div>`;
    const built=b.querySelector('#gc56Built'),box=b.querySelector('#gc56Tokens');const draw=()=>{built.textContent=chosen.map(o=>o.t).join(' ');const used=new Set(chosen.map(o=>o.i));box.innerHTML=shuffle(objs).map(o=>`<button class="token-btn" data-i="${o.i}" ${used.has(o.i)?'disabled':''}>${esc(o.t)}</button>`).join('');box.querySelectorAll('[data-i]').forEach(btn=>btn.onclick=()=>{const o=objs[Number(btn.dataset.i)];if(!used.has(o.i)){chosen.push(o);draw()}})};draw();
    b.querySelector('#gc56Reset').onclick=()=>{chosen.length=0;draw()};b.querySelector('#gc56Check').onclick=()=>{if(norm(chosen.map(o=>o.t).join(' '))===norm(target)){award(9);say(x.example);feedback(b,x.example);next(d,'builder',1200)}else{miss();say(x.example);feedback(b,x.example,false);next(d,'builder',1800)}};
  }
  function gap(d){
    const x=q();if(!x)return;const b=d.querySelector('#gc56Body'),safe=x.word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),re=new RegExp(`\\b${safe}\\b`,'i');let answer=x.word,blank=x.example;
    if(re.test(blank))blank=blank.replace(re,'_____');else{const t=blank.replace(/[.!?]$/,'').split(/\s+/),c=t.map((w,i)=>({w,i})).filter(o=>o.w.replace(/[^A-Za-z']/g,'').length>3),p=c[Math.floor(Math.random()*c.length)]||{w:t[1]||t[0],i:1};answer=p.w;blank=t.map((w,i)=>i===p.i?'_____':w).join(' ')}
    const opts=shuffle([answer,...shuffle(rows().map(r=>r.word).filter(w=>norm(w)!==norm(answer))).slice(0,3)]);b.innerHTML=`<p class="game-prompt">${esc(x.exampleThai)}</p><div class="v53-gap">${esc(blank)}</div><div class="choice-stack">${opts.map(w=>`<button class="lab-choice" data-a="${esc(w)}">${esc(w)}</button>`).join('')}</div>`;
    b.querySelectorAll('[data-a]').forEach(btn=>btn.onclick=()=>{b.querySelectorAll('[data-a]').forEach(y=>y.disabled=true);if(norm(btn.dataset.a)===norm(answer)){award();say(x.example);feedback(b,x.example);next(d,'gap',1150)}else{miss();say(x.example);feedback(b,x.example,false);next(d,'gap',1700)}});
  }
  function translate(d){
    const x=q();if(!x)return;const opts=shuffle([x,...alternatives(x)]),b=d.querySelector('#gc56Body');b.innerHTML=`<p class="game-prompt">${esc(x.exampleThai)}</p><div class="choice-stack">${opts.map(o=>`<button class="lab-choice" data-id="${o.id}">${esc(o.example)}</button>`).join('')}</div>`;
    b.querySelectorAll('[data-id]').forEach(btn=>btn.onclick=()=>{b.querySelectorAll('[data-id]').forEach(y=>y.disabled=true);if(String(btn.dataset.id)===String(x.id)){award();say(x.example);feedback(b,x.example);next(d,'translate',1200)}else{miss();say(x.example);feedback(b,x.example,false);next(d,'translate',1800)}});
  }
  function dialog(d){
    const x=q();if(!x)return;const opts=shuffle([x,...alternatives(x)]),b=d.querySelector('#gc56Body');b.innerHTML=`<p class="game-sub">สถานการณ์สุ่มใหม่จากตัวอย่างจริงใน Oxford</p><p class="game-prompt">คุณต้องการพูดว่า: ${esc(x.exampleThai)}</p><div class="choice-stack">${opts.map(o=>`<button class="lab-choice" data-id="${o.id}">${esc(o.example)}</button>`).join('')}</div>`;
    b.querySelectorAll('[data-id]').forEach(btn=>btn.onclick=()=>{b.querySelectorAll('[data-id]').forEach(y=>y.disabled=true);if(String(btn.dataset.id)===String(x.id)){award(9);say(x.example);feedback(b,x.example);next(d,'dialog',1250)}else{miss();say(x.example);feedback(b,x.example,false);next(d,'dialog',1850)}});
  }
  function context(d){
    const x=q();if(!x)return;const b=d.querySelector('#gc56Body'),opts=shuffle([x,...shuffle(rows().filter(r=>r.id!==x.id)).slice(0,3)]),safe=x.word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),html=esc(x.example).replace(new RegExp(`\\b${safe}\\b`,'i'),m=>`<mark>${m}</mark>`);
    b.innerHTML=`<p class="game-sub">อ่านบริบท แล้วเลือกความหมายคำที่ไฮไลต์</p><p class="gc56-context">${html}</p><div class="choice-stack">${opts.map(o=>`<button class="lab-choice" data-id="${o.id}">${esc(o.thai)}</button>`).join('')}</div>`;
    b.querySelectorAll('[data-id]').forEach(btn=>btn.onclick=()=>{b.querySelectorAll('[data-id]').forEach(y=>y.disabled=true);if(String(btn.dataset.id)===String(x.id)){award();say(x.example);feedback(b,`${x.word} = ${x.thai}`);next(d,'context',1150)}else{miss();say(x.example);feedback(b,`${x.word} = ${x.thai}`,false);next(d,'context',1700)}});
  }
  function render(d,type){status(d);if(type==='builder')return builder(d);if(type==='gap')return gap(d);if(type==='translate')return translate(d);if(type==='dialog')return dialog(d);return context(d)}
  function openCustom(type){session={count:0,streak:0};const d=modal(type);render(d,type)}

  document.addEventListener('click',e=>{const t=e.target instanceof Element?e.target:null,card=t?.closest?.('[data-game]');if(!card||!CUSTOM.has(card.dataset.game))return;e.preventDefault();e.stopImmediatePropagation();openCustom(card.dataset.game)},true);

  function wrapOpen(){
    if(window.openAdaptiveGame&&window.openAdaptiveGame!==wrappedOpen&&!oldOpen){oldOpen=window.openAdaptiveGame;window.openAdaptiveGame=wrappedOpen;return}
    if(!oldOpen)setTimeout(wrapOpen,0);
  }
  function wrappedOpen(type){
    if(type==='mix'){
      const choices=['builder','gap','translate','dialog','context','match','listen','sprint','rush','memory','spell','trap'];const blocked=new Set(recent.type.slice(-4)),pool=choices.filter(x=>!blocked.has(x));type=shuffle(pool.length?pool:choices)[0];pushRecent('type',type,10)
    }
    if(CUSTOM.has(type))return openCustom(type);return oldOpen?.(type)
  }
  setTimeout(wrapOpen,0);

  const style=document.createElement('style');style.textContent=`#gameContentV56 .game-panel-head small{display:block;color:#67e8f9;margin-top:3px;font-size:10px}#gc56Status{color:#94a3b8!important}.gc56-feedback{margin-top:12px;padding:12px;border-radius:14px;background:rgba(15,23,42,.65);display:flex;gap:8px;flex-direction:column}.gc56-feedback b{color:#67e8f9}.gc56-feedback span{color:#e2e8f0;line-height:1.5}.gc56-context{font-size:clamp(18px,3.2vw,28px);line-height:1.65;text-align:center;padding:18px;border:1px solid rgba(148,163,184,.18);border-radius:16px;background:rgba(15,23,42,.55)}.gc56-context mark{background:rgba(34,211,238,.18);color:#67e8f9;border-radius:6px;padding:1px 4px}`;document.head.appendChild(style);
  window.GAME_CONTENT_VERSION=VERSION;
})();
