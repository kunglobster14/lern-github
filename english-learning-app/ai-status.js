(()=>{
  const badge=()=>document.querySelector('#freeModeBadge');
  const set=(text,mode='local')=>{
    const el=badge();
    if(el){el.textContent=text;el.dataset.mode=mode;el.title=text;}
    const head=document.querySelector('.ai-head');
    if(head){
      let chip=document.querySelector('#aiProbeInline');
      if(!chip){
        chip=document.createElement('span');
        chip.id='aiProbeInline';
        chip.style.cssText='display:inline-flex;margin-top:7px;padding:5px 9px;border-radius:999px;font-size:10px;font-weight:800;border:1px solid rgba(148,163,184,.22)';
        (head.querySelector('div:nth-child(2)')||head).appendChild(chip);
      }
      chip.textContent=text;
      chip.style.background=mode==='online'?'rgba(52,211,153,.12)':'rgba(148,163,184,.10)';
      chip.style.color=mode==='online'?'#6ee7b7':'#cbd5e1';
    }
  };
  const modelLabel=id=>{
    id=String(id||'');
    if(id.includes('nemotron'))return 'FREE Online · Nemotron';
    if(id.includes('ling-3.0'))return 'FREE Online · Ling';
    if(id.includes('laguna'))return 'FREE Online · Laguna';
    return 'FREE Online AI';
  };
  const failureLabel=failures=>{
    const f=Array.isArray(failures)&&failures[0];
    if(!f)return 'FREE · AI unavailable';
    const code=String(f.code||'').toUpperCase();
    const status=Number(f.status)||0;
    if(status===401||code.includes('401'))return 'FREE · AI auth 401';
    if(status===403||code.includes('403'))return 'FREE · AI permission 403';
    if(status===404||code.includes('404'))return 'FREE · AI model 404';
    if(status===429||code.includes('429'))return 'FREE · AI quota 429';
    return `FREE · AI ${String(f.code||'unavailable').slice(0,24)}`;
  };
  async function probe(){
    set('FREE · Checking AI','checking');
    try{
      const r=await fetch(`/api/ai?probe=1&v=${Date.now()}`,{cache:'no-store'});
      const data=await r.json().catch(()=>null);
      if(!r.ok||!data){set(`FREE · API ${r.status||'error'}`,'local');return;}
      if(data.online){set(modelLabel(data.model),'online');return;}
      set(failureLabel(data.failures),'local');
    }catch{set('FREE · API unreachable','local');}
  }
  window.addEventListener('DOMContentLoaded',()=>{
    probe();
    const observer=new MutationObserver(()=>{if(document.querySelector('.ai-head'))probe();});
    observer.observe(document.querySelector('#app')||document.body,{childList:true,subtree:true});
  });
})();
