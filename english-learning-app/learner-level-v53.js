(()=>{
  const VERSION='v53';
  const KEY='myEnglishV2';
  const LEVELS={
    starter:{id:'starter',label:'เริ่มต้น',cefr:'Pre-A1 / A1',cefrLevels:['A1'],startDay:1,start:'L0',roadmap:['L0','L1'],description:'เริ่มจากเสียง คำพื้นฐาน และประโยคสั้น ๆ'},
    basic:{id:'basic',label:'พื้นฐาน',cefr:'A1–A2',cefrLevels:['A1','A2'],startDay:22,start:'L1',roadmap:['L1','L2'],description:'ชีวิตประจำวัน ถาม–ตอบ และสร้างประโยคพื้นฐาน'},
    intermediate:{id:'intermediate',label:'กลาง',cefr:'A2–B1',cefrLevels:['A2','B1'],startDay:71,start:'L2',roadmap:['L2','L3','L4'],description:'อดีต อนาคต สถานการณ์จริง และสนทนาต่อเนื่อง'},
    upper:{id:'upper',label:'กลางสูง',cefr:'B1–B2',cefrLevels:['B1','B2'],startDay:141,start:'L4',roadmap:['L4','L5'],description:'ความคิดเห็น เหตุผล งาน และสถานการณ์ซับซ้อนขึ้น'}
  };
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return{}}}
  function currentId(){const id=read().learnerLevel;return LEVELS[id]?id:''}
  function info(id=currentId()){return LEVELS[id]||null}
  function saveLevel(id){
    if(!LEVELS[id])return false;
    const s=read();
    s.learnerLevel=id;
    s.learnerLevelUpdatedAt=new Date().toISOString();
    localStorage.setItem(KEY,JSON.stringify(s));
    try{
      if(typeof state==='object'&&state){
        state.learnerLevel=id;
        state.learnerLevelUpdatedAt=s.learnerLevelUpdatedAt;
        if(typeof saveState==='function')saveState();
      }
    }catch{}
    document.dispatchEvent(new CustomEvent('learner-level:changed',{detail:LEVELS[id]}));
    applyUI();
    return true;
  }
  function filterOxford(list){
    const i=info();
    if(!i)return Array.isArray(list)?list:[];
    const allowed=new Set(i.cefrLevels);
    const source=Array.isArray(list)?list:[];
    const filtered=source.filter(row=>{
      const level=Array.isArray(row)?row[3]:row?.level;
      return allowed.has(String(level||'').toUpperCase());
    });
    return filtered.length?filtered:source;
  }
  function injectProfile(){
    const form=document.querySelector('#profileForm');
    if(!form||form.querySelector('#learnerLevelSelect'))return;
    const utility=form.querySelector('.utility-grid');
    const box=document.createElement('div');
    box.className='learner-level-field';
    box.innerHTML=`<label for="learnerLevelSelect">ระดับภาษาและจุดเริ่มหลักสูตร</label><select id="learnerLevelSelect">${Object.values(LEVELS).map(l=>`<option value="${l.id}">${esc(l.label)} · ${esc(l.cefr)} · เริ่ม Day ${l.startDay}</option>`).join('')}</select><small id="learnerLevelHelp"></small>`;
    if(utility)utility.insertAdjacentElement('beforebegin',box);else form.querySelector('.dialog-actions')?.insertAdjacentElement('beforebegin',box);
    const sel=box.querySelector('select');
    sel.value=currentId()||'starter';
    sel.onchange=()=>saveLevel(sel.value);
  }
  function syncProfile(){
    const sel=document.querySelector('#learnerLevelSelect'),i=info();
    if(sel&&i&&sel.value!==i.id)sel.value=i.id;
    const help=document.querySelector('#learnerLevelHelp');
    if(help&&i)help.textContent=`${i.label} · ${i.cefr} — เริ่มหลักสูตรแนะนำที่ Day ${i.startDay} (${i.start}) · Oxford, Quiz, Game และ Sentence Coach จะใช้ระดับนี้ · เปลี่ยนระดับได้โดยไม่ลบความคืบหน้าเดิม`;
  }
  function badge(){
    const top=document.querySelector('.top-actions');if(!top)return;
    let b=document.querySelector('#learnerLevelBadge');
    if(!b){
      b=document.createElement('button');b.id='learnerLevelBadge';b.type='button';b.className='learner-level-badge';
      b.onclick=()=>{injectProfile();syncProfile();document.querySelector('#profileDialog')?.showModal?.()};
      const profile=document.querySelector('#profileBtn');if(profile)top.insertBefore(b,profile);else top.appendChild(b);
    }
    const i=info();
    b.textContent=i?`ระดับ ${i.cefr}`:'เลือกระดับ';
    b.title=i?`${i.label} · เริ่ม Day ${i.startDay} · ${i.description}`:'เลือกระดับภาษา';
  }
  function markRoadmap(){
    const i=info();
    document.querySelectorAll('[data-path-level]').forEach(b=>{
      const recommended=!!(i&&i.roadmap.includes(b.dataset.pathLevel));
      b.classList.toggle('learner-recommended',recommended);
      let tag=b.querySelector('.learner-rec-tag');
      if(recommended){
        const text=b.dataset.pathLevel===i.start?'จุดเริ่มระดับ':'ช่วงหลัก';
        if(!tag){tag=document.createElement('em');tag.className='learner-rec-tag';b.appendChild(tag)}
        tag.textContent=text;
      }else tag?.remove();
    });
  }
  function firstChoice(){
    if(currentId()||document.querySelector('#learnerLevelSetup')||document.documentElement.classList.contains('account-locked'))return;
    const w=document.createElement('div');w.id='learnerLevelSetup';w.className='learner-level-setup';
    w.innerHTML=`<section><div class="account-logo">M</div><h2>เลือกระดับภาษา</h2><p>ระดับที่เลือกจะกำหนด <b>Day เริ่มต้น</b> ของหลักสูตร 210 Day รวมถึง Oxford, Quiz, Game และ Sentence Coach โดยไม่ลบข้อมูลเดิม</p><div class="learner-level-options">${Object.values(LEVELS).map(l=>`<button type="button" data-set-level="${l.id}"><b>${esc(l.label)}</b><span>${esc(l.cefr)}</span><small>เริ่ม Day ${l.startDay} · ${esc(l.description)}</small></button>`).join('')}</div></section>`;
    document.body.appendChild(w);
    w.querySelectorAll('[data-set-level]').forEach(b=>b.onclick=()=>{saveLevel(b.dataset.setLevel);w.remove()});
  }
  function applyUI(){
    if(document.documentElement.classList.contains('account-locked'))return;
    injectProfile();syncProfile();badge();markRoadmap();
  }
  const style=document.createElement('style');style.textContent=`
    .learner-level-field{margin:14px 0;padding:13px;border:1px solid rgba(34,211,238,.18);border-radius:16px;background:rgba(8,145,178,.06)}
    .learner-level-field label{margin:0 0 7px!important}.learner-level-field select{width:100%;padding:11px 12px;border-radius:12px;border:1px solid rgba(148,163,184,.22);background:#071424;color:#fff;font:inherit}.learner-level-field small{display:block;color:#94a3b8;line-height:1.5;margin-top:7px}
    .learner-level-badge{border:1px solid rgba(34,211,238,.28);background:rgba(8,145,178,.1);color:#a5f3fc;border-radius:999px;padding:8px 10px;font-size:11px;font-weight:850;cursor:pointer;white-space:nowrap}
    .roadmap-level.learner-recommended{border-color:rgba(34,211,238,.55)!important;box-shadow:0 0 0 1px rgba(34,211,238,.12) inset}.learner-rec-tag{margin-left:auto!important;font-size:9px!important;font-style:normal!important;color:#67e8f9!important;background:rgba(8,145,178,.14);border:1px solid rgba(34,211,238,.2);padding:4px 7px;border-radius:999px;white-space:nowrap}
    .learner-level-setup{position:fixed;inset:0;z-index:9997;background:rgba(2,6,23,.9);display:grid;place-items:center;padding:18px}.learner-level-setup>section{width:min(680px,96vw);max-height:92vh;overflow:auto;background:#0c1a2d;border:1px solid rgba(148,163,184,.2);border-radius:26px;padding:24px;box-shadow:0 30px 90px rgba(0,0,0,.45)}.learner-level-setup h2{margin:8px 0;color:#fff}.learner-level-setup p{color:#94a3b8;line-height:1.6}.learner-level-options{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:15px}.learner-level-options button{text-align:left;border:1px solid rgba(148,163,184,.18);background:#091525;color:#fff;border-radius:16px;padding:14px;cursor:pointer}.learner-level-options button:hover{border-color:rgba(34,211,238,.5)}.learner-level-options b,.learner-level-options span,.learner-level-options small{display:block}.learner-level-options span{color:#67e8f9;font-weight:800;margin-top:3px}.learner-level-options small{color:#94a3b8;line-height:1.45;margin-top:5px}@media(max-width:640px){.learner-level-options{grid-template-columns:1fr}}@media(max-width:520px){.learner-level-badge{display:none}}
  `;document.head.appendChild(style);
  document.addEventListener('app:rendered',()=>requestAnimationFrame(applyUI));
  document.addEventListener('learner-level:changed',()=>requestAnimationFrame(applyUI));
  const boot=()=>{if(document.documentElement.classList.contains('account-locked'))return setTimeout(boot,300);applyUI();firstChoice()};setTimeout(boot,0);
  window.getLearnerLevel=()=>currentId();
  window.getLearnerLevelInfo=()=>info();
  window.setLearnerLevel=saveLevel;
  window.filterOxfordByLearnerLevel=filterOxford;
  window.LEARNER_LEVELS=LEVELS;
  window.LEARNER_LEVEL_VERSION=VERSION;
})();
