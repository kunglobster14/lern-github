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
const sandbox={console,document,Element,Event:class{},CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail}},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v))},getLearnerLevel:()=> 'intermediate',getLearnerLevelInfo:()=>levelInfo,getOxford3000:()=>rows,ensureOxford3000:async()=>rows,getDailyCourseProgress:()=>({currentDay:71,unlockedThrough:210,completed:[],startDay:71}),addEventListener(){},setTimeout(fn){if(typeof fn==='function')fn();return 0},clearTimeout(){},requestAnimationFrame(fn){if(typeof fn==='function')fn();return 0},speechSynthesis:{cancel(){},speak(){},getVoices(){return[]}},SpeechSynthesisUtterance:class{},navigator:{}};
sandbox.window=sandbox;vm.createContext(sandbox);
vm.runInContext(read('daily-course-v53.js'),sandbox,{filename:'daily-course-v53.js'});
vm.runInContext(read('curriculum-quality-v57.js'),sandbox,{filename:'curriculum-quality-v57.js'});
vm.runInContext(read('course-game-fixes-v59.js'),sandbox,{filename:'course-game-fixes-v59.js'});
vm.runInContext(read('curriculum-variety-v60.js'),sandbox,{filename:'curriculum-variety-v60.js'});
await Promise.resolve();await Promise.resolve();await new Promise(r=>setImmediate(r));
vm.runInContext(read('fun-lessons-v68.js'),sandbox,{filename:'fun-lessons-v68.js'});
await Promise.resolve();await Promise.resolve();await new Promise(r=>setImmediate(r));
vm.runInContext(read('fun-lessons-v69.js'),sandbox,{filename:'fun-lessons-v69.js'});
await Promise.resolve();await new Promise(r=>setImmediate(r));

const audit=sandbox.auditFunLessonsV69();
assert.equal(audit.version,'v69');
assert.equal(audit.totalLessons,210);
assert.equal(audit.totalTeachingStages,1260);
assert.equal(audit.cartoonLessons,210);
assert.equal(audit.thaiTeacherLessons,210);
assert.equal(audit.cartoonsPerLesson,3);
assert.equal(audit.inlineSvgCartoons,true);
assert.equal(audit.animatedCartoons,true);
assert.equal(audit.thaiNarration,true);
assert.equal(audit.teachBeforeTest,true);
assert.equal(audit.grammarBeforeQuiz,true);
assert.equal(audit.fourSkillsBeforeQuiz,true);
assert.equal(audit.quizQuestions,8);
assert.equal(audit.quizPass,6);
assert.equal(audit.quizBad.length,0);
assert.equal(audit.teachingQuizExactLeaks.length,0);
assert.equal(audit.databaseMediaStorage,false);
assert.equal(audit.ok,true);

for(let day=1;day<=210;day++){
  const data=sandbox.getFunLessonDataV68(day);
  assert.equal(data.lesson.vocab.length,6,`Lesson ${day} must keep 6 unique words`);
  assert.equal(data.lesson.examplePairs.length,8,`Lesson ${day} must keep 8 examples`);
  assert.equal(data.quiz.length,8,`Lesson ${day} quiz count`);
  const bp=await sandbox.buildFunLessonBlueprintV69(day);
  assert.deepEqual(Array.from(bp.stages,x=>x.code),['intro','words','grammar','dialogue','skills','practice'],`Lesson ${day} V69 teaching order`);
  assert.equal(bp.cartoons.length,3,`Lesson ${day} must include teacher and two students`);
  assert.equal(bp.thaiInstruction,true,`Lesson ${day} must teach in Thai`);
  assert.equal(bp.teacherNarration,true,`Lesson ${day} must have Thai teacher narration`);
}

const source=read('fun-lessons-v69.js'),css=read('fun-lessons-v69.css'),index=read('index.html'),sw=read('sw.js');
assert(source.includes("const V='v69'"),'V69 engine missing');
assert(source.includes("const sayTh=t=>speak(t,'th-TH')"),'Thai narration missing');
assert(source.includes('aria-label="ครูการ์ตูน"'),'Teacher SVG missing');
assert(source.includes('aria-label="นักเรียนการ์ตูน"'),'Student SVG missing');
assert(source.includes('ครูเมย์'),'Thai teacher character missing');
assert(source.includes('ก่อนสอบ'),'Teach-before-test copy missing');
assert(source.includes('databaseMediaStorage:false'),'Media storage must stay out of database');
assert(!source.includes('MutationObserver'),'V69 must remain event-driven');
assert(css.includes('@keyframes v69bob'),'Cartoon movement missing');
assert(css.includes('@keyframes v69blink'),'Cartoon blink missing');
assert(css.includes('.v69-dialogue-scene'),'Cartoon dialogue styling missing');
assert(index.includes('fun-lessons-v69.css?v=69')&&index.includes('fun-lessons-v69.js?v=69'),'Production index must load V69');
assert(index.indexOf('fun-lessons-v69.js?v=69')<index.indexOf('fun-lessons-v68.js?v=68'),'V69 click handler must register before V68');
assert(sw.includes("const CACHE='my-english-v69'"),'PWA cache must be V69');
assert(sw.includes('./fun-lessons-v69.css?v=69')&&sw.includes('./fun-lessons-v69.js?v=69'),'PWA must cache V69 assets');
console.log(JSON.stringify({ok:true,version:'v69',realCurriculum:true,lessons:210,teachingStages:1260,cartoonLessons:210,cartoonsPerLesson:3,thaiTeacher:true,grammarBeforeQuiz:true,fourSkillsBeforeQuiz:true,quiz:'6/8',databaseMediaStorage:false},null,2));
