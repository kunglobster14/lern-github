import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root=path.resolve(process.cwd());
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const packs=['oxford3000-pack-01.js','oxford3000-pack-02.js','oxford3000-pack-03.js','oxford3000-pack-03b.js','oxford3000-pack-04.js','oxford3000-pack-05.js','oxford3000-pack-06.js','oxford3000-pack-07.js','oxford3000-pack-08.js'];
let b64='';for(const name of packs){const m=read(name).match(/\+\s*'([A-Za-z0-9+/=]+)'\s*;?\s*$/);assert(m,`Cannot extract ${name}`);b64+=m[1]}
const parsed=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
const raw=Array.isArray(parsed)?parsed:(parsed.rows||parsed.data||parsed.words||parsed.items||[]);
const rows=raw.map((r,i)=>Array.isArray(r)?{id:r[0]??i+1,word:r[1],part:r[2],level:r[3],thai:r[4],example:r[5],exampleThai:r[6]||''}:r);
assert.equal(rows.length,3000);

const store=new Map();class Element{}
const document={documentElement:{classList:{contains:()=>false}},body:{contains:()=>false,appendChild(){}},head:{appendChild(){}},addEventListener(){},dispatchEvent(){},querySelector(){return null},querySelectorAll(){return[]},createElement(){return {textContent:'',style:{},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},setAttribute(){},insertAdjacentElement(){},addEventListener(){},remove(){}}},createTextNode(text){return{textContent:text}}};
const sandbox={console,document,Element,Event:class{},CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail}},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v))},getLearnerLevel:()=> 'intermediate',getLearnerLevelInfo:()=>({label:'กลาง',cefr:'A2–B1',cefrLevels:['A2','B1']}),getOxford3000:()=>rows,ensureOxford3000:async()=>rows,getDailyCourseProgress:()=>({currentDay:71,unlockedThrough:71,completed:[],startDay:71}),addEventListener(){},setTimeout(fn){if(typeof fn==='function')fn();return 0},clearTimeout(){},setInterval(){return 1},clearInterval(){},requestAnimationFrame(fn){if(typeof fn==='function')fn();return 0},speechSynthesis:{cancel(){},speak(){}},SpeechSynthesisUtterance:class{}};
sandbox.window=sandbox;vm.createContext(sandbox);
vm.runInContext(read('daily-course-v53.js'),sandbox,{filename:'daily-course-v53.js'});
vm.runInContext(read('curriculum-quality-v57.js'),sandbox,{filename:'curriculum-quality-v57.js'});
vm.runInContext(read('course-game-fixes-v59.js'),sandbox,{filename:'course-game-fixes-v59.js'});
vm.runInContext(read('curriculum-variety-v60.js'),sandbox,{filename:'curriculum-variety-v60.js'});
await Promise.resolve();await Promise.resolve();await new Promise(r=>setImmediate(r));
vm.runInContext(read('lesson-variety-v64.js'),sandbox,{filename:'lesson-variety-v64.js'});
vm.runInContext(read('mastery-variety-v64b.js'),sandbox,{filename:'mastery-variety-v64b.js'});
vm.runInContext(read('interaction-quality-v65.js'),sandbox,{filename:'interaction-quality-v65.js'});

const audit=sandbox.auditInteractionQualityV65();
assert.equal(audit.totalLessons,210);
assert.equal(audit.incomplete.length,0,'Every lesson must have the full separated mastery set');
assert.equal(audit.reservedLeaks.length,0,'Mastery must not reuse lesson example sentences as direct concepts');
assert.equal(audit.duplicateAnswers.length,0,'Mastery correct answers must not repeat in one set');
assert.equal(audit.duplicateConcepts.length,0,'Mastery concepts must not repeat in one set');
assert.equal(audit.badOptions.length,0,'Mastery options must not leak the lesson example sentence or be malformed');
assert(audit.typesUsed>=5,`Expected broad separated mastery variety, got ${audit.typesUsed}`);
assert.equal(audit.gameMinutes.min,10);
assert.equal(audit.gameMinutes.max,20);
assert.equal(audit.gameMinutes.first,10);
assert.equal(audit.gameMinutes.last,20);
assert.equal(audit.gameMinutes.nondecreasing,true);
assert.equal(audit.micOrTyping,true);
assert.equal(audit.ok,true);

for(let day=1;day<=210;day++){
  const count=[21,56,98,140,182,210].includes(day)?15:day%7===0?10:5,items=sandbox.buildSeparatedMasteryV65(day,count,0),lesson=sandbox.getDailyLesson(day),reservedEn=new Set((lesson.examplePairs||[]).map(p=>String(p.en||'').toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim())),reservedRaw=new Set((lesson.examplePairs||[]).flatMap(p=>[String(p.en||'').trim(),String(p.th||'').trim()]));
  assert.equal(items.length,count,`Lesson ${day} separated mastery count mismatch`);
  assert.equal(new Set(items.map(x=>x.conceptKey)).size,items.length,`Lesson ${day} repeats a mastery concept`);
  for(const item of items){
    const c=String(item.conceptKey||'');if(c.startsWith('pair:'))assert(!reservedEn.has(c.slice(5)),`Lesson ${day} reuses a taught example as mastery concept`);
    assert(item.options.every(o=>!reservedRaw.has(String(o.label||'').trim())),`Lesson ${day} leaks a taught example into mastery options`);
    assert.equal(item.options.filter(o=>o.correct).length,1,`Lesson ${day} invalid correct option count`);
  }
  const minutes=sandbox.getGameSessionMinutesV65(day);assert(minutes>=10&&minutes<=20,`Lesson ${day} game duration out of range: ${minutes}`);
}

const source=read('interaction-quality-v65.js'),index=read('index.html'),sw=read('sw.js');
assert(source.includes("const VERSION='v65'"),'v65 interaction layer missing');
assert(source.includes('buildSeparatedMasteryV65'),'Separated mastery export missing');
assert(source.includes('SpeechRecognition')&&source.includes('พูดเพื่อตอบ'),'Mic-to-answer support missing');
assert(source.includes('.v62-text-input, .v62-textarea'),'Mic support must cover lesson text inputs and textareas');
assert(source.includes('gameMinutesForDay')&&source.includes('10+')&&source.includes('*60000'),'10–20 minute game timer missing');
assert(!source.includes('MutationObserver'),'v65 must remain event-driven');
assert(index.includes('interaction-quality-v65.css?v=65'),'Index must load v65 CSS');
assert(index.includes('interaction-quality-v65.js?v=65'),'Index must load v65 JS');
assert(index.indexOf('interaction-quality-v65.js?v=65')>index.indexOf('mastery-variety-v64b.js?v=64'),'v65 must load after v64 mastery layer');
assert(index.includes('fun-lessons-v67.js?v=67'),'Index must activate v67 lesson layer');
assert(sw.includes("const CACHE='my-english-v67'"),'Service worker cache must be v67');
assert(sw.includes('./interaction-quality-v65.css?v=65')&&sw.includes('./interaction-quality-v65.js?v=65'),'Service worker must cache v65 assets');
assert(sw.includes('./fun-lessons-v67.js?v=67')&&sw.includes('./fun-lessons-v67.css?v=67'),'Service worker must cache v67 assets');

const lesson22=sandbox.getDailyLesson(22),items22=sandbox.buildSeparatedMasteryV65(22,5,0),lesson22Pairs=new Set((lesson22.examplePairs||[]).map(p=>String(p.en||'').toLowerCase().replace(/[^a-z0-9' ]+/g,' ').replace(/\s+/g,' ').trim()));
assert(items22.every(x=>!String(x.conceptKey||'').startsWith('pair:')||!lesson22Pairs.has(String(x.conceptKey).slice(5))),'Lesson 22 must not turn its taught example sentence into the direct mastery answer');

console.log(JSON.stringify({ok:true,version:'v65',mastery:{questions:audit.masteryQuestions,typesUsed:audit.typesUsed,reservedLeaks:audit.reservedLeaks.length,duplicateAnswers:audit.duplicateAnswers.length,duplicateConcepts:audit.duplicateConcepts.length,badOptions:audit.badOptions.length},games:audit.gameMinutes,micOrTyping:audit.micOrTyping,lesson22Separated:true,compatibleWith:'v67'},null,2));
