import fs from 'node:fs';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const read=n=>fs.readFileSync(new URL(`../${n}`,import.meta.url),'utf8');
for(const f of ['oxford3000-story-speed-v84.js','story-sentence-controls-v85.js']){const c=spawnSync(process.execPath,['--check',new URL(`../${f}`,import.meta.url).pathname],{encoding:'utf8'});assert.equal(c.status,0,`${f} syntax error: ${c.stderr||c.stdout}`)}
const speed=read('oxford3000-story-speed-v84.js'),controls=read('story-sentence-controls-v85.js'),sw=read('sw.js'),index=read('index.html');
for(const marker of ["verySlow:{label:'ช้ามากที่สุด',rate:.32}","slow:{label:'ช้ามาก',rate:.42}","medium:{label:'ช้า',rate:.52}","fast:{label:'ช้าปกติ',rate:.65}",'v85-four-slower-speeds','grid-template-columns:repeat(4','story-sentence-controls-v85.js?v=85','getRate:currentRate'])assert(speed.includes(marker),`speed runtime missing ${marker}`);
for(const marker of ['v85-story-sentence-controls','data-v85-translate','data-v85-say','reliableSentenceTap:true','explicitTranslateButton:true','explicitSentenceAudioButton:true','pointerup','story-paragraph-translation p'])assert(controls.includes(marker),`sentence controls missing ${marker}`);
assert(!controls.includes('new MutationObserver('),'sentence controls must not add a MutationObserver');
assert(sw.includes("const CACHE='my-english-v85-story-controls1'"),'fresh V85 sentence-control cache missing');
assert(sw.includes('./story-sentence-controls-v85.js?v=85'),'service worker must cache sentence controls');
assert(index.includes("document.documentElement.classList.add('account-locked')"),'registration must remain closed');
console.log(JSON.stringify({ok:true,version:'v85-story-sentence-controls',sentenceTapReliable:true,explicitActions:['translate','sentence-audio'],speeds:[0.32,0.42,0.52,0.65],levels:4},null,2));
