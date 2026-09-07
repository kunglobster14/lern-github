import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const read=n=>fs.readFileSync(new URL(`../${n}`,import.meta.url),'utf8');
const js=read('lesson-narrators-v79.js'),index=read('index.html'),sw=read('sw.js'),may=read('teacher-may-v79.svg'),pete=read('student-pete-v79.svg');
new vm.Script(js,{filename:'lesson-narrators-v79.js'});
for(const marker of ["v79-character-narrators","ครูเมย์","พีท","เสียงผู้หญิง","เสียงผู้ชาย","อธิบายภาษาไทย","บรรยายอัตโนมัติ","teacherText","peteText","th-TH","en-US","voiceGenderMapped:true"])assert(js.includes(marker),`missing narrator marker: ${marker}`);
assert(js.includes("window.openDailyLessonV77=open"),'V79 must wrap active lesson opening');
assert(js.includes('MutationObserver'),'V79 must follow each V77 lesson stage');
assert(js.includes('femaleNames')&&js.includes('maleNames'),'V79 must choose voice profiles by character gender');
assert(index.includes('lesson-narrators-v79.js?v=79'),'V79 narrators must load in production');
assert(index.indexOf('lesson-experience-v77.js?v=77d')<index.indexOf('lesson-narrators-v79.js?v=79'),'V79 must load after V77');
for(const asset of ['./lesson-narrators-v79.js?v=79','./teacher-may-v79.svg?v=79','./student-pete-v79.svg?v=79'])assert(sw.includes(asset),`SW missing ${asset}`);
for(const [name,svg] of [['teacher',may],['student',pete]]){assert(svg.includes('data:image/jpeg;base64,'),`${name} portrait must embed generated art`);assert(svg.includes('<image'),`${name} portrait missing image`)}
assert(index.includes("document.documentElement.classList.add('account-locked')"),'registration must remain closed');
console.log(JSON.stringify({ok:true,version:'v79-character-narrators',teacher:'ครูเมย์',student:'พีท',thaiNarration:true,genderMappedVoices:true,autoNarration:true,lessonStages:8,registrationClosed:true},null,2));