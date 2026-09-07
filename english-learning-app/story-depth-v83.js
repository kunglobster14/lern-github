(()=>{
const V='v83-story-depth-safe';
let EX=null,loading=null,scheduled=false;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function wordMap(){const rows=window.getOxford3000?.()||[],m=new Map;for(const r of rows){const w=String(r.word||r[1]||'').toLowerCase();if(w&&!m.has(w))m.set(w,r)}return m}
function decorate(text){const m=wordMap();return esc(text).replace(/\b([A-Za-z]+(?:['’][A-Za-z]+)?)\b/g,(a,w)=>m.has(w.toLowerCase())?`<span class="v83-ow" data-v83-word="${esc(w)}">${a}</span>`:a)}
async function loadData(){
  if(EX)return EX;if(loading)return loading;
  loading=(async()=>{try{
    const res=await fetch('story-depth-v81.js?v=81',{cache:'no-store'});if(!res.ok)throw new Error(`HTTP ${res.status}`);
    const src=await res.text(),a=src.indexOf('const EX='),b=src.indexOf('\nconst esc=',a);if(a<0||b<0)throw new Error('Expansion data marker missing');
    const expr=src.slice(a+'const EX='.length,b).trim().replace(/;$/,'');
    EX=Function(`"use strict";return (${expr});`)();
    window.dispatchEvent(new CustomEvent('story-depth-v83-ready',{detail:{count:Object.keys(EX||{}).length}}));
    schedule();return EX;
  }catch(err){console.error('V83 story depth data load failed',err);EX={};return EX}})();return loading;
}
function patchMenu(root){
  root.querySelectorAll('.oxford-story-card').forEach(c=>{
    c.classList.add('v83-story-card');
    if(!c.querySelector('.v83-card-badge')){const badge=document.createElement('span');badge.className='v83-card-badge';badge.textContent='🔥 ฉบับขยาย';c.prepend(badge)}
    const em=c.querySelector('em'),target='ประมาณ 4–7 นาที · 120 คำฝึก Oxford';if(em&&em.textContent!==target)em.textContent=target;
  });
}
function patchStory(root){
  if(!EX)return;
  const title=String(root.querySelector('.oxford-story-title h1')?.textContent||'').trim(),extra=EX[title],reading=root.querySelector('.oxford-story-reading');
  if(!extra||!reading||reading.querySelector('[data-v83-depth]'))return;
  const frag=document.createDocumentFragment();
  extra.forEach(([en,th],i)=>{const sec=document.createElement('section');sec.className='story-paragraph story-depth-v83';sec.dataset.v83Depth='1';sec.innerHTML=`<button type="button" class="story-sentence story-authored-sentence" data-v83-sentence="${i}">${decorate(en)}</button><div class="story-paragraph-translation" hidden><b>คำแปล</b><p>${esc(th)}</p></div>`;frag.appendChild(sec)});
  reading.appendChild(frag);
  const words=(reading.textContent.match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;let b=root.querySelector('.v83-length');if(!b){b=document.createElement('div');b.className='v83-length';root.querySelector('.oxford-story-title')?.appendChild(b)}if(b){const text=`ฉบับขยาย · ประมาณ ${words.toLocaleString()} คำ · อ่าน 4–7 นาที`;if(b.textContent!==text)b.textContent=text}
}
function patch(){const root=document.querySelector('#oxfordStoriesModal');if(!root)return;patchMenu(root);patchStory(root)}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;patch()})}
const style=document.createElement('style');style.textContent=`.v83-story-card{position:relative;overflow:hidden!important;border-color:rgba(99,102,241,.24)!important}.v83-story-card:hover{transform:translateY(-2px);border-color:rgba(34,211,238,.65)!important;box-shadow:0 12px 28px rgba(15,23,42,.18)}.v83-card-badge{display:inline-block!important;width:auto!important;margin:0 0 7px!important;padding:4px 7px;border-radius:999px;background:linear-gradient(90deg,#7c3aed,#2563eb);color:white!important;font-size:9px!important;font-weight:950!important}.story-depth-v83{border-left:3px solid rgba(49,95,214,.18);padding-left:10px}.v83-ow{color:#173e9f;text-decoration:underline;text-decoration-color:#a5b9f4;text-underline-offset:3px;cursor:pointer}.v83-length{display:inline-block;margin:4px 0 14px;padding:6px 9px;border-radius:999px;background:#e8efff;color:#3153a5;font-size:11px;font-weight:900}`;document.head.appendChild(style);
document.addEventListener('click',e=>{const w=e.target.closest?.('[data-v83-word]');if(w){e.preventDefault();e.stopPropagation();window.oxfordSpeak?.(w.dataset.v83Word);return}const s=e.target.closest?.('.story-depth-v83 .story-sentence');if(s){e.preventDefault();const t=s.nextElementSibling;if(t)t.hidden=!t.hidden}},true);
const ob=new MutationObserver(records=>{if(records.some(r=>r.addedNodes?.length||r.removedNodes?.length))schedule()});ob.observe(document.body,{childList:true,subtree:true});
window.addEventListener('DOMContentLoaded',()=>{loadData();schedule()});loadData();setTimeout(schedule,0);
window.STORY_DEPTH_V83={version:V,dataSource:'story-depth-v81.js?v=81',safeObserver:true,guardedTextMutation:true,classicReaderCompatible:true,get expandedCount(){return Object.keys(EX||{}).length}};
})();
