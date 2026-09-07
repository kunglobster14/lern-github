import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=name=>fs.readFileSync(new URL(`../${name}`,import.meta.url),'utf8');
const level=d=>d<=54?'A1':d<=108?'A2':d<=162?'B1':'B2';
function base(day){return{lesson:{day,lessonCode:`L${day}`,title:`Old ${day}`,goal:'old',scenario:'office',pattern:'old',vocab:[],teachingPairs:[],testPairs:[],sections:[]},assessment:[],quiz:[]}}
const oxford=Array.from({length:500},(_,i)=>({word:`core${i+1}`,thai:`คำ${i+1}`,part:'word'}));
const window={getCurriculumLessonV75:base,getCurriculumLessonV72:base,getOxford3000:()=>oxford,getCoreVocabV73:day=>({newWords:[{word:`core${(day%400)+1}`}],reviewWords:[{word:`core${((day+50)%400)+1}`}]})};
const context={window,console};vm.createContext(context);vm.runInContext(read('grammar-toeic-v76.js'),context,{filename:'grammar-toeic-v76.js'});vm.runInContext(read('toeic-assessment-v76b.js'),context,{filename:'toeic-assessment-v76b.js'});
assert.equal(window.TOEIC_ASSESSMENT_V76B.version,'v76-toeic-variety');
assert.equal(window.TOEIC_ASSESSMENT_V76B.questionsPerLesson,8);
const sig=new Set(),exact=new Set(),types=new Set(),bad=[];
for(let d=1;d<=210;d++){
 const x=window.getCurriculumLessonV76(d),q=x.assessment||[];
 assert.equal(x.lesson.level,level(d));
 assert.equal(q.length,8,`L${d} must have 8 TOEIC questions`);
 assert.equal(new Set(q.map(z=>z.type)).size,8,`L${d} must not repeat a task type in the same quiz`);
 q.forEach(z=>{assert(z.type&&z.mode&&z.prompt&&z.answer,`L${d} incomplete item`);types.add(z.type)});
 const s=q.map(z=>z.type).join('>');sig.add(s);
 const e=q.map(z=>`${z.type}|${z.prompt}|${z.answer}`).join('||');if(exact.has(e))bad.push(d);exact.add(e);
}
assert.equal(sig.size,210,'all 210 V76 lessons should have distinct TOEIC assessment structures');
assert.equal(exact.size,210,'all 210 complete TOEIC assessments should be unique');
assert.equal(bad.length,0);
assert(types.size>=14,'V76 must use a broad TOEIC task pool');
for(const prefix of ['toeic-p1','toeic-p2','toeic-p3','toeic-p4','toeic-p5','toeic-p6','toeic-p7'])assert([...types].some(t=>t.startsWith(prefix)),`missing ${prefix}`);
const audit=window.auditToeicAssessmentV76B();assert.equal(audit.lessons,210);assert.equal(audit.distinctStructures,210);assert.equal(audit.ok,true);
const index=read('index.html'),sw=read('sw.js');for(const a of ['grammar-toeic-v76.js?v=76','toeic-assessment-v76b.js?v=76b']){assert(index.includes(a));assert(sw.includes(`./${a}`))}
assert(index.indexOf('grammar-toeic-v76.js?v=76')<index.indexOf('toeic-assessment-v76b.js?v=76b'));
assert(index.includes("document.documentElement.classList.add('account-locked')"));
console.log(JSON.stringify({ok:true,version:'v76-toeic-variety',lessons:210,distinctStructures:sig.size,taskTypes:types.size,exactDuplicates:bad.length,registrationClosed:true},null,2));