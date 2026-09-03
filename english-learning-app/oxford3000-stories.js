(()=>{
  const STORY_SEED=300043;
  const esc=v=>typeof window.oxfordEsc==='function'?window.oxfordEsc(v):String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const say=v=>typeof window.oxfordSpeak==='function'?window.oxfordSpeak(v):(()=>{try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(v||''));u.lang='en-US';u.rate=.86;speechSynthesis.speak(u)}catch{}})();
  const reading=v=>typeof window.oxfordThaiReading==='function'?window.oxfordThaiReading(v):String(v||'');
  const shuffle=a=>typeof window.oxfordShuffle==='function'?window.oxfordShuffle(a,STORY_SEED):[...a];
  const themes=[
    ['The First Train','การเดินทางด้วยรถไฟครั้งแรก','Mina leaves home before sunrise to take a train to a town she has never seen. Every stop brings a new person, a new problem, and a small decision.'],
    ['A Small Café by the River','คาเฟ่เล็กริมแม่น้ำ','Ben helps his aunt reopen an old café. Customers, deliveries, weather, and unexpected conversations turn one ordinary week into a lesson about people.'],
    ['The Lost Blue Notebook','สมุดสีน้ำเงินที่หายไป','A blue notebook disappears from a classroom. Four friends follow clues through school, the market, and the neighborhood before the truth becomes clear.'],
    ['Seven Days in a New City','เจ็ดวันในเมืองใหม่','Nora moves to a busy city for a short course. She must find her way, meet strangers, solve daily problems, and learn how the city really works.'],
    ['The Weekend Project','โปรเจกต์สุดสัปดาห์','A group of neighbors decide to repair an empty community room. They have little money, different ideas, and only one weekend to finish.'],
    ['Across the Green Island','ข้ามเกาะสีเขียว','Two friends travel across an island with one map and a simple plan. Weather, roads, local families, and changing choices shape their adventure.'],
    ['The Quiet Office','สำนักงานที่เงียบผิดปกติ','On Monday morning an office is unusually quiet. A missing file, a delayed meeting, and a series of messages lead the team through a surprising day.'],
    ['A Promise to the Village','คำสัญญากับหมู่บ้าน','A young teacher returns to a village and promises to help create a small learning center. The work grows into a project shared by many people.'],
    ['The Night Market Challenge','ภารกิจตลาดกลางคืน','Friends accept a challenge to run a tiny food stall for one night. They must plan, communicate, handle customers, and adapt when things go wrong.'],
    ['The Road Home','เส้นทางกลับบ้าน','After months away, Alex travels home through several towns. Old memories and new conversations help him understand what he wants to do next.']
  ];
  const beats=['At the beginning','A little later','By the next stop','During the conversation','After a short pause','Before they continue','Soon after that','As the situation changes','Near the end of the day','The next morning'];
  function overlay(){
    document.querySelector('#oxfordStoriesModal')?.remove();
    const root=document.createElement('div');root.id='oxfordStoriesModal';root.className='oxford-extra-overlay';
    root.innerHTML=`<section class="oxford-extra-panel oxford-story-panel"><header><div><h2>📚 Oxford 3000 · Reading Stories</h2><small>10 เรื่อง · เรื่องละ 300 คำเป้าหมาย · รวมครบ 3,000 คำ</small></div><button class="oxford-extra-close" type="button">×</button></header><main id="oxfordStoriesBody"><div class="core-study-loading"><div class="listen-orb">Aa</div><h3>กำลังเตรียมเรื่องอ่าน...</h3></div></main></section>`;
    document.body.appendChild(root);root.querySelector('.oxford-extra-close').onclick=()=>root.remove();return root;
  }
  async function getData(){if(typeof window.ensureOxford3000==='function')await window.ensureOxford3000();const list=typeof window.getOxford3000==='function'?window.getOxford3000():[];if(list.length<3000)throw new Error(`oxford_not_ready_${list.length}`);return shuffle(list).slice(0,3000)}
  async function openStories(){
    const root=overlay();
    try{const list=await getData();drawMenu(root,list)}catch(err){root.querySelector('#oxfordStoriesBody').innerHTML=`<div class="core-study-error"><h3>เปิดเรื่องอ่านไม่ได้</h3><p>Oxford 3000 ยังโหลดไม่ครบ</p><small>${esc(err?.message||'unknown')}</small></div>`}
  }
  function drawMenu(root,list){
    root.querySelector('#oxfordStoriesBody').innerHTML=`<div class="oxford-story-intro"><h3>อ่านเรื่องและเก็บคำศัพท์จากบริบท</h3><p>คำเป้าหมายถูกกระจายแบบคงที่โดยไม่เรียง A–Z แต่ละคำอยู่ในเรื่องเดียวเท่านั้น เมื่อครบ 10 เรื่องจะครอบคลุม 3,000 คำ</p></div><div class="oxford-story-grid">${themes.map((t,i)=>`<button type="button" class="oxford-story-card" data-story="${i}"><span>เรื่อง ${i+1}</span><b>${esc(t[0])}</b><small>${esc(t[1])}</small><em>300 คำเป้าหมาย · CEFR A1–B2</em></button>`).join('')}</div>`;
    root.querySelectorAll('[data-story]').forEach(btn=>btn.onclick=()=>drawStory(root,list,Number(btn.dataset.story)||0));
  }
  function storyLine(entry){
    if(typeof window.oxfordHighlightExample==='function')return window.oxfordHighlightExample(entry);
    return `<u class="story-vocab" data-say="${esc(entry.word)}">${esc(entry.word)}</u> — ${esc(entry.example||'')}`;
  }
  function drawStory(root,list,index){
    const theme=themes[index],chunk=list.slice(index*300,(index+1)*300);
    const paragraphs=[];
    for(let p=0;p<30;p++){
      const group=chunk.slice(p*10,p*10+10);
      const lead=`${beats[p%beats.length]}, the characters notice how small choices change what happens next.`;
      paragraphs.push(`<p><span class="story-lead">${esc(lead)}</span> ${group.map(storyLine).join(' ')}</p>`);
    }
    root.querySelector('#oxfordStoriesBody').innerHTML=`<article class="oxford-story-article"><div class="oxford-story-toolbar"><button type="button" id="oxfordStoryBack">← กลับ 10 เรื่อง</button><span>เรื่อง ${index+1}/10 · 300 คำ</span></div><div class="oxford-story-title"><span>${esc(theme[1])}</span><h1>${esc(theme[0])}</h1><p>${esc(theme[2])}</p></div><div class="oxford-story-reading">${paragraphs.join('')}</div><section class="oxford-glossary"><h2>Vocabulary · 300 คำท้ายบท</h2><p>กด 🔊 เพื่อฟังเสียงจริง คำอ่านไทยเป็นคำอ่านโดยประมาณ</p><div class="oxford-glossary-grid">${chunk.map((e,i)=>`<div class="oxford-glossary-row"><span>${i+1}</span><div><b>${esc(e.word)} <em>${esc(e.level||'')}</em></b><small>${esc(reading(e.word))} · ${esc(e.thai||'-')}${e.part?` · ${esc(e.part)}`:''}</small></div><button type="button" data-glossary-say="${esc(e.word)}">🔊</button></div>`).join('')}</div></section></article>`;
    root.querySelector('#oxfordStoryBack').onclick=()=>drawMenu(root,list);
    root.querySelectorAll('[data-say]').forEach(el=>{el.tabIndex=0;el.title='กดเพื่อฟัง';el.onclick=()=>say(el.dataset.say);el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();say(el.dataset.say)}}});
    root.querySelectorAll('[data-glossary-say]').forEach(btn=>btn.onclick=()=>say(btn.dataset.glossarySay));
    root.querySelector('.oxford-extra-panel')?.scrollTo({top:0,behavior:'instant'});
  }
  window.openOxford3000Stories=openStories;
})();
