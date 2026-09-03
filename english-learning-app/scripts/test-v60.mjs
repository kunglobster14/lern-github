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

const audit=sandbox.auditCurriculumV60();
assert.equal(audit.totalLessons,210);
assert.equal(audit.distinctPrimaryExamples,210,'All 210 lessons must have unique primary examples');
assert.equal(audit.duplicatePrimaryExamples.length,0,'Duplicate primary examples remain');
assert.equal(audit.distinctFocusWords,210,'All 210 lessons must have unique focus words');
assert.equal(audit.duplicateFocusWords.length,0,'Duplicate focus words remain');
for(const [a,b] of [[1,3],[2,4],[22,24],[71,72]]){
  const x=sandbox.getDailyLesson(a),y=sandbox.getDailyLesson(b);
  assert.equal(x.contentVersion,'v60');assert.equal(y.contentVersion,'v60');
  assert.notEqual(x.examples[0],y.examples[0],`Lessons ${a}/${b} still repeat the main sentence`);
  assert.notEqual(String(x.focusWord?.en).toLowerCase(),String(y.focusWord?.en).toLowerCase(),`Lessons ${a}/${b} still repeat the focus word`);
}
for(let day=1;day<=210;day++){
  const l=sandbox.getDailyLesson(day);
  assert.equal(l.contentVersion,'v60',`Lesson ${day} not v60`);
  assert(l.vocab?.length>=6,`Lesson ${day} vocabulary smaller than 6`);
  assert(l.examplePairs?.length>=4,`Lesson ${day} example pair set smaller than 4`);
  assert(l.examplePairs.every(p=>String(p.en).trim()&&/[ก-๙]/.test(String(p.th))),`Lesson ${day} has invalid English/Thai example pair`);
}
const source=read('curriculum-variety-v60.js');
assert(source.includes('Mini Response · เลือกประโยคให้ตรงความหมาย'),'v60 coherent Mini Response patch missing');
assert(!source.includes('MutationObserver'),'v60 must remain event-driven');
console.log(JSON.stringify({ok:true,...audit,checkedPairs:[[1,3],[2,4],[22,24],[71,72]],minimumVocabulary:6,minimumExamplePairs:4},null,2));
