import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';

const root=path.resolve(process.cwd());
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const packs=['oxford3000-pack-01.js','oxford3000-pack-02.js','oxford3000-pack-03.js','oxford3000-pack-03b.js','oxford3000-pack-04.js','oxford3000-pack-05.js','oxford3000-pack-06.js','oxford3000-pack-07.js','oxford3000-pack-08.js'];
let b64='';
for(const name of packs){const m=read(name).match(/\+\s*'([A-Za-z0-9+/=]+)'\s*;?\s*$/);assert(m,`Cannot extract ${name}`);b64+=m[1]}
const parsed=JSON.parse(zlib.gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
const rows=Array.isArray(parsed)?parsed:(parsed?.rows||parsed?.data||parsed?.words||parsed?.items||[]);
const get=(r,key,i)=>Array.isArray(r)?r[i]:r?.[key];
assert.equal(rows.length,3000,'Oxford payload must contain exactly 3000 rows');
assert.equal(rows.filter(r=>!String(get(r,'word',1)||'').trim()).length,0,'Oxford words missing');
assert.equal(rows.filter(r=>!/[ก-๙]/.test(String(get(r,'thai',4)||get(r,'translation',4)||''))).length,0,'Thai meanings missing');
assert.equal(rows.filter(r=>!String(get(r,'example',5)||r?.sentence||'').trim()).length,0,'Examples missing');
assert.equal(rows.filter(r=>!/[ก-๙]/.test(String(get(r,'exampleThai',6)||r?.example_thai||r?.sentenceThai||''))).length,0,'Thai examples missing');
assert.equal(new Set(rows.map((r,i)=>get(r,'id',0)??i+1)).size,3000,'Oxford IDs must be unique');

const jsFiles=['learner-level-v53.js','daily-course-v53.js','sentence-coach-v55.js','game-content-v56.js','adaptive-games-v54.js','learning-experience-v55.js','curriculum-quality-v57.js','terminology-v58.js','game-difficulty-pre-v62.js','course-game-fixes-v59.js','curriculum-variety-v60.js','fun-lessons-v67.js','fun-lessons-v68.js','fun-lessons-v69.js','institute-course-v62.js','answer-integrity-v63.js','lesson-variety-v64.js','mastery-variety-v64b.js','interaction-quality-v65.js','learning-guide.js','oxford3000-loader.js','oxford3000-core.js','core3000-study.js','core3000-library.js','oxford3000-practice.js','oxford3000-stories.js','oxford3000-story-upgrade.js','oxford3000-story-speed.js','core3000-plan.js','account-gate.js','account-admin.js'];
for(const file of jsFiles){const c=spawnSync(process.execPath,['--check',path.join(root,file)],{encoding:'utf8'});assert.equal(c.status,0,`${file} syntax error:\n${c.stderr||c.stdout}`)}

const daily=read('daily-course-v53.js');
assert(daily.includes('const TOTAL_DAYS=210'),'Course must contain 210 lessons');
assert.equal((daily.match(/^    \['L[0-5]'/gm)||[]).length,30,'Course must define 30 teaching weeks');
assert(daily.includes('unlockedThrough'),'Course must unlock sequentially');
assert(!daily.includes('MutationObserver'),'Daily course must remain event-driven');

const level=read('learner-level-v53.js');
for(const start of ['startDay:1','startDay:22','startDay:71','startDay:141'])assert(level.includes(start),`Missing course start ${start}`);
assert(level.includes('filterOxfordByLearnerLevel'),'Oxford CEFR filter missing');

const account=read('account-gate.js'),admin=read('account-admin.js');
assert(account.includes("const VERSION='v61'"),'Account gate must stay v61');
assert(account.includes("classList.add('account-locked')"),'Login gate must lock lessons before auth');
assert(account.includes("if(!d.authenticated){overlay(d);return}"),'Unauthenticated learners must see login only');
assert(!account.includes("action:'register'"),'Public registration must remain unavailable');
assert(admin.includes("action:'create-user'")&&admin.includes("action:'reset-password'"),'Admin learner management missing');

const legacy=read('fun-lessons-v67.js'),v68=read('fun-lessons-v68.js'),v69=read('fun-lessons-v69.js');
assert(legacy.includes("const V='v67'"),'v67 rollback engine missing');
assert(v68.includes("const V='v68'"),'v68 provider engine missing');
assert(v68.includes("PHASES=['clip','words','grammar','model','guided','produce']"),'v68 teach-before-test order missing');
assert(v68.includes("QUIZ=8,PASS=6"),'v68 quiz must be 8 questions with 6/8 pass');
assert(v68.includes("u.lang='th-TH'"),'v68 Thai narration missing');
assert(v68.includes('databaseVideoStorage:false'),'v68 must not store teacher clips in database');
assert(v69.includes("const V='v69'"),'v69 cartoon teacher engine missing');
assert(v69.includes('aria-label="ครูการ์ตูน"'),'v69 teacher cartoon missing');
assert(v69.includes('aria-label="นักเรียนการ์ตูน"'),'v69 student cartoons missing');
assert(v69.includes("const sayTh=t=>speak(t,'th-TH')"),'v69 Thai teacher narration missing');
assert(v69.includes('ครูเมย์'),'v69 Thai teacher character missing');
assert(v69.includes('databaseMediaStorage:false'),'v69 media must stay out of database');
assert(!v69.includes('MutationObserver'),'v69 must remain event-driven');

const index=read('index.html');
const required=['account-gate.js?v=61','daily-course-v53.js?v=53','curriculum-variety-v60.js?v=60','fun-lessons-v69.js?v=69','fun-lessons-v69.css?v=69','fun-lessons-v68.js?v=68','fun-lessons-v68.css?v=68','institute-course-v62.js?v=62','answer-integrity-v63.js?v=63','lesson-variety-v64.js?v=64','mastery-variety-v64b.js?v=64','interaction-quality-v65.js?v=65'];
for(const asset of required)assert(index.includes(asset),`Index missing ${asset}`);
assert(!index.includes('fun-lessons-v67.js?v=67'),'Production index must not load v67 engine');
assert(index.indexOf('fun-lessons-v69.js?v=69')<index.indexOf('fun-lessons-v68.js?v=68'),'v69 click capture must register before v68');
assert(index.indexOf('fun-lessons-v68.js?v=68')<index.indexOf('institute-course-v62.js?v=62'),'v68 provider must load before institute layer');
assert(index.includes('>SENTENCE COACH</span>')&&index.includes('210 บทเรียน'),'Main UI terminology changed unexpectedly');

const sw=read('sw.js');
assert(sw.includes("const CACHE='my-english-v69'"),'Service worker cache must be v69');
for(const asset of ['./fun-lessons-v69.js?v=69','./fun-lessons-v69.css?v=69','./fun-lessons-v68.js?v=68','./fun-lessons-v68.css?v=68','./interaction-quality-v65.js?v=65','./lesson-variety-v64.js?v=64','./account-gate.js?v=61'])assert(sw.includes(asset),`Service worker missing ${asset}`);
assert(!sw.includes('./fun-lessons-v67.js?v=67'),'Current PWA cache must not serve v67 lesson engine');

console.log(JSON.stringify({ok:true,rows:3000,courseLessons:210,separateLearnerLogin:true,registrationClosed:true,rollbackVersion:'v67',providerVersion:'v68',funLessonVersion:'v69',cartoonTeacher:true,thaiTeacherNarration:true,databaseMediaStorage:false,noContinuousObservers:true},null,2));
