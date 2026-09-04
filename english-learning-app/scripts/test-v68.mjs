import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const source=fs.readFileSync('fun-lessons-v68.js','utf8');
const store=new Map(); class Element{}
const levels=['A1','A2','B1','B2'];
const oxford=Array.from({length:3000},(_,i)=>{const n=i+1,w=`oxford${n}`;return{id:n,word:w,thai:`คำอ็อกซ์ฟอร์ด${n}`,part:i%4===0?'n.':i%4===1?'v.':i%4===2?'adj.':'adv.',level:levels[i%4],example:`A unique Oxford example ${n} uses ${w} naturally.`,exampleThai:`ตัวอย่างอ็อกซ์ฟอร์ดเฉพาะหมายเลข ${n}`}});
const patterns=[
 ['Greetings & Sounds','My name is ___.',`พบคนใหม่และแนะนำตัว`],
 ['Daily Routine','I ___ every day.',`เล่ากิจวัตร`],
 ['Present Continuous','I am ___ing now.',`บอกสิ่งที่กำลังทำ`],
 ['Past Simple','Yesterday I ___.',`เล่าเรื่องเมื่อวาน`],
 ['Future Plans','I am going to ___.',`พูดแผนพรุ่งนี้`],
 ['Home & Rooms','There is ___.',`บอกของในบ้าน`],
 ['Can, Requests & Ability','Can you ___, please?',`ขอความช่วยเหลือ`],
 ['Advice & Rules','You should ___.',`ให้คำแนะนำ`],
 ['Opinions & Reasons','I think ___ because ___.',`ให้ความคิดเห็น`],
 ['Storytelling','First... Then... Finally...',`เล่าเรื่องเป็นลำดับ`]
];
const fakeLesson=day=>{const [title,pattern,goal]=patterns[(day-1)%patterns.length];const focus=`focus${day}`;return{day,cefr:levels[(day-1)%4],title:`${title} ${day}`,goal,scenario:`สถานการณ์เฉพาะบท ${day}`,pattern,focusWord:{en:focus,th:`คำหลัก${day}`,part:'n.'},vocab:[{en:focus,th:`คำหลัก${day}`,part:'n.'},...Array.from({length:5},(_,i)=>({en:`repeat${i}`,th:`คำซ้ำ${i}`,part:'v.'}))],examplePairs:Array.from({length:4},(_,i)=>({en:`Core teaching example lesson ${day} number ${i+1}.`,th:`ตัวอย่างสอนบท ${day} ลำดับ ${i+1}`,word:focus,wordThai:`คำหลัก${day}`})),examples:[]}};
const document={querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},body:{appendChild(){}},createElement(){return{innerHTML:'',querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},remove(){},setAttribute(){},appendChild(){},classList:{add(){},toggle(){}}}}};
const sandbox={console,document,Element,Event:class{},CustomEvent:class{},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v))},getLearnerLevel:()=> 'starter',getDailyCourseProgress:()=>({currentDay:1,unlockedThrough:210,completed:[],startDay:1}),getDailyLesson:fakeLesson,getOxford3000:()=>oxford,ensureOxford3000:async()=>oxford,addEventListener(){},setTimeout(){return 0},clearTimeout(){},speechSynthesis:{cancel(){},speak(){}},SpeechSynthesisUtterance:class{},navigator:{}};sandbox.window=sandbox;
vm.createContext(sandbox);vm.runInContext(source,sandbox,{filename:'fun-lessons-v68.js'});
const audit=sandbox.auditFunLessonsV68();
assert.equal(audit.version,'v68');
assert.equal(audit.totalLessons,210);
assert.equal(audit.teachStagesPerLesson,6);
assert.equal(audit.totalTeachStages,1260);
assert.equal(audit.distinctTeachingBlueprints,210);
assert.equal(audit.distinctStageSignatures,1260);
assert.equal(audit.uniqueVocabularyWords,1260);
assert.equal(audit.uniqueExamples,1680);
assert.equal(audit.adjacentVocabularyRepeats.length,0);
assert.equal(audit.quizQuestionsPerLesson,8);
assert.equal(audit.quizPass,6);
assert.equal(audit.quizBad.length,0);
assert.equal(audit.teachQuizExactLeaks.length,0);
assert.equal(audit.finalVoiceCopiedTeaching.length,0);
assert.equal(audit.teacherClipSlides,5);
assert.equal(audit.thaiNarration,true);
assert.equal(audit.animationStorage,'static-code-no-database');
assert.equal(audit.ok,true);
const d=sandbox.getFunLessonDataV68(1);
assert.equal(d.blueprint.stages[0].code,'clip');
assert.equal(d.blueprint.stages[1].code,'words');
assert.equal(d.blueprint.stages[2].code,'grammar');
assert.equal(d.blueprint.stages[3].code,'model');
assert.equal(d.blueprint.stages[4].code,'guided');
assert.equal(d.blueprint.stages[5].code,'produce');
assert.equal(d.quiz.length,8);
assert(source.includes("u.lang='th-TH'"));
assert(source.includes('TEACH BEFORE TEST'));
assert(source.includes('คลิปนี้สร้างด้วยข้อความ + Animation + เสียงจากอุปกรณ์ ไม่ใช่ไฟล์วิดีโอ'));
console.log(JSON.stringify({ok:true,version:'v68',lessons:210,teachStages:1260,vocab:audit.uniqueVocabularyWords,examples:audit.uniqueExamples,teacherClipSlides:5,thaiNarration:true,quiz:'6/8',teachQuizLeaks:0,finalVoiceCopies:0,databaseVideoStorage:false},null,2));
