(()=>{
  const STORY_SEED=300043;
  const esc=v=>typeof window.oxfordEsc==='function'?window.oxfordEsc(v):String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[ch]));
  const say=v=>typeof window.oxfordSpeak==='function'?window.oxfordSpeak(v):(()=>{try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(v||''));u.lang='en-US';u.rate=.86;speechSynthesis.speak(u)}catch{}})();
  const reading=v=>typeof window.oxfordThaiReading==='function'?window.oxfordThaiReading(v):String(v||'');
  const shuffle=a=>typeof window.oxfordShuffle==='function'?window.oxfordShuffle(a,STORY_SEED):[...a];
  const themes=[
    ['The First Train','การเดินทางด้วยรถไฟครั้งแรก','Mina leaves home before sunrise to take a train to a town she has never seen. Every stop brings a new person, a new problem, and a small decision.','มินาออกจากบ้านก่อนพระอาทิตย์ขึ้นเพื่อขึ้นรถไฟไปเมืองที่เธอไม่เคยเห็น ทุกสถานีมีคนใหม่ ปัญหาใหม่ และการตัดสินใจเล็ก ๆ รออยู่'],
    ['A Small Café by the River','คาเฟ่เล็กริมแม่น้ำ','Ben helps his aunt reopen an old café. Customers, deliveries, weather, and unexpected conversations turn one ordinary week into a lesson about people.','เบนช่วยป้าของเขาเปิดคาเฟ่เก่าริมแม่น้ำอีกครั้ง ลูกค้า การส่งของ สภาพอากาศ และบทสนทนาที่ไม่คาดคิด ทำให้หนึ่งสัปดาห์ธรรมดากลายเป็นบทเรียนเรื่องผู้คน'],
    ['The Lost Blue Notebook','สมุดสีน้ำเงินที่หายไป','A blue notebook disappears from a classroom. Four friends follow clues through school, the market, and the neighborhood before the truth becomes clear.','สมุดสีน้ำเงินหายไปจากห้องเรียน เพื่อนสี่คนตามเบาะแสไปทั่วโรงเรียน ตลาด และละแวกบ้าน ก่อนจะค้นพบความจริง'],
    ['Seven Days in a New City','เจ็ดวันในเมืองใหม่','Nora moves to a busy city for a short course. She must find her way, meet strangers, solve daily problems, and learn how the city really works.','นอร่าย้ายมาอยู่เมืองที่วุ่นวายเพื่อเรียนหลักสูตรระยะสั้น เธอต้องหาทาง พบผู้คนใหม่ ๆ แก้ปัญหาในชีวิตประจำวัน และเรียนรู้ว่าเมืองนี้ดำเนินไปอย่างไร'],
    ['The Weekend Project','โปรเจกต์สุดสัปดาห์','A group of neighbors decide to repair an empty community room. They have little money, different ideas, and only one weekend to finish.','เพื่อนบ้านกลุ่มหนึ่งตัดสินใจซ่อมห้องชุมชนที่ว่างอยู่ พวกเขามีเงินไม่มาก ความคิดแตกต่างกัน และมีเวลาเพียงสุดสัปดาห์เดียว'],
    ['Across the Green Island','ข้ามเกาะสีเขียว','Two friends travel across an island with one map and a simple plan. Weather, roads, local families, and changing choices shape their adventure.','เพื่อนสองคนเดินทางข้ามเกาะด้วยแผนที่หนึ่งใบและแผนง่าย ๆ สภาพอากาศ ถนน ครอบครัวท้องถิ่น และการตัดสินใจที่เปลี่ยนไป ทำให้การเดินทางของพวกเขาไม่ธรรมดา'],
    ['The Quiet Office','สำนักงานที่เงียบผิดปกติ','On Monday morning an office is unusually quiet. A missing file, a delayed meeting, and a series of messages lead the team through a surprising day.','เช้าวันจันทร์สำนักงานเงียบผิดปกติ แฟ้มที่หายไป การประชุมที่ล่าช้า และข้อความหลายชุด พาทีมไปพบกับวันที่เต็มไปด้วยเรื่องไม่คาดคิด'],
    ['A Promise to the Village','คำสัญญากับหมู่บ้าน','A young teacher returns to a village and promises to help create a small learning center. The work grows into a project shared by many people.','ครูหนุ่มสาวคนหนึ่งกลับมายังหมู่บ้านและสัญญาว่าจะช่วยสร้างศูนย์การเรียนรู้ขนาดเล็ก งานนี้ค่อย ๆ เติบโตเป็นโครงการที่คนจำนวนมากร่วมมือกัน'],
    ['The Night Market Challenge','ภารกิจตลาดกลางคืน','Friends accept a challenge to run a tiny food stall for one night. They must plan, communicate, handle customers, and adapt when things go wrong.','กลุ่มเพื่อนรับความท้าทายให้เปิดแผงขายอาหารเล็ก ๆ หนึ่งคืน พวกเขาต้องวางแผน สื่อสาร รับมือลูกค้า และปรับตัวเมื่อเกิดปัญหา'],
    ['The Road Home','เส้นทางกลับบ้าน','After months away, Alex travels home through several towns. Old memories and new conversations help him understand what he wants to do next.','หลังจากจากบ้านไปหลายเดือน อเล็กซ์เดินทางกลับผ่านหลายเมือง ความทรงจำเก่าและบทสนทนาใหม่ช่วยให้เขาเข้าใจว่าต่อไปอยากทำอะไร']
  ];
  const beats=[
    ['At the beginning, the characters notice how small choices change what happens next.','ในช่วงเริ่มต้น ตัวละครสังเกตว่าการตัดสินใจเล็ก ๆ สามารถเปลี่ยนสิ่งที่จะเกิดขึ้นต่อไปได้'],
    ['A little later, a new detail makes the situation more interesting.','ไม่นานต่อมา รายละเอียดใหม่ทำให้สถานการณ์น่าสนใจขึ้น'],
    ['By the next stop, everyone has learned something useful.','เมื่อถึงจุดต่อไป ทุกคนได้เรียนรู้สิ่งที่มีประโยชน์บางอย่าง'],
    ['During the conversation, they begin to understand each other better.','ระหว่างการสนทนา พวกเขาเริ่มเข้าใจกันมากขึ้น'],
    ['After a short pause, they decide what to do next.','หลังจากหยุดพักสั้น ๆ พวกเขาตัดสินใจว่าจะทำอะไรต่อ'],
    ['Before they continue, they check the details one more time.','ก่อนเดินหน้าต่อ พวกเขาตรวจรายละเอียดอีกครั้ง'],
    ['Soon after that, another small problem appears.','หลังจากนั้นไม่นาน ปัญหาเล็ก ๆ อีกอย่างก็เกิดขึ้น'],
    ['As the situation changes, they adjust their plan together.','เมื่อสถานการณ์เปลี่ยน พวกเขาปรับแผนร่วมกัน'],
    ['Near the end of the day, the result begins to become clear.','ใกล้สิ้นวัน ผลลัพธ์เริ่มชัดเจนขึ้น'],
    ['The next morning, they see the situation from a different point of view.','เช้าวันถัดมา พวกเขามองสถานการณ์จากมุมที่ต่างออกไป']
  ];
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
    const theme=themes[index],chunk=list.slice(index*300,(index+1)*300),sentenceMap=[];
    const paragraphs=[];
    for(let p=0;p<30;p++){
      const group=chunk.slice(p*10,p*10+10),beat=beats[p%beats.length];
      const sentenceHtml=group.map(entry=>{
        const id=sentenceMap.length;
        sentenceMap.push({english:String(entry.example||entry.word||''),thai:String(entry.exampleThai||entry.thai||''),speech:String(entry.example||entry.word||'')});
        return `<button type="button" class="story-sentence" data-story-sentence="${id}" aria-label="ดูคำแปลประโยค">${storyLine(entry)}</button>`;
      }).join(' ');
      const thaiGroup=group.map(entry=>String(entry.exampleThai||entry.thai||'')).filter(Boolean).join(' ');
      paragraphs.push(`<section class="story-paragraph"><p><span class="story-lead">${esc(beat[0])}</span> ${sentenceHtml}</p><div class="story-paragraph-translation" hidden><b>คำแปลย่อหน้านี้</b><p>${esc(beat[1])} ${esc(thaiGroup)}</p></div></section>`);
    }
    root.querySelector('#oxfordStoriesBody').innerHTML=`<article class="oxford-story-article"><div class="oxford-story-toolbar"><button type="button" id="oxfordStoryBack">← กลับ 10 เรื่อง</button><div class="oxford-story-toolbar-actions"><button type="button" id="oxfordTranslateAll" aria-pressed="false">🇹🇭 แปลทั้งเรื่อง</button><span>เรื่อง ${index+1}/10 · 300 คำ</span></div></div><div class="oxford-story-title"><span>${esc(theme[1])}</span><h1>${esc(theme[0])}</h1><p>${esc(theme[2])}</p><p class="story-summary-thai" hidden>${esc(theme[3])}</p></div><div class="oxford-story-translation-hint">💡 แตะประโยคเพื่อดูคำแปล · บนคอมพิวเตอร์สามารถชี้เมาส์เพื่อดู Popup ได้</div><div class="oxford-story-reading">${paragraphs.join('')}</div><section class="oxford-glossary"><h2>Vocabulary · 300 คำท้ายบท</h2><p>กด 🔊 เพื่อฟังเสียงจริง คำอ่านไทยเป็นคำอ่านโดยประมาณ</p><div class="oxford-glossary-grid">${chunk.map((e,i)=>`<div class="oxford-glossary-row"><span>${i+1}</span><div><b>${esc(e.word)} <em>${esc(e.level||'')}</em></b><small>${esc(reading(e.word))} · ${esc(e.thai||'-')}${e.part?` · ${esc(e.part)}`:''}</small></div><button type="button" data-glossary-say="${esc(e.word)}">🔊</button></div>`).join('')}</div></section><aside id="storyTranslationPopover" class="story-translation-popover" hidden aria-live="polite"><div class="story-translation-popover-head"><b>🇹🇭 คำแปลประโยค</b><button type="button" data-pop-close aria-label="ปิดคำแปล">×</button></div><p class="story-pop-en"></p><p class="story-pop-th"></p><button type="button" class="story-pop-say">🔊 ฟังประโยค</button></aside></article>`;
    root.querySelector('#oxfordStoryBack').onclick=()=>drawMenu(root,list);
    const translateAll=root.querySelector('#oxfordTranslateAll');
    translateAll.onclick=()=>{
      const show=translateAll.getAttribute('aria-pressed')!=='true';
      translateAll.setAttribute('aria-pressed',String(show));
      translateAll.textContent=show?'🇬🇧 ซ่อนคำแปลไทย':'🇹🇭 แปลทั้งเรื่อง';
      root.querySelectorAll('.story-paragraph-translation,.story-summary-thai').forEach(el=>el.hidden=!show);
    };
    const pop=root.querySelector('#storyTranslationPopover'),popEn=pop.querySelector('.story-pop-en'),popTh=pop.querySelector('.story-pop-th'),popSay=pop.querySelector('.story-pop-say');
    let activeSpeech='',hoverTimer=null,pinned=false;
    const hidePop=()=>{if(!pinned)pop.hidden=true};
    const showPop=(id,anchor,lock=false)=>{
      const item=sentenceMap[Number(id)];if(!item)return;
      pinned=lock;activeSpeech=item.speech;popEn.textContent=item.english||'-';popTh.textContent=item.thai||'ยังไม่มีคำแปล';pop.hidden=false;
      const rect=anchor.getBoundingClientRect(),w=Math.min(430,Math.max(280,window.innerWidth-24));
      let left=Math.max(12,Math.min(rect.left,window.innerWidth-w-12)),top=rect.bottom+8;
      if(top+220>window.innerHeight)top=Math.max(12,rect.top-220);
      pop.style.left=`${left}px`;pop.style.top=`${top}px`;
    };
    root.querySelectorAll('[data-story-sentence]').forEach(btn=>{
      btn.onclick=e=>{if(e.target.closest('[data-say]'))return;showPop(btn.dataset.storySentence,btn,true)};
      btn.onmouseenter=()=>{if(window.matchMedia?.('(hover:hover) and (pointer:fine)').matches){clearTimeout(hoverTimer);showPop(btn.dataset.storySentence,btn,false)}};
      btn.onmouseleave=()=>{if(!pinned)hoverTimer=setTimeout(()=>{if(!pop.matches(':hover'))hidePop()},120)};
    });
    pop.onmouseenter=()=>clearTimeout(hoverTimer);pop.onmouseleave=()=>{if(!pinned){hoverTimer=setTimeout(hidePop,100)}};
    pop.querySelector('[data-pop-close]').onclick=()=>{pinned=false;pop.hidden=true};
    popSay.onclick=()=>say(activeSpeech);
    root.querySelectorAll('[data-say]').forEach(el=>{el.tabIndex=0;el.title='กดเพื่อฟังคำศัพท์';el.onclick=e=>{e.stopPropagation();say(el.dataset.say)};el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();say(el.dataset.say)}}});
    root.querySelectorAll('[data-glossary-say]').forEach(btn=>btn.onclick=()=>say(btn.dataset.glossarySay));
    root.querySelector('.oxford-extra-panel')?.scrollTo({top:0,behavior:'instant'});
  }
  window.openOxford3000Stories=openStories;
})();
