(()=>{
  let lastSpoken='';
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  try{
    const baseSpeak=window.speak;
    if(typeof baseSpeak==='function'){
      window.speak=function(text){
        lastSpoken=String(text??'').trim();
        return baseSpeak.apply(this,arguments);
      };
    }
  }catch{}

  function box(modal){
    let el=modal.querySelector('#spellFeedback');
    if(el)return el;
    el=document.createElement('div');
    el.id='spellFeedback';
    el.setAttribute('role','status');
    el.style.cssText='margin:10px 0 2px;padding:10px 12px;border-radius:12px;font-size:14px;font-weight:800;line-height:1.45;text-align:center';
    const check=modal.querySelector('#check');
    check?.before(el);
    return el;
  }

  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target.closest('#gameLabModal #check'):null;
    if(!target)return;
    const modal=document.querySelector('#gameLabModal');
    const input=modal?.querySelector('#spell.spell-input');
    if(!modal||!input)return;

    const answer=lastSpoken.trim();
    if(!answer)return;
    const guess=input.value.trim();
    const feedback=box(modal);

    if(guess.toLowerCase()===answer.toLowerCase()){
      input.removeAttribute('aria-invalid');
      feedback.textContent='✅ ถูกต้อง';
      feedback.style.background='rgba(34,197,94,.14)';
      feedback.style.border='1px solid rgba(34,197,94,.45)';
      feedback.style.color='#86efac';
      return;
    }

    input.setAttribute('aria-invalid','true');
    feedback.innerHTML=`❌ ผิด — คำที่ถูกคือ <b>${esc(answer)}</b>`;
    feedback.style.background='rgba(239,68,68,.14)';
    feedback.style.border='1px solid rgba(239,68,68,.45)';
    feedback.style.color='#fca5a5';
    setTimeout(()=>{try{input.focus();input.select()}catch{}},0);
  },true);

  window.__spellFeedbackV34={version:'34'};
})();