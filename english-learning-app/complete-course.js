(()=>{
  const KEY='myEnglishCompleteCourseV1';
  const stages=[
    {code:'A0',title:'Starter Zero',goal:'เริ่มจากศูนย์ อ่านคำพื้นฐานและพูดประโยคแรกได้',units:[
      ['Alphabet & Sounds','ตัวอักษรและเสียงพื้นฐาน','A / B / C · spell your name','ชื่อ ตัวอักษร เสียง','My name is Kung. K-U-N-G.','ฉันชื่อกุ้ง สะกด K-U-N-G','เขียนชื่อและสะกดชื่อเป็นอังกฤษ','Practice spelling my name and very basic English sounds.'],
      ['Hello & Goodbye','ทักทายและลา','Hello. / Hi. / Goodbye.','คำทักทาย มารยาท','Hello. Nice to meet you.','สวัสดี ยินดีที่ได้รู้จัก','เขียนบทสนทนาทักทาย 2 บรรทัด','Practice greetings and introductions with me.'],
      ['I / You / He / She','สรรพนามพื้นฐาน','I am... / You are...','คน ครอบครัว เพื่อน','I am Thai. She is my friend.','ฉันเป็นคนไทย เธอเป็นเพื่อนของฉัน','เขียน 3 ประโยคแนะนำคน','Practice pronouns and be-verbs with simple questions.'],
      ['Numbers 0–100','ตัวเลข อายุ เบอร์โทร','I am ___ years old.','ตัวเลข อายุ โทรศัพท์','I am thirty years old.','ฉันอายุ 30 ปี','เขียนอายุและตัวเลข 3 จำนวน','Ask me my age and simple number questions.'],
      ['Time & Days','เวลา วัน วันที่','It is nine o’clock.','เวลา วัน สัปดาห์','I start work at eight.','ฉันเริ่มงานแปดโมง','เขียนตารางเวลา 3 ประโยค','Practice asking and telling time.'],
      ['This / That','ชี้สิ่งของรอบตัว','This is... / That is...','ของใช้รอบตัว','This is my phone.','นี่คือโทรศัพท์ของฉัน','เขียนชื่อสิ่งของ 4 ชิ้น','Ask me what common objects are using this and that.'],
      ['Yes / No / Please','ตอบรับ ปฏิเสธ และสุภาพ','Yes, please. / No, thank you.','please thanks sorry excuse me','No, thank you. I am okay.','ไม่ ขอบคุณ ฉันโอเค','เขียนประโยคสุภาพ 3 ประโยค','Role-play a tiny polite conversation.'],
      ['A0 Checkpoint','รวมพื้นฐานทั้งหมด','My name is... I am... I like...','ทบทวน 100 คำแรก','Hello. My name is Kung. I am ready.','สวัสดี ฉันชื่อกุ้ง ฉันพร้อมแล้ว','เขียนแนะนำตัว 4 ประโยค','Give me an A0 speaking checkpoint one question at a time.']
    ]},
    {code:'A1',title:'Foundation',goal:'พูดเรื่องตัวเอง บ้าน อาหาร และกิจวัตรประจำวันได้',units:[
      ['Family & People','ครอบครัวและลักษณะคน','This is my... / He is...','ครอบครัว อาชีพ รูปร่าง','This is my brother. He is a teacher.','นี่คือน้องชายของฉัน เขาเป็นครู','เขียนแนะนำครอบครัว 4 ประโยค','Ask me easy questions about my family.'],
      ['Home & Rooms','บ้านและของใช้','There is... / There are...','ห้อง เฟอร์นิเจอร์ ของใช้','There is a table in my room.','มีโต๊ะอยู่ในห้องของฉัน','เขียนบรรยายห้อง 4 ประโยค','Practice describing a room with there is and there are.'],
      ['Daily Routine','กิจวัตรและ Present Simple','I work... / I go... every day.','ตื่น ทำงาน กิน นอน','I go to work at eight every day.','ฉันไปทำงานแปดโมงทุกวัน','เขียนกิจวัตร 5 ประโยค','Ask about my daily routine using present simple.'],
      ['Food & Drinks','อาหารและเครื่องดื่ม','I like... / I want...','อาหาร เครื่องดื่ม รสชาติ','I would like rice and water, please.','ฉันขอข้าวและน้ำครับ/ค่ะ','เขียนสิ่งที่ชอบกิน 4 ประโยค','Role-play ordering simple food and drinks.'],
      ['Shopping Basics','ราคา จำนวน และการซื้อ','How much is...? / I need...','ราคา เงิน สี ขนาด','How much is this shirt?','เสื้อตัวนี้ราคาเท่าไร','เขียนบทซื้อของ 4 บรรทัด','Role-play a simple shop conversation.'],
      ['Places & Directions','สถานที่และถามทาง','Where is...? / Go straight.','สถานที่ ถนน ทิศทาง','Where is the nearest station?','สถานีที่ใกล้ที่สุดอยู่ที่ไหน','เขียนบอกทาง 3 ขั้นตอน','Practice asking for and giving simple directions.'],
      ['Can / Can’t','ความสามารถและคำขอ','I can... / Can you...?','ทักษะ การขอความช่วยเหลือ','Can you help me, please?','คุณช่วยฉันได้ไหม','เขียนสิ่งที่ทำได้/ไม่ได้ 4 ประโยค','Practice can, cannot, and polite requests.'],
      ['A1 Checkpoint','รวมการใช้ชีวิตประจำวัน','Do you...? / Where...? / How much...?','ทบทวน A1','I can order food and ask for directions.','ฉันสามารถสั่งอาหารและถามทางได้','เขียนบทสนทนาชีวิตประจำวัน 6 บรรทัด','Give me an A1 survival conversation test.']
    ]},
    {code:'A1+',title:'Everyday English',goal:'เล่าเรื่องประจำวันและเข้าใจบทสนทนาง่าย ๆ ได้คล่องขึ้น',units:[
      ['Present Continuous','สิ่งที่กำลังทำ','I am ___ing now.','กิจกรรม ณ ตอนนี้','I am waiting for the bus.','ฉันกำลังรอรถบัส','เขียนสิ่งที่กำลังทำ 4 ประโยค','Practice present continuous with what is happening now.'],
      ['Frequency','บอกความถี่','I usually... / I never...','always usually sometimes never','I usually drink coffee in the morning.','ปกติฉันดื่มกาแฟตอนเช้า','เขียนนิสัย 5 ประโยค','Ask me about habits using frequency adverbs.'],
      ['Hobbies & Free Time','งานอดิเรกและเวลาว่าง','I enjoy... / I like to...','กีฬา เพลง หนัง งานอดิเรก','I like watching movies on weekends.','ฉันชอบดูหนังวันหยุด','เขียนงานอดิเรก 5 ประโยค','Have a friendly chat about hobbies.'],
      ['Body & Health','อาการเจ็บป่วยง่าย ๆ','I have... / I feel...','ร่างกาย อาการ สุขภาพ','I have a headache and I feel tired.','ฉันปวดหัวและรู้สึกเหนื่อย','เขียนอาการ 3 ประโยค','Role-play a simple clinic conversation.'],
      ['Weather & Clothes','อากาศและเสื้อผ้า','It is... / I am wearing...','อากาศ ฤดู เสื้อผ้า','It is raining, so I need an umbrella.','ฝนกำลังตก ฉันจึงต้องการร่ม','เขียนอากาศวันนี้และเสื้อผ้า','Ask me about today’s weather and clothing.'],
      ['Transport','การเดินทางในเมือง','How do I get to...?','รถบัส รถไฟ แท็กซี่','I take the train to work.','ฉันนั่งรถไฟไปทำงาน','เขียนวิธีเดินทาง 4 ประโยค','Practice public transport and asking routes.'],
      ['Past: Was / Were','เล่าอดีตด้วย be','I was... / We were...','เมื่อวาน สถานที่ ความรู้สึก','I was at home last night.','เมื่อคืนฉันอยู่บ้าน','เขียนเมื่อคืน 4 ประโยค','Ask me easy past questions using was and were.'],
      ['Past: Common Verbs','กริยาอดีตที่ใช้บ่อย','I went... / I had... / I saw...','went had saw did made','Yesterday I went to the market.','เมื่อวานฉันไปตลาด','เขียนเรื่องเมื่อวาน 5 ประโยค','Help me tell a simple story about yesterday.']
    ]},
    {code:'A2',title:'Functional English',goal:'วางแผน เปรียบเทียบ ให้เหตุผล และแก้ปัญหาง่าย ๆ ได้',units:[
      ['Future Plans','พูดแผนอนาคต','I am going to... / I will...','พรุ่งนี้ สัปดาห์หน้า แผน','I am going to visit my family this weekend.','สุดสัปดาห์นี้ฉันจะไปหาครอบครัว','เขียนแผน 5 ประโยค','Ask me about future plans and intentions.'],
      ['Comparatives','เปรียบเทียบ','bigger than / more expensive than','ขนาด ราคา คุณภาพ','This hotel is cheaper than that one.','โรงแรมนี้ถูกกว่าโรงแรมนั้น','เขียนเปรียบเทียบ 4 คู่','Practice comparing everyday things.'],
      ['Some / Any / Much / Many','จำนวนและปริมาณ','Do you have any...?','ปริมาณ อาหาร เงิน เวลา','Do you have any water?','คุณมีน้ำไหม','เขียนคำถามปริมาณ 5 ข้อ','Practice countable and uncountable quantity words.'],
      ['Should / Must / Have to','คำแนะนำและความจำเป็น','You should... / I have to...','กฎ สุขภาพ งาน','You should rest, but you have to call the office.','คุณควรพัก แต่ต้องโทรหาสำนักงาน','เขียนคำแนะนำ 4 ประโยค','Give me situations to practice should, must, and have to.'],
      ['Invitations & Plans','ชวน นัด และตอบรับ','Would you like to...?','นัด เวลา สถานที่','Would you like to have lunch tomorrow?','พรุ่งนี้ไปกินข้าวกลางวันด้วยกันไหม','เขียนข้อความชวนเพื่อน','Practice invitations, accepting, and declining politely.'],
      ['Phone & Messages','โทรศัพท์และฝากข้อความ','Can I speak to...?','โทร ข้อความ นัดหมาย','Can I leave a message?','ฉันฝากข้อความไว้ได้ไหม','เขียนข้อความสั้น 3 แบบ','Role-play a simple phone call and message.'],
      ['Problems & Help','อธิบายปัญหา','There is a problem with...','เสีย หาย ลืม สูญหาย','There is a problem with my room key.','กุญแจห้องของฉันมีปัญหา','เขียนปัญหาและคำขอ 4 ประโยค','Give me practical problems and make me ask for help.'],
      ['Story Linking','เล่าเรื่องต่อเนื่อง','First... then... after that... finally...','ลำดับเหตุการณ์','First I checked in. Then I found my gate.','ก่อนอื่นฉันเช็กอิน จากนั้นฉันหาเกต','เขียนเรื่อง 6 ประโยคเป็นลำดับ','Help me tell a short connected story.']
    ]},
    {code:'A2+',title:'Real-World Survival',goal:'จัดการสถานการณ์จริงระหว่างเดินทาง ทำงาน และใช้บริการได้',units:[
      ['Restaurant Complete','ตั้งแต่จองโต๊ะถึงจ่ายเงิน','I’d like... / Could we have...?','เมนู การสั่ง แพ้อาหาร เช็กบิล','Could we have the bill, please?','ขอเช็กบิลด้วยครับ/ค่ะ','เขียนบทสนทนาร้านอาหาร 8 บรรทัด','Run a full restaurant role-play from ordering to paying.'],
      ['Cafe & Small Talk','สั่งเครื่องดื่มและคุยสั้น ๆ','Could I get...?','กาแฟ ขนาด ความหวาน','Could I get a medium coffee with no sugar?','ขอกาแฟขนาดกลางไม่ใส่น้ำตาล','เขียนออเดอร์ของตัวเอง','Role-play a cafe order followed by simple small talk.'],
      ['Shopping Complete','ไซซ์ สี คืนสินค้า ชำระเงิน','Can I try this on?','เสื้อผ้า ไซซ์ คืนสินค้า','Can I exchange this for a larger size?','ฉันเปลี่ยนเป็นไซซ์ใหญ่กว่านี้ได้ไหม','เขียนบทคืนสินค้า 6 บรรทัด','Role-play shopping, fitting, payment, and exchange.'],
      ['Hotel Complete','เช็กอิน ปัญหาห้อง เช็กเอาต์','I have a reservation under...','จอง ห้อง สิ่งอำนวยความสะดวก','I have a reservation under Kung.','ฉันจองไว้ในชื่อกุ้ง','เขียนคำขอโรงแรม 5 ประโยค','Run a hotel role-play including one room problem.'],
      ['Airport Complete','เช็กอิน ตม. เกต กระเป๋า','Where is gate...?','เที่ยวบิน พาสปอร์ต กระเป๋า','My bag did not arrive.','กระเป๋าของฉันมาไม่ถึง','เขียนบทสนามบิน 8 บรรทัด','Run an airport journey from check-in to baggage claim.'],
      ['Doctor & Pharmacy','บอกอาการและเข้าใจคำแนะนำ','I have had... for...','อาการ ยา เวลา','I have had a cough for three days.','ฉันไอมาสามวันแล้ว','เขียนอาการและระยะเวลา','Role-play a basic doctor or pharmacy visit.'],
      ['Workplace Basics','อัปเดตงานและขอความช่วยเหลือ','I am working on...','ประชุม เดดไลน์ อีเมล งาน','I need more time to finish this task.','ฉันต้องการเวลาเพิ่มเพื่อทำงานนี้ให้เสร็จ','เขียนอัปเดตงาน 5 ประโยค','Run a simple work update conversation.'],
      ['Emergency English','ขอความช่วยเหลือเร่งด่วน','I need help. / Please call...','ตำรวจ โรงพยาบาล อันตราย','Please call an ambulance.','กรุณาเรียกรถพยาบาล','เขียนประโยคฉุกเฉิน 5 ประโยค','Practice calm, simple emergency English.']
    ]},
    {code:'B1',title:'Fluency Builder',goal:'อธิบายความคิดเห็น ประสบการณ์ และเรื่องราวได้ต่อเนื่อง',units:[
      ['Opinions & Reasons','แสดงความคิดเห็นพร้อมเหตุผล','I think... because...','ความคิดเห็น เหตุผล','I think public transport is useful because it is cheap.','ฉันคิดว่าขนส่งสาธารณะมีประโยชน์เพราะราคาถูก','เขียนความคิดเห็น 6 ประโยค','Ask my opinion and require reasons and examples.'],
      ['Present Perfect','ประสบการณ์และสิ่งที่เพิ่งเกิด','I have been... / I have never...','ประสบการณ์ การเดินทาง','I have been to Japan twice.','ฉันเคยไปญี่ปุ่นสองครั้ง','เขียนประสบการณ์ 5 ประโยค','Practice life experiences with present perfect.'],
      ['Storytelling','เล่าเรื่องมีต้นกลางจบ','At first... however... in the end...','เรื่องราว เหตุการณ์','At first I was nervous, but in the end everything was fine.','ตอนแรกฉันกังวล แต่สุดท้ายทุกอย่างเรียบร้อย','เขียนเรื่อง 8 ประโยค','Help me tell a complete short story with details.'],
      ['Describe People & Places','บรรยายละเอียดขึ้น','It is located... / He seems...','ลักษณะ บรรยากาศ บุคลิก','The hotel is small but comfortable and close to the station.','โรงแรมเล็กแต่สบายและใกล้สถานี','เขียนบรรยายสถานที่ 6 ประโยค','Make me describe a person or place in detail.'],
      ['Explain a Process','อธิบายขั้นตอน','First you... Next...','ขั้นตอน วิธีทำ','First you open the app, then you choose a lesson.','ก่อนอื่นเปิดแอป แล้วเลือกบทเรียน','เขียนวิธีทำ 6 ขั้นตอน','Ask me to explain a simple process clearly.'],
      ['Problem Solving','เสนอทางเลือกและตัดสินใจ','We could... / The best option is...','ทางเลือก ข้อดีข้อเสีย','We could take a taxi, but the train is cheaper.','เราอาจนั่งแท็กซี่ แต่รถไฟถูกกว่า','เขียนทางเลือก 3 แบบ','Give me a problem and discuss possible solutions.'],
      ['Agree & Disagree','เห็นด้วยและไม่เห็นด้วยอย่างสุภาพ','I agree, but... / I see your point.','การอภิปราย','I see your point, but I have a different opinion.','ฉันเข้าใจมุมมองคุณ แต่ฉันมีความเห็นต่าง','เขียนตอบเห็นด้วย/ไม่เห็นด้วย','Practice polite agreement and disagreement.'],
      ['Follow-up Questions','ทำให้บทสนทนาไหลต่อ','Really? Why? What happened next?','คำถามต่อยอด','That sounds interesting. What happened next?','ฟังดูน่าสนใจ แล้วเกิดอะไรต่อ','เขียนคำถามต่อยอด 8 ข้อ','Have a conversation where I must ask follow-up questions.']
    ]},
    {code:'B1+',title:'Reading & Writing',goal:'อ่านข้อมูลจริง เขียนข้อความ อีเมล และย่อหน้าได้',units:[
      ['Signs & Notices','อ่านป้ายและประกาศ','Please do not... / You must...','ป้าย กฎ เวลาเปิดปิด','Passengers must show a ticket before boarding.','ผู้โดยสารต้องแสดงตั๋วก่อนขึ้นรถ','สรุปความหมายป้าย 5 แบบ','Give me short signs and notices to interpret.'],
      ['Messages & Chats','อ่านและเขียนแชต','Can we meet...? / I’ll be late.','นัดหมาย ข้อความสั้น','I’ll be about ten minutes late. Sorry!','ฉันจะสายประมาณสิบ นาที ขอโทษนะ','เขียนข้อความนัดหมาย 4 แบบ','Practice practical text messages and replies.'],
      ['Forms & Personal Info','กรอกข้อมูล','First name / surname / address','ข้อมูลส่วนตัว แบบฟอร์ม','Please enter your full name and address.','กรุณากรอกชื่อเต็มและที่อยู่','เขียนข้อมูลตัวอย่างสำหรับแบบฟอร์ม','Practice understanding common form fields.'],
      ['Emails','อีเมลง่าย ๆ','Dear... / Could you... / Best regards','หัวข้อ คำขอ ปิดท้าย','Could you confirm the meeting time, please?','ช่วยยืนยันเวลาประชุมได้ไหม','เขียนอีเมลขอข้อมูล 6–8 บรรทัด','Help me write and improve a simple email.'],
      ['Short Articles','อ่านบทความสั้น','main idea / detail / opinion','หัวข้อ ข่าวง่าย ๆ','The article explains three simple ways to save time at work.','บทความอธิบายสามวิธีง่าย ๆ ในการประหยัดเวลาที่งาน','เขียนใจความสำคัญ 3 ประโยค','Give me a short B1 reading and ask comprehension questions.'],
      ['Summaries','สรุปใจความ','The main point is...','ใจความ รายละเอียดสำคัญ','The main point is that regular practice builds confidence.','ใจความหลักคือการฝึกสม่ำเสมอช่วยสร้างความมั่นใจ','สรุปเรื่อง 4 ประโยค','Practice summarizing short texts without copying.'],
      ['Paragraph Writing','เขียนย่อหน้ามีโครงสร้าง','topic sentence + support + ending','ย่อหน้า การเชื่อมความ','Learning English helps me communicate when I travel.','การเรียนอังกฤษช่วยให้ฉันสื่อสารเวลาเดินทาง','เขียนย่อหน้า 80–100 คำ','Coach me to write a clear 80-word paragraph.'],
      ['Work Email','อีเมลงานสุภาพ','I am writing to... / Please let me know...','งาน นัด ปัญหา ขอบคุณ','I am writing to ask for an update on the project.','ฉันเขียนมาเพื่อขออัปเดตโครงการ','เขียนอีเมลงาน 100 คำ','Review a simple professional email for clarity and politeness.']
    ]},
    {code:'B2',title:'Conversation Ready',goal:'คุยต่อเนื่อง อ่านเขียนในชีวิตจริง และรับมือสถานการณ์ไม่คาดคิดได้',units:[
      ['Small Talk 10 Minutes','คุยต่อเนื่องหลายหัวข้อ','Tell me more about...','ชีวิต งาน อาหาร งานอดิเรก','That reminds me of something similar that happened to me.','นั่นทำให้ฉันนึกถึงเรื่องคล้ายกันที่เคยเกิดกับฉัน','เขียนหัวข้อคุย 10 หัวข้อ','Have a natural 10-minute conversation, one question at a time.'],
      ['Meetings & Updates','ประชุมและอัปเดตงาน','Here is my update... / My next step is...','สถานะ งาน ปัญหา แผน','I finished the first part, and my next step is testing.','ฉันทำส่วนแรกเสร็จแล้ว ขั้นต่อไปคือทดสอบ','เขียนอัปเดตงาน 100 คำ','Run a short meeting with update and follow-up questions.'],
      ['Travel Disruptions','รับมือเที่ยวบิน/รถ/จองมีปัญหา','My flight was cancelled. What are my options?','ยกเลิก ล่าช้า เปลี่ยนจอง','My flight was cancelled. Can you help me rebook?','เที่ยวบินฉันถูกยกเลิก ช่วยจองใหม่ได้ไหม','เขียนบทแก้ปัญหาเดินทาง','Give me a difficult travel problem to solve in English.'],
      ['Customer Service','ร้องเรียนและเจรจาสุภาพ','I’m afraid there is a problem...','คืนเงิน เปลี่ยนสินค้า บริการ','I’m afraid the item I received is damaged.','สินค้าที่ฉันได้รับเสียหาย','เขียนคำร้องเรียนสุภาพ 120 คำ','Role-play customer service and make me explain the issue clearly.'],
      ['Discussion','อภิปรายหัวข้อทั่วไป','On the one hand... on the other hand...','ข้อดีข้อเสีย เหตุผล','On the one hand it saves time, but on the other hand it costs more.','ด้านหนึ่งประหยัดเวลา แต่อีกด้านมีค่าใช้จ่ายมากขึ้น','เขียนข้อดีข้อเสีย 2 ด้าน','Discuss an everyday topic and challenge my reasons politely.'],
      ['Short Presentation','พูดนำเสนอ 2–3 นาที','Today I’d like to talk about...','เปิดเรื่อง ประเด็น สรุป','Today I’d like to talk about three ways to improve English.','วันนี้ฉันอยากพูดถึงสามวิธีพัฒนาภาษาอังกฤษ','เขียนสคริปต์นำเสนอ 150 คำ','Coach me through a 2-minute presentation with feedback.'],
      ['Interview & Self-Introduction','ตอบคำถามเกี่ยวกับตัวเองและงาน','My experience includes...','ประสบการณ์ จุดแข็ง เป้าหมาย','One of my strengths is learning new systems quickly.','จุดแข็งอย่างหนึ่งของฉันคือเรียนรู้ระบบใหม่ได้เร็ว','เขียนคำตอบสัมภาษณ์ 5 ข้อ','Run a friendly English interview and correct my answers.'],
      ['Final Conversation Test','ทดสอบครบฟัง พูด อ่าน เขียน','Communicate naturally with what you know.','รวมทุกหัวข้อ','I may make mistakes, but I can keep the conversation going.','ฉันอาจพูดผิดบ้าง แต่ฉันสามารถคุยต่อได้','เขียน reflection 150 คำ','Run a final B2-style practical conversation test, then summarize strengths and next priorities.']
    ]}
  ];

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const store=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{"done":[]}')}catch{return{done:[]}}};
  const save=s=>localStorage.setItem(KEY,JSON.stringify(s));
  const total=stages.reduce((n,s)=>n+s.units.length,0);
  const uid=(s,i)=>`${s.code}-${i+1}`;

  function homeCard(){
    if(view!=='home'||document.querySelector('#completeCourseCard'))return;
    const anchor=document.querySelector('#learningRoadmap')||document.querySelector('#core3000Plan')||document.querySelector('#questHub')||document.querySelector('#app .hero');if(!anchor)return;
    const s=store(),done=new Set(s.done||[]),pct=Math.round(done.size/total*100);
    const html=`<section id="completeCourseCard" class="complete-course-card"><div><div class="hero-kicker">COMPLETE ENGLISH COURSE</div><h2>หลักสูตรเต็ม ฟัง · พูด · อ่าน · เขียน · สนทนา</h2><p>8 ระดับ · ${total} หน่วย · Core 3000 · AI Coach · Writing Feedback · Checkpoint ทุกระดับ</p></div><div class="complete-course-progress"><b>${pct}%</b><span>${done.size}/${total} หน่วย</span></div><div class="complete-course-bar"><i style="width:${pct}%"></i></div><button class="primary-btn" id="openCompleteCourse">เปิดหลักสูตรทั้งหมด</button></section>`;
    anchor.insertAdjacentHTML('afterend',html);document.querySelector('#openCompleteCourse').onclick=openCourse;
  }

  function overlay(title,body,id='completeCourseModal'){
    document.querySelector(`#${id}`)?.remove();const el=document.createElement('div');el.id=id;el.className='game-lab-overlay';el.innerHTML=`<section class="game-panel complete-course-panel"><div class="game-panel-head"><h2>${title}</h2><button class="game-close" type="button">×</button></div><div>${body}</div></section>`;document.body.appendChild(el);el.querySelector('.game-close').onclick=()=>el.remove();el.addEventListener('click',e=>{if(e.target===el)el.remove()});return el;
  }

  function openCourse(){
    const s=store(),done=new Set(s.done||[]);
    const body=`<div class="course-summary"><b>เป้าหมาย: ใช้ภาษาอังกฤษจริงได้</b><span>ทุกหน่วยมี Pattern + คำศัพท์ + ฟัง + พูด + อ่าน + เขียน + AI Conversation</span></div><div class="course-stage-list">${stages.map(stage=>{const count=stage.units.filter((_,i)=>done.has(uid(stage,i))).length;return `<section class="course-stage"><div class="course-stage-head"><div><span>${stage.code}</span><h3>${stage.title}</h3><p>${stage.goal}</p></div><b>${count}/${stage.units.length}</b></div><div class="course-unit-grid">${stage.units.map((u,i)=>`<button class="course-unit ${done.has(uid(stage,i))?'done':''}" data-stage="${stage.code}" data-unit="${i}"><span>${done.has(uid(stage,i))?'✓':i+1}</span><b>${esc(u[0])}</b><small>${esc(u[1])}</small></button>`).join('')}</div></section>`}).join('')}</div>`;
    const root=overlay('🎓 Complete English Course',body);root.querySelectorAll('.course-unit').forEach(b=>b.onclick=()=>openUnit(b.dataset.stage,Number(b.dataset.unit)));
  }

  function openUnit(code,index){
    document.querySelector('#completeCourseModal')?.remove();const stage=stages.find(s=>s.code===code),u=stage?.units[index];if(!u)return;const id=uid(stage,index),s=store(),isDone=(s.done||[]).includes(id);
    const body=`<div class="unit-hero"><span class="unit-level">${stage.code} · Unit ${index+1}</span><h2>${esc(u[0])}</h2><p>${esc(u[1])}</p></div>
    <div class="unit-block"><span class="unit-label">🧩 Pattern / Grammar</span><b>${esc(u[2])}</b></div>
    <div class="unit-block"><span class="unit-label">📚 Vocabulary Theme</span><p>${esc(u[3])}</p></div>
    <div class="unit-block"><span class="unit-label">📖 Reading Example</span><b>${esc(u[4])}</b><p class="thai-line">🇹🇭 ${esc(u[5])}</p><button class="secondary-btn" id="unitListen">🔊 ฟังตัวอย่าง</button></div>
    <div class="four-skills"><div><b>🎧 Listening</b><span>ฟังตัวอย่าง 2 รอบ จับคำสำคัญให้ได้</span></div><div><b>🗣️ Speaking</b><span>พูดตาม 3 รอบ แล้วเปลี่ยนรายละเอียดให้เป็นเรื่องของตัวเอง</span></div><div><b>📖 Reading</b><span>อ่านออกเสียงและหา Pattern ของบทนี้</span></div><div><b>✍️ Writing</b><span>${esc(u[6])}</span></div></div>
    <div class="writing-zone"><label>✍️ เขียนฝึกตรงนี้ แล้วให้ AI ตรวจ</label><textarea id="courseWriting" rows="5" placeholder="Write in English here..."></textarea><button class="secondary-btn" id="checkWriting">ตรวจงานเขียนด้วย AI</button><div id="writingResult"></div></div>
    <div class="unit-actions"><button class="secondary-btn" id="practiceAI">💬 ฝึกบทนี้กับ AI Coach</button><button class="primary-btn" id="completeUnit">${isDone?'✓ เรียนบทนี้แล้ว':'ทำเครื่องหมายว่าเรียนแล้ว'}</button></div>`;
    const root=overlay(`${stage.code} · ${u[0]}`,body,'completeUnitModal');
    root.querySelector('#unitListen').onclick=()=>typeof speak==='function'?speak(u[4]):speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(u[4]),{lang:'en-US'}));
    root.querySelector('#practiceAI').onclick=()=>{root.remove();state.chat=[{role:'ai',text:`🎯 Lesson: ${u[0]}`,thai:`${u[1]} · ${u[7]}`}];saveState();go('ai')};
    root.querySelector('#completeUnit').onclick=()=>{const st=store();st.done=Array.from(new Set([...(st.done||[]),id]));save(st);root.remove();render()};
    root.querySelector('#checkWriting').onclick=async()=>{const text=root.querySelector('#courseWriting').value.trim(),out=root.querySelector('#writingResult');if(!text){out.innerHTML='<p class="writing-hint">เขียนภาษาอังกฤษก่อนอย่างน้อย 1 ประโยค</p>';return}out.innerHTML='<p class="writing-hint">กำลังตรวจ...</p>';try{const r=await fetch('/api/ai',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'writing_check',text,level:stage.code,topic:u[0]})}),d=await r.json();if(!r.ok)throw 0;out.innerHTML=`<div class="writing-feedback"><b>คะแนน ${Number(d.score)||0}/100</b><p><strong>ประโยคที่แนะนำ:</strong> ${esc(d.corrected)}</p><p>${esc(d.thai||'')}</p>${Array.isArray(d.tips)&&d.tips.length?`<ul>${d.tips.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:''}</div>`}catch{out.innerHTML='<p class="writing-hint">AI ไม่พร้อมชั่วคราว เก็บข้อความไว้แล้วลองตรวจภายหลังได้</p>'}};
  }

  const baseRender=render;render=function(){baseRender();requestAnimationFrame(homeCard)};
  window.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(homeCard));
})();