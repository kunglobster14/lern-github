(()=>{
  const VERSION='v52';
  const COURSE={
    starter:{label:'เริ่มต้น',cefr:'Pre-A1 / A1',start:'L0',path:['L0','L1','L2','L3','L4','L5'],target:'สนทนาและสื่อสารต่อเนื่องระดับกลาง–สูง'},
    basic:{label:'พื้นฐาน',cefr:'A1–A2',start:'L1',path:['L1','L2','L3','L4','L5'],target:'สนทนาและสื่อสารต่อเนื่องระดับกลาง–สูง'},
    intermediate:{label:'กลาง',cefr:'A2–B1',start:'L2',path:['L2','L3','L4','L5'],target:'สนทนาและสื่อสารต่อเนื่องระดับกลาง–สูง'},
    upper:{label:'กลางสูง',cefr:'B1–B2',start:'L4',path:['L4','L5'],target:'สนทนาและสื่อสารระดับกลางสูงอย่างมั่นใจ'}
  };
  const SENTENCES={
    starter:[
      ['ฉันเหนื่อย','I am tired.'],['ฉันต้องการน้ำ','I want water.'],['ฉันต้องการความช่วยเหลือ','I need help.'],['ฉันชอบกาแฟ','I like coffee.'],['ห้องน้ำอยู่ที่ไหน','Where is the bathroom?'],['ยินดีที่ได้รู้จัก','Nice to meet you.']
    ],
    basic:[
      ['ฉันไปทำงานทุกวัน','I go to work every day.'],['คุณชอบกาแฟไหม','Do you like coffee?'],['เธอทำงานที่นี่','She works here.'],['ฉันพูดอังกฤษได้นิดหน่อย','I can speak a little English.'],['ฉันมีประชุมตอนสิบโมง','I have a meeting at ten.'],['ฉันไม่ชอบอาหารเผ็ด','I do not like spicy food.']
    ],
    intermediate:[
      ['เมื่อวานฉันไปทำงาน','Yesterday I went to work.'],['พรุ่งนี้ฉันจะทำงาน','Tomorrow I will work.'],['ฉันกำลังทำรายงานอยู่','I am working on a report.'],['มีปัญหากับห้องของฉัน','There is a problem with my room.'],['ฉันคิดว่ามันแพงเกินไป','I think it is too expensive.'],['ก่อนอื่นฉันไปทำงาน จากนั้นฉันกินข้าวกลางวัน','First I went to work. Then I had lunch.']
    ],
    upper:[
      ['ในความเห็นของฉัน เราควรเปลี่ยนแผน','In my opinion, we should change the plan.'],['แม้ว่าเที่ยวบินจะล่าช้า เราก็ยังไปถึงตรงเวลา','Although the flight was delayed, we arrived on time.'],['ถ้าฉันมีเวลามากกว่านี้ ฉันจะเรียนอังกฤษทุกวัน','If I had more time, I would study English every day.'],['ปัญหานี้ต้องได้รับการแก้ไขก่อนการประชุม','This problem must be fixed before the meeting.'],['ฉันไม่แน่ใจ แต่ฉันคิดว่าเราควรคุยเรื่องนี้ทีหลัง','I am not sure, but I think we should discuss this later.'],['หลังจากตรวจสอบข้อมูลแล้ว เราจึงเปลี่ยนแผน','After checking the information, we changed the plan.']
    ]
  };
  const DIALOGS={
    starter:[
      ['พนักงานถาม “What would you like to drink?”','Water, please.',['Water, please.','I am water.','Where water?']],
      ['มีคนถาม “What is your name?”','My name is Tom.',['My name is Tom.','I name Tom.','Where is Tom?']]
    ],
    basic:[
      ['คุณอยากถามราคาสินค้า','How much is this?',['How much is this?','Where much is this?','How is this price?']],
      ['คุณฟังไม่ทันและอยากให้พูดซ้ำ','Could you say that again?',['Could you say that again?','Could you again say?','Say where again?']]
    ],
    intermediate:[
      ['ที่โรงแรม ห้องของคุณมีปัญหา','There is a problem with my room.',['There is a problem with my room.','My room has problem is.','There problem my room.']],
      ['เพื่อนถามความเห็นเรื่องราคา','I think it is too expensive.',['I think it is too expensive.','I think too expensive it.','It think expensive.']]
    ],
    upper:[
      ['ในที่ประชุม คุณต้องเสนอให้เปลี่ยนแผน','In my opinion, we should change the plan.',['In my opinion, we should change the plan.','My opinion should change plan.','We change opinion plan.']],
      ['คุณต้องอธิบายว่าปัญหาต้องแก้ก่อนประชุม','This problem must be fixed before the meeting.',['This problem must be fixed before the meeting.','This problem must fix before meeting.','Before meeting problem fixing must.']]
    ]
  };
  const FALLBACK_WORDS={
    starter:[['water','น้ำ'],['food','อาหาร'],['home','บ้าน'],['work','งาน'],['help','ช่วย'],['happy','มีความสุข'],['tired','เหนื่อย'],['friend','เพื่อน']],
    basic:[['station','สถานี'],['ticket','ตั๋ว'],['hotel','โรงแรม'],['price','ราคา'],['meeting','ประชุม'],['travel','เดินทาง'],['problem','ปัญหา'],['ready','พร้อม']],
    intermediate:[['experience','ประสบการณ์'],['reason','เหตุผล'],['decision','การตัดสินใจ'],['report','รายงาน'],['improve','พัฒนา'],['explain','อธิบาย'],['continue','ดำเนินต่อ'],['suggest','แนะนำ']],
    upper:[['although','แม้ว่า'],['opinion','ความคิดเห็น'],['solution','ทางแก้'],['responsibility','ความรับผิดชอบ'],['decision','การตัดสินใจ'],['effective','มีประสิทธิภาพ'],['compare','เปรียบเทียบ'],['discussion','การอภิปราย']]
  };
  const GAME_TITLES={match:'🧩 Word Match',builder:'🧱 Sentence Builder',listen:'🎧 Listening Hunt',sprint:'⚡ Flash Sprint',rush:'🏃 Meaning Rush',gap:'🔤 Missing Word',translate:'🇹🇭 Thai → English',memory:'🧠 Memory Flip',dialog:'🗣️ Survival Dialog',spell:'👂 Spell by Ear',trap:'🎭 True or Trap'};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const currentId=()=>{try{const id=window.getLearnerLevel?.();return COURSE[id]?id:'starter'}catch{return'starter'}};
  const cfg=()=>COURSE[currentId()];
  const say=text=>{try{if(typeof speak==='function')return speak(text);speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.86;speechSynthesis.speak(u)}catch{}};

  function parseProgress(btn){
    const t=btn.querySelector('small')?.textContent||'';const m=t.match(/(\d+)\/(\d+)\s*บท/);return m?{done:Number(m[1]),total:Number(m[2])}:{done:0,total:0};
  }
  function patchRoadmap(){
    const road=document.querySelector('#learningRoadmap');if(!road)return;
    const c=cfg(),buttons=[...road.querySelectorAll('[data-path-level]')];if(!buttons.length)return;
    road.dataset.adaptiveLevel=currentId();
    const h=road.querySelector('.roadmap-head h2');if(h)h.textContent=`หลักสูตรของคุณ · ${c.cefr} → สื่อสารระดับกลาง–สูง`;
    const p=road.querySelector('.roadmap-head p');if(p)p.textContent=`เริ่มที่ ${c.start} ตามระดับที่เลือก แล้วเรียนต่อเนื่องจนถึง L5 พร้อม Quiz, Game และ Sentence Coach`;
    let done=0,total=0,prior=0;
    buttons.forEach(b=>{
      const id=b.dataset.pathLevel,inPath=c.path.includes(id),isStart=id===c.start,isGoal=id==='L5';
      b.classList.toggle('adaptive-course-level',inPath);b.classList.toggle('adaptive-prior-level',!inPath);
      if(inPath){b.hidden=false;const x=parseProgress(b);done+=x.done;total+=x.total}else{prior++;b.hidden=road.dataset.showPrior!=='1'}
      let tag=b.querySelector('.learner-rec-tag');
      if(!tag){tag=document.createElement('em');tag.className='learner-rec-tag';b.appendChild(tag)}
      tag.textContent=inPath?(isStart?'เริ่มตรงนี้':isGoal?'เป้าหมาย':'ขั้นถัดไป'):'ทบทวน';
    });
    const pct=total?Math.round(done/total*100):0,box=road.querySelector('.roadmap-progress');if(box){const b=box.querySelector('b'),s=box.querySelector('span');if(b)b.textContent=`${pct}%`;if(s)s.textContent=`${done}/${total} บทในหลักสูตรของคุณ`}
    const track=road.querySelector('.roadmap-track i');if(track)track.style.width=`${pct}%`;
    road.querySelector('.learner-roadmap-note')?.remove();
    let note=road.querySelector('.adaptive-course-note');if(!note){note=document.createElement('div');note.className='adaptive-course-note';road.querySelector('.roadmap-track')?.insertAdjacentElement('afterend',note)}
    note.innerHTML=`<b>เส้นทาง ${esc(c.label)} · ${esc(c.cefr)}</b><span>${c.path.join(' → ')} · เป้าหมาย: ${esc(c.target)}</span>`;
    let toggle=road.querySelector('#adaptivePriorToggle');
    if(prior){if(!toggle){toggle=document.createElement('button');toggle.id='adaptivePriorToggle';toggle.type='button';toggle.className='adaptive-prior-toggle';road.querySelector('.roadmap-levels')?.insertAdjacentElement('beforebegin',toggle);toggle.onclick=()=>{road.dataset.showPrior=road.dataset.showPrior==='1'?'0':'1';patchRoadmap()}}toggle.textContent=road.dataset.showPrior==='1'?`ซ่อนบททบทวนก่อนระดับ (${prior} ระดับ)`:`ดูบททบทวนก่อนระดับ (${prior} ระดับ)`}else toggle?.remove();
  }
  function patchGuideCard(){
    const card=document.querySelector('#learningGuideCard');if(!card)return;const c=cfg();
    const p=card.querySelector('.learning-guide-head p');if(p)p.textContent=`เรียนตามระดับ ${c.cefr} ของคุณ แล้วฝึกคำศัพท์ ฟัง พูด อ่าน เขียน เกม และ Sentence Coach ให้ต่อเนื่อง`;
    const spans=card.querySelectorAll('.learning-guide-route span');if(spans.length>=6)spans[5].textContent='6 · Sentence Coach';
  }
  function patchGameHub(){
    const root=document.querySelector('[data-game-lab-v31]');if(!root)return;const c=cfg();
    const span=root.querySelector('.game-title>span');if(span)span.textContent=`เกมปรับตามระดับ ${c.cefr} · 13 โหมด`;
    let n=root.querySelector('.adaptive-game-note');if(!n){n=document.createElement('div');n.className='adaptive-game-note';root.querySelector('.game-grid')?.insertAdjacentElement('beforebegin',n)}if(n)n.innerHTML=`<b>เกมของคุณ: ${esc(c.label)} · ${esc(c.cefr)}</b><span>คำศัพท์ ประโยค Listening และโจทย์เกมจะเปลี่ยนตามระดับที่เลือก</span>`;
  }
  function patchAll(){if(document.documentElement.classList.contains('account-locked'))return;patchRoadmap();patchGuideCard();patchGameHub()}

  function closeModal(){const d=document.querySelector('#adaptiveGameModal');if(!d)return;try{if(d.open)d.close()}catch{}d.remove();try{if(typeof render==='function')render()}catch{}}
  function modal(title,body){window.__gameLabV31?.close?.();document.querySelector('#adaptiveGameModal')?.remove();const d=document.createElement('dialog');d.id='adaptiveGameModal';d.className='game-dialog';d.innerHTML=`<section class="game-panel"><header class="game-panel-head"><div><h2>${esc(title)}</h2><small>ปรับตามระดับ ${esc(cfg().cefr)}</small></div><button class="game-close" type="button">×</button></header><div id="adaptiveGameBody">${body}</div></section>`;document.body.appendChild(d);d.querySelector('.game-close').onclick=closeModal;d.addEventListener('cancel',e=>{e.preventDefault();closeModal()});d.addEventListener('click',e=>{if(e.target===d)closeModal()});if(d.showModal)d.showModal();else d.setAttribute('open','');return d}
  function award(type,xp,correct=true){try{state.xp=(Number(state.xp)||0)+(correct?xp:0);if(typeof saveState==='function')saveState();window.__gameLabV31?.addProgress?.('game',1);if(type==='listen')window.__gameLabV31?.addProgress?.('listen',1)}catch{}}
  function finish(d,type,score,total,xp=8){award(type,xp,score>0);const body=d.querySelector('#adaptiveGameBody');body.innerHTML=`<div class="game-finish"><div>${score===total?'🎉':'📘'}</div><h2>${score}/${total}</h2><p>จบรอบระดับ ${esc(cfg().cefr)} · ${score?`+${xp} XP`:'ทบทวนคำตอบแล้วลองใหม่ได้'}</p><div class="game-finish-actions"><button class="lab-primary" id="adaptiveAgain">▶ เล่นเกมนี้อีก</button><button class="lab-secondary" id="adaptiveRandom">🎲 สุ่มเกมระดับนี้</button><button class="lab-secondary" id="adaptiveClose">✕ ปิด</button></div></div>`;body.querySelector('#adaptiveAgain').onclick=()=>openGame(type);body.querySelector('#adaptiveRandom').onclick=()=>openGame('mix');body.querySelector('#adaptiveClose').onclick=closeModal}
  async function words(){
    try{if(window.ensureOxford3000)await window.ensureOxford3000();let list=window.getOxford3000?.()||[];if(window.filterOxfordByLearnerLevel)list=window.filterOxfordByLearnerLevel(list);const ok=list.filter(x=>x?.word&&x?.thai);if(ok.length>=12)return shuffle(ok).slice(0,80).map(x=>({word:String(x.word),thai:String(x.thai),example:String(x.example||x.word),exampleThai:String(x.exampleThai||x.thai)}))}catch{}
    return FALLBACK_WORDS[currentId()].map(x=>({word:x[0],thai:x[1],example:x[0],exampleThai:x[1]}));
  }
  const sentenceSet=()=>SENTENCES[currentId()].map((x,i)=>({id:i,thai:x[0],answer:x[1]}));
  function matchGame(d,pool){const set=shuffle(pool).slice(0,4),left=shuffle(set),right=shuffle(set);let selected='',score=0;const body=d.querySelector('#adaptiveGameBody');body.innerHTML=`<p class="game-sub">จับคู่คำศัพท์ระดับ ${esc(cfg().cefr)}</p><div class="match-board"><div>${left.map((w,i)=>`<button class="word-tile" data-en="${i}" data-word="${esc(w.word)}">${esc(w.word)}</button>`).join('')}</div><div>${right.map((w,i)=>`<button class="word-tile" data-th="${i}" data-word="${esc(w.word)}">${esc(w.thai)}</button>`).join('')}</div></div>`;body.querySelectorAll('[data-en]').forEach(b=>b.onclick=()=>{body.querySelectorAll('[data-en]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selected=b.dataset.word});body.querySelectorAll('[data-th]').forEach(b=>b.onclick=()=>{if(!selected)return;if(b.dataset.word===selected){body.querySelectorAll(`[data-word="${CSS.escape(selected)}"]`).forEach(x=>{x.disabled=true;x.classList.add('correct')});score++;selected='';if(score===4)setTimeout(()=>finish(d,'match',4,4,10),250)}else{b.classList.add('wrong');setTimeout(()=>b.classList.remove('wrong'),350)}})}
  function wordChoice(d,pool,type){const q=shuffle(pool)[0],wrong=shuffle(pool.filter(x=>x.word!==q.word)).slice(0,3),opts=shuffle([q,...wrong]);const title=type==='listen'?'ฟังแล้วเลือกความหมาย':type==='sprint'?'เลือกความหมายให้ไว':'เลือกความหมายที่ถูก';const body=d.querySelector('#adaptiveGameBody');body.innerHTML=`${type==='listen'?'<button class="listen-orb" id="adaptivePlay">🔊</button>':`<div class="adaptive-big-word">${esc(q.word)}</div>`}<p class="game-sub">${title}</p><div class="choice-stack">${opts.map(x=>`<button class="lab-choice" data-word="${esc(x.word)}">${esc(x.thai)}</button>`).join('')}</div>`;if(type==='listen'){body.querySelector('#adaptivePlay').onclick=()=>say(q.word);setTimeout(()=>say(q.word),120)}body.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>{body.querySelectorAll('[data-word]').forEach(x=>x.disabled=true);if(b.dataset.word===q.word){b.classList.add('correct');if(type!=='listen')say(q.word);setTimeout(()=>finish(d,type,1,1,7),300)}else{b.classList.add('wrong');setTimeout(()=>{body.insertAdjacentHTML('beforeend',`<p class="adaptive-answer">คำตอบ: <b>${esc(q.word)}</b> — ${esc(q.thai)}</p>`);finish(d,type,0,1,0)},450)}})}
  function spellGame(d,pool){const q=shuffle(pool)[0],body=d.querySelector('#adaptiveGameBody');body.innerHTML=`<button class="listen-orb" id="adaptivePlay">🔊</button><p class="game-sub">ฟังคำศัพท์ระดับ ${esc(cfg().cefr)} แล้วพิมพ์ให้ถูก</p><input class="spell-input" id="adaptiveSpell" autocomplete="off" autocapitalize="none"><button class="lab-primary full" id="adaptiveCheck">ตรวจคำตอบ</button>`;body.querySelector('#adaptivePlay').onclick=()=>say(q.word);setTimeout(()=>say(q.word),120);body.querySelector('#adaptiveCheck').onclick=()=>{const ok=body.querySelector('#adaptiveSpell').value.trim().toLowerCase()===q.word.toLowerCase();if(ok)finish(d,'spell',1,1,8);else{body.insertAdjacentHTML('beforeend',`<p class="adaptive-answer">คำที่ถูก: <b>${esc(q.word)}</b> — ${esc(q.thai)}</p>`);setTimeout(()=>finish(d,'spell',0,1,0),700)}}}
  function trapGame(d,pool){const q=shuffle(pool)[0],truth=Math.random()>.5,shown=truth?q:shuffle(pool.filter(x=>x.word!==q.word))[0],body=d.querySelector('#adaptiveGameBody');body.innerHTML=`<div class="adaptive-big-word">${esc(q.word)}</div><p class="trap-meaning">${esc(shown.thai)}</p><div class="trap-actions"><button class="lab-primary" data-bool="1">✓ จริง</button><button class="lab-secondary" data-bool="0">✕ ไม่ใช่</button></div>`;body.querySelectorAll('[data-bool]').forEach(b=>b.onclick=()=>{const ok=(b.dataset.bool==='1')===truth;if(ok)finish(d,'trap',1,1,6);else{body.insertAdjacentHTML('beforeend',`<p class="adaptive-answer">${esc(q.word)} = <b>${esc(q.thai)}</b></p>`);setTimeout(()=>finish(d,'trap',0,1,0),650)}})}
  function memoryGame(d,pool){const set=shuffle(pool).slice(0,4),cards=shuffle(set.flatMap(w=>[{key:w.word,text:w.word},{key:w.word,text:w.thai}]));let first=null,lock=false,pairs=0;const body=d.querySelector('#adaptiveGameBody');body.innerHTML=`<div class="memory-grid">${cards.map((c,i)=>`<button class="memory-card" data-i="${i}" data-key="${esc(c.key)}"><span>?</span><b>${esc(c.text)}</b></button>`).join('')}</div>`;body.querySelectorAll('.memory-card').forEach(b=>b.onclick=()=>{if(lock||b.classList.contains('matched')||b===first)return;b.classList.add('open');if(!first){first=b;return}if(first.dataset.key===b.dataset.key){first.classList.add('matched');b.classList.add('matched');first=null;pairs++;if(pairs===4)setTimeout(()=>finish(d,'memory',4,4,10),300)}else{lock=true;setTimeout(()=>{first.classList.remove('open');b.classList.remove('open');first=null;lock=false},650)}})}
  function builderGame(d){const q=shuffle(sentenceSet())[0],target=q.answer.replace(/[.!?]$/,''),tokens=target.split(/\s+/),chosen=[];const body=d.querySelector('#adaptiveGameBody');body.innerHTML=`<p class="game-prompt">${esc(q.thai)}</p><div class="builder-answer" id="adaptiveBuilt"></div><div class="builder-pool">${shuffle(tokens).map((t,i)=>`<button class="token-btn" data-token="${esc(t)}" data-i="${i}">${esc(t)}</button>`).join('')}</div><div class="lab-actions"><button class="lab-secondary" id="adaptiveReset">เริ่มใหม่</button><button class="lab-primary" id="adaptiveCheck">ตรวจคำตอบ</button></div>`;const draw=()=>body.querySelector('#adaptiveBuilt').textContent=chosen.join(' ');body.querySelectorAll('[data-token]').forEach(b=>b.onclick=()=>{if(!b.disabled){b.disabled=true;chosen.push(b.dataset.token);draw()}});body.querySelector('#adaptiveReset').onclick=()=>{chosen.length=0;body.querySelectorAll('[data-token]').forEach(x=>x.disabled=false);draw()};body.querySelector('#adaptiveCheck').onclick=()=>{const ok=chosen.join(' ').toLowerCase()===target.toLowerCase();if(ok)finish(d,'builder',1,1,10);else{body.insertAdjacentHTML('beforeend',`<p class="adaptive-answer">ตัวอย่างที่ถูก: <b>${esc(q.answer)}</b></p>`)}}}
  function translateGame(d){const set=shuffle(sentenceSet()),q=set[0],opts=shuffle([q.answer,...set.slice(1,4).map(x=>x.answer)]),body=d.querySelector('#adaptiveGameBody');body.innerHTML=`<p class="game-prompt">${esc(q.thai)}</p><div class="choice-stack">${opts.map(x=>`<button class="lab-choice" data-answer="${esc(x)}">${esc(x)}</button>`).join('')}</div>`;body.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{body.querySelectorAll('[data-answer]').forEach(x=>x.disabled=true);if(b.dataset.answer===q.answer){b.classList.add('correct');setTimeout(()=>finish(d,'translate',1,1,8),250)}else{b.classList.add('wrong');body.insertAdjacentHTML('beforeend',`<p class="adaptive-answer">คำตอบตัวอย่าง: <b>${esc(q.answer)}</b></p>`);setTimeout(()=>finish(d,'translate',0,1,0),650)}})}
  function gapGame(d){const set=shuffle(sentenceSet()),q=set[0],clean=q.answer.replace(/[.!?]$/,''),tokens=clean.split(/\s+/),candidates=tokens.map((x,i)=>({x,i})).filter(o=>o.x.replace(/[^A-Za-z']/g,'').length>2),pick=candidates[Math.floor(Math.random()*candidates.length)]||{x:tokens[1],i:1};const blank=tokens.map((x,i)=>i===pick.i?'_____':x).join(' '),others=shuffle(set.slice(1).flatMap(x=>x.answer.replace(/[.!?]$/,'').split(/\s+/)).filter(x=>x.toLowerCase()!==pick.x.toLowerCase()&&x.replace(/[^A-Za-z']/g,'').length>2)).slice(0,3),opts=shuffle([pick.x,...others]),body=d.querySelector('#adaptiveGameBody');body.innerHTML=`<p class="game-prompt">${esc(q.thai)}</p><div class="adaptive-gap">${esc(blank)}</div><div class="choice-stack">${opts.map(x=>`<button class="lab-choice" data-gap="${esc(x)}">${esc(x)}</button>`).join('')}</div>`;body.querySelectorAll('[data-gap]').forEach(b=>b.onclick=()=>{if(b.dataset.gap.toLowerCase()===pick.x.toLowerCase())finish(d,'gap',1,1,7);else{b.classList.add('wrong');body.insertAdjacentHTML('beforeend',`<p class="adaptive-answer">คำที่ถูก: <b>${esc(pick.x)}</b></p>`);setTimeout(()=>finish(d,'gap',0,1,0),600)}})}
  function dialogGame(d){const q=shuffle(DIALOGS[currentId()])[0],body=d.querySelector('#adaptiveGameBody');body.innerHTML=`<p class="game-prompt">${esc(q[0])}</p><div class="choice-stack">${shuffle(q[2]).map(x=>`<button class="lab-choice" data-dialog="${esc(x)}">${esc(x)}</button>`).join('')}</div>`;body.querySelectorAll('[data-dialog]').forEach(b=>b.onclick=()=>{if(b.dataset.dialog===q[1])finish(d,'dialog',1,1,9);else{b.classList.add('wrong');body.insertAdjacentHTML('beforeend',`<p class="adaptive-answer">ประโยคที่เหมาะสม: <b>${esc(q[1])}</b></p>`);setTimeout(()=>finish(d,'dialog',0,1,0),650)}})}
  async function openGame(type){
    if(type==='mission'){window.openSentenceCoach?.();return}
    const types=Object.keys(GAME_TITLES);if(type==='mix')type=shuffle(types)[0];if(!GAME_TITLES[type])type='rush';
    const d=modal(GAME_TITLES[type],`<div class="core-study-loading"><div class="listen-orb">Aa</div><h3>กำลังเตรียมโจทย์ ${esc(cfg().cefr)}...</h3><p>เกมนี้ใช้คำและประโยคตามระดับผู้เรียน</p></div>`);
    const pool=await words();if(!document.body.contains(d))return;
    if(type==='match')return matchGame(d,pool);if(['listen','sprint','rush'].includes(type))return wordChoice(d,pool,type);if(type==='spell')return spellGame(d,pool);if(type==='trap')return trapGame(d,pool);if(type==='memory')return memoryGame(d,pool);if(type==='builder')return builderGame(d);if(type==='translate')return translateGame(d);if(type==='gap')return gapGame(d);if(type==='dialog')return dialogGame(d);
  }

  document.addEventListener('click',e=>{const t=e.target instanceof Element?e.target:null;if(!t)return;const card=t.closest('[data-game]');if(!card||card.dataset.game==='mission')return;e.preventDefault();e.stopImmediatePropagation();openGame(card.dataset.game)},true);
  document.addEventListener('app:rendered',()=>setTimeout(patchAll,0));document.addEventListener('learner-level:changed',()=>setTimeout(()=>{patchAll();try{if(typeof render==='function')render()}catch{}},0));
  const observer=new MutationObserver(()=>patchAll());observer.observe(document.body,{childList:true,subtree:true});
  const style=document.createElement('style');style.textContent=`.adaptive-course-note{display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin:12px 0 9px;color:#94a3b8;font-size:11px}.adaptive-course-note b{color:#67e8f9}.adaptive-prior-toggle{border:1px solid rgba(148,163,184,.2);background:rgba(15,23,42,.55);color:#94a3b8;border-radius:999px;padding:7px 11px;font-size:10px;font-weight:800;margin:0 0 10px;cursor:pointer}.roadmap-level.adaptive-course-level{border-color:rgba(34,211,238,.42)!important}.roadmap-level.adaptive-prior-level{opacity:.68}.adaptive-game-note{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 12px;color:#94a3b8;font-size:11px}.adaptive-game-note b{color:#67e8f9}.adaptive-big-word{font-size:36px;font-weight:950;text-align:center;color:#fff;margin:18px 0 6px}.adaptive-answer{padding:10px 12px;border-radius:12px;background:rgba(34,211,238,.08);color:#cbd5e1;margin-top:12px}.adaptive-gap{font-size:21px;font-weight:850;text-align:center;color:#fff;padding:18px;border:1px solid rgba(148,163,184,.18);border-radius:16px;margin:12px 0}.game-panel-head small{display:block;color:#67e8f9;margin-top:3px;font-size:10px}@media(max-width:640px){.adaptive-course-note,.adaptive-game-note{display:block}.adaptive-course-note span,.adaptive-game-note span{display:block;margin-top:4px}}`;document.head.appendChild(style);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(patchAll,0),{once:true});else setTimeout(patchAll,0);
  window.ADAPTIVE_LEARNING_VERSION=VERSION;window.openAdaptiveGame=openGame;window.getAdaptiveCourse=()=>cfg();
})();