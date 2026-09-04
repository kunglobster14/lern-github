(()=>{
  const VERSION='v65',STAGE_ENDS=new Set([21,56,98,140,182,210]);
  const norm=v=>String(v||'').toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}' ]+/gu,' ').replace(/\s+/g,' ').trim();
  const uniq=(arr,key=x=>x)=>{const s=new Set();return arr.filter(x=>{const k=key(x);if(!k||s.has(k))return false;s.add(k);return true})};
  const rotate=(arr,n)=>{if(!arr.length)return[];n=((Number(n)||0)%arr.length+arr.length)%arr.length;return arr.slice(n).concat(arr.slice(0,n))};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const say=text=>{try{if(typeof window.speak==='function')return window.speak(text);speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.82;speechSynthesis.speak(u)}catch{}};
  const getLesson=day=>window.getDailyLesson?.(Number(day)||1)||null;
  const countFor=day=>STAGE_ENDS.has(Number(day))?15:Number(day)%7===0?10:5;
  const dayNow=()=>Math.max(1,Math.min(210,Number(window.getDailyCourseProgress?.().currentDay)||1));
  const difficultyForDay=day=>Math.min(10,Math.max(2,2+((Math.max(1,Math.min(210,Number(day)||1))-1)/209)*8));
  const gameMinutesForDay=day=>Math.max(10,Math.min(20,Math.round(10+((difficultyForDay(day)-2)/8)*10)));
  const dialogDay=d=>Number(String(d?.querySelector?.('.v62-head small')?.textContent||'').match(/บทเรียน\s*(\d+)/)?.[1])||dayNow();

  function reservedTargets(day){
    const l=getLesson(day)||{},pairs=(l.examplePairs||[]).filter(p=>p?.en&&p?.th),en=new Set(),th=new Set();
    pairs.forEach(p=>{en.add(norm(p.en));th.add(norm(p.th))});
    return{en,th};
  }
  function itemConcept(item){return String(item?.conceptKey||`${item?.type||'item'}:${norm(item?.correctLabel)}`)}
  function pairConcept(item){const c=String(item?.conceptKey||'');return c.startsWith('pair:')?norm(c.slice(5)):''}
  function optionIsReserved(label,reserved){const n=norm(label);return reserved.en.has(n)||reserved.th.has(n)}
  function safeMaterialize(item,day,index,attempt,reserved){
    const correct=String(item?.correctLabel||'').trim();if(!correct||optionIsReserved(correct,reserved))return null;
    const source=uniq((item?.optionPool||item?.options?.map(o=>o.label)||[]).map(String).map(x=>x.trim()).filter(Boolean),norm),pool=source.filter(x=>norm(x)!==norm(correct)&&!optionIsReserved(x,reserved));
    if(pool.length<3)return null;
    const decoys=rotate(pool,day*17+attempt*23+index*7).slice(0,3),pos=(day+attempt+index*3)%4,options=[];let k=0;
    for(let i=0;i<4;i++)options.push(i===pos?{label:correct,correct:true}:{label:decoys[k++],correct:false});
    return{...item,options};
  }
  function buildSeparatedMastery(day,count=countFor(day),attempt=0){
    day=Math.max(1,Math.min(210,Number(day)||1));count=Math.max(1,Number(count)||5);attempt=Math.max(0,Number(attempt)||0);
    if(typeof window.buildMasteryItemsV64B!=='function')return[];
    const reserved=reservedTargets(day),pool=[];
    for(let bump=0;bump<10;bump++){
      const batch=window.buildMasteryItemsV64B(day,Math.max(24,count*4),attempt+bump)||[];
      batch.forEach(x=>{const pc=pairConcept(x);if(pc&&reserved.en.has(pc))return;pool.push(x)})
    }
    const candidates=uniq(pool,itemConcept),usedAnswers=new Set(),usedConcepts=new Set(),out=[];
    const preferredTypes=['wordMeaning','gap','listening','wordRecall','thaiEnglish','englishThai','sentenceTarget'];
    const currentWords=candidates.filter(x=>Number(x.sourceDay)===day&&String(x.conceptKey||'').startsWith('word:'));
    const other=candidates.filter(x=>!currentWords.includes(x)),orderedCurrent=[],orderedOther=[];
    const cycle=(arr,dest)=>{for(const type of rotate(preferredTypes,day+attempt)){arr.filter(x=>x.type===type).forEach(x=>dest.push(x))}};
    cycle(currentWords,orderedCurrent);cycle(other,orderedOther);
    const add=item=>{const a=norm(item.correctLabel),c=itemConcept(item);if(!a||usedAnswers.has(a)||usedConcepts.has(c))return false;const ready=safeMaterialize(item,day,out.length,attempt,reserved);if(!ready)return false;usedAnswers.add(a);usedConcepts.add(c);out.push(ready);return true};
    const currentLimit=count<=5?2:Math.max(3,Math.ceil(count*.4));for(const item of orderedCurrent){if(out.length>=currentLimit)break;add(item)}
    for(const item of orderedOther){if(out.length>=count)break;add(item)}
    for(const item of orderedCurrent){if(out.length>=count)break;add(item)}
    return out;
  }
  function patchMastery(d,day){
    if(!d)return false;day=Number(day)||dialogDay(d);const box=d.querySelector('[data-phase="mastery"] .v62-phase-body');if(!box)return false;
    const head=box.querySelector('.v62-assessment-head > div:last-child')?.textContent||'',attempt=Math.max(0,(Number(head.match(/(\d+)/)?.[1])||1)-1),groups=[...box.querySelectorAll('[data-v62-q]')],items=buildSeparatedMastery(day,groups.length,attempt);
    if(items.length<groups.length)return false;box.dataset.v65Separated=String(attempt);const sub=d.querySelector('[data-phase="mastery"] header p');if(sub)sub.textContent=`Separated Mastery · ${groups.length} ข้อ · ไม่ใช้ประโยคที่เพิ่งเห็นเป็นคำตอบตรง ๆ`;
    groups.forEach((g,i)=>{const item=items[i],p=g.querySelector('p'),buttons=[...g.querySelectorAll('[data-opt]')],correctId=g.dataset.correct;if(!item||!p||buttons.length!==4||!correctId)return;g.dataset.v65Type=item.type;g.dataset.v65Concept=itemConcept(item);g.dataset.answer=item.answer||item.correctLabel;p.textContent='';if(item.audio){const audio=document.createElement('button');audio.type='button';audio.className='v62-mini-audio';audio.textContent='🔊 ฟังโจทย์';audio.onclick=()=>say(item.audio);p.appendChild(audio);p.appendChild(document.createTextNode(` ${item.prompt}`))}else p.textContent=item.prompt;buttons.forEach((btn,j)=>{const opt=item.options[j];btn.textContent=opt.label;btn.dataset.opt=opt.correct?correctId:`v65-${day}-${attempt}-${i}-${j}`;btn.disabled=false;btn.classList.remove('selected','correct','wrong')})});return true;
  }

  function addMic(target){
    if(!target||target.dataset.v65Mic==='1'||target.id==='v64SpeakFallbackInput')return;target.dataset.v65Mic='1';const btn=document.createElement('button');btn.type='button';btn.className='v65-mic-btn';btn.textContent='🎙 พูดเพื่อตอบ';btn.setAttribute('aria-label','พูดผ่านไมโครโฟนเพื่อใส่คำตอบ');target.insertAdjacentElement('afterend',btn);
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){btn.disabled=true;btn.textContent='🎙 ไมค์ไม่รองรับ';btn.title='ยังพิมพ์คำตอบเองได้ตามปกติ';return}
    btn.onclick=()=>{const r=new SR();r.lang='en-US';r.interimResults=false;r.maxAlternatives=1;const old=btn.textContent;btn.disabled=true;btn.textContent='กำลังฟัง…';r.onresult=e=>{const heard=String(e.results?.[0]?.[0]?.transcript||'').trim();if(heard){target.value=heard;target.dispatchEvent(new Event('input',{bubbles:true}));target.dispatchEvent(new Event('change',{bubbles:true}));btn.textContent='✓ รับเสียงแล้ว'}else btn.textContent='ไม่พบคำพูด';setTimeout(()=>{btn.disabled=false;btn.textContent=old},900)};r.onerror=()=>{btn.disabled=false;btn.textContent='🎙 ลองใหม่';btn.title='ตรวจสิทธิ์ไมโครโฟน แล้วลองอีกครั้ง'};try{r.start()}catch{btn.disabled=false;btn.textContent=old}}
  }
  function patchMicInputs(d){
    if(!d)return;d.querySelectorAll('.v62-text-input, .v62-textarea').forEach(addMic);const prod=d.querySelector('.v64-production');if(prod&&!prod.querySelector('.v65-input-choice')){const p=document.createElement('p');p.className='v65-input-choice';p.textContent='ตอบได้ 2 แบบ: 🎙 พูดผ่านไมค์ให้ระบบใส่ข้อความ หรือ ⌨ พิมพ์เอง แล้วกดส่งคำตอบ';const head=prod.querySelector('.v64-production-head');head?.insertAdjacentElement('afterend',p)}
  }

  let gameTimer=null;
  function clearGameTimer(){if(gameTimer){clearInterval(gameTimer);gameTimer=null}}
  function finishGame(d,minutes){
    clearGameTimer();if(!d||!document.body.contains(d))return;try{if(d.open)d.close()}catch{}d.remove();const done=document.createElement('dialog');done.id='gameSessionCompleteV65';done.className='game-dialog v65-game-complete';done.innerHTML=`<section class="game-panel"><div class="v65-complete-card"><small>GAME SESSION COMPLETE</small><h2>ครบเวลา ${minutes} นาที</h2><p>ช่วงเกมจบตามระดับความยากแล้ว พักหรือกลับไปเรียนบทถัดไปได้</p><button class="primary-btn" type="button">ปิด</button></div></section>`;document.body.appendChild(done);done.querySelector('button').onclick=()=>{try{done.close()}catch{}done.remove()};done.addEventListener('cancel',e=>{e.preventDefault();done.remove()});if(done.showModal)done.showModal();else done.setAttribute('open','')
  }
  function startGameTimer(){
    const d=document.querySelector?.('#hardGameV62');if(!d||d.dataset.v65Timed==='1')return false;clearGameTimer();const day=dayNow(),difficulty=difficultyForDay(day),minutes=gameMinutesForDay(day),end=Date.now()+minutes*60000;d.dataset.v65Timed='1';d.dataset.v65Minutes=String(minutes);
    const status=d.querySelector('#v62GameStatus'),meter=document.createElement('div');meter.className='v65-game-timer';meter.innerHTML=`<span>เวลาเกมตามความยาก ${difficulty.toFixed(1)}/10</span><b data-v65-countdown>${minutes}:00</b><small>${minutes} นาที</small>`;status?.insertAdjacentElement('afterend',meter);const label=meter.querySelector('[data-v65-countdown]');
    const tick=()=>{if(!document.body.contains(d)){clearGameTimer();return}const left=Math.max(0,end-Date.now()),sec=Math.ceil(left/1000),mm=Math.floor(sec/60),ss=String(sec%60).padStart(2,'0');if(label)label.textContent=`${mm}:${ss}`;if(left<=0)finishGame(d,minutes)};tick();gameTimer=setInterval(tick,1000);return true;
  }
  function scheduleLessonPatch(){setTimeout(()=>{const d=document.querySelector?.('#instituteLessonV62');if(!d)return;const day=dialogDay(d);patchMastery(d,day);patchMicInputs(d)},20);setTimeout(()=>{const d=document.querySelector?.('#instituteLessonV62');if(!d)return;patchMastery(d,dialogDay(d));patchMicInputs(d)},120)}
  function scheduleGameTimer(){setTimeout(startGameTimer,40);setTimeout(startGameTimer,160)}

  const baseHard=typeof window.openHardGameV62==='function'?window.openHardGameV62:null;if(baseHard)window.openHardGameV62=(type='mix')=>{const r=baseHard(type);scheduleGameTimer();return r};
  const baseAdaptive=typeof window.openAdaptiveGame==='function'?window.openAdaptiveGame:null;if(baseAdaptive)window.openAdaptiveGame=(type='mix')=>{const r=baseAdaptive(type);scheduleGameTimer();return r};
  if(typeof window.addEventListener==='function')window.addEventListener('click',e=>{const t=e.target instanceof Element?e.target:null;if(!t)return;if(t.closest?.('[data-v62-lesson],[data-choose-day],[data-skill-lesson],#dailyOpenLesson,#dailyComplete,#v62RetryMastery'))scheduleLessonPatch();if(t.closest?.('[data-game]'))scheduleGameTimer()},true);
  if(typeof document?.addEventListener==='function'){document.addEventListener('app:rendered',scheduleLessonPatch);document.addEventListener('daily-course:changed',scheduleLessonPatch)}
  if(typeof setTimeout==='function'){setTimeout(scheduleLessonPatch,500);setTimeout(startGameTimer,700)}

  function audit(){
    const incomplete=[],reservedLeaks=[],duplicateAnswers=[],duplicateConcepts=[],badOptions=[],types=new Set();let questions=0;
    for(let day=1;day<=210;day++){
      const count=countFor(day),items=buildSeparatedMastery(day,count,0),r=reservedTargets(day),answers=items.map(x=>norm(x.correctLabel)),concepts=items.map(itemConcept);questions+=items.length;items.forEach(x=>types.add(x.type));if(items.length!==count)incomplete.push([day,items.length,count]);if(new Set(answers).size!==answers.length)duplicateAnswers.push(day);if(new Set(concepts).size!==concepts.length)duplicateConcepts.push(day);items.forEach((x,i)=>{const pc=pairConcept(x);if(pc&&r.en.has(pc))reservedLeaks.push([day,i,pc]);if(x.options?.length!==4||x.options.filter(o=>o.correct).length!==1||x.options.some(o=>!String(o.label||'').trim()||optionIsReserved(o.label,r)))badOptions.push([day,i,x.type])})
    }
    const minutes=Array.from({length:210},(_,i)=>gameMinutesForDay(i+1));return{version:VERSION,totalLessons:210,masteryQuestions:questions,typesUsed:types.size,incomplete,reservedLeaks,duplicateAnswers,duplicateConcepts,badOptions,gameMinutes:{min:Math.min(...minutes),max:Math.max(...minutes),first:minutes[0],last:minutes.at(-1),nondecreasing:minutes.every((x,i)=>i===0||x>=minutes[i-1])},micOrTyping:true,ok:!incomplete.length&&!reservedLeaks.length&&!duplicateAnswers.length&&!duplicateConcepts.length&&!badOptions.length&&Math.min(...minutes)>=10&&Math.max(...minutes)<=20}
  }
  window.buildSeparatedMasteryV65=buildSeparatedMastery;window.getGameSessionMinutesV65=gameMinutesForDay;window.auditInteractionQualityV65=audit;window.INTERACTION_QUALITY_VERSION=VERSION;
})();
