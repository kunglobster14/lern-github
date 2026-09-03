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

const jsFiles=['learner-level-v53.js','daily-course-v53.js','sentence-coach-v55.js','game-content-v56.js','adaptive-games-v54.js','learning-experience-v55.js','learning-guide.js','oxford3000-loader.js','oxford3000-core.js','core3000-study.js','core3000-library.js','oxford3000-practice.js','oxford3000-stories.js','oxford3000-story-upgrade.js','oxford3000-story-speed.js','core3000-plan.js','account-gate.js'];
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

const dailySource=readFile('daily-course-v53.js');
assert(dailySource.includes("const TOTAL_DAYS=210"),'Course must contain 210 lessons internally');
for(const range of ["{id:'L0',from:1,to:21","{id:'L1',from:22,to:56","{id:'L2',from:57,to:98","{id:'L3',from:99,to:140","{id:'L4',from:141,to:182","{id:'L5',from:183,to:210"])assert(dailySource.includes(range),`Missing stage range ${range}`);
assert(dailySource.includes('const WEEKS=['),'Weekly curriculum missing');
assert.equal((dailySource.match(/^    \['L[0-5]'/gm)||[]).length,30,'Course must define 30 teaching weeks');
assert(dailySource.includes('unlockedThrough'),'Course must unlock the next lesson sequentially');
assert(dailySource.includes('Oxford 3000 และเรื่องสั้น 25 เรื่องยังเข้าได้ตามปกติ'),'Oxford/stories continuity message missing');
assert(!dailySource.includes('MutationObserver'),'Daily course must not use continuous DOM observers');

const sentenceSource=readFile('sentence-coach-v55.js');
for(const level of ['starter','basic','intermediate','upper'])assert(sentenceSource.includes(`${level}:[`),`Sentence Coach missing ${level} bank`);
assert(sentenceSource.includes('window.getDailyLesson'),'Sentence Coach must use current lesson content');
assert(sentenceSource.includes('width:100vw;height:100dvh'),'Sentence Coach must fill the viewport');
assert(sentenceSource.includes('say(answer)'),'Correct Sentence Coach answer must be spoken');
assert(sentenceSource.includes('setTimeout(next,1800)'),'Correct answer must advance automatically');
assert(sentenceSource.includes("window.__gameLabV31?.addProgress?.('ai',1)"),'Sentence Coach must preserve legacy mission progress');
assert(sentenceSource.includes('[data-game="mission"]'),'Former mission must route to Sentence Coach');
assert(!sentenceSource.includes("fetch('/api/ai'"),'Sentence Coach must remain local-only');
assert(!sentenceSource.includes('MutationObserver'),'Sentence Coach must not use continuous DOM observers');

const gamesSource=readFile('adaptive-games-v54.js');
for(const type of ['match','builder','listen','sprint','rush','gap','translate','memory','dialog','spell','trap'])assert(gamesSource.includes(`${type}:`)||gamesSource.includes(`'${type}'`),`Adaptive game missing ${type}`);
assert(gamesSource.includes('window.getDailyLesson'),'Games must use current lesson content');
assert(gamesSource.includes('window.getLearnerLevel'),'Games must use selected learner level');
assert(gamesSource.includes('pickNR'),'Games must avoid immediate repeated prompts');
assert(gamesSource.includes("next(d,'builder'"),'Sentence Builder must continue automatically');
assert(gamesSource.includes("next(d,'gap'"),'Missing Word must continue automatically');
assert(gamesSource.includes("next(d,'dialog'"),'Survival Dialog must continue automatically');
assert(gamesSource.includes('SENTENCE COACH Surprise Mission'),'Mission UI must no longer say AI');
assert(!gamesSource.includes('MutationObserver'),'Adaptive games must not use continuous DOM observers');

const gameContent=readFile('game-content-v56.js');
assert(gameContent.includes("const VERSION='v56'"),'Expanded game content must be v56');
assert(gameContent.includes('window.getOxford3000'),'Game content must draw from Oxford 3000');
assert(gameContent.includes('window.filterOxfordByLearnerLevel'),'Game content must respect selected CEFR level');
assert(gameContent.includes('Math.min(360,pool.length)'),'Word games must use a broad rotating Oxford pool');
assert(gameContent.includes('sentenceRows'),'Sentence games must use the Oxford example-sentence pool');
for(const type of ['builder','gap','translate','dialog','context'])assert(gameContent.includes(`'${type}'`),`Expanded sentence game missing ${type}`);
assert(gameContent.includes('recent={word:[],sentence:[],type:[]}'),'Expanded games must track recent words/sentences/types');
assert(gameContent.includes('maxBlock=90'),'Expanded games must avoid a large recent window');
assert(!gameContent.includes('MutationObserver'),'Expanded game content must not add continuous DOM observers');

const experienceSource=readFile('learning-experience-v55.js');
for(const activity of ['ฟังแล้วพูดตาม','Pattern Lab · เรียงประโยค','คำศัพท์ในบริบท + Quick Check','Mini Dialogue · เลือกคำตอบที่ใช้จริง'])assert(experienceSource.includes(activity),`Interactive lesson missing ${activity}`);
assert(experienceSource.includes('พร้อมผ่านบทเมื่อทำอย่างน้อย 3/4 กิจกรรมหลัก'),'Lesson must require meaningful activity before completion');
assert(experienceSource.includes('window.openSentenceCoach'),'Lesson must connect to Sentence Coach');
assert(experienceSource.includes("window.openAdaptiveGame?.('mix')"),'Lesson must connect to games');
assert(experienceSource.includes('SKILL ROADMAP · ปรับตามระดับ'),'Dynamic skill roadmap missing');
assert(experienceSource.includes("legacy.style.display='none'"),'Static legacy milestone UI must be hidden, not deleted');
assert(experienceSource.includes('stageSamples'),'Skill roadmap must draw knowledge from real course lessons');
assert(experienceSource.includes("intermediate:['L2','L3','L4','L5']"),'A2-B1 skill route must differ');
assert(experienceSource.includes("upper:['L4','L5']"),'B1-B2 skill route must differ');
assert(!experienceSource.includes('MutationObserver'),'Learning experience must not add continuous DOM observers');

const studySource=readFile('core3000-study.js'),quizSource=readFile('oxford3000-practice.js');
assert(studySource.includes('filterOxfordByLearnerLevel'),'Oxford daily study must respect learner level');
assert(quizSource.includes('filterOxfordByLearnerLevel'),'Oxford quiz must respect learner level');

const accountSource=readFile('account-gate.js');
assert(accountSource.includes("classList.add('account-locked')"),'Login gate must lock lessons before authentication');
assert(accountSource.includes("if(!d.authenticated){overlay(d);return}"),'Unauthenticated learners must see login only');

const indexSource=readFile('index.html');
for(const asset of ['learner-level-v53.js?v=53','daily-course-v53.js?v=53','sentence-coach-v55.js?v=55','game-content-v56.js?v=56','adaptive-games-v54.js?v=54','learning-experience-v55.js?v=55','account-gate.js?v=53'])assert(indexSource.includes(asset),`Index missing ${asset}`);
for(const old of ['sentence-coach-v54.js?v=54','learning-ui-v54.js?v=54','sentence-coach-v53.js?v=53','adaptive-games-v53.js?v=53','complete-course.js','complete-course.css'])assert(!indexSource.includes(old),`Obsolete/unused UI still loaded: ${old}`);
assert(indexSource.indexOf('game-content-v56.js?v=56')<indexSource.indexOf('adaptive-games-v54.js?v=54'),'Expanded game content must load before adaptive game listeners');
assert(indexSource.includes('>SENTENCE COACH</span>'),'Bottom nav must use SENTENCE COACH wording');
assert(indexSource.includes('210 บทเรียน'),'Index must use lesson terminology');

const swSource=readFile('sw.js');
assert(swSource.includes("const CACHE='my-english-v56'"),'Service worker cache must be v56');
for(const asset of ['./daily-course-v53.js?v=53','./sentence-coach-v55.js?v=55','./game-content-v56.js?v=56','./adaptive-games-v54.js?v=54','./learning-experience-v55.js?v=55'])assert(swSource.includes(asset),`Service worker missing ${asset}`);
for(const removed of ['./sentence-coach-v54.js?v=54','./learning-ui-v54.js?v=54','./sentence-coach-v53.js?v=53','./complete-course.js?v=33','./complete-course.css?v=33'])assert(!swSource.includes(removed),`Service worker still caches removed asset ${removed}`);

console.log(JSON.stringify({ok:true,rows:3000,stories:25,learnerLevels:4,courseLessons:210,weeks:30,levelStartLessons:{starter:1,basic:22,intermediate:71,upper:141},legacyProgressPreserved:true,levelAwareOxford:true,endlessRandomGames:true,expandedOxfordGamePools:true,expandedSentenceGames:true,fullScreenSentenceCoach:true,continuousSentenceCoach:true,spokenCorrectAnswers:true,interactiveLessonActivities:4,dynamicSkillRoadmap:true,staticMilestoneHidden:true,lessonTerminology:true,noContinuousObservers:true},null,2));
