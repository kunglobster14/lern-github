(()=>{
const VERSION='v73-institute',TOTAL=210,PER_MODULE=6;
const ROLES=[{"key":"Foundation","th":"ปูพื้นและเข้าใจสถานการณ์","listening":"ฟังภาพรวมและจับคำสำคัญ","speaking":"พูดตามแบบสั้นแล้วตอบข้อมูลของตนเอง","reading":"อ่านข้อความสั้นเพื่อหาข้อมูลตรง","writing":"เขียนคำหรือประโยคสั้นจากข้อมูลของตนเอง"},{"key":"Language Builder","th":"สร้างรูปประโยคและใช้ให้ถูก","listening":"ฟังแยกโครงสร้างและคำสำคัญ","speaking":"ฝึกแทนคำและเปลี่ยนข้อมูลในประโยค","reading":"อ่านตัวอย่างแล้วสังเกตรูปประโยค","writing":"เขียนประโยคใหม่โดยใช้โครงสร้างเป้าหมาย"},{"key":"Listening Lab","th":"ฟังเพื่อจับความหมายและรายละเอียด","listening":"ฟังบทสนทนา/ประกาศแล้วจับใจความและรายละเอียด","speaking":"พูดสรุปสิ่งที่ได้ยินและตอบกลับ","reading":"อ่านคำถามหรือข้อมูลประกอบก่อนฟัง","writing":"จดคำสำคัญและเขียนคำตอบจากสิ่งที่ฟัง"},{"key":"Speaking Workshop","th":"พูดตอบโต้และสร้างคำตอบของตัวเอง","listening":"ฟังต้นแบบเรื่องจังหวะและน้ำเสียง","speaking":"พูดตอบทันที role-play และขยายคำตอบ","reading":"อ่าน cue card เพื่อวางแผนการพูด","writing":"เขียน key words ก่อนพูด ไม่เขียนสคริปต์เต็ม"},{"key":"Reading & Writing Studio","th":"อ่านจับใจความและเขียนสื่อสาร","listening":"ฟังคำอธิบายสั้นเพื่อเชื่อมบริบท","speaking":"พูดอธิบายสิ่งที่อ่านก่อนเขียน","reading":"อ่านป้าย แชต อีเมล ตาราง หรือข้อความตามระดับ","writing":"เขียนตอบ/สรุป/เรียบเรียงด้วยภาษาของตนเอง"},{"key":"Real-life Challenge","th":"บูรณาการ 4 ทักษะในสถานการณ์จริง","listening":"ฟังข้อมูลใหม่โดยไม่มีประโยคเฉลยจากช่วงสอน","speaking":"พูดตัดสินใจ แก้ปัญหา หรือสนทนาจำลอง","reading":"อ่านข้อมูลใหม่ที่จำเป็นต่อภารกิจ","writing":"เขียนคำตอบหรือข้อความที่ใช้จบภารกิจ"}];
const LISTENING=['บทสนทนาสั้น','ข้อความเสียง','ประกาศ','คำสั่ง','เรื่องเล่า','บทสนทนาหลายช่วง'];
const READING=['ป้าย/ข้อมูลสั้น','แชต','ตาราง/เมนู','อีเมลสั้น','ย่อหน้า','สถานการณ์พร้อมข้อมูลหลายชิ้น'];
const WRITING=['เติมข้อมูลให้สมบูรณ์','เขียนประโยคของตนเอง','เขียนข้อความตอบ','เรียงลำดับประโยค','เขียนสรุปสั้น','เขียนคำตอบเพื่อแก้สถานการณ์'];
const SPEAKING=['repeat + substitution','ตอบคำถามส่วนตัว','ถามกลับ','role-play','เล่า/อธิบาย','simulation'];
function level(day){return day<=54?'A1':day<=108?'A2':day<=162?'B1':'B2'}
function base(day){return window.getCurriculumV72?.(day)||{}}
function make(day){
 day=Math.max(1,Math.min(TOTAL,Number(day)||1));
 const b=base(day),role=ROLES[(day-1)%PER_MODULE],module=Math.ceil(day/PER_MODULE),core=window.getCoreVocabV73?.(day)||{newWords:[],reviewWords:[]};
 const title=b.title||b.v72Title||`Lesson ${day}`,goal=b.goal||'ใช้ภาษาอังกฤษตามสถานการณ์ของบท',scenario=b.scenario||'สถานการณ์ในชีวิตประจำวัน';
 const levelNow=b.level||level(day);
 const objective=`L${day} · ${role.th}: ${goal}`;
 const uniqueSeed=`M${String(module).padStart(2,'0')}-L${String(day).padStart(3,'0')}-${role.key}`;
 return {
   version:VERSION,day,lessonCode:`L${day}`,module,level:levelNow,title,englishTitle:b.englishTitle||b.en||'',goal,scenario,
   grammar:b.grammar||'',note:b.note||'',lessonType:role.key,lessonRole:role.th,objective,uniqueSeed,
   skills:{
     listening:{focus:role.listening,format:LISTENING[(day+module)%LISTENING.length]},
     speaking:{focus:role.speaking,format:SPEAKING[(day*2+module)%SPEAKING.length]},
     reading:{focus:role.reading,format:READING[(day*3+module)%READING.length]},
     writing:{focus:role.writing,format:WRITING[(day*5+module)%WRITING.length]}
   },
   coreVocabulary:core,
   sequence:['Objective','Teacher Explanation','Vocabulary in Context','Grammar / Language Function','Listening','Speaking','Reading','Writing','Integrated Practice','Mini Mission / Simulation','Lesson Summary','End-of-Lesson Test'],
   assessment:{quizQuestions:8,pass:6,separateFromTeaching:true,types:['listening','reading','usage','vocabulary-in-context','situation-response','sentence-building','writing-choice','speaking-transfer']},
   progression:levelNow==='A1'?'เข้าใจ → เลียนแบบ → ตอบสั้น → สร้างประโยค':levelNow==='A2'?'เข้าใจ → ถามต่อ → เล่า → เขียนข้อความ':levelNow==='B1'?'อธิบาย → ให้เหตุผล → เล่าเรื่อง → แก้ปัญหา':'วิเคราะห์ → เปรียบเทียบ → โต้แย้ง → เจรจา → สรุป'
 };
}
window.INSTITUTE_CURRICULUM_V73={version:VERSION,totalLessons:TOTAL,modules:35,lessonsPerModule:6,roles:ROLES};
window.getInstituteCurriculumV73=make;
})();