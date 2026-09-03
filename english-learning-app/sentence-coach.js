(()=>{
  const VERSION='v51';
  const KEY='myEnglishV2';
  const LEVEL_ORDER=['starter','basic','intermediate','upper'];
  const BANK=[
    {id:'s01',level:'starter',th:'ฉันเหนื่อย',answers:['I am tired.','I\'m tired.'],hint:'ใช้ I am + adjective',explain:'ประธาน I ใช้ am แล้วตามด้วยคำคุณศัพท์ tired'},
    {id:'s02',level:'starter',th:'ฉันพร้อมแล้ว',answers:['I am ready.','I\'m ready.'],hint:'I am + ready',explain:'ประธาน I ใช้ am และ ready เป็นคำคุณศัพท์'},
    {id:'s03',level:'starter',th:'ฉันต้องการน้ำ',answers:['I want water.','I want some water.'],hint:'I want + noun',explain:'ใช้ want ตามด้วยสิ่งที่ต้องการ เช่น water'},
    {id:'s04',level:'starter',th:'ฉันต้องการความช่วยเหลือ',answers:['I need help.'],hint:'I need + noun',explain:'need ใช้บอกสิ่งที่จำเป็นหรือสิ่งที่ต้องการ'},
    {id:'s05',level:'starter',th:'ฉันชอบกาแฟ',answers:['I like coffee.'],hint:'I like + noun',explain:'ใช้ like ตามด้วยสิ่งที่ชอบ'},
    {id:'s06',level:'starter',th:'ห้องน้ำอยู่ที่ไหน',answers:['Where is the bathroom?','Where is the toilet?'],hint:'Where is + place?',explain:'คำถามตำแหน่งใช้ Where is ... ?'},
    {id:'s07',level:'starter',th:'ขอน้ำหนึ่งแก้วครับ/ค่ะ',answers:['Water, please.','Some water, please.'],hint:'noun + please',explain:'ประโยคขอสั้น ๆ สามารถใช้สิ่งที่ต้องการตามด้วย please'},
    {id:'s08',level:'starter',th:'ยินดีที่ได้รู้จัก',answers:['Nice to meet you.'],hint:'Nice to meet you.',explain:'เป็นสำนวนมาตรฐานเมื่อพบกันครั้งแรก'},

    {id:'b01',level:'basic',th:'ฉันไปทำงานทุกวัน',answers:['I go to work every day.'],hint:'Present Simple: I + verb',explain:'กิจวัตรประจำวันใช้ Present Simple: I go ... every day'},
    {id:'b02',level:'basic',th:'คุณชอบกาแฟไหม',answers:['Do you like coffee?'],hint:'Do you + verb?',explain:'คำถาม Present Simple กับ you ใช้ Do + subject + verb ช่องปกติ'},
    {id:'b03',level:'basic',th:'เธอทำงานที่นี่',answers:['She works here.'],hint:'She + verb-s',explain:'Present Simple เมื่อประธานเป็น he/she/it กริยาหลักเติม s หรือ es'},
    {id:'b04',level:'basic',th:'ฉันพูดภาษาอังกฤษได้นิดหน่อย',answers:['I can speak a little English.','I can speak a little bit of English.'],hint:'can + verb ช่องปกติ',explain:'หลัง can ใช้กริยารูปปกติโดยไม่เติม to'},
    {id:'b05',level:'basic',th:'ฉันนั่งตรงนี้ได้ไหม',answers:['Can I sit here?'],hint:'Can I + verb?',explain:'การขออนุญาตใช้ Can I + กริยารูปปกติ'},
    {id:'b06',level:'basic',th:'อันนี้ราคาเท่าไร',answers:['How much is this?'],hint:'How much is ... ?',explain:'ถามราคาของสิ่งหนึ่งใช้ How much is this?'},
    {id:'b07',level:'basic',th:'ฉันมีประชุมตอนสิบโมง',answers:['I have a meeting at ten.','I have a meeting at 10.','I have a meeting at 10 o\'clock.'],hint:'at + เวลา',explain:'ใช้ at หน้าจุดเวลา เช่น at ten'},
    {id:'b08',level:'basic',th:'ฉันไม่ชอบอาหารเผ็ด',answers:['I do not like spicy food.','I don\'t like spicy food.'],hint:'I do not / don\'t + verb',explain:'ประโยคปฏิเสธ Present Simple กับ I ใช้ do not หรือ don\'t แล้วตามด้วยกริยารูปปกติ'},

    {id:'i01',level:'intermediate',th:'เมื่อวานฉันไปทำงาน',answers:['Yesterday I went to work.','I went to work yesterday.'],hint:'Yesterday → Past Simple',explain:'เหตุการณ์เมื่อวานใช้ Past Simple และ go เปลี่ยนเป็น went'},
    {id:'i02',level:'intermediate',th:'เมื่อวานฉันดื่มกาแฟ',answers:['Yesterday I had coffee.','I had coffee yesterday.','Yesterday I drank coffee.','I drank coffee yesterday.'],hint:'Past Simple: have → had / drink → drank',explain:'เมื่อเล่าอดีตใช้กริยาช่อง 2 เช่น had หรือ drank'},
    {id:'i03',level:'intermediate',th:'พรุ่งนี้ฉันจะทำงาน',answers:['Tomorrow I will work.','I will work tomorrow.'],hint:'will + verb',explain:'แผนหรือเหตุการณ์อนาคตใช้ will + กริยารูปปกติได้'},
    {id:'i04',level:'intermediate',th:'ฉันกำลังทำรายงานอยู่',answers:['I am working on a report.','I\'m working on a report.'],hint:'am + verb-ing',explain:'เหตุการณ์ที่กำลังทำอยู่ใช้ Present Continuous: am/is/are + verb-ing'},
    {id:'i05',level:'intermediate',th:'มีปัญหากับห้องของฉัน',answers:['There is a problem with my room.','There\'s a problem with my room.'],hint:'There is a problem with ...',explain:'ใช้ There is a problem with ... เพื่ออธิบายปัญหา'},
    {id:'i06',level:'intermediate',th:'ช่วยพูดอีกครั้งได้ไหม',answers:['Could you say that again?','Can you say that again?'],hint:'Could you + verb?',explain:'Could you ... ? เป็นรูปสุภาพสำหรับขอให้ผู้อื่นทำบางอย่าง'},
    {id:'i07',level:'intermediate',th:'ก่อนอื่นฉันไปทำงาน จากนั้นฉันกินข้าวกลางวัน',answers:['First, I went to work. Then, I had lunch.','First I went to work. Then I had lunch.'],hint:'First ... Then ...',explain:'การเล่าเหตุการณ์ตามลำดับใช้คำเชื่อม First และ Then และใช้ Past Simple เมื่อเป็นเรื่องที่ผ่านมา'},
    {id:'i08',level:'intermediate',th:'ฉันคิดว่ามันแพงเกินไป',answers:['I think it is too expensive.','I think it\'s too expensive.'],hint:'I think + clause',explain:'ใช้ I think ตามด้วยประโยคความเห็น และ too + adjective หมายถึงมากเกินไป'},

    {id:'u01',level:'upper',th:'ถ้าฉันมีเวลามากกว่านี้ ฉันจะเรียนภาษาอังกฤษทุกวัน',answers:['If I had more time, I would study English every day.','If I had more time, I would learn English every day.'],hint:'If + Past Simple, would + verb',explain:'สถานการณ์สมมติที่ไม่เป็นจริงในปัจจุบันใช้ Second Conditional: If + Past Simple, would + verb'},
    {id:'u02',level:'upper',th:'ฉันทำส่วนแรกเสร็จแล้ว แต่ฉันต้องการเวลาเพิ่ม',answers:['I finished the first part, but I need more time.','I have finished the first part, but I need more time.','I\'ve finished the first part, but I need more time.'],hint:'เชื่อมสองความคิดด้วย but',explain:'ใช้ but เชื่อมข้อมูลที่มีความขัดแย้งกัน และเลือก Past Simple หรือ Present Perfect ตามบริบทได้'},
    {id:'u03',level:'upper',th:'ในความเห็นของฉัน เราควรเปลี่ยนแผน',answers:['In my opinion, we should change the plan.','I think we should change the plan.'],hint:'In my opinion / I think + should',explain:'ใช้ should + กริยารูปปกติเพื่อเสนอแนะ'},
    {id:'u04',level:'upper',th:'แม้ว่าเที่ยวบินจะล่าช้า เราก็ยังไปถึงตรงเวลา',answers:['Although the flight was delayed, we arrived on time.','Even though the flight was delayed, we arrived on time.'],hint:'Although / Even though + clause',explain:'Although และ Even though ใช้เชื่อมสองเหตุการณ์ที่ขัดแย้งกัน'},
    {id:'u05',level:'upper',th:'ฉันไม่แน่ใจ แต่ฉันคิดว่าเราควรคุยเรื่องนี้ทีหลัง',answers:['I am not sure, but I think we should discuss this later.','I\'m not sure, but I think we should discuss this later.'],hint:'I am not sure, but ...',explain:'ใช้ but เพื่อเชื่อมความไม่แน่ใจกับข้อเสนอหรือความเห็น'},
    {id:'u06',level:'upper',th:'ถ้าฉันรู้เรื่องนี้ก่อนหน้านี้ ฉันคงตัดสินใจต่างออกไป',answers:['If I had known about this earlier, I would have made a different decision.','If I had known this earlier, I would have made a different decision.'],hint:'If + had + V3, would have + V3',explain:'เหตุการณ์สมมติในอดีตใช้ Third Conditional: If + Past Perfect, would have + past participle'},
    {id:'u07',level:'upper',th:'ปัญหานี้ต้องได้รับการแก้ไขก่อนการประชุม',answers:['This problem needs to be fixed before the meeting.','This problem must be fixed before the meeting.'],hint:'needs to be / must be + V3',explain:'เมื่อต้องการเน้นสิ่งที่ถูกกระทำ สามารถใช้รูป Passive เช่น must be fixed'},
    {id:'u08',level:'upper',th:'หลังจากที่เราตรวจสอบข้อมูลแล้ว เราจึงเปลี่ยนแผน',answers:['After we checked the information, we changed the plan.','After checking the information, we changed the plan.'],hint:'After + clause / verb-ing',explain:'After ใช้บอกลำดับเหตุการณ์ และทั้งสองรูปเป็นธรรมชาติได้'}
  ];

  let session=null;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  const currentLevel=()=>{try{const id=typeof window.getLearnerLevel==='function'?window.getLearnerLevel():'';return LEVEL_ORDER.includes(id)?id:'starter'}catch{return'starter'}};
  const norm=v=>String(v||'').trim().toLowerCase().replace(/[’]/g,"'").replace(/\s+/g,' ').replace(/\s+([,.!?])/g,'$1').replace(/[.!?]+$/,'');
  const same=(answer,task)=>task.answers.some(x=>norm(x)===norm(answer));
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  function learnerState(){try{return typeof state==='object'&&state?state:JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}}
  function persist(){try{if(typeof saveState==='function')saveState();else localStorage.setItem(KEY,JSON.stringify(learnerState()))}catch{}}
  function coachState(){const s=learnerState();s.sentenceCoach=s.sentenceCoach&&typeof s.sentenceCoach==='object'?s.sentenceCoach:{attempts:0,correct:0,wrong:0,review:[],recent:[]};return s.sentenceCoach}
  function addLegacyQuestProgress(){
    const s=learnerState();if(!s.gameLab||typeof s.gameLab!=='object')return;
    s.gameLab.progress=s.gameLab.progress&&typeof s.gameLab.progress==='object'?s.gameLab.progress:{};
    s.gameLab.progress.ai=(Number(s.gameLab.progress.ai)||0)+1;
  }
  function getTasks(){
    const level=currentLevel(),i=LEVEL_ORDER.indexOf(level);
    const allowed=new Set(LEVEL_ORDER.slice(Math.max(0,i-1),i+1));
    let pool=BANK.filter(t=>allowed.has(t.level));
    const c=coachState(),recent=new Set((c.recent||[]).slice(-12));
    const fresh=pool.filter(t=>!recent.has(t.id));if(fresh.length>=5)pool=fresh;
    return shuffle(pool).slice(0,5);
  }
  function overlay(){
    document.querySelector('#sentenceCoachModal')?.remove();
    const root=document.createElement('div');root.id='sentenceCoachModal';root.className='sentence-coach-overlay';
    root.innerHTML=`<section class="sentence-coach-panel"><header><div><small>LOCAL · ไม่ใช้ AI</small><h2>✍ Sentence Coach</h2></div><button type="button" class="sentence-close" aria-label="ปิด">×</button></header><main id="sentenceCoachBody"></main></section>`;
    document.body.appendChild(root);root.querySelector('.sentence-close').onclick=()=>root.remove();root.onclick=e=>{if(e.target===root)root.remove()};return root;
  }
  function feedbackFor(input,task){
    const t=norm(input),expected=task.answers[0];
    const notes=[];
    if(/\byesterday\b/.test(t)&&/\b(go|come|work|have|drink|eat|take|see)\b/.test(t))notes.push('มีคำบอกเวลาอดีต เช่น yesterday จึงควรตรวจรูป Past Simple ของกริยา');
    if(/\b(he|she|it)\s+(work|like|want|need|go|do)\b/.test(t))notes.push('Present Simple กับ he / she / it กริยามักต้องเติม s หรือ es');
    if(/\b(i|you|we|they)\s+(is)\b/.test(t)||/\bi\s+are\b/.test(t))notes.push('ตรวจ verb to be ให้ตรงกับประธาน: I am, you/we/they are, he/she/it is');
    if(/\bcan\s+to\b/.test(t)||/\bshould\s+to\b/.test(t)||/\bwill\s+to\b/.test(t))notes.push('หลัง can / should / will ใช้กริยารูปปกติโดยไม่ใส่ to');
    if(/\bi am agree\b/.test(t))notes.push('agree เป็นกริยา จึงใช้ I agree ไม่ใช่ I am agree');
    if(!notes.length)notes.push(task.explain);
    return{expected,notes};
  }
  function draw(){
    const root=document.querySelector('#sentenceCoachModal'),body=root?.querySelector('#sentenceCoachBody');if(!body||!session)return;
    if(session.index>=session.tasks.length)return finish();
    const task=session.tasks[session.index],level=currentLevel();
    body.innerHTML=`<div class="sentence-progress"><b>${session.index+1}/${session.tasks.length}</b><span>ระดับ ${esc(level)}</span><span>ถูก ${session.score}</span></div><article class="sentence-card"><span class="sentence-chip">แต่งประโยคจากภาษาไทย</span><h3>${esc(task.th)}</h3><p class="sentence-hint">💡 ${esc(task.hint)}</p><textarea id="sentenceInput" rows="3" autocomplete="off" autocapitalize="sentences" placeholder="พิมพ์ประโยคภาษาอังกฤษ..."></textarea><div id="sentenceFeedback"></div><div class="sentence-actions"><button type="button" id="sentenceSkip">ดูคำตอบ</button><button type="button" id="sentenceCheck">ตรวจประโยค</button></div></article>`;
    const input=body.querySelector('#sentenceInput');input.focus();
    body.querySelector('#sentenceCheck').onclick=()=>check(task,input.value);
    body.querySelector('#sentenceSkip').onclick=()=>showCorrection(task,input.value,false,true);
    input.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();check(task,input.value)}});
  }
  function check(task,value){
    const text=String(value||'').trim();if(!text)return;
    const c=coachState();c.attempts=(Number(c.attempts)||0)+1;
    if(same(text,task)){
      c.correct=(Number(c.correct)||0)+1;c.recent=[...(c.recent||[]),task.id].slice(-24);
      const s=learnerState();s.xp=(Number(s.xp)||0)+10;session.score++;addLegacyQuestProgress();persist();
      const fb=document.querySelector('#sentenceFeedback');if(fb)fb.innerHTML=`<div class="sentence-ok"><b>✓ ถูกต้อง +10 XP</b><p>${esc(task.answers[0])}</p><small>${esc(task.explain)}</small></div>`;
      setTimeout(()=>{session.index++;draw()},800);return;
    }
    c.wrong=(Number(c.wrong)||0)+1;c.review=[{id:task.id,input:text,answer:task.answers[0],at:new Date().toISOString()},...(c.review||[]).filter(x=>x.id!==task.id)].slice(0,30);persist();showCorrection(task,text,true,false);
  }
  function showCorrection(task,input,counted=false,skip=false){
    const fb=document.querySelector('#sentenceFeedback');if(!fb)return;const f=feedbackFor(input,task);
    fb.innerHTML=`<div class="sentence-fix"><b>${skip?'คำตอบตัวอย่าง':'ยังไม่ถูก — แก้ตรงนี้'}</b><p class="sentence-user">${input?`ประโยคของคุณ: ${esc(input)}`:'ยังไม่ได้พิมพ์คำตอบ'}</p><p class="sentence-correct">✓ ${esc(f.expected)}</p><ul>${f.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul><button type="button" id="sentenceUseFix">แก้แล้วลองอีกครั้ง</button>${skip?'<button type="button" id="sentenceNext">ข้อต่อไป →</button>':''}</div>`;
    fb.querySelector('#sentenceUseFix').onclick=()=>{const el=document.querySelector('#sentenceInput');if(el){el.value=f.expected;el.focus();el.select()}};
    fb.querySelector('#sentenceNext')?.addEventListener('click',()=>{const c=coachState();c.recent=[...(c.recent||[]),task.id].slice(-24);persist();session.index++;draw()});
  }
  function finish(){
    const body=document.querySelector('#sentenceCoachBody');if(!body||!session)return;const c=coachState();
    body.innerHTML=`<div class="sentence-finish"><div>🏁</div><h2>จบชุดฝึกแล้ว</h2><p>ทำถูก ${session.score}/${session.tasks.length} ข้อ</p><small>สะสมทั้งหมด: ถูก ${Number(c.correct)||0} · ต้องทบทวน ${(c.review||[]).length} ข้อ</small><div class="sentence-actions"><button type="button" id="sentenceCloseDone">ปิด</button><button type="button" id="sentenceAgain">สุ่มชุดใหม่</button></div></div>`;
    body.querySelector('#sentenceCloseDone').onclick=()=>document.querySelector('#sentenceCoachModal')?.remove();body.querySelector('#sentenceAgain').onclick=()=>start();
  }
  function start(){const root=document.querySelector('#sentenceCoachModal')||overlay();session={tasks:getTasks(),index:0,score:0};draw();return root}
  function patchUI(){
    const badge=document.querySelector('#freeModeBadge');if(badge){badge.textContent='LOCAL · Sentence Coach';badge.dataset.mode='local';badge.title='ตรวจประโยคด้วยกฎและคลังคำตอบในเครื่อง ไม่เรียก AI'}
    const nav=document.querySelector('.nav-btn[data-view="ai"]');if(nav){const ico=nav.querySelector('.nav-ai-orb,.nav-ico');if(ico)ico.textContent='✍';const spans=nav.querySelectorAll('span');if(spans.length)spans[spans.length-1].textContent='แต่งประโยค';nav.setAttribute('aria-label','Sentence Coach')}
    const homeBtn=document.querySelector('[data-go="ai"]');if(homeBtn){const card=homeBtn.closest('.action-card');if(card){const h=card.querySelector('h3');const p=card.querySelector('p');const o=card.querySelector('.card-orb');if(h)h.textContent='Sentence Coach';if(p)p.textContent='แต่งประโยคอังกฤษ ตรวจคำตอบ และดูวิธีแก้เมื่อเขียนผิด';if(o)o.textContent='✍'}homeBtn.textContent='เริ่มแต่งประโยค'}
    const mission=document.querySelector('[data-game="mission"]');if(mission){const h=mission.querySelector('h3'),p=mission.querySelector('p'),i=mission.querySelector('.game-icon');if(h)h.textContent='Sentence Challenge';if(p)p.textContent='ฝึกแต่งประโยคและแก้จุดที่ผิด';if(i)i.textContent='✍'}
    document.querySelectorAll('#unitAI').forEach(b=>b.textContent='ฝึกแต่งประโยคจากบทนี้');
    const road=document.querySelector('#learningRoadmap .roadmap-head p');if(road)road.textContent=road.textContent.replace(/AI Coach/g,'Sentence Coach');
    const zero=document.querySelector('.zero-cost-note');if(zero)zero.textContent='LOCAL MODE: แบบฝึกแต่งประโยคและตรวจคำตอบทำงานในแอป ไม่เรียก AI หรือ Groq และไม่ใช้โควตาบริการภายนอก';
    document.querySelectorAll('.quest-item').forEach((el,i)=>{try{const ids=learnerState().gameLab?.dailyQuestIds||[];if(ids[i]==='ai'){const b=el.querySelector('b'),s=el.querySelector('span');if(b&&!(b.textContent||'').includes('✅'))b.textContent='✍';if(s)s.textContent=`${Number(learnerState().gameLab?.progress?.ai)||0}/1 ประโยค`}}catch{}});
  }
  document.addEventListener('click',e=>{
    const t=e.target instanceof Element?e.target:null;if(!t)return;
    if(t.closest('.nav-btn[data-view="ai"],[data-go="ai"],#unitAI,[data-game="mission"]')){e.preventDefault();e.stopImmediatePropagation();start()}
  },true);
  document.addEventListener('app:rendered',()=>setTimeout(patchUI,0));
  const observer=new MutationObserver(()=>patchUI());observer.observe(document.body,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patchUI,{once:true});else patchUI();
  window.openSentenceCoach=start;window.SENTENCE_COACH_VERSION=VERSION;
})();
