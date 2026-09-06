import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=name=>fs.readFileSync(new URL(`../${name}`,import.meta.url),'utf8');
const coreWords=[];
for(let d=1;d<=210;d++)for(let i=0;i<14;i++)coreWords.push({word:`core_${d}_${i}`,day:d,i});
const oxford=coreWords.map((x,i)=>({id:i+1,word:x.word,thai:`คำแกน ${x.day}-${x.i}`,part:i%3===0?'verb':i%3===1?'noun':'adjective',level:x.day<=54?'A1':x.day<=108?'A2':x.day<=162?'B1':'B2',example:`I use ${x.word} in lesson ${x.day}.`,exampleThai:`ฉันใช้ ${x.word} ในบท ${x.day}`}));

function level(day){return day<=54?'A1':day<=108?'A2':day<=162?'B1':'B2'}
function base(day){
  const topic=Array.from({length:8},(_,i)=>({en:`topic_${day}_${i}`,th:`คำหัวข้อ ${day}-${i}`,part:i%2?'noun':'verb'}));
  const pairs=Array.from({length:8},(_,i)=>({en:`Lesson ${day} sentence ${i+1} has useful context.`,th:`ประโยคบริบทบท ${day} หมายเลข ${i+1}`}));
  return {lesson:{title:`หัวข้อ ${day}`,goal:`ใช้ภาษาในเป้าหมายเฉพาะบท ${day}`,scenario:`สถานการณ์เฉพาะบท ${day}`,pattern:`Pattern ${day}`,vocab:topic,examplePairs:pairs,v72Level:level(day),v72Title:`หัวข้อ ${day}`,v72Note:`หมายเหตุการใช้บท ${day}`},grammar:{kind:'pattern',formula:`Pattern ${day}`},quiz:[]};
}
function summary(day){return{day,level:level(day),title:`หัวข้อ ${day}`,englishTitle:`Lesson ${day}`,goal:`ใช้ภาษาในเป้าหมายเฉพาะบท ${day}`,scenario:`สถานการณ์เฉพาะบท ${day}`,grammar:`Pattern ${day}`,note:`หมายเหตุการใช้บท ${day}`}}

const window={
  getCurriculumLessonV72:base,
  getCurriculumV72:summary,
  getOxford3000:()=>oxford,
  getCoreVocabV73:day=>({lessonCode:`L${day}`,newWords:Array.from({length:10},(_,i)=>({word:`core_${day}_${i}`})),reviewWords:Array.from({length:4},(_,i)=>({word:`core_${day}_${i+10}`}))})
};
const context={window,console};vm.createContext(context);vm.runInContext(read('curriculum-v75.js'),context,{filename:'curriculum-v75.js'});

assert.equal(window.CURRICULUM_V75.version,'v75-growth');
assert.equal(window.CURRICULUM_V75.totalLessons,210);
assert.deepEqual(Array.from(window.CURRICULUM_V75.roles),['Foundation','Language Builder','Listening Lab','Speaking Workshop','Reading & Writing Studio','Real-life Challenge']);
assert.deepEqual({...window.CURRICULUM_V75.vocabTargets},{A1:8,A2:10,B1:12,B2:14});

const roleSectionSignatures=new Map(),assessmentSignatures=new Set(),exactQuizSignatures=new Set(),types=new Set(),modes=new Set(),bad=[];
for(let day=1;day<=210;day++){
  const d=window.getCurriculumLessonV75(day),l=d.lesson;
  assert.equal(l.lessonCode,`L${day}`);
  assert.equal(l.module,Math.ceil(day/6));
  assert.equal(l.role,window.CURRICULUM_V75.roles[(day-1)%6]);
  assert.equal(l.level,level(day));
  assert.match(l.title,new RegExp(`^L${day} · `));
  assert(!new RegExp(`^L${day} · L${day} · `).test(l.title),'lesson code must not be duplicated in title');
  assert.equal(l.sections.length,8,`L${day} must have eight learning sections`);
  const sectionSig=l.sections.map(x=>x.kind).join('>');
  if(!roleSectionSignatures.has(l.role))roleSectionSignatures.set(l.role,sectionSig);
  else assert.equal(roleSectionSignatures.get(l.role),sectionSig,`role structure drift at L${day}`);
  assert.equal(l.vocab.length,window.CURRICULUM_V75.vocabTargets[l.level],`L${day} vocabulary growth target`);
  assert(l.vocab.some(x=>x.status==='topic'),`L${day} needs topic vocabulary`);
  if(l.level!=='A1')assert(l.vocab.some(x=>x.status==='new'||x.status==='review'),`L${day} needs cumulative core vocabulary`);
  assert(l.teachingPairs.length>=4,`L${day} teaching content too thin`);
  assert(l.testPairs.length>=2,`L${day} test transfer content too thin`);
  const taught=new Set(l.teachingPairs.map(x=>String(x.en).toLowerCase().trim()));
  assert(!l.testPairs.some(x=>taught.has(String(x.en).toLowerCase().trim())),`L${day} teach/test exact leak`);
  assert.equal(d.assessment.length,8,`L${day} assessment must contain eight tasks`);
  d.assessment.forEach(q=>{assert(q.type&&q.mode&&q.prompt&&q.answer,`L${day} incomplete assessment task`);types.add(q.type);modes.add(q.mode)});
  const aSig=d.assessment.map(x=>x.type).join('>');assessmentSignatures.add(aSig);
  const exact=d.assessment.map(x=>`${x.type}|${x.prompt}|${x.answer}`).join('||');
  if(exactQuizSignatures.has(exact))bad.push(day);exactQuizSignatures.add(exact);
}
assert.equal(roleSectionSignatures.size,6);
assert.equal(new Set(roleSectionSignatures.values()).size,6,'six lesson roles must have six different learning structures');
assert.equal(assessmentSignatures.size,210,'all 210 lessons should receive distinct assessment-type signatures');
assert.equal(exactQuizSignatures.size,210,'all 210 complete assessments should be unique');
assert.equal(bad.length,0);
assert.equal(types.size,14,'all fourteen V75 assessment task types must appear');
assert(modes.has('choice')&&modes.has('listen')&&modes.has('read')&&modes.has('input')&&modes.has('order'),'assessment must use multiple interaction modes');
const audit=window.auditCurriculumV75();assert.equal(audit.totalLessons,210);assert.equal(audit.badLessons.length,0);assert.equal(audit.distinctAssessmentSignatures,210);assert.equal(audit.ok,true);

const curriculum=read('curriculum-v75.js'),experience=read('lesson-experience-v75.js'),index=read('index.html'),sw=read('sw.js');
for(const marker of ['Listening Mission','Speaking Goal','Reading & Writing Goal','Mission Brief'])assert(curriculum.includes(marker),`missing V75 curriculum marker: ${marker}`);
assert(experience.includes("const V='v75-experience'"));
for(const marker of ['data-listen','data-mic','Final Voice · Transfer'])assert(experience.includes(marker),`missing V75 experience marker: ${marker}`);
assert(!experience.includes('MutationObserver'));
assert(index.includes("document.documentElement.classList.add('account-locked')"),'registration lock must remain');
for(const asset of ['curriculum-v75.js?v=75g','lesson-experience-v75.js?v=75g'])assert(index.includes(asset)&&sw.includes(`./${asset}`),`V75 asset missing from startup/cache: ${asset}`);
assert(index.indexOf('assessment-v75.js?v=75a')<index.indexOf('curriculum-v75.js?v=75g'));
assert(index.indexOf('curriculum-v75.js?v=75g')<index.indexOf('lesson-experience-v75.js?v=75g'));

console.log(JSON.stringify({ok:true,version:'v75-growth',lessons:210,lessonRoles:roleSectionSignatures.size,distinctLearningStructures:new Set(roleSectionSignatures.values()).size,assessmentSignatures:assessmentSignatures.size,assessmentTaskTypes:types.size,assessmentModes:[...modes].sort(),vocabTargets:window.CURRICULUM_V75.vocabTargets,teachTestLeaks:0,registrationClosed:true},null,2));
