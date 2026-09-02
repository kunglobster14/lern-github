(()=>{
  const KEYS=['myEnglishV2','myEnglishCompleteCourseV1','myEnglishLearningPathV1'];
  let status=null,enabled=false,last='',timer=null;
  const api=async(options={})=>{const r=await fetch(options.url||'/api/account',{cache:'no-store',credentials:'same-origin',...options});const d=await r.json().catch(()=>({}));return{r,d}};
  const snap=()=>{const o={};KEYS.forEach(k=>{const v=localStorage.getItem(k);if(v!==null){try{o[k]=JSON.parse(v)}catch{o[k]=v}}});return o};
  const clear=()=>KEYS.forEach(k=>localStorage.removeItem(k));
  const apply=o=>{clear();Object.entries(o||{}).forEach(([k,v])=>{if(KEYS.includes(k))localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v))})};
  const errorText=c=>({invalid_credentials:'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',invalid_username:'Username ต้องยาว 3–30 ตัว และใช้ตัวอักษร ตัวเลข จุด ขีด หรือ _',invalid_password:'Password ต้องมีอย่างน้อย 8 ตัวอักษร',username_taken:'Username นี้ถูกใช้แล้ว',registration_closed:'ปิดการสมัครแล้ว ให้ผู้ดูแลสร้างบัญชีให้',user_limit_reached:'มีผู้เรียนครบ 10 คนแล้ว'}[c]||'เกิดข้อผิดพลาด กรุณาลองใหม่');

  async function pull(){const {r,d}=await api({url:'/api/state'});if(r.ok){apply(d.state||{});last=JSON.stringify(snap())}}
  async function push(force=false){if(!enabled||!status?.authenticated)return;const text=JSON.stringify(snap());if(!force&&text===last)return;last=text;await api({url:'/api/state',method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({state:JSON.parse(text)}),keepalive:true}).catch(()=>{})}
  function watch(){setInterval(()=>{if(JSON.stringify(snap())!==last){clearTimeout(timer);timer=setTimeout(()=>push(),900)}},1400);window.addEventListener('pagehide',()=>push(true));}

  function overlay(s){
    const el=document.createElement('div');el.className='account-overlay';el.id='accountOverlay';
    el.innerHTML=`<section class="account-card"><div class="account-logo">M</div>${s.databaseMode==='temporary'?'<span class="account-test">TEMP DATABASE TEST</span>':''}<h1>My English Coach</h1><p>เข้าสู่ระบบด้วยชื่อของคุณ เพื่อให้หลักสูตรและความคืบหน้าแยกจากผู้เรียนคนอื่น</p><label class="account-field"><span>Username</span><input id="aUser" autocomplete="username"></label><label class="account-field"><span>Password</span><input id="aPass" type="password" autocomplete="current-password"></label>${s.publicRegistration?'<label class="account-field"><span>ชื่อที่แสดง</span><input id="aName" autocomplete="name"></label>':''}<div class="account-error" id="aError"></div><div class="account-actions"><button class="account-primary" id="aLogin">เข้าสู่ระบบ</button>${s.publicRegistration?'<button class="account-secondary" id="aRegister">สร้างบัญชีแรก</button>':''}</div><p class="account-note">Core 3000, หลักสูตร, Quiz, Review และ XP จะบันทึกแยกตามบัญชี</p></section>`;
    document.body.appendChild(el);
    const submit=async action=>{const e=el.querySelector('#aError');e.textContent='กำลังดำเนินการ...';const payload={action,username:el.querySelector('#aUser').value.trim(),password:el.querySelector('#aPass').value,displayName:el.querySelector('#aName')?.value.trim()||el.querySelector('#aUser').value.trim()};const {r,d}=await api({method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});if(!r.ok){e.textContent=errorText(d.error);return}clear();sessionStorage.clear();location.reload()};
    el.querySelector('#aLogin').onclick=()=>submit('login');el.querySelector('#aRegister')?.addEventListener('click',()=>submit('register'));
  }

  function decorate(){const top=document.querySelector('.top-actions');if(!top||document.querySelector('#accountLogout'))return;const b=document.createElement('button');b.id='accountLogout';b.className='account-top-btn';b.textContent='ออกจากระบบ';b.onclick=async()=>{await push(true);await api({method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'logout'})});clear();sessionStorage.clear();location.reload()};top.appendChild(b);const n=document.querySelector('#profileName');if(n&&status.user?.displayName)n.textContent=status.user.displayName;}

  async function boot(){const {r,d}=await api().catch(()=>({r:{ok:false},d:{}}));if(!r.ok||!d.dbConfigured)return;const temp=new URLSearchParams(location.search).get('accountTest')==='1';if(d.databaseMode==='temporary'&&!temp)return;enabled=true;status=d;if(!d.authenticated){overlay(d);return}const m=`myEnglishHydrated:${d.user.id}`;if(!sessionStorage.getItem(m)){await pull();sessionStorage.setItem(m,'1');location.reload();return}last=JSON.stringify(snap());decorate();watch()}
  boot();
})();
