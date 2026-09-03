(()=>{
  const VERSION='v53';
  const KEY='myEnglishV2';
  const BANK={
    starter:[
      ['ฉันเหนื่อย',['I am tired.','I\'m tired.'],'I am + adjective','ประธาน I ใช้ am แล้วตามด้วยคำคุณศัพท์'],
      ['ฉันต้องการน้ำ',['I want water.','I want some water.'],'I want + noun','ใช้ want ตามด้วยสิ่งที่ต้องการ'],
      ['ฉันต้องการความช่วยเหลือ',['I need help.'],'I need + noun','need ใช้บอกสิ่งที่จำเป็น'],
      ['ฉันชอบกาแฟ',['I like coffee.'],'I like + noun','ใช้ like ตามด้วยสิ่งที่ชอบ'],
      ['ห้องน้ำอยู่ที่ไหน',['Where is the bathroom?','Where is the toilet?'],'Where is + place?','คำถามตำแหน่งใช้ Where is ... ?'],
      ['ยินดีที่ได้รู้จัก',['Nice to meet you.'],'Nice to meet you.','เป็นสำนวนมาตรฐานเมื่อพบกันครั้งแรก']
    ],
    basic:[
      ['ฉันไปทำงานทุกวัน',['I go to work every day.'],'Present Simple: I + verb','กิจวัตรประจำวันใช้ Present Simple'],
      ['คุณชอบกาแฟไหม',['Do you like coffee?'],'Do you + verb?','คำถาม Present Simple กับ you ใช้ Do'],
      ['เธอทำงานที่นี่',['She works here.'],'She + verb-s','he/she/it ใช้กริยาเติม s/es'],
      ['ฉันพูดอังกฤษได้นิดหน่อย',['I can speak a little English.'],'can + verb','หลัง can ใช้กริยารูปปกติ'],
      ['อันนี้ราคาเท่าไร',['How much is this?'],'How much is ... ?','ใช้ How much is this? เพื่อถามราคา'],
      ['ฉันมีประชุมตอนสิบโมง',['I have a meeting at ten.','I have a meeting at 10.'],'at + เวลา','ใช้ at หน้าจุดเวลา']
    ],
    intermediate:[
      ['เมื่อวานฉันไปทำงาน',['Yesterday I went to work.','I went to work yesterday.'],'Yesterday → Past Simple','go เปลี่ยนเป็น went ในอดีต'],
      ['พรุ่งนี้ฉันจะทำงาน',['Tomorrow I will work.','I will work tomorrow.'],'will + verb','อนาคตใช้ will + กริยารูปปกติได้'],
      ['ฉันกำลังทำรายงานอยู่',['I am working on a report.','I\'m working on a report.'],'am + verb-ing','Present Continuous ใช้ am/is/are + verb-ing'],
      ['มีปัญหากับห้องของฉัน',['There is a problem with my room.','There\'s a problem with my room.'],'There is a problem with ...','ใช้โครงสร้างนี้เพื่ออธิบายปัญหา'],
      ['ช่วยพูดอีกครั้งได้ไหม',['Could you say that again?','Can you say that again?'],'Could you + verb?','Could you ... ? สุภาพกว่า Can you ... ?'],
      ['ฉันคิดว่ามันแพงเกินไป',['I think it is too expensive.','I think it\'s too expensive.'],'I think + clause','too + adjective หมายถึงมากเกินไป']
    ],
    upper:[
      ['ในความเห็นของฉัน เราควรเปลี่ยนแผน',['In my opinion, we should change the plan.','I think we should change the plan.'],'In my opinion + should','should ใช้เสนอแนะ'],
      ['แม้ว่าเที่ยวบินจะล่าช้า เราก็ยังไปถึงตรงเวลา',['Although the flight was delayed, we arrived on time.'],'Although + clause','Although ใช้เชื่อมสองเหตุการณ์ที่ขัดแย้งกัน'],
      ['ถ้าฉันมีเวลามากกว่านี้ ฉันจะเรียนอังกฤษทุกวัน',['If I had more time, I would study English every day.'],'If + Past, would + verb','Second Conditional ใช้กับสถานการณ์สมมติ'],
      ['ปัญหานี้ต้องได้รับการแก้ไขก่อนการประชุม',['This problem must be fixed before the meeting.','This problem needs to be fixed before the meeting.'],'must be + V3','Passive ใช้เน้นสิ่งที่ถูกกระทำ'],
      ['ฉันไม่แน่ใจ แต่ฉันคิดว่าเราควรคุยเรื่องนี้ทีหลัง',['I am not sure, but I think we should discuss this later.','I\'m not sure, but I think we should discuss this later.'],'I am not sure, but ...','ใช้ but เชื่อมความไม่แน่ใจกับข้อเสนอ'],
      ['ถ้าฉันรู้เรื่องนี้ก่อนหน้านี้ ฉันคงตัดสินใจต่างออกไป',['If I had known about this earlier, I would have made a different decision.'],'If + had + V3, would have + V3','Third Conditional ใช้กับเหตุการณ์สมมติในอดีต']
    ]
  };
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=v=>String(v||'').trim().toLowerCase().replace(/[’]/g,"'").replace(/\s+/g,' ').replace(/\s+([,.!?])/g,'$1').replace(/[.!?]+$/,'');
  const level=()=>{try{return window.getLearnerLevel?.()||'starter'}catch{return'starter'}};
  function root(){try{return typeof state==='object'&&state?state:JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return{}}}
  function coach(){const s=root();s.sentenceCoach=s.sentenceCoach&&typeof s.sentenceCoach==='object'?s.sentenceCoach:{attempts:0,correct:0,wrong:0,recent:[]};return s.sentenceCoach}
  function persist(){try{if(typeof saveState==='function')saveState();else localStorage.setItem(KEY,JSON.stringify(root()))}catch{}}
  function dailyTask(){
    const d=window.getDailyLesson?.();if(!d)return null;
    const answer=d.examples?.[0];if(!answer)return null;
    return {th:`Day ${d.day} · ${d.theme}: แต่งประโยคตามตัวอย่าง`,answers:[answer],hint:d.pattern,explain:`ใช้รูปประโยคของ Day ${d.day}: ${d.pattern}`,daily:true};
  }
  function pickTask(){
    const c=coach(),items=BANK[level()]||BANK.starter,daily=dailyTask();
    if(daily&&!c.recent?.includes(`day:${window.getDailyLesson().day}`))return daily;
    const recent=new Set((c.recent||[]).slice(-6));
    const mapped=items.map((x,i)=>({id:`${level()}:${i}`,th:x[0],answers:x[1],hint:x[2],explain:x[3]}));
    const pool=mapped.filter(x=>!recent.has(x.id));
    return (pool.length?pool:mapped)[Math.floor(Math.random()*(pool.length||mapped.length))];
  }
  function close(){const d=document.querySelector('#sentenceCoachModalV53');if(!d)return;try{if(d.open)d.close()}catch{}d.remove()}
  function open(){
    close();const task=pickTask(),c=coach(),info=window.getLearnerLevelInfo?.()||{cefr:level()};
    const d=document.createElement('dialog');d.id='sentenceCoachModalV53';d.className='sentence-coach-v53';
    d.innerHTML=`<section><header><div><small>SENTENCE COACH · ${esc(info.cefr||level())}</small><h2>แต่งประโยคและแก้ประโยคผิด</h2></div><button type="button" class="sc-close">×</button></header><div class="sc-body"><div class="sc-stats"><span>ถูก ${Number(c.correct)||0}</span><span>ลอง ${Number(c.attempts)||0}</span></div><div class="sc-prompt"><small>โจทย์</small><h3>${esc(task.th)}</h3><p>คำใบ้: ${esc(task.hint)}</p></div><textarea id="scAnswer" rows="3" autocomplete="off" autocapitalize="sentences" placeholder="พิมพ์ประโยคภาษาอังกฤษ"></textarea><div id="scFeedback"></div><div class="sc-actions"><button type="button" class="secondary-btn" id="scShow">ดูตัวอย่าง</button><button type="button" class="primary-btn" id="scCheck">ตรวจคำตอบ</button></div></div></section>`;
    document.body.appendChild(d);d.querySelector('.sc-close').onclick=close;d.addEventListener('cancel',e=>{e.preventDefault();close()});d.addEventListener('click',e=>{if(e.target===d)close()});
    const input=d.querySelector('#scAnswer'),feedback=d.querySelector('#scFeedback');
    d.querySelector('#scShow').onclick=()=>feedback.innerHTML=`<div class="sc-example"><b>ตัวอย่าง:</b> ${esc(task.answers[0])}<br><span>${esc(task.explain)}</span></div>`;
    d.querySelector('#scCheck').onclick=()=>{
      const val=input.value.trim();if(!val){feedback.innerHTML='<div class="sc-wrong">พิมพ์ประโยคก่อนตรวจ</div>';return}
      const ok=task.answers.some(x=>norm(x)===norm(val));c.attempts=(Number(c.attempts)||0)+1;c.recent=Array.isArray(c.recent)?c.recent:[];const rid=task.daily?`day:${window.getDailyLesson?.().day}`:(task.id||'task');c.recent=[...c.recent,rid].slice(-12);
      if(ok){c.correct=(Number(c.correct)||0)+1;try{if(typeof state==='object'&&state)state.xp=(Number(state.xp)||0)+8}catch{}feedback.innerHTML=`<div class="sc-correct"><b>✓ ถูก</b><span>${esc(task.explain)}</span></div>`}
      else{c.wrong=(Number(c.wrong)||0)+1;feedback.innerHTML=`<div class="sc-wrong"><b>ลองแก้ใหม่</b><span>ตัวอย่าง: ${esc(task.answers[0])}</span><small>${esc(task.explain)}</small></div>`}
      persist();
    };
    if(d.showModal)d.showModal();else d.setAttribute('open','');setTimeout(()=>input.focus(),80);
  }
  function patchUI(){
    if(document.documentElement.classList.contains('account-locked'))return;
    document.querySelectorAll('.nav-btn[data-view="ai"] span:last-child').forEach(s=>s.textContent='แต่งประโยค');
    document.querySelectorAll('#unitAI').forEach(b=>b.textContent='ฝึกแต่งประโยคจากบทนี้');
    const guide=document.querySelector('#learningGuideCard .learning-guide-route');if(guide){const spans=guide.querySelectorAll('span');if(spans.length>=6)spans[5].textContent='6 · Sentence Coach'}
    document.querySelectorAll('[data-game="mission"]').forEach(card=>{const b=card.querySelector('b');if(b)b.textContent='Sentence Coach';const p=card.querySelector('p');if(p)p.textContent='แต่งประโยคตามระดับและ Day ปัจจุบัน'});
  }
  const style=document.createElement('style');style.textContent=`
    .sentence-coach-v53{width:min(720px,94vw);border:0;padding:0;border-radius:26px;background:#0b1729;color:#fff;box-shadow:0 30px 100px rgba(0,0,0,.55)}.sentence-coach-v53::backdrop{background:rgba(2,6,23,.82)}.sentence-coach-v53 header{display:flex;justify-content:space-between;align-items:center;gap:15px;padding:20px 22px;border-bottom:1px solid rgba(148,163,184,.14)}.sentence-coach-v53 header small{color:#67e8f9}.sentence-coach-v53 header h2{margin:4px 0 0}.sc-close{width:40px;height:40px;border-radius:12px;border:1px solid rgba(148,163,184,.2);background:#101e33;color:#fff;font-size:24px}.sc-body{padding:22px}.sc-stats{display:flex;gap:8px;margin-bottom:10px}.sc-stats span{padding:5px 9px;border-radius:999px;background:#101e33;color:#94a3b8;font-size:11px}.sc-prompt{padding:16px;border-radius:18px;background:rgba(14,116,144,.1);border:1px solid rgba(34,211,238,.18)}.sc-prompt small{color:#67e8f9}.sc-prompt h3{margin:5px 0}.sc-prompt p{margin:0;color:#94a3b8}.sentence-coach-v53 textarea{box-sizing:border-box;width:100%;margin:12px 0;padding:14px;border-radius:16px;border:1px solid rgba(148,163,184,.18);background:#071424;color:#fff;font:inherit;resize:vertical}.sc-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px}.sc-correct,.sc-wrong,.sc-example{padding:12px 14px;border-radius:14px;margin:0 0 12px}.sc-correct{background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.25)}.sc-wrong{background:rgba(244,63,94,.09);border:1px solid rgba(244,63,94,.22)}.sc-example{background:rgba(59,130,246,.09);border:1px solid rgba(59,130,246,.2)}.sc-correct b,.sc-correct span,.sc-wrong b,.sc-wrong span,.sc-wrong small{display:block}.sc-correct span,.sc-wrong span,.sc-wrong small,.sc-example span{color:#94a3b8;margin-top:4px}@media(max-width:600px){.sc-actions{grid-template-columns:1fr}}
  `;document.head.appendChild(style);
  document.addEventListener('click',e=>{const t=e.target instanceof Element?e.target:null;if(!t)return;if(t.closest('.nav-btn[data-view="ai"],[data-go="ai"],#unitAI,[data-game="mission"]')){e.preventDefault();e.stopImmediatePropagation();open()}},true);
  document.addEventListener('app:rendered',()=>requestAnimationFrame(patchUI));document.addEventListener('learner-level:changed',()=>requestAnimationFrame(patchUI));document.addEventListener('daily-course:changed',()=>requestAnimationFrame(patchUI));
  const boot=()=>{if(document.documentElement.classList.contains('account-locked'))return setTimeout(boot,350);patchUI()};setTimeout(boot,50);
  window.openSentenceCoach=open;window.SENTENCE_COACH_VERSION=VERSION;
})();
