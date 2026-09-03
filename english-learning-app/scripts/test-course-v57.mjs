import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root=path.resolve(process.cwd());
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const packs=['oxford3000-pack-01.js','oxford3000-pack-02.js','oxford3000-pack-03.js','oxford3000-pack-03b.js','oxford3000-pack-04.js','oxford3000-pack-05.js','oxford3000-pack-06.js','oxford3000-pack-07.js','oxford3000-pack-08.js'];
let b64='';
for(const name of packs){const m=read(name).match(/\+\s*'([A-Za-z0-9+/=]+)'\s*;?\s*$/);assert(m,`Cannot extract ${name}`);b64+=m[1]}
const parsed=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
const rows=(Array.isArray(parsed)?parsed:(parsed.rows||parsed.data||parsed.words||parsed.items||[])).map(r=>Array.isArray(r)?{id:r[0],word:r[1],part:r[2],level:r[3],thai:r[4],example:r[5],exampleThai:r[6]||''}:r);
assert.equal(rows.length,3000);

const store=new Map();
class Element{}
const document={
  documentElement:{classList:{contains:()=>true}},
  head:{appendChild(){}},
  addEventListener(){},dispatchEvent(){},querySelector(){return null},querySelectorAll(){return[]},
  createElement(){return {textContent:'',style:{},appendChild(){},querySelector(){return null},querySelectorAll(){return[]}}}
};
const sandbox={
  console,document,Element,CustomEvent:class{},
  localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v))},
  getLearnerLevel:()=> 'starter',getOxford3000:()=>rows,
  addEventListener(){},setTimeout(){return 0},clearTimeout(){},requestAnimationFrame(){return 0},
  speechSynthesis:{cancel(){},speak(){}},SpeechSynthesisUtterance:class{}
};
sandbox.window=sandbox;
vm.createContext(sandbox);
vm.runInContext(read('daily-course-v53.js'),sandbox,{filename:'daily-course-v53.js'});
assert.equal(typeof sandbox.getDailyLesson,'function');
vm.runInContext(read('curriculum-quality-v57.js'),sandbox,{filename:'curriculum-quality-v57.js'});
assert.equal(typeof sandbox.auditDailyCourseV57,'function');

const audit=sandbox.auditDailyCourseV57();
assert.equal(audit.totalLessons,210);
assert.equal(audit.distinctCoreSignatures,210,'All 210 lessons must have distinct learning-content signatures');
assert.deepEqual(audit.duplicatePairs,[],'No duplicate learning-content lesson pairs allowed');
assert.equal(audit.quickChecksWithCorrectChoice,210,'Every Quick Check must include its correct answer');

const d71=sandbox.getDailyLesson(71),d72=sandbox.getDailyLesson(72);
assert.notEqual(d71.examples[0],d72.examples[0],'Lessons 71 and 72 must start with different example sentences');
assert.notDeepEqual(d71.vocab.map(v=>v.en),d72.vocab.map(v=>v.en),'Lessons 71 and 72 must not reuse the same vocabulary set');
assert.equal(d71.contentVersion,'v57');
assert.equal(d72.contentVersion,'v57');
for(let day=1;day<=210;day++){
  const q=sandbox.getQuickCheckSpecV57(day);assert(q,`Missing Quick Check spec for lesson ${day}`);
  assert(q.choices.some(c=>String(c.en).toLowerCase()===String(q.quizWord.en).toLowerCase()),`Correct Quick Check choice missing in lesson ${day}`);
  assert(new Set(q.choices.map(c=>String(c.th))).size===q.choices.length,`Duplicate Quick Check labels in lesson ${day}`);
}
console.log(JSON.stringify({ok:true,...audit,lesson71:{title:d71.title,focus:d71.focusWord?.en,example:d71.examples[0]},lesson72:{title:d72.title,focus:d72.focusWord?.en,example:d72.examples[0]}},null,2));
