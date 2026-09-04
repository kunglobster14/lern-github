import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root=path.resolve(process.cwd());
const read=name=>fs.readFileSync(path.join(root,name),'utf8');

// Curriculum blueprint audit in a DOM-light sandbox.
const store=new Map();class Element{}
const fakeLesson=day=>({day,cefr:day<57?'A1':day<99?'A1–A2':day<141?'A2–B1':day<183?'B1':'B1–B2',title:`Lesson ${day}`,goal:`Goal ${day}`,scenario:`Scenario ${day}`,pattern:`Pattern ${day}`,focusWord:{en:`focus${day}`},vocab:[{en:`focus${day}`,th:`คำ${day}`},{en:`term${day}`,th:`ศัพท์${day}`}],examples:[`This is example sentence number ${day}.`,`This is second example sentence number ${day}.`],examplePairs:[{en:`This is example sentence number ${day}.`,th:`ตัวอย่างประโยค ${day}`,word:`focus${day}`,wordThai:`คำ${day}`},{en:`This is second example sentence number ${day}.`,th:`ตัวอย่างประโยคที่สอง ${day}`,word:`term${day}`,wordThai:`ศัพท์${day}`}],contentVersion:'v60'});
const document={documentElement:{classList:{contains:()=>true}},addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{contains:()=>false}};
const sandbox={console,document,Element,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v))},speechSynthesis:{cancel(){},speak(){}},SpeechSynthesisUtterance:class{},setTimeout(){return 0},clearTimeout(){},CustomEvent:class{},getDailyLesson:fakeLesson,completeDailyLesson:()=>true,openDailyLesson:()=>true,getDailyCourseProgress:()=>({currentDay:71,unlockedThrough:71,completed:[],startDay:71}),getLearnerLevel:()=> 'intermediate',getLearnerLevelInfo:()=>({label:'กลาง',cefr:'A2–B1'}),chooseDailyLesson:()=>true,addEventListener(){}};
sandbox.window=sandbox;vm.createContext(sandbox);vm.runInContext(read('institute-course-v62.js'),sandbox,{filename:'institute-course-v62.js'});
const audit=sandbox.auditInstituteCourseV62();
assert.equal(audit.totalLessons,210);
assert.equal(audit.distinctSignatures,210,'All 210 institute lesson signatures must be distinct');
assert.equal(JSON.stringify(audit.duplicateSignatures),'[]','No duplicate lesson signatures');
assert.equal(audit.adjacentRepeats,0,'Adjacent lessons must never share an activity signature');
assert(audit.speakingGates>=53&&audit.speakingGates<=74,`Speaking gates must cover about 25–35% of lessons, got ${audit.speakingGates}`);
assert.equal(audit.weeklyReviews,30,'Expected one weekly review every 7 lessons');
assert.equal(audit.stageExams,6,'Expected six stage exams');
assert.equal(audit.masteryThreshold,80,'Mastery threshold must be 80%');
assert(audit.minMinutes>=25&&audit.maxMinutes<=50,'Lesson target time must stay 25–50 minutes');
assert(audit.maxDifficulty>audit.minDifficulty,'Difficulty must rise across the course');
for(const [from,to] of [[1,21],[22,56],[57,98],[99,140],[141,182],[183,210]]){
  let prev=-Infinity;for(let d=from;d<=to;d++){const x=sandbox.buildInstituteBlueprintV62(d,fakeLesson(d)).difficulty;assert(x>=prev,`Difficulty must not fall inside stage at lesson ${d}`);prev=x}
}

// Hard-game vocabulary pool audit using the real Oxford 3000 payload.
const packs=['oxford3000-pack-01.js','oxford3000-pack-02.js','oxford3000-pack-03.js','oxford3000-pack-03b.js','oxford3000-pack-04.js','oxford3000-pack-05.js','oxford3000-pack-06.js','oxford3000-pack-07.js','oxford3000-pack-08.js'];
let b64='';for(const name of packs){const m=read(name).match(/\+\s*'([A-Za-z0-9+/=]+)'\s*;?\s*$/);assert(m,`Cannot extract ${name}`);b64+=m[1]}
const parsed=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
const raw=Array.isArray(parsed)?parsed:(parsed.rows||parsed.data||parsed.words||parsed.items||[]);
const rows=raw.map((r,i)=>Array.isArray(r)?{id:r[0]??i+1,word:r[1],part:r[2],level:r[3],thai:r[4],example:r[5],exampleThai:r[6]||''}:r);
let selected='intermediate';const levelMap={starter:{cefr:'Pre-A1 / A1'},basic:{cefr:'A1–A2'},intermediate:{cefr:'A2–B1'},upper:{cefr:'B1–B2'}};
const gameDoc={querySelector(){return null},querySelectorAll(){return[]},createElement(){return{}},body:{contains:()=>false}};
const gameSandbox={console,document:gameDoc,Element,window:null,getLearnerLevel:()=>selected,getLearnerLevelInfo:()=>levelMap[selected],getOxford3000:()=>rows,ensureOxford3000:async()=>rows,getDailyCourseProgress:()=>({currentDay:selected==='starter'?1:selected==='basic'?22:selected==='intermediate'?71:141}),addEventListener(){},setTimeout(){return 0},speechSynthesis:{cancel(){},speak(){}},SpeechSynthesisUtterance:class{}};gameSandbox.window=gameSandbox;vm.createContext(gameSandbox);vm.runInContext(read('game-difficulty-pre-v62.js'),gameSandbox,{filename:'game-difficulty-pre-v62.js'});
for(const word of ['hello','morning','thank','thanks','good','name','friend'])assert.equal(gameSandbox.isHardGameWordAllowedV62(word,'intermediate','A2'),false,`${word} must not be a game target at A2–B1`);
const pools={};for(const id of Object.keys(levelMap)){selected=id;const stats=await gameSandbox.getHardGamePoolStatsV62();pools[id]=stats.rows;assert(stats.rows>80,`${id} hard-game pool too small: ${stats.rows}`);assert.equal(JSON.stringify(stats.basicTargetsExcluded),'[]',`${id} pool still contains excluded basic targets`)}

const gameSource=read('game-difficulty-pre-v62.js'),courseSource=read('institute-course-v62.js');
for(const type of ['builder','gap','translate','dialog','context','listen','spell','memory'])assert(gameSource.includes(`function ${type}(`),`Hard game missing ${type}`);
assert(courseSource.includes('SpeechRecognition||window.webkitSpeechRecognition'),'Speaking Gate must use browser speech recognition when available');
assert(courseSource.includes('ไม่ใช้การกดผ่าน 3/4 แบบเดิม'),'Legacy easy-pass wording must be replaced');
assert(courseSource.includes("required=['review','learn','guided','challenge','production','mastery']"),'All six institute phases must be required');
assert(!courseSource.includes('MutationObserver'),'v62 course must remain event-driven');
assert(!gameSource.includes('MutationObserver'),'v62 hard games must remain event-driven');

console.log(JSON.stringify({ok:true,version:'v62',curriculum:audit,hardGamePools:pools,basicTargetsRemoved:true,masteryThreshold:80},null,2));
