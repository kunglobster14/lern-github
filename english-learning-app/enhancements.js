(()=>{
  const STATE_KEY='myEnglishV2';
  const STORE_KEY='myEnglishLocalProfilesV1';
  const ACTIVE_KEY='myEnglishActiveProfileV1';
  const BACKUP_FORMAT='my-english-local-backup';
  let deferredInstallPrompt=null;

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
    const store=readStore();
    const id=activeId();
    const index=store.profiles.findIndex(p=>p.id===id);
    if(index<0)return;
    const state=safeParse(localStorage.getItem(STATE_KEY),store.profiles[index].state||defaultState(store.profiles[index].name));
    store.profiles[index]={...store.profiles[index],name:state.name||store.profiles[index].name||'ผู้เรียน',state,updatedAt:new Date().toISOString()};
    writeStore(store);
  }

  function setAiBadge(text,mode='local'){
    const el=document.querySelector('#freeModeBadge');
    if(!el)return;
    el.textContent=text;
    el.dataset.mode=mode;
    el.title=mode==='online'?'ใช้โมเดลออนไลน์ที่ราคา $0 เท่านั้น':'ใช้โหมดฝึกในเครื่อง ไม่เสียค่าใช้จ่าย';
  }

  function toast(message){
    let el=document.querySelector('#appToast');
    if(!el){el=document.createElement('div');el.id='appToast';el.className='app-toast';document.body.appendChild(el);}
    el.textContent=message;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),2200);
  }

  ensureProfiles();
  setInterval(syncActiveProfile,1500);
  window.addEventListener('pagehide',syncActiveProfile);

  const nativeFetch=window.fetch.bind(window);
  window.fetch=async(...args)=>{
    const target=String(args?.[0]?.url||args?.[0]||'');
    const isAi=/\/api\/ai(?:$|[?#])/.test(target);
    if(isAi)setAiBadge('AI ฟรี · กำลังเชื่อม','checking');
    try{
      const response=await nativeFetch(...args);
      if(isAi)setAiBadge(response.ok?'AI ฟรี · Online':'FREE · Local Coach',response.ok?'online':'local');
      return response;
    }catch(error){
      if(isAi)setAiBadge('FREE · Local Coach','local');
      throw error;
    }
  };

  function renderProfileSelect(){
    const select=document.querySelector('#profileSelect');
    if(!select)return;
    syncActiveProfile();
    const store=readStore();
    select.innerHTML=store.profiles.map(p=>`<option value="${p.id}">${escapeText(p.name||'ผู้เรียน')}</option>`).join('');
    select.value=activeId();
  }
  function escapeText(value){return String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}

  function switchProfile(id){
    syncActiveProfile();
    const store=readStore();
    const profile=store.profiles.find(p=>p.id===id);
    if(!profile)return;
    setActiveId(id);
    localStorage.setItem(STATE_KEY,JSON.stringify(profile.state||defaultState(profile.name)));
    location.reload();
  }

  function addProfile(){
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
    syncActiveProfile();
    const payload={format:BACKUP_FORMAT,version:1,exportedAt:new Date().toISOString(),activeProfileId:activeId(),store:readStore()};
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');
    const stamp=new Date().toISOString().slice(0,10);
    a.href=url;a.download=`my-english-backup-${stamp}.json`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
    toast('สำรองข้อมูลเรียบร้อย');
  }

  async function importBackup(file){
    if(!file)return;
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
    renderProfileSelect();
    document.querySelector('#profileSelect')?.addEventListener('change',e=>switchProfile(e.target.value));
    document.querySelector('#addProfileBtn')?.addEventListener('click',addProfile);
    document.querySelector('#exportBackupBtn')?.addEventListener('click',exportBackup);
    document.querySelector('#importBackupBtn')?.addEventListener('click',()=>document.querySelector('#backupFileInput')?.click());
    document.querySelector('#backupFileInput')?.addEventListener('change',e=>importBackup(e.target.files?.[0]));
    document.querySelector('#installAppBtn')?.addEventListener('click',installApp);
    setAiBadge('FREE · Local Ready','local');
  });
})();
