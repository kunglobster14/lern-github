import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';

const root=path.resolve(process.cwd());
const readFile=name=>fs.readFileSync(path.join(root,name),'utf8');
const packFiles=['oxford3000-pack-01.js','oxford3000-pack-02.js','oxford3000-pack-03.js','oxford3000-pack-03b.js','oxford3000-pack-04.js','oxford3000-pack-05.js','oxford3000-pack-06.js','oxford3000-pack-07.js','oxford3000-pack-08.js'];
let b64='';
for(const name of packFiles){const text=readFile(name);const m=text.match(/\+\s*'([A-Za-z0-9+/=]+)'\s*;?\s*$/);assert(m,`Cannot extract base64 from ${name}`);b64+=m[1]}
const parsed=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
const rows=Array.isArray(parsed)?parsed:(parsed?.rows||parsed?.data||parsed?.words||parsed?.items||[]);
assert.equal(rows.length,3000,'Oxford payload must contain exactly 3000 rows');
const get=(r,key,index)=>Array.isArray(r)?r[index]:r?.[key];
assert.equal(rows.filter(r=>!String(get(r,'word',1)||'').trim()).length,0,'Oxford words missing');
assert.equal(rows.filter(r=>!/[ก-๙]/.test(String(get(r,'thai',4)||get(r,'translation',4)||''))).length,0,'Thai meanings missing');
assert.equal(rows.filter(r=>!String(get(r,'example',5)||r?.sentence||'').trim()).length,0,'Examples missing');
assert.equal(rows.filter(r=>!/[ก-๙]/.test(String(get(r,'exampleThai',6)||r?.example_thai||r?.sentenceThai||''))).length,0,'Thai examples missing');
assert.equal(new Set(rows.map((r,i)=>get(r,'id',0)??i+1)).size,3000,'Oxford IDs must be unique');

const jsFiles=['learner-level-v53.js','daily-course-v53.js','sentence-coach-v53.js','adaptive-games-v53.js','learning-guide.js','oxford3000-loader.js','oxford3000-core.js','core3000-study.js','core3000-library.js','oxford3000-practice.js','oxford3000-stories.js','oxford3000-story-upgrade.js','oxford3000-story-speed.js','core3000-plan.js','account-gate.js'];
for(const file of jsFiles){const check=spawnSync(process.execPath,['--check',path.join(root,file)],{encoding:'utf8'});assert.equal(check.status,0,`${file} syntax error:\n${check.stderr||check.stdout}`)}

const storySource=readFile('oxford3000-stories.js');
assert.match(storySource,/const STORY_COUNT=25;/,'Story count must stay 25');
assert.match(storySource,/const WORDS_PER_STORY=120;/,'Story practice set must stay 120 words each');
assert.equal((storySource.match(/title:`/g)||[]).length,25,'Expected 25 authored story titles');
for(const control of ['storyReadAll','storyPause','storyStop'])assert(storySource.includes(control),`Missing story control ${control}`);
const upgradeSource=readFile('oxford3000-story-upgrade.js');
assert(upgradeSource.includes('longStoryCount:10'),'Final 10 stories must remain extended');
assert(upgradeSource.includes('extraSentencesPerLongStory:10'),'Extended stories must keep extra sentences');

const levelSource=readFile('learner-level-v53.js');
for(const pair of ["starter:{id:'starter'","basic:{id:'basic'","intermediate:{id:'intermediate'","upper:{id:'upper'"])assert(levelSource.includes(pair),`Missing learner level ${pair}`);
for(const start of ['startDay:1','startDay:22','startDay:71','startDay:141'])assert(levelSource.includes(start),`Missing distinct course start ${start}`);
assert(levelSource.includes('filterOxfordByLearnerLevel'),'Oxford CEFR filter missing');
assert(levelSource.includes('Game และ Sentence Coach จะใช้ระดับนี้'),'Level UI must explain real level effects');

const dailySource=readFile('daily-course-v53.js');
assert(dailySource.includes("const TOTAL_DAYS=210"),'Daily course must contain 210 days');
for(const range of ["{id:'L0',from:1,to:21","{id:'L1',from:22,to:56","{id:'L2',from:57,to:98","{id:'L3',from:99,to:140","{id:'L4',from:141,to:182","{id:'L5',from:183,to:210"])assert(dailySource.includes(range),`Missing stage range ${range}`);
assert(dailySource.includes('const WEEKS=['),'Daily course weekly curriculum missing');
assert.equal((dailySource.match(/^    \['L[0-5]'/gm)||[]).length,30,'Daily course must define 30 teaching weeks');
assert(dailySource.includes('unlockedThrough'),'Daily course must unlock the next lesson sequentially');
assert(dailySource.includes('25 บท L0–L5 เดิมยังเก็บไว้เป็น Milestone'),'Legacy 25-lesson progress preservation message missing');
assert(dailySource.includes('Oxford 3000 และเรื่องสั้น 25 เรื่องยังเข้าได้ตามปกติ'),'Oxford/stories continuity message missing');
assert(!dailySource.includes('MutationObserver'),'Daily course must not use continuous DOM observers');

const sentenceSource=readFile('sentence-coach-v53.js');
for(const level of ['starter','basic','intermediate','upper'])assert(sentenceSource.includes(`${level}:[`),`Sentence Coach missing ${level} bank`);
assert(sentenceSource.includes('window.getDailyLesson'),'Sentence Coach must use current Day content');
assert(!sentenceSource.includes("fetch('/api/ai'"),'Sentence Coach must remain local-only');
assert(!sentenceSource.includes('MutationObserver'),'Sentence Coach must not use continuous DOM observers');

const gamesSource=readFile('adaptive-games-v53.js');
for(const type of ['match','builder','listen','sprint','rush','gap','translate','memory','dialog','spell','trap'])assert(gamesSource.includes(`${type}:`)||gamesSource.includes(`'${type}'`),`Adaptive game missing ${type}`);
assert(gamesSource.includes('window.getDailyLesson'),'Games must use current Day content');
assert(gamesSource.includes('window.getLearnerLevel'),'Games must use selected learner level');
assert(!gamesSource.includes('MutationObserver'),'Adaptive games must not use continuous DOM observers');

const studySource=readFile('core3000-study.js'),quizSource=readFile('oxford3000-practice.js');
assert(studySource.includes('filterOxfordByLearnerLevel'),'Oxford daily study must respect learner level');
assert(quizSource.includes('filterOxfordByLearnerLevel'),'Oxford quiz must respect learner level');

const accountSource=readFile('account-gate.js');
assert(accountSource.includes("classList.add('account-locked')"),'Login gate must lock lessons before authentication');
assert(accountSource.includes("if(!d.authenticated){overlay(d);return}"),'Unauthenticated learners must see login only');

const indexSource=readFile('index.html');
for(const asset of ['learner-level-v53.js?v=53','daily-course-v53.js?v=53','sentence-coach-v53.js?v=53','adaptive-games-v53.js?v=53','account-gate.js?v=53'])assert(indexSource.includes(asset),`Index missing ${asset}`);
for(const old of ['learner-level.js?v=50','sentence-coach.js?v=51','adaptive-learning-v52.js?v=52'])assert(!indexSource.includes(old),`Old unsafe/obsolete asset still loaded: ${old}`);
assert(indexSource.includes('>แต่งประโยค</span>'),'Bottom nav must use writing practice');

const swSource=readFile('sw.js');
assert(swSource.includes("const CACHE='my-english-v53'"),'Service worker cache must be v53');
for(const asset of ['./learner-level-v53.js?v=53','./daily-course-v53.js?v=53','./sentence-coach-v53.js?v=53','./adaptive-games-v53.js?v=53'])assert(swSource.includes(asset),`Service worker missing ${asset}`);

console.log(JSON.stringify({ok:true,rows:3000,stories:25,learnerLevels:4,dailyCourseDays:210,weeks:30,levelStartDays:{starter:1,basic:22,intermediate:71,upper:141},legacyProgressPreserved:true,levelAwareOxford:true,dayAwareGames:true,dayAwareSentenceCoach:true,noContinuousObservers:true},null,2));
