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
const document={documentElement:{classList:{contains:()=>false}},body:{contains:()=>false},head:{appendChild(){}},addEventListener(){},dispatchEvent(){},querySelector(){return null},querySelectorAll(){return[]},createElement(){return {textContent:'',style:{},appendChild(){},querySelector(){return null},querySelectorAll(){return[]}}}};
const sandbox={console,document,Element,CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail}},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v))},getLearnerLevel:()=> 'intermediate',getLearnerLevelInfo:()=>({label:'กลาง',cefr:'A2–B1',cefrLevels:['A2','B1']}),getOxford3000:()=>rows,ensureOxford3000:async()=>rows,addEventListener(){},setTimeout(fn){if(typeof fn==='function')fn();return 0},clearTimeout(){},requestAnimationFrame(fn){if(typeof fn==='function')fn();return 0},speechSynthesis:{cancel(){},speak(){}},SpeechSynthesisUtterance:class{}};
sandbox.window=sandbox;vm.createContext(sandbox);
vm.runInContext(read('daily-course-v53.js'),sandbox,{filename:'daily-course-v53.js'});
vm.runInContext(read('curriculum-quality-v57.js'),sandbox,{filename:'curriculum-quality-v57.js'});
vm.runInContext(read('course-game-fixes-v59.js'),sandbox,{filename:'course-game-fixes-v59.js'});
vm.runInContext(read('curriculum-variety-v60.js'),sandbox,{filename:'curriculum-variety-v60.js'});
await Promise.resolve();await Promise.resolve();await new Promise(r=>setImmediate(r));
vm.runInContext(read('lesson-variety-v64.js'),sandbox,{filename:'lesson-variety-v64.js'});

const audit=sandbox.auditLessonVarietyV64();
assert.equal(audit.totalLessons,210);
assert.equal(audit.productionSentences,2,'Production must require exactly two sentence fields');
assert.equal(audit.speakingEveryLesson,true,'Every lesson must have a speak-along target');
assert.equal(audit.productionStylesUsed,8,'All production styles should be used');
assert.equal(audit.distinctProductionSignatures,210,'Each lesson needs a distinct production signature');
assert.deepEqual(Array.from(audit.incompleteMastery),[],'Some lessons do not have enough varied mastery questions');
assert.deepEqual(Array.from(audit.duplicateAnswers),[],'A mastery set repeats the same correct answer');
assert.deepEqual(Array.from(audit.badOptions),[],'A v64 mastery question has invalid options');
assert.deepEqual(Array.from(audit.missingSpeech),[],'A lesson lacks speaking practice');
assert.equal(audit.ok,true);
for(let day=1;day<=210;day++){
  const count=[21,56,98,140,182,210].includes(day)?15:day%7===0?10:5,items=sandbox.buildMasteryItemsV64(day,count,0),answers=items.map(x=>String(x.correctLabel).toLowerCase().trim());
  assert.equal(items.length,count,`Lesson ${day} mastery count mismatch`);
  assert.equal(new Set(answers).size,answers.length,`Lesson ${day} repeats a correct answer`);
  assert(items.every(x=>x.options.length===4&&x.options.filter(o=>o.correct).length===1),`Lesson ${day} invalid answer options`);
}
const source=read('lesson-variety-v64.js'),index=read('index.html'),sw=read('sw.js');
assert(source.includes("const VERSION='v64'"));
assert(source.includes('v64Sentence1')&&source.includes('v64Sentence2'),'Two-sentence Production UI missing');
assert(source.includes('SpeechRecognition')&&source.includes('พูดตาม'),'Speak-along UI missing');
assert(source.includes('buildMasteryItemsV64'),'Mastery variety export missing');
assert(!source.includes('MutationObserver'),'v64 must stay event-driven');
assert(index.includes('lesson-variety-v64.css?v=64'),'Index must load v64 CSS');
assert(index.includes('lesson-variety-v64.js?v=64'),'Index must load v64 JS');
assert(index.indexOf('lesson-variety-v64.js?v=64')>index.indexOf('answer-integrity-v63.js?v=63'),'v64 must load after v63');
assert(sw.includes("const CACHE='my-english-v64'"),'Service worker cache must be v64');
assert(sw.includes('./lesson-variety-v64.css?v=64')&&sw.includes('./lesson-variety-v64.js?v=64'),'Service worker must cache v64 assets');
console.log(JSON.stringify({ok:true,...audit},null,2));
