(()=>{
  const SOURCE='https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt';
  const CACHE_KEY='myEnglishCore3000CardsV2';
  const LIST_KEY='myEnglishCore3000ListV1';
  const TARGET=3000;
  const junk=new Set(`pm c e s x n b t d m r p f l w o g h v k y j u q z jan info de cd uk usa non york canada gay la yahoo dec pc san ca texas oct poker fax china london washington rss id california faq sep et mar france pro microsoft st url aug apr html en linux jul jun sony google japan ny eur usr dc mon com robert sat british pre george fri ms virginia asian cnet ltd los hp inc thomas eg chicago tue smith mexico pa paypal nokia tel carolina tx william peter ma amazon est mac iii gmt xml programme bin md fl mb mr java multi richard ed php az paris ohio un pst mi tom dr kb pp vegas chris lee os charles illinois dvds nc scott llc canon po va ibm rd johnson sc ga ac ft joe im vs pennsylvania ipod ar motorola mo sa xp oregon kong sitemap houston lab cvs gamma eu ontario des minnesota williams cc jesus lcd wa jackson ave dj russia seattle cm wi ct harry au fi steve ford zealand scotland dallas con ups tripadvisor frank alaska nt es gb bc pr fr aa kelly austin toronto andrew mt joseph philadelphia beta brian lingerie miami tennessee wales davis daniel oz usd mg brazil oklahoma dell intel les ann ski ch sd austria singapore rs phoenix cisco disney adobe bbc alabama avg panasonic miller kentucky eric taylor hiv pda dsl zum dna orlando tim maine sql sydney ss ap louisiana javascript nm advisor mn nd wilson irish gps op acc euro tn stephen elizabeth playstation gnu jeff aol ce sweden mississippi connecticut kevin jordan perl lib ab anderson utc der nevada thailand matt iran costa belgium holy dean denver unix ericsson hampshire bluetooth`.split(/\s+/));
  const noisy=new Set(`page site search web online click services service products product copyright website pages download downloads homepage listings forums rss faq login password webmaster sitemap permalink trackback sponsored advertisement advertising ads classifieds checkout wholesale marketplace publisher publications subscribe newsletter newsletters archive archives register registration user users profile profiles browser server servers printer printers software hardware html php xml java javascript sql pdf dvd dvds vhs lcd usb ipod xbox playstation nokia motorola samsung cisco ebay yahoo paypal tripadvisor amazon google microsoft sony panasonic dell ibm`.split(/\s+/));

  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const cefr=i=>i<750?'A1':i<1500?'A2':i<2250?'B1':'B2';
  const plan=()=>{state.core3000Plan=state.core3000Plan||{daily:12,daysPerWeek:6,mastered:0,startedAt:new Date().toISOString(),sourceReady:false};return state.core3000Plan};
  const hasThai=v=>/[ก-๙]/.test(String(v||''));
  const validCard=c=>c&&hasThai(c.thai)&&String(c.example||'').trim().length>=5&&hasThai(c.exampleThai)&&!/ดูความหมายจากตัวอย่าง|ฝึกใช้กับ AI|I use the word/i.test(`${c.thai} ${c.example} ${c.exampleThai}`);
  const cardCache=()=>{try{const raw=JSON.parse(localStorage.getItem(CACHE_KEY)||'{}');const clean={};Object.entries(raw||{}).forEach(([k,v])=>{if(validCard(v))clean[k]=v});return clean}catch{return{}}};
  const saveCards=v=>{try{localStorage.setItem(CACHE_KEY,JSON.stringify(v))}catch{}};

  async function loadList(){
    try{const stored=JSON.parse(localStorage.getItem(LIST_KEY)||'null');if(Array.isArray(stored)&&stored.length===TARGET)return stored}catch{}
    const response=await fetch(SOURCE,{cache:'force-cache'});
    if(!response.ok)throw new Error('word_source_unavailable');
    const raw=await response.text();
    const seen=new Set(),out=[];
    for(const item of raw.split(/\r?\n/)){
      const w=item.trim().toLowerCase();
      if(!/^[a-z]{2,}$/.test(w)||junk.has(w)||noisy.has(w)||seen.has(w))continue;
      if(/^(casino|gambling|lingerie|naked|sexual|poker|babes)$/.test(w))continue;
      seen.add(w);out.push(w);if(out.length===TARGET)break;
    }
    if(out.length<TARGET)throw new Error('not_enough_words');
    try{localStorage.setItem(LIST_KEY,JSON.stringify(out))}catch{}
    const p=plan();p.sourceReady=true;saveState();return out;
  }

  async function enrich(words){
    const cache=cardCache();
    const missing=words.filter(w=>!validCard(cache[w]));
    if(missing.length){
      const response=await fetch('/api/ai',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'vocab_batch',words:missing})});
      const data=await response.json().catch(()=>null);
      if(!response.ok||!Array.isArray(data?.cards))throw new Error('vocab_ai_unavailable');
      data.cards.forEach(c=>{if(c?.word&&validCard(c))cache[c.word]=c});
      saveCards(cache);
    }
    const cards=words.map(w=>cache[w]);
    if(cards.some(c=>!validCard(c)))throw new Error('vocab_cards_incomplete');
    return cards;
  }

  function modal(body){
    document.querySelector('#core3000StudyModal')?.remove();
    const wrap=document.createElement('div');wrap.id='core3000StudyModal';wrap.className='game-lab-overlay';
    wrap.innerHTML=`<section class="game-panel core-study-panel"><div class="game-panel-head"><h2>📚 Core 3000 · ชุดวันนี้</h2><button class="game-close" type="button">×</button></div><div id="coreStudyBody">${body}</div></section>`;
    document.body.appendChild(wrap);wrap.querySelector('.game-close').onclick=()=>wrap.remove();return wrap;
  }

  async function openStudy(){
    const root=modal(`<div class="core-study-loading"><div class="listen-orb">Aa</div><h3>กำลังเตรียม ${plan().daily} คำของวันนี้...</h3><p>ทุกคำต้องมีความหมายภาษาไทยจริง เสียงอ่าน ประโยคตัวอย่าง และคำแปลไทยก่อนจะแสดง</p></div>`);
    try{
      const list=await loadList(),p=plan();
      const start=Math.min(Number(p.mastered)||0,TARGET-1),daily=Math.max(1,Math.min(20,Number(p.daily)||12));
      const today=list.slice(start,Math.min(TARGET,start+daily));
      const cards=await enrich(today);runSession(root,cards,start);
    }catch(err){
      root.querySelector('#coreStudyBody').innerHTML=`<div class="core-study-error"><h3>ยังเตรียมคำแปลให้ครบไม่ได้</h3><p>ระบบจะไม่ใช้ข้อความเดาหรือ placeholder แทนความหมายจริง กรุณากดลองใหม่ ระบบจะขอเฉพาะคำที่ยังขาดจาก Groq Free</p><button class="primary-btn" id="coreRetry">ลองใหม่</button></div>`;
      root.querySelector('#coreRetry').onclick=()=>openStudy();
    }
  }

  function runSession(root,cards,start){
    let idx=0;const passed=new Set(),repeats={},exampleRepeats={},understood=new Set();
    const draw=()=>{
      if(idx>=cards.length){if(passed.size===cards.length)return finish();idx=cards.findIndex(c=>!passed.has(c.word))}
      const c=cards[idx],rank=start+idx,rep=repeats[c.word]||0,exampleRep=exampleRepeats[c.word]||0,knows=understood.has(c.word),ready=rep>=3&&exampleRep>=2&&knows;
      root.querySelector('#coreStudyBody').innerHTML=`<div class="core-word-card">
        <div class="core-word-meta"><span>${cefr(rank)}</span><span>คำ ${rank+1}/${TARGET}</span><span>${idx+1}/${cards.length} วันนี้</span>${c.part?`<span>${esc(c.part)}</span>`:''}</div>
        <div class="core-word-main">${esc(c.word)}</div>
        <div class="core-meaning-box"><span class="core-section-label">🇹🇭 ความหมายภาษาไทย</span><div class="core-word-thai">${esc(c.thai)}</div><button class="core-understand-btn ${knows?'done':''}" id="coreUnderstand">${knows?'✓ เข้าใจความหมายแล้ว':'ฉันเข้าใจความหมายนี้'}</button></div>
        <button class="core-listen-btn" id="coreListen">🔊 ฟังคำและพูดตาม <b>${rep}/3</b></button>
        <div class="core-example"><span class="core-section-label">💬 ตัวอย่างประโยค</span><b>${esc(c.example)}</b><span class="core-example-thai">🇹🇭 ${esc(c.exampleThai)}</span><button class="core-listen-btn" id="coreExampleListen">🔊 ฟังประโยคและพูดตาม <b>${exampleRep}/2</b></button></div>
        <div class="core-repeat-track"><i style="width:${Math.min(100,rep/3*100)}%"></i></div>
        <div class="core-repeat-track"><i style="width:${Math.min(100,exampleRep/2*100)}%"></i></div>
        <p class="core-instruction">ผ่านได้เมื่อเข้าใจความหมาย ฟัง/พูดตามคำครบ 3 รอบ และอ่านประโยคตัวอย่างตามครบ 2 รอบ</p>
        <div class="lab-actions"><button class="lab-secondary" id="coreAgain">ยังไม่จำ</button><button class="lab-primary" id="corePass" ${ready?'':'disabled'}>ผ่านคำนี้ ✓</button></div></div>`;
      root.querySelector('#coreUnderstand').onclick=()=>{understood.add(c.word);draw()};
      root.querySelector('#coreListen').onclick=()=>{if(typeof speak==='function')speak(c.word);else{const u=new SpeechSynthesisUtterance(c.word);u.lang='en-US';speechSynthesis.speak(u)}repeats[c.word]=Math.min(3,(repeats[c.word]||0)+1);draw()};
      root.querySelector('#coreExampleListen').onclick=()=>{if(typeof speak==='function')speak(c.example);else{const u=new SpeechSynthesisUtterance(c.example);u.lang='en-US';speechSynthesis.speak(u)}exampleRepeats[c.word]=Math.min(2,(exampleRepeats[c.word]||0)+1);draw()};
      root.querySelector('#corePass').onclick=()=>{if((repeats[c.word]||0)<3||(exampleRepeats[c.word]||0)<2||!understood.has(c.word))return;passed.add(c.word);if(!state.known.includes(c.word))state.known.push(c.word);state.weak=state.weak.filter(w=>w!==c.word);saveState();idx++;draw()};
      root.querySelector('#coreAgain').onclick=()=>{if(!state.weak.includes(c.word))state.weak.push(c.word);saveState();idx=(idx+1)%cards.length;draw()};
    };
    const finish=()=>{const p=plan();p.mastered=Math.min(TARGET,(Number(p.mastered)||0)+cards.length);p.lastCompletedAt=new Date().toISOString();saveState();root.querySelector('#coreStudyBody').innerHTML=`<div class="core-study-finish"><div class="core-finish-icon">🏆</div><h2>ผ่านชุดวันนี้แล้ว</h2><p>คุณผ่าน ${cards.length} คำ · รวม ${p.mastered}/${TARGET} คำ</p><div class="core-finish-routine">พรุ่งนี้ระบบจะเลือกชุดถัดไป และคำเก่าจะกลับมาในรอบทบทวน 1 · 3 · 7 · 14 · 30 วัน</div><button class="primary-btn" id="coreDone">กลับหน้าแรก</button></div>`;root.querySelector('#coreDone').onclick=()=>{root.remove();go('home')}};
    draw();
  }
  window.openCore3000Study=openStudy;
})();