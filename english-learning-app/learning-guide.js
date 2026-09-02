(()=>{
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function cardHtml(){
    return `<section class="learning-guide-card" id="learningGuideCard">
      <div class="learning-guide-head">
        <div><div class="learning-guide-kicker">START HERE · คู่มือสำหรับผู้เรียนใหม่</div><h2>👋 ไม่รู้จะเริ่มตรงไหน? เริ่มตามลำดับนี้</h2><p>ใช้หลักสูตรเป็นแกน แล้วฝึกคำศัพท์ ฟัง พูด อ่าน เขียน และคุยกับ AI ทุกวัน เพื่อให้ภาษาไปใช้จริงได้</p></div>
        <button class="learning-guide-open" id="learningGuideOpen" type="button">เปิดคู่มือเริ่มเรียน</button>
      </div>
      <div class="learning-guide-route"><span>1 · Roadmap</span><span>2 · Core 3000</span><span>3 · Review</span><span>4 · Quiz / Game</span><span>5 · เขียน</span><span>6 · AI Coach</span></div>
    </section>`;
  }

  function modalHtml(){
    return `<div class="learning-guide-overlay" id="learningGuideModal">
      <section class="learning-guide-panel" role="dialog" aria-modal="true" aria-label="คู่มือเริ่มเรียน">
        <div class="learning-guide-panel-head"><div><h2>📘 คู่มือเริ่มเรียน My English Coach</h2><p>ทำตามนี้ทุกวัน ไม่ต้องเลือกเนื้อหาเองมั่ว ๆ และไม่ต้องรีบข้ามระดับ</p></div><button class="learning-guide-close" id="learningGuideClose" type="button">ปิด</button></div>

        <div class="learning-guide-today">
          <div class="guide-step"><div class="guide-step-num">1</div><div><b>เริ่มจาก Learning Roadmap</b><span>เปิดบทแรกที่ยังไม่ผ่าน เริ่มจาก L0/A1 ถ้าเป็นผู้เริ่มต้น เรียน Pattern → ตัวอย่าง → ฟัง → พูด → ใช้ประโยคของตัวเอง</span></div></div>
          <div class="guide-step"><div class="guide-step-num">2</div><div><b>เรียน Core 3000 ประมาณ 12 คำ</b><span>ดูความหมายไทย ฟังเสียง พูดตามอย่างน้อย 3 รอบ อ่านตัวอย่าง และอย่ากดผ่านถ้ายังไม่เข้าใจความหมาย</span></div></div>
          <div class="guide-step"><div class="guide-step-num">3</div><div><b>ทบทวนคำเก่า</b><span>เปิดเมนูทบทวนก่อนเพิ่มคำใหม่มากเกินไป เป้าหมายคือจำและใช้คำได้ ไม่ใช่แค่สะสมจำนวนคำ</span></div></div>
          <div class="guide-step"><div class="guide-step-num">4</div><div><b>ทำ Quiz หรือ Game อย่างน้อย 1 รอบ</b><span>ใช้ Quiz, Listening, Word Match หรือ Sentence Builder ตรวจว่าจำได้จริงหรือเพียงแค่คุ้นตา</span></div></div>
          <div class="guide-step"><div class="guide-step-num">5</div><div><b>เขียนภาษาอังกฤษ 2–5 ประโยค</b><span>ใช้ Pattern และคำศัพท์ที่เรียนวันนี้เขียนเรื่องของตัวเอง เช่น งาน ชีวิตประจำวัน แผน หรือสถานการณ์เดินทาง</span></div></div>
          <div class="guide-step"><div class="guide-step-num">6</div><div><b>จบด้วย AI Coach 5–10 นาที</b><span>เอาสิ่งที่เรียนวันนี้ไปใช้สนทนาจริง ตอบเป็นอังกฤษก่อน แม้จะผิด แล้วอ่านและพูดประโยคที่ AI ช่วยแก้อีกครั้ง</span></div></div>
        </div>

        <div class="guide-section"><h3>⏱️ เวลาเรียนที่แนะนำ 30–45 นาที/วัน</h3><div class="guide-time"><div><b>10–15 นาที</b><span>Roadmap 1 บท</span></div><div><b>10–15 นาที</b><span>Core 3000</span></div><div><b>5–10 นาที</b><span>Review / Quiz</span></div><div><b>5–10 นาที</b><span>AI Conversation</span></div></div><div class="guide-note">ถ้ามีเวลาเพียง 20 นาที ให้ลดจำนวนกิจกรรมแต่ยังคงลำดับเดิม ความสม่ำเสมอสำคัญกว่าการเรียนยาวเพียงบางวัน</div></div>

        <div class="guide-section"><h3>🗓️ สัปดาห์แรกควรเน้นอะไร</h3><div class="guide-week"><div><b>วัน 1–2:</b> ทักทาย แนะนำตัว Hello / My name is… / I am… และคำสุภาพ Yes / No / Please / Thank you</div><div><b>วัน 3–4:</b> ตัวเลข เวลา ความต้องการ I want… / I need… และคำศัพท์ชีวิตประจำวัน</div><div><b>วัน 5:</b> ความชอบ I like… / I don’t like… และถามตอบเรื่องตัวเอง</div><div><b>วัน 6:</b> Where…? / How much…? ฝึกถามทาง ซื้อของ และสถานการณ์จริง</div><div><b>วัน 7:</b> ไม่เร่งคำใหม่ เน้น Review, Listening, Quiz และคุยกับ AI จากสิ่งที่เรียนมาทั้งสัปดาห์</div><div><b>เป้าหมายปลายสัปดาห์:</b> พูดแนะนำตัว บอกงาน/ความชอบ/ความต้องการ และถามคำถามง่าย ๆ ได้เอง</div></div></div>

        <div class="guide-section"><h3>✅ เมื่อไรควรไปบทถัดไป</h3><ol class="guide-pass"><li>เข้าใจ Pattern และความหมายโดยไม่ต้องเดาทุกคำ</li><li>แต่งประโยคของตัวเองได้อย่างน้อย 2–3 ประโยค</li><li>ฟังประโยคสั้นแล้วจับใจความหลักได้</li><li>พูดตอบ AI ได้ แม้ยังไม่ถูกไวยากรณ์ 100%</li><li>Quiz / Review ได้ประมาณ 80% หรือรู้ว่าจุดที่ผิดคืออะไร</li></ol><div class="guide-note">อย่าใช้ XP เป็นเป้าหมายหลัก เป้าหมายจริงคือ “ฟังเข้าใจ → คิดประโยค → พูดตอบ → อ่านและเขียนได้”</div></div>

        <div class="guide-section"><h3>🎯 เป้าหมายการใช้งานจริง</h3><div class="guide-week"><div><b>ชีวิตประจำวัน:</b> แนะนำตัว ซื้อของ สั่งอาหาร นัดหมาย ขอความช่วยเหลือ และคุยเรื่องทั่วไป</div><div><b>เดินทาง:</b> สนามบิน โรงแรม ร้านอาหาร ถามทาง แท็กซี่ กระเป๋าหาย และสถานการณ์ฉุกเฉิน</div><div><b>ทำงาน:</b> อัปเดตงาน ขอข้อมูล แจ้งปัญหา ประชุมง่าย ๆ โทรศัพท์ และเขียนข้อความ/อีเมล</div><div><b>ระดับต่อไป:</b> เล่าเรื่อง แสดงความคิดเห็น อธิบายเหตุผล อ่านบทความ เขียนย่อหน้า และสนทนาต่อเนื่อง</div></div></div>

        <div class="guide-actions"><button class="guide-primary" id="guideGoRoadmap" type="button">1 · ไป Learning Roadmap</button><button class="guide-secondary" id="guideGoCore" type="button">2 · เรียน Core 3000</button><button class="guide-secondary" id="guideGoReview" type="button">3 · ไปทบทวน</button><button class="guide-secondary" id="guideGoAI" type="button">6 · ไป AI Coach</button></div>
      </section>
    </div>`;
  }

  function closeModal(){document.querySelector('#learningGuideModal')?.remove()}
  function highlight(el){if(!el)return;el.classList.remove('guide-highlight');void el.offsetWidth;el.classList.add('guide-highlight');el.scrollIntoView({behavior:'smooth',block:'center'})}

  function openModal(){
    closeModal();document.body.insertAdjacentHTML('beforeend',modalHtml());
    const root=document.querySelector('#learningGuideModal');
    root.querySelector('#learningGuideClose').onclick=closeModal;
    root.addEventListener('click',e=>{if(e.target===root)closeModal()});
    root.querySelector('#guideGoRoadmap').onclick=()=>{closeModal();try{if(typeof go==='function')go('home')}catch{};setTimeout(()=>{const r=document.querySelector('#learningRoadmap');highlight(r);const first=r?.querySelector('[data-path-level="L0"]');if(first)first.focus({preventScroll:true})},120)};
    root.querySelector('#guideGoCore').onclick=()=>{closeModal();setTimeout(()=>{if(typeof window.openCore3000Study==='function')window.openCore3000Study();else{const c=document.querySelector('#core3000Plan');highlight(c)}},80)};
    root.querySelector('#guideGoReview').onclick=()=>{closeModal();try{go('review')}catch{}};
    root.querySelector('#guideGoAI').onclick=()=>{closeModal();try{go('ai')}catch{}};
  }

  function renderCard(){
    if(typeof view!=='undefined'&&view!=='home')return;
    const app=document.querySelector('#app');if(!app||document.querySelector('#learningGuideCard'))return;
    const hero=app.querySelector('.hero');if(!hero)return;
    hero.insertAdjacentHTML('afterend',cardHtml());
    document.querySelector('#learningGuideOpen')?.addEventListener('click',openModal);
  }

  window.openLearningGuide=openModal;
  window.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(renderCard));
  const observer=new MutationObserver(()=>{if(typeof view!=='undefined'&&view==='home'&&!document.querySelector('#learningGuideCard'))requestAnimationFrame(renderCard)});
  observer.observe(document.querySelector('#app')||document.body,{childList:true,subtree:true});
})();
