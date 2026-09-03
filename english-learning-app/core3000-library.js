(()=>{
  const SOURCE='https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt';
  const LIST_KEY='myEnglishCore3000ListV1';
  const CACHE_KEY='myEnglishCore3000CardsV2';
  const TARGET=3000;
  const PAGE_SIZE=60;
  const junk=new Set(`pm c e s x n b t d m r p f l w o g h v k y j u q z jan info de cd uk usa non york canada gay la yahoo dec pc san ca texas oct poker fax china london washington rss id california faq sep et mar france pro microsoft st url aug apr html en linux jul jun sony google japan ny eur usr dc mon com robert sat british pre george fri ms virginia asian cnet ltd los hp inc thomas eg chicago tue smith mexico pa paypal nokia tel carolina tx william peter ma amazon est mac iii gmt xml programme bin md fl mb mr java multi richard ed php az paris ohio un pst mi tom dr kb pp vegas chris lee os charles illinois dvds nc scott llc canon po va ibm rd johnson sc ga ac ft joe im vs pennsylvania ipod ar motorola mo sa xp oregon kong sitemap houston lab cvs gamma eu ontario des minnesota williams cc jesus lcd wa jackson ave dj russia seattle cm wi ct harry au fi steve ford zealand scotland dallas con ups tripadvisor frank alaska nt es gb bc pr fr aa kelly austin toronto andrew mt joseph philadelphia beta brian lingerie miami tennessee wales davis daniel oz usd mg brazil oklahoma dell intel les ann ski ch sd austria singapore rs phoenix cisco disney adobe bbc alabama avg panasonic miller kentucky eric taylor hiv pda dsl zum dna orlando tim maine sql sydney ss ap louisiana javascript nm advisor mn nd wilson irish gps op acc euro tn stephen elizabeth playstation gnu jeff aol ce sweden mississippi connecticut kevin jordan perl lib ab anderson utc der nevada thailand matt iran costa belgium holy dean denver unix ericsson hampshire bluetooth`.split(/\s+/));
  const noisy=new Set(`page site search web online click services service products product copyright website pages download downloads homepage listings forums rss faq login password webmaster sitemap permalink trackback sponsored advertisement advertising ads classifieds checkout wholesale marketplace publisher publications subscribe newsletter newsletters archive archives register registration user users profile profiles browser server servers printer printers software hardware html php xml java javascript sql pdf dvd dvds vhs lcd usb ipod xbox playstation nokia motorola samsung cisco ebay yahoo paypal tripadvisor amazon google microsoft sony panasonic dell ibm`.split(/\s+/));
  const special={
    the:'เดอะ',of:'ออฟ',and:'แอนด์',to:'ทู',a:'อะ',in:'อิน',for:'ฟอร์',is:'อิซ',on:'ออน',that:'แดต',by:'บาย',this:'ดิส',with:'วิธ',i:'ไอ',you:'ยู',it:'อิท',not:'น็อต',or:'ออร์',be:'บี',are:'อาร์',from:'ฟรอม',at:'แอท',as:'แอซ',your:'ยัวร์',all:'ออล',have:'แฮฟ',new:'นิว',more:'มอร์',an:'แอน',was:'วอซ',we:'วี',will:'วิล',home:'โฮม',can:'แคน',us:'อัส',about:'อะเบาท์',if:'อิฟ',my:'มาย',has:'แฮซ',but:'บัท',our:'อาวร์',one:'วัน',other:'อัธเธอร์',do:'ดู',no:'โน',information:'อินฟอร์เมชัน',time:'ไทม์',they:'เดย์',he:'ฮี',up:'อัพ',may:'เมย์',what:'ว็อท',which:'วิช',their:'แดร์',out:'เอาท์',use:'ยูซ',any:'เอนี',there:'แดร์',see:'ซี',only:'โอนลี',so:'โซ',his:'ฮิซ',when:'เว็น',here:'เฮียร์',who:'ฮู',also:'ออลโซ',now:'นาว',help:'เฮลป์',get:'เก็ต',go:'โก',make:'เมค',like:'ไลก์',work:'เวิร์ก',people:'พีเพิล',good:'กูด',know:'โน',think:'ธิงก์',take:'เทค',come:'คัม',want:'วอนท์',look:'ลุค',first:'เฟิร์สต์',day:'เดย์',way:'เวย์',find:'ไฟนด์',give:'กิฟ',many:'เมนี',well:'เวล',back:'แบ็ก',very:'เวรี',after:'แอฟเทอร์',even:'อีเวิน',because:'บีคอส',these:'ดีซ',most:'โมสต์',where:'แวร์',much:'มัช',before:'บีฟอร์',right:'ไรต์',too:'ทู',mean:'มีน',old:'โอลด์',same:'เซม',tell:'เทล',boy:'บอย',girl:'เกิร์ล',man:'แมน',woman:'วูแมน',water:'วอเทอร์',food:'ฟูด',book:'บุ๊ก',phone:'โฟน',school:'สกูล',friend:'เฟรนด์',family:'แฟมิลี',name:'เนม',hello:'เฮลโล',please:'พลีซ',thank:'แธงก์',thanks:'แธงก์ส',sorry:'ซอรี',yes:'เยส'
  };
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function approxThai(word){
    const w=String(word||'').toLowerCase();
    if(special[w])return special[w];
    let s=w;
    const rules=[
      [/tion$/g,'ชัน'],[/sion$/g,'ชัน'],[/ture$/g,'เชอร์'],[/ough$/g,'อัฟ'],[/eigh/g,'เอ'],[/igh/g,'ไอ'],[/ph/g,'ฟ'],[/sh/g,'ช'],[/ch/g,'ช'],[/th/g,'ธ'],[/wh/g,'ว'],[/ck/g,'ค'],[/ng/g,'ง'],[/qu/g,'คว'],[/ee/g,'อี'],[/ea/g,'อี'],[/oo/g,'อู'],[/ai/g,'เอ'],[/ay/g,'เอ'],[/oa/g,'โอ'],[/ow/g,'เอา'],[/ou/g,'เอา'],[/oi/g,'ออย'],[/oy/g,'ออย'],[/ar/g,'อาร์'],[/er/g,'เออร์'],[/ir/g,'เออร์'],[/ur/g,'เออร์'],[/or/g,'ออร์']
    ];
    for(const [a,b] of rules)s=s.replace(a,b);
    const map={a:'แอ',b:'บ',c:'ค',d:'ด',e:'เอ',f:'ฟ',g:'ก',h:'ฮ',i:'อิ',j:'จ',k:'ค',l:'ล',m:'ม',n:'น',o:'ออ',p:'พ',q:'ค',r:'ร',s:'ส',t:'ท',u:'อั',v:'ว',w:'ว',x:'กซ',y:'ย',z:'ซ'};
    s=s.replace(/[a-z]/g,ch=>map[ch]||ch).replace(/เอ$/,'').replace(/([ก-ฮ])\1+/g,'$1');
    return s||w;
  }

  function getCardCache(){try{return JSON.parse(localStorage.getItem(CACHE_KEY)||'{}')||{}}catch{return{}}}
  async function loadList(){
    try{const stored=JSON.parse(localStorage.getItem(LIST_KEY)||'null');if(Array.isArray(stored)&&stored.length===TARGET)return stored}catch{}
    const r=await fetch(SOURCE,{cache:'force-cache'});if(!r.ok)throw new Error('word_source_unavailable');
    const raw=await r.text(),seen=new Set(),out=[];
    for(const item of raw.split(/\r?\n/)){
      const w=item.trim().toLowerCase();
      if(!/^[a-z]{2,}$/.test(w)||junk.has(w)||noisy.has(w)||seen.has(w))continue;
      if(/^(casino|gambling|lingerie|naked|sexual|poker|babes)$/.test(w))continue;
      seen.add(w);out.push(w);if(out.length===TARGET)break;
    }
    if(out.length<TARGET)throw new Error('not_enough_words');
    try{localStorage.setItem(LIST_KEY,JSON.stringify(out))}catch{}
    return out;
  }

  function say(word){
    try{
      if(typeof speak==='function'){speak(word);return}
      speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(word);u.lang='en-US';u.rate=.86;speechSynthesis.speak(u);
    }catch{}
  }

  function modal(){
    document.querySelector('#core3000Library')?.remove();
    const wrap=document.createElement('div');wrap.id='core3000Library';wrap.className='game-lab-overlay core-library-overlay';
    wrap.innerHTML=`<section class="game-panel core-library-panel"><div class="game-panel-head"><div><h2>📖 คลังคำศัพท์ Core 3000</h2><small>ค้นหาและเปิดดูได้ครบ 3,000 คำ · เสียงอ่านใช้เสียงภาษาอังกฤษจากอุปกรณ์</small></div><button class="game-close" type="button">×</button></div><div id="coreLibraryBody"><div class="core-study-loading"><div class="listen-orb">Aa</div><h3>กำลังโหลดคลัง 3,000 คำ...</h3></div></div></section>`;
    document.body.appendChild(wrap);wrap.querySelector('.game-close').onclick=()=>wrap.remove();
    wrap.addEventListener('click',e=>{if(e.target===wrap)wrap.remove()});return wrap;
  }

  async function openLibrary(){
    const root=modal();
    try{
      const words=await loadList();let page=0,query='';
      const draw=()=>{
        const cache=getCardCache();
        const filtered=query?words.filter(w=>w.includes(query)):words;
        const pages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));page=Math.min(page,pages-1);
        const start=page*PAGE_SIZE,items=filtered.slice(start,start+PAGE_SIZE);
        root.querySelector('#coreLibraryBody').innerHTML=`<div class="core-library-tools"><input id="coreLibrarySearch" value="${esc(query)}" placeholder="ค้นหาคำศัพท์ เช่น work, travel" autocomplete="off"><span>${filtered.length.toLocaleString()} คำ</span></div><div class="core-library-note">คำอ่านไทยเป็นคำอ่านโดยประมาณเพื่อช่วยเริ่มต้น ควรกด 🔊 เพื่อฟังเสียงจริงทุกครั้ง</div><div class="core-library-list">${items.map(w=>{const rank=words.indexOf(w)+1,c=cache[w]||{};return `<div class="core-library-row"><span class="core-library-rank">${rank}</span><div class="core-library-word"><b>${esc(w)}</b><small>คำอ่าน: ${esc(approxThai(w))}${c.thai?` · ${esc(c.thai)}`:''}</small></div><button type="button" class="core-library-say" data-say="${esc(w)}" aria-label="ฟัง ${esc(w)}">🔊 ฟัง</button></div>`}).join('')}</div><div class="core-library-pager"><button id="coreLibPrev" ${page===0?'disabled':''}>← ก่อนหน้า</button><span>หน้า ${page+1}/${pages}</span><button id="coreLibNext" ${page>=pages-1?'disabled':''}>ถัดไป →</button></div>`;
        const search=root.querySelector('#coreLibrarySearch');
        search.oninput=()=>{query=search.value.trim().toLowerCase();page=0;draw();setTimeout(()=>root.querySelector('#coreLibrarySearch')?.focus(),0)};
        root.querySelectorAll('[data-say]').forEach(btn=>btn.onclick=()=>say(btn.dataset.say));
        root.querySelector('#coreLibPrev').onclick=()=>{if(page>0){page--;draw();root.querySelector('.core-library-panel')?.scrollTo({top:0,behavior:'smooth'})}};
        root.querySelector('#coreLibNext').onclick=()=>{if(page<pages-1){page++;draw();root.querySelector('.core-library-panel')?.scrollTo({top:0,behavior:'smooth'})}};
      };
      draw();
    }catch{
      root.querySelector('#coreLibraryBody').innerHTML=`<div class="core-study-error"><h3>โหลดคลังคำศัพท์ไม่ได้</h3><p>กรุณาตรวจอินเทอร์เน็ตแล้วลองใหม่</p><button class="primary-btn" id="coreLibraryRetry">ลองใหม่</button></div>`;
      root.querySelector('#coreLibraryRetry').onclick=()=>openLibrary();
    }
  }

  window.openCore3000Library=openLibrary;
})();