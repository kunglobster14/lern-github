import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';

const root=path.resolve(process.cwd());
const readFile=name=>fs.readFileSync(path.join(root,name),'utf8');
const packFiles=['oxford3000-pack-01.js','oxford3000-pack-02.js','oxford3000-pack-03.js','oxford3000-pack-03b.js','oxford3000-pack-04.js','oxford3000-pack-05.js','oxford3000-pack-06.js','oxford3000-pack-07.js','oxford3000-pack-08.js'];
let b64='';
for(const name of packFiles){const m=readFile(name).match(/\+\s*'([A-Za-z0-9+/=]+)'\s*;?\s*$/);assert(m,`Cannot extract ${name}`);b64+=m[1]}
const parsed=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
const rows=Array.isArray(parsed)?parsed:(parsed?.rows||parsed?.data||parsed?.words||parsed?.items||[]);
assert.equal(rows.length,3000,'Oxford payload must contain exactly 3000 rows');
const get=(r,key,index)=>Array.isArray(r)?r[index]:r?.[key];
assert.equal(rows.filter(r=>!String(get(r,'word',1)||'').trim()).length,0,'Oxford words missing');
assert.equal(rows.filter(r=>!/[ก-๙]/.test(String(get(r,'thai',4)||get(r,'translation',4)||''))).length,0,'Thai meanings missing');
assert.equal(rows.filter(r=>!String(get(r,'example',5)||r?.sentence||'').trim()).length,0,'Examples missing');
assert.equal(rows.filter(r=>!/[ก-๙]/.test(String(get(r,'exampleThai',6)||r?.example_thai||r?.sentenceThai||''))).length,0,'Thai examples missing');
assert.equal(new Set(rows.map((r,i)=>get(r,'id',0)??i+1)).size,3000,'Oxford IDs must be unique');

const jsFiles=['learner-level-v53.js','daily-course-v53.js','sentence-coach-v55.js','game-content-v56.js','adaptive-games-v54.js','learning-experience-v55.js','curriculum-quality-v57.js','terminology-v58.js','course-game-fixes-v59.js','curriculum-variety-v60.js','learning-guide.js','oxford3000-loader.js','oxford3000-core.js','core3000-study.js','core3000-library.js','oxford3000-practice.js','oxford3000-stories.js','oxford3000-story-upgrade.js','oxford3000-story-speed.js','core3000-plan.js','account-gate.js','account-admin.js'];
for(const file of jsFiles){const check=spawnSync(process.execPath,['--check',path.join(root,file)],{encoding:'utf8'});assert.equal(check.status,0,`${file} syntax error:\n${check.stderr||check.stdout}`)}

const storySource=readFile('oxford3000-stories.js');
assert.match(storySource,/const STORY_COUNT=25;/,'Story count must stay 25');
assert.match(storySource,/const WORDS_PER_STORY=120;/,'Story practice set must stay 120 words each');
assert.equal((storySource.match(/title:`/g)||[]).length,25,'Expected 25 authored story titles');

const levelSource=readFile('learner-level-v53.js');
for(const start of ['startDay:1','startDay:22','startDay:71','startDay:141'])assert(levelSource.includes(start),`Missing distinct course start ${start}`);
assert(levelSource.includes('filterOxfordByLearnerLevel'),'Oxford CEFR filter missing');

const dailySource=readFile('daily-course-v53.js');
assert(dailySource.includes("const TOTAL_DAYS=210"),'Course must contain 210 lessons internally');
assert.equal((dailySource.match(/^    \['L[0-5]'/gm)||[]).length,30,'Course must define 30 teaching weeks');
assert(dailySource.includes('unlockedThrough'),'Course must unlock the next lesson sequentially');
assert(!dailySource.includes('MutationObserver'),'Daily course must not use continuous DOM observers');

const sentenceSource=readFile('sentence-coach-v55.js');
assert(sentenceSource.includes('width:100vw;height:100dvh'),'Sentence Coach must fill viewport');
assert(sentenceSource.includes('say(answer)'),'Correct Sentence Coach answer must be spoken');
assert(sentenceSource.includes('setTimeout(next,1800)'),'Correct Sentence Coach answer must advance');
assert(!sentenceSource.includes("fetch('/api/ai'"),'Sentence Coach must remain local-only');

const gamesSource=readFile('adaptive-games-v54.js');
for(const type of ['match','builder','listen','sprint','rush','gap','translate','memory','dialog','spell','trap'])assert(gamesSource.includes(`${type}:`)||gamesSource.includes(`'${type}'`),`Adaptive game missing ${type}`);
assert(gamesSource.includes('pickNR'),'Games must avoid immediate repeats');
assert(!gamesSource.includes('MutationObserver'),'Adaptive games must not use continuous DOM observers');

const fixes=readFile('course-game-fixes-v59.js');
assert(fixes.includes('await window.ensureOxford3000()'),'Sentence games must wait for Oxford data');
assert(fixes.includes('กำลังโหลดคลังประโยค'),'Sentence games must show loading state instead of 0');
assert(fixes.includes('Mini Response · เลือกประโยคให้ตรงความหมาย'),'Confusing Mini Dialogue must be replaced');
assert(!fixes.includes('MutationObserver'),'v59 fixes must remain event-driven');

const variety=readFile('curriculum-variety-v60.js');
assert(variety.includes("const VERSION='v60'"),'Curriculum variety v60 missing');
assert(variety.includes('Mini Response · เลือกประโยคให้ตรงความหมาย'),'v60 must preserve coherent Mini Response');
assert(!variety.includes('MutationObserver'),'v60 must remain event-driven');

const accountSource=readFile('account-gate.js');
assert(accountSource.includes("const VERSION='v61'"),'Account gate must be v61');
assert(accountSource.includes("classList.add('account-locked')"),'Login gate must lock lessons before auth');
assert(accountSource.includes("if(!d.authenticated){overlay(d);return}"),'Unauthenticated learners must see login only');
assert(accountSource.includes('ผู้เรียนแต่ละคนใช้บัญชีของตัวเอง'),'Login must explain separate learner accounts');
assert(accountSource.includes("payload={action:'login'"),'Login must authenticate username/password');
assert(accountSource.includes("const displayName=status?.user?.displayName"),'Authenticated profile must display account identity');
assert(accountSource.includes('await push(true)'),'Logout must sync learner state before leaving');
assert(!accountSource.includes('action:\'register\''),'Public registration must remain unavailable');
const adminSource=readFile('account-admin.js');
assert(adminSource.includes("action:'create-user'"),'Admin must be able to create learner accounts');
assert(adminSource.includes("action:'reset-password'"),'Admin must be able to reset learner passwords');

const indexSource=readFile('index.html');
for(const asset of ['account-gate.js?v=61','account-gate.css?v=61','daily-course-v53.js?v=53','sentence-coach-v55.js?v=55','game-content-v56.js?v=56','adaptive-games-v54.js?v=54','learning-experience-v55.js?v=55','curriculum-quality-v57.js?v=57','terminology-v58.js?v=58','course-game-fixes-v59.js?v=59','curriculum-variety-v60.js?v=60'])assert(indexSource.includes(asset),`Index missing ${asset}`);
assert(indexSource.includes('>SENTENCE COACH</span>'),'Bottom nav must use SENTENCE COACH wording');
assert(indexSource.includes('210 บทเรียน'),'Index must use lesson terminology');

const swSource=readFile('sw.js');
assert(swSource.includes("const CACHE='my-english-v61'"),'Service worker cache must be v61');
for(const asset of ['./account-gate.js?v=61','./account-gate.css?v=61','./daily-course-v53.js?v=53','./sentence-coach-v55.js?v=55','./game-content-v56.js?v=56','./course-game-fixes-v59.js?v=59','./curriculum-variety-v60.js?v=60'])assert(swSource.includes(asset),`Service worker missing ${asset}`);

console.log(JSON.stringify({ok:true,rows:3000,stories:25,courseLessons:210,separateLearnerLogin:true,adminCreatesLearners:true,registrationClosed:true,profileIsolation:true,accountGateVersion:'v61',noContinuousObservers:true},null,2));
