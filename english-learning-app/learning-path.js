(()=>{
  const PATH_KEY='myEnglishLearningPathV1';
  const levels=[
    {id:'L0',title:'เริ่มจากศูนย์',subtitle:'เสียง คำพื้นฐาน และประโยคแรก',goal:'พูดแนะนำตัวและตอบคำถามง่าย ๆ ได้',units:[
      {id:'l0u1',title:'Hello English',focus:'ทักทายและแนะนำตัว',pattern:'Hello. My name is ___.',examples:[['Hello!','สวัสดี'],['My name is Kung.','ฉันชื่อกุ้ง'],['Nice to meet you.','ยินดีที่ได้รู้จัก']],ai:'Introduce yourself in 2 short sentences.'},
      {id:'l0u2',title:'Yes / No / Please',focus:'คำเอาตัวรอดพื้นฐาน',pattern:'Yes, please. / No, thank you.',examples:[['Yes, please.','ใช่ครับ/ค่ะ'],['No, thank you.','ไม่ ขอบคุณ'],['Sorry.','ขอโทษ']],ai:'Practice a tiny polite conversation using yes, no, please, and thank you.'},
      {id:'l0u3',title:'I am / You are',focus:'รู้จัก verb to be',pattern:'I am ___. / You are ___.',examples:[['I am tired.','ฉันเหนื่อย'],['I am ready.','ฉันพร้อม'],['You are kind.','คุณใจดี']],ai:'Ask me how I am and help me answer with I am...'},
      {id:'l0u4',title:'Numbers & Time',focus:'ตัวเลข อายุ เวลา',pattern:'I am ___ years old. / It is ___ o’clock.',examples:[['I am thirty years old.','ฉันอายุ 30 ปี'],['It is nine o’clock.','ตอนนี้ 9 โมง'],['Two tickets, please.','ขอตั๋วสองใบ']],ai:'Practice numbers, age, and simple time questions.'}
    ]},
    {id:'L1',title:'เอาตัวรอดในชีวิตประจำวัน',subtitle:'คำศัพท์และประโยคที่ใช้ทุกวัน',goal:'ขอของ ถามราคา ถามทาง และตอบเรื่องตัวเองได้',units:[
      {id:'l1u1',title:'I want / I need',focus:'บอกความต้องการ',pattern:'I want ___. / I need ___.',examples:[['I want water.','ฉันต้องการน้ำ'],['I need help.','ฉันต้องการความช่วยเหลือ'],['I need a room.','ฉันต้องการห้องพัก']],ai:'Role-play a simple situation where I need to ask for something.'},
      {id:'l1u2',title:'I like / I don’t like',focus:'ความชอบ',pattern:'I like ___. / I don’t like ___.',examples:[['I like coffee.','ฉันชอบกาแฟ'],['I don’t like spicy food.','ฉันไม่ชอบอาหารเผ็ด'],['I like music.','ฉันชอบดนตรี']],ai:'Ask me 3 easy questions about things I like.'},
      {id:'l1u3',title:'Where / How much',focus:'ถามทางและราคา',pattern:'Where is ___? / How much is this?',examples:[['Where is the station?','สถานีอยู่ที่ไหน'],['Where is the bathroom?','ห้องน้ำอยู่ที่ไหน'],['How much is this?','อันนี้ราคาเท่าไร']],ai:'Practice asking directions and prices in a shop.'},
      {id:'l1u4',title:'Daily Routine',focus:'เล่ากิจวัตร',pattern:'I ___ every day.',examples:[['I work every day.','ฉันทำงานทุกวัน'],['I go home at six.','ฉันกลับบ้านหกโมง'],['I drink coffee in the morning.','ฉันดื่มกาแฟตอนเช้า']],ai:'Ask me about my daily routine using very easy questions.'}
    ]},
    {id:'L2',title:'ต่อประโยคให้เป็น',subtitle:'สร้างประโยคเอง ไม่ท่องอย่างเดียว',goal:'พูดเรื่องปัจจุบัน อดีต อนาคต และความสามารถได้',units:[
      {id:'l2u1',title:'Can / Can’t',focus:'ความสามารถและการขออนุญาต',pattern:'I can ___. / Can I ___?',examples:[['I can speak a little English.','ฉันพูดอังกฤษได้นิดหน่อย'],['Can I sit here?','ฉันนั่งตรงนี้ได้ไหม'],['I can’t understand.','ฉันไม่เข้าใจ']],ai:'Practice can and can’t with me.'},
      {id:'l2u2',title:'Present Simple Questions',focus:'ถามด้วย do / does',pattern:'Do you ___?',examples:[['Do you work here?','คุณทำงานที่นี่ไหม'],['Do you like coffee?','คุณชอบกาแฟไหม'],['What do you do?','คุณทำงานอะไร']],ai:'Ask me 4 present-simple questions and correct my answers.'},
      {id:'l2u3',title:'Past Basics',focus:'เล่าเมื่อวานแบบง่าย',pattern:'Yesterday I ___.',examples:[['Yesterday I worked.','เมื่อวานฉันทำงาน'],['I went home early.','ฉันกลับบ้านเร็ว'],['I had coffee.','ฉันดื่มกาแฟ']],ai:'Help me tell a 3-sentence story about yesterday.'},
      {id:'l2u4',title:'Future Basics',focus:'แผนพรุ่งนี้',pattern:'Tomorrow I will ___. / I’m going to ___.',examples:[['Tomorrow I will work.','พรุ่งนี้ฉันจะทำงาน'],['I’m going to travel.','ฉันกำลังจะเดินทาง'],['I will call you later.','ฉันจะโทรหาคุณทีหลัง']],ai:'Ask me about my plans for tomorrow.'}
    ]},
    {id:'L3',title:'สถานการณ์จริง',subtitle:'ใช้ภาษาอังกฤษให้รอดในโลกจริง',goal:'คุยในร้านอาหาร ร้านค้า โรงแรม สนามบิน และที่ทำงานได้',units:[
      {id:'l3u1',title:'Restaurant',focus:'สั่งอาหารและเช็กบิล',pattern:'I’d like ___, please.',examples:[['I’d like chicken and rice, please.','ขอไก่กับข้าวครับ/ค่ะ'],['No spicy, please.','ไม่เผ็ดครับ/ค่ะ'],['The bill, please.','ขอเช็กบิล']],ai:'Role-play a restaurant. You are the server and I am the customer.'},
      {id:'l3u2',title:'Shopping',focus:'ถามราคา ขนาด สี',pattern:'Do you have this in ___?',examples:[['How much is this?','อันนี้ราคาเท่าไร'],['Do you have a larger size?','มีไซซ์ใหญ่กว่านี้ไหม'],['Can I pay by card?','จ่ายบัตรได้ไหม']],ai:'Role-play shopping for clothes and help me ask price, size, and payment.'},
      {id:'l3u3',title:'Hotel & Travel',focus:'เช็กอินและถามข้อมูล',pattern:'I have a reservation.',examples:[['I have a reservation.','ฉันจองไว้แล้ว'],['What time is breakfast?','อาหารเช้ากี่โมง'],['Where is the elevator?','ลิฟต์อยู่ที่ไหน']],ai:'Role-play hotel check-in with simple English.'},
      {id:'l3u4',title:'Airport & Directions',focus:'เกต กระเป๋า การเดินทาง',pattern:'Where is gate ___?',examples:[['Where is gate twelve?','เกต 12 อยู่ไหน'],['Where can I get a taxi?','ฉันเรียกแท็กซี่ได้ที่ไหน'],['My bag is missing.','กระเป๋าฉันหาย']],ai:'Role-play an airport situation from check-in to finding the gate.'},
      {id:'l3u5',title:'Workplace English',focus:'คุยงานง่าย ๆ',pattern:'I’m working on ___.',examples:[['I’m working on a report.','ฉันกำลังทำรายงาน'],['I have a meeting at ten.','ฉันมีประชุม 10 โมง'],['Can you send me an email?','ส่งอีเมลให้ฉันได้ไหม']],ai:'Practice a simple workplace conversation with me.'}
    ]},
    {id:'L4',title:'คุยให้ต่อเนื่อง',subtitle:'ไม่หยุดแค่ประโยคเดียว',goal:'ถามต่อ อธิบายเหตุผล แสดงความเห็น และแก้สถานการณ์ได้',units:[
      {id:'l4u1',title:'Follow-up Questions',focus:'ถามต่อให้บทสนทนาไหล',pattern:'Really? Why? / What about you?',examples:[['Really?','จริงเหรอ'],['Why do you like it?','ทำไมคุณถึงชอบมัน'],['What about you?','แล้วคุณล่ะ']],ai:'Have a conversation with me and require me to ask follow-up questions.'},
      {id:'l4u2',title:'Opinions',focus:'แสดงความคิดเห็น',pattern:'I think ___. / In my opinion, ___.',examples:[['I think it is good.','ฉันคิดว่ามันดี'],['In my opinion, it is too expensive.','ฉันคิดว่ามันแพงเกินไป'],['I agree.','ฉันเห็นด้วย']],ai:'Ask my opinion about 3 easy everyday topics.'},
      {id:'l4u3',title:'Explain a Problem',focus:'บอกปัญหาและขอความช่วยเหลือ',pattern:'There is a problem with ___.',examples:[['There is a problem with my room.','ห้องของฉันมีปัญหา'],['My computer is not working.','คอมพิวเตอร์ฉันใช้ไม่ได้'],['Could you help me?','ช่วยฉันได้ไหม']],ai:'Give me a small problem and make me explain it and ask for help.'},
      {id:'l4u4',title:'Tell a Short Story',focus:'เล่าเหตุการณ์ 4–5 ประโยค',pattern:'First... Then... After that... Finally...',examples:[['First, I went to work.','ก่อนอื่นฉันไปทำงาน'],['Then, I had lunch.','จากนั้นฉันกินข้าวกลางวัน'],['Finally, I went home.','สุดท้ายฉันกลับบ้าน']],ai:'Help me tell a short story using first, then, after that, and finally.'}
    ]},
    {id:'L5',title:'Conversation Ready',subtitle:'ฝึกคุยจริงแบบไม่รู้คำถามล่วงหน้า',goal:'สนทนา 5–10 นาทีในหัวข้อคุ้นเคยได้',units:[
      {id:'l5u1',title:'Small Talk 5 Minutes',focus:'คุยเรื่องวัน งาน อาหาร งานอดิเรก',pattern:'Keep the conversation going.',examples:[['How was your day?','วันนี้เป็นอย่างไรบ้าง'],['What do you do in your free time?','เวลาว่างคุณทำอะไร'],['That sounds interesting.','ฟังดูน่าสนใจ']],ai:'Have a 5-minute beginner-friendly small-talk conversation. Ask one question at a time.'},
      {id:'l5u2',title:'Travel Challenge',focus:'เดินทางตั้งแต่สนามบินถึงโรงแรม',pattern:'Solve the situation in English.',examples:[['My flight is delayed.','เที่ยวบินฉันล่าช้า'],['I need to change my booking.','ฉันต้องการเปลี่ยนการจอง'],['Could you say that again?','พูดอีกครั้งได้ไหม']],ai:'Give me a multi-step travel role-play. Do not tell me the next step until I answer.'},
      {id:'l5u3',title:'Work Conversation',focus:'อัปเดตงาน ถามงาน และขอความช่วยเหลือ',pattern:'Here is my update...',examples:[['I finished the first part.','ฉันทำส่วนแรกเสร็จแล้ว'],['I need more time.','ฉันต้องการเวลาเพิ่ม'],['Can we discuss this later?','เราคุยเรื่องนี้ทีหลังได้ไหม']],ai:'Run a simple work meeting role-play with status update and follow-up questions.'},
      {id:'l5u4',title:'Free Conversation Test',focus:'คุยอิสระและวัดความพร้อม',pattern:'Speak naturally with what you know.',examples:[['Let me think.','ขอฉันคิดก่อน'],['I’m not sure, but...','ฉันไม่แน่ใจ แต่...'],['Could you explain that?','ช่วยอธิบายได้ไหม']],ai:'Give me a conversation readiness test for a Thai beginner. Talk naturally, one question at a time, then summarize strengths and 3 things to improve.'}
    ]}
  ];

  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function read(){try{return JSON.parse(localStorage.getItem(PATH_KEY)||'{"done":[]}')}catch{return{done:[]}}}
  function write(v){localStorage.setItem(PATH_KEY,JSON.stringify(v))}
  function isDone(id){return read().done.includes(id)}
  function toggleDone(id){const s=read();s.done=isDone(id)?s.done.filter(x=>x!==id):[...s.done,id];write(s);renderRoadmap();}
  function allUnits(){return levels.flatMap(l=>l.units)}
  function percent(){const done=read().done.length,total=allUnits().length;return Math.round(done/total*100)}

  function roadmapHtml(){
    const done=read().done.length,total=allUnits().length;
    return `<section class="roadmap-card" id="learningRoadmap"><div class="roadmap-head"><div><div class="hero-kicker">LEARNING ROADMAP</div><h2>เส้นทางจากศูนย์ → สนทนาได้</h2><p>เรียนทีละบทสั้น ๆ แล้วต่อด้วย Quiz, Game และ AI Coach</p></div><div class="roadmap-progress"><b>${percent()}%</b><span>${done}/${total} บท</span></div></div><div class="roadmap-track"><i style="width:${percent()}%"></i></div><div class="roadmap-levels">${levels.map((l,i)=>{const d=l.units.filter(u=>isDone(u.id)).length;return `<button class="roadmap-level" data-path-level="${l.id}"><span class="level-dot">${i}</span><div><b>${l.id} · ${esc(l.title)}</b><small>${d}/${l.units.length} บท · ${esc(l.goal)}</small></div></button>`}).join('')}</div></section>`;
  }

  function renderRoadmap(){
    const old=document.querySelector('#learningRoadmap');
    if(old){const box=document.createElement('div');box.innerHTML=roadmapHtml();old.replaceWith(box.firstElementChild);bindRoadmap();return}
    if(typeof view==='undefined'||view!=='home')return;
    const app=document.querySelector('#app'),anchor=document.querySelector('#questHub')||app?.querySelector('.hero');
    if(!app||!anchor)return;
    anchor.insertAdjacentHTML('afterend',roadmapHtml());bindRoadmap();
  }
  function bindRoadmap(){document.querySelectorAll('[data-path-level]').forEach(b=>b.onclick=()=>openLevel(b.dataset.pathLevel))}

  function modal(title,body){document.querySelector('#pathModal')?.remove();const el=document.createElement('div');el.id='pathModal';el.className='path-overlay';el.innerHTML=`<section class="path-panel"><div class="path-panel-head"><h2>${title}</h2><button id="pathClose" type="button">×</button></div><div>${body}</div></section>`;document.body.appendChild(el);el.querySelector('#pathClose').onclick=()=>el.remove();el.addEventListener('click',e=>{if(e.target===el)el.remove()});return el}

  function openLevel(id){const l=levels.find(x=>x.id===id);if(!l)return;const root=modal(`${l.id} · ${esc(l.title)}`,`<p class="path-intro">${esc(l.subtitle)}<br><b>เป้าหมาย:</b> ${esc(l.goal)}</p><div class="unit-list">${l.units.map((u,i)=>`<button class="unit-row ${isDone(u.id)?'done':''}" data-unit="${u.id}"><span>${isDone(u.id)?'✅':String(i+1).padStart(2,'0')}</span><div><b>${esc(u.title)}</b><small>${esc(u.focus)}</small></div><em>›</em></button>`).join('')}</div>`);root.querySelectorAll('[data-unit]').forEach(b=>b.onclick=()=>openUnit(b.dataset.unit))}

  function openUnit(id){const u=allUnits().find(x=>x.id===id);if(!u)return;const root=modal(`📘 ${esc(u.title)}`,`<div class="lesson-sheet"><div class="lesson-focus">${esc(u.focus)}</div><div class="pattern-box"><small>PATTERN</small><b>${esc(u.pattern)}</b></div><div class="example-stack">${u.examples.map(e=>`<button class="example-line" data-say="${esc(e[0])}"><span><b>${esc(e[0])}</b><small>${esc(e[1])}</small></span><em>🔊</em></button>`).join('')}</div><div class="path-actions"><button id="unitDone" class="lab-secondary">${isDone(u.id)?'✓ เรียนแล้ว':'ทำเครื่องหมายว่าเรียนแล้ว'}</button><button id="unitAI" class="lab-primary">ฝึกต่อกับ AI Coach</button></div></div>`);
    root.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>{try{if(typeof speak==='function')speak(b.dataset.say)}catch{}});
    root.querySelector('#unitDone').onclick=()=>{toggleDone(u.id);root.remove()};
    root.querySelector('#unitAI').onclick=()=>{try{state.pendingMission={text:`Lesson: ${u.title}`,thai:u.focus,prompt:u.ai};state.chat=[{role:'ai',text:`🎯 Lesson Mission: ${u.ai}`,thai:`บท ${u.title} · ${u.focus}`}];saveState();root.remove();go('ai')}catch{root.remove()}};
  }

  const start=()=>{try{requestAnimationFrame(renderRoadmap)}catch{}};
  window.addEventListener('DOMContentLoaded',start);
  const observer=new MutationObserver(()=>{if(typeof view!=='undefined'&&view==='home'&&!document.querySelector('#learningRoadmap'))requestAnimationFrame(renderRoadmap)});
  observer.observe(document.querySelector('#app')||document.body,{childList:true,subtree:true});
})();