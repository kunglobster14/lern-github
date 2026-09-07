(()=>{
const VERSION='v85b-correct-answer-audio';
function englishVoice(){try{const vs=speechSynthesis.getVoices?.()||[];return vs.find(v=>/^en-US$/i.test(v.lang||''))||vs.find(v=>/^en-GB$/i.test(v.lang||''))||vs.find(v=>/^en/i.test(v.lang||''))||null}catch{return null}}
function speak(word){word=String(word||'').trim();if(!word)return;try{const u=new SpeechSynthesisUtterance(word);u.lang='en-US';u.rate=.72;const v=englishVoice();if(v)u.voice=v;if(speechSynthesis.paused)speechSynthesis.resume();speechSynthesis.speak(u)}catch{}}
function wordFromFeedback(root){const box=root?.querySelector('.v85-feedback');if(!box)return'';const text=String(box.textContent||'').replace(/\s+/g,' ').trim();const m=text.match(/(?:ถูกต้อง|เฉลย)\s+([^=]+?)\s*=/);return m?m[1].trim():''}
function addReplay(root,word){const box=root?.querySelector('.v85-feedback');if(!box||!word)return;if(box.querySelector('[data-v85-replay]'))return;const b=document.createElement('button');b.type='button';b.dataset.v85Replay='1';b.className='v85-btn';b.textContent='🔊 ฟังคำอ่านอีกครั้ง';b.style.marginTop='10px';b.onclick=e=>{e.preventDefault();e.stopPropagation();speak(word)};box.appendChild(document.createElement('br'));box.appendChild(b)}
function afterAnswer(target){const root=target?.closest?.('[data-v85-round]');if(!root)return;setTimeout(()=>{
 const box=root.querySelector('.v85-feedback');
 if(box&&/^✓\s*ถูกต้อง/.test(String(box.textContent||'').trim())){const word=wordFromFeedback(root);if(word&&!box.dataset.v85Spoken){box.dataset.v85Spoken='1';speak(word);addReplay(root,word)}return}
 if(target.closest?.('[data-word]')&&/^✓\s*ถูกต้อง/.test(String(target.textContent||'').trim())){const word=String(root.querySelector('.v85-word')?.textContent||'').trim();if(word){speak(word)}}
 if(target.closest?.('[data-card]')){const matched=[...root.querySelectorAll('.v85-memory button.matched')];const fresh=matched.filter(x=>!x.dataset.v85Spoken);if(fresh.length>=2){const pair=fresh.slice(-2);pair.forEach(x=>x.dataset.v85Spoken='1');const texts=pair.map(x=>String(x.querySelector('b')?.textContent||'').trim());const word=texts.find(t=>/^[A-Za-z][A-Za-z'’ -]*$/.test(t));if(word)speak(word)}}
 },20)}
document.addEventListener('click',e=>{if(!e.target.closest?.('#classicGameV85'))return;afterAnswer(e.target)},true);
window.GAME_AUDIO_V85B={version:VERSION,correctAnswerAutoPronunciation:true,replayButton:true,rate:.72,noXP:true};
})();