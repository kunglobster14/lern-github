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

let institute=read('institute-course-v62.js');
const needle="  window.INSTITUTE_COURSE_VERSION=VERSION;\n})();";
assert(institute.includes(needle),'Cannot instrument v62 assessment functions');
institute=institute.replace(needle,"  window.__answerQuestionSetV63=questionSet;\n  window.__answerBlueprintV63=blueprint;\n  window.INSTITUTE_COURSE_VERSION=VERSION;\n})();");
vm.runInContext(institute,sandbox,{filename:'institute-course-v62.js'});
vm.runInContext(read('answer-integrity-v63.js'),sandbox,{filename:'answer-integrity-v63.js'});

const legacyAudit=sandbox.auditAnswerIntegrityV63();
assert.equal(legacyAudit.totalLessons,210);
assert.equal(legacyAudit.legacyQuickChecks,210,'Every lesson must have a Quick Check target');
assert.equal(legacyAudit.missingCorrect.length,0,`Legacy Quick Checks missing correct answers: ${JSON.stringify([...legacyAudit.missingCorrect])}`);
assert.equal(legacyAudit.missingData.length,0,`Lessons with incomplete Quick Check data: ${JSON.stringify([...legacyAudit.missingData])}`);
assert.equal(legacyAudit.duplicateLabels.length,0,`Legacy Quick Checks with duplicate labels: ${JSON.stringify([...legacyAudit.duplicateLabels])}`);
assert.equal(legacyAudit.allCorrect,true);

let questionSets=0,questions=0,rawBlankLabels=0,rawMissingCorrect=0,repairedBlankLabels=0,repairedMissingCorrect=0;
function checkSet(day,label,rawQs,expected){
  questionSets++;
  assert.equal(rawQs.length,expected,`${label} lesson ${day}: expected ${expected} questions, got ${rawQs.length}`);
  for(const rawQ of rawQs){
    questions++;
    const rawOptions=Array.isArray(rawQ.options)?rawQ.options:[];
    rawBlankLabels+=rawOptions.filter(o=>!String(o?.label||'').trim()).length;
    if(!rawOptions.some(o=>String(o?.id)===String(rawQ.correct)))rawMissingCorrect++;
    const q=sandbox.sanitizeAssessmentQuestionV63(rawQ);
    assert(String(q.correct||'').trim(),`${label} lesson ${day}: missing correct key`);
    assert(Array.isArray(q.options)&&q.options.length>=2,`${label} lesson ${day}: too few options`);
    if(!q.options.some(o=>String(o.id)===String(q.correct)))repairedMissingCorrect++;
    repairedBlankLabels+=q.options.filter(o=>!String(o.label||'').trim()).length;
    assert(q.options.some(o=>String(o.id)===String(q.correct)),`${label} lesson ${day}: correct answer not present after v63 repair for ${q.type}`);
    assert(q.options.every(o=>String(o.label||'').trim()),`${label} lesson ${day}: blank option label remains after v63 repair`);
    assert.equal(new Set(q.options.map(o=>String(o.id))).size,q.options.length,`${label} lesson ${day}: duplicate option ids after v63 repair`);
  }
}

for(let day=1;day<=210;day++){
  const lesson=sandbox.getDailyLesson(day),b=sandbox.__answerBlueprintV63(day,lesson),flat={...b,weeklyReview:false,stageExam:false};
  checkSet(day,'Review',sandbox.__answerQuestionSetV63(Math.max(1,day-1),flat,2,day),2);
  checkSet(day,'Learn',sandbox.__answerQuestionSetV63(day,flat,2,1),2);
  checkSet(day,'Guided',sandbox.__answerQuestionSetV63(day,flat,1,3),1);
  checkSet(day,'Challenge',sandbox.__answerQuestionSetV63(day,flat,2,11),2);
  const masteryCount=b.stageExam?15:b.weeklyReview?10:5;
  checkSet(day,'Mastery attempt 1',sandbox.__answerQuestionSetV63(day,b,masteryCount,0),masteryCount);
  checkSet(day,'Mastery attempt 2',sandbox.__answerQuestionSetV63(day,b,masteryCount,1),masteryCount);
}
assert.equal(repairedMissingCorrect,0,'v63 left assessment questions without a correct option');
assert.equal(repairedBlankLabels,0,'v63 left blank assessment option labels');

const source=read('answer-integrity-v63.js');
assert(source.includes("const VERSION='v63'"),'v63 answer guard missing');
assert(source.includes("window.INSTITUTE_COURSE_VERSION==='v62'"),'v63 must prefer institute lessons over legacy 3/4 flow');
assert(source.includes('sanitizeAssessmentQuestionV63'),'v63 assessment sanitizer export missing');
assert(source.includes('repairInstituteQuestionsV63'),'v63 rendered assessment repair missing');
assert(source.includes('auditAnswerIntegrityV63'),'v63 audit export missing');
assert(!source.includes('MutationObserver'),'v63 must remain event-driven');

console.log(JSON.stringify({ok:true,version:'v63',lessonsChecked:210,legacyQuickChecks:legacyAudit.legacyQuickChecks,legacyMissingCorrect:[...legacyAudit.missingCorrect],legacyDuplicateLabels:[...legacyAudit.duplicateLabels],questionSets,questions,rawBlankLabels,rawMissingCorrect,repairedBlankLabels,repairedMissingCorrect,instituteAnswersPresent:true},null,2));
