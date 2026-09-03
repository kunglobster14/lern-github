import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';

const root=path.resolve(process.cwd());
const packFiles=['oxford3000-pack-01.js','oxford3000-pack-02.js','oxford3000-pack-03.js','oxford3000-pack-03b.js','oxford3000-pack-04.js','oxford3000-pack-05.js','oxford3000-pack-06.js','oxford3000-pack-07.js','oxford3000-pack-08.js'];
let b64='';
for(const name of packFiles){
  const text=fs.readFileSync(path.join(root,name),'utf8');
  const m=text.match(/\+\s*'([A-Za-z0-9+/=]+)'\s*;?\s*$/);
  assert(m,`Cannot extract base64 from ${name}`);
  b64+=m[1];
}
const json=zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8');
const parsed=JSON.parse(json);
const rows=Array.isArray(parsed)?parsed:(parsed?.rows||parsed?.data||parsed?.words||parsed?.items||[]);
assert(Array.isArray(rows),'Decoded Oxford payload is not an array');
assert.equal(rows.length,3000,`Expected 3000 rows, got ${rows.length}`);
const read=(r,key,index)=>Array.isArray(r)?r[index]:r?.[key];
const missingWord=rows.filter(r=>!String(read(r,'word',1)||'').trim());
const missingThai=rows.filter(r=>!/[ก-๙]/.test(String(read(r,'thai',4)||read(r,'translation',4)||'')));
const missingExample=rows.filter(r=>!String(read(r,'example',5)||r?.sentence||'').trim());
const missingExampleThai=rows.filter(r=>!/[ก-๙]/.test(String(read(r,'exampleThai',6)||r?.example_thai||r?.sentenceThai||'')));
assert.equal(missingWord.length,0,`Rows without word: ${missingWord.length}`);
assert.equal(missingThai.length,0,`Rows without Thai translation: ${missingThai.length}`);
assert.equal(missingExample.length,0,`Rows without example: ${missingExample.length}`);
assert.equal(missingExampleThai.length,0,`Rows without Thai example: ${missingExampleThai.length}`);
const ids=rows.map((r,i)=>read(r,'id',0)??i+1);
assert.equal(new Set(ids).size,3000,'Oxford IDs are not unique');

const jsFiles=['learner-level.js','sentence-coach.js','oxford3000-loader.js','oxford3000-core.js','core3000-study.js','core3000-library.js','oxford3000-practice.js','oxford3000-stories.js','oxford3000-story-upgrade.js','oxford3000-story-speed.js','core3000-plan.js','account-gate.js'];
for(const file of jsFiles){
  const check=spawnSync(process.execPath,['--check',path.join(root,file)],{encoding:'utf8'});
  assert.equal(check.status,0,`${file} syntax error:\n${check.stderr||check.stdout}`);
}

function shuffle(arr,seed){const a=[...arr];let x=seed;const rnd=()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296};for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const STORY_COUNT=25,WORDS_PER_STORY=120;
const storyRows=shuffle(rows,300046);
const chapters=Array.from({length:STORY_COUNT},(_,i)=>storyRows.slice(i*WORDS_PER_STORY,(i+1)*WORDS_PER_STORY));
assert(chapters.every(c=>c.length===WORDS_PER_STORY),`Each story must contain ${WORDS_PER_STORY} target entries`);
assert.equal(chapters.flat().length,3000,'Stories must cover 3000 entries');
assert.equal(new Set(chapters.flat().map((r,i)=>read(r,'id',0)??i+1)).size,3000,'Story distribution repeats an Oxford entry');

const storySource=fs.readFileSync(path.join(root,'oxford3000-stories.js'),'utf8');
assert.match(storySource,/const STORY_COUNT=25;/,'Story count constant must be 25');
assert.match(storySource,/const WORDS_PER_STORY=120;/,'Words per story constant must be 120');
assert.equal((storySource.match(/title:`/g)||[]).length,25,'Expected exactly 25 authored story titles');
for(const control of ['storyReadAll','storyPause','storyStop'])assert(storySource.includes(control),`Missing narration control ${control}`);
assert(storySource.includes('SpeechSynthesisUtterance'),'Whole-story speech synthesis is missing');

const upgradeSource=fs.readFileSync(path.join(root,'oxford3000-story-upgrade.js'),'utf8');
for(const title of ['The Girl Who Found a Map','The Underground Garden','Flight 207','The Snow Cabin',"The Photographer's Last Picture",'The Clock Tower Code','The Empty Stadium','The Island Without Phones','The Box from Bangkok','The Road Beyond the City'])assert(upgradeSource.includes(title),`Missing extended story ${title}`);
assert(upgradeSource.includes('longStoryCount:10'),'Final 10 stories must be marked as extended');
assert(upgradeSource.includes('extraSentencesPerLongStory:10'),'Each final story must add 10 sentences');
assert(upgradeSource.includes('GENRES=['),'Story genre mix is missing');

const speedSource=fs.readFileSync(path.join(root,'oxford3000-story-speed.js'),'utf8');
for(const label of ["label:'ช้า'","label:'กลาง'","label:'เร็ว'"])assert(speedSource.includes(label),`Missing story speed ${label}`);
for(const rate of ['rate:.6','rate:.9','rate:1.15'])assert(speedSource.includes(rate),`Missing story narration rate ${rate}`);
assert(speedSource.includes('data-story-speed'),'Story narration speed selector is missing');

const levelSource=fs.readFileSync(path.join(root,'learner-level.js'),'utf8');
for(const id of ["starter:{id:'starter'","basic:{id:'basic'","intermediate:{id:'intermediate'","upper:{id:'upper'"])assert(levelSource.includes(id),`Missing learner level ${id}`);
assert(levelSource.includes("s.learnerLevel=id"),'Learner level must be saved inside myEnglishV2 so account sync preserves it');
assert(levelSource.includes('filterOxfordByLearnerLevel'),'Oxford level filter is missing');
assert(levelSource.includes('ความคืบหน้าเดิมไม่ถูกรีเซ็ต'),'Level UI must state that existing progress is preserved');
const studySource=fs.readFileSync(path.join(root,'core3000-study.js'),'utf8');
const quizSource=fs.readFileSync(path.join(root,'oxford3000-practice.js'),'utf8');
assert(studySource.includes('filterOxfordByLearnerLevel'),'Daily Oxford study must respect learner level');
assert(quizSource.includes('filterOxfordByLearnerLevel'),'Oxford quiz must respect learner level');

const sentenceSource=fs.readFileSync(path.join(root,'sentence-coach.js'),'utf8');
assert(sentenceSource.includes("const VERSION='v51'"),'Sentence coach version is missing');
assert((sentenceSource.match(/id:'[sbiu]\d\d'/g)||[]).length>=32,'Sentence coach must include at least 32 level-aware writing tasks');
for(const level of ['starter','basic','intermediate','upper'])assert(sentenceSource.includes(`level:'${level}'`),`Sentence coach is missing ${level} tasks`);
assert(sentenceSource.includes('ยังไม่ถูก — แก้ตรงนี้'),'Sentence correction feedback is missing');
assert(sentenceSource.includes('task.explain'),'Grammar explanation feedback is missing');
assert(sentenceSource.includes('sentenceCoach'),'Sentence progress must be stored without overwriting existing progress');
assert(!sentenceSource.includes("fetch('/api/ai'"),'Sentence coach must not call AI API');

const accountSource=fs.readFileSync(path.join(root,'account-gate.js'),'utf8');
assert(accountSource.includes("classList.add('account-locked')"),'Login gate must lock lessons before authentication');
assert(accountSource.includes("if(!d.authenticated){overlay(d);return}"),'Unauthenticated learners must see login only');
assert(accountSource.includes('unlockApp();decorate();watch()'),'Lessons must unlock only after authentication');
const indexSource=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(indexSource.includes("document.documentElement.classList.add('account-locked')"),'Index must hide lessons before scripts render');
assert(indexSource.includes('learner-level.js?v=50'),'Learner level asset is not loaded');
assert(indexSource.includes('sentence-coach.js?v=51'),'Sentence coach asset is not loaded');
assert(indexSource.includes('sentence-coach.css?v=51'),'Sentence coach stylesheet is not loaded');
assert(indexSource.includes('core3000-study.js?v=50'),'Level-aware daily study cache version is stale');
assert(indexSource.includes('oxford3000-practice.js?v=50'),'Level-aware quiz cache version is stale');
assert(indexSource.includes('oxford3000-story-upgrade.js?v=49'),'Story upgrade asset is not loaded');
assert(indexSource.includes('account-gate.js?v=49'),'Login gate cache version is stale');
for(const removed of ['ai-mission-core-v33.js','ai-status.js','ai-output-safety.js'])assert(!indexSource.includes(removed),`AI learning asset must not be loaded: ${removed}`);
assert(indexSource.includes('LOCAL · Sentence Coach'),'Local sentence mode badge is missing');
assert(indexSource.includes('>แต่งประโยค</span>'),'Bottom navigation must use Sentence Coach instead of AI Coach');

const swSource=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert(swSource.includes("const CACHE='my-english-v51'"),'Service worker cache must be v51');
assert(swSource.includes('./sentence-coach.js?v=51'),'Sentence coach must be available offline');
assert(swSource.includes('./sentence-coach.css?v=51'),'Sentence coach stylesheet must be available offline');

console.log(JSON.stringify({ok:true,rows:rows.length,thaiTranslations:rows.length-missingThai.length,examples:rows.length-missingExample.length,thaiExamples:rows.length-missingExampleThai.length,syntaxFiles:jsFiles.length,stories:chapters.length,wordsPerStory:WORDS_PER_STORY,extendedStories:10,extraSentencesPerExtendedStory:10,loginRequired:true,learnerLevels:4,progressPreserved:true,levelAwareOxford:true,aiLearningUI:false,sentenceCoach:true,sentenceTasks:32,localSentenceCorrection:true,narration:true,narrationSpeeds:['slow','medium','fast']},null,2));
