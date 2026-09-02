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
    if(id.includes('qwen3.6-27b'))return 'FREE Online · Groq Qwen';
    if(id.includes('gpt-oss-20b'))return 'FREE Online · Groq GPT-OSS';
    return 'FREE Online · Groq';
  };

  const failureLabel=failures=>{
    const f=Array.isArray(failures)&&failures[0];
    if(!f)return 'FREE · Local Coach';
    const code=String(f.code||'').toUpperCase();
    const status=Number(f.status)||0;
    if(code.includes('MISSING_GROQ_API_KEY'))return 'FREE · Add GROQ_API_KEY';
    if(status===401||code.includes('401'))return 'FREE · Groq key 401';
    if(status===403||code.includes('403'))return 'FREE · Groq permission 403';
    if(status===404||code.includes('404'))return 'FREE · Groq model 404';
    if(status===429||code.includes('429'))return 'FREE · Groq quota 429';
    return `FREE · Groq ${String(f.code||'unavailable').slice(0,22)}`;
  };

  async function probe(){
    set('FREE · Checking Groq','checking');
    try{
      const r=await fetch(`/api/ai?probe=1&v=${Date.now()}`,{cache:'no-store'});
      const data=await r.json().catch(()=>null);
      if(!r.ok||!data){set(`FREE · API ${r.status||'error'}`,'local');return;}
      if(data.online){set(modelLabel(data.model),'online');return;}
      set(failureLabel(data.failures),'local');
    }catch{set('FREE · Local Coach','local');}
  }

  window.addEventListener('DOMContentLoaded',()=>{
    probe();
    const observer=new MutationObserver(()=>{if(document.querySelector('.ai-head'))probe();});
    observer.observe(document.querySelector('#app')||document.body,{childList:true,subtree:true});
  });
})();
