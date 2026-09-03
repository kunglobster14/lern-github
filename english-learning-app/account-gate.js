(()=>{
  const KEYS=['myEnglishV2','myEnglishCompleteCourseV1','myEnglishLearningPathV1'];
  const PROFILE_STORE='myEnglishLocalProfilesV1';
  const ACTIVE_PROFILE='myEnglishActiveProfileV1';
  let status=null,enabled=false,last='',timer=null;
  const api=async(options={})=>{const r=await fetch(options.url||'/api/account',{cache:'no-store',credentials:'same-origin',...options});const d=await r.json().catch(()=>({}));return{r,d}};
  const snap=()=>{const o={};KEYS.forEach(k=>{const v=localStorage.getItem(k);if(v!==null){try{o[k]=JSON.parse(v)}catch{o[k]=v}}});return o};
  const clear=()=>KEYS.forEach(k=>localStorage.removeItem(k));
  function mirrorLegacyProfile(){
    try{
      const state=JSON.parse(localStorage.getItem('myEnglishV2')||'null');
      const store=JSON.parse(localStorage.getItem(PROFILE_STORE)||'null');
      const active=localStorage.getItem(ACTIVE_PROFILE)||'';
      if(!state||!store||!Array.isArray(store.profiles)||!active)return;
      const i=store.profiles.findIndex(p=>p.id===active);if(i<0)return;
      store.profiles[i]={...store.profiles[i],name:state.name||store.profiles[i].name||'ผู้เรียน',state,updatedAt:new Date().toISOString()};
      localStorage.setItem(PROFILE_STORE,JSON.stringify(store));
    }catch{}
  }
  const apply=o=>{clear();Object.entries(o||{}).forEach(([k,v])=>{if(KEYS.includes(k))localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v))});mirrorLegacyProfile()};
  const errorText=c=>({invalid_credentials:'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',invalid_username:'Username ต้องยาว 3–30 ตัว และใช้ตัวอักษร ตัวเลข จุด ขีด หรือ _',invalid_password:'Password ต้องมีอย่างน้อย 8 ตัวอักษร',username_taken:'Username นี้ถูกใช้แล้ว',registration_closed:'ปิดการสมัครแล้ว ให้ผู้ดูแลสร้างบัญชีให้',user_limit_reached:'มีผู้เรียนครบ 10 คนแล้ว'}[c]||'เกิดข้อผิดพลาด กรุณาลองใหม่');

  async function pull(){const {r,d}=await api({url:'/api/state'});if(r.ok){apply(d.state||{});last=JSON.stringify(snap())}}
  async function push(force=false){if(!enabled||!status?.authenticated)return;const text=JSON.stringify(snap());if(!force&&text===last)return;last=text;await api({url:'/api/state',method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({state:JSON.parse(text)}),keepalive:true}).catch(()=>{})}
  function watch(){setInterval(()=>{if(JSON.stringify(snap())!==last){clearTimeout(timer);timer=setTimeout(()=>push(),900)}},1400);window.addEventListener('pagehide',()=>push(true));}

  function overlay(s){
    document.querySelector('#accountOverlay')?.remove();
    const el=document.createElement('div');el.className='account-overlay';el.id='accountOverlay';
    el.innerHTML=`<section class="account-card"><div class="account-logo">M</div>${s.databaseMode==='temporary'?'<span class="account-test">TEMP DATABASE TEST</span>':''}<h1>My English Coach</h1><p>เข้าสู่ระบบด้วยบัญชีผู้เรียน เพื่อให้หลักสูตรและความคืบหน้าแยกจากผู้เรียนคนอื่น</p><label class="account-field"><span>Username</span><input id="aUser" autocomplete="username"></label><label class="account-field"><span>Password</span><input id="aPass" type="password" autocomplete="current-password"></label><div class="account-error" id="aError"></div><div class="account-actions"><button class="account-primary" id="aLogin">เข้าสู่ระบบ</button></div><p class="account-note">Core 3000, หลักสูตร, Quiz, Review และ XP จะบันทึกแยกตามบัญชี ผู้ดูแลเป็นผู้สร้างบัญชีผู้เรียนให้</p></section>`;
    document.body.appendChild(el);
    const submit=async()=>{
      const e=el.querySelector('#aError');e.textContent='กำลังเข้าสู่ระบบ...';
      const payload={action:'login',username:el.querySelector('#aUser').value.trim(),password:el.querySelector('#aPass').value};
      const {r,d}=await api({method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
      if(!r.ok){e.textContent=errorText(d.error);return}
      clear();sessionStorage.clear();location.reload();
    };
    el.querySelector('#aLogin').onclick=submit;
    el.querySelector('#aPass').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submit()}});
  }

  async function logout(){
    const btn=document.querySelector('#accountLogout');if(btn){btn.disabled=true;btn.textContent='กำลังออก...'}
    await push(true);
    await api({method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'logout'})}).catch(()=>{});
    clear();sessionStorage.clear();location.reload();
  }

  function decorate(){
    const top=document.querySelector('.top-actions');if(!top)return;
    const n=document.querySelector('#profileName');if(n){n.textContent='ผู้เรียน';n.title=status?.user?.displayName||'ผู้เรียน'}
    const profileBtn=document.querySelector('#profileBtn');if(profileBtn)profileBtn.setAttribute('aria-label',status?.user?.displayName?`ผู้เรียน: ${status.user.displayName}`:'ผู้เรียน');
    if(!document.querySelector('#accountLogout')){
      const b=document.createElement('button');b.id='accountLogout';b.className='account-top-btn';b.type='button';b.textContent='ออกจากบัญชี';b.setAttribute('aria-label','ออกจากบัญชีผู้เรียน');b.onclick=logout;top.appendChild(b);
    }
    const localTools=document.querySelector('.local-tools');if(localTools)localTools.style.display='none';
    const intro=document.querySelector('#profileDialog .dialog-card > p');if(intro)intro.textContent='หลักสูตรและความคืบหน้าบันทึกแยกตามบัญชีผู้เรียน และซิงก์ผ่านฐานข้อมูล';
    ['exportBackupBtn','importBackupBtn'].forEach(id=>{const el=document.querySelector('#'+id);if(el)el.style.display='none'});
  }

  async function boot(){const {r,d}=await api().catch(()=>({r:{ok:false},d:{}}));if(!r.ok||!d.dbConfigured)return;enabled=true;status=d;if(!d.authenticated){overlay(d);return}const m=`myEnglishHydrated:${d.user.id}`;if(!sessionStorage.getItem(m)){await pull();sessionStorage.setItem(m,'1');location.reload();return}last=JSON.stringify(snap());decorate();watch()}
  boot();
})();
