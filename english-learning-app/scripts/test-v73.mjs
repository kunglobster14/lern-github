import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const context={window:{}};context.window.window=context.window;vm.createContext(context);
context.window.getCurriculumV72=day=>({
  level:day<=54?'A1':day<=108?'A2':day<=162?'B1':'B2',
  title:`หัวข้อบท ${day}`,
  englishTitle:`Lesson ${day}`,
  goal:`เป้าหมายเฉพาะบท ${day}`,
  scenario:`สถานการณ์เฉพาะบท ${day}`,
  grammar:`Grammar ${day}`,
  note:`Usage note ${day}`
});
for(const file of ['core-vocab-v73.js','curriculum-institute-v73.js']){
  vm.runInContext(fs.readFileSync(new URL(`../${file}`,import.meta.url),'utf8'),context,{filename:file});
}
const core=context.window.CORE_VOCAB_500_V73;
assert.equal(core.total,500,'Core vocabulary must contain exactly 500 words');
assert.equal(new Set(core.words.map(x=>x.word.toLowerCase())).size,500,'Core 500 words must be unique');
assert.deepEqual(core.levelBands.map(x=>x.count),[220,150,90,40]);
assert.equal(core.levelBands.reduce((s,x)=>s+x.count,0),500);

const seeds=new Set(),objectives=new Set();let introduced=[];
for(let day=1;day<=210;day++){
  const v=context.window.getCoreVocabV73(day);
  introduced.push(...v.newWords.map(x=>x.word.toLowerCase()));
  assert.equal(v.lessonCode,`L${day}`);
  const l=context.window.getInstituteCurriculumV73(day);
  assert.equal(l.lessonCode,`L${day}`);
  assert.equal(l.module,Math.ceil(day/6));
  assert.ok(['A1','A2','B1','B2'].includes(l.level));
  assert.ok(l.objective.includes(`L${day}`));
  assert.ok(l.scenario.length>0&&l.goal.length>0);
  assert.ok(l.skills.listening.focus&&l.skills.speaking.focus&&l.skills.reading.focus&&l.skills.writing.focus,'Every lesson must cover four skills');
  assert.equal(l.assessment.quizQuestions,8);
  assert.equal(l.assessment.pass,6);
  assert.equal(l.assessment.separateFromTeaching,true);
  assert.equal(l.sequence.at(-1),'End-of-Lesson Test');
  assert.ok(!seeds.has(l.uniqueSeed),`Duplicate lesson seed ${l.uniqueSeed}`);seeds.add(l.uniqueSeed);
  assert.ok(!objectives.has(l.objective),`Duplicate objective ${l.objective}`);objectives.add(l.objective);
}
assert.equal(new Set(introduced).size,500,'All 500 core words must be introduced exactly once');
assert.equal(introduced.length,500,'Core introduction schedule must introduce 500 words total');
assert.equal(seeds.size,210);
assert.equal(objectives.size,210);
assert.equal(context.window.INSTITUTE_CURRICULUM_V73.modules,35);
assert.equal(context.window.INSTITUTE_CURRICULUM_V73.lessonsPerModule,6);
console.log(JSON.stringify({version:'v73',lessons:210,modules:35,coreWords:500,lessonStart:'L1',fourSkills:true,quiz:'8/pass6',uniqueObjectives:objectives.size},null,2));