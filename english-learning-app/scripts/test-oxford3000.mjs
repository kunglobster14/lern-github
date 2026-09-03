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

const jsFiles=['oxford3000-loader.js','oxford3000-core.js','core3000-study.js','core3000-library.js','oxford3000-practice.js','oxford3000-stories.js','oxford3000-story-speed.js','core3000-plan.js'];
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

const speedSource=fs.readFileSync(path.join(root,'oxford3000-story-speed.js'),'utf8');
for(const label of ["label:'ช้า'","label:'กลาง'","label:'เร็ว'"])assert(speedSource.includes(label),`Missing story speed ${label}`);
for(const rate of ['rate:.6','rate:.9','rate:1.15'])assert(speedSource.includes(rate),`Missing story narration rate ${rate}`);
assert(speedSource.includes('data-story-speed'),'Story narration speed selector is missing');

console.log(JSON.stringify({ok:true,rows:rows.length,thaiTranslations:rows.length-missingThai.length,examples:rows.length-missingExample.length,thaiExamples:rows.length-missingExampleThai.length,syntaxFiles:jsFiles.length,stories:chapters.length,wordsPerStory:WORDS_PER_STORY,narration:true,narrationSpeeds:['slow','medium','fast']},null,2));
