(()=>{
  const KEY='myEnglishV2';
  const LEVELS={
    starter:{id:'starter',label:'เริ่มต้น',cefr:'Pre-A1 / A1',cefrLevels:['A1'],roadmap:['L0','L1'],start:'L0',description:'เริ่มจากพื้นฐาน เสียง คำ และประโยคสั้น ๆ'},
    basic:{id:'basic',label:'พื้นฐาน',cefr:'A1–A2',cefrLevels:['A1','A2'],roadmap:['L1','L2'],start:'L1',description:'สื่อสารเรื่องชีวิตประจำวันและสร้างประโยคพื้นฐาน'},
    intermediate:{id:'intermediate',label:'กลาง',cefr:'A2–B1',cefrLevels:['A2','B1'],roadmap:['L2','L3','L4'],start:'L3',description:'ฝึกสถานการณ์จริง เล่าเรื่อง และสนทนาให้ต่อเนื่อง'},
    upper:{id:'upper',label:'กลางสูง',cefr:'B1–B2',cefrLevels:['B1','B2'],roadmap:['L4','L5'],start:'L4',description:'ฝึกสนทนาธรรมชาติ ความคิดเห็น และสถานการณ์ซับซ้อนขึ้น'}
  };
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return{}}}
  function currentId(){const id=read().learnerLevel;return LEVELS[id]?id:''}
  function info(id=currentId()){return LEVELS[id]||null}
  function write(id){
    if(!LEVELS[id])return false;
    const s=read();s.learnerLevel=id;s.learnerLevelUpdatedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(s));
    try{if(typeof state==='object'&&state){state.learnerLevel=id;state.learnerLevelUpdatedAt=s.learnerLevelUpdatedAt;if(typeof saveState==='function')saveState()}}catch{}
    document.dispatchEvent(new CustomEvent('learner-level:changed',{detail:LEVELS[id]}));
    applyUI();return true;
  }
  function filterOxford(list){const i=info();if(!i)return Array.isArray(list)?list:[];const allowed=new Set(i.cefrLevels);const filtered=(Array.isArray(list)?list:[]).filter(e=>allowed.has(String(e?.level||'').toUpperCase()));return filtered.length?filtered:(Array.isArray(list)?list:[])}
  function injectProfile(){
    const form=document.querySelector('#profileForm');if(!form||form.querySelector('#learnerLevelSelect'))return;
    const utility=form.querySelector('.utility-grid');
    const box=document.createElement('div');box.className='learner-level-field';
    box.innerHTML=`<label for="learnerLevelSelect">ระดับการเรียนของผู้เรียน</label><select id="learnerLevelSelect">${Object.values(LEVELS).map(l=>`<option value="${l.id}">${esc(l.label)} · ${esc(l.cefr)}</option>`).join('')}</select><small id="learnerLevelHelp">การเลือกระดับใช้สำหรับแนะนำ Roadmap และสุ่ม Oxford 3000/Quiz ให้เหมาะกับผู้เรียน โดยไม่ลบหรือเปลี่ยนความคืบหน้าเดิม</small>`;
    if(utility)utility.insertAdjacentElement('beforebegin',box);else form.querySelector('.dialog-actions')?.insertAdjacentElement('beforebegin',box);
    const sel=box.querySelector('select');sel.value=currentId()||'starter';sel.onchange=()=>{write(sel.value);syncProfile()};
  }
  function syncProfile(){const sel=document.querySelector('#learnerLevelSelect'),i=info();if(sel&&i&&sel.value!==i.id)sel.value=i.id;const help=document.querySelector('#learnerLevelHelp');if(help&&i){const text=`${i.label} · ${i.cefr} — ${i.description} · เปลี่ยนระดับได้ตลอดโดยความคืบหน้าเดิมไม่ถูกรีเซ็ต`;if(help.textContent!==text)help.textContent=text}}
  function badge(){
    const top=document.querySelector('.top-actions');if(!top)return;
    let b=document.querySelector('#learnerLevelBadge');if(!b){b=document.createElement('button');b.id='learnerLevelBadge';b.type='button';b.className='learner-level-badge';b.onclick=()=>{injectProfile();syncProfile();document.querySelector('#profileDialog')?.showModal?.()};const profile=document.querySelector('#profileBtn');if(profile)top.insertBefore(b,profile);else top.appendChild(b)}
    const i=info(),text=i?`ระดับ ${i.cefr}`:'เลือกระดับ',title=i?`${i.label} · ${i.description}`:'เลือกระดับการเรียน';if(b.textContent!==text)b.textContent=text;if(b.title!==title)b.title=title;
  }
  function markRoadmap(){
    const i=info();document.querySelectorAll('[data-path-level]').forEach(b=>{const recommended=!!(i&&i.roadmap.includes(b.dataset.pathLevel));b.classList.toggle('learner-recommended',recommended);let tag=b.querySelector('.learner-rec-tag');if(recommended){const text=b.dataset.pathLevel===i.start?'เริ่มตรงนี้':'แนะนำ';if(!tag){tag=document.createElement('em');tag.className='learner-rec-tag';b.appendChild(tag)}if(tag.textContent!==text)tag.textContent=text}else tag?.remove()});
    const road=document.querySelector('#learningRoadmap');if(!road)return;let note=road.querySelector('.learner-roadmap-note');if(!note){note=document.createElement('div');note.className='learner-roadmap-note';const track=road.querySelector('.roadmap-track');track?.insertAdjacentElement('afterend',note)}const key=i?.id||'none';if(note.dataset.level===key)return;note.dataset.level=key;if(i)note.innerHTML=`<b>ระดับของคุณ: ${esc(i.label)} · ${esc(i.cefr)}</b><span>แนะนำให้เริ่มที่ ${esc(i.start)} แต่บทที่เรียนจบและเปอร์เซ็นต์เดิมยังคงเหมือนเดิมทั้งหมด</span>`;else note.textContent='เลือกระดับผู้เรียนเพื่อให้ระบบแนะนำจุดเริ่มที่เหมาะสม';
  }
  function firstChoice(){
    if(currentId()||document.querySelector('#learnerLevelSetup')||document.documentElement.classList.contains('account-locked'))return;
    const w=document.createElement('div');w.id='learnerLevelSetup';w.className='learner-level-setup';w.innerHTML=`<section><div class="account-logo">M</div><h2>เลือกระดับการเรียน</h2><p>เลือกจากระดับปัจจุบันของคุณ ระบบจะใช้เพื่อแนะนำบทและสุ่มคำศัพท์ที่เหมาะสม <b>ข้อมูลและความคืบหน้าเดิมจะไม่ถูกลบ</b></p><div class="learner-level-options">${Object.values(LEVELS).map(l=>`<button type="button" data-set-level="${l.id}"><b>${esc(l.label)}</b><span>${esc(l.cefr)}</span><small>${esc(l.description)}</small></button>`).join('')}</div></section>`;document.body.appendChild(w);w.querySelectorAll('[data-set-level]').forEach(b=>b.onclick=()=>{write(b.dataset.setLevel);w.remove()})
  }
  function applyUI(){if(document.documentElement.classList.contains('account-locked'))return;injectProfile();syncProfile();badge();markRoadmap()}
  const style=document.createElement('style');style.textContent=`.learner-level-field{margin:14px 0;padding:13px;border:1px solid rgba(34,211,238,.18);border-radius:16px;background:rgba(8,145,178,.06)}.learner-level-field label{margin:0 0 7px!important}.learner-level-field select{width:100%;padding:11px 12px;border-radius:12px;border:1px solid rgba(148,163,184,.22);background:#071424;color:#fff;font:inherit}.learner-level-field small{display:block;color:#94a3b8;line-height:1.5;margin-top:7px}.learner-level-badge{border:1px solid rgba(34,211,238,.28);background:rgba(8,145,178,.1);color:#a5f3fc;border-radius:999px;padding:8px 10px;font-size:11px;font-weight:850;cursor:pointer;white-space:nowrap}.roadmap-level.learner-recommended{border-color:rgba(34,211,238,.55)!important;box-shadow:0 0 0 1px rgba(34,211,238,.12) inset}.learner-rec-tag{margin-left:auto!important;font-size:9px!important;font-style:normal!important;color:#67e8f9!important;background:rgba(8,145,178,.14);border:1px solid rgba(34,211,238,.2);padding:4px 7px;border-radius:999px;white-space:nowrap}.learner-roadmap-note{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:12px 0;color:#94a3b8;font-size:11px}.learner-roadmap-note b{color:#67e8f9}.learner-level-setup{position:fixed;inset:0;z-index:9997;background:rgba(2,6,23,.9);display:grid;place-items:center;padding:18px}.learner-level-setup>section{width:min(650px,96vw);max-height:92vh;overflow:auto;background:#0c1a2d;border:1px solid rgba(148,163,184,.2);border-radius:26px;padding:24px;box-shadow:0 30px 90px rgba(0,0,0,.45)}.learner-level-setup h2{margin:8px 0;color:#fff}.learner-level-setup p{color:#94a3b8;line-height:1.6}.learner-level-options{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:15px}.learner-level-options button{text-align:left;border:1px solid rgba(148,163,184,.18);background:#091525;color:#fff;border-radius:16px;padding:14px;cursor:pointer}.learner-level-options button:hover{border-color:rgba(34,211,238,.5)}.learner-level-options b,.learner-level-options span,.learner-level-options small{display:block}.learner-level-options span{color:#67e8f9;font-weight:800;margin-top:3px}.learner-level-options small{color:#94a3b8;line-height:1.45;margin-top:5px}@media(max-width:640px){.learner-level-options{grid-template-columns:1fr}}@media(max-width:520px){.learner-level-badge{display:none}}`;document.head.appendChild(style);
  document.addEventListener('app:rendered',()=>setTimeout(applyUI,0));document.addEventListener('learner-level:changed',()=>setTimeout(applyUI,0));
  const timer=setInterval(()=>{if(!document.documentElement.classList.contains('account-locked')){applyUI();firstChoice();clearInterval(timer)}},250);
  window.getLearnerLevel=()=>currentId();window.getLearnerLevelInfo=()=>info();window.setLearnerLevel=write;window.filterOxfordByLearnerLevel=filterOxford;window.LEARNER_LEVELS=LEVELS;
})();