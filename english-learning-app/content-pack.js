(()=>{
  const extraWords=[
    ['goodbye','ลาก่อน','กูด-บาย','Goodbye. See you tomorrow.','ลาก่อน แล้วเจอกันพรุ่งนี้'],
    ['yes','ใช่','เยส','Yes, I understand.','ใช่ ฉันเข้าใจ'],
    ['no','ไม่','โน','No, thank you.','ไม่ ขอบคุณ'],
    ['sorry','ขอโทษ','ซอ-รี','Sorry, I am late.','ขอโทษ ฉันมาสาย'],
    ['help','ช่วยเหลือ','เฮลพ์','Can you help me?','คุณช่วยฉันได้ไหม'],
    ['name','ชื่อ','เนม','My name is Kung.','ฉันชื่อกุ้ง'],
    ['friend','เพื่อน','เฟรนด์','She is my friend.','เธอเป็นเพื่อนของฉัน'],
    ['family','ครอบครัว','แฟม-มะ-ลี','I love my family.','ฉันรักครอบครัวของฉัน'],
    ['morning','ตอนเช้า','มอร์-นิง','Good morning.','สวัสดีตอนเช้า'],
    ['night','กลางคืน','ไนท์','Good night.','ราตรีสวัสดิ์'],
    ['tomorrow','พรุ่งนี้','ทู-มอ-โร','See you tomorrow.','เจอกันพรุ่งนี้'],
    ['yesterday','เมื่อวาน','เยส-เทอร์-เดย์','I worked yesterday.','เมื่อวานฉันทำงาน'],
    ['now','ตอนนี้','นาว','I am busy now.','ตอนนี้ฉันยุ่ง'],
    ['later','ทีหลัง / ภายหลัง','เล-เทอร์','I will call you later.','ฉันจะโทรหาคุณทีหลัง'],
    ['time','เวลา','ไทม์','What time is it?','ตอนนี้กี่โมง'],
    ['one','หนึ่ง','วัน','I need one coffee.','ฉันต้องการกาแฟหนึ่งแก้ว'],
    ['two','สอง','ทู','Two tickets, please.','ขอตั๋วสองใบ'],
    ['three','สาม','ทรี','I have three bags.','ฉันมีกระเป๋าสามใบ'],
    ['coffee','กาแฟ','คอฟ-ฟี','I would like coffee.','ฉันต้องการกาแฟ'],
    ['tea','ชา','ที','Do you have tea?','คุณมีชาไหม'],
    ['rice','ข้าว','ไรซ์','I would like rice.','ฉันต้องการข้าว'],
    ['chicken','ไก่','ชิค-เคิน','I like chicken.','ฉันชอบไก่'],
    ['delicious','อร่อย','ดิ-ลิช-เชิส','This is delicious.','อันนี้อร่อย'],
    ['bill','บิล / เช็กบิล','บิล','The bill, please.','ขอเช็กบิลครับ/ค่ะ'],
    ['shop','ร้านค้า / ซื้อของ','ช็อพ','I want to shop.','ฉันอยากซื้อของ'],
    ['price','ราคา','ไพรซ์','What is the price?','ราคาเท่าไร'],
    ['cheap','ราคาถูก','ชีพ','This is cheap.','อันนี้ราคาถูก'],
    ['expensive','ราคาแพง','เอ็กซ์-เพน-ซิฟ','This is too expensive.','อันนี้แพงเกินไป'],
    ['cash','เงินสด','แคช','Can I pay cash?','ฉันจ่ายเงินสดได้ไหม'],
    ['card','บัตร','คาร์ด','Can I pay by card?','ฉันจ่ายด้วยบัตรได้ไหม'],
    ['station','สถานี','สเท-ชัน','Where is the station?','สถานีอยู่ที่ไหน'],
    ['airport','สนามบิน','แอร์-พอร์ต','I am going to the airport.','ฉันกำลังไปสนามบิน'],
    ['hotel','โรงแรม','โฮ-เทล','My hotel is near here.','โรงแรมของฉันอยู่ใกล้ที่นี่'],
    ['room','ห้อง','รูม','I need a room.','ฉันต้องการห้องพัก'],
    ['ticket','ตั๋ว','ทิค-เก็ต','I need a ticket.','ฉันต้องการตั๋ว'],
    ['bus','รถบัส','บัส','Where is the bus?','รถบัสอยู่ที่ไหน'],
    ['train','รถไฟ','เทรน','The train is late.','รถไฟมาช้า'],
    ['left','ซ้าย','เลฟท์','Turn left here.','เลี้ยวซ้ายตรงนี้'],
    ['right','ขวา','ไรท์','Turn right here.','เลี้ยวขวาตรงนี้'],
    ['straight','ตรงไป','สเทรท','Go straight.','ตรงไป'],
    ['office','สำนักงาน','ออฟ-ฟิศ','I am at the office.','ฉันอยู่ที่สำนักงาน'],
    ['meeting','การประชุม','มีท-ทิง','I have a meeting today.','วันนี้ฉันมีประชุม'],
    ['computer','คอมพิวเตอร์','คอม-พิว-เทอร์','My computer is slow.','คอมพิวเตอร์ของฉันช้า'],
    ['email','อีเมล','อี-เมล','I will send an email.','ฉันจะส่งอีเมล'],
    ['finish','เสร็จ / ทำให้เสร็จ','ฟิ-นิช','I will finish today.','ฉันจะทำให้เสร็จวันนี้']
  ];

  const existing=new Set(words.map(w=>w[0]));
  extraWords.forEach(w=>{if(!existing.has(w[0]))words.push(w)});

  const quizBank=[
    {q:'Good morning. ใช้เมื่อใด?',c:['ตอนเช้า','ตอนกลางคืน','เวลาบอกลา'],a:0},
    {q:'Can you help me? หมายถึงอะไร?',c:['คุณช่วยฉันได้ไหม','คุณชื่ออะไร','คุณจะไปไหน'],a:0},
    {q:'The bill, please. ใช้ในสถานการณ์ใด?',c:['ขอเช็กบิล','ขอห้องพัก','ถามทาง'],a:0},
    {q:'คำว่า สนามบิน คือคำใด?',c:['station','airport','office'],a:1},
    {q:'Turn left here. หมายถึงอะไร?',c:['เลี้ยวขวาตรงนี้','ตรงไป','เลี้ยวซ้ายตรงนี้'],a:2},
    {q:'Can I pay by card? หมายถึงอะไร?',c:['จ่ายด้วยบัตรได้ไหม','มีตั๋วไหม','ราคาเท่าไร'],a:0},
    {q:'I have a meeting today. หมายถึงอะไร?',c:['วันนี้ฉันมีประชุม','วันนี้ฉันหยุด','ฉันกำลังกลับบ้าน'],a:0},
    {q:'This is too expensive. หมายถึงอะไร?',c:['อันนี้ถูกมาก','อันนี้แพงเกินไป','อันนี้อร่อย'],a:1},
    {q:'Where is the station? ใช้ถามอะไร?',c:['ถามสถานีอยู่ที่ไหน','ถามราคา','ถามชื่อ'],a:0},
    {q:'Two tickets, please. หมายถึงอะไร?',c:['ขอตั๋วสองใบ','ขอกาแฟสองแก้ว','ขอสองห้อง'],a:0},
    {q:'คำว่า พรุ่งนี้ คือคำใด?',c:['today','tomorrow','yesterday'],a:1},
    {q:'I will send an email. หมายถึงอะไร?',c:['ฉันจะส่งอีเมล','ฉันจะประชุม','ฉันจะซื้อของ'],a:0},
    {q:'Go straight. หมายถึงอะไร?',c:['ตรงไป','เลี้ยวซ้าย','หยุด'],a:0},
    {q:'Do you have tea? หมายถึงอะไร?',c:['คุณมีชาไหม','คุณชอบกาแฟไหม','คุณหิวไหม'],a:0},
    {q:'My name is Kung. หมายถึงอะไร?',c:['ฉันชื่อกุ้ง','ฉันมาจากกุ้ง','ฉันชอบกุ้ง'],a:0}
  ];

  // Keep each quiz session short: 5 random questions.
  for(let i=quizBank.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[quizBank[i],quizBank[j]]=[quizBank[j],quizBank[i]]}
  quiz.splice(0,quiz.length,...quizBank.slice(0,5));

  Object.assign(scenarios,{
    restaurant:{label:'🍜 ร้านอาหาร',opening:'Hello! Are you ready to order?',hint:'ลองตอบ: I would like chicken and rice, please.'},
    shopping:{label:'🛍️ ช้อปปิ้ง',opening:'Hi! Can I help you find something?',hint:'ลองตอบ: How much is this?'},
    hotel:{label:'🏨 โรงแรม',opening:'Welcome! Do you have a reservation?',hint:'ลองตอบ: Yes, I have a reservation.'},
    airport:{label:'🛫 สนามบิน',opening:'Hello! Where are you flying today?',hint:'ลองตอบ: I am flying to Bangkok.'}
  });

  try{render()}catch{}
})();
