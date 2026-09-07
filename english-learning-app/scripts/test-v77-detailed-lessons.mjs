import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=name=>fs.readFileSync(new URL(`../${name}`,import.meta.url),'utf8');
const experience=read('lesson-experience-v77.js');
const index=read('index.html');
const sw=read('sw.js');

new vm.Script(experience,{filename:'lesson-experience-v77.js'});

for(const marker of [
  "const V='v77-grammar-academy'",
  'ความหมายและหน้าที่ของ Grammar',
  'สูตรและวิธีสร้างประโยค',
  'ใช้เมื่อไร · ดู clue อย่างไร',
  'ตัวอย่างแปลและวิเคราะห์ทีละประโยค',
  'จุดผิดที่คนไทยพบบ่อย',
  'TOEIC Strategy · มองโจทย์อย่างเป็นระบบ',
  'ฝึกใช้จริง 4 ทักษะ',
  'สรุปก่อนเข้าสอบท้ายบท',
  'Mastery Checklist',
  'ทำไมต้องเรียนเรื่องนี้',
  'ประกอบประโยคทีละขั้น',
  'คำหรือสัญญาณที่ควรสังเกต',
  'เหตุผลที่ต้องเช็ก',
  'Final Voice · Transfer'
]) assert(experience.includes(marker),`missing V77 teaching marker: ${marker}`);

assert(experience.includes('#learningGuideCard,#learningRoadmap'),'V77 must defensively hide removed legacy home sections');
assert(index.includes('lesson-experience-v77.js?v=77d'),'V77 experience must load in production');
assert(sw.includes("const CACHE='my-english-v77-grammar-academy1'"),'service worker cache must advance to V77');
assert(sw.includes('./lesson-experience-v77.js?v=77d'),'V77 must be cached');
assert(index.indexOf('toeic-assessment-v76b.js?v=76b')<index.indexOf('lesson-experience-v77.js?v=77d'),'V77 experience must load after final V76 curriculum/assessment wrappers');

for(const legacy of ['learning-path.js?v=33','learning-guide.js?v=52','learning-path.css?v=33','learning-guide.css?v=33']){
  assert(!index.includes(legacy),`legacy home menu asset must be removed from index: ${legacy}`);
  assert(!sw.includes(`./${legacy}`),`legacy home menu asset must be removed from cache: ${legacy}`);
}

assert(index.includes("document.documentElement.classList.add('account-locked')"),'registration must remain closed');
assert(experience.includes('window.openDailyLessonV72=open'),'V77 must own active lesson routing');
assert(experience.includes('quizQuestions:8,quizPass:6'),'V77 must preserve Quiz 8/pass 6');
assert(experience.includes('teachBeforeTest:true'),'V77 must preserve teach-before-test');

console.log(JSON.stringify({ok:true,version:'v77-grammar-academy',legacyHomeMenusRemoved:true,detailedGrammarStages:8,toeicStrategy:true,fourSkills:true,quiz:'8/pass6',registrationClosed:true},null,2));
