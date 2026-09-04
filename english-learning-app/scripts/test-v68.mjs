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
const document={documentElement:{classList:{contains:()=>false}},body:{contains:()=>false,appendChild(){}},head:{appendChild(){}},addEventListener(){},dispatchEvent(){},querySelector(){return null},querySelectorAll(){return[]},createElement(){return {textContent:'',innerHTML:'',style:{},appendChild(){},querySelector(){return null},querySelectorAll(){return[]},setAttribute(){},insertAdjacentElement(){},addEventListener(){},remove(){},classList:{add(){},toggle(){}}}},createTextNode(text){return{textContent:text}}};
const levelInfo={label:'กลาง',cefr:'A2–B1',cefrLevels:['A2','B1']};
const sandbox={console,document,Element,Event:class{},CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail}},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v))},getLearnerLevel:()=> 'intermediate',getLearnerLevelInfo:()=>levelInfo,getOxford3000:()=>rows,ensureOxford3000:async()=>rows,getDailyCourseProgress:()=>({currentDay:71,unlockedThrough:210,completed:[],startDay:71}),addEventListener(){},setTimeout(fn){if(typeof fn==='function')fn();return 0},clearTimeout(){},requestAnimationFrame(fn){if(typeof fn==='function')fn();return 0},speechSynthesis:{cancel(){},speak(){}},SpeechSynthesisUtterance:class{},navigator:{}};
sandbox.window=sandbox;vm.createContext(sandbox);
vm.runInContext(read('daily-course-v53.js'),sandbox,{filename:'daily-course-v53.js'});
vm.runInContext(read('curriculum-quality-v57.js'),sandbox,{filename:'curriculum-quality-v57.js'});
vm.runInContext(read('course-game-fixes-v59.js'),sandbox,{filename:'course-game-fixes-v59.js'});
vm.runInContext(read('curriculum-variety-v60.js'),sandbox,{filename:'curriculum-variety-v60.js'});
await Promise.resolve();await Promise.resolve();await new Promise(r=>setImmediate(r));
vm.runInContext(read('fun-lessons-v68.js'),sandbox,{filename:'fun-lessons-v68.js'});
await Promise.resolve();await Promise.resolve();await new Promise(r=>setImmediate(r));

const audit=sandbox.auditFunLessonsV68();
assert.equal(audit.version,'v68');
assert.equal(audit.totalLessons,210);
assert.equal(audit.teachStagesPerLesson,6);
assert.equal(audit.totalTeachStages,1260);
assert.equal(audit.distinctTeachingBlueprints,210);
assert.equal(audit.distinctStageSignatures,1260);
assert.equal(audit.uniqueVocabularyWords,1260);
assert.equal(audit.uniqueExamples,1680);
assert.equal(audit.adjacentVocabularyRepeats.length,0);
assert.equal(audit.quizQuestionsPerLesson,8);
assert.equal(audit.quizPass,6);
assert.equal(audit.quizBad.length,0);
assert.equal(audit.teachQuizExactLeaks.length,0);
assert.equal(audit.finalVoiceCopiedTeaching.length,0);
assert.equal(audit.teacherClipSlides,5);
assert.equal(audit.thaiNarration,true);
assert.equal(audit.animationStorage,'static-code-no-database');
assert.equal(audit.ok,true);

for(let day=1;day<=210;day++){
  const d=sandbox.getFunLessonDataV68(day);
  assert.equal(d.lesson.contentVersion,'v68',`Lesson ${day} is not v68`);
  assert.equal(d.lesson.vocab.length,6,`Lesson ${day} must have 6 unique words`);
  assert.equal(d.lesson.examplePairs.length,8,`Lesson ${day} must have 8 unique example pairs`);
  assert.deepEqual(Array.from(d.blueprint.stages,x=>x.code),['clip','words','grammar','model','guided','produce'],`Lesson ${day} must teach before testing`);
  assert.equal(d.quiz.length,8,`Lesson ${day} quiz count`);
  const taught=new Set(d.lesson.examplePairs.slice(0,4).map(x=>String(x.en).toLowerCase().trim()));
  for(const q of d.quiz){
    if(q.audio)assert(!taught.has(String(q.audio).toLowerCase().trim()),`Lesson ${day} reuses taught audio in quiz`);
    if(typeof q.c==='string')assert(!taught.has(String(q.c).toLowerCase().trim()),`Lesson ${day} reuses taught answer sentence in quiz`);
  }
}

const grammarChecks={1:'intro',36:'present',64:'continuous',71:'past',78:'future'};
for(const [day,kind] of Object.entries(grammarChecks))assert.equal(sandbox.getFunLessonDataV68(Number(day)).grammar.kind,kind,`Lesson ${day} grammar should be ${kind}`);
const source=read('fun-lessons-v68.js'),css=read('fun-lessons-v68.css');
assert(source.includes("u.lang='th-TH'"),'Thai narration voice missing');
assert(source.includes('TEACH BEFORE TEST'),'Teach-before-test UI missing');
assert(source.includes('teacherClipWatched'),'Teacher clip progress missing');
assert(source.includes('databaseVideoStorage:false'),'Database-free video design flag missing');
assert(css.includes('@keyframes v68Float')&&css.includes('@keyframes v68Wave')&&css.includes('@keyframes v68Sweep'),'Animated teacher clip CSS missing');
assert(css.includes('prefers-reduced-motion'),'Reduced-motion accessibility missing');
assert(!source.includes('MutationObserver'),'v68 must remain event-driven');

console.log(JSON.stringify({ok:true,version:'v68',realCurriculum:true,lessons:210,teachStages:1260,uniqueVocabularyWords:audit.uniqueVocabularyWords,uniqueExamples:audit.uniqueExamples,teacherClipSlides:5,thaiNarration:true,grammarChecks,quiz:'6/8',teachQuizExactLeaks:0,finalVoiceCopies:0,databaseVideoStorage:false},null,2));
