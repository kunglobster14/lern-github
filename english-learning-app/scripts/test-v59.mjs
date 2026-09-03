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
const raw=Array.isArray(parsed)?parsed:(parsed.rows||parsed.data||parsed.words||parsed.items||[]);
const rows=raw.map((r,i)=>Array.isArray(r)?{id:r[0]??i+1,word:r[1],part:r[2],level:r[3],thai:r[4],example:r[5],exampleThai:r[6]||''}:r);
assert.equal(rows.length,3000);

let selected='intermediate';
const levelMap={starter:{label:'เริ่มต้น',cefr:'Pre-A1 / A1',cefrLevels:['A1']},basic:{label:'พื้นฐาน',cefr:'A1–A2',cefrLevels:['A1','A2']},intermediate:{label:'กลาง',cefr:'A2–B1',cefrLevels:['A2','B1']},upper:{label:'กลางสูง',cefr:'B1–B2',cefrLevels:['B1','B2']}};
const store=new Map();class Element{}
const document={documentElement:{classList:{contains:()=>true}},body:{contains:()=>false},head:{appendChild(){}},addEventListener(){},dispatchEvent(){},querySelector(){return null},querySelectorAll(){return[]},createElement(){return {textContent:'',style:{},appendChild(){},querySelector(){return null},querySelectorAll(){return[]}}}};
const sandbox={console,document,Element,CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail}},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v))},getLearnerLevel:()=>selected,getLearnerLevelInfo:()=>levelMap[selected],getOxford3000:()=>rows,ensureOxford3000:async()=>rows,addEventListener(){},setTimeout(){return 0},clearTimeout(){},requestAnimationFrame(){return 0},speechSynthesis:{cancel(){},speak(){}},SpeechSynthesisUtterance:class{}};
sandbox.window=sandbox;vm.createContext(sandbox);
vm.runInContext(read('daily-course-v53.js'),sandbox,{filename:'daily-course-v53.js'});
vm.runInContext(read('curriculum-quality-v57.js'),sandbox,{filename:'curriculum-quality-v57.js'});
vm.runInContext(read('course-game-fixes-v59.js'),sandbox,{filename:'course-game-fixes-v59.js'});

const counts={};
for(const id of Object.keys(levelMap)){selected=id;counts[id]=await sandbox.getGameSentenceCountV59();assert(counts[id]>100,`${id} sentence pool too small: ${counts[id]}`)}
const source=read('course-game-fixes-v59.js');
assert(source.includes('Mini Response · เลือกประโยคให้ตรงความหมาย'),'Clear Mini Response UI missing');
assert(source.includes('กำลังโหลดคลังประโยค'),'Games must show loading state instead of sentence count 0');
assert(source.includes('await ensureOxford()'),'Sentence games must wait for Oxford data');
for(const type of ['builder','gap','translate','dialog','context'])assert(source.includes(`'${type}'`),`v59 missing repaired ${type} game`);
assert(!source.includes('MutationObserver'),'v59 must not add broad DOM observers');
console.log(JSON.stringify({ok:true,version:'v59',sentencePools:counts,zeroSentenceBugFixed:Object.values(counts).every(n=>n>0)},null,2));
