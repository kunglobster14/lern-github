import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source=fs.readFileSync('terminology-v58.js','utf8');
const sandbox={
  document:{addEventListener(){},querySelectorAll(){return[]}},
  requestAnimationFrame(){return 0},setTimeout(){return 0},
  console
};
sandbox.window=sandbox;
vm.createContext(sandbox);
vm.runInContext(source,sandbox,{filename:'terminology-v58.js'});
const t=sandbox.toLessonTerminologyV58;
assert.equal(typeof t,'function');
assert.equal(t('DAY 71 · L2 · A2'),'บทเรียนที่ 71 · L2 · A2');
assert.equal(t('Day 71 → 210'),'บทเรียนที่ 71 → 210');
assert.equal(t('Day 1–21'),'บทเรียนที่ 1–21');
assert.equal(t('เลือก Day'),'เลือกบทเรียน');
assert.equal(t('ดูบทเรียน Day 72'),'ดูบทเรียนที่ 72');
assert.equal(t('เรียน Day นี้แล้ว · ไปต่อ'),'เรียนบทเรียนนี้แล้ว · ไปต่อ');
assert.equal(t('ผ่าน Day นี้ · ปลด Day ถัดไป'),'ผ่านบทเรียนนี้ · ปลด บทเรียนถัดไป');
assert.equal(t('หลักสูตรระดับนี้ 2/140 Day'),'หลักสูตรระดับนี้ 2/140 บทเรียน');
assert.equal(t('Yesterday I went to work.'),'Yesterday I went to work.');
assert.equal(t('I study every day.'),'I study every day.');
const index=fs.readFileSync('index.html','utf8');
assert(index.includes('terminology-v58.js?v=58'),'Index must load terminology v58');
assert(index.includes('game-difficulty-pre-v62.js?v=62'),'Index must load v62 game filter');
assert(index.includes('course-game-fixes-v59.js?v=59'),'Index must load v59 after terminology');
assert(index.indexOf('game-difficulty-pre-v62.js?v=62')>index.indexOf('terminology-v58.js?v=58'),'v62 game policy must load after terminology');
assert(index.indexOf('course-game-fixes-v59.js?v=59')>index.indexOf('game-difficulty-pre-v62.js?v=62'),'v62 game capture must run before v59 game capture');
assert(index.includes('LOCAL · 210 บทเรียน'),'Top badge must use Thai lesson terminology');
const sw=fs.readFileSync('sw.js','utf8');
assert(sw.includes("const CACHE='my-english-v65'"),'Service worker cache must be v65');
assert(sw.includes('./terminology-v58.js?v=58'),'Service worker must cache terminology v58');
assert(sw.includes('./game-difficulty-pre-v62.js?v=62'),'Service worker must cache v62 game policy');
assert(sw.includes('./course-game-fixes-v59.js?v=59'),'Service worker must cache v59 fixes');
assert(sw.includes('./lesson-variety-v64.js?v=64'),'Service worker must cache v64 lesson variety');
assert(sw.includes('./interaction-quality-v65.js?v=65'),'Service worker must cache v65 interaction quality');
console.log(JSON.stringify({ok:true,version:'v58',dayUiRemoved:true,examples:['บทเรียนที่ 1','เลือกบทเรียน','บทเรียนถัดไป'],compatibleWith:'v65'},null,2));
