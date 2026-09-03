(()=>{
  const TARGET=3000;
  const DEFAULT_DAILY=12;
  const DEFAULT_DAYS=6;
  const reviewSchedule=[1,3,7,14,30];

  function plan(){
    state.core3000Plan=state.core3000Plan||{daily:DEFAULT_DAILY,daysPerWeek:DEFAULT_DAYS,mastered:0,startedAt:new Date().toISOString(),sourceReady:false};
    return state.core3000Plan;
  }

  function estimate(daily,days){
    const weekly=daily*days;
    const weeks=Math.ceil(TARGET/weekly);
    const months=Math.round((weeks/4.345)*10)/10;
    return {weekly,weeks,months};
  }

  function currentMastered(){
    const p=plan();
    return Math.max(0,Math.min(TARGET,Number(p.mastered)||0));
  }

  function openLibrarySafely(){
    if(typeof window.openCore3000Library==='function'){
      window.openCore3000Library();
      return;
    }
    const existing=document.querySelector('script[data-core3000-library-loader="1"]');
    if(existing)return;
    const s=document.createElement('script');
    s.src='core3000-library.js?v=39';
    s.dataset.core3000LibraryLoader='1';
    s.onload=()=>{
      if(typeof window.openCore3000Library==='function')window.openCore3000Library();
      else alert('เปิดคลังคำศัพท์ไม่ได้ กรุณารีเฟรชหน้าแล้วลองใหม่');
    };
    s.onerror=()=>alert('โหลดคลังคำศัพท์ไม่ได้ กรุณาตรวจอินเทอร์เน็ตแล้วลองใหม่');
    document.head.appendChild(s);
  }

  function renderCard(){
    if(view!=='home')return;
    const app=document.querySelector('#app');
    if(!app||document.querySelector('#core3000Plan'))return;
    const p=plan();
    const e=estimate(p.daily,p.daysPerWeek);
    const mastered=currentMastered();
    const pct=Math.min(100,Math.round(mastered/TARGET*100));
    const anchor=document.querySelector('#learningRoadmap')||document.querySelector('#questHub')||app.querySelector('.hero');
    if(!anchor)return;
    const html=`<section id="core3000Plan" class="core3000-card">
      <div class="core3000-head"><div><div class="hero-kicker">CORE 3000 PLAN</div><h2>3,000 คำ → สนทนาได้มั่นใจขึ้น</h2><p>ระบบเลือกคำให้เอง · เรียนใหม่ ${p.daily} คำ/วัน · ${p.daysPerWeek} วัน/สัปดาห์ · 1 วันทบทวนใหญ่</p></div><div class="core3000-ring"><b>${pct}%</b><span>${mastered}/${TARGET}</span></div></div>
      <div class="core3000-progress"><i style="width:${pct}%"></i></div>
      <div class="core3000-stats"><div><b>${p.daily}</b><span>คำใหม่/วัน</span></div><div><b>${e.weekly}</b><span>คำใหม่/สัปดาห์</span></div><div><b>~${e.weeks}</b><span>สัปดาห์</span></div><div><b>~${e.months}</b><span>เดือน</span></div></div>
      <div class="core3000-routine"><b>🎧 วิธีผ่านแต่ละคำ</b><span>ฟังและพูดตาม 3 รอบ → รู้ความหมาย → อ่านประโยคตัวอย่าง → กดผ่านคำนี้</span></div>
      <div class="core3000-actions three"><button type="button" class="secondary-btn" id="core3000LibraryBtn">ดูคำศัพท์ทั้งหมด 3,000 คำ</button><button type="button" class="secondary-btn" id="core3000Settings">ปรับจำนวนคำ/วัน</button><button type="button" class="primary-btn" id="core3000Start">เริ่ม ${p.daily} คำวันนี้</button></div>
      <small class="core3000-note">ทบทวนแบบเว้นระยะ: วัน ${reviewSchedule.join(' · ')} หลังเรียนคำใหม่ · แหล่งคำความถี่ใช้เพื่อการศึกษา/ส่วนตัวและคัดกรองให้เหมาะกับผู้เรียน</small>
    </section>`;
    anchor.insertAdjacentHTML('afterend',html);
    document.querySelector('#core3000Start')?.addEventListener('click',()=>{
      if(typeof window.openCore3000Study==='function')window.openCore3000Study();
      else go('learn');
    });
    document.querySelector('#core3000Settings')?.addEventListener('click',openSettings);
  }

  function openSettings(){
    const p=plan();
    const wrap=document.createElement('div');
    wrap.className='game-lab-overlay';
    wrap.id='core3000Modal';
    wrap.innerHTML=`<section class="game-panel"><div class="game-panel-head"><h2>📚 แผน 3,000 คำ</h2><button class="game-close" type="button">×</button></div><div class="core3000-modal-body">
      <p>เลือกความเร็วที่เหมาะกับชีวิตจริง ไม่ควรเร่งจนทบทวนไม่ทัน</p>
      <div class="core3000-options">${[10,12,15,20].map(n=>{const e=estimate(n,p.daysPerWeek);return `<button class="core3000-option ${n===p.daily?'active':''}" data-daily="${n}"><b>${n} คำ/วัน</b><span>ประมาณ ${e.weeks} สัปดาห์</span></button>`}).join('')}</div>
      <div class="core3000-pass"><h3>เกณฑ์ผ่านคำศัพท์</h3><ol><li>เห็นคำแล้วนึกความหมายได้</li><li>ได้ยินแล้วรู้ว่าเป็นคำอะไร</li><li>ฟังและพูดตามอย่างน้อย 3 รอบ</li><li>เข้าใจประโยคตัวอย่างสั้น ๆ</li><li>ทบทวนผ่านอย่างน้อย 80% ในรอบ 30 วัน</li></ol></div>
      <div class="core3000-week"><b>ตารางแนะนำ</b><span>จันทร์–เสาร์: คำใหม่ + ทบทวนคำเก่า</span><span>อาทิตย์: ไม่เพิ่มคำใหม่ เน้นฟัง พูด Quiz และ AI Conversation</span></div>
    </div></section>`;
    document.body.appendChild(wrap);
    wrap.querySelector('.game-close').onclick=()=>wrap.remove();
    wrap.addEventListener('click',e=>{if(e.target===wrap)wrap.remove()});
    wrap.querySelectorAll('[data-daily]').forEach(btn=>btn.onclick=()=>{p.daily=Number(btn.dataset.daily)||DEFAULT_DAILY;saveState();wrap.remove();render();});
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest?.('#core3000LibraryBtn');
    if(!btn)return;
    e.preventDefault();
    openLibrarySafely();
  });

  const coreRender=render;
  render=function(){coreRender();requestAnimationFrame(renderCard)};
  window.addEventListener('DOMContentLoaded',()=>{plan();requestAnimationFrame(renderCard)});
})();