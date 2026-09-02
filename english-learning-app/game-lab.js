(()=>{
  const LAB_KEY='gameLabV1';
  const todayKey=()=>new Date().toLocaleDateString('en-CA');
  const pick=(arr,n=1)=>{const copy=[...arr];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return n===1?copy[0]:copy.slice(0,n)};
  const esc=v=>String(v).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));

  const questTemplates=[
    {id:'learn',label:'📚 จำคำใหม่',target:3,unit:'คำ'},
    {id:'quiz',label:'🎯 ตอบ Quiz ถูก',target:3,unit:'ข้อ'},
    {id:'ai',label:'✨ คุยกับ AI Coach',target:1,unit:'ครั้ง'},
    {id:'game',label:'🎮 จบ Mini Game',target:1,unit:'เกม'},
    {id:'listen',label:'🎧 Listening ถูก',target:2,unit:'ข้อ'}
  ];

  function freshLab(){
    const seed=Number(todayKey().replaceAll('-',''));
    const a=questTemplates[seed%questTemplates.length];
    const b=questTemplates[(seed+2)%questTemplates.length];
    const c=questTemplates[(seed+4)%questTemplates.length];
    return {date:todayKey(),progress:{learn:0,quiz:0,ai:0,game:0,listen:0},rewarded:{},combo:0,bestCombo:0,stars:0,dailyQuestIds:[a.id,b.id,c.id],aiMission:null};
  }

  function lab(){
    state.gameLab=state.gameLab&&state.gameLab.date===todayKey()?state.gameLab:freshLab();
    return state.gameLab;
  }
  function persist(){saveState();}
  function currentQuests(){const l=lab();return l.dailyQuestIds.map(id=>questTemplates.find(q=>q.id===id)).filter(Boolean)}
  function awardXp(amount,reason){state.xp=(Number(state.xp)||0)+amount;const l=lab();l.combo=(l.combo||0)+1;l.bestCombo=Math.max(l.bestCombo||0,l.combo);persist();toastLab(`+${amount} XP · ${reason}`)}
  function resetCombo(){const l=lab();l.combo=0;persist()}
  function addProgress(id,amount=1){
    const l=lab();l.progress[id]=(l.progress[id]||0)+amount;
    const q=questTemplates.find(x=>x.id===id);
    if(q&&l.progress[id]>=q.target&&!l.rewarded[id]){l.rewarded[id]=true;l.stars=(l.stars||0)+1;state.xp=(Number(state.xp)||0)+15;toastLab(`⭐ Daily Quest สำเร็จ +15 XP`)}
    const quests=currentQuests();
    if(quests.every(q=>l.progress[q.id]>=q.target)&&!l.rewarded.all){l.rewarded.all=true;l.stars=(l.stars||0)+2;state.xp=(Number(state.xp)||0)+30;toastLab('🏆 Daily Quest ครบทั้งหมด +30 XP')}
    persist();
  }

  function toastLab(message){
    let el=document.querySelector('#gameLabToast');
    if(!el){el=document.createElement('div');el.id='gameLabToast';el.style.cssText='position:fixed;left:50%;bottom:105px;z-index:10020;transform:translate(-50%,20px);opacity:0;padding:10px 14px;border-radius:999px;background:#111f32;color:white;border:1px solid rgba(148,163,184,.2);font-size:12px;font-weight:800;transition:.2s;pointer-events:none;box-shadow:0 12px 40px rgba(0,0,0,.35)';document.body.appendChild(el)}
    el.textContent=message;el.style.opacity='1';el.style.transform='translate(-50%,0)';clearTimeout(toastLab.t);toastLab.t=setTimeout(()=>{el.style.opacity='0';el.style.transform='translate(-50%,20px)'},1800)
  }

  function questHtml(){
    const l=lab(),qs=currentQuests();
    return `<section class="quest-hub" id="questHub"><div class="quest-top"><div><div class="hero-kicker">DAILY QUEST</div><h2>ภารกิจวันนี้ไม่เหมือนเมื่อวาน</h2><p>ทำ 3 ภารกิจ รับดาวและ XP เพิ่ม โดยไม่ต้องเรียนยาว</p></div><div class="quest-score"><span class="quest-pill">⭐ ${l.stars||0} ดาว</span><span class="quest-pill">⚡ ${l.combo||0} Combo</span><span class="quest-pill">🏅 Best ${l.bestCombo||0}</span></div></div><div class="quest-list">${qs.map(q=>{const p=clamp(l.progress[q.id]||0,0,q.target),done=p>=q.target;return `<div class="quest-item ${done?'done':''}"><b>${done?'✅':q.label}</b><span>${p}/${q.target} ${q.unit}</span><div class="quest-bar"><i style="width:${Math.round(p/q.target*100)}%"></i></div></div>`}).join('')}</div></section>`
  }

  function gameHubHtml(){return `<div class="game-lab-title"><h2>🎮 Game Lab</h2><span>เรียนแบบไม่รู้สึกว่าเรียน</span></div><section class="game-grid"><button class="game-card featured" data-lab="ai-mission"><span class="game-tag">AI UNIQUE</span><div class="game-icon">✨</div><h3>AI Surprise Mission</h3><p>Groq สร้างภารกิจใหม่ตามระดับของคุณ</p></button><button class="game-card" data-lab="match"><div class="game-icon">🧩</div><h3>Word Match</h3><p>จับคู่คำอังกฤษกับความหมายไทย</p></button><button class="game-card" data-lab="builder"><div class="game-icon">🧱</div><h3>Sentence Builder</h3><p>เรียงคำให้เป็นประโยคจริง</p></button><button class="game-card" data-lab="listen"><div class="game-icon">🎧</div><h3>Listening Hunt</h3><p>ฟังเสียงแล้วล่าความหมายที่ถูก</p></button><button class="game-card" data-lab="story"><span class="game-tag">STORY</span><div class="game-icon">🗺️</div><h3>English Adventure</h3><p>ผ่านด่านสถานการณ์จริงแบบเนื้อเรื่อง</p></button><button class="game-card" data-lab="sprint"><div class="game-icon">⚡</div><h3>Flash Sprint</h3><p>5 ข้อรวด เน้นความไวและ Combo</p></button></section>`}

  function enhanceHome(){
    if(view!=='home')return;
    const app=document.querySelector('#app');if(!app||document.querySelector('#questHub'))return;
    const hero=app.querySelector('.hero');if(!hero)return;
    hero.insertAdjacentHTML('afterend',questHtml()+gameHubHtml());
    app.querySelectorAll('[data-lab]').forEach(b=>b.addEventListener('click',()=>openGame(b.dataset.lab)));
  }

  function modal(title,body){
    closeGame();
    const el=document.createElement('div');el.id='gameLabModal';el.className='game-lab-overlay';
    el.innerHTML=`<section class="game-panel"><div class="game-panel-head"><h2>${title}</h2><button class="game-close" type="button">×</button></div><div id="gameLabBody">${body}</div></section>`;
    document.body.appendChild(el);el.querySelector('.game-close').onclick=closeGame;el.addEventListener('click',e=>{if(e.target===el)closeGame()});return el
  }
  function closeGame(){document.querySelector('#gameLabModal')?.remove()}

  function openGame(type){
    if(type==='match')return gameMatch();
    if(type==='builder')return sentenceBuilder();
    if(type==='listen')return listeningHunt();
    if(type==='story')return storyAdventure();
    if(type==='sprint')return flashSprint();
    if(type==='ai-mission')return aiMission();
  }

  function gameMatch(){
    const set=pick(words,4),left=pick(set,4),right=pick(set,4);let selected=null,solved=new Set();
    const root=modal('🧩 Word Match',`<div class="game-progress"><span>จับคู่ให้ครบ 4 คู่</span><span class="combo-pop">⚡ ${lab().combo||0} Combo</span></div><div class="match-board"><div class="match-col" id="matchEn">${left.map(w=>`<button class="word-tile" data-k="${esc(w[0])}">${esc(w[0])}</button>`).join('')}</div><div class="match-col" id="matchTh">${right.map(w=>`<button class="word-tile" data-k="${esc(w[0])}">${esc(w[1])}</button>`).join('')}</div></div><div class="lab-feedback" id="labFeedback">เลือกคำอังกฤษ แล้วเลือกความหมายภาษาไทย</div>`);
    const feedback=root.querySelector('#labFeedback');
    root.querySelectorAll('#matchEn .word-tile').forEach(btn=>btn.onclick=()=>{if(solved.has(btn.dataset.k))return;root.querySelectorAll('#matchEn .word-tile').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected');selected=btn.dataset.k});
    root.querySelectorAll('#matchTh .word-tile').forEach(btn=>btn.onclick=()=>{if(!selected||solved.has(btn.dataset.k))return;if(btn.dataset.k===selected){solved.add(selected);root.querySelectorAll(`[data-k="${CSS.escape(selected)}"]`).forEach(x=>{x.classList.add('correct');x.disabled=true});feedback.textContent=`ถูกต้อง! ${selected}`;awardXp(4,'จับคู่ถูก');selected=null;if(solved.size===4){addProgress('game');setTimeout(()=>finishPanel(root,'จับคู่ครบแล้ว!','+16 XP และเพิ่ม Combo'),450)}}else{btn.classList.add('wrong');feedback.textContent='ยังไม่ใช่ ลองอีกครั้ง';resetCombo();setTimeout(()=>btn.classList.remove('wrong'),450)}})
  }

  function sentenceBuilder(){
    const candidates=words.filter(w=>w[3].split(/\s+/).length>=3&&w[3].split(/\s+/).length<=7);const w=pick(candidates);const target=w[3].replace(/[.!?]$/,'');const tokens=target.split(/\s+/);const shuffled=pick(tokens.map((t,i)=>({t,i})),tokens.length);let chosen=[];
    const root=modal('🧱 Sentence Builder',`<div class="game-stage"><p class="game-prompt">${esc(w[4])}</p><p class="game-sub">แตะคำเพื่อเรียงเป็นภาษาอังกฤษ</p><div class="builder-answer" id="builderAnswer"></div><div class="builder-pool" id="builderPool">${shuffled.map((x,i)=>`<button class="token-btn" data-i="${i}" data-word="${esc(x.t)}">${esc(x.t)}</button>`).join('')}</div><div class="lab-actions"><button class="lab-secondary" id="builderReset">เริ่มใหม่</button><button class="lab-primary" id="builderCheck">ตรวจคำตอบ</button></div><div class="lab-feedback" id="labFeedback">ประโยคนี้ใช้ได้จริงในชีวิตประจำวัน</div></div>`);
    const answer=root.querySelector('#builderAnswer'),feedback=root.querySelector('#labFeedback');
    const draw=()=>{answer.innerHTML=chosen.map((x,idx)=>`<button class="token-btn" data-rm="${idx}">${esc(x.word)}</button>`).join('');root.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{const item=chosen.splice(Number(b.dataset.rm),1)[0];root.querySelector(`[data-i="${item.i}"]`).classList.remove('used');draw()})};
    root.querySelectorAll('#builderPool .token-btn').forEach(btn=>btn.onclick=()=>{btn.classList.add('used');chosen.push({i:Number(btn.dataset.i),word:btn.dataset.word});draw()});
    root.querySelector('#builderReset').onclick=()=>{chosen=[];root.querySelectorAll('#builderPool .token-btn').forEach(x=>x.classList.remove('used'));draw()};
    root.querySelector('#builderCheck').onclick=()=>{const text=chosen.map(x=>x.word).join(' ');if(text.toLowerCase()===target.toLowerCase()){feedback.textContent=`✅ ${target}.`;awardXp(12,'เรียงประโยคสำเร็จ');addProgress('game');setTimeout(()=>finishPanel(root,'สร้างประโยคสำเร็จ','คุณกำลังจำภาษาเป็น “ชุดคำ” ไม่ใช่ท่องทีละคำ'),500)}else{feedback.textContent='ยังไม่ถูก ลองสลับตำแหน่งคำดู';resetCombo()}}
  }

  function listeningHunt(){let round=0,score=0;const total=3;const root=modal('🎧 Listening Hunt','<div id="listenStage"></div>');
    const next=()=>{if(round>=total){addProgress('game');return finishPanel(root,`ฟังถูก ${score}/${total}`,score===total?'หูเริ่มจับเสียงอังกฤษได้ดีมาก':'กลับมาเล่นใหม่ได้ คำจะสุ่มเปลี่ยน')}
      const correct=pick(words),wrong=pick(words.filter(w=>w[0]!==correct[0]),3),choices=pick([correct,...wrong],4);root.querySelector('#listenStage').innerHTML=`<div class="game-progress"><span>ข้อ ${round+1}/${total}</span><span>🎯 ${score}</span></div><button class="listen-orb" id="listenPlay">🔊</button><p class="game-sub" style="text-align:center">ฟังคำศัพท์ แล้วเลือกความหมาย</p><div class="choice-stack">${choices.map(w=>`<button class="lab-choice" data-k="${esc(w[0])}">${esc(w[1])}</button>`).join('')}</div>`;root.querySelector('#listenPlay').onclick=()=>speak(correct[0]);setTimeout(()=>speak(correct[0]),180);root.querySelectorAll('.lab-choice').forEach(btn=>btn.onclick=()=>{root.querySelectorAll('.lab-choice').forEach(x=>x.disabled=true);if(btn.dataset.k===correct[0]){btn.classList.add('correct');score++;awardXp(5,'ฟังถูก');addProgress('listen')}else{btn.classList.add('wrong');root.querySelector(`[data-k="${CSS.escape(correct[0])}"]`)?.classList.add('correct');resetCombo()}round++;setTimeout(next,650)})};next()
  }

  const stories=[
    {title:'🛫 Gate 12 หายไปไหน?',intro:'คุณอยู่สนามบินและต้องไป Gate 12 ให้ทัน',steps:[
      {q:'คุณจะถามเจ้าหน้าที่ว่า Gate 12 อยู่ที่ไหนอย่างไร?',c:['Where is Gate 12?','How much Gate 12?','I like Gate 12.'],a:0},
      {q:'เจ้าหน้าที่บอก “Go straight and turn left.” คุณควรทำอะไร?',c:['ตรงไปแล้วเลี้ยวซ้าย','เลี้ยวขวาทันที','กลับบ้าน'],a:0},
      {q:'ถึง Gate แล้ว คุณอยากบอกว่า “ขอบคุณมาก”',c:['Thank you very much.','Good night very much.','Price very much.'],a:0}
    ]},
    {title:'☕ ภารกิจร้านกาแฟ',intro:'คุณต้องสั่งกาแฟและจ่ายเงินให้สำเร็จด้วยอังกฤษ',steps:[
      {q:'พนักงานถาม “What would you like?”',c:['I would like a coffee, please.','Where is the train?','I am a hotel.'],a:0},
      {q:'คุณอยากถามราคา',c:['How much is it?','What time coffee?','Where is price?'],a:0},
      {q:'คุณจะจ่ายด้วยบัตร',c:['Can I pay by card?','Can I eat the card?','Is this a station?'],a:0}
    ]},
    {title:'🏨 เช็กอินให้รอด',intro:'คุณมาถึงโรงแรมและต้องเช็กอินด้วยตัวเอง',steps:[
      {q:'คุณมีการจองแล้ว',c:['I have a reservation.','I have a chicken.','I have a station.'],a:0},
      {q:'คุณอยากถามห้องอยู่ที่ไหน',c:['Where is my room?','How much my room?','Who is my room?'],a:0},
      {q:'ก่อนขึ้นห้อง คุณกล่าวขอบคุณ',c:['Thank you.','Turn left.','Two tickets.'],a:0}
    ]}
  ];
  function storyAdventure(){const story=stories[Number(todayKey().replaceAll('-',''))%stories.length];let step=0,score=0;const root=modal(story.title,`<p class="game-sub">${story.intro}</p><div id="storyStage"></div>`);const next=()=>{if(step>=story.steps.length){addProgress('game');return finishPanel(root,score===story.steps.length?'ผ่านภารกิจแบบ Perfect!':'ภารกิจสำเร็จ',`ตอบถูก ${score}/${story.steps.length} ด่าน`)}const s=story.steps[step];root.querySelector('#storyStage').innerHTML=`<div class="game-progress"><span>ด่าน ${step+1}/${story.steps.length}</span><span>🗺️ Story Run</span></div><div class="game-stage"><p class="game-prompt">${s.q}</p><div class="choice-stack">${s.c.map((c,i)=>`<button class="story-choice" data-i="${i}">${esc(c)}</button>`).join('')}</div></div>`;root.querySelectorAll('.story-choice').forEach(b=>b.onclick=()=>{root.querySelectorAll('.story-choice').forEach(x=>x.disabled=true);if(Number(b.dataset.i)===s.a){b.classList.add('correct');score++;awardXp(7,'ผ่านด่าน Story')}else{b.classList.add('wrong');root.querySelector(`[data-i="${s.a}"]`)?.classList.add('correct');resetCombo()}step++;setTimeout(next,650)})};next()}

  function flashSprint(){let round=0,score=0;const set=pick(words,5);const root=modal('⚡ Flash Sprint','<div id="sprintStage"></div>');const next=()=>{if(round>=set.length){addProgress('game');return finishPanel(root,`Sprint ${score}/5`,score===5?'Perfect Combo!':'รอบหน้าโจทย์จะเปลี่ยนใหม่')}const w=set[round],wrong=pick(words.filter(x=>x[0]!==w[0]),2),choices=pick([w,...wrong],3);root.querySelector('#sprintStage').innerHTML=`<div class="game-progress"><span>${round+1}/5</span><span class="combo-pop">⚡ ${lab().combo||0} Combo</span></div><div class="game-stage"><p class="game-prompt">${esc(w[0])}</p><p class="game-sub">เลือกความหมายให้เร็ว</p><div class="choice-stack">${choices.map(x=>`<button class="lab-choice" data-k="${esc(x[0])}">${esc(x[1])}</button>`).join('')}</div></div>`;root.querySelectorAll('.lab-choice').forEach(b=>b.onclick=()=>{root.querySelectorAll('.lab-choice').forEach(x=>x.disabled=true);if(b.dataset.k===w[0]){b.classList.add('correct');score++;awardXp(3+Math.min(5,lab().combo||0),'Flash Combo')}else{b.classList.add('wrong');root.querySelector(`[data-k="${CSS.escape(w[0])}"]`)?.classList.add('correct');resetCombo()}round++;setTimeout(next,420)})};next()}

  async function aiMission(){const root=modal('✨ AI Surprise Mission',`<div class="mission-card"><div class="mission-kicker">GROQ · FREE DAILY CHALLENGE</div><h3>กำลังคิดภารกิจที่ไม่ซ้ำ...</h3><p>AI จะสร้างโจทย์สั้น ๆ ตาม Level ${Math.max(1,Math.floor((state.xp||0)/100)+1)}</p></div>`);try{const r=await fetch('/api/ai',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'mission',level:Math.max(1,Math.floor((state.xp||0)/100)+1),name:state.name,scenario:state.scenario,message:'Create my surprise mission'})});const data=await r.json();if(!r.ok)throw new Error('offline');lab().aiMission={date:todayKey(),text:data.text,thai:data.thai};persist();root.querySelector('#gameLabBody').innerHTML=`<div class="mission-card"><div class="mission-kicker">TODAY'S AI SURPRISE</div><h3>${esc(data.text||'Speak English for one minute.')}</h3><p>${esc(data.thai||'ลองพูดเป็นภาษาอังกฤษตามภารกิจนี้')}</p><div class="mission-reward">🎁 ทำภารกิจแล้วไปคุยต่อใน AI Coach +15 XP</div><div class="lab-actions"><button class="lab-secondary" id="missionClose">ไว้ทีหลัง</button><button class="lab-primary" id="missionGo">ไปทำภารกิจ</button></div></div>`;root.querySelector('#missionClose').onclick=closeGame;root.querySelector('#missionGo').onclick=()=>{closeGame();awardXp(15,'รับ AI Mission');go('ai')}}catch{root.querySelector('#gameLabBody').innerHTML=`<div class="mission-card"><div class="mission-kicker">LOCAL SURPRISE</div><h3>พูด 3 ประโยคเกี่ยวกับวันนี้</h3><p>ใช้ “Today I…”, “I want…”, และ “I like…” อย่างละ 1 ประโยค</p><div class="lab-actions"><button class="lab-primary" id="missionGo">ไปคุยกับ AI Coach</button></div></div>`;root.querySelector('#missionGo').onclick=()=>{closeGame();go('ai')}}}

  function finishPanel(root,title,sub){root.querySelector('#gameLabBody').innerHTML=`<div class="game-stage" style="text-align:center;padding:30px 18px"><div style="font-size:48px">🎉</div><h2>${esc(title)}</h2><p class="game-sub">${esc(sub)}</p><button class="lab-primary" id="labDone" style="width:100%">กลับไปเลือกเกม</button></div>`;root.querySelector('#labDone').onclick=()=>{closeGame();render()}}

  const coreRender=render;
  render=function(){coreRender();requestAnimationFrame(enhanceHome)};
  const coreMarkWord=markWord;
  markWord=function(ok){if(ok)addProgress('learn');return coreMarkWord(ok)};
  const coreAnswerQuestion=answerQuestion;
  answerQuestion=function(btn){try{const q=quiz[quizIndex];if(Number(btn.dataset.choice)===q.a){addProgress('quiz');awardXp(2,'Quiz Combo')}else resetCombo()}catch{}return coreAnswerQuestion(btn)};
  const coreSendChat=sendChat;
  sendChat=async function(e){const input=document.querySelector('#chatInput');const has=Boolean(input?.value?.trim());if(has)addProgress('ai');return coreSendChat(e)};

  window.addEventListener('DOMContentLoaded',()=>{lab();requestAnimationFrame(enhanceHome)});
})();
