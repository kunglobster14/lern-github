(()=>{
  const VERSION='v59';
  const previousGet=window.getDailyLesson;
  if(typeof previousGet!=='function')return;

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  const norm=v=>String(v||'').toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const uniqBy=(arr,key)=>{const seen=new Set();return arr.filter(x=>{const k=key(x);if(!k||seen.has(k))return false;seen.add(k);return true})};
  const say=text=>{try{if(typeof speak==='function')return speak(text);speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.86;speechSynthesis.speak(u)}catch{}};
  const cefrLevels=cefr=>['A1','A2','B1','B2'].filter(x=>String(cefr||'').includes(x));
  const level=()=>{try{return window.getLearnerLevel?.()||'starter'}catch{return'starter'}};
  const levelInfo=()=>window.getLearnerLevelInfo?.()||{label:level(),cefr:level(),cefrLevels:[]};

  let oxfordReady=false;
  let oxfordRows=[];
  let lessonMap=new Map();
  let buildPromise=null;

  function readOxfordRows(){
    let list=[];try{list=window.getOxford3000?.()||[]}catch{}
    return (Array.isArray(list)?list:[]).map((r,i)=>({
      id:r.id??i+1,
      word:String(r.word||'').trim(),
      thai:String(r.thai||'').trim(),
      level:String(r.level||'').toUpperCase(),
      part:String(r.part||''),
      example:String(r.example||'').trim(),
      exampleThai:String(r.exampleThai||'').trim()
    })).filter(r=>r.word&&r.thai&&r.example&&r.exampleThai);
  }

  async function ensureOxford(){
    if(oxfordReady&&oxfordRows.length)return oxfordRows;
    if(buildPromise)return buildPromise;
    buildPromise=(async()=>{
      try{if(typeof window.ensureOxford3000==='function')await window.ensureOxford3000()}catch{}
      oxfordRows=readOxfordRows();
      oxfordReady=oxfordRows.length>0;
      if(oxfordReady)rebuildLessons();
      return oxfordRows;
    })().finally(()=>{buildPromise=null});
    return buildPromise;
  }

  function rowScore(row,terms){
    const w=norm(row.word),ex=` ${norm(row.example)} `;
    let score=0;
    terms.forEach((t,i)=>{
      if(!t)return;
      if(w===t)score+=80-i*4;
      if(t.length>2&&ex.includes(` ${t} `))score+=18-i;
    });
    return score;
  }

  function chooseRows(base,day,usedPrimary){
    const allowedSet=new Set(cefrLevels(base.cefr));
    const allowed=oxfordRows.filter(r=>!allowedSet.size||allowedSet.has(r.level));
    const terms=uniqBy((base.vocab||[]).map(v=>norm(v.en)).filter(Boolean),x=>x).slice(0,8);
    const ranked=allowed.map(r=>({r,score:rowScore(r,terms)})).sort((a,b)=>b.score-a.score||(Number(a.r.id)||0)-(Number(b.r.id)||0));
    const exact=ranked.filter(x=>x.score>=70&&!usedPrimary.has(String(x.r.id)));
    const related=ranked.filter(x=>x.score>0&&!usedPrimary.has(String(x.r.id)));
    const unused=ranked.filter(x=>!usedPrimary.has(String(x.r.id)));
    const primary=(exact[0]||related[(day*11)%Math.max(1,related.length)]||unused[(day*17)%Math.max(1,unused.length)]||ranked[0])?.r||null;
    if(primary)usedPrimary.add(String(primary.id));
    const companionPool=ranked.filter(x=>primary&&String(x.r.id)!==String(primary.id)&&x.score>0).map(x=>x.r);
    const fallbackPool=ranked.filter(x=>!primary||String(x.r.id)!==String(primary.id)).map(x=>x.r);
    const pool=companionPool.length>=5?companionPool:fallbackPool;
    const companions=[];let start=pool.length?(day*23)%pool.length:0;
    for(let i=0;i<pool.length&&companions.length<5;i++){
      const r=pool[(start+i*13)%pool.length];
      if(!companions.some(x=>String(x.id)===String(r.id)))companions.push(r);
    }
    return {primary,companions};
  }

  function decorateWithRows(base,day,usedPrimary){
    const {primary,companions}=chooseRows(base,day,usedPrimary);
    if(!primary)return fallbackDecorate(base,day);
    const baseVocab=(base.vocab||[]).map(v=>({en:v.en,th:v.th,source:v.source||'course'}));
    const rowVocab=[primary,...companions].map(r=>({en:r.word,th:r.th,source:'oxford-v59',oxfordId:r.id}));
    const vocab=uniqBy([
      rowVocab[0],
      ...baseVocab.slice(0,2),
      ...rowVocab.slice(1)
    ].filter(Boolean),v=>norm(v.en)).slice(0,6);
    const exampleRows=uniqBy([primary,...companions],r=>norm(r.example)).slice(0,4);
    const examples=exampleRows.map(r=>r.example);
    const examplePairs=exampleRows.map(r=>({en:r.example,th:r.exampleThai,word:r.word,wordThai:r.thai,id:r.id}));
    const focusWord={en:primary.word,th:primary.thai,source:'oxford-v59',oxfordId:primary.id};
    const title=`${base.title} · ${primary.word}`;
    const goal=`${String(base.goal||'').replace(/\s*·\s*โฟกัสการใช้.*$/,'')} · บทนี้เน้น “${primary.word}” (${primary.thai}) และประโยคใหม่เฉพาะบท`;
    const scenario=`${String(base.scenario||'').replace(/\s*·\s*ฝึกใช้.*$/,'')} · ใช้ “${primary.word}” ในสถานการณ์ของบทนี้`;
    const prompt=`${String(base.prompt||'').replace(/\s*·\s*ใช้คำ.*$/,'')} · ฝึกประโยค “${primary.example}” แล้วนำ ${primary.word} ไปแต่งประโยคของคุณเอง`;
    return {...base,title,goal,scenario,prompt,vocab,examples,example:examples[0],examplePairs,focusWord,contentVersion:VERSION};
  }

  function fallbackDecorate(base,day){
    const vocab=[...(base.vocab||[])];
    if(vocab.length){const shift=(day-1)%vocab.length;vocab.push(...vocab.splice(0,shift))}
    const focus=vocab[0]||base.focusWord||{en:'practice',th:'ฝึก'};
    const examples=uniqBy([...(base.examples||[]),base.example].filter(Boolean),norm);
    const shift=examples.length?(day-1)%examples.length:0;const rotated=[...examples.slice(shift),...examples.slice(0,shift)];
    return {...base,vocab,examples:rotated,example:rotated[0]||base.example,focusWord:focus,contentVersion:'v59-pending'};
  }

  function rebuildLessons(){
    if(!oxfordRows.length)return;
    const next=new Map(),usedPrimary=new Set();
    for(let day=1;day<=210;day++)next.set(day,decorateWithRows(previousGet(day),day,usedPrimary));
    lessonMap=next;
    setTimeout(()=>{
      patchCourseCard();
      window.patchLearningExperienceV55?.();
      document.dispatchEvent(new CustomEvent('curriculum-v59:ready',{detail:{lessons:lessonMap.size}}));
    },0);
  }

  function getLesson(day){
    const n=Math.max(1,Math.min(210,Number(day)||Number(window.getDailyCourseProgress?.().currentDay)||1));
    if(lessonMap.has(n))return lessonMap.get(n);
    return fallbackDecorate(previousGet(n),n);
  }
  window.getDailyLesson=getLesson;

  function thaiForEnglish(text,lesson){
    const key=norm(text);
    const p=(lesson?.examplePairs||[]).find(x=>norm(x.en)===key);
    if(p?.th)return p.th;
    const r=oxfordRows.find(x=>norm(x.example)===key);
    return r?.exampleThai||'';
  }

  function patchMiniResponse(day){
    const d=document.querySelector('#lessonExperienceV55');if(!d)return;
    const l=getLesson(day||window.getDailyCourseProgress?.().currentDay);
    const examples=(l.examples||[]).filter(Boolean),correct=examples[1]||examples[0]||'';
    const thai=thaiForEnglish(correct,l);
    const section=d.querySelector('[data-act="dialog"]');if(!section)return;
    const h=section.querySelector('header h2'),p=section.querySelector('header p'),bubble=section.querySelector('.lx55-bubble.other');
    if(h)h.textContent='Mini Response · เลือกประโยคให้ตรงความหมาย';
    if(p)p.textContent='อ่านความหมายภาษาไทย แล้วเลือกประโยคอังกฤษที่ตรงกัน';
    if(bubble)bubble.textContent=thai?`สถานการณ์: คุณต้องการพูดว่า “${thai}”`:`สถานการณ์: ${l.scenario}`;
    const q=bubble?.nextElementSibling;if(q)q.textContent=thai?'ประโยคไหนตรงกับความหมายนี้?':'ประโยคไหนเหมาะกับสถานการณ์นี้มากที่สุด?';
    section.dataset.v59='clear-response';
    window.patchLessonTerminologyV58?.();
  }

  function patchCourseCard(){
    const card=document.querySelector('#dailyCourseCard');if(!card)return;
    const day=window.getDailyCourseProgress?.().currentDay,l=getLesson(day);if(!l)return;
    const title=card.querySelector('.daily-today-main h3'),goal=card.querySelector('.daily-today-main p'),pattern=card.querySelector('.daily-pattern b'),vocab=card.querySelector('.daily-vocab');
    if(title)title.textContent=l.title;if(goal)goal.textContent=l.goal;if(pattern)pattern.textContent=l.pattern;
    if(vocab)vocab.innerHTML=l.vocab.map(v=>`<span><b>${esc(v.en)}</b> ${esc(v.th)}</span>`).join('');
    window.patchLessonTerminologyV58?.();
  }

  const CUSTOM=new Set(['builder','gap','translate','dialog','context']);
  const GAME_META={builder:['🧱','Sentence Builder'],gap:['🔤','Missing Word'],translate:['🇹🇭','Thai → English'],dialog:['🗣️','Survival Dialog'],context:['🔎','Context Detective']};
  const gameRecent={sentence:[],type:[]};
  let gameSession={count:0,streak:0};
  let baseAdaptiveOpen=null;
  let sentenceCache={key:'',rows:[]};

  function pushRecent(bucket,key,max=140){const a=gameRecent[bucket];a.push(String(key));if(a.length>max)a.splice(0,a.length-max)}
  function pickNR(rows,key=x=>x.id){
    if(!rows.length)return null;const blocked=new Set(gameRecent.sentence.slice(-Math.min(120,Math.max(1,rows.length-1))));
    const pool=rows.filter(x=>!blocked.has(String(key(x)))),q=(pool.length?pool:rows)[Math.floor(Math.random()*(pool.length||rows.length))];
    if(q)pushRecent('sentence',key(q));return q;
  }

  const FALLBACK={
    starter:[['ฉันเหนื่อย','I am tired.'],['ฉันพร้อมแล้ว','I am ready.'],['ฉันต้องการน้ำ','I want water.'],['ฉันต้องการความช่วยเหลือ','I need help.'],['ฉันชอบกาแฟ','I like coffee.'],['ห้องน้ำอยู่ที่ไหน','Where is the bathroom?']],
    basic:[['ฉันไปทำงานทุกวัน','I go to work every day.'],['คุณชอบกาแฟไหม','Do you like coffee?'],['อันนี้ราคาเท่าไร','How much is this?'],['สถานีอยู่ที่ไหน','Where is the station?'],['ฉันกำลังรอรถบัส','I am waiting for the bus.'],['ฉันมีประชุมตอนสิบโมง','I have a meeting at ten.']],
    intermediate:[['เมื่อวานฉันไปทำงาน','Yesterday I went to work.'],['พรุ่งนี้ฉันจะทำงาน','Tomorrow I will work.'],['ฉันกำลังทำรายงานอยู่','I am working on a report.'],['มีปัญหากับห้องของฉัน','There is a problem with my room.'],['ฉันคิดว่ามันแพงเกินไป','I think it is too expensive.'],['ช่วยพูดอีกครั้งได้ไหม','Could you say that again?']],
    upper:[['ในความเห็นของฉัน เราควรเปลี่ยนแผน','In my opinion, we should change the plan.'],['แม้ว่าเที่ยวบินจะล่าช้า เราก็ยังไปถึงตรงเวลา','Although the flight was delayed, we arrived on time.'],['ถ้าฉันมีเวลามากกว่านี้ ฉันจะเรียนทุกวัน','If I had more time, I would study every day.'],['ปัญหานี้ต้องได้รับการแก้ไขก่อนประชุม','This problem must be fixed before the meeting.'],['เราควรหารือเรื่องนี้ก่อนตัดสินใจ','We should discuss this before making a decision.'],['ทางเลือกนี้มีประสิทธิภาพมากกว่าเพราะประหยัดเวลา','This option is more effective because it saves time.']]
  };

  async function gameSentenceRows(){
    await ensureOxford();
    const i=levelInfo(),allowed=new Set(i.cefrLevels||cefrLevels(i.cefr));
    const key=`${level()}|${oxfordRows.length}`;
    if(sentenceCache.key===key&&sentenceCache.rows.length)return sentenceCache.rows;
    let list=oxfordRows.filter(r=>(!allowed.size||allowed.has(r.level))&&r.example&&r.exampleThai).map(r=>({id:`ox:${r.id}`,word:r.word,thai:r.thai,example:r.example,exampleThai:r.exampleThai,level:r.level}));
    if(!list.length){
      const around=[];const cur=Number(window.getDailyCourseProgress?.().currentDay)||1;
      for(let day=Math.max(1,cur-12);day<=Math.min(210,cur+12);day++){
        const l=getLesson(day);(l.examplePairs||[]).forEach((p,j)=>around.push({id:`lesson:${day}:${j}`,word:p.word||'',thai:p.wordThai||'',example:p.en,exampleThai:p.th,level:l.cefr}));
      }
      list=uniqBy(around,x=>norm(x.example));
    }
    if(list.length<4){
      (FALLBACK[level()]||FALLBACK.starter).forEach((x,j)=>list.push({id:`fallback:${level()}:${j}`,word:'',thai:'',example:x[1],exampleThai:x[0],level:i.cefr||''}));
      list=uniqBy(list,x=>norm(x.example));
    }
    sentenceCache={key,rows:list};return list;
  }

  function closeGame(){const d=document.querySelector('#gameV59');if(!d)return;try{if(d.open)d.close()}catch{}d.remove()}
  function gameModal(type){
    closeGame();document.querySelector('#gameContentV56')?.remove();document.querySelector('#adaptiveGameV54')?.remove();window.__gameLabV31?.close?.();
    const meta=GAME_META[type]||['🎮','Game'],i=levelInfo(),d=document.createElement('dialog');d.id='gameV59';d.className='game-dialog';
    d.innerHTML=`<section class="game-panel"><header class="game-panel-head"><div><h2>${meta[0]} ${esc(meta[1])}</h2><small>${esc(i.cefr||level())} · คลังประโยค Oxford ตามระดับ</small><small id="g59Status">กำลังโหลดคลังประโยค…</small></div><button class="game-close" type="button">×</button></header><div id="g59Body"><div class="g59-loading">กำลังเตรียมประโยคตามระดับ…</div></div></section>`;
    document.body.appendChild(d);d.querySelector('.game-close').onclick=closeGame;d.addEventListener('cancel',e=>{e.preventDefault();closeGame()});d.addEventListener('click',e=>{if(e.target===d)closeGame()});if(d.showModal)d.showModal();else d.setAttribute('open','');return d;
  }
  function statusGame(d,count){const e=d.querySelector('#g59Status');if(e)e.textContent=`ข้อ ${gameSession.count+1} · ต่อเนื่อง ${gameSession.streak} · ประโยค ${Number(count||0).toLocaleString()}`}
  function award(xp=8){gameSession.count++;gameSession.streak++;try{if(typeof state==='object'&&state){state.xp=(Number(state.xp)||0)+xp;if(typeof saveState==='function')saveState()}window.__gameLabV31?.addProgress?.('game',1)}catch{}}
  function miss(){gameSession.count++;gameSession.streak=0}
  function feedback(body,text,ok=true){let e=body.querySelector('.g59-feedback');if(!e){e=document.createElement('div');e.className='g59-feedback';body.appendChild(e)}e.innerHTML=`<b>${ok?'✓ ถูกต้อง':'เฉลย'}</b><span>${esc(text)}</span>`}
  function nextGame(d,type,rows,delay=1200){statusGame(d,rows.length);setTimeout(()=>{if(document.body.contains(d))renderGame(d,type,rows)},delay)}
  function alternatives(rows,target,n=3){return shuffle(rows.filter(x=>x.id!==target.id)).slice(0,n)}

  function builderGame(d,rows){
    const x=pickNR(rows);if(!x)return gameError(d);const b=d.querySelector('#g59Body'),target=x.example.replace(/[.!?]$/,''),tokens=target.split(/\s+/),chosen=[],objs=tokens.map((t,i)=>({t,i}));
    b.innerHTML=`<p class="game-prompt">${esc(x.exampleThai)}</p><p class="game-sub">เรียงคำเป็นประโยคอังกฤษให้ตรงกับความหมาย</p><div class="builder-answer" id="g59Built"></div><div class="builder-pool" id="g59Tokens"></div><div class="lab-actions"><button class="lab-secondary" id="g59Reset">เริ่มใหม่</button><button class="lab-primary" id="g59Check">ตรวจ</button></div>`;
    const built=b.querySelector('#g59Built'),box=b.querySelector('#g59Tokens');const draw=()=>{built.textContent=chosen.map(o=>o.t).join(' ');const used=new Set(chosen.map(o=>o.i));box.innerHTML=shuffle(objs).map(o=>`<button class="token-btn" data-i="${o.i}" ${used.has(o.i)?'disabled':''}>${esc(o.t)}</button>`).join('');box.querySelectorAll('[data-i]').forEach(btn=>btn.onclick=()=>{const o=objs[Number(btn.dataset.i)];if(!used.has(o.i)){chosen.push(o);draw()}})};draw();
    b.querySelector('#g59Reset').onclick=()=>{chosen.length=0;draw()};b.querySelector('#g59Check').onclick=()=>{if(norm(chosen.map(o=>o.t).join(' '))===norm(target)){award(9);say(x.example);feedback(b,x.example);nextGame(d,'builder',rows,1200)}else{miss();say(x.example);feedback(b,x.example,false);nextGame(d,'builder',rows,1800)}};
  }
  function gapGame(d,rows){
    const x=pickNR(rows);if(!x)return gameError(d);const b=d.querySelector('#g59Body'),tokens=x.example.replace(/[.!?]$/,'').split(/\s+/),c=tokens.map((w,i)=>({w,i})).filter(o=>o.w.replace(/[^A-Za-z']/g,'').length>2),p=c[Math.floor(Math.random()*c.length)]||{w:tokens[0],i:0},answer=p.w,blank=tokens.map((w,i)=>i===p.i?'_____':w).join(' '),wordPool=uniqBy(rows.flatMap(r=>r.example.split(/\s+/)).map(w=>w.replace(/[^A-Za-z']/g,'')).filter(w=>w.length>2&&norm(w)!==norm(answer)),norm),opts=shuffle([answer,...shuffle(wordPool).slice(0,3)]);
    b.innerHTML=`<p class="game-prompt">${esc(x.exampleThai)}</p><div class="v53-gap">${esc(blank)}</div><div class="choice-stack">${opts.map(w=>`<button class="lab-choice" data-a="${esc(w)}">${esc(w)}</button>`).join('')}</div>`;
    b.querySelectorAll('[data-a]').forEach(btn=>btn.onclick=()=>{b.querySelectorAll('[data-a]').forEach(y=>y.disabled=true);if(norm(btn.dataset.a)===norm(answer)){award();say(x.example);feedback(b,x.example);nextGame(d,'gap',rows,1150)}else{miss();say(x.example);feedback(b,x.example,false);nextGame(d,'gap',rows,1700)}});
  }
  function translateGame(d,rows){
    const x=pickNR(rows);if(!x)return gameError(d);const opts=shuffle([x,...alternatives(rows,x)]),b=d.querySelector('#g59Body');b.innerHTML=`<p class="game-prompt">${esc(x.exampleThai)}</p><p class="game-sub">เลือกประโยคภาษาอังกฤษที่ตรงกับความหมาย</p><div class="choice-stack">${opts.map(o=>`<button class="lab-choice" data-id="${esc(o.id)}">${esc(o.example)}</button>`).join('')}</div>`;
    b.querySelectorAll('[data-id]').forEach(btn=>btn.onclick=()=>{b.querySelectorAll('[data-id]').forEach(y=>y.disabled=true);if(String(btn.dataset.id)===String(x.id)){award();say(x.example);feedback(b,x.example);nextGame(d,'translate',rows,1200)}else{miss();say(x.example);feedback(b,x.example,false);nextGame(d,'translate',rows,1800)}});
  }
  function dialogGame(d,rows){
    const x=pickNR(rows);if(!x)return gameError(d);const opts=shuffle([x,...alternatives(rows,x)]),b=d.querySelector('#g59Body');b.innerHTML=`<p class="game-sub">สถานการณ์: คุณต้องการสื่อความหมายด้านล่างให้คู่สนทนา</p><p class="game-prompt">“${esc(x.exampleThai)}”</p><p class="game-sub">คุณควรพูดประโยคไหน?</p><div class="choice-stack">${opts.map(o=>`<button class="lab-choice" data-id="${esc(o.id)}">${esc(o.example)}</button>`).join('')}</div>`;
    b.querySelectorAll('[data-id]').forEach(btn=>btn.onclick=()=>{b.querySelectorAll('[data-id]').forEach(y=>y.disabled=true);if(String(btn.dataset.id)===String(x.id)){award(9);say(x.example);feedback(b,x.example);nextGame(d,'dialog',rows,1250)}else{miss();say(x.example);feedback(b,x.example,false);nextGame(d,'dialog',rows,1850)}});
  }
  function contextGame(d,rows){
    const x=pickNR(rows);if(!x)return gameError(d);const target=x.word&&new RegExp(`\\b${x.word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i').test(x.example)?x:null;
    if(!target)return translateGame(d,rows);const b=d.querySelector('#g59Body'),opts=shuffle([x,...shuffle(rows.filter(r=>r.id!==x.id&&r.thai)).slice(0,3)]),html=esc(x.example).replace(new RegExp(`\\b${x.word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i'),m=>`<mark>${m}</mark>`);
    b.innerHTML=`<p class="game-sub">อ่านประโยค แล้วเดาความหมายของคำที่ไฮไลต์</p><p class="g59-context">${html}</p><div class="choice-stack">${opts.map(o=>`<button class="lab-choice" data-id="${esc(o.id)}">${esc(o.thai||o.exampleThai)}</button>`).join('')}</div>`;
    b.querySelectorAll('[data-id]').forEach(btn=>btn.onclick=()=>{b.querySelectorAll('[data-id]').forEach(y=>y.disabled=true);if(String(btn.dataset.id)===String(x.id)){award();say(x.example);feedback(b,`${x.word} = ${x.thai}`);nextGame(d,'context',rows,1150)}else{miss();say(x.example);feedback(b,`${x.word} = ${x.thai}`,false);nextGame(d,'context',rows,1700)}});
  }
  function gameError(d){const b=d.querySelector('#g59Body');if(b)b.innerHTML='<div class="g59-loading">ยังเตรียมคลังประโยคไม่สำเร็จ กรุณาปิดแล้วเปิดเกมใหม่</div>'}
  function renderGame(d,type,rows){statusGame(d,rows.length);if(type==='builder')return builderGame(d,rows);if(type==='gap')return gapGame(d,rows);if(type==='translate')return translateGame(d,rows);if(type==='dialog')return dialogGame(d,rows);return contextGame(d,rows)}
  async function openCustomGame(type){
    gameSession={count:0,streak:0};const d=gameModal(type),rows=await gameSentenceRows();if(!document.body.contains(d))return;statusGame(d,rows.length);if(!rows.length)return gameError(d);renderGame(d,type,rows);
  }

  function openAdaptiveV59(type){
    if(type==='mix'){
      const choices=['builder','gap','translate','dialog','context','match','listen','sprint','rush','memory','spell','trap'];const blocked=new Set(gameRecent.type.slice(-4)),pool=choices.filter(x=>!blocked.has(x));type=shuffle(pool.length?pool:choices)[0];pushRecent('type',type,10)
    }
    if(CUSTOM.has(type))return openCustomGame(type);
    return baseAdaptiveOpen?.(type);
  }
  function installGameWrapper(){
    if(window.openAdaptiveGame===openAdaptiveV59)return;
    if(typeof window.openAdaptiveGame==='function')baseAdaptiveOpen=window.openAdaptiveGame;
    window.openAdaptiveGame=openAdaptiveV59;
  }

  window.addEventListener('click',e=>{
    const t=e.target instanceof Element?e.target:null,card=t?.closest?.('[data-game]');
    if(card&&CUSTOM.has(card.dataset.game)){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();openCustomGame(card.dataset.game);return;
    }
    const trigger=t?.closest?.('#dailyOpenLesson,[data-choose-day],[data-skill-lesson]');
    if(trigger){const day=Number(trigger.dataset.chooseDay||trigger.dataset.skillLesson||window.getDailyCourseProgress?.().currentDay)||1;setTimeout(()=>patchMiniResponse(day),0);setTimeout(()=>patchMiniResponse(day),80)}
  },true);

  const originalOpenLesson=window.openDailyLesson;
  if(typeof originalOpenLesson==='function')window.openDailyLesson=(day)=>{const out=originalOpenLesson(day);setTimeout(()=>patchMiniResponse(day),0);setTimeout(()=>patchMiniResponse(day),80);return out};

  document.addEventListener('app:rendered',()=>setTimeout(patchCourseCard,0));
  document.addEventListener('daily-course:changed',()=>setTimeout(patchCourseCard,0));
  document.addEventListener('learner-level:changed',()=>{sentenceCache={key:'',rows:[]};setTimeout(patchCourseCard,0)});
  document.addEventListener('curriculum-v59:ready',()=>setTimeout(()=>{patchCourseCard();patchMiniResponse()},0));

  const style=document.createElement('style');style.textContent=`#gameV59 .game-panel-head small{display:block;color:#67e8f9;margin-top:3px;font-size:10px}#g59Status{color:#94a3b8!important}.g59-loading{padding:28px;text-align:center;color:#94a3b8}.g59-feedback{margin-top:12px;padding:12px;border-radius:14px;background:rgba(15,23,42,.65);display:flex;gap:8px;flex-direction:column}.g59-feedback b{color:#67e8f9}.g59-feedback span{color:#e2e8f0;line-height:1.5}.g59-context{font-size:clamp(18px,3.2vw,28px);line-height:1.65;text-align:center;padding:18px;border:1px solid rgba(148,163,184,.18);border-radius:16px;background:rgba(15,23,42,.55)}.g59-context mark{background:rgba(34,211,238,.18);color:#67e8f9;border-radius:6px;padding:1px 4px}`;document.head.appendChild(style);

  setTimeout(installGameWrapper,60);setTimeout(installGameWrapper,500);
  setTimeout(()=>ensureOxford().then(()=>patchCourseCard()),0);
  setTimeout(()=>patchCourseCard(),250);

  window.getGameSentenceCountV59=async()=> (await gameSentenceRows()).length;
  window.auditCourseV59=()=>{
    const lessons=Array.from({length:210},(_,i)=>getLesson(i+1)),primary=new Map(),duplicatePrimary=[];
    lessons.forEach(l=>{const k=norm(l.examples?.[0]);if(primary.has(k))duplicatePrimary.push([primary.get(k),l.day]);else primary.set(k,l.day)});
    return {version:VERSION,totalLessons:210,distinctPrimaryExamples:primary.size,duplicatePrimary,lesson1:lessons[0],lesson2:lessons[1],lesson3:lessons[2],lesson4:lessons[3],lesson22:lessons[21],lesson24:lessons[23]};
  };
  window.COURSE_GAME_FIX_VERSION=VERSION;
})();
