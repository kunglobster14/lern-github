(()=>{
  const VERSION='v62';
  const SUPPORTED=new Set(['mix','builder','gap','translate','dialog','context','match','listen','spell','memory','sprint','rush','trap']);
  const BASIC_TARGETS=new Set(`hello hi hey morning afternoon evening goodbye bye thank thanks please yes no okay ok good nice name friend family mother father brother sister man woman boy girl this that here there today tomorrow yesterday day night time one two three first last water food coffee tea home house room door window table chair phone school work go come get make do have be am is are was were can will like want need help sorry meet speak say tell see look eat drink`.split(/\s+/));
  const POLICY={
    starter:{levels:new Set(['A1','A2']),fallbackLevels:new Set(['A1','A2']),minWords:5,maxWords:15,minWordLen:4,choices:4,label:'Foundation Challenge'},
    basic:{levels:new Set(['A1','A2']),fallbackLevels:new Set(['A1','A2']),minWords:6,maxWords:17,minWordLen:5,choices:4,label:'A1–A2 Challenge'},
    intermediate:{levels:new Set(['A2','B1']),fallbackLevels:new Set(['A2','B1','B2']),minWords:8,maxWords:22,minWordLen:5,choices:4,label:'A2–B1 Challenge'},
    upper:{levels:new Set(['B1','B2']),fallbackLevels:new Set(['A2','B1','B2']),minWords:10,maxWords:28,minWordLen:5,choices:5,label:'B1–B2 Challenge'}
  };
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=v=>String(v||'').toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const level=()=>{try{return window.getLearnerLevel?.()||'starter'}catch{return'starter'}};
  const info=()=>window.getLearnerLevelInfo?.()||{cefr:level()};
  const say=text=>{try{if(typeof speak==='function')return speak(text);speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.82;speechSynthesis.speak(u)}catch{}};
  const countWords=s=>norm(s).split(/\s+/).filter(Boolean).length;
  const rxWord=w=>new RegExp(`\\b${String(w||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i');
  const currentPolicy=()=>POLICY[level()]||POLICY.starter;
  const day=()=>Math.max(1,Math.min(210,Number(window.getDailyCourseProgress?.().currentDay)||1));
  const difficulty=()=>Math.min(10,Math.max(2,2+((day()-1)/209)*8));
  const isBasic=w=>BASIC_TARGETS.has(norm(w));
  function wordAllowed(word,learner=level(),rowLevel=''){
    const p=POLICY[learner]||POLICY.starter,w=norm(word),lv=String(rowLevel||'').toUpperCase();
    if(!w||w.length<p.minWordLen||isBasic(w))return false;
    if(lv&&p.levels.size&&!p.levels.has(lv))return false;
    return true;
  }
  window.isHardGameWordAllowedV62=(word,learner='intermediate',rowLevel='')=>wordAllowed(word,learner,rowLevel);

  const mapRows=raw=>(Array.isArray(raw)?raw:[]).map((r,i)=>({id:r.id??i+1,word:String(r.word||'').trim(),thai:String(r.thai||'').trim(),level:String(r.level||'').toUpperCase(),part:String(r.part||''),example:String(r.example||'').trim(),exampleThai:String(r.exampleThai||'').trim()})).filter(r=>r.word&&r.thai&&r.example&&r.exampleThai);
  const relaxedWordAllowed=(r,p)=>{const w=norm(r.word),lv=String(r.level||'').toUpperCase();return !!w&&!isBasic(w)&&w.length>=Math.max(4,p.minWordLen-1)&&(!lv||p.levels.has(lv))};
  const fallbackWordAllowed=(r,p)=>{const w=norm(r.word),lv=String(r.level||'').toUpperCase();return !!w&&!isBasic(w)&&w.length>=4&&(!lv||p.fallbackLevels.has(lv))};
  const levelWeight=lv=>({B2:4,B1:3,A2:2,A1:1}[String(lv||'').toUpperCase()]||0);
  const complexityScore=r=>levelWeight(r.level)*100+Math.min(40,norm(r.word).length*4)+Math.min(40,countWords(r.example)*2)+(rxWord(r.word).test(r.example)?15:0);
  let rows=[],rowsKey='',readyPromise=null,session={count:0,streak:0,recent:[]};
  async function ensureRows(){
    const key=level();if(rows.length&&rowsKey===key)return rows;if(readyPromise)return readyPromise;
    readyPromise=(async()=>{
      try{await window.ensureOxford3000?.()}catch{}
      let raw=[];try{raw=window.getOxford3000?.()||[]}catch{}
      const p=currentPolicy(),all=mapRows(raw);
      let list=all.filter(r=>wordAllowed(r.word,level(),r.level)).filter(r=>{const n=countWords(r.example);return n>=p.minWords&&n<=p.maxWords&&rxWord(r.word).test(r.example)});
      if(list.length<180){
        const relaxed=all.filter(r=>relaxedWordAllowed(r,p)&&countWords(r.example)>=Math.max(5,p.minWords-4)).sort((a,b)=>complexityScore(b)-complexityScore(a));
        const seen=new Set(list.map(x=>String(x.id)));for(const r of relaxed){if(!seen.has(String(r.id))){seen.add(String(r.id));list.push(r);if(list.length>=240)break}}
      }
      if(list.length<120){
        const fallback=all.filter(r=>fallbackWordAllowed(r,p)&&countWords(r.example)>=5).sort((a,b)=>complexityScore(b)-complexityScore(a));
        const seen=new Set(list.map(x=>String(x.id)));for(const r of fallback){if(!seen.has(String(r.id))){seen.add(String(r.id));list.push(r);if(list.length>=180)break}}
      }
      rows=list;rowsKey=key;session.recent=[];return rows;
    })().finally(()=>{readyPromise=null});
    return readyPromise;
  }
  window.getHardGamePoolStatsV62=async()=>{const list=await ensureRows(),levelCounts={};list.forEach(r=>levelCounts[r.level||'unknown']=(levelCounts[r.level||'unknown']||0)+1);return{version:VERSION,learner:level(),rows:list.length,difficulty:Number(difficulty().toFixed(1)),levelCounts,basicTargetsExcluded:[...BASIC_TARGETS].filter(x=>list.some(r=>norm(r.word)===x))}};

  function closeGame(){const d=document.querySelector('#hardGameV62');if(!d)return;try{if(d.open)d.close()}catch{}d.remove()}
  function shell(type){
    closeGame();document.querySelector('#gameV59')?.remove();document.querySelector('#gameContentV56')?.remove();document.querySelector('#adaptiveGameV54')?.remove();window.__gameLabV31?.close?.();
    const p=currentPolicy(),d=document.createElement('dialog');d.id='hardGameV62';d.className='game-dialog v62-game';
    d.innerHTML=`<section class="game-panel"><header class="game-panel-head"><div><h2>🎯 ${esc(p.label)}</h2><small>${esc(info().cefr||level())} · Difficulty ${difficulty().toFixed(1)}/10 · ตัดคำพื้นฐานออกจากคำเป้าหมาย</small><small id="v62GameStatus">กำลังเตรียมคลังคำศัพท์ระดับนี้…</small></div><button class="game-close" type="button">×</button></header><div id="v62GameBody"><div class="v62-loading">กำลังคัดคำศัพท์และประโยคที่ท้าทายขึ้น…</div></div></section>`;
    document.body.appendChild(d);d.querySelector('.game-close').onclick=closeGame;d.addEventListener('cancel',e=>{e.preventDefault();closeGame()});d.addEventListener('click',e=>{if(e.target===d)closeGame()});if(d.showModal)d.showModal();else d.setAttribute('open','');return d;
  }
  function status(d,n,type){const e=d.querySelector('#v62GameStatus');if(e)e.textContent=`ข้อ ${session.count+1} · ต่อเนื่อง ${session.streak} · คลัง ${n.toLocaleString()} · ${type}`}
  function award(xp=9){session.count++;session.streak++;try{if(typeof state==='object'&&state){state.xp=(Number(state.xp)||0)+xp;typeof saveState==='function'&&saveState()}window.__gameLabV31?.addProgress?.('game',1)}catch{}}
  function miss(){session.count++;session.streak=0}
  function feedback(b,text,ok=true){let f=b.querySelector('.v62-game-feedback');if(!f){f=document.createElement('div');f.className='v62-game-feedback';b.appendChild(f)}f.innerHTML=`<b>${ok?'✓ ถูกต้อง':'เฉลยและเรียนรู้'}</b><span>${esc(text)}</span>`}
  function pick(list){if(!list.length)return null;const recent=new Set(session.recent.slice(-Math.min(100,Math.max(1,list.length-1)))),pool=list.filter(x=>!recent.has(String(x.id))),x=(pool.length?pool:list)[Math.floor(Math.random()*(pool.length||list.length))];if(x){session.recent.push(String(x.id));if(session.recent.length>140)session.recent.shift()}return x}
  function similarRows(list,x,n){const wc=countWords(x.example),same=list.filter(r=>r.id!==x.id&&(!x.part||!r.part||r.part===x.part)).sort((a,b)=>Math.abs(countWords(a.example)-wc)-Math.abs(countWords(b.example)-wc));return shuffle(same.slice(0,Math.max(20,n*8))).slice(0,n)}
  function next(d,type,list,ms=1250){setTimeout(()=>{if(document.body.contains(d))render(d,type,list)},ms)}
  function chooseMode(type){if(!['mix','sprint','rush','trap'].includes(type))return type;const modes=['builder','gap','translate','dialog','context','listen','spell','memory'];return modes[(session.count+day()*3)%modes.length]}
  function builder(d,list){const x=pick(list);if(!x)return error(d);const b=d.querySelector('#v62GameBody'),target=x.example.replace(/[.!?]$/,''),tokens=target.split(/\s+/),chosen=[],items=tokens.map((t,i)=>({t,i}));b.innerHTML=`<div class="v62-game-kicker">Sentence reconstruction</div><p class="game-prompt">${esc(x.exampleThai)}</p><p class="game-sub">เรียงประโยคเต็ม ห้ามใช้คำแปลเดาง่าย</p><div class="builder-answer" id="v62Built"></div><div class="builder-pool" id="v62Tokens"></div><div class="lab-actions"><button class="lab-secondary" id="v62Reset">เริ่มใหม่</button><button class="lab-primary" id="v62Check">ตรวจ</button></div>`;const built=b.querySelector('#v62Built'),box=b.querySelector('#v62Tokens');const draw=()=>{built.textContent=chosen.map(o=>o.t).join(' ');const used=new Set(chosen.map(o=>o.i));box.innerHTML=shuffle(items).map(o=>`<button class="token-btn" data-i="${o.i}" ${used.has(o.i)?'disabled':''}>${esc(o.t)}</button>`).join('');box.querySelectorAll('[data-i]').forEach(btn=>btn.onclick=()=>{const o=items[Number(btn.dataset.i)];if(!used.has(o.i)){chosen.push(o);draw()}})};draw();b.querySelector('#v62Reset').onclick=()=>{chosen.length=0;draw()};b.querySelector('#v62Check').onclick=()=>{const ok=norm(chosen.map(o=>o.t).join(' '))===norm(target);if(ok){award();say(x.example);feedback(b,x.example);next(d,'builder',list)}else{miss();feedback(b,x.example,false);next(d,'builder',list,1850)}}}
  function gap(d,list){const x=pick(list);if(!x)return error(d);if(!rxWord(x.word).test(x.example))return translate(d,list);const b=d.querySelector('#v62GameBody'),blank=x.example.replace(rxWord(x.word),'_____'),alts=similarRows(list,x,currentPolicy().choices-1).filter(r=>r.word&&norm(r.word)!==norm(x.word)),opts=shuffle([x,...alts]).slice(0,currentPolicy().choices);b.innerHTML=`<div class="v62-game-kicker">Precision vocabulary</div><p class="game-prompt">${esc(blank)}</p><p class="game-sub">เลือกคำที่เหมาะกับบริบทที่สุด</p><div class="choice-stack">${opts.map(o=>`<button class="lab-choice" data-id="${esc(o.id)}"><b>${esc(o.word)}</b><small>${esc(o.part||o.level)}</small></button>`).join('')}</div>`;b.querySelectorAll('[data-id]').forEach(btn=>btn.onclick=()=>{b.querySelectorAll('[data-id]').forEach(y=>y.disabled=true);if(String(btn.dataset.id)===String(x.id)){award();say(x.example);feedback(b,`${x.word} = ${x.thai}`);next(d,'gap',list)}else{miss();feedback(b,`${x.word} = ${x.thai} · ${x.example}`,false);next(d,'gap',list,1850)}})}
  function translate(d,list){const x=pick(list);if(!x)return error(d);const b=d.querySelector('#v62GameBody'),opts=shuffle([x,...similarRows(list,x,currentPolicy().choices-1)]).slice(0,currentPolicy().choices);b.innerHTML=`<div class="v62-game-kicker">Thai → English in context</div><p class="game-prompt">${esc(x.exampleThai)}</p><p class="game-sub">เลือกประโยคที่ตรงที่สุด ตัวเลือกถูกคัดให้มีระดับและความยาวใกล้กัน</p><div class="choice-stack">${opts.map(o=>`<button class="lab-choice" data-id="${esc(o.id)}">${esc(o.example)}</button>`).join('')}</div>`;b.querySelectorAll('[data-id]').forEach(btn=>btn.onclick=()=>{b.querySelectorAll('[data-id]').forEach(y=>y.disabled=true);if(String(btn.dataset.id)===String(x.id)){award();say(x.example);feedback(b,x.example);next(d,'translate',list)}else{miss();feedback(b,x.example,false);next(d,'translate',list,1900)}})}
  function dialog(d,list){const x=pick(list);if(!x)return error(d);const b=d.querySelector('#v62GameBody'),opts=shuffle([x,...similarRows(list,x,currentPolicy().choices-1)]).slice(0,currentPolicy().choices);b.innerHTML=`<div class="v62-game-kicker">Situational response</div><p class="game-sub">คุณต้องสื่อสารความหมายนี้ในสถานการณ์จริง</p><p class="game-prompt">“${esc(x.exampleThai)}”</p><div class="choice-stack">${opts.map(o=>`<button class="lab-choice" data-id="${esc(o.id)}">${esc(o.example)}</button>`).join('')}</div>`;b.querySelectorAll('[data-id]').forEach(btn=>btn.onclick=()=>{b.querySelectorAll('[data-id]').forEach(y=>y.disabled=true);if(String(btn.dataset.id)===String(x.id)){award(10);say(x.example);feedback(b,x.example);next(d,'dialog',list)}else{miss();feedback(b,x.example,false);next(d,'dialog',list,1900)}})}
  function context(d,list){const x=pick(list);if(!x)return error(d);if(!rxWord(x.word).test(x.example))return gap(d,list);const b=d.querySelector('#v62GameBody'),alts=similarRows(list,x,currentPolicy().choices-1),opts=shuffle([x,...alts]).slice(0,currentPolicy().choices),html=esc(x.example).replace(rxWord(esc(x.word)),m=>`<mark>${m}</mark>`);b.innerHTML=`<div class="v62-game-kicker">Context Detective</div><p class="g59-context">${html}</p><p class="game-sub">เลือกความหมายของคำเป้าหมายจากบริบท</p><div class="choice-stack">${opts.map(o=>`<button class="lab-choice" data-id="${esc(o.id)}">${esc(o.thai)}</button>`).join('')}</div>`;b.querySelectorAll('[data-id]').forEach(btn=>btn.onclick=()=>{b.querySelectorAll('[data-id]').forEach(y=>y.disabled=true);if(String(btn.dataset.id)===String(x.id)){award();say(x.example);feedback(b,`${x.word} = ${x.thai}`);next(d,'context',list)}else{miss();feedback(b,`${x.word} = ${x.thai}`,false);next(d,'context',list,1800)}})}
  function listen(d,list){const x=pick(list);if(!x)return error(d);const b=d.querySelector('#v62GameBody'),opts=shuffle([x,...similarRows(list,x,currentPolicy().choices-1)]).slice(0,currentPolicy().choices);b.innerHTML=`<div class="v62-game-kicker">Listening comprehension</div><button class="v62-listen-btn" id="v62Listen">🔊 ฟังประโยค</button><p class="game-sub">ฟังโดยไม่เห็นข้อความ แล้วเลือกความหมายที่ตรงที่สุด</p><div class="choice-stack">${opts.map(o=>`<button class="lab-choice" data-id="${esc(o.id)}">${esc(o.exampleThai)}</button>`).join('')}</div>`;b.querySelector('#v62Listen').onclick=()=>say(x.example);setTimeout(()=>say(x.example),120);b.querySelectorAll('[data-id]').forEach(btn=>btn.onclick=()=>{b.querySelectorAll('[data-id]').forEach(y=>y.disabled=true);if(String(btn.dataset.id)===String(x.id)){award(10);feedback(b,x.example);next(d,'listen',list)}else{miss();feedback(b,`${x.example} · ${x.exampleThai}`,false);next(d,'listen',list,1900)}})}
  function spell(d,list){const x=pick(list);if(!x)return error(d);const b=d.querySelector('#v62GameBody');b.innerHTML=`<div class="v62-game-kicker">Active spelling</div><p class="game-prompt">${esc(x.thai)}</p><p class="game-sub">ฟังคำเป้าหมาย แล้วพิมพ์ภาษาอังกฤษให้ถูกต้อง</p><button class="v62-listen-btn" id="v62WordListen">🔊 ฟังคำ</button><input class="v62-game-input" id="v62SpellInput" autocomplete="off" spellcheck="false" placeholder="พิมพ์คำศัพท์"><button class="lab-primary" id="v62SpellCheck">ตรวจ</button>`;b.querySelector('#v62WordListen').onclick=()=>say(x.word);setTimeout(()=>say(x.word),120);b.querySelector('#v62SpellCheck').onclick=()=>{const ok=norm(b.querySelector('#v62SpellInput').value)===norm(x.word);if(ok){award();say(x.example);feedback(b,`${x.word} · ${x.example}`);next(d,'spell',list)}else{miss();feedback(b,`${x.word} = ${x.thai}`,false);next(d,'spell',list,1800)}}}
  function memory(d,list){const x=pick(list);if(!x)return error(d);const b=d.querySelector('#v62GameBody');b.innerHTML=`<div class="v62-game-kicker">Memory recall</div><p class="game-sub">อ่านประโยคให้เข้าใจ แล้วซ่อนข้อความและพิมพ์จากความจำ</p><p class="game-prompt" id="v62MemoryText">${esc(x.example)}</p><button class="lab-secondary" id="v62Hide">ซ่อนข้อความและเริ่มตอบ</button><div id="v62MemoryAnswer" hidden><p>${esc(x.exampleThai)}</p><input class="v62-game-input" id="v62MemoryInput" autocomplete="off" spellcheck="false" placeholder="พิมพ์ประโยคจากความจำ"><button class="lab-primary" id="v62MemoryCheck">ตรวจ</button></div>`;b.querySelector('#v62Hide').onclick=()=>{b.querySelector('#v62MemoryText').textContent='••••••••••';b.querySelector('#v62Hide').hidden=true;b.querySelector('#v62MemoryAnswer').hidden=false;b.querySelector('#v62MemoryInput').focus()};b.querySelector('#v62MemoryCheck').onclick=()=>{const ok=norm(b.querySelector('#v62MemoryInput').value)===norm(x.example);if(ok){award(11);say(x.example);feedback(b,x.example);next(d,'memory',list)}else{miss();feedback(b,x.example,false);next(d,'memory',list,2000)}}}
  function error(d){d.querySelector('#v62GameBody').innerHTML='<p class="game-prompt">ยังเตรียมคลังคำระดับนี้ไม่ได้</p><p class="game-sub">ลองเปิดเกมอีกครั้งหลัง Oxford โหลดเสร็จ</p>'}
  function render(d,type,list){const mode=chooseMode(type);status(d,list.length,mode);({builder,gap,translate,dialog,context,match:context,listen,spell,memory}[mode]||translate)(d,list)}
  async function open(type='mix'){
    type=SUPPORTED.has(type)?type:'mix';const d=shell(type);const list=await ensureRows();if(!document.body.contains(d))return;if(!list.length)return error(d);render(d,type,list)
  }
  window.openHardGameV62=open;
  window.HARD_GAME_VERSION=VERSION;

  window.addEventListener('click',e=>{
    const t=e.target instanceof Element?e.target:null;if(!t)return;
    const direct=t.closest?.('[data-game]');
    if(direct&&SUPPORTED.has(direct.dataset.game)){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();open(direct.dataset.game);return}
    if(t.closest?.('#lx55Game')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();open('mix')}
  },true);
})();