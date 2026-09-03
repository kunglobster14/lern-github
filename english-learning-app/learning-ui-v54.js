(()=>{
  const VERSION='v54';
  const PATHS={
    starter:{title:'เส้นทางจากพื้นฐาน → สนทนาได้',path:['L0','L1','L2','L3','L4','L5'],start:1},
    basic:{title:'เส้นทางชีวิตประจำวัน → สนทนาได้คล่องขึ้น',path:['L1','L2','L3','L4','L5'],start:22},
    intermediate:{title:'เส้นทาง A2–B1 → สนทนาต่อเนื่อง',path:['L2','L3','L4','L5'],start:71},
    upper:{title:'เส้นทาง B1–B2 → สื่อสารระดับกลางสูง',path:['L4','L5'],start:141}
  };
  const level=()=>{try{return window.getLearnerLevel?.()||'starter'}catch{return'starter'}};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function replaceDayText(root){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{const t=n.nodeValue||'';if(/\bDay\b|\bDAY\b/.test(t))n.nodeValue=t.replace(/\bDAY\b/g,'บทเรียน').replace(/\bDay\b/g,'บทเรียน')});
  }
  function patchDaily(){
    const card=document.querySelector('#dailyCourseCard');if(!card)return;
    const id=level(),cfg=PATHS[id]||PATHS.starter,info=window.getLearnerLevelInfo?.()||{label:id,cefr:''},lesson=window.getDailyLesson?.();
    const kicker=card.querySelector('.hero-kicker');if(kicker)kicker.textContent='หลักสูตรต่อเนื่อง · 210 บทเรียน';
    const h=card.querySelector('.daily-course-head h2');if(h)h.textContent=cfg.title;
    const p=card.querySelector('.daily-course-head p');if(p)p.innerHTML=`<b>${esc(info.label||id)} · ${esc(info.cefr||lesson?.cefr||'')}</b> · เส้นทางเรียนบทที่ ${cfg.start}–210 · ผ่านบทปัจจุบันแล้วเลือกบทถัดไปได้ทันที`;
    const ring=card.querySelector('.daily-course-ring b');if(ring&&lesson)ring.textContent=`บท ${lesson.day}`;
    const choose=card.querySelector('#dailyChooseDay');if(choose)choose.textContent='เลือกบทเรียน';
    const open=card.querySelector('#dailyOpenLesson');if(open&&lesson)open.textContent=`ดูบทเรียน ${lesson.day}`;
    const pass=card.querySelector('#dailyComplete');if(pass&&lesson){const progress=window.getDailyCourseProgress?.();const done=progress?.completed?.includes?.(lesson.day);pass.textContent=done?'เรียนบทนี้แล้ว · ไปบทถัดไป':'ผ่านบทนี้ · ปลดบทถัดไป'}
    let note=card.querySelector('.v54-course-note');if(!note){note=document.createElement('small');note.className='v54-course-note';card.querySelector('.daily-note')?.insertAdjacentElement('beforebegin',note)}
    if(note)note.textContent='ประโยค แบบฝึก และเกมจะสุ่มตามระดับและบทเรียนปัจจุบัน โดยหลีกเลี่ยงการวนซ้ำติดกัน';
    replaceDayText(card);
  }
  function patchRoadmap(){
    const road=document.querySelector('#learningRoadmap');if(!road)return;
    const id=level(),cfg=PATHS[id]||PATHS.starter;
    const buttons=[...road.querySelectorAll('[data-path-level]')];
    let hidden=0;buttons.forEach(b=>{const keep=cfg.path.includes(b.dataset.pathLevel);if(!keep)hidden++;b.hidden=!keep&&road.dataset.showPriorV54!=='1';b.classList.toggle('v54-prior',!keep)});
    const h=road.querySelector('.roadmap-head h2');if(h)h.textContent=`Milestone ตามระดับ · ${cfg.path.join(' → ')}`;
    const p=road.querySelector('.roadmap-head p');if(p)p.textContent='บทหลักเดิมใช้เป็น Milestone ตรวจทักษะ ส่วนเนื้อหาฝึกจริงจะเพิ่มความยากตามระดับและบทเรียนปัจจุบัน';
    let toggle=road.querySelector('#v54PriorToggle');
    if(hidden){if(!toggle){toggle=document.createElement('button');toggle.id='v54PriorToggle';toggle.type='button';toggle.className='secondary-btn';toggle.style.margin='0 0 10px';road.querySelector('.roadmap-levels')?.insertAdjacentElement('beforebegin',toggle);toggle.onclick=()=>{road.dataset.showPriorV54=road.dataset.showPriorV54==='1'?'0':'1';patchRoadmap()}}toggle.textContent=road.dataset.showPriorV54==='1'?`ซ่อนบททบทวนก่อนระดับ (${hidden})`:`ดูบททบทวนก่อนระดับ (${hidden})`}else toggle?.remove();
  }
  function patchProfile(){
    const select=document.querySelector('#learnerLevelSelect');if(select)[...select.options].forEach(o=>o.textContent=o.textContent.replace(/\bDay\b/g,'บทเรียน'));
    const help=document.querySelector('#learnerLevelHelp');if(help)help.textContent=help.textContent.replace(/\bDay\b/g,'บทเรียน');
    const setup=document.querySelector('#learnerLevelSetup');if(setup)replaceDayText(setup);
  }
  function patchLegacyAI(){
    document.querySelectorAll('[data-game="mission"] h3').forEach(e=>e.textContent='SENTENCE COACH Surprise Mission');
    document.querySelectorAll('[data-game="mission"] p').forEach(e=>e.textContent='สุ่มโจทย์แต่งประโยคตามระดับ · ตอบถูกแล้วไปข้อต่อไปพร้อมเสียงอ่าน');
    document.querySelectorAll('#unitAI').forEach(e=>e.textContent='ฝึกต่อกับ SENTENCE COACH');
    document.querySelectorAll('[data-go="ai"]').forEach(e=>{if(/AI/i.test(e.textContent||''))e.textContent=(e.textContent||'').replace(/AI Coach|AI/gi,'SENTENCE COACH')});
    const nav=document.querySelector('.nav-btn[data-view="ai"] span:last-child');if(nav)nav.textContent='SENTENCE COACH';
    const items=[...document.querySelectorAll('.quest-item')];
    try{const ids=state?.gameLab?.dailyQuestIds||[];items.forEach((el,i)=>{if(ids[i]!=='ai')return;const icon=el.querySelector('b'),txt=el.querySelector('span');if(icon&&!icon.textContent.includes('✅'))icon.textContent='✍';if(txt)txt.textContent=`${Number(state?.gameLab?.progress?.ai)||0}/1 ประโยค`})}catch{}
  }
  function patchAll(){if(document.documentElement.classList.contains('account-locked'))return;patchDaily();patchRoadmap();patchProfile();patchLegacyAI();document.querySelectorAll('#dailyLessonModal,#dailyChooserModal,#profileDialog').forEach(replaceDayText)}
  document.addEventListener('app:rendered',()=>{setTimeout(patchAll,0);setTimeout(patchAll,120)});
  document.addEventListener('learner-level:changed',()=>{setTimeout(patchAll,0);setTimeout(patchAll,120)});
  document.addEventListener('daily-course:changed',()=>{setTimeout(patchAll,0);setTimeout(patchAll,120)});
  document.addEventListener('click',()=>setTimeout(patchAll,0),true);
  setTimeout(patchAll,250);setTimeout(patchAll,900);
  window.patchLearningUIV54=patchAll;window.LEARNING_UI_VERSION=VERSION;
})();