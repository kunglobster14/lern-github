(()=>{
  const VERSION='v54';
  const KEY='myEnglishV2';
  const BANK={
    starter:[
      ['ฉันเหนื่อย',['I am tired.','I\'m tired.'],'I am + adjective','ประธาน I ใช้ am แล้วตามด้วยคำคุณศัพท์'],
      ['ฉันพร้อมแล้ว',['I am ready.','I\'m ready.'],'I am + adjective','ready เป็นคำคุณศัพท์ ใช้หลัง am'],
      ['ฉันต้องการน้ำ',['I want water.','I want some water.'],'I want + noun','ใช้ want ตามด้วยสิ่งที่ต้องการ'],
      ['ฉันต้องการความช่วยเหลือ',['I need help.'],'I need + noun','need ใช้บอกสิ่งที่จำเป็น'],
      ['ฉันชอบกาแฟ',['I like coffee.'],'I like + noun','ใช้ like ตามด้วยสิ่งที่ชอบ'],
      ['ห้องน้ำอยู่ที่ไหน',['Where is the bathroom?','Where is the toilet?'],'Where is + place?','คำถามตำแหน่งใช้ Where is ... ?'],
      ['ขอน้ำหนึ่งแก้วครับ/ค่ะ',['Water, please.','Some water, please.'],'noun + please','คำขอสั้น ๆ ใช้สิ่งที่ต้องการตามด้วย please'],
      ['ยินดีที่ได้รู้จัก',['Nice to meet you.'],'Nice to meet you.','เป็นสำนวนมาตรฐานเมื่อพบกันครั้งแรก'],
      ['นี่คือโทรศัพท์ของฉัน',['This is my phone.'],'This is + noun','ใช้ This is เพื่อชี้สิ่งที่อยู่ใกล้'],
      ['ฉันอยู่บ้าน',['I am at home.','I\'m at home.'],'I am at + place','ใช้ at home เมื่อต้องการบอกว่าอยู่บ้าน']
    ],
    basic:[
      ['ฉันไปทำงานทุกวัน',['I go to work every day.'],'Present Simple: I + verb','กิจวัตรประจำวันใช้ Present Simple'],
      ['คุณชอบกาแฟไหม',['Do you like coffee?'],'Do you + verb?','คำถาม Present Simple กับ you ใช้ Do'],
      ['เธอทำงานที่นี่',['She works here.'],'She + verb-s','he/she/it ใช้กริยาเติม s/es'],
      ['ฉันพูดอังกฤษได้นิดหน่อย',['I can speak a little English.'],'can + verb','หลัง can ใช้กริยารูปปกติ'],
      ['ฉันนั่งตรงนี้ได้ไหม',['Can I sit here?'],'Can I + verb?','ใช้ Can I เพื่อขออนุญาต'],
      ['อันนี้ราคาเท่าไร',['How much is this?'],'How much is ... ?','ใช้ How much is this? เพื่อถามราคา'],
      ['ฉันมีประชุมตอนสิบโมง',['I have a meeting at ten.','I have a meeting at 10.'],'at + เวลา','ใช้ at หน้าจุดเวลา'],
      ['ฉันไม่ชอบอาหารเผ็ด',['I do not like spicy food.','I don\'t like spicy food.'],'do not + verb','ประโยคปฏิเสธ Present Simple ใช้ do not'],
      ['สถานีอยู่ที่ไหน',['Where is the station?'],'Where is + place?','ใช้ Where is เพื่อถามสถานที่'],
      ['ฉันกำลังรอรถบัส',['I am waiting for the bus.','I\'m waiting for the bus.'],'am + verb-ing','สิ่งที่กำลังทำใช้ Present Continuous']
    ],
    intermediate:[
      ['เมื่อวานฉันไปทำงาน',['Yesterday I went to work.','I went to work yesterday.'],'Yesterday → Past Simple','go เปลี่ยนเป็น went ในอดีต'],
      ['เมื่อวานฉันดื่มกาแฟ',['Yesterday I had coffee.','I had coffee yesterday.','I drank coffee yesterday.'],'Past Simple','เล่าอดีตด้วยกริยาช่อง 2'],
      ['พรุ่งนี้ฉันจะทำงาน',['Tomorrow I will work.','I will work tomorrow.'],'will + verb','อนาคตใช้ will + กริยารูปปกติได้'],
      ['ฉันกำลังทำรายงานอยู่',['I am working on a report.','I\'m working on a report.'],'am + verb-ing','Present Continuous ใช้ am/is/are + verb-ing'],
      ['มีปัญหากับห้องของฉัน',['There is a problem with my room.','There\'s a problem with my room.'],'There is a problem with ...','ใช้โครงสร้างนี้เพื่ออธิบายปัญหา'],
      ['ช่วยพูดอีกครั้งได้ไหม',['Could you say that again?','Can you say that again?'],'Could you + verb?','Could you ... ? เป็นรูปสุภาพ'],
      ['ฉันคิดว่ามันแพงเกินไป',['I think it is too expensive.','I think it\'s too expensive.'],'I think + clause','too + adjective หมายถึงมากเกินไป'],
      ['ก่อนอื่นฉันไปทำงาน จากนั้นฉันกินข้าวกลางวัน',['First, I went to work. Then, I had lunch.','First I went to work. Then I had lunch.'],'First ... Then ...','ใช้คำเชื่อมเพื่อเล่าเรื่องตามลำดับ'],
      ['ฉันต้องการเวลาเพิ่มเพื่อทำงานให้เสร็จ',['I need more time to finish the work.','I need more time to finish it.'],'need more time to + verb','ใช้ to + verb บอกจุดประสงค์'],
      ['ฉันจองห้องไว้แล้ว',['I have a reservation.'],'have a reservation','ใช้เพื่อแจ้งว่ามีการจองอยู่แล้ว']
    ],
    upper:[
      ['ในความเห็นของฉัน เราควรเปลี่ยนแผน',['In my opinion, we should change the plan.','I think we should change the plan.'],'In my opinion + should','should ใช้เสนอแนะ'],
      ['แม้ว่าเที่ยวบินจะล่าช้า เราก็ยังไปถึงตรงเวลา',['Although the flight was delayed, we arrived on time.'],'Although + clause','Although ใช้เชื่อมเหตุการณ์ที่ขัดแย้งกัน'],
      ['ถ้าฉันมีเวลามากกว่านี้ ฉันจะเรียนอังกฤษทุกวัน',['If I had more time, I would study English every day.'],'If + Past, would + verb','Second Conditional ใช้กับสถานการณ์สมมติ'],
      ['ปัญหานี้ต้องได้รับการแก้ไขก่อนการประชุม',['This problem must be fixed before the meeting.','This problem needs to be fixed before the meeting.'],'must be + V3','Passive ใช้เน้นสิ่งที่ถูกกระทำ'],
      ['ฉันไม่แน่ใจ แต่ฉันคิดว่าเราควรคุยเรื่องนี้ทีหลัง',['I am not sure, but I think we should discuss this later.','I\'m not sure, but I think we should discuss this later.'],'I am not sure, but ...','ใช้ but เชื่อมความไม่แน่ใจกับข้อเสนอ'],
      ['ถ้าฉันรู้เรื่องนี้ก่อนหน้านี้ ฉันคงตัดสินใจต่างออกไป',['If I had known about this earlier, I would have made a different decision.'],'If + had + V3, would have + V3','Third Conditional ใช้กับเหตุการณ์สมมติในอดีต'],
      ['หลังจากตรวจสอบข้อมูลแล้ว เราจึงเปลี่ยนแผน',['After checking the information, we changed the plan.','After we checked the information, we changed the plan.'],'After + clause / verb-ing','After ใช้บอกลำดับเหตุการณ์'],
      ['ถึงแม้จะมีเวลาน้อย เราก็ทำงานเสร็จ',['Even though we had little time, we finished the work.'],'Even though + clause','ใช้ Even though เพื่อแสดงความขัดแย้ง'],
      ['ทางเลือกนี้มีประสิทธิภาพมากกว่าเพราะประหยัดเวลา',['This option is more effective because it saves time.'],'comparative + because','ใช้ because เพื่ออธิบายเหตุผล'],
      ['เราควรหารือเรื่องนี้ก่อนตัดสินใจ',['We should discuss this before making a decision.'],'should + verb','ใช้ should เพื่อเสนอสิ่งที่ควรทำ']
    ]
  };
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=v=>String(v||'').trim().toLowerCase().replace(/[’]/g,"'").replace(/\s+/g,' ').replace(/\s+([,.!?])/g,'$1').replace(/[.!?]+$/,'');
  const level=()=>{try{return window.getLearnerLevel?.()||'starter'}catch{return'starter'}};
  function root(){try{return typeof state==='object'&&state?state:JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return{}}}
  function coach(){const s=root();s.sentenceCoach=s.sentenceCoach&&typeof s.sentenceCoach==='object'?s.sentenceCoach:{attempts:0,correct:0,wrong:0,recent:[]};s.sentenceCoach.recent=Array.isArray(s.sentenceCoach.recent)?s.sentenceCoach.recent:[];return s.sentenceCoach}
  function persist(){try{if(typeof saveState==='function')saveState();else localStorage.setItem(KEY,JSON.stringify(root()))}catch{}}
  function say(text){try{if(typeof speak==='function')return speak(text);speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.86;speechSynthesis.speak(u)}catch{}}
  function tasks(){
    const id=level(),items=(BANK[id]||BANK.starter).map((x,i)=>({id:`${id}:${i}`,th:x[0],answers:x[1],hint:x[2],explain:x[3]})),d=window.getDailyLesson?.();
    if(d?.examples?.length){d.examples.forEach((answer,i)=>items.unshift({id:`lesson:${d.day}:${i}`,th:`บทเรียน ${d.day} · ${d.theme}: แต่งประโยคจากสถานการณ์นี้`,answers:[answer],hint:d.pattern,explain:`รูปประโยคหลักของบทเรียนนี้: ${d.pattern}`,daily:true}))}
    return items;
  }
  function pickTask(){const c=coach(),all=tasks(),recent=new Set(c.recent.slice(-Math.min(10,Math.max(2,all.length-1)))),pool=all.filter(x=>!recent.has(x.id));return (pool.length?pool:all)[Math.floor(Math.random()*(pool.length||all.length))]}
  function close(){const d=document.querySelector('#sentenceCoachModalV54');if(!d)return;try{if(d.open)d.close()}catch{}d.remove()}
  function award(){try{if(typeof state==='object'&&state){state.xp=(Number(state.xp)||0)+8}window.__gameLabV31?.addProgress?.('ai',1);persist()}catch{}}
  function renderTask(d,task){
    const c=coach(),info=window.getLearnerLevelInfo?.()||{cefr:level()};
    const body=d.querySelector('.sc-body');
    body.innerHTML=`<div class="sc-stats"><span>ถูก ${Number(c.correct)||0}</span><span>ลอง ${Number(c.attempts)||0}</span></div><div class="sc-prompt"><small>โจทย์${task.daily?' · จากบทเรียนปัจจุบัน':''}</small><h3>${esc(task.th)}</h3><p>คำใบ้: ${esc(task.hint)}</p></div><textarea id="scAnswerV54" rows="3" autocomplete="off" spellcheck="false" placeholder="พิมพ์ประโยคภาษาอังกฤษ..."></textarea><button type="button" class="lab-primary full" id="scCheckV54">ตรวจคำตอบ</button><div id="scFeedbackV54"></div>`;
    const input=body.querySelector('#scAnswerV54'),check=body.querySelector('#scCheckV54'),feedback=body.querySelector('#scFeedbackV54');
    const submit=()=>{
      const value=input.value.trim();if(!value)return;
      c.attempts=(Number(c.attempts)||0)+1;
      const ok=task.answers.some(a=>norm(a)===norm(value));
      if(ok){
        c.correct=(Number(c.correct)||0)+1;c.recent=[...c.recent,task.id].slice(-24);award();
        const answer=task.answers[0];input.disabled=true;check.disabled=true;
        feedback.innerHTML=`<div class="sc-result correct"><b>✓ ถูกต้อง</b><p>${esc(answer)}</p><small>กำลังอ่านออกเสียง แล้วไปประโยคถัดไป...</small></div>`;
        say(answer);setTimeout(()=>renderTask(d,pickTask()),1700);
      }else{
        c.wrong=(Number(c.wrong)||0)+1;persist();
        feedback.innerHTML=`<div class="sc-result wrong"><b>ยังไม่ถูก — แก้ตรงนี้</b><p>ตัวอย่าง: <strong>${esc(task.answers[0])}</strong></p><small>${esc(task.explain)}</small><button type="button" class="lab-secondary" id="scNextV54">สุ่มประโยคอื่น</button></div>`;
        feedback.querySelector('#scNextV54').onclick=()=>{c.recent=[...c.recent,task.id].slice(-24);persist();renderTask(d,pickTask())};
      }
    };
    check.onclick=submit;input.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')submit()});setTimeout(()=>input.focus(),50);
    const head=d.querySelector('header small');if(head)head.textContent=`SENTENCE COACH · ${info.cefr||level()}`;
  }
  function open(){
    close();const info=window.getLearnerLevelInfo?.()||{cefr:level()};const d=document.createElement('dialog');d.id='sentenceCoachModalV54';d.className='sentence-coach-v53';
    d.innerHTML=`<section><header><div><small>SENTENCE COACH · ${esc(info.cefr||level())}</small><h2>แต่งประโยค · ตอบถูกแล้วไปข้อต่อไปอัตโนมัติ</h2></div><button type="button" class="sc-close">×</button></header><div class="sc-body"></div></section>`;
    document.body.appendChild(d);d.querySelector('.sc-close').onclick=close;d.addEventListener('cancel',e=>{e.preventDefault();close()});d.addEventListener('click',e=>{if(e.target===d)close()});renderTask(d,pickTask());if(d.showModal)d.showModal();else d.setAttribute('open','');
  }
  document.addEventListener('click',e=>{const t=e.target instanceof Element?e.target:null;if(!t)return;if(t.closest('.nav-btn[data-view="ai"],[data-go="ai"],#unitAI,[data-game="mission"]')){e.preventDefault();e.stopImmediatePropagation();open()}},true);
  const style=document.createElement('style');style.textContent=`#sentenceCoachModalV54{border:0;padding:0;background:transparent;color:#fff;max-width:none}#sentenceCoachModalV54::backdrop{background:rgba(2,6,23,.78);backdrop-filter:blur(7px)}#sentenceCoachModalV54>section{width:min(680px,94vw);background:#0b192c;border:1px solid rgba(56,189,248,.24);border-radius:24px;overflow:hidden;box-shadow:0 30px 90px rgba(0,0,0,.45)}#sentenceCoachModalV54 header{display:flex;justify-content:space-between;gap:14px;padding:20px;border-bottom:1px solid rgba(148,163,184,.14)}#sentenceCoachModalV54 header small{color:#67e8f9;font-weight:850}#sentenceCoachModalV54 header h2{margin:5px 0 0;font-size:20px}#sentenceCoachModalV54 .sc-close{border:0;background:rgba(148,163,184,.12);color:#fff;border-radius:50%;width:38px;height:38px;font-size:22px}#sentenceCoachModalV54 .sc-body{padding:20px}#sentenceCoachModalV54 .sc-stats{display:flex;gap:8px;margin-bottom:12px}#sentenceCoachModalV54 .sc-stats span{padding:5px 9px;border-radius:999px;background:rgba(34,211,238,.09);color:#a5f3fc;font-size:11px;font-weight:800}#sentenceCoachModalV54 .sc-prompt{padding:16px;border-radius:16px;background:rgba(15,23,42,.72);margin-bottom:12px}#sentenceCoachModalV54 .sc-prompt small{color:#94a3b8}#sentenceCoachModalV54 .sc-prompt h3{margin:6px 0;font-size:20px}#sentenceCoachModalV54 .sc-prompt p{margin:0;color:#94a3b8}#sentenceCoachModalV54 textarea{width:100%;box-sizing:border-box;border-radius:14px;border:1px solid rgba(148,163,184,.22);background:#071424;color:#fff;padding:13px;font:inherit;margin-bottom:10px}#sentenceCoachModalV54 .sc-result{margin-top:12px;padding:13px;border-radius:14px;line-height:1.55}#sentenceCoachModalV54 .sc-result.correct{background:rgba(34,197,94,.12);border:1px solid rgba(74,222,128,.35)}#sentenceCoachModalV54 .sc-result.wrong{background:rgba(239,68,68,.1);border:1px solid rgba(248,113,113,.3)}#sentenceCoachModalV54 .sc-result p{margin:5px 0}#sentenceCoachModalV54 .sc-result small{color:#cbd5e1;display:block;margin-bottom:8px}`;document.head.appendChild(style);
  window.openSentenceCoach=open;window.SENTENCE_COACH_VERSION=VERSION;
})();