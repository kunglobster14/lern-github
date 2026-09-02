(()=>{
  'use strict';
  let applying=false;

  function speakAll(lines){
    if(!('speechSynthesis' in window)||!Array.isArray(lines)||!lines.length)return;
    speechSynthesis.cancel();
    lines.forEach((text,i)=>{
      const u=new SpeechSynthesisUtterance(text);
      u.lang='en-US';
      u.rate=.82;
      if(i<lines.length-1)u.onend=()=>{};
      speechSynthesis.speak(u);
    });
  }

  function apply(){
    if(applying)return;
    applying=true;
    try{
      const box=document.querySelector('.examples');
      if(!box)return;
      const rows=[...box.querySelectorAll(':scope > div')];
      const lines=rows.map(r=>r.querySelector('b')?.textContent?.trim()).filter(Boolean);
      if(!lines.length)return;

      rows.forEach((row,i)=>{
        if(row.querySelector('.v341-listen-one'))return;
        const btn=document.createElement('button');
        btn.type='button';
        btn.className='secondary v341-listen-one';
        btn.textContent='🔊 ฟังประโยคนี้';
        btn.style.marginTop='8px';
        btn.onclick=()=>speakAll([lines[i]]);
        row.appendChild(btn);
      });

      const old=document.querySelector('[data-speak]');
      if(old&&!old.dataset.v341Fixed){
        old.dataset.v341Fixed='1';
        old.textContent='🔊 ฟังตัวอย่างทั้งหมด';
        old.removeAttribute('data-speak');
        old.onclick=()=>speakAll(lines);
      }
    }finally{applying=false}
  }

  const observer=new MutationObserver(()=>queueMicrotask(apply));
  observer.observe(document.documentElement,{subtree:true,childList:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  window.__v34AudioFix={version:'34.1',apply};
})();
