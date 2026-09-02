(()=>{
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  async function call(body){const r=await fetch('/api/account',{method:'POST',headers:{'content-type':'application/json'},credentials:'same-origin',cache:'no-store',body:JSON.stringify(body)});const d=await r.json().catch(()=>({}));return{r,d}}
  const msg=c=>({username_taken:'Username นี้ถูกใช้แล้ว',invalid_username:'Username ต้องยาว 3–30 ตัว',invalid_password:'Password ต้องมีอย่างน้อย 8 ตัวอักษร',user_limit_reached:'ครบ 10 บัญชีแล้ว',admin_required:'เฉพาะผู้ดูแลระบบ',user_not_found:'ไม่พบบัญชีผู้เรียน',cannot_reset_admin:'ไม่อนุญาตให้แก้บัญชี Admin'}[c]||'ดำเนินการไม่สำเร็จ');
  async function openAdmin(){
    const {r,d}=await call({action:'list-users'});if(!r.ok)return;
    document.querySelector('#accountAdmin')?.remove();
    const w=document.createElement('div');w.id='accountAdmin';w.className='account-admin-modal';
    w.innerHTML=`<section class="account-admin-panel"><div class="account-admin-head"><div><h2>👥 ผู้เรียน ${d.users.length}/${d.maxUsers}</h2><p style="color:#94a3b8;margin:4px 0 0">แต่ละบัญชีมีหลักสูตรและความคืบหน้าของตัวเอง</p></div><button class="account-secondary" id="adminClose">ปิด</button></div><div class="account-user-list">${d.users.map(u=>`<div class="account-user-row"><div><b>${esc(u.display_name)}</b><small>@${esc(u.username)} · ${esc(u.role)}</small></div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end"><span>${u.is_active?'ใช้งาน':'ปิด'}</span>${u.role==='learner'?`<button class="account-secondary" data-password-user="${esc(u.id)}" data-password-name="${esc(u.username)}" type="button">ตั้งรหัสใหม่</button><button class="account-secondary" data-reset-user="${esc(u.id)}" data-reset-name="${esc(u.username)}" type="button">รีเซ็ตการเรียน</button>`:''}</div></div>`).join('')}</div>${d.users.length<d.maxUsers?'<div class="account-create-grid"><input id="newDisplay" placeholder="ชื่อผู้เรียน"><input id="newUser" placeholder="Username"><input id="newPass" type="password" placeholder="Password อย่างน้อย 8 ตัว"><button class="account-primary" id="createLearner">+ สร้างบัญชีผู้เรียน</button></div><div class="account-error" id="adminError"></div>':''}</section>`;
    document.body.appendChild(w);w.querySelector('#adminClose').onclick=()=>w.remove();
    w.querySelector('#createLearner')?.addEventListener('click',async()=>{const e=w.querySelector('#adminError');e.textContent='กำลังสร้างบัญชี...';const {r:rr,d:dd}=await call({action:'create-user',displayName:w.querySelector('#newDisplay').value.trim(),username:w.querySelector('#newUser').value.trim(),password:w.querySelector('#newPass').value});if(!rr.ok){e.textContent=msg(dd.error);return}w.remove();openAdmin()});
    w.querySelectorAll('[data-password-user]').forEach(btn=>btn.addEventListener('click',async()=>{
      const username=btn.dataset.passwordName||'ผู้เรียน';
      const password=prompt(`ตั้ง Password ใหม่ให้ ${username}\nอย่างน้อย 8 ตัวอักษร`);if(password===null)return;
      if(password.length<8){alert('Password ต้องมีอย่างน้อย 8 ตัวอักษร');return}
      const confirmPassword=prompt('พิมพ์ Password ใหม่ซ้ำอีกครั้ง');if(confirmPassword===null)return;
      if(password!==confirmPassword){alert('Password สองครั้งไม่ตรงกัน');return}
      btn.disabled=true;btn.textContent='กำลังบันทึก...';
      const {r:rr,d:dd}=await call({action:'reset-password',userId:btn.dataset.passwordUser,password});
      if(!rr.ok){alert(msg(dd.error));btn.disabled=false;btn.textContent='ตั้งรหัสใหม่';return}
      alert(`ตั้ง Password ใหม่ให้ ${username} แล้ว ผู้เรียนสามารถ Login ด้วยรหัสใหม่ได้ทันที`);w.remove();openAdmin();
    }));
    w.querySelectorAll('[data-reset-user]').forEach(btn=>btn.addEventListener('click',async()=>{const username=btn.dataset.resetName||'ผู้เรียน';if(!confirm(`รีเซ็ตความคืบหน้าของ ${username} เป็นศูนย์ทั้งหมดหรือไม่?`))return;btn.disabled=true;btn.textContent='กำลังรีเซ็ต...';const {r:rr,d:dd}=await call({action:'reset-user',userId:btn.dataset.resetUser});if(!rr.ok){alert(msg(dd.error));btn.disabled=false;btn.textContent='รีเซ็ตการเรียน';return}alert(`รีเซ็ต ${username} แล้ว บัญชีนี้จะถูกออกจากระบบและเริ่มจากศูนย์เมื่อ Login ใหม่`);w.remove();openAdmin()}));
  }
  async function boot(){try{const r=await fetch('/api/account',{cache:'no-store',credentials:'same-origin'});const d=await r.json();if(!r.ok||!d.authenticated||d.user?.role!=='admin')return;const top=document.querySelector('.top-actions');if(!top||document.querySelector('#accountAdminBtn'))return;const b=document.createElement('button');b.id='accountAdminBtn';b.className='account-top-btn';b.textContent='👥 ผู้เรียน';b.onclick=openAdmin;top.insertBefore(b,document.querySelector('#accountLogout')||null)}catch{}}
  setTimeout(boot,800);
})();
