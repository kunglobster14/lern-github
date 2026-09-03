(()=>{
  const TARGET=3000,DATASET_VERSION='oxford3000-v43';
  const esc=v=>typeof window.oxfordEsc==='function'?window.oxfordEsc(v):String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const say=v=>typeof window.oxfordSpeak==='function'?window.oxfordSpeak(v):(()=>{try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(v||''));u.lang='en-US';u.rate=.86;speechSynthesis.speak(u)}catch{}})();
  const reading=v=>typeof window.oxfordThaiReading==='function'?window.oxfordThaiReading(v):String(v||'');
  const shuffle=a=>typeof window.oxfordShuffle==='function'?window.oxfordShuffle(a):[...a].sort(()=>Math.random()-.5);
  const plan=()=>{state.core3000Plan=state.core3000Plan||{daily:12,daysPerWeek:6,mastered:0,startedAt:new Date().toISOString()};return state.core3000Plan};
  const dayKey=()=>new Date().toISOString().slice(0,10);
  function migrate(p,list){
    if(p.datasetVersion===DATASET_VERSION&&Array.isArray(p.masteredWords))return;
    const allowed=new Set(list.map(e=>e.word));
    p.masteredWords=[...new Set((state.known||[]).filter(w=>allowed.has(w)))];
    p.mastered=p.masteredWords.length;p.datasetVersion=DATASET_VERSION;p.todayDate='';p.todayWords=[];saveState();
  }
  function chooseToday(list,p,daily){
    const mastered=new Set(p.masteredWords||[]),byWord=new Map(list.map(e=>[e.word,e]));
    if(p.todayDate===dayKey()&&Array.isArray(p.todayWords)&&p.todayWords.length){
      const saved=p.todayWords.map(w=>byWord.get(w)).filter(e=>e&&!mastered.has(e.word));
      if(saved.length)return saved.slice(0,daily);
    }
    const remaining=list.filter(e=>!mastered.has(e.word));
    const chosen=shuffle(remaining).slice(0,daily);p.todayDate=dayKey();p.todayWords=chosen.map(e=>e.word);saveState();return chosen;
  }
  function modal(body){
    document.querySelector('#core3000StudyModal')?.remove();
    const wrap=document.createElement('div');wrap.id='core3000StudyModal';wrap.className='game-lab-overlay';
    wrap.innerHTML=`<section class="game-panel core-study-panel"><div class="game-panel-head"><h2>📚 Oxford 3000 · ชุดสุ่มวันนี้</h2><button class="game-close" type="button">×</button></div><div id="coreStudyBody">${body}</div></section>`;
    document.body.appendChild(wrap);wrap.querySelector('.game-close').onclick=()=>wrap.remove();return wrap;
  }
  async function openStudy(){
    const root=modal(`<div class="core-study-loading"><div class="listen-orb">Aa</div><h3>กำลังสุ่ม ${plan().daily} คำจาก Oxford 3000...</h3><p>คำที่ผ่านแล้วจะไม่ถูกสุ่มเป็นคำใหม่ซ้ำ</p></div>`);
    try{
      if(typeof window.ensureOxford3000==='function')await window.ensureOxford3000();
      const list=typeof window.getOxford3000==='function'?window.getOxford3000():[];if(list.length<TARGET)throw new Error(`oxford_not_ready_${list.length}`);
      const p=plan();migrate(p,list);const daily=Math.max(1,Math.min(20,Number(p.daily)||12));
      if((p.masteredWords||[]).length>=TARGET){root.querySelector('#coreStudyBody').innerHTML=`<div class="core-study-finish"><div class="core-finish-icon">🏆</div><h2>Oxford 3000 ครบแล้ว</h2><p>คุณผ่านคำศัพท์ครบ 3,000 คำแล้ว</p><button class="primary-btn" id="coreDone">ปิด</button></div>`;root.querySelector('#coreDone').onclick=()=>root.remove();return}
      const cards=chooseToday(list,p,daily);if(!cards.length)throw new Error('no_words_available');runSession(root,cards);
    }catch(err){root.querySelector('#coreStudyBody').innerHTML=`<div class="core-study-error"><h3>เปิดชุดคำศัพท์ไม่ได้</h3><p>Oxford 3000 ยังโหลดไม่ครบ กรุณารีเฟรชหน้าแล้วลองใหม่</p><small>${esc(err?.message||'unknown')}</small><br><br><button class="primary-btn" id="coreRetry">ลองใหม่</button></div>`;root.querySelector('#coreRetry').onclick=()=>openStudy()}
  }
  function runSession(root,cards){
    let idx=0;const passed=new Set(),repeats={},exampleRepeats={},understood=new Set();
    const draw=()=>{
      if(idx>=cards.length){if(passed.size===cards.length)return finish();idx=cards.findIndex(c=>!passed.has(c.word))}
      const c=cards[idx],rep=repeats[c.word]||0,exampleRep=exampleRepeats[c.word]||0,knows=understood.has(c.word),ready=rep>=3&&exampleRep>=2&&knows;
      root.querySelector('#coreStudyBody').innerHTML=`<div class="core-word-card"><div class="core-word-meta"><span>${esc(c.level||'')}</span><span>คำ #${Number(c.id)||'-'}/${TARGET}</span><span>${idx+1}/${cards.length} วันนี้</span>${c.part?`<span>${esc(c.part)}</span>`:''}</div><div class="core-word-main">${esc(c.word)}</div><div style="text-align:center;color:#94a3b8;margin-top:-4px;margin-bottom:12px">คำอ่าน: ${esc(reading(c.word))}</div><div class="core-meaning-box"><span class="core-section-label">🇹🇭 ความหมายภาษาไทย</span><div class="core-word-thai">${esc(c.thai||'-')}</div><button class="core-understand-btn ${knows?'done':''}" id="coreUnderstand">${knows?'✓ เข้าใจความหมายแล้ว':'ฉันเข้าใจความหมายนี้'}</button></div><button class="core-listen-btn" id="coreListen">🔊 ฟังคำและพูดตาม <b>${rep}/3</b></button><div class="core-example"><span class="core-section-label">💬 ตัวอย่างประโยค</span><b>${esc(c.example||c.word)}</b>${c.exampleThai?`<span class="core-example-thai">🇹🇭 ${esc(c.exampleThai)}</span>`:''}<button class="core-listen-btn" id="coreExampleListen">🔊 ฟังประโยคและพูดตาม <b>${exampleRep}/2</b></button></div><div class="core-repeat-track"><i style="width:${Math.min(100,rep/3*100)}%"></i></div><div class="core-repeat-track"><i style="width:${Math.min(100,exampleRep/2*100)}%"></i></div><p class="core-instruction">ผ่านได้เมื่อเข้าใจความหมาย ฟัง/พูดตามคำครบ 3 รอบ และอ่านประโยคตัวอย่างตามครบ 2 รอบ</p><div class="lab-actions"><button class="lab-secondary" id="coreAgain">ยังไม่จำ</button><button class="lab-primary" id="corePass" ${ready?'':'disabled'}>ผ่านคำนี้ ✓</button></div></div>`;
      root.querySelector('#coreUnderstand').onclick=()=>{understood.add(c.word);draw()};
      root.querySelector('#coreListen').onclick=()=>{say(c.word);repeats[c.word]=Math.min(3,rep+1);draw()};
      root.querySelector('#coreExampleListen').onclick=()=>{say(c.example||c.word);exampleRepeats[c.word]=Math.min(2,exampleRep+1);draw()};
      root.querySelector('#corePass').onclick=()=>{if(!ready)return;passed.add(c.word);if(!state.known.includes(c.word))state.known.push(c.word);state.weak=state.weak.filter(w=>w!==c.word);saveState();idx++;draw()};
      root.querySelector('#coreAgain').onclick=()=>{if(!state.weak.includes(c.word))state.weak.push(c.word);saveState();idx=(idx+1)%cards.length;draw()};
    };
    const finish=()=>{const p=plan();const set=new Set(p.masteredWords||[]);cards.forEach(c=>set.add(c.word));p.masteredWords=[...set];p.mastered=Math.min(TARGET,set.size);p.lastCompletedAt=new Date().toISOString();p.todayWords=[];saveState();root.querySelector('#coreStudyBody').innerHTML=`<div class="core-study-finish"><div class="core-finish-icon">🏆</div><h2>ผ่านชุดสุ่มวันนี้แล้ว</h2><p>ผ่าน ${cards.length} คำ · รวม ${p.mastered}/${TARGET} คำ</p><div class="core-finish-routine">ครั้งต่อไปจะสุ่มจากคำที่ยังไม่ผ่าน และคำเก่ายังใช้ในบททบทวนได้</div><button class="primary-btn" id="coreDone">กลับหน้าแรก</button></div>`;root.querySelector('#coreDone').onclick=()=>{root.remove();go('home')}};draw();
  }
  window.openCore3000Study=openStudy;
})();
