(()=>{
  const VERSION='v53';
  const KEY='myEnglishV2';
  const TOTAL_DAYS=210;
  const START_BY_LEVEL={starter:1,basic:22,intermediate:71,upper:141};
  const STAGES=[
    {id:'L0',from:1,to:21,label:'เริ่มจากศูนย์',cefr:'Pre-A1 / A1'},
    {id:'L1',from:22,to:56,label:'ชีวิตประจำวัน',cefr:'A1'},
    {id:'L2',from:57,to:98,label:'ต่อประโยคให้เป็น',cefr:'A1–A2'},
    {id:'L3',from:99,to:140,label:'สถานการณ์จริง',cefr:'A2–B1'},
    {id:'L4',from:141,to:182,label:'คุยให้ต่อเนื่อง',cefr:'B1'},
    {id:'L5',from:183,to:210,label:'Conversation Ready',cefr:'B1–B2'}
  ];
  const WEEKS=[
    ['L0','A1','Greetings & Sounds','ทักทาย แนะนำตัว และออกเสียงคำพื้นฐาน','Hello. My name is ___.','Nice to meet you.','พบคนใหม่และแนะนำตัว',[['hello','สวัสดี'],['name','ชื่อ'],['meet','พบ'],['nice','ยินดี/ดี'],['please','กรุณา'],['thanks','ขอบคุณ']],['Hello. My name is May.','Nice to meet you.']],
    ['L0','A1','Numbers, Age & Time','บอกตัวเลข อายุ และเวลา','I am ___ years old.','It is ___ o’clock.','ถามอายุ เวลา และจำนวน',[['number','ตัวเลข'],['time','เวลา'],['today','วันนี้'],['morning','ตอนเช้า'],['ticket','ตั๋ว'],['phone','โทรศัพท์']],['I am thirty years old.','It is nine o’clock.']],
    ['L0','A1','Objects & Polite English','ชี้สิ่งของและใช้คำสุภาพ','This is ___. / That is ___.','Yes, please. / No, thank you.','ขอของง่าย ๆ อย่างสุภาพ',[['this','นี่'],['that','นั่น'],['water','น้ำ'],['food','อาหาร'],['sorry','ขอโทษ'],['help','ช่วย']],['This is my phone.','Water, please.']],
    ['L1','A1','Family & People','พูดถึงครอบครัวและคนรอบตัว','This is my ___.','He is / She is ___.','แนะนำคนในครอบครัว',[['family','ครอบครัว'],['friend','เพื่อน'],['mother','แม่'],['father','พ่อ'],['brother','พี่/น้องชาย'],['sister','พี่/น้องสาว']],['This is my sister.','She is my friend.']],
    ['L1','A1','Home & Rooms','บรรยายบ้าน ห้อง และของใช้','There is ___.','There are ___.','บอกว่าของอยู่ที่ไหนในบ้าน',[['home','บ้าน'],['room','ห้อง'],['table','โต๊ะ'],['chair','เก้าอี้'],['door','ประตู'],['window','หน้าต่าง']],['There is a table in my room.','There are two chairs.']],
    ['L1','A1','Daily Routine','เล่ากิจวัตรด้วย Present Simple','I ___ every day.','I usually ___.','คุยเรื่องตื่น ทำงาน กิน และนอน',[['work','ทำงาน'],['wake','ตื่น'],['eat','กิน'],['drink','ดื่ม'],['start','เริ่ม'],['finish','เสร็จ']],['I go to work every day.','I usually drink coffee in the morning.']],
    ['L1','A1','Food & Drinks','บอกความชอบและสั่งอาหาร','I like ___.','I would like ___, please.','สั่งอาหารและเครื่องดื่ม',[['coffee','กาแฟ'],['rice','ข้าว'],['chicken','ไก่'],['water','น้ำ'],['hungry','หิว'],['delicious','อร่อย']],['I like coffee.','I would like rice and chicken, please.']],
    ['L1','A1','Shopping, Places & Directions','ถามราคา ซื้อของ และถามทาง','How much is this?','Where is ___?','ซื้อของและถามทางในเมือง',[['price','ราคา'],['shop','ร้าน'],['station','สถานี'],['left','ซ้าย'],['right','ขวา'],['straight','ตรงไป']],['How much is this shirt?','Where is the station?']],
    ['L2','A1–A2','Can, Requests & Ability','พูดสิ่งที่ทำได้และขอความช่วยเหลือ','I can / can’t ___.','Can you ___, please?','ขออนุญาตและขอความช่วยเหลือ',[['can','สามารถ'],['speak','พูด'],['understand','เข้าใจ'],['again','อีกครั้ง'],['wait','รอ'],['help','ช่วย']],['I can speak a little English.','Could you say that again?']],
    ['L2','A1–A2','Present Continuous & Hobbies','พูดสิ่งที่กำลังทำและงานอดิเรก','I am ___ing now.','I like ___ing.','คุยว่ากำลังทำอะไรและเวลาว่าง',[['working','กำลังทำงาน'],['waiting','กำลังรอ'],['reading','กำลังอ่าน'],['music','ดนตรี'],['movie','ภาพยนตร์'],['weekend','สุดสัปดาห์']],['I am waiting for the bus.','I like watching movies.']],
    ['L2','A2','Past Simple','เล่าเหตุการณ์ที่ผ่านมา','Yesterday I ___.','Did you ___?','เล่าเรื่องเมื่อวานและถามต่อ',[['yesterday','เมื่อวาน'],['went','ไปแล้ว'],['had','มี/กินแล้ว'],['saw','เห็นแล้ว'],['worked','ทำงานแล้ว'],['visited','ไปเยี่ยม']],['Yesterday I went to work.','Did you see your friend?']],
    ['L2','A2','Future Plans','พูดแผนและความตั้งใจ','I am going to ___.','I will ___.','นัดหมายและคุยแผนพรุ่งนี้',[['tomorrow','พรุ่งนี้'],['plan','แผน'],['travel','เดินทาง'],['visit','เยี่ยม'],['call','โทร'],['later','ภายหลัง']],['I am going to travel tomorrow.','I will call you later.']],
    ['L2','A2','Quantity & Comparison','บอกปริมาณและเปรียบเทียบ','Do you have any ___?','___ is cheaper than ___.','เลือกของและเปรียบเทียบราคา',[['some','บางส่วน'],['any','บ้าง'],['many','มาก (นับได้)'],['much','มาก (นับไม่ได้)'],['cheap','ถูก'],['expensive','แพง']],['Do you have any water?','This hotel is cheaper than that one.']],
    ['L2','A2','Advice, Rules & Invitations','ให้คำแนะนำ บอกสิ่งจำเป็น และชวน','You should ___.','I have to / must ___.','ให้คำแนะนำและนัดหมาย',[['should','ควร'],['must','ต้อง'],['rest','พัก'],['meeting','ประชุม'],['invite','เชิญ'],['available','ว่าง/พร้อม']],['You should rest.','I have to call the office.']],
    ['L3','A2','Restaurant English','จัดการบทสนทนาในร้านอาหาร','I’d like ___, please.','Could I have the bill?','สั่ง เปลี่ยนรายการ และเช็กบิล',[['menu','เมนู'],['order','สั่ง'],['bill','บิล'],['spicy','เผ็ด'],['server','พนักงาน'],['change','เปลี่ยน']],['I’d like chicken and rice, please.','Could I have the bill?']],
    ['L3','A2','Hotel English','เช็กอิน ขอข้อมูล และแจ้งปัญหา','I have a reservation.','There is a problem with ___.','เช็กอินและแก้ปัญหาห้องพัก',[['reservation','การจอง'],['room','ห้อง'],['key','กุญแจ'],['breakfast','อาหารเช้า'],['available','ว่าง'],['problem','ปัญหา']],['I have a reservation.','There is a problem with my room.']],
    ['L3','A2–B1','Airport & Travel','เดินทาง ถามเกต และจัดการสัมภาระ','Where is gate ___?','My ___ is missing.','แก้สถานการณ์ที่สนามบิน',[['airport','สนามบิน'],['flight','เที่ยวบิน'],['gate','เกต'],['bag','กระเป๋า'],['delay','ล่าช้า'],['passport','หนังสือเดินทาง']],['Where is gate twelve?','My bag is missing.']],
    ['L3','A2–B1','Health & Getting Help','อธิบายอาการและขอความช่วยเหลือ','I feel ___.','Could you help me with ___?','คุยที่คลินิกหรือขอความช่วยเหลือ',[['headache','ปวดหัว'],['tired','เหนื่อย'],['pain','ปวด'],['medicine','ยา'],['doctor','แพทย์'],['emergency','ฉุกเฉิน']],['I have a headache.','Could you help me, please?']],
    ['L3','A2–B1','Phone & Messages','โทรศัพท์ ฝากข้อความ และยืนยันข้อมูล','Can I speak to ___?','Could you leave a message?','โทรนัดและฝากข้อความ',[['message','ข้อความ'],['call','โทร'],['confirm','ยืนยัน'],['appointment','นัดหมาย'],['email','อีเมล'],['contact','ติดต่อ']],['Can I speak to Anna?','Could you leave a message?']],
    ['L3','A2–B1','Workplace English','อัปเดตงาน ถามงาน และขอเวลา','I’m working on ___.','I need more time to ___.','คุยงานกับเพื่อนร่วมงาน',[['project','โครงการ'],['report','รายงาน'],['deadline','กำหนดส่ง'],['meeting','ประชุม'],['finish','เสร็จ'],['update','อัปเดต']],['I’m working on a report.','I need more time to finish it.']],
    ['L4','B1','Small Talk & Follow-up','คุยต่อเนื่องและถามต่อ','Really? Why?','What about you?','สนทนาเรื่องวัน งาน และเวลาว่าง',[['interesting','น่าสนใจ'],['usually','ปกติ'],['experience','ประสบการณ์'],['weekend','สุดสัปดาห์'],['enjoy','สนุก/ชอบ'],['recently','เมื่อเร็ว ๆ นี้']],['That sounds interesting.','What about you?']],
    ['L4','B1','Opinions & Reasons','แสดงความคิดเห็นและอธิบายเหตุผล','I think ___.','In my opinion, ___ because ___.','คุยข้อดีข้อเสียของเรื่องใกล้ตัว',[['opinion','ความคิดเห็น'],['reason','เหตุผล'],['agree','เห็นด้วย'],['disagree','ไม่เห็นด้วย'],['because','เพราะว่า'],['prefer','ชอบมากกว่า']],['I think it is a good idea.','In my opinion, it is too expensive.']],
    ['L4','B1','Storytelling & Linking','เล่าเรื่องให้ต่อเนื่อง','First... Then...','After that... Finally...','เล่าเหตุการณ์หลายขั้นตอน',[['first','ก่อนอื่น'],['then','จากนั้น'],['after','หลังจาก'],['finally','สุดท้าย'],['happen','เกิดขึ้น'],['during','ระหว่าง']],['First, I checked in. Then, I found my gate.','Finally, I arrived at the hotel.']],
    ['L4','B1','Problems & Solutions','อธิบายปัญหา เสนอทางเลือก และตัดสินใจ','The problem is ___.','One solution is ___.','เจรจาแก้ปัญหาในชีวิตจริง',[['solution','ทางแก้'],['issue','ปัญหา'],['option','ทางเลือก'],['suggest','เสนอ'],['decide','ตัดสินใจ'],['improve','ปรับปรุง']],['The problem is the room is not ready.','One solution is to change the booking.']],
    ['L4','B1','Meetings & Status Updates','รายงานสถานะงานและถามติดตาม','Here is my update.','We need to ___.','คุยสถานะงานในประชุม',[['status','สถานะ'],['progress','ความคืบหน้า'],['task','งาน'],['priority','ลำดับความสำคัญ'],['discuss','หารือ'],['complete','เสร็จสมบูรณ์']],['Here is my update.','We need to discuss the next step.']],
    ['L4','B1','Social Conversation','ตอบอย่างเป็นธรรมชาติและรักษาบทสนทนา','That makes sense.','I’m not sure, but ___.','คุยเรื่องประสบการณ์ แผน และความสนใจ',[['conversation','บทสนทนา'],['natural','เป็นธรรมชาติ'],['probably','น่าจะ'],['actually','จริง ๆ แล้ว'],['especially','โดยเฉพาะ'],['perhaps','บางที']],['That makes sense.','I’m not sure, but I think so.']],
    ['L5','B1','Travel Challenge','แก้ปัญหาการเดินทางหลายขั้นตอน','Could you explain my options?','I’d like to change ___.','รับมือเที่ยวบินล่าช้าและการจอง',[['delay','ล่าช้า'],['booking','การจอง'],['alternative','ทางเลือก'],['connection','เที่ยวต่อ'],['refund','คืนเงิน'],['arrange','จัดเตรียม']],['My flight is delayed.','Could you explain my options?']],
    ['L5','B1–B2','Work Discussion','อธิบายงาน เหตุผล และข้อเสนอ','From my perspective, ___.','I suggest that we ___.','ประชุมและตัดสินใจร่วมกัน',[['perspective','มุมมอง'],['recommend','แนะนำ'],['effective','มีประสิทธิภาพ'],['responsibility','ความรับผิดชอบ'],['result','ผลลัพธ์'],['strategy','กลยุทธ์']],['From my perspective, this is the best option.','I suggest that we change the plan.']],
    ['L5','B1–B2','Complex Situations','ใช้ conditional, contrast และ passive ในบริบท','If I had ___, I would ___.','Although ___, ___.','อธิบายสมมติฐานและสถานการณ์ซับซ้อน',[['although','แม้ว่า'],['condition','เงื่อนไข'],['decision','การตัดสินใจ'],['responsible','รับผิดชอบ'],['fixed','ถูกแก้ไข'],['however','อย่างไรก็ตาม']],['If I had more time, I would study every day.','Although the flight was delayed, we arrived on time.']],
    ['L5','B1–B2','Conversation Ready','สนทนา 5–10 นาทีโดยไม่รู้คำถามล่วงหน้า','Let me think.','Could you explain that another way?','บทสนทนาอิสระและ Final Checkpoint',[['confident','มั่นใจ'],['explain','อธิบาย'],['clarify','ทำให้ชัดเจน'],['respond','ตอบสนอง'],['continue','ดำเนินต่อ'],['communication','การสื่อสาร']],['Let me think for a moment.','Could you explain that another way?']]
  ].map((w,i)=>({week:i+1,stage:w[0],cefr:w[1],theme:w[2],goal:w[3],patternA:w[4],patternB:w[5],scenario:w[6],vocab:w[7].map(x=>({en:x[0],th:x[1]})),examples:w[8]}));
  const DAY_TYPES=[
    {name:'บทใหม่',desc:'เข้าใจหัวข้อและรูปประโยคหลัก'},
    {name:'Vocabulary + Listening',desc:'เรียนคำสำคัญ ฟัง และพูดตาม'},
    {name:'Sentence Building',desc:'ต่อคำเป็นประโยคและเขียนเอง'},
    {name:'Real Situation',desc:'ใช้ภาษาในสถานการณ์จำลอง'},
    {name:'Reading + Speaking',desc:'อ่านสั้น ๆ แล้วตอบด้วยเสียงหรือประโยค'},
    {name:'Game + Review',desc:'ทบทวนหัวข้อด้วยเกมและคำเก่า'},
    {name:'Checkpoint',desc:'เช็กความพร้อมก่อนเข้าสัปดาห์ถัดไป'}
  ];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const stageFor=day=>STAGES.find(s=>day>=s.from&&day<=s.to)||STAGES[STAGES.length-1];
  const currentLevel=()=>{try{return window.getLearnerLevel?.()||'starter'}catch{return'starter'}};
  function readRoot(){try{return typeof state==='object'&&state?state:JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return{}}}
  function saveRoot(root){
    try{
      if(typeof state==='object'&&state){state.dailyCourseV53=root.dailyCourseV53;if(typeof saveState==='function')saveState();else localStorage.setItem(KEY,JSON.stringify(root))}
      else localStorage.setItem(KEY,JSON.stringify(root));
    }catch{}
  }
  function rootState(){
    const root=readRoot();
    root.dailyCourseV53=root.dailyCourseV53&&typeof root.dailyCourseV53==='object'?root.dailyCourseV53:{version:1,byLevel:{}};
    root.dailyCourseV53.byLevel=root.dailyCourseV53.byLevel&&typeof root.dailyCourseV53.byLevel==='object'?root.dailyCourseV53.byLevel:{};
    return root;
  }
  function slot(level=currentLevel()){
    const root=rootState(),start=START_BY_LEVEL[level]||1;
    let s=root.dailyCourseV53.byLevel[level];
    if(!s||typeof s!=='object'){
      s={currentDay:start,unlockedThrough:start,completed:[],startedAt:new Date().toISOString()};
      root.dailyCourseV53.byLevel[level]=s;saveRoot(root);
    }
    s.completed=Array.isArray(s.completed)?s.completed:[];
    s.currentDay=Math.max(start,Math.min(TOTAL_DAYS,Number(s.currentDay)||start));
    s.unlockedThrough=Math.max(start,Math.min(TOTAL_DAYS,Number(s.unlockedThrough)||start));
    return {root,s,start,level};
  }
  function dayInfo(day){
    day=Math.max(1,Math.min(TOTAL_DAYS,Number(day)||1));
    const week=Math.ceil(day/7),w=WEEKS[week-1],typeIndex=(day-1)%7,type=DAY_TYPES[typeIndex],stage=stageFor(day);
    const rot=typeIndex%w.vocab.length;
    const vocab=[...w.vocab.slice(rot),...w.vocab.slice(0,rot)].slice(0,6);
    const pattern=typeIndex<3?w.patternA:(typeIndex<5?w.patternB:`${w.patternA} · ${w.patternB}`);
    const title=typeIndex===0?`${w.theme} · พื้นฐาน`:typeIndex===1?`${w.theme} · คำศัพท์และการฟัง`:typeIndex===2?`${w.theme} · สร้างประโยค`:typeIndex===3?`${w.theme} · ${w.scenario}`:typeIndex===4?`${w.theme} · อ่านและพูด`:typeIndex===5?`${w.theme} · Game & Review`:`${w.theme} · Checkpoint`;
    const example=typeIndex%2===0?w.examples[0]:w.examples[1];
    const prompt=typeIndex===0?`พูดตามรูปประโยค ${w.patternA}`:typeIndex===1?`ฟังและพูดคำสำคัญ ${vocab.slice(0,4).map(x=>x.en).join(', ')}`:typeIndex===2?`แต่ง 3 ประโยคโดยใช้ ${w.patternA}`:typeIndex===3?`จำลองสถานการณ์: ${w.scenario}`:typeIndex===4?`อ่านข้อความตัวอย่างแล้วตอบคำถามต่อเนื่อง 2–3 ประโยค`:typeIndex===5?`เล่นเกมจากคำและประโยคของสัปดาห์นี้ แล้วทบทวน Day ${Math.max(1,day-5)}–${day-1}`:`ทำ Checkpoint: พูดหรือเขียน 5 ประโยคเกี่ยวกับ ${w.theme}`;
    return {day,week,stage:stage.id,stageLabel:stage.label,cefr:w.cefr,theme:w.theme,title,goal:w.goal,type:type.name,typeDesc:type.desc,pattern,patternA:w.patternA,patternB:w.patternB,scenario:w.scenario,vocab,examples:w.examples,example,prompt};
  }
  function complete(day){
    const {root,s,start}=slot();day=Number(day)||s.currentDay;
    if(day>s.unlockedThrough||day<start)return false;
    if(!s.completed.includes(day)){
      s.completed.push(day);s.completed.sort((a,b)=>a-b);
      try{if(typeof state==='object'&&state)state.xp=(Number(state.xp)||0)+10}catch{}
    }
    if(day===s.unlockedThrough&&day<TOTAL_DAYS)s.unlockedThrough=day+1;
    if(day<TOTAL_DAYS)s.currentDay=Math.min(day+1,s.unlockedThrough);else s.currentDay=TOTAL_DAYS;
    s.updatedAt=new Date().toISOString();saveRoot(root);
    document.dispatchEvent(new CustomEvent('daily-course:changed',{detail:{day:s.currentDay}}));
    renderCard();
    return true;
  }
  function choose(day){
    const {root,s,start}=slot();day=Math.max(start,Math.min(TOTAL_DAYS,Number(day)||s.currentDay));
    if(day>s.unlockedThrough)return false;
    s.currentDay=day;s.updatedAt=new Date().toISOString();saveRoot(root);renderCard();return true;
  }
  const pctFor=({s,start})=>{const total=TOTAL_DAYS-start+1,done=s.completed.filter(d=>d>=start).length;return {done,total,pct:Math.round(done/total*100)}};
  function routeLabel(level){return level==='starter'?'Day 1 → 210':level==='basic'?'Day 22 → 210':level==='intermediate'?'Day 71 → 210':'Day 141 → 210'}
  function cardHtml(){
    const data=slot(),p=pctFor(data),lesson=dayInfo(data.s.currentDay),levelInfo=window.getLearnerLevelInfo?.()||{label:data.level,cefr:lesson.cefr};
    return `<section id="dailyCourseCard" class="daily-course-card"><div class="daily-course-head"><div><div class="hero-kicker">DAILY CURRICULUM · 210 DAY</div><h2>เส้นทางจากศูนย์ → สนทนาได้</h2><p><b>${esc(levelInfo.label)} · ${esc(levelInfo.cefr||lesson.cefr)}</b> · เส้นทางแนะนำ ${routeLabel(data.level)} · เรียนเร็วสามารถเรียน Day ถัดไปต่อในวันเดียวกันได้</p></div><div class="daily-course-ring"><b>Day ${lesson.day}</b><span>/ ${TOTAL_DAYS}</span></div></div><div class="daily-progress"><i style="width:${p.pct}%"></i></div><div class="daily-progress-row"><span>หลักสูตรระดับนี้ ${p.done}/${p.total} Day · ${p.pct}%</span><span>${esc(lesson.stage)} · ${esc(lesson.cefr)}</span></div><div class="daily-today"><div class="daily-day-badge">${lesson.day}</div><div class="daily-today-main"><small>${esc(lesson.stage)} · WEEK ${lesson.week} · ${esc(lesson.type)}</small><h3>${esc(lesson.title)}</h3><p>${esc(lesson.goal)}</p><div class="daily-pattern"><span>Pattern</span><b>${esc(lesson.pattern)}</b></div></div></div><div class="daily-vocab">${lesson.vocab.map(v=>`<span><b>${esc(v.en)}</b> ${esc(v.th)}</span>`).join('')}</div><div class="daily-actions"><button type="button" class="secondary-btn" id="dailyChooseDay">เลือก Day</button><button type="button" class="secondary-btn" id="dailyOpenLesson">ดูบทเรียน Day ${lesson.day}</button><button type="button" class="primary-btn" id="dailyComplete">${data.s.completed.includes(lesson.day)?'เรียน Day นี้แล้ว · ไปต่อ':'ผ่าน Day นี้ · ปลด Day ถัดไป'}</button></div><small class="daily-note">25 บท L0–L5 เดิมยังเก็บไว้เป็น Milestone และ Progress เดิมไม่ถูกรีเซ็ต · Oxford 3000 และเรื่องสั้น 25 เรื่องยังเข้าได้ตามปกติ</small></section>`;
  }
  function patchLegacyRoadmap(){
    const road=document.querySelector('#learningRoadmap');if(!road)return;
    const h=road.querySelector('.roadmap-head h2');if(h)h.textContent='Milestone L0–L5 · บทหลักเดิม';
    const p=road.querySelector('.roadmap-head p');if(p)p.textContent='25 บทหลักเดิมยังอยู่ครบ ใช้เป็นจุดตรวจทักษะร่วมกับหลักสูตรรายวัน 210 Day, Quiz, Game และ Sentence Coach';
    const kicker=road.querySelector('.hero-kicker');if(kicker)kicker.textContent='MILESTONE ROADMAP';
  }
  function renderCard(){
    if(document.documentElement.classList.contains('account-locked'))return;
    if(typeof view!=='undefined'&&view!=='home')return;
    const app=document.querySelector('#app');if(!app)return;
    let card=document.querySelector('#dailyCourseCard');
    const wrap=document.createElement('div');wrap.innerHTML=cardHtml();const fresh=wrap.firstElementChild;
    if(card)card.replaceWith(fresh);else{
      const road=document.querySelector('#learningRoadmap'),anchor=road||document.querySelector('#questHub')||app.querySelector('.hero');
      if(road)road.insertAdjacentElement('beforebegin',fresh);else anchor?.insertAdjacentElement('afterend',fresh);
    }
    patchLegacyRoadmap();bindCard();
  }
  function bindCard(){
    document.querySelector('#dailyChooseDay')?.addEventListener('click',openChooser);
    document.querySelector('#dailyOpenLesson')?.addEventListener('click',()=>openLesson(slot().s.currentDay));
    document.querySelector('#dailyComplete')?.addEventListener('click',()=>{const d=slot().s.currentDay;if(slot().s.completed.includes(d)&&d<TOTAL_DAYS)choose(Math.min(d+1,slot().s.unlockedThrough));else complete(d)});
  }
  function speakText(text){try{if(typeof speak==='function')return speak(text);speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.86;speechSynthesis.speak(u)}catch{}}
  function openLesson(day){
    const data=slot();if(day>data.s.unlockedThrough)return;
    const l=dayInfo(day);document.querySelector('#dailyLessonModal')?.remove();
    const d=document.createElement('dialog');d.id='dailyLessonModal';d.className='daily-modal';
    d.innerHTML=`<section class="daily-modal-panel"><header><div><small>DAY ${l.day} · ${esc(l.stage)} · ${esc(l.cefr)}</small><h2>${esc(l.title)}</h2></div><button type="button" class="daily-close">×</button></header><div class="daily-modal-body"><div class="daily-objective"><b>เป้าหมาย</b><span>${esc(l.goal)}</span></div><div class="daily-lesson-grid"><div><small>รูปประโยค</small><b>${esc(l.pattern)}</b></div><div><small>สถานการณ์</small><b>${esc(l.scenario)}</b></div></div><div class="daily-examples"><h3>ตัวอย่าง</h3>${l.examples.map(x=>`<button type="button" data-say="${esc(x)}">🔊 ${esc(x)}</button>`).join('')}</div><div class="daily-word-list"><h3>คำสำคัญ</h3>${l.vocab.map(v=>`<button type="button" data-say="${esc(v.en)}"><b>${esc(v.en)}</b><span>${esc(v.th)}</span></button>`).join('')}</div><div class="daily-task"><b>ภารกิจของ Day นี้</b><p>${esc(l.prompt)}</p></div><div class="daily-tool-actions"><button type="button" class="secondary-btn" id="dailyOxford">Oxford ตามระดับ</button><button type="button" class="secondary-btn" id="dailyGame">Game ของ Day นี้</button><button type="button" class="secondary-btn" id="dailySentence">Sentence Coach</button></div><button type="button" class="primary-btn daily-pass" id="dailyPassFromModal">${data.s.completed.includes(l.day)?'เรียน Day นี้แล้ว · เลือก Day ถัดไป':'ผ่าน Day นี้ · ปลดล็อก Day ถัดไป'}</button></div></section>`;
    document.body.appendChild(d);d.querySelector('.daily-close').onclick=()=>d.close();d.addEventListener('cancel',e=>{e.preventDefault();d.close()});d.addEventListener('close',()=>d.remove());d.addEventListener('click',e=>{if(e.target===d)d.close()});
    d.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>speakText(b.dataset.say));
    d.querySelector('#dailyOxford').onclick=()=>{d.close();if(typeof window.openCore3000Study==='function')window.openCore3000Study();else document.querySelector('.nav-btn[data-view="learn"]')?.click()};
    d.querySelector('#dailyGame').onclick=()=>{d.close();if(typeof window.openAdaptiveGame==='function')window.openAdaptiveGame('mix');else window.__gameLabV31?.open?.('mix')};
    d.querySelector('#dailySentence').onclick=()=>{d.close();window.openSentenceCoach?.({day:l.day})};
    d.querySelector('#dailyPassFromModal').onclick=()=>{complete(l.day);d.close();};
    if(d.showModal)d.showModal();else d.setAttribute('open','');
  }
  function openChooser(){
    const data=slot();document.querySelector('#dailyChooserModal')?.remove();
    const visible=[];for(let d=data.start;d<=Math.min(TOTAL_DAYS,data.s.unlockedThrough+5);d++)visible.push(d);
    const dlg=document.createElement('dialog');dlg.id='dailyChooserModal';dlg.className='daily-modal';
    dlg.innerHTML=`<section class="daily-modal-panel chooser"><header><div><small>หลักสูตร ${TOTAL_DAYS} Day</small><h2>เลือกบทเรียน</h2></div><button type="button" class="daily-close">×</button></header><div class="stage-summary">${STAGES.map(s=>`<div class="${data.s.currentDay>=s.from&&data.s.currentDay<=s.to?'active':''}"><b>${s.id}</b><span>Day ${s.from}–${s.to}</span><small>${esc(s.label)}</small></div>`).join('')}</div><div class="day-list">${visible.map(day=>{const l=dayInfo(day),done=data.s.completed.includes(day),locked=day>data.s.unlockedThrough;return `<button type="button" data-choose-day="${day}" ${locked?'disabled':''} class="${done?'done':''} ${day===data.s.currentDay?'current':''}"><b>Day ${day}</b><span>${esc(l.title)}</span><small>${locked?'🔒 ยังไม่ปลดล็อก':done?'✓ เรียนแล้ว':day===data.s.currentDay?'กำลังเรียน':'เปิดแล้ว'}</small></button>`}).join('')}</div><p class="chooser-note">เรียน Day ปัจจุบันให้ผ่านเพื่อปลดล็อก Day ถัดไปทันที ไม่ต้องรอวันตามปฏิทิน</p></section>`;
    document.body.appendChild(dlg);dlg.querySelector('.daily-close').onclick=()=>dlg.close();dlg.addEventListener('cancel',e=>{e.preventDefault();dlg.close()});dlg.addEventListener('close',()=>dlg.remove());dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});dlg.querySelectorAll('[data-choose-day]:not([disabled])').forEach(b=>b.onclick=()=>{choose(Number(b.dataset.chooseDay));dlg.close();openLesson(Number(b.dataset.chooseDay))});if(dlg.showModal)dlg.showModal();else dlg.setAttribute('open','');
  }
  const style=document.createElement('style');style.textContent=`
    .daily-course-card{margin:18px 0;padding:28px;border:1px solid rgba(56,189,248,.28);border-radius:30px;background:linear-gradient(145deg,rgba(15,30,53,.96),rgba(8,20,37,.96));box-shadow:0 20px 55px rgba(2,6,23,.22)}.daily-course-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.daily-course-head h2{margin:5px 0 8px;font-size:26px;color:#fff}.daily-course-head p{margin:0;color:#94a3b8;line-height:1.6}.daily-course-head p b{color:#67e8f9}.daily-course-ring{min-width:108px;padding:14px 16px;text-align:center;border-radius:22px;border:1px solid rgba(56,189,248,.28);background:rgba(14,116,144,.14)}.daily-course-ring b,.daily-course-ring span{display:block}.daily-course-ring b{font-size:22px;color:#fff}.daily-course-ring span{font-size:11px;color:#94a3b8}.daily-progress{height:8px;background:rgba(71,85,105,.35);border-radius:99px;margin:18px 0 7px;overflow:hidden}.daily-progress i{display:block;height:100%;background:linear-gradient(90deg,#7c3aed,#22d3ee);border-radius:99px}.daily-progress-row{display:flex;justify-content:space-between;gap:10px;color:#64748b;font-size:11px}.daily-today{display:flex;gap:16px;margin:20px 0 12px;padding:18px;border:1px solid rgba(148,163,184,.16);border-radius:22px;background:rgba(3,10,22,.32)}.daily-day-badge{width:58px;height:58px;display:grid;place-items:center;flex:0 0 auto;border-radius:18px;background:linear-gradient(145deg,#7c3aed,#0891b2);font-size:22px;font-weight:950;color:white}.daily-today-main small{color:#67e8f9;font-weight:800}.daily-today-main h3{margin:4px 0 6px;color:#fff;font-size:20px}.daily-today-main p{margin:0;color:#94a3b8}.daily-pattern{margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;align-items:center}.daily-pattern span{font-size:10px;color:#94a3b8;text-transform:uppercase}.daily-pattern b{color:#e0f2fe}.daily-vocab{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 18px}.daily-vocab span{padding:7px 10px;border-radius:999px;background:rgba(15,23,42,.75);border:1px solid rgba(148,163,184,.14);font-size:11px;color:#94a3b8}.daily-vocab b{color:#fff;margin-right:4px}.daily-actions{display:grid;grid-template-columns:1fr 1fr 1.35fr;gap:10px}.daily-note{display:block;margin-top:12px;color:#64748b;line-height:1.5}
    .daily-modal{width:min(900px,94vw);max-height:92vh;border:0;padding:0;border-radius:26px;background:#0b1729;color:#fff;box-shadow:0 30px 100px rgba(0,0,0,.55)}.daily-modal::backdrop{background:rgba(2,6,23,.82)}.daily-modal-panel{padding:0}.daily-modal-panel>header{position:sticky;top:0;z-index:3;display:flex;justify-content:space-between;gap:16px;align-items:center;padding:20px 22px;background:#0b1729;border-bottom:1px solid rgba(148,163,184,.14)}.daily-modal-panel header small{color:#67e8f9}.daily-modal-panel header h2{margin:4px 0 0}.daily-close{border:1px solid rgba(148,163,184,.2);background:#101e33;color:#fff;border-radius:12px;width:40px;height:40px;font-size:24px;cursor:pointer}.daily-modal-body{padding:22px}.daily-objective,.daily-task{padding:14px 16px;border-radius:16px;background:rgba(14,116,144,.1);border:1px solid rgba(34,211,238,.18)}.daily-objective b,.daily-objective span{display:block}.daily-objective span{color:#cbd5e1;margin-top:4px}.daily-lesson-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}.daily-lesson-grid>div{padding:14px;border:1px solid rgba(148,163,184,.14);border-radius:16px;background:#091525}.daily-lesson-grid small,.daily-lesson-grid b{display:block}.daily-lesson-grid small{color:#64748b}.daily-lesson-grid b{margin-top:5px}.daily-examples h3,.daily-word-list h3{margin:18px 0 8px}.daily-examples{display:grid;gap:8px}.daily-examples button,.daily-word-list button{border:1px solid rgba(148,163,184,.14);background:#0d1b30;color:#fff;border-radius:14px;padding:11px 13px;text-align:left;cursor:pointer}.daily-word-list{display:grid;grid-template-columns:1fr 1fr;gap:8px}.daily-word-list button b,.daily-word-list button span{display:block}.daily-word-list button span{color:#94a3b8;margin-top:3px}.daily-task{margin:18px 0}.daily-task p{margin:6px 0 0;color:#cbd5e1}.daily-tool-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.daily-pass{width:100%;margin-top:12px}.stage-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:18px 22px}.stage-summary div{padding:10px;border-radius:14px;border:1px solid rgba(148,163,184,.12);background:#091525}.stage-summary div.active{border-color:rgba(34,211,238,.5)}.stage-summary b,.stage-summary span,.stage-summary small{display:block}.stage-summary span{color:#67e8f9;font-size:11px}.stage-summary small{color:#64748b;margin-top:3px}.day-list{padding:0 22px 22px;display:grid;gap:8px}.day-list button{display:grid;grid-template-columns:90px 1fr auto;gap:10px;align-items:center;text-align:left;border:1px solid rgba(148,163,184,.14);background:#091525;color:#fff;border-radius:14px;padding:11px 12px;cursor:pointer}.day-list button span{color:#cbd5e1}.day-list button small{color:#64748b}.day-list button.done{border-color:rgba(34,197,94,.28)}.day-list button.current{border-color:rgba(34,211,238,.55)}.day-list button:disabled{opacity:.45;cursor:not-allowed}.chooser-note{padding:0 22px 22px;color:#94a3b8}
    @media(max-width:720px){.daily-course-card{padding:20px}.daily-course-head{display:block}.daily-course-ring{margin-top:14px;width:100%;box-sizing:border-box}.daily-actions,.daily-tool-actions{grid-template-columns:1fr}.daily-today{align-items:flex-start}.daily-lesson-grid,.daily-word-list{grid-template-columns:1fr}.stage-summary{grid-template-columns:1fr 1fr}.day-list button{grid-template-columns:70px 1fr}.day-list button small{grid-column:2}.daily-progress-row{display:block}.daily-progress-row span{display:block;margin-top:3px}}
  `;document.head.appendChild(style);
  document.addEventListener('app:rendered',()=>requestAnimationFrame(renderCard));
  document.addEventListener('learner-level:changed',()=>requestAnimationFrame(renderCard));
  document.addEventListener('daily-course:changed',()=>requestAnimationFrame(renderCard));
  const boot=()=>{if(document.documentElement.classList.contains('account-locked'))return setTimeout(boot,350);requestAnimationFrame(renderCard)};setTimeout(boot,50);
  window.getDailyLesson=(day)=>dayInfo(day||slot().s.currentDay);
  window.getDailyCourseProgress=()=>{const d=slot();return {...d.s,startDay:d.start,level:d.level,totalDays:TOTAL_DAYS}};
  window.openDailyLesson=(day)=>openLesson(day||slot().s.currentDay);
  window.completeDailyLesson=complete;
  window.chooseDailyLesson=choose;
  window.DAILY_COURSE_VERSION=VERSION;
})();
