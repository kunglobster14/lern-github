(()=>{
const VERSION='v85-runtime-bridge';
const files=['story-depth-v85-data.js?v=85','story-integrity-v85.js?v=85','game-audio-v85b.js?v=85b'];
function load(i){if(i>=files.length)return;const src=files[i],base=src.split('?')[0];if([...document.scripts].some(s=>String(s.src||'').includes(base))){load(i+1);return}const el=document.createElement('script');el.src=src;el.async=false;el.onload=()=>load(i+1);el.onerror=()=>load(i+1);document.head.appendChild(el)}
load(0);
window.STORY_VOCAB_INTEGRITY_V85={version:VERSION,loadsStorySpecificExpansion:true,actualStoryGlossary:true,loadsGameAnswerAudio:true,noGlobalMutationObserver:true};
})();