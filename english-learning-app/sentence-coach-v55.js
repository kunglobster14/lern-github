(()=>{
  const VERSION='v55';
  const KEY='myEnglishV2';
  const BANK={
    starter:[
      ['ฉันเหนื่อย',['I am tired.','I\'m tired.'],'I am + adjective','ใช้ am หลัง I แล้วตามด้วยคำคุณศัพท์'],
      ['ฉันต้องการน้ำ',['I want water.','I want some water.'],'I want + noun','ใช้ want ตามด้วยสิ่งที่ต้องการ'],
      ['ห้องน้ำอยู่ที่ไหน',['Where is the bathroom?','Where is the toilet?'],'Where is + place?','ใช้ Where is เพื่อถามตำแหน่ง'],
      ['ช่วยฉันหน่อยได้ไหม',['Can you help me, please?'],'Can you + verb?','ใช้ Can you เพื่อขอความช่วยเหลือ'],
      ['ฉันอยู่บ้าน',['I am at home.','I\'m at home.'],'I am at + place','at home เป็นรูปที่ใช้ตามธรรมชาติ'],
      ['ยินดีที่ได้รู้จัก',['Nice to meet you.'],'Nice to meet you.','ใช้เมื่อพบกันครั้งแรก']
    ],
    basic:[
      ['ฉันไปทำงานทุกวัน',['I go to work every day.'],'Present Simple: I + verb','กิจวัตรใช้ Present Simple'],
      ['คุณชอบกาแฟไหม',['Do you like coffee?'],'Do you + verb?','คำถาม Present Simple กับ you ใช้ Do'],
      ['ฉันพูดอังกฤษได้นิดหน่อย',['I can speak a little English.'],'can + verb','หลัง can ใช้กริยารูปปกติ'],
      ['อันนี้ราคาเท่าไร',['How much is this?'],'How much is ... ?','ใช้ถามราคา'],
      ['ฉันกำลังรอรถบัส',['I am waiting for the bus.','I\'m waiting for the bus.'],'am + verb-ing','สิ่งที่กำลังทำใช้ Present Continuous'],
      ['ฉันไม่ชอบอาหารเผ็ด',['I do not like spicy food.','I don\'t like spicy food.'],'do not + verb','ประโยคปฏิเสธใช้ do not']
    ],
    intermediate:[
      ['เมื่อวานฉันไปทำงาน',['Yesterday I went to work.','I went to work yesterday.'],'Past Simple','go เปลี่ยนเป็น went ในอดีต'],
      ['ฉันคิดว่ามันแพงเกินไป',['I think it is too expensive.','I think it\'s too expensive.'],'I think + clause','ใช้ I think เพื่อแสดงความคิดเห็น'],
      ['มีปัญหากับห้องของฉัน',['There is a problem with my room.','There\'s a problem with my room.'],'There is a problem with ...','ใช้แจ้งปัญหาอย่างชัดเจน'],
      ['ช่วยพูดอีกครั้งได้ไหม',['Could you say that again?','Can you say that again?'],'Could you + verb?','Could you สุภาพกว่า Can you'],
      ['ฉันต้องการเวลาเพิ่มเพื่อทำงานให้เสร็จ',['I need more time to finish the work.','I need more time to finish it.'],'need more time to + verb','to + verb ใช้บอกจุดประสงค์'],
      ['ก่อนอื่นฉันไปทำงาน จากนั้นฉันกินข้าวกลางวัน',['First, I went to work. Then, I had lunch.','First I went to work. Then I had lunch.'],'First ... Then ...','ใช้คำเชื่อมเพื่อเล่าเรื่องตามลำดับ']
    ],
    upper:[
      ['ในความเห็นของฉัน เราควรเปลี่ยนแผน',['In my opinion, we should change the plan.','I think we should change the plan.'],'In my opinion + should','ใช้ should เพื่อเสนอแนะ'],
      ['แม้ว่าเที่ยวบินจะล่าช้า เราก็ยังไปถึงตรงเวลา',['Although the flight was delayed, we arrived on time.'],'Although + clause','Although ใช้เชื่อมเหตุการณ์ที่ขัดแย้งกัน'],
      ['ถ้าฉันมีเวลามากกว่านี้ ฉันจะเรียนอังกฤษทุกวัน',['If I had more time, I would study English every day.'],'If + Past, would + verb','Second Conditional ใช้กับสถานการณ์สมมติ'],
      ['ปัญหานี้ต้องได้รับการแก้ไขก่อนการประชุม',['This problem must be fixed before the meeting.','This problem needs to be fixed before the meeting.'],'must be + V3','Passive ใช้เน้นสิ่งที่ถูกกระทำ'],
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
    const id=level(),base=(BANK[id]||BANK.starter).map((x,i)=>({id:`${id}:${i}`,th:x[0],answers:x[1],hint:x[2],explain:x[3]}));
    const d=window.getDailyLesson?.();
    if(d?.examples?.length){
      d.examples.forEach((answer,i)=>base.unshift({id:`lesson:${d.day}:${i}`,th:`บทเรียน ${d.day} · ${d.theme}: ลองแต่งประโยคที่ใช้ได้ในสถานการณ์นี้`,answers:[answer],hint:d.pattern,explain:`รูปประโยคหลักของบทนี้: ${d.pattern}`,daily:true}));
    }
    return base;
  }
  function pickTask(){const c=coach(),all=tasks(),recent=new Set(c.recent.slice(-Math.min(8,Math.max(2,all.length-1)))),pool=all.filter(x=>!recent.has(x.id));return (pool.length?pool:all)[Math.floor(Math.random()*(pool.length||all.length))]}
  function close(){const d=document.querySelector('#sentenceCoachModalV55');if(!d)return;try{if(d.open)d.close()}catch{}d.remove()}
  function award(){try{if(typeof state==='object'&&state)state.xp=(Number(state.xp)||0)+8;window.__gameLabV31?.addProgress?.('ai',1);persist()}catch{}}
  function renderTask(d,task){
    const c=coach(),info=window.getLearnerLevelInfo?.()||{cefr:level()},lesson=window.getDailyLesson?.();
    d.querySelector('#sc55Meta').textContent=`SENTENCE COACH · ${info.cefr||level()}${lesson?` · บทเรียน ${lesson.day}`:''}`;
    const body=d.querySelector('.sc55-body');
    body.innerHTML=`
      <div class="sc55-stats"><span>✓ ถูก ${Number(c.correct)||0}</span><span>✎ ลอง ${Number(c.attempts)||0}</span><span>↻ สุ่มต่อเนื่อง</span></div>
      <section class="sc55-card sc55-prompt"><small>${task.daily?'โจทย์จากบทเรียนปัจจุบัน':'โจทย์ตามระดับ'}</small><h2>${esc(task.th)}</h2><p><b>Pattern:</b> ${esc(task.hint)}</p></section>
      <section class="sc55-card"><label for="scAnswerV55">เขียนประโยคภาษาอังกฤษ</label><textarea id="scAnswerV55" rows="4" autocomplete="off" spellcheck="false" placeholder="พิมพ์คำตอบที่นี่..."></textarea><div class="sc55-actions"><button type="button" class="secondary-btn" id="scHintV55">ดูคำอธิบาย</button><button type="button" class="primary-btn" id="scCheckV55">ตรวจคำตอบ</button></div><div id="scFeedbackV55"></div></section>
      <section class="sc55-card sc55-tip"><b>วิธีฝึก</b><span>คิดเองก่อน → พิมพ์ → ตรวจ → ฟังประโยคที่ถูก → พูดตาม 1 รอบ → ระบบสุ่มข้อต่อไป</span></section>`;
    const input=body.querySelector('#scAnswerV55'),check=body.querySelector('#scCheckV55'),hint=body.querySelector('#scHintV55'),feedback=body.querySelector('#scFeedbackV55');
    hint.onclick=()=>{feedback.innerHTML=`<div class="sc55-feedback"><b>คำอธิบาย</b><p>${esc(task.explain)}</p><small>คำใบ้: ${esc(task.hint)}</small></div>`};
    const next=()=>{if(!document.body.contains(d))return;renderTask(d,pickTask());setTimeout(()=>d.querySelector('#scAnswerV55')?.focus(),50)};
    const submit=()=>{
      const value=input.value.trim();if(!value)return;
      c.attempts=(Number(c.attempts)||0)+1;
      const ok=task.answers.some(a=>norm(a)===norm(value));
      if(ok){
        c.correct=(Number(c.correct)||0)+1;c.recent=[...c.recent,task.id].slice(-24);award();
        const answer=task.answers[0];input.disabled=true;check.disabled=true;hint.disabled=true;
        feedback.innerHTML=`<div class="sc55-feedback good"><b>✓ ถูกต้อง</b><button type="button" id="scReplayV55">🔊 ${esc(answer)}</button><small>กำลังอ่านออกเสียง แล้วจะไปข้อต่อไปอัตโนมัติ</small></div>`;
        feedback.querySelector('#scReplayV55').onclick=()=>say(answer);say(answer);setTimeout(next,1800);
      }else{
        c.wrong=(Number(c.wrong)||0)+1;persist();
        feedback.innerHTML=`<div class="sc55-feedback bad"><b>ยังไม่ถูก</b><p>ตัวอย่างที่ถูก: <strong>${esc(task.answers[0])}</strong></p><small>${esc(task.explain)}</small><div class="sc55-actions"><button type="button" class="secondary-btn" id="scListenAnswer">🔊 ฟังคำตอบ</button><button type="button" class="secondary-btn" id="scTryAgain">ลองอีกครั้ง</button></div></div>`;
        feedback.querySelector('#scListenAnswer').onclick=()=>say(task.answers[0]);feedback.querySelector('#scTryAgain').onclick=()=>{input.value='';feedback.innerHTML='';input.focus()};
      }
    };
    check.onclick=submit;input.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')submit()});setTimeout(()=>input.focus(),60);
  }
  function open(){
    close();document.querySelector('#sentenceCoachModalV54')?.remove();
    const d=document.createElement('dialog');d.id='sentenceCoachModalV55';d.className='sc55-dialog';
    d.innerHTML=`<div class="sc55-shell"><header class="sc55-head"><div><small id="sc55Meta">SENTENCE COACH</small><h1>แต่งประโยค · ฟัง · พูดตาม · ไปข้อต่อไปอัตโนมัติ</h1></div><button type="button" class="sc55-close" aria-label="ปิด">×</button></header><main class="sc55-body"></main></div>`;
    document.body.appendChild(d);d.querySelector('.sc55-close').onclick=close;d.addEventListener('cancel',e=>{e.preventDefault();close()});renderTask(d,pickTask());if(d.showModal)d.showModal();else d.setAttribute('open','');
  }
  document.addEventListener('click',e=>{const t=e.target instanceof Element?e.target:null;if(!t)return;if(t.closest('.nav-btn[data-view="ai"],[data-go="ai"],#unitAI,[data-game="mission"]')){e.preventDefault();e.stopImmediatePropagation();open()}},true);
  const style=document.createElement('style');style.textContent=`
    .sc55-dialog{width:100vw;height:100dvh;max-width:none;max-height:none;margin:0;padding:0;border:0;border-radius:0;background:#071424;color:#fff;overflow:hidden}.sc55-dialog::backdrop{background:#020617}.sc55-shell{width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden;background:linear-gradient(180deg,#071424,#0a1729)}.sc55-head{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:20px max(18px,calc((100vw - 980px)/2));border-bottom:1px solid rgba(148,163,184,.16);background:rgba(7,20,36,.96)}.sc55-head small{color:#67e8f9;font-weight:900;letter-spacing:.03em}.sc55-head h1{font-size:clamp(20px,3vw,30px);margin:5px 0 0}.sc55-close{width:48px;height:48px;flex:0 0 48px;border-radius:15px;border:1px solid rgba(255,255,255,.55);background:#0b1c31;color:#fff;font-size:30px;cursor:pointer}.sc55-body{flex:1 1 auto;overflow-y:auto;overflow-x:hidden;width:100%;max-width:980px;margin:0 auto;padding:24px 18px 110px;box-sizing:border-box}.sc55-body *{box-sizing:border-box;min-width:0}.sc55-stats{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}.sc55-stats span{padding:8px 12px;border-radius:999px;background:rgba(34,211,238,.1);color:#a5f3fc;font-weight:800;font-size:12px}.sc55-card{width:100%;border:1px solid rgba(148,163,184,.16);border-radius:22px;background:rgba(10,28,49,.78);padding:20px;margin:0 0 14px}.sc55-prompt small{color:#94a3b8}.sc55-prompt h2{font-size:clamp(24px,4vw,34px);margin:10px 0 8px;line-height:1.3}.sc55-prompt p{color:#a5b4c8;margin:0}.sc55-card label{display:block;font-weight:850;margin-bottom:10px}.sc55-card textarea{display:block;width:100%;max-width:100%;resize:vertical;min-height:130px;padding:16px;border-radius:16px;border:1px solid rgba(148,163,184,.22);background:#071321;color:#fff;font:inherit;font-size:18px;outline:none}.sc55-card textarea:focus{border-color:#22d3ee;box-shadow:0 0 0 3px rgba(34,211,238,.1)}.sc55-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}.sc55-actions button{flex:1 1 180px;min-height:48px}.sc55-feedback{margin-top:14px;padding:15px;border-radius:16px;background:rgba(148,163,184,.08)}.sc55-feedback.good{background:rgba(34,197,94,.10);border:1px solid rgba(34,197,94,.28)}.sc55-feedback.bad{background:rgba(244,63,94,.08);border:1px solid rgba(244,63,94,.22)}.sc55-feedback button#scReplayV55{display:block;width:100%;text-align:left;margin:9px 0;padding:12px;border-radius:12px;border:1px solid rgba(34,211,238,.22);background:rgba(34,211,238,.08);color:#fff;font:inherit}.sc55-feedback small{display:block;color:#94a3b8;line-height:1.5}.sc55-tip{display:flex;gap:10px;flex-wrap:wrap;color:#cbd5e1}.sc55-tip b{color:#67e8f9}.sc55-tip span{flex:1 1 520px}.sc55-dialog button,.sc55-dialog textarea{max-width:100%}@media(max-width:640px){.sc55-head{padding:16px}.sc55-head h1{font-size:19px}.sc55-close{width:44px;height:44px;flex-basis:44px}.sc55-body{padding:18px 14px 96px}.sc55-card{padding:16px;border-radius:18px}.sc55-prompt h2{font-size:25px}.sc55-actions{display:grid;grid-template-columns:1fr}.sc55-actions button{width:100%}}
  `;document.head.appendChild(style);
  window.openSentenceCoach=open;window.SENTENCE_COACH_VERSION=VERSION;
})();