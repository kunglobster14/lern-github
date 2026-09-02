const words = [
  ['work','ทำงาน / งาน','เวิร์ก','I work every day.','ฉันทำงานทุกวัน'],
  ['water','น้ำ','วอ-เทอร์','I want some water.','ฉันต้องการน้ำ'],
  ['food','อาหาร','ฟูด','The food is good.','อาหารอร่อย'],
  ['home','บ้าน','โฮม','I am at home.','ฉันอยู่บ้าน'],
  ['go','ไป','โก','I go to work.','ฉันไปทำงาน'],
  ['come','มา','คัม','Please come here.','กรุณามาที่นี่'],
  ['want','ต้องการ','วอนท์','I want coffee.','ฉันต้องการกาแฟ'],
  ['need','จำเป็น / ต้องการ','นีด','I need help.','ฉันต้องการความช่วยเหลือ'],
  ['like','ชอบ','ไลก์','I like music.','ฉันชอบดนตรี'],
  ['today','วันนี้','ทู-เดย์','I work today.','วันนี้ฉันทำงาน']
];

const quiz = [
  { q:'work แปลว่าอะไร?', c:['ทำงาน / งาน','น้ำ','บ้าน'], a:0 },
  { q:'I want water. หมายถึงอะไร?', c:['ฉันทำงานวันนี้','ฉันต้องการน้ำ','ฉันอยู่บ้าน'], a:1 },
  { q:'คำว่า บ้าน คือคำใด?', c:['food','home','come'], a:1 },
  { q:'I need help. หมายถึงอะไร?', c:['ฉันต้องการความช่วยเหลือ','ฉันชอบดนตรี','ฉันไปทำงาน'], a:0 },
  { q:'today แปลว่าอะไร?', c:['เมื่อวาน','วันนี้','พรุ่งนี้'], a:1 }
];

const STORAGE_KEY = 'myEnglishV1';
let state = loadState();
let view = 'home';
let wordIndex = 0;
let quizIndex = 0;
let quizScore = 0;

function loadState(){
  const fallback = { name:'ผู้เรียน', known:[], weak:[], xp:0, streak:1, quizBest:0 };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return fallback;
  }
}

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  document.querySelector('#profileName').textContent = state.name;
}

function go(nextView){
  view = nextView;
  document.querySelectorAll('.nav-btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === nextView);
  });
  render();
}

function homeView(){
  const progress = Math.round((state.known.length / words.length) * 100);
  return `
    <section class="hero">
      <div class="hero-row">
        <div><h2>สวัสดี ${escapeHtml(state.name)} 👋</h2><p>วันนี้เรียนสั้น ๆ 10–15 นาทีก็พอ</p></div>
        <div class="streak">🔥 ${state.streak} วัน</div>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
    </section>
    <div class="section-title"><h2>ฝึกวันนี้</h2><span class="muted">เป้าหมาย 10 นาที</span></div>
    <section class="grid">
      <article class="card"><div class="card-icon">📖</div><h3>คำศัพท์</h3><p>คำอ่านไทยและประโยคตัวอย่าง</p><button class="card-action" data-go="learn">เริ่มเรียน</button></article>
      <article class="card"><div class="card-icon">🎯</div><h3>Quiz</h3><p>ทดสอบ 5 ข้อ</p><button class="card-action" id="quizStart">เริ่ม Quiz</button></article>
      <article class="card"><div class="card-icon">🔄</div><h3>ทบทวน</h3><p>คำที่ยังจำไม่ได้</p><button class="card-action" data-go="review">ทบทวน ${state.weak.length} คำ</button></article>
      <article class="card"><div class="card-icon">📊</div><h3>ความคืบหน้า</h3><p>${state.known.length} คำ • ${state.xp} XP</p><button class="card-action" data-go="progress">ดูสถิติ</button></article>
    </section>`;
}

function learnView(){
  const word = words[wordIndex];
  return `
    <div class="section-title"><h2>คำศัพท์พื้นฐาน</h2><span class="muted">${wordIndex + 1}/${words.length}</span></div>
    <section class="learning-card">
      <div class="word">${word[0]}</div>
      <div class="pronunciation">${word[2]}</div>
      <div class="meaning">${word[1]}</div>
      <button class="secondary-btn" id="speak" type="button">🔊 ฟังเสียง</button>
      <div class="example"><strong>${word[3]}</strong><br><span class="muted">${word[4]}</span></div>
      <div class="row"><button class="danger-btn" id="weak" type="button">ยังจำไม่ได้</button><button class="primary-btn" id="known" type="button">จำได้แล้ว</button></div>
    </section>`;
}

function reviewView(){
  if (!state.weak.length) {
    return `<div class="empty"><h2>🎉 ไม่มีคำที่ต้องทบทวน</h2><button class="primary-btn" data-go="learn">ไปเรียน</button></div>`;
  }
  return `<div class="section-title"><h2>คำที่ต้องทบทวน</h2></div><div class="list">${state.weak.map((key) => {
    const word = words.find((item) => item[0] === key);
    if (!word) return '';
    return `<div class="list-item"><div><strong>${word[0]} — ${word[1]}</strong><br><span class="muted">${word[3]}</span></div><button class="secondary-btn speak-review" data-word="${word[0]}" type="button">🔊</button></div>`;
  }).join('')}</div>`;
}

function progressView(){
  return `<div class="section-title"><h2>ความคืบหน้า</h2><span class="status-pill">Demo Mode</span></div><section class="stats"><div class="stat"><strong>${state.known.length}</strong><span>คำที่จำได้</span></div><div class="stat"><strong>${state.quizBest}%</strong><span>Quiz สูงสุด</span></div><div class="stat"><strong>${state.xp}</strong><span>XP</span></div></section>`;
}

function quizView(){
  if (quizIndex >= quiz.length) {
    const scorePercent = Math.round((quizScore / quiz.length) * 100);
    state.quizBest = Math.max(state.quizBest, scorePercent);
    state.xp += quizScore * 5;
    saveState();
    return `<div class="empty"><h2>🏆 Quiz เสร็จแล้ว</h2><h1>${scorePercent}%</h1><button class="primary-btn" data-go="home">กลับหน้าแรก</button></div>`;
  }
  const question = quiz[quizIndex];
  return `<div class="section-title"><h2>Quiz</h2><span>${quizIndex + 1}/${quiz.length}</span></div><section class="card"><h2>${question.q}</h2><div class="choices">${question.c.map((choice,index) => `<button class="choice-btn" data-choice="${index}" type="button">${choice}</button>`).join('')}</div></section>`;
}

function render(){
  const app = document.querySelector('#app');
  app.innerHTML = view === 'home' ? homeView() : view === 'learn' ? learnView() : view === 'review' ? reviewView() : view === 'progress' ? progressView() : quizView();

  app.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => go(button.dataset.go)));
  app.querySelector('#quizStart')?.addEventListener('click', () => { quizIndex = 0; quizScore = 0; go('quiz'); });
  app.querySelector('#speak')?.addEventListener('click', () => speak(words[wordIndex][0]));
  app.querySelectorAll('.speak-review').forEach((button) => button.addEventListener('click', () => speak(button.dataset.word)));
  app.querySelector('#known')?.addEventListener('click', () => markWord(true));
  app.querySelector('#weak')?.addEventListener('click', () => markWord(false));
  app.querySelectorAll('[data-choice]').forEach((button) => button.addEventListener('click', () => answerQuestion(button)));
  saveState();
}

function markWord(isKnown){
  const key = words[wordIndex][0];
  if (isKnown) {
    if (!state.known.includes(key)) {
      state.known.push(key);
      state.xp += 10;
    }
    state.weak = state.weak.filter((item) => item !== key);
  } else if (!state.weak.includes(key)) {
    state.weak.push(key);
  }
  wordIndex = (wordIndex + 1) % words.length;
  saveState();
  render();
}

function answerQuestion(button){
  const question = quiz[quizIndex];
  const selected = Number(button.dataset.choice);
  document.querySelectorAll('[data-choice]').forEach((item) => { item.disabled = true; });
  if (selected === question.a) {
    button.classList.add('correct');
    quizScore += 1;
  } else {
    button.classList.add('wrong');
    document.querySelectorAll('[data-choice]')[question.a].classList.add('correct');
  }
  setTimeout(() => { quizIndex += 1; render(); }, 650);
}

function speak(text){
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}

function escapeHtml(value){
  return String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

document.querySelectorAll('.nav-btn').forEach((button) => button.addEventListener('click', () => go(button.dataset.view)));
const profileDialog = document.querySelector('#profileDialog');
document.querySelector('#profileBtn').addEventListener('click', () => {
  document.querySelector('#nameInput').value = state.name === 'ผู้เรียน' ? '' : state.name;
  profileDialog.showModal();
});
document.querySelector('#profileForm').addEventListener('submit', () => {
  const name = document.querySelector('#nameInput').value.trim();
  if (name) state.name = name;
  saveState();
  render();
});

render();
