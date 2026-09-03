(()=>{
  const VERSION='v61';
  const KEYS=['myEnglishV2','myEnglishCompleteCourseV1','myEnglishLearningPathV1'];
  const PROFILE_STORE='myEnglishLocalProfilesV1';
  const ACTIVE_PROFILE='myEnglishActiveProfileV1';
  let status=null,enabled=false,lastRaw=null,timer=null,watchId=null;
  document.documentElement.classList.add('account-locked');
  const unlockApp=()=>document.documentElement.classList.remove('account-locked');
  const api=async(options={})=>{const r=await fetch(options.url||'/api/account',{cache:'no-store',credentials:'same-origin',...options});const d=await r.json().catch(()=>({}));return{r,d}};
  const rawSnap=()=>KEYS.map(k=>localStorage.getItem(k));
  const sameRaw=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((v,i)=>v===b[i]);
  const parseRaw=raw=>{const o={};KEYS.forEach((k,i)=>{const v=raw[i];if(v!==null){try{o[k]=JSON.parse(v)}catch{o[k]=v}}});return o};
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

  async function pull(){const {r,d}=await api({url:'/api/state'});if(r.ok){apply(d.state||{});lastRaw=rawSnap()}}
  async function push(force=false){
    if(!enabled||!status?.authenticated)return;
    const raw=rawSnap();
    if(!force&&sameRaw(raw,lastRaw))return;
    lastRaw=raw;
    await api({url:'/api/state',method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({state:parseRaw(raw)}),keepalive:true}).catch(()=>{});
  }
  function watch(){
    if(watchId)return;
    watchId=setInterval(()=>{
      const raw=rawSnap();
      if(!sameRaw(raw,lastRaw)){
        clearTimeout(timer);
        timer=setTimeout(()=>push(),1200);
      }
    },5000);
    window.addEventListener('pagehide',()=>push(true),{passive:true});
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')push(true)});
  }

  function overlay(s){
    document.querySelector('#accountOverlay')?.remove();
    const el=document.createElement('div');el.className='account-overlay';el.id='accountOverlay';
    el.innerHTML=`<section class="account-login-shell"><div class="account-login-brand"><div class="account-logo">M</div><div><span class="account-kicker">MY ENGLISH COACH</span><h1>เข้าสู่ระบบผู้เรียน</h1><p>ผู้เรียนแต่ละคนใช้บัญชีของตัวเอง ความคืบหน้า ระดับ บทเรียน เกม และ Oxford จะไม่ปะปนกัน</p></div></div><div class="account-login-points"><span>✓ โปรไฟล์แยกคน</span><span>✓ บันทึกความคืบหน้าแยกบัญชี</span><span>✓ เรียนต่อจากอุปกรณ์อื่นได้</span></div></section><section class="account-card account-login-card">${s.databaseMode==='temporary'?'<span class="account-test">TEMP DATABASE TEST</span>':''}<div class="account-card-head"><small>LEARNER LOGIN</small><h2>เข้าโปรไฟล์ของคุณ</h2><p>กรอก Username และ Password ที่ผู้ดูแลสร้างให้</p></div><label class="account-field"><span>Username</span><input id="aUser" autocomplete="username" autocapitalize="none" spellcheck="false" autofocus placeholder="เช่น kung01"></label><label class="account-field"><span>Password</span><div class="account-password-wrap"><input id="aPass" type="password" autocomplete="current-password" placeholder="รหัสผ่านอย่างน้อย 8 ตัว"><button id="aShowPass" type="button" aria-label="แสดงหรือซ่อนรหัสผ่าน">แสดง</button></div></label><div class="account-error" id="aError"></div><div class="account-actions"><button class="account-primary" id="aLogin">เข้าสู่โปรไฟล์ของฉัน</button></div><div class="account-separate-note"><b>บัญชีแยกจากกัน</b><span>เมื่อออกจากระบบ ข้อมูลของผู้เรียนคนนี้จะถูกซิงก์ก่อน แล้วผู้เรียนคนถัดไปจึง Login ด้วยบัญชีของตัวเอง</span></div><p class="account-note">ยังไม่มีบัญชี? ให้ผู้ดูแลกดเมนู “ผู้เรียน” แล้วสร้าง Username และ Password ให้ · ไม่มีปุ่มสมัครสมาชิกจากหน้านี้</p></section>`;
    document.body.appendChild(el);
    const user=el.querySelector('#aUser'),pass=el.querySelector('#aPass'),login=el.querySelector('#aLogin'),show=el.querySelector('#aShowPass');
    show.onclick=()=>{const visible=pass.type==='text';pass.type=visible?'password':'text';show.textContent=visible?'แสดง':'ซ่อน';pass.focus()};
    const submit=async()=>{
      const e=el.querySelector('#aError');
      if(!user.value.trim()){e.textContent='กรุณากรอก Username';user.focus();return}
      if(!pass.value){e.textContent='กรุณากรอก Password';pass.focus();return}
      login.disabled=true;login.textContent='กำลังเข้าสู่ระบบ...';e.textContent='กำลังตรวจสอบบัญชี...';
      const payload={action:'login',username:user.value.trim(),password:pass.value};
      const {r,d}=await api({method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}).catch(()=>({r:{ok:false},d:{}}));
      if(!r.ok){e.textContent=errorText(d.error);login.disabled=false;login.textContent='เข้าสู่โปรไฟล์ของฉัน';return}
      e.textContent='เข้าสู่ระบบสำเร็จ กำลังเปิดโปรไฟล์...';
      clear();sessionStorage.clear();location.reload();
    };
    login.onclick=submit;
    [user,pass].forEach(input=>input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submit()}}));
  }

  function unavailable(message){
    document.querySelector('#accountOverlay')?.remove();
    const el=document.createElement('div');el.className='account-overlay';el.id='accountOverlay';
    el.innerHTML=`<section class="account-card"><div class="account-logo">M</div><h1>ยังเปิดบทเรียนไม่ได้</h1><p>${message}</p><div class="account-actions"><button class="account-primary" id="accountRetry">ลองเชื่อมต่อใหม่</button></div><p class="account-note">ระบบซ่อนหน้าบทเรียนไว้จนกว่าจะตรวจสอบบัญชีผู้เรียนสำเร็จ เพื่อป้องกันข้อมูลสลับกัน</p></section>`;
    document.body.appendChild(el);el.querySelector('#accountRetry').onclick=()=>location.reload();
  }

  async function logout(){
    const btn=document.querySelector('#accountLogout');if(btn){btn.disabled=true;btn.textContent='กำลังออก...'}
    await push(true);
    await api({method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'logout'})}).catch(()=>{});
    clear();sessionStorage.clear();location.reload();
  }

  function decorate(){
    const top=document.querySelector('.top-actions');if(!top)return;
    const displayName=status?.user?.displayName||status?.user?.username||'ผู้เรียน';
    const n=document.querySelector('#profileName');if(n){n.textContent=displayName;n.title=`โปรไฟล์ของ ${displayName}`}
    const profileBtn=document.querySelector('#profileBtn');if(profileBtn)profileBtn.setAttribute('aria-label',`ผู้เรียน: ${displayName}`);
    if(!document.querySelector('#accountIdentity')){
      const tag=document.createElement('span');tag.id='accountIdentity';tag.className='account-identity';tag.textContent=`@${status?.user?.username||'learner'}`;top.insertBefore(tag,profileBtn||null);
    }
    if(!document.querySelector('#accountLogout')){
      const b=document.createElement('button');b.id='accountLogout';b.className='account-top-btn';b.type='button';b.textContent='ออกจากบัญชี';b.setAttribute('aria-label',`ออกจากบัญชี ${displayName}`);b.onclick=logout;top.appendChild(b);
    }
    const localTools=document.querySelector('.local-tools');if(localTools)localTools.style.display='none';
    const intro=document.querySelector('#profileDialog .dialog-card > p');if(intro)intro.textContent=`กำลังใช้งานโปรไฟล์ ${displayName} · หลักสูตรและความคืบหน้าซิงก์แยกจากผู้เรียนคนอื่น`;
    const nameInput=document.querySelector('#nameInput');if(nameInput){nameInput.value=displayName;nameInput.disabled=true}
    const nameLabel=document.querySelector('label[for="nameInput"]');if(nameLabel)nameLabel.textContent='ชื่อบัญชีผู้เรียน';
    ['exportBackupBtn','importBackupBtn'].forEach(id=>{const el=document.querySelector('#'+id);if(el)el.style.display='none'});
  }

  async function boot(){
    const {r,d}=await api().catch(()=>({r:{ok:false},d:{}}));
    if(!r.ok){unavailable('ไม่สามารถตรวจสอบบัญชีผู้เรียนได้ กรุณาตรวจอินเทอร์เน็ตแล้วลองใหม่');return}
    if(!d.dbConfigured){unavailable('ระบบบัญชีผู้เรียนยังไม่ได้เชื่อมฐานข้อมูล กรุณาแจ้งผู้ดูแล');return}
    enabled=true;status=d;
    if(!d.authenticated){overlay(d);return}
    const m=`myEnglishHydrated:${d.user.id}`;
    if(!sessionStorage.getItem(m)){await pull();sessionStorage.setItem(m,'1');location.reload();return}
    lastRaw=rawSnap();unlockApp();decorate();watch();
  }
  boot();
  window.ACCOUNT_GATE_VERSION=VERSION;
})();
