(()=>{
  const exactReadings={
    'i would like a coffee, please.':'ไอ วูด ไลก์ อะ คอฟฟี พลีซ',
    'where is the bathroom?':'แวร์ อิซ เดอะ แบธรูม',
    'okay, thank you.':'โอเค แธงก์ ยู',
    'i have a reservation.':'ไอ แฮฟ อะ เรซเซอร์เวชัน',
    'can i pay by card?':'แคน ไอ เพย์ บาย คาร์ด',
    'could you say that again?':'คูด ยู เซย์ แดต อะเกน',
    'my bag is missing.':'มาย แบ็ก อิซ มิสซิง',
    'can you help me, please?':'แคน ยู เฮลป์ มี พลีซ',
    'two tickets, please.':'ทู ทิคเก็ตส์ พลีซ',
    'how much is this shirt?':'ฮาว มัช อิซ ดิส เชิร์ต'
  };
  const wordReadings={
    i:'ไอ',a:'อะ',an:'แอน',the:'เดอะ',am:'แอม',is:'อิซ',are:'อาร์',was:'วอซ',were:'เวอร์',be:'บี',been:'บีน',
    my:'มาย',your:'ยัวร์',you:'ยู',me:'มี',we:'วี',they:'เดย์',he:'ฮี',she:'ชี',it:'อิท',this:'ดิส',that:'แดต',
    can:'แคน',could:'คูด',will:'วิล',would:'วูด',do:'ดู',have:'แฮฟ',has:'แฮซ',need:'นีด',want:'วอนท์',like:'ไลก์',
    work:'เวิร์ก',working:'เวิร์กกิง',project:'พรอเจ็กต์',on:'ออน',at:'แอท',in:'อิน',to:'ทู',for:'ฟอร์',from:'ฟรอม',with:'วิธ',
    right:'ไรต์',left:'เลฟต์',turn:'เทิร์น',corner:'คอร์เนอร์',straight:'สเตรต',where:'แวร์',why:'วาย',when:'เว็น',what:'ว็อท',
    phone:'โฟน',coffee:'คอฟฟี',please:'พลีซ',thanks:'แธงก์ส',thank:'แธงก์',help:'เฮลป์',say:'เซย์',again:'อะเกน',
    card:'คาร์ด',cash:'แคช',pay:'เพย์',by:'บาย',ticket:'ทิคเก็ต',tickets:'ทิคเก็ตส์',station:'สเตชัน',train:'เทรน',bus:'บัส',
    hotel:'โฮเทล',room:'รูม',reservation:'เรซเซอร์เวชัน',airport:'แอร์พอร์ต',gate:'เกต',taxi:'แท็กซี',bag:'แบ็ก',missing:'มิสซิง',
    shirt:'เชิร์ต',price:'ไพรซ์',cheap:'ชีพ',expensive:'เอ็กซ์เพนซิฟ',size:'ไซซ์',small:'สมอล',large:'ลาร์จ',buy:'บาย',open:'โอเพิน',closed:'โคลซด์',
    family:'แฟมิลี',friend:'เฟรนด์',name:'เนม',email:'อีเมล',send:'เซนด์',meeting:'มีตทิง',problem:'พรอบเล็ม',ready:'เรดดี',busy:'บิซี',
    happy:'แฮปปี',tired:'ไทเอิร์ด',hungry:'ฮังกรี',sorry:'ซอรี',today:'ทูเดย์',tomorrow:'ทูมอร์โรว์',yesterday:'เยสเตอร์เดย์',
    morning:'มอร์นิง',night:'ไนต์',time:'ไทม์',day:'เดย์',home:'โฮม',food:'ฟูด',water:'วอเทอร์',good:'กูด',very:'เวรี',
    some:'ซัม',every:'เอฟวรี',now:'นาว',two:'ทู',twelve:'ทเวลฟ์',only:'โอนลี',new:'นิว',ten:'เท็น',there:'แดร์',
    because:'บิคอส',drink:'ดริงก์',near:'เนียร์',far:'ฟาร์',here:'เฮียร์',wait:'เวต',moment:'โมเมนต์',understand:'อันเดอร์สแตนด์',
    much:'มัช',bathroom:'แบธรูม'
  };
  const readingFor=text=>{
    const clean=String(text||'').trim();
    const exact=exactReadings[clean.toLowerCase()];
    if(exact)return exact;
    return clean.replace(/[.!?,]/g,'').split(/\s+/).map(w=>wordReadings[w.toLowerCase()]||w).join(' ');
  };

  function addCorrectReading(dialog){
    if(!dialog||dialog.id!=='gameLabModal')return;
    const title=dialog.querySelector('.game-panel-head h2')?.textContent||'';
    if(!/Missing Word|Survival Dialog/i.test(title))return;
    const isMissing=/Missing Word/i.test(title);
    dialog.querySelectorAll('.lab-choice').forEach(btn=>{
      if(btn.dataset.readingPatched==='1'||typeof btn.onclick!=='function')return;
      btn.dataset.readingPatched='1';
      const original=btn.onclick;
      btn.onclick=function(event){
        const nativeSetTimeout=window.setTimeout;
        window.setTimeout=function(fn,ms,...args){
          if(ms===350)return nativeSetTimeout(fn,1700,...args);
          return nativeSetTimeout(fn,ms,...args);
        };
        try{original.call(this,event)}finally{window.setTimeout=nativeSetTimeout}
        if(!this.classList.contains('correct'))return;
        const answer=String(this.dataset.value||this.dataset.v||this.textContent||'').trim();
        const prompt=String(dialog.querySelector('.game-prompt')?.textContent||'').trim();
        const fullText=isMissing&&prompt?prompt.replace(/_+/,answer):answer;
        let feedback=dialog.querySelector('#choiceReadingFeedback');
        if(!feedback){
          feedback=document.createElement('div');
          feedback.id='choiceReadingFeedback';
          feedback.style.cssText='margin:12px 0 0;padding:12px 14px;border-radius:12px;background:rgba(34,197,94,.12);border:1px solid rgba(74,222,128,.4);color:#dcfce7;font-weight:800;text-align:center;line-height:1.55';
          dialog.querySelector('#gameLabBody')?.appendChild(feedback);
        }
        feedback.innerHTML=`✅ ถูก<br><span style="font-weight:700;color:#bae6fd">คำอ่าน: ${readingFor(fullText)}</span>`;
        if(isMissing){
          try{if(fullText&&typeof speak==='function')speak(fullText)}catch{}
        }
      };
    });
  }

  const style=document.createElement('style');
  style.textContent=`
    body.core-study-active{overflow:hidden!important}
    body.core-study-active .topbar,body.core-study-active .bottom-nav{display:none!important}
    #core3000StudyModal.game-lab-overlay{position:fixed!important;inset:0!important;z-index:2147483000!important;display:block!important;overflow-y:auto!important;padding:0!important;background:#07111f!important}
    #core3000StudyModal .core-study-panel{width:100%!important;max-width:none!important;min-height:100dvh!important;margin:0!important;border-radius:0!important;padding:max(22px,env(safe-area-inset-top)) 28px max(40px,env(safe-area-inset-bottom))!important;box-sizing:border-box!important}
    #core3000StudyModal .game-panel-head{position:sticky;top:0;z-index:5;background:#07111f;padding:8px 0 16px}
    #core3000StudyModal .core-word-card{max-width:880px;margin:0 auto}
  `;
  document.head.appendChild(style);

  function patchCore(root){
    if(!root)return;
    document.body.classList.add('core-study-active');
    root.dataset.fullScreenStudy='1';
    const understand=root.querySelector('#coreUnderstand');
    if(understand){
      if(!understand.classList.contains('done')){understand.click();return}
      understand.remove();
    }
    const instruction=root.querySelector('.core-instruction');
    if(instruction)instruction.textContent='ฟังและพูดตามให้ครบ 3 รอบ ถ้าเข้าใจแล้วกดไปคำถัดไปได้เลย';
    const pass=root.querySelector('#corePass');
    if(pass)pass.textContent=pass.disabled?'ฟังให้ครบ 3 ครั้ง':'เข้าใจแล้ว · ไปคำถัดไป →';
  }

  function scan(){
    const game=document.querySelector('#gameLabModal');
    if(game)addCorrectReading(game);
    const core=document.querySelector('#core3000StudyModal');
    if(core)patchCore(core);else document.body.classList.remove('core-study-active');
  }
  const observer=new MutationObserver(()=>requestAnimationFrame(scan));
  observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','disabled']});
  requestAnimationFrame(scan);
})();
