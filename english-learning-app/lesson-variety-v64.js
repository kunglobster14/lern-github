(()=>{
  const VERSION='v64',STATE_KEY='myEnglishV2';
  const STAGES=[[1,21],[22,56],[57,98],[99,140],[141,182],[183,210]];
  const PRODUCTION_STYLES=[
    {id:'personal',name:'Personal Reply',lead:'ตอบจากชีวิตจริงของคุณ'},
    {id:'dialogue',name:'Mini Dialogue',lead:'เขียนเหมือนบทสนทนาสั้น 2 ช่วง'},
    {id:'story',name:'Micro Story',lead:'เล่าเหตุการณ์สั้น ๆ ให้จบใน 2 ประโยค'},
    {id:'message',name:'Real-life Message',lead:'เขียนข้อความที่ใช้ได้จริงในสถานการณ์นี้'},
    {id:'choice',name:'Explain a Choice',lead:'บอกสิ่งที่คุณเลือกและเหตุผลสั้น ๆ'},
    {id:'compare',name:'Compare & Tell',lead:'เปรียบเทียบหรือบอกรายละเอียด 2 มุม'},
    {id:'situation',name:'Situation Response',lead:'ตอบกลับสถานการณ์เหมือนกำลังใช้งานจริง'},
    {id:'followup',name:'Question + Follow-up',lead:'ประโยคแรกเปิดเรื่อง ประโยคสองต่อความหมาย'}
  ];
  const MASTERY_TYPES=['wordMeaning','thaiEnglish','englishThai','gap','listening','sentenceTarget'];
  const REVIEW_LABELS=['Flash Recall','Meaning Switch','Fast Retrieval','Old-to-New Link','Listen Back','Pattern Recall'];
  const LEARN_LABELS=['Pattern Hunt','Context Focus','Meaning Contrast','Example Detective','Usage Lens'];
  const GUIDED_LABELS=['Rebuild','Controlled Transfer','Cloze Builder','Meaning Bridge','Phrase Assembly','Guided Recall'];
  const MASTERY_LABELS=['Mixed Recall','Meaning + Form','Listen + Choose','Pattern Mix','Vocabulary Transfer','Context Mix'];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=v=>String(v||'').toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim();
  const uniq=(arr,key=x=>x)=>{const s=new Set();return arr.filter(x=>{const k=key(x);if(!k||s.has(k))return false;s.add(k);return true})};
  const rotate=(arr,n)=>{if(!arr.length)return[];n=((Number(n)||0)%arr.length+arr.length)%arr.length;return arr.slice(n).concat(arr.slice(0,n))};
  const say=text=>{try{if(typeof window.speak==='function')return window.speak(text);speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.82;speechSynthesis.speak(u)}catch{}};
  const level=()=>{try{return window.getLearnerLevel?.()||'starter'}catch{return'starter'}};
  const getLesson=day=>window.getDailyLesson?.(Number(day)||1)||null;
  const stageFor=day=>STAGES.find(x=>day>=x[0]&&day<=x[1])||STAGES[0];
  const isStageExam=day=>STAGES.some(x=>x[1]===Number(day));
  const isWeekly=day=>Number(day)%7===0;
  const isSpeakingGate=(day,l=getLesson(day))=>Boolean(l?.institute?.speakingGate)||((Number(day)%3===0&&Number(day)%7!==0)||isStageExam(day));
  const masteryCount=(day,l=getLesson(day))=>Boolean(l?.institute?.stageExam)||isStageExam(day)?15:Boolean(l?.institute?.weeklyReview)||isWeekly(day)?10:5;
  const speakingThreshold=(day,l=getLesson(day))=>Number(l?.institute?.speakingThreshold||(.72+Math.max(0,STAGES.findIndex(x=>day>=x[0]&&day<=x[1]))*.025).toFixed(3));
  const tokenDistance=(a,b)=>{a=norm(a).split(/\s+/).filter(Boolean);b=norm(b).split(/\s+/).filter(Boolean);const m=a.length,n=b.length,d=Array.from({length:m+1},()=>Array(n+1).fill(0));for(let i=0;i<=m;i++)d[i][0]=i;for(let j=0;j<=n;j++)d[0][j]=j;for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return 1-d[m][n]/Math.max(1,m,n)};

  function lessonVariety(day){
    day=Math.max(1,Math.min(210,Number(day)||1));const l=getLesson(day)||{},focus=l.focusWord?.en||l.vocab?.[0]?.en||`lesson ${day}`,style=PRODUCTION_STYLES[(day*5+STAGES.findIndex(x=>day>=x[0]&&day<=x[1])+PRODUCTION_STYLES.length)%PRODUCTION_STYLES.length],pairs=(l.examplePairs||[]).filter(p=>p?.en&&p?.th),target=pairs[(day*3+1)%Math.max(1,pairs.length)]||{en:l.example||l.examples?.[0]||`Practice ${focus} in a sentence.`,th:l.exampleThai||''};
    const scenario=String(l.scenario||l.goal||'ใช้ภาษาอังกฤษในสถานการณ์ของบทนี้').trim();
    const prompts={
      personal:`${style.lead}: ${scenario} ลองใช้ “${focus}” ถ้าเหมาะกับคำตอบ`,
      dialogue:`${style.lead}: ประโยค 1 เป็นสิ่งที่คุณพูด และประโยค 2 เป็นคำตอบต่อเนื่องในบริบท “${scenario}”`,
      story:`${style.lead}: ประโยค 1 บอกว่าเกิดอะไรขึ้น และประโยค 2 บอกรายละเอียดหรือผล โดยอิง “${scenario}”`,
      message:`${style.lead}: เขียน 2 ประโยคที่คุณส่งให้คนอื่นได้จริงในบริบท “${scenario}”`,
      choice:`${style.lead}: ประโยค 1 บอกสิ่งที่คุณจะทำ ประโยค 2 บอกเหตุผล ในบริบท “${scenario}”`,
      compare:`${style.lead}: ใช้ 2 ประโยคบอกสองรายละเอียดหรือสองมุมที่ต่างกันเกี่ยวกับ “${scenario}”`,
      situation:`${style.lead}: เขียนคำตอบ 2 ประโยคเหมือนคุณอยู่ในสถานการณ์ “${scenario}”`,
      followup:`${style.lead}: ประโยค 1 เปิดเรื่องด้วยรูปประโยคของบท และประโยค 2 ต่อยอดความหมายในบริบท “${scenario}”`
    };
    return {version:VERSION,day,style,focus,scenario,prompt:prompts[style.id],speakingTarget:target.en,speakingThai:target.th||'',signature:[style.id,focus,scenario,target.en].map(norm).join('|')};
  }

  function scopeDays(day){
    day=Number(day)||1;if(isStageExam(day)){const s=stageFor(day),out=[];for(let d=s[0];d<=s[1];d++)out.push(d);return out}if(isWeekly(day)){const out=[];for(let d=Math.max(1,day-6);d<=day;d++)out.push(d);return out}return[day];
  }
  function assessmentPool(day){
    const lessons=scopeDays(day).map(getLesson).filter(Boolean),vocab=uniq(lessons.flatMap(l=>(l.vocab||[]).filter(v=>v?.en&&v?.th).map(v=>({...v,lessonDay:l.day}))),v=>norm(v.en)),pairs=uniq(lessons.flatMap(l=>(l.examplePairs||[]).filter(p=>p?.en&&p?.th).map(p=>({...p,lessonDay:l.day}))),p=>norm(p.en));
    return{lessons,vocab,pairs};
  }
  function containsWord(sentence,word){const w=String(word||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return Boolean(w)&&new RegExp(`\\b${w}\\b`,'i').test(String(sentence||''))}
  function rawCandidates(day){
    const pool=assessmentPool(day),buckets=Object.fromEntries(MASTERY_TYPES.map(t=>[t,[]])),thaiWords=uniq(pool.vocab.map(v=>v.th).filter(Boolean),norm),englishWords=uniq(pool.vocab.map(v=>v.en).filter(Boolean),norm),thaiPairs=uniq(pool.pairs.map(p=>p.th).filter(Boolean),norm),englishPairs=uniq(pool.pairs.map(p=>p.en).filter(Boolean),norm);
    pool.vocab.forEach((v,i)=>buckets.wordMeaning.push({type:'wordMeaning',prompt:`“${v.en}” ในบทนี้หมายถึงอะไร?`,correctLabel:v.th,optionPool:thaiWords,answer:`${v.en} = ${v.th}`,seed:i}));
    pool.pairs.forEach((p,i)=>{
      buckets.thaiEnglish.push({type:'thaiEnglish',prompt:`เลือกประโยคอังกฤษที่ตรงกับ: ${p.th}`,correctLabel:p.en,optionPool:englishPairs,answer:p.en,seed:i});
      buckets.englishThai.push({type:'englishThai',prompt:`เลือกความหมายที่ตรงกับประโยค: ${p.en}`,correctLabel:p.th,optionPool:thaiPairs,answer:p.th,seed:i});
      buckets.listening.push({type:'listening',prompt:'ฟังประโยค แล้วเลือกความหมายที่ตรงที่สุด',audio:p.en,correctLabel:p.th,optionPool:thaiPairs,answer:`${p.en} · ${p.th}`,seed:i});
      const hit=pool.vocab.find(v=>containsWord(p.en,v.en));if(hit){const blank=p.en.replace(new RegExp(`\\b${String(hit.en).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'i'),'_____');buckets.gap.push({type:'gap',prompt:`เติมคำให้ประโยคสมบูรณ์: ${blank}`,correctLabel:hit.en,optionPool:englishWords,answer:`${hit.en} · ${p.en}`,seed:i});const decoys=englishPairs.filter(x=>!containsWord(x,hit.en));if(decoys.length>=3)buckets.sentenceTarget.push({type:'sentenceTarget',prompt:`เลือกประโยคที่ใช้คำเป้าหมาย “${hit.en}”`,correctLabel:p.en,optionPool:[p.en,...decoys],answer:p.en,seed:i})}
    });
    return buckets;
  }
  function materialize(item,day,index,attempt){
    const correct=String(item.correctLabel||'').trim(),pool=uniq((item.optionPool||[]).map(String).map(x=>x.trim()).filter(x=>x&&norm(x)!==norm(correct)),norm);if(!correct||pool.length<3)return null;const decoys=rotate(pool,day*7+attempt*11+index*5+Number(item.seed||0)).slice(0,3),pos=(day+attempt+index*2)%4,options=[];let di=0;for(let j=0;j<4;j++)options.push(j===pos?{label:correct,correct:true}:{label:decoys[di++],correct:false});return{...item,options,correctPosition:pos}
  }
  function buildMasteryItems(day,count=masteryCount(day),attempt=0){
    day=Math.max(1,Math.min(210,Number(day)||1));count=Math.max(1,Number(count)||5);attempt=Math.max(0,Number(attempt)||0);const buckets=rawCandidates(day),types=rotate(MASTERY_TYPES,day+attempt),usedAnswers=new Set(),usedPrompts=new Set(),out=[];let guard=0,cursors=Object.fromEntries(types.map(t=>[t,0]));
    while(out.length<count&&guard<count*30){const type=types[guard%types.length],arr=buckets[type]||[];if(arr.length){const start=(day*13+attempt*17+cursors[type]*7)%arr.length;for(let k=0;k<arr.length;k++){const item=arr[(start+k)%arr.length],a=norm(item.correctLabel),p=norm(item.prompt);if(!a||usedAnswers.has(a)||usedPrompts.has(p))continue;const ready=materialize(item,day,out.length,attempt);if(!ready)continue;usedAnswers.add(a);usedPrompts.add(p);out.push(ready);cursors[type]++;break}}guard++}
    if(out.length<count){const all=types.flatMap(t=>buckets[t]||[]);for(let k=0;k<all.length&&out.length<count;k++){const item=all[(k+day+attempt)%all.length],a=norm(item.correctLabel),p=norm(item.prompt);if(!a||usedAnswers.has(a)||usedPrompts.has(p))continue;const ready=materialize(item,day,out.length,attempt);if(!ready)continue;usedAnswers.add(a);usedPrompts.add(p);out.push(ready)}}
    return out;
  }

  function readRoot(){try{return JSON.parse(localStorage.getItem(STATE_KEY)||'{}')||{}}catch{return{}}}
  function writeLessonState(day,patch={},markProduction=false){
    const root=readRoot(),lv=level();root.instituteCourseV62=root.instituteCourseV62||{version:'v62',byLevel:{}};root.instituteCourseV62.byLevel=root.instituteCourseV62.byLevel||{};root.instituteCourseV62.byLevel[lv]=root.instituteCourseV62.byLevel[lv]||{lessons:{}};const lessons=root.instituteCourseV62.byLevel[lv].lessons=root.instituteCourseV62.byLevel[lv].lessons||{},prev=lessons[day]||{phases:[],masteryScore:0,attempts:0,speakingPassed:false},phases=uniq([...(prev.phases||[]),...(markProduction?['production']:[])]),next={...prev,...patch,phases,updatedAt:new Date().toISOString()};lessons[day]=next;localStorage.setItem(STATE_KEY,JSON.stringify(root));return next;
  }
  function stateFor(day){return window.getInstituteLessonStateV62?.(day)||(()=>{const root=readRoot(),lv=level();return root.instituteCourseV62?.byLevel?.[lv]?.lessons?.[day]||{phases:[],masteryScore:0,attempts:0,speakingPassed:false}})()}
  function refreshVisual(d,day){
    const s=stateFor(day),ph=new Set(s.phases||[]),order=['review','learn','guided','challenge','production','mastery'];d.querySelectorAll('[data-phase]').forEach((el,i)=>{const id=el.dataset.phase,prev=i===0||ph.has(order[i-1]);el.classList.toggle('done',ph.has(id));el.classList.toggle('locked',!prev&&!ph.has(id))});const count=d.querySelector('#v62PhaseCount');if(count)count.textContent=`${ph.size}/6 ช่วง`;const pass=d.querySelector('#v62Pass');if(pass){pass.disabled=!s.canComplete;if(s.canComplete){const title=d.querySelector('#v62FinishTitle'),sub=d.querySelector('#v62FinishSub');if(title)title.textContent='ผ่านเกณฑ์ Mastery แล้ว';if(sub)sub.textContent=`Mastery ${Number(s.masteryScore||0)}%${isSpeakingGate(day)?' · Speaking Gate ผ่านแล้ว':''}`}}}
  function englishEnough(text){return /[A-Za-z]/.test(String(text||''))&&norm(text).split(/\s+/).filter(Boolean).length>=1}
  function patchProduction(d,day){
    const box=d.querySelector('[data-phase="production"] .v62-phase-body');if(!box||box.dataset.v64==='1')return;box.dataset.v64='1';const l=getLesson(day)||{},v=lessonVariety(day),gate=isSpeakingGate(day,l),saved=stateFor(day),oldText=saved.v64WritingText||{},phase=d.querySelector('[data-phase="production"]'),h=phase?.querySelector('header h2'),sub=phase?.querySelector('header p');if(h)h.textContent=gate?'Production + Speaking Gate':'Production';if(sub)sub.textContent=`${v.style.name} · 2 ประโยค + ฝึกพูด`;
    box.innerHTML=`<div class="v64-production"><div class="v64-production-head"><b>${esc(v.style.name)}</b><span>เขียน 2 ประโยคเท่านั้น</span></div><p class="v62-instruction">${esc(v.prompt)}</p><label class="v64-sentence-label"><span>ประโยค 1</span><input class="v62-text-input" id="v64Sentence1" autocomplete="off" spellcheck="false" placeholder="Write sentence 1..." value="${esc(oldText.sentence1||'')}"></label><label class="v64-sentence-label"><span>ประโยค 2</span><input class="v62-text-input" id="v64Sentence2" autocomplete="off" spellcheck="false" placeholder="Write sentence 2..." value="${esc(oldText.sentence2||'')}"></label><button class="secondary-btn" id="v64SubmitWriting" type="button">ส่ง 2 ประโยค</button><div class="v62-inline-feedback" id="v64WritingFeedback">${saved.v64WritingPassed?'✓ เขียน 2 ประโยคผ่านแล้ว':''}</div><div class="v64-speak-card"><div><small>${gate?'Speaking Gate · ต้องผ่าน':'Speak Along · ฝึกทุกบท'}</small><b>${esc(v.speakingTarget)}</b><span>${esc(v.speakingThai)}</span></div><div class="v64-speak-actions"><button class="secondary-btn" id="v64Listen" type="button">🔊 ฟังต้นแบบ</button><button class="primary-btn" id="v64Speak" type="button">🎙 พูดตาม</button></div><div class="v62-transcript" id="v64Transcript">${saved.v64SpeakingTranscript?esc(saved.v64SpeakingTranscript):'ยังไม่ได้พูด'}</div><div class="v62-inline-feedback" id="v64SpeakFeedback">${saved.speakingPassed||saved.v64SpeakingPracticed?`✓ ฝึกพูดแล้ว${saved.v64SpeakingScore?` · ${Math.round(saved.v64SpeakingScore*100)}%`:''}`:''}</div><div id="v64SpeechFallback"></div></div></div>`;
    const s1=box.querySelector('#v64Sentence1'),s2=box.querySelector('#v64Sentence2'),wf=box.querySelector('#v64WritingFeedback'),sf=box.querySelector('#v64SpeakFeedback'),tr=box.querySelector('#v64Transcript');box.querySelector('#v64Listen').onclick=()=>say(v.speakingTarget);box.querySelector('#v64SubmitWriting').onclick=()=>{const a=String(s1.value||'').trim(),b=String(s2.value||'').trim();if(!englishEnough(a)||!englishEnough(b)){wf.textContent='เขียนภาษาอังกฤษให้ครบทั้ง 2 ช่องก่อน';return}const current=stateFor(day),canMark=!gate||Boolean(current.speakingPassed);writeLessonState(day,{v64WritingPassed:true,v64WritingText:{sentence1:a,sentence2:b}},canMark);wf.textContent=canMark?'✓ Production ผ่านแล้ว · 2 ประโยคครบ':'✓ เขียนครบ 2 ประโยคแล้ว · เหลือ Speaking Gate';refreshVisual(d,day)};
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(SR){box.querySelector('#v64Speak').onclick=()=>{const r=new SR();r.lang='en-US';r.interimResults=false;r.maxAlternatives=1;sf.textContent='กำลังฟัง…';r.onresult=e=>{const heard=e.results?.[0]?.[0]?.transcript||'',score=tokenDistance(heard,v.speakingTarget),pass=score>=speakingThreshold(day,l),current=stateFor(day),mark=gate?pass&&Boolean(current.v64WritingPassed):false;tr.textContent=heard||'ไม่พบคำพูด';if(pass){writeLessonState(day,{v64SpeakingPracticed:true,v64SpeakingTranscript:heard,v64SpeakingScore:Math.max(Number(current.v64SpeakingScore||0),score),...(gate?{speakingPassed:true}:{})},mark);sf.textContent=`✓ ${Math.round(score*100)}%${gate?' · Speaking Gate ผ่าน':' · ฝึกพูดผ่าน'}`;refreshVisual(d,day)}else{writeLessonState(day,{v64SpeakingPracticed:true,v64SpeakingTranscript:heard,v64SpeakingScore:Math.max(Number(current.v64SpeakingScore||0),score)},false);sf.textContent=`${Math.round(score*100)}% · ฟังต้นแบบแล้วลองพูดใหม่`}};r.onerror=()=>{sf.textContent='ไมโครโฟนหรือ Speech Recognition ใช้งานไม่ได้ ลองอนุญาตไมโครโฟน'};try{r.start()}catch{sf.textContent='เริ่มไมโครโฟนไม่ได้ กรุณาลองอีกครั้ง'}}}else{const speak=box.querySelector('#v64Speak');speak.disabled=true;const fb=box.querySelector('#v64SpeechFallback');if(gate){fb.innerHTML=`<p class="v62-coach-note">เบราว์เซอร์นี้ตรวจเสียงไม่ได้ ใช้การพิมพ์ประโยคเป็น fallback สำหรับ Speaking Gate</p><input class="v62-text-input" id="v64SpeakFallbackInput" autocomplete="off" spellcheck="false" placeholder="Type the sentence you practiced"><button class="secondary-btn" id="v64SpeakFallbackCheck" type="button">ตรวจ fallback</button>`;fb.querySelector('#v64SpeakFallbackCheck').onclick=()=>{const typed=fb.querySelector('#v64SpeakFallbackInput').value,score=tokenDistance(typed,v.speakingTarget),current=stateFor(day);if(score>=.90){const mark=Boolean(current.v64WritingPassed);writeLessonState(day,{speakingPassed:true,v64SpeakingPracticed:true,v64SpeakingScore:score},mark);sf.textContent='✓ Speaking Gate ผ่านด้วย fallback';refreshVisual(d,day)}else sf.textContent='ยังไม่ตรงกับประโยคต้นแบบ'}}else{fb.innerHTML='<p class="v62-coach-note">เบราว์เซอร์นี้ตรวจเสียงไม่ได้ แต่ยังกดฟังต้นแบบแล้วพูดตามได้ การฝึกพูดในบทนี้ไม่บังคับคะแนน</p>'}}
  }

  function patchMastery(d,day){
    const box=d.querySelector('[data-phase="mastery"] .v62-phase-body');if(!box)return;const headText=box.querySelector('.v62-assessment-head > div:last-child')?.textContent||'',attempt=Math.max(0,(Number(headText.match(/(\d+)/)?.[1])||1)-1);if(box.dataset.v64Attempt===String(attempt)&&box.querySelector('[data-v64-type]'))return;const groups=[...box.querySelectorAll('[data-v62-q]')],items=buildMasteryItems(day,groups.length,attempt);if(items.length<groups.length)return;box.dataset.v64Attempt=String(attempt);const phase=d.querySelector('[data-phase="mastery"]'),sub=phase?.querySelector('header p'),label=MASTERY_LABELS[(day+attempt)%MASTERY_LABELS.length];if(sub)sub.textContent=`${label} · ${groups.length} ข้อ · คำตอบไม่ซ้ำในชุด`;
    groups.forEach((g,i)=>{const item=items[i],p=g.querySelector('p'),buttons=[...g.querySelectorAll('[data-opt]')],correctId=g.dataset.correct;if(!p||buttons.length!==4||!correctId)return;g.dataset.v64Type=item.type;g.dataset.answer=item.answer||item.correctLabel;p.textContent='';if(item.audio){const audio=document.createElement('button');audio.type='button';audio.className='v62-mini-audio';audio.textContent='🔊 ฟังโจทย์';audio.onclick=()=>say(item.audio);p.appendChild(audio);p.appendChild(document.createTextNode(` ${item.prompt}`))}else p.textContent=item.prompt;buttons.forEach((btn,j)=>{const opt=item.options[j];btn.textContent=opt.label;btn.dataset.opt=opt.correct?correctId:`v64-${day}-${attempt}-${i}-${j}`;btn.disabled=false;btn.classList.remove('selected','correct','wrong')})})
  }
  function patchHeaders(d,day){const v=lessonVariety(day),map={review:REVIEW_LABELS[(day-1)%REVIEW_LABELS.length],learn:LEARN_LABELS[(day*2)%LEARN_LABELS.length],guided:GUIDED_LABELS[(day*3)%GUIDED_LABELS.length]};Object.entries(map).forEach(([id,label])=>{const p=d.querySelector(`[data-phase="${id}"] header p`);if(p)p.textContent=`${label} · ${v.focus}`})}
  function patchCard(){const card=document.querySelector?.('#dailyCourseCard');if(!card)return;const preview=card.querySelector('.lx55-preview');if(preview)preview.innerHTML='<b>Institute Track</b><span>1 Review</span><span>2 Learn</span><span>3 Guided Practice</span><span>4 Skill Challenge</span><span>5 เขียน 2 ประโยค + พูดตาม</span><span>6 Mixed Mastery</span>'}
  function dialogDay(d){const text=d?.querySelector?.('.v62-head small')?.textContent||'';return Number(text.match(/บทเรียน\s*(\d+)/)?.[1])||1}
  function patchOpenDialog(day){const d=document.querySelector?.('#instituteLessonV62');if(!d)return false;day=Number(day)||dialogDay(d);patchHeaders(d,day);patchProduction(d,day);patchMastery(d,day);refreshVisual(d,day);return true}

  const baseOpen=typeof window.openDailyLesson==='function'?window.openDailyLesson:null;if(baseOpen)window.openDailyLesson=day=>{const r=baseOpen(day);setTimeout(()=>patchOpenDialog(day),0);return r};
  if(typeof window.addEventListener==='function')window.addEventListener('click',e=>{const t=e.target instanceof Element?e.target:null;if(!t)return;if(t.closest?.('[data-v62-lesson],[data-choose-day],[data-skill-lesson],#dailyOpenLesson,#dailyComplete'))setTimeout(()=>patchOpenDialog(),0);if(t.closest?.('#v62RetryMastery'))setTimeout(()=>patchMastery(document.querySelector('#instituteLessonV62'),dialogDay(document.querySelector('#instituteLessonV62'))),0)},true);
  if(typeof document?.addEventListener==='function'){document.addEventListener('app:rendered',()=>{setTimeout(patchCard,0);setTimeout(()=>patchOpenDialog(),0)});document.addEventListener('daily-course:changed',()=>setTimeout(patchCard,0));}
  if(typeof setTimeout==='function'){setTimeout(patchCard,300);setTimeout(()=>patchOpenDialog(),350)}

  function audit(){const productionSignatures=new Set(),styles=new Set(),incompleteMastery=[],duplicateAnswers=[],badOptions=[],missingSpeech=[];let questions=0;for(let day=1;day<=210;day++){const v=lessonVariety(day);productionSignatures.add(v.signature);styles.add(v.style.id);if(!v.speakingTarget)missingSpeech.push(day);const count=masteryCount(day),items=buildMasteryItems(day,count,0);questions+=items.length;if(items.length!==count)incompleteMastery.push([day,items.length,count]);const answers=items.map(x=>norm(x.correctLabel));if(new Set(answers).size!==answers.length)duplicateAnswers.push(day);items.forEach((x,i)=>{if(x.options?.length!==4||x.options.filter(o=>o.correct).length!==1||x.options.some(o=>!String(o.label||'').trim()))badOptions.push([day,i,x.type])})}return{version:VERSION,totalLessons:210,productionSentences:2,speakingEveryLesson:missingSpeech.length===0,productionStylesUsed:styles.size,distinctProductionSignatures:productionSignatures.size,masteryQuestions:questions,incompleteMastery,duplicateAnswers,badOptions,missingSpeech,ok:productionSignatures.size===210&&styles.size===PRODUCTION_STYLES.length&&!incompleteMastery.length&&!duplicateAnswers.length&&!badOptions.length&&!missingSpeech.length}}
  window.getLessonVarietyV64=lessonVariety;window.buildMasteryItemsV64=buildMasteryItems;window.auditLessonVarietyV64=audit;window.LESSON_VARIETY_VERSION=VERSION;window.LESSON_VARIETY_V64_META={version:VERSION,productionSentences:2,productionStyles:PRODUCTION_STYLES.length,masteryTypes:MASTERY_TYPES.length,speakingEveryLesson:true};
})();
