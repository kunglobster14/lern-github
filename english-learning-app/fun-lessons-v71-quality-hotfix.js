(()=>{
  const norm=x=>String(x||'').toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}' ]+/gu,' ').replace(/\s+/g,' ').trim();
  function sanitize(data){
    if(!data?.lesson) return data;
    const pairs=data.lesson.examplePairs||[];
    const taught=new Set(pairs.slice(0,2).map(p=>norm(p?.en)).filter(Boolean));
    const allQuiz=(data.quiz||[]).flatMap(q=>q?.o||q?.options||q?.choices||[]).map(String);
    const extra=pairs.slice(2).map(p=>String(p?.en||'')).filter(Boolean);
    const pool=[...allQuiz,...extra];
    const quiz=(data.quiz||[]).map((q,qi)=>{
      const correct=String(q?.c??q?.ans??q?.answer??q?.correct??'');
      const raw=(q?.o||q?.options||q?.choices||[]).map(String);
      const seen=new Set(),choices=[];
      for(const item of [correct,...raw,...pool]){
        const key=norm(item);
        if(!key||taught.has(key)||seen.has(key)) continue;
        seen.add(key);choices.push(item);
      }
      const answer=choices.find(x=>norm(x)===norm(correct))||correct;
      const distractors=choices.filter(x=>norm(x)!==norm(answer));
      const pos=qi%4,out=distractors.slice(0,3);out.splice(Math.min(pos,out.length),0,answer);
      return {...q,o:out.slice(0,4),c:answer};
    });
    const text=`${data.lesson.title||''} ${data.lesson.goal||''} ${data.lesson.scenario||''} ${data.lesson.pattern||''}`.toLowerCase();
    if(!/phone|message|appointment|speak to/.test(text)) return {...data,quiz};
    const clean=x=>String(x||'').replace(/age/gi,m=>m[0]+'\u200b'+m.slice(1));
    return {...data,quiz,lesson:{...data.lesson,title:clean(data.lesson.title),goal:clean(data.lesson.goal),scenario:clean(data.lesson.scenario),pattern:clean(data.lesson.pattern)}};
  }
  const provider=window.getFunLessonDataV68;
  if(typeof provider==='function'){
    const wrapped=day=>sanitize(provider(day));
    wrapped.__v72=provider.__v72;
    window.getFunLessonDataV68=wrapped;
  }
  const curriculum=window.getCurriculumLessonV72;
  if(typeof curriculum==='function') window.getCurriculumLessonV72=day=>sanitize(curriculum(day));
  window.sanitizeLessonTestV72=sanitize;

  const SPEECH_VERSION='v74-speech1';
  let activeRecognition=null;

  function injectSpeechStyles(){
    if(document.getElementById('speechV74Styles')) return;
    const s=document.createElement('style');
    s.id='speechV74Styles';
    s.textContent=`
      .v74-mic-status{margin-top:10px;padding:10px 12px;border-radius:12px;background:#eef4ff;color:#18345f;font-size:14px;line-height:1.45}
      .v74-mic-status.ok{background:#edf9f1;color:#17623a}.v74-mic-status.err{background:#fff1f1;color:#8b2424}
      .v74-meaning-label{display:block;font-size:12px;font-weight:700;letter-spacing:.02em;color:#71809a;margin-bottom:2px}
      .v74-speech-note{display:block;margin-top:7px;font-size:12px;color:#71809a;line-height:1.4}
      button.v74-listening{outline:2px solid #79a9ff;outline-offset:2px}
    `;
    document.head?.appendChild(s);
  }

  function exactLanguageScore(v,lang){
    const vl=String(v?.lang||'').toLowerCase(),want=lang.toLowerCase();
    if(vl===want) return 30;
    if(vl.startsWith(want.split('-')[0]+'-')) return 18;
    if(vl.startsWith(want.split('-')[0])) return 12;
    return -100;
  }
  function voiceScore(v,lang,gender){
    let n=String(v?.name||'').toLowerCase(),s=exactLanguageScore(v,lang);
    if(/natural|neural|premium|enhanced|online/.test(n))s+=14;
    if(/apple|google|microsoft|siri/.test(n))s+=5;
    if(v?.localService)s+=2;
    const male=/\b(male|man|daniel|david|mark|james|thomas|rishi|guy|alex)\b/;
    const female=/\b(female|woman|samantha|victoria|karen|moira|tessa|zira|aria|ava|jenny|siri)\b/;
    if(gender==='male'&&male.test(n))s+=5;
    if(gender==='female'&&female.test(n))s+=5;
    return s;
  }
  function bestVoice(lang,gender='female'){
    try{return (speechSynthesis.getVoices?.()||[]).filter(v=>exactLanguageScore(v,lang)>0).sort((a,b)=>voiceScore(b,lang,gender)-voiceScore(a,lang,gender))[0]||null}catch{return null}
  }
  function speakReliable(text,lang='en-US',gender='female',onend){
    text=String(text||'').trim();if(!text)return;
    try{
      speechSynthesis.cancel();
      const run=()=>{
        const u=new SpeechSynthesisUtterance(text);u.lang=lang;u.rate=lang.startsWith('th')?.9:.80;u.pitch=gender==='male'?.96:1;
        const v=bestVoice(lang,gender);if(v)u.voice=v;
        u.onend=()=>onend?.();u.onerror=()=>onend?.();speechSynthesis.speak(u);
      };
      const voices=speechSynthesis.getVoices?.()||[];
      if(voices.length)run();else{
        let done=false;const go=()=>{if(done)return;done=true;try{speechSynthesis.removeEventListener?.('voiceschanged',go)}catch{};run()};
        speechSynthesis.addEventListener?.('voiceschanged',go,{once:true});setTimeout(go,180);
      }
    }catch{onend?.()}
  }

  function statusBox(btn){
    const scope=btn.closest?.('.v72-voice,.v68-final,.v64-production,.v62-phase-body,section,form,dialog')||btn.parentElement;
    let box=scope?.querySelector?.('[data-f],.v74-mic-status');
    if(!box){box=document.createElement('div');box.className='v74-mic-status';btn.insertAdjacentElement('afterend',box)}
    if(!box.classList.contains('v74-mic-status'))box.classList.add('v74-mic-status');
    return box;
  }
  function setStatus(btn,text,type=''){
    const box=statusBox(btn);if(!box)return;box.textContent=text;box.classList.remove('ok','err');if(type)box.classList.add(type);
  }
  function inputForMic(btn){
    const prev=btn.previousElementSibling;if(prev?.matches?.('textarea,input:not([type]),input[type="text"]'))return prev;
    const row=btn.closest?.('.v68-input-row,.v72-voice,.v64-production,.v62-phase-body,section,form,dialog');
    return row?.querySelector?.('textarea[data-v],textarea[data-i],input[data-i],textarea,.v62-text-input,.v62-textarea,input[type="text"]')||null;
  }
  function restoreMic(btn,label){btn.disabled=false;btn.classList.remove('v74-listening');btn.textContent=label||'🎙 พูด'}
  function unsupportedMic(btn,input){
    restoreMic(btn,btn.dataset.v74Label||'🎙 พูด');
    setStatus(btn,'เบราว์เซอร์นี้ไม่รองรับการถอดเสียงจากไมค์โดยตรง ให้แตะช่องพิมพ์แล้วใช้ไมค์ Dictation บนคีย์บอร์ด iPhone หรือเปิดหน้านี้ใน Safari แล้วลองอีกครั้ง','err');
    try{input?.focus()}catch{}
  }
  async function startMic(btn){
    const input=inputForMic(btn);if(!input){setStatus(btn,'ไม่พบช่องสำหรับใส่คำตอบ กรุณาพิมพ์คำตอบแทน','err');return}
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){unsupportedMic(btn,input);return}
    if(activeRecognition){try{activeRecognition.abort()}catch{}activeRecognition=null}
    const original=btn.dataset.v74Label||btn.textContent||'🎙 พูด';btn.dataset.v74Label=original;
    btn.disabled=true;btn.classList.add('v74-listening');btn.textContent='🎙 กำลังขอสิทธิ์ไมค์…';
    try{
      if(navigator.mediaDevices?.getUserMedia){
        const stream=await navigator.mediaDevices.getUserMedia({audio:true});
        stream.getTracks().forEach(t=>t.stop());
      }
    }catch(err){
      const denied=String(err?.name||'').toLowerCase().includes('notallowed')||String(err?.name||'').toLowerCase().includes('security');
      restoreMic(btn,original);setStatus(btn,denied?'ไมค์ถูกปฏิเสธสิทธิ์ กรุณาอนุญาต Microphone ให้เว็บไซต์นี้ แล้วลองใหม่':'เปิดไมค์ไม่สำเร็จ ให้ลองใน Safari หรือใช้ไมค์ Dictation บนคีย์บอร์ด','err');return;
    }
    let got=false,ended=false;
    try{
      const r=new SR();activeRecognition=r;r.lang='en-US';r.interimResults=true;r.continuous=false;r.maxAlternatives=1;
      r.onstart=()=>{btn.textContent='🎙 กำลังฟัง…';setStatus(btn,'กำลังฟัง พูดภาษาอังกฤษได้เลย')};
      r.onspeechstart=()=>setStatus(btn,'ได้ยินเสียงแล้ว กำลังรับคำพูด…');
      r.onresult=e=>{
        let transcript='';for(let i=e.resultIndex||0;i<(e.results?.length||0);i++)transcript+=`${e.results[i][0]?.transcript||''} `;
        transcript=transcript.trim();if(!transcript)return;got=true;input.value=transcript;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));setStatus(btn,`✓ รับเสียงแล้ว: ${transcript}`,'ok');
      };
      r.onnomatch=()=>setStatus(btn,'ยังจับคำพูดไม่ได้ ลองพูดช้าลงและอยู่ใกล้ไมค์','err');
      r.onerror=e=>{
        const code=String(e?.error||'');const msg=code==='not-allowed'||code==='service-not-allowed'?'ไม่ได้รับอนุญาตใช้ไมค์ กรุณาอนุญาต Microphone หรือเปิดใน Safari':code==='no-speech'?'ยังไม่ได้ยินคำพูด ลองพูดใหม่อีกครั้ง':code==='audio-capture'?'ไม่พบไมโครโฟนของอุปกรณ์':code==='network'?'บริการถอดเสียงของเบราว์เซอร์ติดต่อไม่ได้ ลองใหม่หรือพิมพ์แทน':`รับเสียงไม่สำเร็จ${code?` (${code})`:''} ลองใหม่หรือพิมพ์แทน`;
        setStatus(btn,msg,'err');
      };
      r.onend=()=>{ended=true;if(activeRecognition===r)activeRecognition=null;if(!got&&!statusBox(btn)?.classList.contains('err'))setStatus(btn,'ไมค์หยุดแล้ว แต่ยังไม่มีข้อความ ลองพูดใหม่หรือใช้ Dictation บนคีย์บอร์ด','err');restoreMic(btn,original)};
      r.start();
      setTimeout(()=>{if(!ended&&!got){try{r.stop()}catch{}}},12000);
    }catch(err){activeRecognition=null;restoreMic(btn,original);setStatus(btn,'เริ่มระบบไมค์ไม่ได้ในเบราว์เซอร์นี้ ให้ใช้ Safari หรือไมค์ Dictation บนคีย์บอร์ด','err')}
  }

  function enhanceMicButtons(){
    document.querySelectorAll?.('button[data-mic],button[data-m],button.v65-mic-btn').forEach(btn=>{
      if(!btn.dataset.v74Label)btn.dataset.v74Label=btn.textContent||'🎙 พูด';
      if(btn.disabled&&!(activeRecognition&&btn.classList.contains('v74-listening'))){btn.disabled=false;if(/ไม่รองรับ/.test(btn.textContent||''))btn.textContent='🎙 พูด / Dictation'}
      btn.title='พูดภาษาอังกฤษผ่านไมค์ หรือใช้ Dictation บนคีย์บอร์ดได้';
    });
  }
  function labelMeanings(){
    document.querySelectorAll?.('.v72-model > span,.v72-dialog > div > span').forEach(span=>{
      if(span.dataset.v74Meaning==='1')return;span.dataset.v74Meaning='1';const lab=document.createElement('small');lab.className='v74-meaning-label';lab.textContent='ความหมายไทย';span.prepend(lab);
    });
    document.querySelectorAll?.('.v72-model').forEach(card=>{
      if(card.querySelector('.v74-speech-note'))return;const strong=card.querySelector('strong');if(!strong)return;const n=document.createElement('small');n.className='v74-speech-note';n.textContent='คำอ่านให้ยึดเสียงอังกฤษจากปุ่ม “ฟังและพูดตาม” ด้านล่าง ข้อความไทยคือความหมาย ไม่ใช่คำอ่าน';strong.insertAdjacentElement('afterend',n);
    });
  }
  function enhance(){injectSpeechStyles();enhanceMicButtons();labelMeanings()}

  function playDialogue(btn){
    const lines=[...(btn.closest?.('.v72-dialog')?.querySelectorAll?.(':scope > div')||[])].map(x=>({text:x.querySelector('p')?.textContent||'',male:x.classList.contains('male')})).filter(x=>x.text);
    let i=0;const next=()=>{if(i>=lines.length)return;const x=lines[i++];speakReliable(x.text,'en-US',x.male?'male':'female',next)};next();
  }
  function speechClick(e){
    const t=e.target?.closest?.('button');if(!t)return;
    if(t.matches('button[data-mic],button[data-m],button.v65-mic-btn')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();startMic(t);return}
    if(!t.closest?.('.v72-modal'))return;
    if(t.matches('[data-say-th]')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();speakReliable(t.closest('.v72-teacher')?.querySelector('p')?.textContent||'','th-TH','female');return}
    if(t.matches('[data-model]')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();speakReliable(t.closest('.v72-model')?.querySelector('strong')?.textContent||'','en-US','female');return}
    if(t.matches('[data-line]')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const row=t.closest('.v72-dialog > div');speakReliable(row?.querySelector('p')?.textContent||'','en-US',row?.classList.contains('male')?'male':'female');return}
    if(t.matches('button[data-v]')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();speakReliable(t.querySelector('strong')?.textContent||'','en-US','female');return}
    if(t.matches('[data-all]')){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();playDialogue(t)}
  }
  window.addEventListener?.('click',speechClick,true);
  document.addEventListener?.('app:rendered',enhance);document.addEventListener?.('daily-course:changed',enhance);
  setTimeout(enhance,300);setTimeout(enhance,1000);setInterval(enhance,1200);
  window.SPEECH_FIX_V74={version:SPEECH_VERSION,micFallback:'typing-or-ios-dictation',recognitionLanguage:'en-US',ttsEnglish:'en-US',ttsThai:'th-TH',translationLabels:true};
})();
