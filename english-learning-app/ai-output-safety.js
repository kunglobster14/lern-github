(()=>{
  const STATE_KEY='myEnglishV2';
  const PROFILE_KEY='myEnglishLocalProfilesV1';
  const unsafe=/<\/?think>|thinking process|analy[sz]e user input|chain[- ]of[- ]thought|internal reasoning/i;

  const containsUnsafe=value=>{
    try{return unsafe.test(typeof value==='string'?value:JSON.stringify(value))}catch{return false}
  };

  function clearMissionFromObject(obj){
    if(!obj||typeof obj!=='object')return false;
    const mission=obj?.gameLab?.aiMission;
    if(mission&&containsUnsafe(mission)){
      obj.gameLab.aiMission=null;
      return true;
    }
    return false;
  }

  function clearStoredUnsafeMission(){
    let changed=false;

    // Clear the live app state first so the profile sync loop cannot write it back.
    try{
      if(typeof state!=='undefined'&&clearMissionFromObject(state)){
        changed=true;
        if(typeof saveState==='function')saveState();
      }
    }catch{}

    try{
      const raw=localStorage.getItem(STATE_KEY);
      if(raw){
        const value=JSON.parse(raw);
        if(clearMissionFromObject(value)){
          localStorage.setItem(STATE_KEY,JSON.stringify(value));
          changed=true;
        }
      }
    }catch{}

    // Also clean any saved learner profiles on this device.
    try{
      const raw=localStorage.getItem(PROFILE_KEY);
      if(raw){
        const store=JSON.parse(raw);
        let profileChanged=false;
        if(Array.isArray(store?.profiles)){
          store.profiles.forEach(profile=>{
            if(clearMissionFromObject(profile?.state))profileChanged=true;
          });
        }
        if(profileChanged){
          localStorage.setItem(PROFILE_KEY,JSON.stringify(store));
          changed=true;
        }
      }
    }catch{}

    return changed;
  }

  function guardVisibleMission(){
    const modal=document.querySelector('#gameLabModal');
    if(!modal||!containsUnsafe(modal.textContent||''))return;
    clearStoredUnsafeMission();
    const body=modal.querySelector('#gameLabBody');
    if(body){
      body.innerHTML=`<div class="game-stage"><div class="lab-feedback" style="font-size:16px;line-height:1.7">✨ ภารกิจจากเวอร์ชันเก่าถูกล้างแล้ว<br><small>ปิดหน้าต่างนี้แล้วเปิด AI Surprise Mission ใหม่ ระบบจะแสดงเฉพาะภารกิจสุดท้าย ไม่แสดงกระบวนการคิดของ AI</small></div></div>`;
    }
  }

  clearStoredUnsafeMission();
  window.addEventListener('DOMContentLoaded',()=>{
    clearStoredUnsafeMission();
    guardVisibleMission();
    const observer=new MutationObserver(()=>guardVisibleMission());
    observer.observe(document.body,{childList:true,subtree:true,characterData:true});
  });
})();
