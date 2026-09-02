(()=>{
  const RECENT_KEY='gameLabPlusRecentV1';
  const todayKey=()=>new Date().toLocaleDateString('en-CA');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  const shuffle=arr=>{const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const BANK=[
    ['water','น้ำ','I need some water.','ฉันต้องการน้ำ'],['coffee','กาแฟ','I would like a coffee, please.','ฉันขอกาแฟหนึ่งแก้ว'],['food','อาหาร','The food is very good.','อาหารอร่อยมาก'],['work','งาน / ทำงาน','I work every day.','ฉันทำงานทุกวัน'],['home','บ้าน','I am at home now.','ตอนนี้ฉันอยู่บ้าน'],['help','ความช่วยเหลือ / ช่วย','Can you help me, please?','ช่วยฉันหน่อยได้ไหม'],['time','เวลา','What time is it?','ตอนนี้กี่โมง'],['today','วันนี้','I am busy today.','วันนี้ฉันยุ่ง'],['tomorrow','พรุ่งนี้','I will call you tomorrow.','ฉันจะโทรหาคุณพรุ่งนี้'],['yesterday','เมื่อวาน','I worked yesterday.','เมื่อวานฉันทำงาน'],
    ['station','สถานี','Where is the station?','สถานีอยู่ที่ไหน'],['airport','สนามบิน','The airport is very busy.','สนามบินยุ่งมาก'],['hotel','โรงแรม','I have a hotel reservation.','ฉันจองโรงแรมไว้แล้ว'],['room','ห้อง','Where is my room?','ห้องของฉันอยู่ที่ไหน'],['ticket','ตั๋ว','I need two tickets.','ฉันต้องการตั๋วสองใบ'],['train','รถไฟ','I take the train to work.','ฉันนั่งรถไฟไปทำงาน'],['bus','รถบัส','The bus is late.','รถบัสมาสาย'],['taxi','แท็กซี่','Where can I get a taxi?','ฉันขึ้นแท็กซี่ได้ที่ไหน'],['gate','ประตูขึ้นเครื่อง / เกต','Where is gate twelve?','เกตสิบสองอยู่ที่ไหน'],['bag','กระเป๋า','My bag is missing.','กระเป๋าของฉันหาย'],
    ['price','ราคา','What is the price?','ราคาเท่าไร'],['cheap','ราคาถูก','This shirt is cheap.','เสื้อตัวนี้ราคาถูก'],['expensive','แพง','This hotel is expensive.','โรงแรมนี้แพง'],['large','ใหญ่','Do you have a larger size?','มีไซซ์ใหญ่กว่านี้ไหม'],['small','เล็ก','I need a small bag.','ฉันต้องการกระเป๋าใบเล็ก'],['card','บัตร','Can I pay by card?','ฉันจ่ายด้วยบัตรได้ไหม'],['cash','เงินสด','I only have cash.','ฉันมีแต่เงินสด'],['buy','ซื้อ','I want to buy this.','ฉันต้องการซื้ออันนี้'],['open','เปิด','The shop is open.','ร้านเปิดอยู่'],['closed','ปิด','The bank is closed.','ธนาคารปิดแล้ว'],
    ['family','ครอบครัว','I live with my family.','ฉันอยู่กับครอบครัว'],['friend','เพื่อน','She is my friend.','เธอเป็นเพื่อนของฉัน'],['name','ชื่อ','What is your name?','คุณชื่ออะไร'],['phone','โทรศัพท์','My phone is new.','โทรศัพท์ของฉันใหม่'],['email','อีเมล','Please send me an email.','กรุณาส่งอีเมลให้ฉัน'],['meeting','ประชุม','I have a meeting at ten.','ฉันมีประชุมตอนสิบโมง'],['project','โครงการ','I am working on a project.','ฉันกำลังทำโครงการ'],['problem','ปัญหา','There is a problem.','มีปัญหา'],['ready','พร้อม','I am ready now.','ตอนนี้ฉันพร้อมแล้ว'],['busy','ยุ่ง','I am busy this morning.','เช้านี้ฉันยุ่ง'],
    ['happy','มีความสุข','I am happy today.','วันนี้ฉันมีความสุข'],['tired','เหนื่อย','I feel tired.','ฉันรู้สึกเหนื่อย'],['hungry','หิว','I am hungry.','ฉันหิว'],['sorry','ขอโทษ','I am sorry.','ฉันขอโทษ'],['please','กรุณา / โปรด','Please wait here.','กรุณารอที่นี่'],['thanks','ขอบคุณ','Thanks for your help.','ขอบคุณสำหรับความช่วยเหลือ'],['where','ที่ไหน','Where is the bathroom?','ห้องน้ำอยู่ที่ไหน'],['when','เมื่อไร','When do you start work?','คุณเริ่มงานเมื่อไร'],['why','ทำไม','Why are you late?','ทำไมคุณมาสาย'],['because','เพราะว่า','I am tired because I worked late.','ฉันเหนื่อยเพราะทำงานดึก'],
    ['morning','ตอนเช้า','I drink coffee in the morning.','ฉันดื่มกาแฟตอนเช้า'],['night','กลางคืน','I work at night.','ฉันทำงานตอนกลางคืน'],['left','ซ้าย','Turn left here.','เลี้ยวซ้ายตรงนี้'],['right','ขวา','Turn right at the corner.','เลี้ยวขวาที่หัวมุม'],['straight','ตรงไป','Go straight for two minutes.','ตรงไปสองนาที'],['near','ใกล้','The station is near the hotel.','สถานีอยู่ใกล้โรงแรม'],['far','ไกล','The airport is far from here.','สนามบินอยู่ไกลจากที่นี่'],['wait','รอ','Please wait a moment.','กรุณารอสักครู่'],['understand','เข้าใจ','I understand now.','ตอนนี้ฉันเข้าใจแล้ว'],['again','อีกครั้ง','Could you say that again?','ช่วยพูดอีกครั้งได้ไหม']
  ].map((x,i)=>({id:i,en:x[0],th:x[1],sentence:x[2],sentenceTh:x[3]}));

  const DIALOGS=[
    ['พนักงานถาม: “What would you like to drink?”',['I would like a coffee, please.','I am a station.','Turn left coffee.'],0],
    ['คุณอยากถามว่าห้องน้ำอยู่ไหน',['Where is the bathroom?','How much bathroom?','I like bathroom.'],0],
    ['เจ้าหน้าที่บอกให้รอสักครู่ คุณตอบอย่างสุภาพ',['Okay, thank you.','No station.','Price please left.'],0],
    ['คุณมีการจองโรงแรมแล้ว',['I have a reservation.','I have a gate.','I am reservation.'],0],
    ['คุณอยากจ่ายด้วยบัตร',['Can I pay by card?','Can I eat the card?','Where is card time?'],0],
    ['คุณฟังไม่ทันและอยากให้พูดซ้ำ',['Could you say that again?','Could you close again?','How much say?'],0],
    ['คุณอยากบอกว่ากระเป๋าหาย',['My bag is missing.','My bag is delicious.','My bag is a hotel.'],0],
    ['คุณอยากขอความช่วยเหลือ',['Can you help me, please?','Can you price me?','Help is gate twelve.'],0],
    ['คุณต้องการตั๋วสองใบ',['Two tickets, please.','Two coffees station.','Please two hotel.'],0],
    ['คุณอยากถามราคาเสื้อ',['How much is this shirt?','Where time is shirt?','Who is this price?'],0],
    ['เพื่อนถาม How are you?',['I am good, thank you.','I am gate twelve.','I am price.'],0],
    ['คุณอยากบอกว่าเช้านี้ยุ่ง',['I am busy this morning.','I busy at left.','Morning is card.'],0],
    ['คุณจะถามทางไปสถานี',['How do I get to the station?','How do I buy station?','What station coffee?'],0],
    ['คุณอยากบอกว่าไม่เข้าใจ',['I do not understand.','I do not hotel.','I understand price no.'],0],
    ['คุณอยากถามว่าเริ่มงานกี่โมง',['What time do you start work?','How much work?','Where work name?'],0]
  ];

  const GAME_META={
    rush:['⚡','Meaning Rush','แตะความหมายให้ไว 6 ข้อรวด'],
    gap:['🧩','Missing Word','เติมคำที่หายจากประโยคจริง'],
    translate:['🇹🇭','Thai → English','เลือกประโยคอังกฤษจากความหมายไทย'],
    memory:['🧠','Memory Flip','เปิดการ์ดจับคู่คำกับความหมาย'],
    dialog:['🗣️','Survival Dialog','เลือกประโยคให้รอดในสถานการณ์จริง'],
    spell:['🎧','Spell by Ear','ฟังเสียงแล้วพิมพ์คำที่ได้ยิน'],
    trap:['🎭','True or Trap','ตัดสินว่าคู่คำศัพท์จริงหรือหลอก']
  };

  function recents(){try{return JSON.parse(localStorage.getItem(RECENT_KEY)||'{}')||{}}catch{return{}}}
  function remember(bucket,keys){const r=recents();r[bucket]=[...(r[bucket]||[]),...keys].slice(-30);localStorage.setItem(RECENT_KEY,JSON.stringify(r))}
  function uniquePick(pool,bucket,n,key=x=>String(x.id??x[0]??x)){
    const r=recents(),recent=new Set((r[bucket]||[]).slice(-18));
    let available=pool.filter(x=>!recent.has(key(x)));if(available.length<n)available=pool;
    const picked=shuffle(available).slice(0,n);remember(bucket,picked.map(key));return picked;
  }
  function randomPlusGame(except=''){
    const ids=Object.keys(GAME_META).filter(x=>x!==except);const r=recents();const recent=new Set((r.games||[]).slice(-3));
    const pool=ids.filter(x=>!recent.has(x));const id=shuffle(pool.length?pool:ids)[0];remember('games',[id]);return id;
  }

  function persist(){try{saveState()}catch{}}
  function lab(){try{return state?.gameLab?.date===todayKey()?state.gameLab:null}catch{return null}}
  function toast(msg){
    let el=document.querySelector('#gameLabToast');if(!el){el=document.createElement('div');el.id='gameLabToast';el.className='game-plus-toast';document.body.appendChild(el)}
    el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1500);
  }
  function correctXp(amount,reason){
    try{state.xp=(Number(state.xp)||0)+amount;const l=lab();if(l){l.combo=(l.combo||0)+1;l.bestCombo=Math.max(l.bestCombo||0,l.combo)}persist();toast(`+${amount} XP · ${reason}`)}catch{}
  }
  function miss(){try{const l=lab();if(l)l.combo=0;persist()}catch{}}
  function completeGame(){
    try{
      const l=lab();if(!l)return;
      l.progress=l.progress||{};l.rewarded=l.rewarded||{};l.progress.game=(l.progress.game||0)+1;
      const targets={learn:3,quiz:3,ai:1,game:1,listen:2};
      if((l.dailyQuestIds||[]).includes('game')&&l.progress.game>=1&&!l.rewarded.game){l.rewarded.game=true;l.stars=(l.stars||0)+1;state.xp=(Number(state.xp)||0)+15;toast('⭐ Daily Quest เกมสำเร็จ +15 XP')}
      const done=(l.dailyQuestIds||[]).every(id=>(l.progress[id]||0)>=(targets[id]||1));
      if(done&&!l.rewarded.all){l.rewarded.all=true;l.stars=(l.stars||0)+2;state.xp=(Number(state.xp)||0)+30;toast('🏆 Daily Quest ครบ +30 XP')}
      persist();
    }catch{}
  }
  function say(text){try{if(typeof speak==='function')return speak(text)}catch{};try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.82;speechSynthesis.speak(u)}catch{}}

  function close(){document.querySelector('#gameLabModal')?.remove()}
  function modal(title,body){
    close();const el=document.createElement('div');el.id='gameLabModal';el.className='game-lab-overlay';
    el.innerHTML=`<section class="game-panel game-plus-panel"><div class="game-panel-head"><h2>${esc(title)}</h2><button class="game-close" type="button">×</button></div><div id="gameLabBody">${body}</div></section>`;
    document.body.appendChild(el);el.querySelector('.game-close').onclick=close;el.addEventListener('click',e=>{if(e.target===el)close()});return el;
  }
  function finish(type,title,score,total,sub=''){
    completeGame();const meta=GAME_META[type]||['🎮','Game',''];const root=document.querySelector('#gameLabModal');if(!root)return;
    root.querySelector('#gameLabBody').innerHTML=`<div class="game-plus-finish"><div class="game-plus-trophy">${score===total?'🏆':'🎉'}</div><h2>${esc(title)}</h2><p>${esc(sub||`ทำได้ ${score}/${total} · XP และ Combo ถูกบันทึกแล้ว`)}</p><div class="game-plus-score"><b>${score}/${total}</b><span>${esc(meta[1])}</span></div><div class="game-plus-finish-actions"><button class="lab-primary" data-plus-again="${type}">▶ เล่นเกมนี้อีก</button><button class="lab-secondary" data-plus-random>🎲 สุ่มเกมใหม่</button><button class="game-flow-close" data-plus-close>✕ ปิดเมื่อพอแล้ว</button></div></div>`;
  }

  function meaningRush(){
    const qs=uniquePick(BANK,'rush',6);let i=0,score=0;const root=modal('⚡ Meaning Rush','<div id="plusStage"></div>');
    const next=()=>{if(i>=qs.length)return finish('rush',score===qs.length?'Perfect Rush!':'Rush สำเร็จ',score,qs.length,'คำจะเปลี่ยนใหม่ในรอบต่อไป ไม่วนชุดเดิมทันที');const w=qs[i],wrong=uniquePick(BANK.filter(x=>x.id!==w.id),`rush-w${i}`,3);const choices=shuffle([w,...wrong]);root.querySelector('#plusStage').innerHTML=`<div class="game-progress"><span>ข้อ ${i+1}/${qs.length}</span><span>⚡ Combo ${lab()?.combo||0}</span></div><div class="game-stage"><p class="game-prompt game-plus-word">${esc(w.en)}</p><p class="game-sub">เลือกความหมายให้ไว</p><div class="choice-stack">${choices.map(x=>`<button class="lab-choice" data-id="${x.id}">${esc(x.th)}</button>`).join('')}</div></div>`;root.querySelectorAll('.lab-choice').forEach(b=>b.onclick=()=>{root.querySelectorAll('.lab-choice').forEach(x=>x.disabled=true);if(Number(b.dataset.id)===w.id){b.classList.add('correct');score++;correctXp(3,'Meaning Rush')}else{b.classList.add('wrong');root.querySelector(`[data-id="${w.id}"]`)?.classList.add('correct');miss()}i++;setTimeout(next,430)})};next();
  }

  function missingWord(){
    const pool=BANK.filter(w=>new RegExp(`\\b${w.en.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}\\b`,'i').test(w.sentence));const qs=uniquePick(pool,'gap',5);let i=0,score=0;const root=modal('🧩 Missing Word','<div id="plusStage"></div>');
    const next=()=>{if(i>=qs.length)return finish('gap','เติมประโยคครบแล้ว',score,qs.length,'ฝึกจำคำในบริบท ไม่ใช่จำคำแปลอย่างเดียว');const w=qs[i],blank=w.sentence.replace(new RegExp(`\\b${w.en.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}\\b`,'i'),'_____'),wrong=uniquePick(BANK.filter(x=>x.id!==w.id),`gap-w${i}`,3),choices=shuffle([w,...wrong]);root.querySelector('#plusStage').innerHTML=`<div class="game-progress"><span>ข้อ ${i+1}/${qs.length}</span><span>🧩 เติมคำ</span></div><div class="game-stage"><p class="game-prompt">${esc(blank)}</p><p class="game-sub">${esc(w.sentenceTh)}</p><div class="choice-stack">${choices.map(x=>`<button class="lab-choice" data-id="${x.id}">${esc(x.en)}</button>`).join('')}</div></div>`;root.querySelectorAll('.lab-choice').forEach(b=>b.onclick=()=>{root.querySelectorAll('.lab-choice').forEach(x=>x.disabled=true);if(Number(b.dataset.id)===w.id){b.classList.add('correct');score++;correctXp(4,'Missing Word')}else{b.classList.add('wrong');root.querySelector(`[data-id="${w.id}"]`)?.classList.add('correct');miss()}i++;setTimeout(next,500)})};next();
  }

  function translatePick(){
    const qs=uniquePick(BANK,'translate',5);let i=0,score=0;const root=modal('🇹🇭 Thai → English','<div id="plusStage"></div>');
    const next=()=>{if(i>=qs.length)return finish('translate','แปลเป็นอังกฤษครบแล้ว',score,qs.length,'รอบใหม่จะสุ่มทั้งประโยคและตัวลวงชุดใหม่');const w=qs[i],wrong=uniquePick(BANK.filter(x=>x.id!==w.id),`trans-w${i}`,2),choices=shuffle([w,...wrong]);root.querySelector('#plusStage').innerHTML=`<div class="game-progress"><span>ข้อ ${i+1}/${qs.length}</span><span>🇹🇭 → 🇬🇧</span></div><div class="game-stage"><p class="game-prompt">${esc(w.sentenceTh)}</p><p class="game-sub">เลือกประโยคอังกฤษที่ตรงที่สุด</p><div class="choice-stack">${choices.map(x=>`<button class="lab-choice" data-id="${x.id}">${esc(x.sentence)}</button>`).join('')}</div></div>`;root.querySelectorAll('.lab-choice').forEach(b=>b.onclick=()=>{root.querySelectorAll('.lab-choice').forEach(x=>x.disabled=true);if(Number(b.dataset.id)===w.id){b.classList.add('correct');score++;correctXp(5,'Translate Pick')}else{b.classList.add('wrong');root.querySelector(`[data-id="${w.id}"]`)?.classList.add('correct');miss()}i++;setTimeout(next,520)})};next();
  }

  function memoryFlip(){
    const set=uniquePick(BANK,'memory',4),cards=shuffle(set.flatMap(w=>[{k:w.id,t:w.en,side:'en'},{k:w.id,t:w.th,side:'th'}]));let first=null,locked=false,matched=0,moves=0;
    const root=modal('🧠 Memory Flip',`<div class="game-progress"><span>จับคู่ 4 คู่</span><span id="memoryMoves">0 moves</span></div><div class="memory-grid">${cards.map((c,i)=>`<button class="memory-card" data-i="${i}" data-k="${c.k}" data-side="${c.side}"><span>?</span><b>${esc(c.t)}</b></button>`).join('')}</div><div class="lab-feedback">เปิดทีละ 2 ใบ แล้วจำตำแหน่งคำอังกฤษกับความหมายไทย</div>`);
    root.querySelectorAll('.memory-card').forEach(card=>card.onclick=()=>{if(locked||card.classList.contains('matched')||card===first)return;card.classList.add('open');moves++;root.querySelector('#memoryMoves').textContent=`${moves} moves`;if(!first){first=card;return}locked=true;const good=first.dataset.k===card.dataset.k&&first.dataset.side!==card.dataset.side;if(good){first.classList.add('matched');card.classList.add('matched');matched++;correctXp(5,'Memory Match');first=null;locked=false;if(matched===set.length)setTimeout(()=>finish('memory','จับคู่ครบแล้ว',set.length,set.length,`ใช้ ${moves} moves · รอบใหม่จะเปลี่ยนชุดคำ`),350)}else{miss();setTimeout(()=>{first?.classList.remove('open');card.classList.remove('open');first=null;locked=false},650)}});
  }

  function survivalDialog(){
    const qs=uniquePick(DIALOGS,'dialog',5,x=>x[0]);let i=0,score=0;const root=modal('🗣️ Survival Dialog','<div id="plusStage"></div>');
    const next=()=>{if(i>=qs.length)return finish('dialog',score===qs.length?'Survival Perfect!':'ผ่านสถานการณ์แล้ว',score,qs.length,'รอบใหม่จะสลับร้านอาหาร โรงแรม สนามบิน ซื้อของ และชีวิตประจำวัน');const q=qs[i],choices=shuffle(q[1].map((text,idx)=>({text,ok:idx===q[2]})));root.querySelector('#plusStage').innerHTML=`<div class="game-progress"><span>สถานการณ์ ${i+1}/${qs.length}</span><span>🗣️ Choose your reply</span></div><div class="game-stage"><p class="game-prompt">${esc(q[0])}</p><div class="choice-stack">${choices.map((x,j)=>`<button class="story-choice" data-ok="${x.ok?'1':'0'}" data-j="${j}">${esc(x.text)}</button>`).join('')}</div></div>`;root.querySelectorAll('.story-choice').forEach(b=>b.onclick=()=>{root.querySelectorAll('.story-choice').forEach(x=>x.disabled=true);if(b.dataset.ok==='1'){b.classList.add('correct');score++;correctXp(6,'Survival Dialog')}else{b.classList.add('wrong');root.querySelector('[data-ok="1"]')?.classList.add('correct');miss()}i++;setTimeout(next,560)})};next();
  }

  function spellByEar(){
    const qs=uniquePick(BANK,'spell',5);let i=0,score=0;const root=modal('🎧 Spell by Ear','<div id="plusStage"></div>');
    const next=()=>{if(i>=qs.length)return finish('spell','ฟังและสะกดครบแล้ว',score,qs.length,'ระบบจะหลีกเลี่ยงคำที่เพิ่งออกในรอบก่อน');const w=qs[i];root.querySelector('#plusStage').innerHTML=`<div class="game-progress"><span>ข้อ ${i+1}/${qs.length}</span><span>🎧 Listen & type</span></div><div class="game-stage spell-stage"><button class="listen-orb" id="plusSpeak">🔊</button><p class="game-sub" style="text-align:center">ฟังแล้วพิมพ์คำอังกฤษ</p><input class="spell-input" id="spellInput" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="พิมพ์คำที่ได้ยิน"><button class="lab-primary" id="spellCheck">ตรวจคำตอบ</button><div class="lab-feedback" id="spellFeedback">กดลำโพงฟังซ้ำได้</div></div>`;const input=root.querySelector('#spellInput'),check=root.querySelector('#spellCheck');root.querySelector('#plusSpeak').onclick=()=>say(w.en);setTimeout(()=>say(w.en),160);const submit=()=>{const val=input.value.trim().toLowerCase();if(!val)return;input.disabled=true;check.disabled=true;if(val===w.en.toLowerCase()){score++;correctXp(7,'Spell by Ear');root.querySelector('#spellFeedback').textContent=`✅ ${w.en} — ${w.th}`}else{miss();root.querySelector('#spellFeedback').textContent=`คำตอบ: ${w.en} — ${w.th}`}i++;setTimeout(next,750)};check.onclick=submit;input.onkeydown=e=>{if(e.key==='Enter')submit()};setTimeout(()=>input.focus(),80)};next();
  }

  function trueOrTrap(){
    const qs=uniquePick(BANK,'trap',7);let i=0,score=0;const root=modal('🎭 True or Trap','<div id="plusStage"></div>');
    const next=()=>{if(i>=qs.length)return finish('trap','จับของจริงกับของหลอกครบแล้ว',score,qs.length,'แต่ละรอบมีทั้งคู่จริงและคู่หลอกแบบสุ่ม');const w=qs[i],isTrue=Math.random()>.45,shown=isTrue?w:uniquePick(BANK.filter(x=>x.id!==w.id),`trap-w${i}`,1)[0];root.querySelector('#plusStage').innerHTML=`<div class="game-progress"><span>ข้อ ${i+1}/${qs.length}</span><span>🎭 จริงหรือหลอก?</span></div><div class="game-stage true-trap"><p class="game-plus-word">${esc(w.en)}</p><div class="trap-arrow">↔</div><p class="trap-meaning">${esc(shown.th)}</p><div class="trap-actions"><button class="trap-btn true" data-answer="1">✓ จริง</button><button class="trap-btn false" data-answer="0">✕ หลอก</button></div></div>`;root.querySelectorAll('.trap-btn').forEach(b=>b.onclick=()=>{root.querySelectorAll('.trap-btn').forEach(x=>x.disabled=true);const ok=(b.dataset.answer==='1')===isTrue;if(ok){b.classList.add('correct');score++;correctXp(3,'True or Trap')}else{b.classList.add('wrong');miss()}i++;setTimeout(next,430)})};next();
  }

  function open(type){
    if(type==='mix')type=randomPlusGame();
    remember('games',[type]);
    ({rush:meaningRush,gap:missingWord,translate:translatePick,memory:memoryFlip,dialog:survivalDialog,spell:spellByEar,trap:trueOrTrap}[type]||meaningRush)();
  }

  function cardsHtml(){
    const cards=[['mix','🎲','Daily Mix','สุ่มเกมให้เองและพยายามไม่ซ้ำเกมล่าสุด'],...Object.entries(GAME_META).map(([id,m])=>[id,m[0],m[1],m[2]])];
    return `<div class="game-plus-title"><div><span class="game-plus-kicker">MORE VARIETY · NEW</span><h2>🎯 Mix Zone</h2></div><p>เกมใหม่ 7 แบบ + Daily Mix · คำและสถานการณ์จะหลีกเลี่ยงชุดที่เพิ่งเล่น</p></div><section class="game-grid game-plus-grid">${cards.map((c,i)=>`<button class="game-card ${i===0?'featured game-plus-featured':''}" data-lab-plus="${c[0]}"><span class="game-tag">${i===0?'SMART MIX':'NEW'}</span><div class="game-icon">${c[1]}</div><h3>${esc(c[2])}</h3><p>${esc(c[3])}</p></button>`).join('')}</section>`;
  }
  function enhance(){
    if(typeof view!=='undefined'&&view!=='home')return;const grid=document.querySelector('.game-grid');if(!grid||document.querySelector('.game-plus-title'))return;grid.insertAdjacentHTML('afterend',cardsHtml());
  }

  document.addEventListener('click',e=>{
    const card=e.target.closest?.('[data-lab-plus]');if(card){e.preventDefault();open(card.dataset.labPlus);return}
    const again=e.target.closest?.('[data-plus-again]');if(again){e.preventDefault();open(again.dataset.plusAgain);return}
    if(e.target.closest?.('[data-plus-random]')){e.preventDefault();open(randomPlusGame());return}
    if(e.target.closest?.('[data-plus-close]')){e.preventDefault();close()}
  });
  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));observer.observe(document.querySelector('#app')||document.body,{childList:true,subtree:true});
  window.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(enhance));
  window.__gameLabPlusOpen=open;
})();
