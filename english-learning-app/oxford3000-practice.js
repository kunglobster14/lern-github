(()=>{
  const esc=v=>typeof window.oxfordEsc==='function'?window.oxfordEsc(v):String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const say=v=>typeof window.oxfordSpeak==='function'?window.oxfordSpeak(v):(()=>{try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(v||''));u.lang='en-US';u.rate=.86;speechSynthesis.speak(u)}catch{}})();
  const reading=v=>typeof window.oxfordThaiReading==='function'?window.oxfordThaiReading(v):String(v||'');
  const shuffle=a=>typeof window.oxfordShuffle==='function'?window.oxfordShuffle(a):[...a].sort(()=>Math.random()-.5);
  function overlay(){
    document.querySelector('#oxfordQuizModal')?.remove();
    const root=document.createElement('div');root.id='oxfordQuizModal';root.className='oxford-extra-overlay';
    root.innerHTML=`<section class="oxford-extra-panel"><header><div><h2>🧠 Oxford 3000 · Random Quiz</h2><small>สุ่มจากคำศัพท์ทั้ง 3,000 คำทุกครั้ง</small></div><button class="oxford-extra-close" type="button">×</button></header><main id="oxfordQuizBody"><div class="core-study-loading"><div class="listen-orb">Aa</div><h3>กำลังสุ่มคำทดสอบ...</h3></div></main></section>`;
    document.body.appendChild(root);root.querySelector('.oxford-extra-close').onclick=()=>root.remove();return root;
  }
  async function openQuiz(){
    const root=overlay();
    try{
      if(typeof window.ensureOxford3000==='function')await window.ensureOxford3000();
      const list=typeof window.getOxford3000==='function'?window.getOxford3000():[];if(list.length<3000)throw new Error(`oxford_not_ready_${list.length}`);
      const questions=shuffle(list).slice(0,20);run(root,list,questions);
    }catch(err){root.querySelector('#oxfordQuizBody').innerHTML=`<div class="core-study-error"><h3>เปิด Quiz ไม่สำเร็จ</h3><p>Oxford 3000 ยังโหลดไม่ครบ</p><small>${esc(err?.message||'unknown')}</small></div>`}
  }
  function run(root,list,questions){
    let index=0,score=0,answered=false,selected='';
    const draw=()=>{
      if(index>=questions.length)return finish();
      const q=questions[index];
      const wrongPool=shuffle(list.filter(e=>e.word!==q.word&&e.thai&&e.thai!==q.thai)).slice(0,3);
      const options=shuffle([q,...wrongPool]);
      root.querySelector('#oxfordQuizBody').innerHTML=`<div class="oxford-quiz-progress"><b>${index+1}/20</b><span>คะแนน ${score}</span></div><div class="oxford-quiz-card"><div class="oxford-quiz-level">${esc(q.level||'')} · ${esc(q.part||'')}</div><h3>${esc(q.word)}</h3><p>คำนี้มีความหมายว่าอะไร?</p><div class="oxford-quiz-options">${options.map(o=>`<button type="button" data-word="${esc(o.word)}" class="${answered?(o.word===q.word?'correct':(o.word===selected?'wrong':'')):''}" ${answered?'disabled':''}>${esc(o.thai||'-')}</button>`).join('')}</div>${answered?`<div class="oxford-quiz-answer"><b>${selected===q.word?'✓ ถูกต้อง':'✗ คำตอบที่ถูกคือ'} ${esc(q.word)}</b><span>คำอ่าน: ${esc(reading(q.word))} · ${esc(q.thai||'-')}</span><button type="button" id="oxfordQuizSay">🔊 ฟังคำนี้</button></div><button class="primary-btn oxford-quiz-next" id="oxfordQuizNext">${index===questions.length-1?'ดูผลคะแนน':'คำถัดไป →'}</button>`:''}</div>`;
      if(!answered){root.querySelectorAll('[data-word]').forEach(btn=>btn.onclick=()=>{answered=true;selected=btn.dataset.word;if(selected===q.word)score++;say(q.word);draw()})}
      else{root.querySelector('#oxfordQuizSay').onclick=()=>say(q.word);root.querySelector('#oxfordQuizNext').onclick=()=>{index++;answered=false;selected='';draw()}}
    };
    const finish=()=>{const pct=Math.round(score/questions.length*100);root.querySelector('#oxfordQuizBody').innerHTML=`<div class="oxford-quiz-finish"><div class="core-finish-icon">${pct>=80?'🏆':'📘'}</div><h2>${score}/20 คะแนน</h2><p>${pct}% · ${pct>=80?'ผ่านเกณฑ์ 80%':'ลองสุ่มชุดใหม่เพื่อทบทวนเพิ่มเติม'}</p><div class="lab-actions"><button class="lab-secondary" id="oxfordQuizClose">ปิด</button><button class="lab-primary" id="oxfordQuizAgain">สุ่มทดสอบใหม่</button></div></div>`;root.querySelector('#oxfordQuizClose').onclick=()=>root.remove();root.querySelector('#oxfordQuizAgain').onclick=()=>openQuiz()};draw();
  }
  window.openOxford3000Quiz=openQuiz;
})();
