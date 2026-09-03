(()=>{
  const TARGET=3000,PAGE_SIZE=50;
  const esc=v=>typeof window.oxfordEsc==='function'?window.oxfordEsc(v):String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const say=w=>typeof window.oxfordSpeak==='function'?window.oxfordSpeak(w):(()=>{try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(w||''));u.lang='en-US';u.rate=.86;speechSynthesis.speak(u)}catch{}})();
  const reading=w=>typeof window.oxfordThaiReading==='function'?window.oxfordThaiReading(w):String(w||'');
  function modal(){
    document.querySelector('#core3000LibraryModal')?.remove();
    const wrap=document.createElement('div');wrap.id='core3000LibraryModal';wrap.className='game-lab-overlay core-library-overlay';
    wrap.innerHTML=`<section class="game-panel core-library-panel"><div class="game-panel-head"><div><h2>📖 Oxford 3000</h2><small>คำศัพท์ 3,000 คำ · คำอ่าน · คำแปล · CEFR A1–B2 · กด 🔊 เพื่อฟังเสียง</small></div><button class="game-close" type="button" aria-label="ปิด">×</button></div><div id="coreLibraryBody"><div class="core-study-loading"><div class="listen-orb">Aa</div><h3>กำลังเปิด Oxford 3000...</h3><p>เตรียมข้อมูลคำศัพท์จากชุดหลักของแอป</p></div></div></section>`;
    document.body.appendChild(wrap);wrap.querySelector('.game-close').onclick=()=>wrap.remove();
    wrap.addEventListener('click',e=>{if(e.target===wrap)wrap.remove()});return wrap;
  }
  async function openLibrary(){
    const root=modal();
    try{
      if(typeof window.ensureOxford3000==='function')await window.ensureOxford3000();
      const words=typeof window.getOxford3000==='function'?window.getOxford3000():[];
      if(words.length<TARGET)throw new Error(`oxford_not_ready_${words.length}`);
      let page=0,query='';
      const draw=()=>{
        const q=query.toLowerCase();
        const filtered=q?words.filter(e=>`${e.word} ${e.thai} ${e.part} ${e.level}`.toLowerCase().includes(q)):words;
        const pages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));page=Math.min(page,pages-1);
        const items=filtered.slice(page*PAGE_SIZE,page*PAGE_SIZE+PAGE_SIZE);
        root.querySelector('#coreLibraryBody').innerHTML=`<div class="core-library-tools"><input id="coreLibrarySearch" value="${esc(query)}" placeholder="ค้นหา เช่น travel, เดินทาง, B1" autocomplete="off"><span>${filtered.length.toLocaleString()} คำ</span></div><div class="core-library-note">คำอ่านภาษาไทยเป็นตัวช่วยโดยประมาณ การออกเสียงจริงให้กด 🔊 ฟังจากเสียงภาษาอังกฤษของอุปกรณ์</div><div class="core-library-list">${items.map(e=>`<div class="core-library-row"><span class="core-library-rank">${Number(e.id)||words.indexOf(e)+1}</span><div class="core-library-word"><b>${esc(e.word)} <em style="font-size:11px;color:#67e8f9;font-style:normal">${esc(e.level||'')}</em></b><small>คำอ่าน: ${esc(reading(e.word))} · ${esc(e.thai||'-')}${e.part?` · ${esc(e.part)}`:''}</small></div><button type="button" class="core-library-say" data-say="${esc(e.word)}" aria-label="ฟัง ${esc(e.word)}">🔊 ฟัง</button></div>`).join('')}</div><div class="core-library-pager"><button id="coreLibPrev" ${page===0?'disabled':''}>← ก่อนหน้า</button><span>หน้า ${page+1}/${pages}</span><button id="coreLibNext" ${page>=pages-1?'disabled':''}>ถัดไป →</button></div>`;
        const search=root.querySelector('#coreLibrarySearch');search.oninput=()=>{query=search.value.trim();page=0;draw();setTimeout(()=>root.querySelector('#coreLibrarySearch')?.focus(),0)};
        root.querySelectorAll('[data-say]').forEach(btn=>btn.onclick=()=>say(btn.dataset.say));
        root.querySelector('#coreLibPrev').onclick=()=>{if(page>0){page--;draw();root.querySelector('.core-library-panel')?.scrollTo({top:0,behavior:'smooth'})}};
        root.querySelector('#coreLibNext').onclick=()=>{if(page<pages-1){page++;draw();root.querySelector('.core-library-panel')?.scrollTo({top:0,behavior:'smooth'})}};
      };draw();
    }catch(err){
      root.querySelector('#coreLibraryBody').innerHTML=`<div class="core-study-error"><h3>เปิด Oxford 3000 ไม่สำเร็จ</h3><p>ข้อมูลคำศัพท์ยังโหลดไม่ครบ กรุณารีเฟรชแล้วลองใหม่</p><small>${esc(err?.message||'unknown')}</small><br><br><button class="primary-btn" id="coreLibraryRetry">ลองใหม่</button></div>`;
      root.querySelector('#coreLibraryRetry').onclick=()=>openLibrary();
    }
  }
  window.openCore3000Library=openLibrary;
})();
