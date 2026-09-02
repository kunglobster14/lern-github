(()=>{
  const STATE_KEY='myEnglishV2';
  const STORE_KEY='myEnglishLocalProfilesV1';
  const ACTIVE_KEY='myEnglishActiveProfileV1';
  const BACKUP_FORMAT='my-english-local-backup';
  const MULTIUSER_MODE=new URLSearchParams(location.search).get('accountTest')==='1';
  let deferredInstallPrompt=null;
  let aiStatus={text:'FREE · Local Ready',mode:'local'};

  const safeParse=(value,fallback)=>{try{return JSON.parse(value)}catch{return fallback}};
  const makeId=()=>globalThis.crypto?.randomUUID?.()||`p_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
  const defaultState=name=>({name:name||'ผู้เรียน',known:[],weak:[],xp:0,streak:1,quizBest:0,scenario:'daily',chat:[]});

  function readStore(){
    const raw=safeParse(localStorage.getItem(STORE_KEY),null);
    if(!raw||!Array.isArray(raw.profiles))return{version:1,profiles:[]};
    return raw;
  }
  function writeStore(store){localStorage.setItem(STORE_KEY,JSON.stringify(store));}
  function activeId(){return localStorage.getItem(ACTIVE_KEY)||'';}
  function setActiveId(id){localStorage.setItem(ACTIVE_KEY,id);}

  function ensureProfiles(){
    if(MULTIUSER_MODE)return;
    let store=readStore();
    if(!store.profiles.length){
      const current=safeParse(localStorage.getItem(STATE_KEY),defaultState('ผู้เรียน'));
      const id=makeId();
      store={version:1,profiles:[{id,name:current.name||'ผู้เรียน',state:current,updatedAt:new Date().toISOString()}]};
      writeStore(store);setActiveId(id);
    }
    let id=activeId();
    let profile=store.profiles.find(p=>p.id===id);
    if(!profile){profile=store.profiles[0];id=profile.id;setActiveId(id);}
    localStorage.setItem(STATE_KEY,JSON.stringify(profile.state||defaultState(profile.name)));
  }

  function syncActiveProfile(){
    if(MULTIUSER_MODE)return;
    const store=readStore();
    const id=activeId();
    const index=store.profiles.findIndex(p=>p.id===id);
    if(index<0)return;
    const state=safeParse(localStorage.getItem(STATE_KEY),store.profiles[index].state||defaultState(store.profiles[index].name));
    store.profiles[index]={...store.profiles[index],name:state.name||store.profiles[index].name||'ผู้เรียน',state,updatedAt:new Date().toISOString()};
    writeStore(store);
  }

  function ensureAiInlineBadge(){
    const head=document.querySelector('.ai-head');
    if(!head)return;
    let chip=document.querySelector('#aiModeInline');
    if(!chip){
      chip=document.createElement('span');
      chip.id='aiModeInline';
      chip.style.cssText='display:inline-flex;align-items:center;margin-top:7px;padding:5px 9px;border-radius:999px;font-size:10px;font-weight:800;border:1px solid rgba(148,163,184,.2);letter-spacing:.02em';
      const info=head.querySelector('div:nth-child(2)')||head;
      info.appendChild(chip);
    }
    chip.textContent=aiStatus.text;
    const online=aiStatus.mode==='online';
    const checking=aiStatus.mode==='checking';
    chip.style.background=online?'rgba(52,211,153,.12)':checking?'rgba(34,211,238,.12)':'rgba(148,163,184,.10)';
    chip.style.color=online?'#6ee7b7':checking?'#67e8f9':'#cbd5e1';
  }

  function setAiBadge(text,mode='local'){
    aiStatus={text,mode};
    const el=document.querySelector('#freeModeBadge');
    if(el){
      el.textContent=text;
      el.dataset.mode=mode;
      el.title=mode==='online'?'ใช้โมเดลออนไลน์ที่ราคา $0 เท่านั้น':'ใช้โหมดฝึกในเครื่อง ไม่เสียค่าใช้จ่าย';
    }
    ensureAiInlineBadge();
  }

  function modelName(payload){
    const id=String(payload?.model||'');
    if(id.includes('qwen'))return 'FREE Online · Groq Qwen';
    if(id.includes('gpt-oss'))return 'FREE Online · Groq GPT-OSS';
    if(id.includes('nemotron-3.5-lightning-free'))return 'FREE Online · Nemotron';
    if(id.includes('ling-3.0-flash-fin-free'))return 'FREE Online · Ling';
    if(id.includes('laguna-s-2.1-free'))return 'FREE Online · Laguna';
    return 'AI ฟรี · Online';
  }

  function toast(message){
    let el=document.querySelector('#appToast');
    if(!el){el=document.createElement('div');el.id='appToast';el.className='app-toast';document.body.appendChild(el);}
    el.textContent=message;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),2200);
  }

  if(!MULTIUSER_MODE){
    ensureProfiles();
    setInterval(syncActiveProfile,1500);
    window.addEventListener('pagehide',syncActiveProfile);
  }

  const nativeFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const target=String(args?.[0]?.url||args?.[0]||'');
    const isAi=/\/api\/ai(?:$|[?#])/.test(target);
    if(isAi)setAiBadge('AI ฟรี · กำลังเชื่อม','checking');
    try{
      const response=await nativeFetch(...args);
      if(isAi){
        let payload=null;
        try{payload=await response.clone().json()}catch{}
        if(response.ok){
          setAiBadge(modelName(payload),'online');
        }else if(payload?.authPresent===false){
          setAiBadge('FREE · AI Auth ยังไม่พร้อม','local');
        }else{
          setAiBadge('FREE · Local Coach','local');
        }
      }
      return response;
    }catch(error){
      if(isAi)setAiBadge('FREE · Local Coach','local');
      throw error;
    }
  };

  function renderProfileSelect(){
    if(MULTIUSER_MODE)return;
    const select=document.querySelector('#profileSelect');
    if(!select)return;
    syncActiveProfile();
    const store=readStore();
    select.innerHTML=store.profiles.map(p=>`<option value="${p.id}">${escapeText(p.name||'ผู้เรียน')}</option>`).join('');
    select.value=activeId();
  }
  function escapeText(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}

  function switchProfile(id){
    if(MULTIUSER_MODE)return;
    syncActiveProfile();
    const store=readStore();
    const profile=store.profiles.find(p=>p.id===id);
    if(!profile)return;
    setActiveId(id);
    localStorage.setItem(STATE_KEY,JSON.stringify(profile.state||defaultState(profile.name)));
    location.reload();
  }

  function addProfile(){
    if(MULTIUSER_MODE)return;
    syncActiveProfile();
    const name=(prompt('ชื่อผู้เรียนใหม่ เช่น Student 02')||'').trim();
    if(!name)return;
    const store=readStore();
    const id=makeId();
    const state=defaultState(name);
    store.profiles.push({id,name,state,updatedAt:new Date().toISOString()});
    writeStore(store);setActiveId(id);localStorage.setItem(STATE_KEY,JSON.stringify(state));location.reload();
  }

  function exportBackup(){
    if(MULTIUSER_MODE)return;
    syncActiveProfile();
    const payload={format:BACKUP_FORMAT,version:1,exportedAt:new Date().toISOString(),activeProfileId:activeId(),store:readStore()};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');
    const stamp=new Date().toISOString().slice(0,10);
    a.href=url;a.download=`my-english-backup-${stamp}.json`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
    toast('สำรองข้อมูลเรียบร้อย');
  }

  async function importBackup(file){
    if(MULTIUSER_MODE||!file)return;
    try{
      const payload=JSON.parse(await file.text());
      if(payload?.format!==BACKUP_FORMAT||!Array.isArray(payload?.store?.profiles)||!payload.store.profiles.length)throw new Error('invalid');
      writeStore(payload.store);
      const wanted=payload.activeProfileId;
      const active=payload.store.profiles.find(p=>p.id===wanted)||payload.store.profiles[0];
      setActiveId(active.id);localStorage.setItem(STATE_KEY,JSON.stringify(active.state||defaultState(active.name)));
      toast('นำเข้าข้อมูลสำเร็จ');setTimeout(()=>location.reload(),700);
    }catch{alert('ไฟล์ Backup ไม่ถูกต้องหรืออ่านไม่ได้');}
  }

  async function installApp(){
    if(deferredInstallPrompt){
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice.catch(()=>null);
      deferredInstallPrompt=null;
      return;
    }
    const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
    alert(ios?'บน iPhone/iPad: กดปุ่ม Share แล้วเลือก “Add to Home Screen”':'เปิดเมนูเบราว์เซอร์ แล้วเลือก “ติดตั้งแอป” หรือ “เพิ่มไปยังหน้าจอหลัก”');
  }

  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;const btn=document.querySelector('#installAppBtn');if(btn)btn.classList.add('ready');});
  window.addEventListener('appinstalled',()=>toast('ติดตั้ง My English Coach แล้ว'));

  document.addEventListener('DOMContentLoaded',()=>{
    if(!MULTIUSER_MODE){
      renderProfileSelect();
      document.querySelector('#profileSelect')?.addEventListener('change',e=>switchProfile(e.target.value));
      document.querySelector('#addProfileBtn')?.addEventListener('click',addProfile);
      document.querySelector('#exportBackupBtn')?.addEventListener('click',exportBackup);
      document.querySelector('#importBackupBtn')?.addEventListener('click',()=>document.querySelector('#backupFileInput')?.click());
      document.querySelector('#backupFileInput')?.addEventListener('change',e=>importBackup(e.target.files?.[0]));
    }
    document.querySelector('#installAppBtn')?.addEventListener('click',installApp);
    setAiBadge('FREE · Local Ready','local');
    const observer=new MutationObserver(()=>ensureAiInlineBadge());
    observer.observe(document.querySelector('#app')||document.body,{childList:true,subtree:true});
    ensureAiInlineBadge();
  });
})();
