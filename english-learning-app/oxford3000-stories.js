(()=>{
  const STORY_SEED=300046;
  const STORY_COUNT=25;
  const WORDS_PER_STORY=120;
  const esc=v=>typeof window.oxfordEsc==='function'?window.oxfordEsc(v):String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const reading=v=>typeof window.oxfordThaiReading==='function'?window.oxfordThaiReading(v):String(v||'');
  const shuffle=a=>typeof window.oxfordShuffle==='function'?window.oxfordShuffle(a,STORY_SEED):[...a];
  const stopWords=new Set(`about above after again against almost along already also always among another around because before behind below between both could every first from have into just many more most much must never only other over same should since some still such than that their them then there these they this those through under very were what when where which while will with would your`.split(/\s+/));
  const stories=[
    {title:`The Midnight Train`,thaiTitle:`รถไฟเที่ยวเที่ยงคืน`,summary:`Maya boards the wrong train and discovers that one passenger is carrying a bag everyone seems to want.`,thaiSummary:`มายาขึ้นรถไฟผิดขบวน และพบว่าผู้โดยสารคนหนึ่งถือกระเป๋าที่ดูเหมือนทุกคนบนรถไฟกำลังตามหา`,sentences:[
      [`Maya reached the station at eleven fifty-eight, just as the last train began to move.`,`มายามาถึงสถานีตอนห้าทุ่มห้าสิบแปด นาทีเดียวก่อนรถไฟเที่ยวสุดท้ายจะเริ่มออก`],
      [`She jumped aboard without checking the sign and realized too late that the train was heading away from her town.`,`เธอกระโดดขึ้นรถโดยไม่ดูป้าย และรู้ตัวช้าเกินไปว่ารถไฟกำลังมุ่งหน้าออกจากเมืองของเธอ`],
      [`Across the aisle, a nervous man held a small silver bag tightly against his chest.`,`ฝั่งตรงข้ามทางเดิน ชายท่าทางกังวลกอดกระเป๋าสีเงินใบเล็กไว้แน่นกับอก`],
      [`At the next stop, two strangers entered the carriage and quietly asked every passenger about that bag.`,`ที่สถานีถัดไป คนแปลกหน้าสองคนขึ้นมาและถามผู้โดยสารทุกคนอย่างเงียบ ๆ เกี่ยวกับกระเป๋าใบนั้น`],
      [`The nervous man slipped Maya a ticket and whispered, "If I disappear, get off at River Gate."`,`ชายคนนั้นส่งตั๋วใบหนึ่งให้มายาแล้วกระซิบว่า "ถ้าผมหายไป ให้ลงที่ริเวอร์เกต"`],
      [`A minute later the lights went out, the train entered a tunnel, and someone shouted from the dark.`,`หนึ่งนาทีต่อมาไฟดับ รถไฟเข้าอุโมงค์ และมีคนตะโกนขึ้นมาจากความมืด`],
      [`When the lights returned, the silver bag was under Maya's seat and the nervous man was gone.`,`เมื่อไฟกลับมา กระเป๋าสีเงินอยู่ใต้ที่นั่งของมายา แต่ชายท่าทางกังวลหายตัวไปแล้ว`],
      [`Maya had one stop to decide whether to run, hide the bag, or discover what was inside.`,`มายามีเวลาเพียงหนึ่งสถานีเพื่อตัดสินใจว่าจะหนี ซ่อนกระเป๋า หรือเปิดดูว่าข้างในมีอะไร`]
    ]},
    {title:`The Lighthouse Signal`,thaiTitle:`สัญญาณจากประภาคาร`,summary:`Two friends camping by the sea see a lighthouse flash a message that should not exist.`,thaiSummary:`เพื่อนสองคนตั้งแคมป์ริมทะเลและเห็นประภาคารส่งสัญญาณที่ไม่น่าจะเกิดขึ้นได้`,sentences:[
      [`Leo and June planned a quiet weekend on a beach far from the city.`,`ลีโอกับจูนตั้งใจใช้สุดสัปดาห์เงียบ ๆ บนชายหาดที่อยู่ไกลจากเมือง`],
      [`After midnight, the abandoned lighthouse across the bay suddenly began to flash.`,`หลังเที่ยงคืน ประภาคารร้างฝั่งตรงข้ามอ่าวเริ่มกะพริบแสงขึ้นมาอย่างกะทันหัน`],
      [`June counted the flashes and recognized a simple code they had learned at school.`,`จูนนับจำนวนแสงกะพริบและจำได้ว่าเป็นรหัสง่าย ๆ ที่พวกเขาเคยเรียนที่โรงเรียน`],
      [`The message repeated three words: BOAT, ROCKS, HELP.`,`ข้อความนั้นส่งซ้ำอยู่สามคำว่า เรือ โขดหิน ช่วยด้วย`],
      [`They called the coast office, but the officer said the lighthouse had no electricity.`,`พวกเขาโทรหาสำนักงานชายฝั่ง แต่เจ้าหน้าที่บอกว่าประภาคารไม่มีไฟฟ้าใช้งาน`],
      [`Then a weak engine appeared in the fog, moving directly toward the sharp rocks below the cliff.`,`จากนั้นเสียงเครื่องยนต์เบา ๆ ดังขึ้นในหมอก และเรือลำหนึ่งกำลังมุ่งตรงไปยังโขดหินใต้หน้าผา`],
      [`Leo used the light from their car to warn the boat while June kept sending the code.`,`ลีโอใช้ไฟจากรถส่งสัญญาณเตือนเรือ ขณะที่จูนส่งรหัสซ้ำต่อไป`],
      [`At sunrise the boat was safe, but one question remained: who had turned on the dead lighthouse?`,`เมื่อพระอาทิตย์ขึ้น เรือปลอดภัยแล้ว แต่ยังเหลือคำถามหนึ่งว่าใครเป็นคนเปิดประภาคารที่ไม่มีไฟฟ้า`]
    ]},
    {title:`The Missing Museum Key`,thaiTitle:`กุญแจพิพิธภัณฑ์ที่หายไป`,summary:`A student volunteer must solve a locked-room mystery before an ancient exhibit opens.`,thaiSummary:`อาสาสมัครนักเรียนต้องไขปริศนาห้องปิดตายก่อนนิทรรศการโบราณจะเปิด`,sentences:[
      [`Nina arrived early for her first day as a volunteer at the city museum.`,`นีนามาถึงแต่เช้าในวันแรกที่เป็นอาสาสมัครของพิพิธภัณฑ์เมือง`],
      [`The director showed her a glass room containing a golden mask that would be displayed that afternoon.`,`ผู้อำนวยการพาเธอดูห้องกระจกที่เก็บหน้ากากทองคำซึ่งจะจัดแสดงในบ่ายวันนั้น`],
      [`Ten minutes later, the only key to the room vanished from the director's desk.`,`สิบนาทีต่อมา กุญแจเพียงดอกเดียวของห้องนั้นหายไปจากโต๊ะของผู้อำนวยการ`],
      [`The doors had been locked, and only four people had entered the office.`,`ประตูทุกบานถูกล็อก และมีเพียงสี่คนที่เคยเข้าไปในสำนักงาน`],
      [`Nina noticed a line of fresh dust across the floor and a tiny piece of red thread beside the window.`,`นีนาสังเกตเห็นรอยฝุ่นใหม่บนพื้นและเศษด้ายสีแดงชิ้นเล็กข้างหน้าต่าง`],
      [`The clue led her through the costume room, past a broken statue, and into a narrow storage hall.`,`เบาะแสพาเธอผ่านห้องเครื่องแต่งกาย รูปปั้นที่แตก และไปยังทางเก็บของแคบ ๆ`],
      [`Behind an old curtain she found the key hanging from a hook, exactly where no visitor would normally look.`,`หลังม่านเก่า เธอพบกุญแจแขวนอยู่บนตะขอในจุดที่ผู้มาเยือนไม่มีทางมองเห็นตามปกติ`],
      [`Someone had hidden it on purpose, and the museum would open in less than one hour.`,`มีคนจงใจซ่อนกุญแจ และพิพิธภัณฑ์กำลังจะเปิดในเวลาไม่ถึงหนึ่งชั่วโมง`]
    ]},
    {title:`Storm on Green Island`,thaiTitle:`พายุบนเกาะสีเขียว`,summary:`A holiday boat trip becomes a race to reach shelter before a violent storm hits the island.`,thaiSummary:`ทริปเรือวันหยุดกลายเป็นการแข่งกับเวลาเพื่อหาที่หลบภัยก่อนพายุรุนแรงจะเข้าถึงเกาะ`,sentences:[
      [`Kai and Emma rented a small boat to explore an island covered with green hills.`,`ไคกับเอ็มมาเช่าเรือลำเล็กเพื่อสำรวจเกาะที่ปกคลุมด้วยเนินเขาสีเขียว`],
      [`The morning sky was clear, so they left their phones and heavy bags at the guesthouse.`,`ท้องฟ้ายามเช้าแจ่มใส พวกเขาจึงทิ้งโทรศัพท์และกระเป๋าหนักไว้ที่เกสต์เฮาส์`],
      [`By noon, dark clouds had formed over the sea and the wind changed direction.`,`ตอนเที่ยง เมฆดำก่อตัวเหนือทะเลและลมเปลี่ยนทิศทาง`],
      [`Their boat engine stopped near a quiet beach with no buildings in sight.`,`เครื่องยนต์เรือดับใกล้ชายหาดเงียบ ๆ ที่มองไม่เห็นอาคารสักหลัง`],
      [`They followed an old path inland and found fresh footprints leading toward the forest.`,`พวกเขาเดินตามทางเก่าเข้าไปในเกาะและพบรอยเท้าใหม่ที่มุ่งหน้าไปยังป่า`],
      [`Thunder shook the trees just as a local farmer appeared and waved them toward a stone shelter.`,`เสียงฟ้าร้องสั่นต้นไม้ในจังหวะที่ชาวนาท้องถิ่นปรากฏตัวและโบกให้พวกเขาไปยังที่หลบภัยหิน`],
      [`The storm flooded the beach within minutes, but the three of them stayed safe above the rising water.`,`พายุทำให้น้ำท่วมชายหาดภายในไม่กี่นาที แต่ทั้งสามคนปลอดภัยอยู่เหนือระดับน้ำที่กำลังสูงขึ้น`],
      [`The next morning, Kai understood why the farmer had watched the sea instead of the weather report.`,`เช้าวันถัดมา ไคเข้าใจว่าทำไมชาวนาจึงเฝ้ามองทะเลแทนที่จะเชื่อเพียงรายงานอากาศ`]
    ]},
    {title:`The Last Bus Home`,thaiTitle:`รถบัสเที่ยวสุดท้าย`,summary:`A tired nurse takes the last bus and realizes the driver is following a road that no longer exists.`,thaiSummary:`พยาบาลที่เหนื่อยล้าขึ้นรถบัสเที่ยวสุดท้ายและพบว่าคนขับกำลังใช้ถนนที่ไม่มีอยู่แล้ว`,sentences:[
      [`Sara finished a late shift at the hospital and ran to catch the last bus home.`,`ซาร่าจบกะดึกที่โรงพยาบาลแล้วรีบไปขึ้นรถบัสเที่ยวสุดท้ายกลับบ้าน`],
      [`Only three passengers were inside, and none of them spoke as the doors closed.`,`มีผู้โดยสารเพียงสามคนอยู่ข้างใน และไม่มีใครพูดเมื่อประตูปิด`],
      [`After twenty minutes, Sara noticed that the bus had passed her usual street without stopping.`,`หลังยี่สิบนาที ซาร่าสังเกตว่ารถบัสผ่านถนนที่เธอลงประจำโดยไม่หยุด`],
      [`She asked the driver where they were going, but he only pointed at an old paper route map.`,`เธอถามคนขับว่ากำลังไปไหน แต่เขาเพียงชี้ไปที่แผนที่เส้นทางกระดาษเก่า`],
      [`The map showed a bridge that had been destroyed years earlier.`,`แผนที่แสดงสะพานที่ถูกทำลายไปหลายปีก่อน`],
      [`The other passengers finally looked up, and one elderly woman told Sara to ring the bell before the next turn.`,`ผู้โดยสารคนอื่นเงยหน้าขึ้น และหญิงสูงวัยคนหนึ่งบอกซาร่าให้กดกริ่งก่อนถึงทางเลี้ยวถัดไป`],
      [`Sara pulled the cord, the bus stopped in heavy rain, and every passenger rushed outside.`,`ซาร่าดึงสายกริ่ง รถหยุดท่ามกลางฝนหนัก และผู้โดยสารทุกคนรีบลงจากรถ`],
      [`Seconds later, the empty bus continued toward the dark road where the bridge used to be.`,`ไม่กี่วินาทีต่อมา รถบัสที่ว่างเปล่าขับต่อไปยังถนนมืดซึ่งครั้งหนึ่งเคยมีสะพาน`]
    ]},
    {title:`The Robot in Room 12`,thaiTitle:`หุ่นยนต์ในห้อง 12`,summary:`A school science project wakes up at night and begins sending warnings to its young inventor.`,thaiSummary:`โครงงานวิทยาศาสตร์ของโรงเรียนตื่นขึ้นตอนกลางคืนและเริ่มส่งคำเตือนถึงเด็กที่สร้างมัน`,sentences:[
      [`Tom built a small robot for the school science fair and named it Pixel.`,`ทอมสร้างหุ่นยนต์ตัวเล็กสำหรับงานวิทยาศาสตร์ของโรงเรียนและตั้งชื่อมันว่าพิกเซล`],
      [`Pixel could move boxes, answer simple questions, and recognize a few faces.`,`พิกเซลสามารถย้ายกล่อง ตอบคำถามง่าย ๆ และจดจำใบหน้าได้บางคน`],
      [`On the night before the fair, Tom received a message from the robot even though it had been switched off.`,`คืนก่อนงาน ทอมได้รับข้อความจากหุ่นยนต์ทั้งที่มันถูกปิดไว้แล้ว`],
      [`The message contained one sentence: DO NOT OPEN ROOM 12.`,`ข้อความมีเพียงประโยคเดียวว่า อย่าเปิดห้อง 12`],
      [`Tom returned to school with his teacher and found Pixel standing outside that locked room.`,`ทอมกลับไปโรงเรียนพร้อมครูและพบพิกเซลยืนอยู่หน้าห้องที่ล็อกนั้น`],
      [`A strong chemical smell was coming through the door, and a warning light had begun to flash.`,`มีกลิ่นสารเคมีแรงออกมาจากประตู และไฟเตือนเริ่มกะพริบ`],
      [`The teacher called emergency services, and they discovered a damaged battery heating up inside a storage cabinet.`,`ครูโทรเรียกหน่วยฉุกเฉิน และพวกเขาพบแบตเตอรี่เสียกำลังร้อนขึ้นภายในตู้เก็บของ`],
      [`Pixel had not become alive; it had simply followed a safety rule Tom had forgotten he programmed.`,`พิกเซลไม่ได้มีชีวิตขึ้นมา มันเพียงทำตามกฎความปลอดภัยที่ทอมลืมไปว่าเคยเขียนโปรแกรมไว้`]
    ]},
    {title:`The Night Market Thief`,thaiTitle:`โจรตลาดกลางคืน`,summary:`Three friends running a food stall chase a thief through a crowded night market.`,thaiSummary:`เพื่อนสามคนที่เปิดร้านอาหารตามล่าโจรผ่านตลาดกลางคืนที่เต็มไปด้วยผู้คน`,sentences:[
      [`Pim, Jay, and Mark opened a noodle stall for one busy night market festival.`,`พิม เจย์ และมาร์กเปิดร้านก๋วยเตี๋ยวในคืนเทศกาลตลาดกลางคืนที่วุ่นวาย`],
      [`Business was going well until an elderly customer shouted that her wallet had disappeared.`,`การขายกำลังไปได้ดีจนลูกค้าสูงวัยคนหนึ่งตะโกนว่ากระเป๋าสตางค์ของเธอหายไป`],
      [`Jay saw a young man pushing through the crowd with a red wallet in his hand.`,`เจย์เห็นชายหนุ่มคนหนึ่งเบียดฝูงชนพร้อมกระเป๋าสตางค์สีแดงในมือ`],
      [`The three friends left Mark's sister at the stall and followed him past fruit carts and music stages.`,`เพื่อนทั้งสามฝากร้านไว้กับน้องสาวของมาร์กแล้วตามชายคนนั้นผ่านรถขายผลไม้และเวทีดนตรี`],
      [`The thief turned into a narrow lane, slipped on a wet floor, and dropped several wallets.`,`โจรเลี้ยวเข้าตรอกแคบ ลื่นบนพื้นเปียก และทำกระเป๋าสตางค์หลายใบหล่น`],
      [`Instead of fighting him, Pim blocked the exit while Jay called the market security team.`,`แทนที่จะต่อสู้ พิมขวางทางออกไว้ขณะที่เจย์โทรหาทีมรักษาความปลอดภัยของตลาด`],
      [`Within minutes, the stolen wallets were returned and the crowd cheered.`,`ภายในไม่กี่นาที กระเป๋าที่ถูกขโมยก็ถูกคืนและฝูงชนส่งเสียงยินดี`],
      [`Back at the stall, their noodles were cold, but a long line of new customers was waiting.`,`เมื่อกลับมาที่ร้าน ก๋วยเตี๋ยวของพวกเขาเย็นแล้ว แต่มีลูกค้าใหม่ต่อแถวยาวรออยู่`]
    ]},
    {title:`The Secret Under the Library`,thaiTitle:`ความลับใต้ห้องสมุด`,summary:`A loose floor tile leads two students to a forgotten room beneath their school library.`,thaiSummary:`กระเบื้องพื้นที่หลวมพานักเรียนสองคนไปพบห้องที่ถูกลืมใต้ห้องสมุดโรงเรียน`,sentences:[
      [`Anna heard a hollow sound under her chair while studying in the oldest corner of the library.`,`แอนนาได้ยินเสียงกลวงใต้เก้าอี้ขณะอ่านหนังสือในมุมเก่าที่สุดของห้องสมุด`],
      [`Her friend Ben lifted a loose floor tile and discovered a metal handle beneath it.`,`เบนเพื่อนของเธอยกกระเบื้องที่หลวมและพบที่จับโลหะอยู่ข้างใต้`],
      [`The handle opened a narrow staircase filled with dust and cold air.`,`ที่จับนั้นเปิดไปยังบันไดแคบที่เต็มไปด้วยฝุ่นและอากาศเย็น`],
      [`At the bottom, they found a small room containing maps, letters, and photographs from seventy years ago.`,`ด้านล่างพวกเขาพบห้องเล็กที่มีแผนที่ จดหมาย และภาพถ่ายจากเมื่อเจ็ดสิบปีก่อน`],
      [`One map showed a tunnel connecting the school to an old house across the road.`,`แผนที่หนึ่งแสดงอุโมงค์ที่เชื่อมโรงเรียนกับบ้านเก่าฝั่งตรงข้ามถนน`],
      [`Before they could explore further, they heard footsteps moving slowly down the stairs.`,`ก่อนจะสำรวจต่อ พวกเขาได้ยินเสียงฝีเท้าค่อย ๆ เดินลงบันไดมา`],
      [`It was the librarian, who smiled and asked how they had found the room she had searched for since childhood.`,`คนที่ลงมาคือบรรณารักษ์ เธอยิ้มและถามว่าพวกเขาพบห้องที่เธอตามหามาตั้งแต่เด็กได้อย่างไร`],
      [`The secret was not a treasure, but it changed what everyone knew about the school's history.`,`ความลับนั้นไม่ใช่สมบัติ แต่เปลี่ยนสิ่งที่ทุกคนเคยรู้เกี่ยวกับประวัติของโรงเรียน`]
    ]},
    {title:`The Mountain Rescue`,thaiTitle:`กู้ภัยบนภูเขา`,summary:`A beginner hiker becomes the only person close enough to help an injured climber before night falls.`,thaiSummary:`นักเดินเขามือใหม่กลายเป็นคนเพียงคนเดียวที่อยู่ใกล้พอจะช่วยนักปีนเขาที่บาดเจ็บก่อนค่ำ`,sentences:[
      [`Daniel chose an easy mountain trail because it was his first hike alone.`,`แดเนียลเลือกเส้นทางภูเขาง่าย ๆ เพราะเป็นครั้งแรกที่เขาเดินป่าคนเดียว`],
      [`Near the top, he heard someone calling weakly from below the path.`,`ใกล้ยอดเขา เขาได้ยินเสียงคนร้องเรียกเบา ๆ จากด้านล่างเส้นทาง`],
      [`A climber had fallen onto a narrow ledge and injured his ankle.`,`นักปีนเขาคนหนึ่งตกลงไปบนชะง่อนแคบและบาดเจ็บที่ข้อเท้า`],
      [`Daniel could not reach him safely, and his phone signal disappeared every few seconds.`,`แดเนียลลงไปช่วยโดยตรงไม่ได้อย่างปลอดภัย และสัญญาณโทรศัพท์ก็หายทุกไม่กี่วินาที`],
      [`He climbed back to a higher point, sent the location to rescue workers, and returned with water.`,`เขาปีนกลับไปยังจุดสูงกว่า ส่งตำแหน่งให้ทีมกู้ภัย แล้วกลับมาพร้อมน้ำ`],
      [`Dark clouds covered the peak while Daniel kept talking to the injured man to keep him calm.`,`เมฆดำปกคลุมยอดเขา ขณะที่แดเนียลคุยกับผู้บาดเจ็บต่อเพื่อให้เขาสงบ`],
      [`A rescue helicopter finally appeared just before the last light left the valley.`,`เฮลิคอปเตอร์กู้ภัยปรากฏขึ้นในที่สุด ก่อนแสงสุดท้ายจะหายจากหุบเขา`],
      [`Daniel returned home exhausted, carrying a lesson more important than reaching the summit.`,`แดเนียลกลับบ้านอย่างเหนื่อยล้า พร้อมบทเรียนที่สำคัญกว่าการไปถึงยอดเขา`]
    ]},
    {title:`The Café That Never Closed`,thaiTitle:`คาเฟ่ที่ไม่เคยปิด`,summary:`A new employee learns why a tiny café keeps one table empty every night.`,thaiSummary:`พนักงานใหม่ค้นพบเหตุผลที่คาเฟ่เล็ก ๆ แห่งหนึ่งเว้นโต๊ะหนึ่งตัวว่างไว้ทุกคืน`,sentences:[
      [`Evan started work at a twenty-four-hour café beside the river.`,`อีแวนเริ่มงานที่คาเฟ่เปิดตลอดยี่สิบสี่ชั่วโมงข้างแม่น้ำ`],
      [`The owner gave him one strange rule: never let anyone sit at table seven after midnight.`,`เจ้าของให้กฎแปลก ๆ ข้อหนึ่ง คือห้ามใครนั่งโต๊ะเจ็ดหลังเที่ยงคืน`],
      [`Evan assumed it was a joke until a tired traveler asked for that exact table.`,`อีแวนคิดว่าเป็นเรื่องล้อเล่น จนกระทั่งนักเดินทางที่เหนื่อยล้าขอนั่งโต๊ะนั้นพอดี`],
      [`When Evan refused, the traveler quietly placed an old photograph on the counter.`,`เมื่ออีแวนปฏิเสธ นักเดินทางคนนั้นวางรูปถ่ายเก่าไว้บนเคาน์เตอร์อย่างเงียบ ๆ`],
      [`The picture showed the café fifty years earlier, with the same man standing beside table seven.`,`รูปนั้นแสดงคาเฟ่เมื่อห้าสิบปีก่อน โดยมีชายคนเดิมยืนอยู่ข้างโต๊ะเจ็ด`],
      [`The owner turned pale and invited the stranger into the kitchen.`,`เจ้าของหน้าซีดและเชิญคนแปลกหน้าเข้าไปในครัว`],
      [`They talked until sunrise, and Evan learned that the table had been kept for a brother who never returned from a journey.`,`พวกเขาคุยกันจนพระอาทิตย์ขึ้น และอีแวนรู้ว่าโต๊ะนั้นถูกเก็บไว้ให้พี่ชายที่ไม่เคยกลับจากการเดินทาง`],
      [`For the first time in decades, table seven was occupied when the morning customers arrived.`,`เป็นครั้งแรกในรอบหลายสิบปีที่โต๊ะเจ็ดมีคนนั่งเมื่อเหล่าลูกค้ายามเช้ามาถึง`]
    ]},
    {title:`The Blue Door at Number Nine`,thaiTitle:`ประตูสีน้ำเงินบ้านเลขที่เก้า`,summary:`A delivery driver keeps receiving packages for a house that appears empty.`,thaiSummary:`พนักงานส่งของได้รับพัสดุซ้ำ ๆ สำหรับบ้านที่ดูเหมือนไม่มีคนอยู่`,sentences:[
      [`Milo delivered packages across the same neighborhood every afternoon.`,`ไมโลส่งพัสดุในย่านเดิมทุกบ่าย`],
      [`For three weeks, one small box had arrived each Friday for number nine, the house with a blue door.`,`เป็นเวลาสามสัปดาห์ มีกล่องเล็กหนึ่งใบมาส่งทุกวันศุกร์ที่บ้านเลขที่เก้า บ้านที่มีประตูสีน้ำเงิน`],
      [`No one ever answered, yet every package disappeared from the doorstep before evening.`,`ไม่มีใครเคยเปิดประตูรับ แต่พัสดุทุกกล่องหายจากหน้าบ้านก่อนเย็น`],
      [`One rainy Friday, Milo saw the blue door open by itself after he walked away.`,`วันศุกร์ฝนตกวันหนึ่ง ไมโลเห็นประตูสีน้ำเงินเปิดเองหลังจากเขาเดินออกมา`],
      [`He returned and heard a child calling from somewhere inside the dark house.`,`เขากลับไปและได้ยินเสียงเด็กเรียกมาจากที่ใดที่หนึ่งในบ้านมืด`],
      [`Milo called a neighbor, and together they discovered an elderly woman who had fallen and could not reach her phone.`,`ไมโลเรียกเพื่อนบ้าน และทั้งสองพบหญิงสูงวัยที่ล้มและเอื้อมโทรศัพท์ไม่ถึง`],
      [`The child was a talking toy from the latest package, repeating a recorded message from her grandson.`,`เสียงเด็กมาจากของเล่นพูดได้ในพัสดุล่าสุด ซึ่งเล่นข้อความที่หลานชายของเธอบันทึกไว้`],
      [`After that day, Milo always waited until someone answered at number nine.`,`หลังจากวันนั้น ไมโลรอจนมีคนตอบรับเสมอเมื่อมาส่งของที่บ้านเลขที่เก้า`]
    ]},
    {title:`Message from Tomorrow`,thaiTitle:`ข้อความจากวันพรุ่งนี้`,summary:`A phone begins receiving warnings exactly twenty-four hours before accidents happen.`,thaiSummary:`โทรศัพท์เครื่องหนึ่งเริ่มได้รับคำเตือนล่วงหน้าก่อนเกิดอุบัติเหตุทุกครั้งยี่สิบสี่ชั่วโมง`,sentences:[
      [`Lena bought a cheap second-hand phone because her old one had broken.`,`ลีนาซื้อโทรศัพท์มือสองราคาถูกเพราะเครื่องเก่าของเธอเสีย`],
      [`That night, a message appeared with no sender: DO NOT TAKE BUS 18 TOMORROW.`,`คืนนั้นมีข้อความจากผู้ส่งที่ไม่ทราบชื่อว่า พรุ่งนี้อย่าขึ้นรถบัสสาย 18`],
      [`Lena ignored it, but the next morning bus 18 was delayed by a minor crash.`,`ลีนาไม่สนใจ แต่เช้าวันถัดมารถบัสสาย 18 ล่าช้าเพราะอุบัติเหตุเล็กน้อย`],
      [`The following evening another message warned her to close the science lab window.`,`เย็นวันต่อมา ข้อความอีกฉบับเตือนให้เธอปิดหน้าต่างห้องทดลองวิทยาศาสตร์`],
      [`She obeyed, and a sudden storm later shattered a tree branch against that side of the building.`,`เธอทำตาม และต่อมาพายุฉับพลันทำให้กิ่งไม้ใหญ่ฟาดเข้ากับด้านนั้นของอาคาร`],
      [`For a week, every warning proved correct, and Lena became afraid to turn the phone off.`,`ตลอดหนึ่งสัปดาห์ คำเตือนทุกข้อเป็นจริง จนลีนากลัวที่จะปิดโทรศัพท์`],
      [`Then the final message appeared: AT NOON, GIVE THIS PHONE TO THE GIRL IN THE RED COAT.`,`จากนั้นข้อความสุดท้ายปรากฏว่า ตอนเที่ยงให้ส่งโทรศัพท์เครื่องนี้แก่เด็กผู้หญิงที่สวมเสื้อคลุมสีแดง`],
      [`At twelve exactly, Lena saw a frightened girl waiting outside the same second-hand shop.`,`ตอนเที่ยงตรง ลีนาเห็นเด็กผู้หญิงท่าทางหวาดกลัวยืนรออยู่นอกร้านมือสองแห่งเดิม`]
    ]},
    {title:`The Desert Radio`,thaiTitle:`วิทยุกลางทะเลทราย`,summary:`A broken radio receives a voice that guides two travelers toward water.`,thaiSummary:`วิทยุที่เสียรับเสียงลึกลับซึ่งนำทางนักเดินทางสองคนไปยังแหล่งน้ำ`,sentences:[
      [`Omar and Tess were crossing a desert road when their truck lost power.`,`โอมาร์กับเทสกำลังข้ามถนนในทะเลทรายเมื่อรถบรรทุกของพวกเขาดับ`],
      [`They had water for one day, but the nearest town was too far to reach on foot.`,`พวกเขามีน้ำพอเพียงหนึ่งวัน แต่เมืองที่ใกล้ที่สุดอยู่ไกลเกินกว่าจะเดินถึง`],
      [`An old radio in the truck suddenly produced a clear voice after hours of silence.`,`วิทยุเก่าในรถส่งเสียงพูดชัดเจนขึ้นมาอย่างกะทันหันหลังเงียบมาหลายชั่วโมง`],
      [`The voice told them to walk east until they found three black rocks.`,`เสียงนั้นบอกให้พวกเขาเดินไปทางตะวันออกจนกว่าจะพบก้อนหินสีดำสามก้อน`],
      [`They followed the instruction because staying beside the truck had become dangerous in the heat.`,`พวกเขาทำตามเพราะการอยู่ข้างรถท่ามกลางความร้อนเริ่มอันตราย`],
      [`Beyond the rocks, they discovered a narrow canyon and a pipe carrying fresh water to a research station.`,`เลยก้อนหินไป พวกเขาพบหุบเขาแคบและท่อที่ส่งน้ำสะอาดไปยังสถานีวิจัย`],
      [`The station workers rescued them, but nobody there had used a radio that day.`,`เจ้าหน้าที่สถานีช่วยพวกเขาไว้ แต่ไม่มีใครที่นั่นใช้วิทยุในวันนั้น`],
      [`When Omar returned to the truck later, the radio had no battery inside it.`,`เมื่อโอมาร์กลับไปที่รถในภายหลัง เขาพบว่าวิทยุไม่มีแบตเตอรี่อยู่ข้างในเลย`]
    ]},
    {title:`The Silent Hotel`,thaiTitle:`โรงแรมเงียบ`,summary:`A travel writer checks into a mountain hotel where every guest has vanished.`,thaiSummary:`นักเขียนท่องเที่ยวเข้าพักในโรงแรมบนภูเขาที่แขกทุกคนหายตัวไป`,sentences:[
      [`Clara reached the mountain hotel just before heavy snow closed the road behind her.`,`คลาร่ามาถึงโรงแรมบนภูเขาก่อนหิมะหนักจะปิดถนนด้านหลังเธอ`],
      [`The front desk was open, the lights were warm, and dinner was still on the tables.`,`เคาน์เตอร์ต้อนรับเปิดอยู่ ไฟสว่างอบอุ่น และอาหารเย็นยังวางอยู่บนโต๊ะ`],
      [`However, Clara could not find a single member of staff or any other guest.`,`แต่คลาร่าหาพนักงานหรือแขกคนอื่นไม่พบแม้แต่คนเดียว`],
      [`On the second floor, every room door stood open except room 204.`,`บนชั้นสอง ประตูห้องทุกห้องเปิดอยู่ ยกเว้นห้อง 204`],
      [`A note under that door said, "If you hear the alarm, go to the roof."`,`กระดาษใต้ประตูเขียนว่า "ถ้าได้ยินสัญญาณเตือน ให้ขึ้นไปบนดาดฟ้า"`],
      [`At midnight, a deep rumble shook the windows and the alarm began to ring.`,`ตอนเที่ยงคืน เสียงคำรามลึกสั่นหน้าต่างและสัญญาณเตือนเริ่มดัง`],
      [`Clara reached the roof seconds before a snow slide buried the lower entrance of the hotel.`,`คลาร่าขึ้นถึงดาดฟ้าไม่กี่วินาทีก่อนหิมะถล่มจะฝังทางเข้าด้านล่างของโรงแรม`],
      [`There she found the missing guests waiting beside emergency lights, surprised to see that anyone had arrived so late.`,`ที่นั่นเธอพบแขกที่หายไปกำลังรออยู่ข้างไฟฉุกเฉิน และพวกเขาประหลาดใจที่มีคนมาถึงโรงแรมดึกขนาดนั้น`]
    ]},
    {title:`The River Race`,thaiTitle:`การแข่งขันในแม่น้ำ`,summary:`A friendly boat race turns serious when a child falls into a dangerous current.`,thaiSummary:`การแข่งขันเรือที่เป็นมิตรกลายเป็นเหตุฉุกเฉินเมื่อเด็กคนหนึ่งตกลงไปในกระแสน้ำแรง`,sentences:[
      [`Every summer, two villages held a boat race on the wide river between them.`,`ทุกฤดูร้อน สองหมู่บ้านจัดการแข่งขันเรือในแม่น้ำกว้างที่คั่นกลาง`],
      [`This year, Mia joined her uncle's team even though she had never raced before.`,`ปีนี้มีอาเข้าร่วมทีมของลุงแม้เธอไม่เคยแข่งมาก่อน`],
      [`Halfway to the finish line, she heard people shouting from the crowded riverbank.`,`เมื่อแข่งไปได้ครึ่งทาง เธอได้ยินคนบนฝั่งที่เต็มไปด้วยผู้คนตะโกน`],
      [`A child had fallen from a small dock and was being pulled toward the strongest part of the current.`,`เด็กคนหนึ่งตกจากท่าเล็กและกำลังถูกกระแสน้ำดึงไปยังจุดที่แรงที่สุด`],
      [`Mia's team turned away from the race while the other boats continued toward the finish.`,`ทีมของมีอาหันเรือออกจากการแข่งขัน ขณะที่เรือลำอื่นยังมุ่งหน้าไปยังเส้นชัย`],
      [`They reached the child, threw a rope, and pulled him safely aboard.`,`พวกเขาไปถึงเด็ก โยนเชือกให้ และดึงเขาขึ้นเรืออย่างปลอดภัย`],
      [`When they finally returned to the course, the race had already ended.`,`เมื่อพวกเขากลับเข้าสู่เส้นทาง การแข่งขันจบไปแล้ว`],
      [`The crowd gave them the loudest welcome of the day, and nobody cared who had won first place.`,`ฝูงชนต้อนรับพวกเขาดังที่สุดในวันนั้น และไม่มีใครสนใจแล้วว่าใครได้ที่หนึ่ง`]
    ]},
    {title:`The Girl Who Found a Map`,thaiTitle:`เด็กหญิงกับแผนที่ปริศนา`,summary:`A map hidden inside an old book sends a girl across town searching for a forgotten garden.`,thaiSummary:`แผนที่ที่ซ่อนอยู่ในหนังสือเก่าพาเด็กหญิงออกตามหาสวนที่ถูกลืมทั่วเมือง`,sentences:[
      [`Ivy bought an old adventure book from a street market for one coin.`,`ไอวี่ซื้อหนังสือผจญภัยเก่าจากตลาดริมถนนในราคาเพียงเหรียญเดียว`],
      [`A folded map fell from the back cover when she opened it at home.`,`แผนที่พับหนึ่งแผ่นหล่นออกจากปกหลังเมื่อเธอเปิดหนังสือที่บ้าน`],
      [`The map showed familiar streets but marked a green circle where no park existed.`,`แผนที่แสดงถนนที่คุ้นเคย แต่ทำวงกลมสีเขียวไว้ในจุดที่ไม่มีสวนอยู่`],
      [`Ivy followed the route through an alley, under a railway bridge, and behind an empty theater.`,`ไอวี่ตามเส้นทางผ่านตรอก ใต้สะพานรถไฟ และหลังโรงละครร้าง`],
      [`There she found a locked iron gate covered by vines and a tiny symbol matching the map.`,`ที่นั่นเธอพบประตูเหล็กล็อกที่ปกคลุมด้วยเถาวัลย์และสัญลักษณ์เล็กเหมือนบนแผนที่`],
      [`An old shopkeeper nearby gave her a key after she showed him the book.`,`เจ้าของร้านสูงวัยใกล้ ๆ มอบกุญแจให้เธอเมื่อเธอเอาหนังสือให้ดู`],
      [`Behind the gate was a forgotten garden full of fruit trees, birds, and a dry stone fountain.`,`หลังประตูคือสวนที่ถูกลืม เต็มไปด้วยต้นไม้ผล นก และน้ำพุหินที่แห้งไปแล้ว`],
      [`Ivy did not keep the discovery secret; she asked the neighborhood to bring the garden back to life.`,`ไอวี่ไม่ได้เก็บการค้นพบเป็นความลับ เธอชวนคนในชุมชนมาช่วยกันทำให้สวนกลับมามีชีวิตอีกครั้ง`]
    ]},
    {title:`The Underground Garden`,thaiTitle:`สวนใต้ดิน`,summary:`Engineers repairing a subway station discover a living garden beneath the city.`,thaiSummary:`วิศวกรที่ซ่อมสถานีรถไฟใต้ดินค้นพบสวนที่ยังมีชีวิตอยู่ใต้เมือง`,sentences:[
      [`A repair team was drilling behind an old subway wall when the machine suddenly broke through empty space.`,`ทีมซ่อมกำลังเจาะหลังผนังรถไฟใต้ดินเก่าเมื่อเครื่องเจาะทะลุเข้าไปในช่องว่างอย่างกะทันหัน`],
      [`Engineer Rosa climbed through the opening and smelled wet soil instead of concrete dust.`,`วิศวกรโรซ่าปีนผ่านช่องและได้กลิ่นดินเปียกแทนฝุ่นคอนกรีต`],
      [`Her flashlight revealed green plants growing around pipes under a ceiling of old glass.`,`ไฟฉายของเธอเผยให้เห็นต้นไม้สีเขียวเติบโตรอบท่อใต้เพดานกระจกเก่า`],
      [`A hidden water system was still feeding the garden after more than sixty years.`,`ระบบน้ำที่ซ่อนอยู่ยังคงหล่อเลี้ยงสวนหลังผ่านไปกว่าหกสิบปี`],
      [`The team found labels showing that the space had once been an experimental city farm.`,`ทีมพบป้ายที่แสดงว่าสถานที่นี้เคยเป็นฟาร์มทดลองของเมือง`],
      [`One wall contained a list of plant species that scientists believed had disappeared from the region.`,`ผนังด้านหนึ่งมีรายชื่อพันธุ์พืชที่นักวิทยาศาสตร์เชื่อว่าหายไปจากภูมิภาคนี้แล้ว`],
      [`The subway repair was delayed while experts came to protect the unexpected discovery.`,`การซ่อมรถไฟใต้ดินถูกเลื่อนออกไปขณะที่ผู้เชี่ยวชาญเข้ามาปกป้องการค้นพบที่ไม่คาดคิด`],
      [`Months later, commuters could look through a new glass wall and see the secret garden below the city.`,`หลายเดือนต่อมา ผู้โดยสารสามารถมองผ่านผนังกระจกใหม่และเห็นสวนลับใต้เมือง`]
    ]},
    {title:`Flight 207`,thaiTitle:`เที่ยวบิน 207`,summary:`A routine flight changes course after a passenger notices something strange outside the window.`,thaiSummary:`เที่ยวบินธรรมดาต้องเปลี่ยนเส้นทางหลังผู้โดยสารสังเกตเห็นสิ่งผิดปกตินอกหน้าต่าง`,sentences:[
      [`Flight 207 left on time for a short trip across the country.`,`เที่ยวบิน 207 ออกตรงเวลาเพื่อเดินทางระยะสั้นข้ามประเทศ`],
      [`Twenty minutes later, a passenger named Eric noticed smoke rising from a forest far below.`,`ยี่สิบนาทีต่อมา ผู้โดยสารชื่อเอริกเห็นควันลอยขึ้นจากป่าที่อยู่ไกลด้านล่าง`],
      [`He showed a flight attendant, who passed the information to the captain.`,`เขาบอกพนักงานต้อนรับบนเครื่อง ซึ่งส่งข้อมูลต่อให้กัปตัน`],
      [`The crew contacted air traffic control and learned that no fire had yet been reported in that area.`,`ลูกเรือติดต่อศูนย์ควบคุมการบินและพบว่ายังไม่มีรายงานไฟไหม้ในพื้นที่นั้น`],
      [`The plane changed direction slightly so the crew could confirm the exact location.`,`เครื่องบินเปลี่ยนทิศทางเล็กน้อยเพื่อให้ลูกเรือยืนยันตำแหน่งที่แน่นอน`],
      [`Emergency teams on the ground reached the forest before the fire spread toward nearby homes.`,`ทีมฉุกเฉินภาคพื้นดินไปถึงป่าก่อนที่ไฟจะลามไปยังบ้านใกล้เคียง`],
      [`The flight arrived late, and several passengers complained until the captain explained what had happened.`,`เที่ยวบินถึงปลายทางช้า ผู้โดยสารหลายคนบ่นจนกัปตันอธิบายสิ่งที่เกิดขึ้น`],
      [`Eric looked out at the quiet runway and realized that a small observation had changed an entire afternoon.`,`เอริกมองออกไปยังรันเวย์เงียบ ๆ และตระหนักว่าการสังเกตเล็ก ๆ เปลี่ยนเหตุการณ์ทั้งบ่ายได้`]
    ]},
    {title:`The Snow Cabin`,thaiTitle:`กระท่อมกลางหิมะ`,summary:`Three friends trapped by snow discover that the empty cabin they found is not completely empty.`,thaiSummary:`เพื่อนสามคนติดอยู่ท่ามกลางหิมะและพบว่ากระท่อมร้างที่ใช้หลบภัยไม่ได้ว่างเปล่าอย่างที่คิด`,sentences:[
      [`Nora, Felix, and Sam were driving through the mountains when snow blocked the road ahead.`,`นอร่า เฟลิกซ์ และแซมขับรถผ่านภูเขาเมื่อหิมะปิดถนนข้างหน้า`],
      [`They left the car and found a wooden cabin less than a kilometer away.`,`พวกเขาทิ้งรถและพบกระท่อมไม้ห่างออกไปไม่ถึงหนึ่งกิโลเมตร`],
      [`The door was unlocked, the fireplace was cold, and fresh bread sat on the kitchen table.`,`ประตูไม่ได้ล็อก เตาผิงเย็น และมีขนมปังสดวางอยู่บนโต๊ะครัว`],
      [`Nobody answered when they called, but wet boots were standing beside the back door.`,`ไม่มีใครตอบเมื่อพวกเขาเรียก แต่มีรองเท้าบูตเปียกวางอยู่ข้างประตูหลัง`],
      [`As darkness fell, they heard scratching beneath the floorboards.`,`เมื่อความมืดลงมา พวกเขาได้ยินเสียงขูดใต้พื้นไม้`],
      [`Felix opened a small hatch and found a frightened dog trapped in the space below.`,`เฟลิกซ์เปิดฝาเล็กและพบสุนัขที่ตกใจติดอยู่ในช่องด้านล่าง`],
      [`A note on its collar contained the owner's phone number and a warning that he had gone to seek help.`,`กระดาษที่ปลอกคอมีเบอร์โทรของเจ้าของและข้อความว่าเขาออกไปขอความช่วยเหลือ`],
      [`By morning, rescuers arrived with the owner, and the cabin no longer felt mysterious at all.`,`ตอนเช้า ทีมกู้ภัยมาถึงพร้อมเจ้าของ และกระท่อมก็ไม่ดูลึกลับอีกต่อไป`]
    ]},
    {title:`The Photographer's Last Picture`,thaiTitle:`ภาพสุดท้ายของช่างภาพ`,summary:`A damaged camera contains one photograph that may reveal why a famous photographer disappeared.`,thaiSummary:`กล้องที่เสียมีภาพหนึ่งใบซึ่งอาจเปิดเผยเหตุผลที่ช่างภาพชื่อดังหายตัวไป`,sentences:[
      [`Ava repaired old cameras in a small shop near the university.`,`เอวาซ่อมกล้องเก่าในร้านเล็กใกล้มหาวิทยาลัย`],
      [`One day a stranger left a damaged camera on her counter and walked away without giving a name.`,`วันหนึ่งคนแปลกหน้าวางกล้องที่เสียไว้บนเคาน์เตอร์แล้วเดินจากไปโดยไม่บอกชื่อ`],
      [`Inside the camera, Ava found a memory card containing only one photograph.`,`ภายในกล้อง เอวาพบการ์ดหน่วยความจำที่มีภาพถ่ายเพียงภาพเดียว`],
      [`The image showed a famous photographer who had disappeared six months earlier standing beside an old clock tower.`,`ภาพนั้นแสดงช่างภาพชื่อดังที่หายไปหกเดือนก่อนยืนอยู่ข้างหอนาฬิกาเก่า`],
      [`Ava enlarged the picture and noticed a handwritten date reflected in a shop window.`,`เอวาขยายภาพและสังเกตเห็นวันที่เขียนด้วยมือติดอยู่ในเงาสะท้อนของหน้าต่างร้าน`],
      [`The date was tomorrow, even though the photograph looked decades old.`,`วันที่นั้นคือวันพรุ่งนี้ ทั้งที่ภาพดูเหมือนถ่ายมาหลายสิบปีแล้ว`],
      [`She brought the camera to the police, who agreed to watch the clock tower the following evening.`,`เธอนำกล้องไปให้ตำรวจ และพวกเขาตกลงเฝ้าหอนาฬิกาในเย็นวันถัดไป`],
      [`At the exact time shown in the reflection, a man with the missing photographer's face stepped out of a taxi.`,`ตรงเวลาที่ปรากฏในเงาสะท้อน ชายที่มีใบหน้าเหมือนช่างภาพที่หายไปก้าวลงจากแท็กซี่`]
    ]},
    {title:`The Clock Tower Code`,thaiTitle:`รหัสหอนาฬิกา`,summary:`A city clock starts ringing at impossible times, giving two students a pattern to decode.`,thaiSummary:`นาฬิกาเมืองเริ่มตีบอกเวลาในช่วงที่เป็นไปไม่ได้ และทิ้งรูปแบบให้สองนักเรียนถอดรหัส`,sentences:[
      [`The old clock tower had rung every hour correctly for more than a century.`,`หอนาฬิกาเก่าเคยตีบอกเวลาอย่างถูกต้องทุกชั่วโมงมานานกว่าร้อยปี`],
      [`Then, for three nights, it rang at 2:17, 3:11, and 4:05 in the morning.`,`จากนั้นสามคืนติดต่อกัน มันตีตอนตีสองสิบเจ็ด ตีสามสิบเอ็ด และตีสี่ห้านาที`],
      [`Students Mei and Arun wrote down the times and noticed that each number pointed to a page and line in a history book.`,`นักเรียนเมย์กับอรุณจดเวลาและพบว่าแต่ละตัวเลขชี้ไปยังหน้าและบรรทัดในหนังสือประวัติศาสตร์`],
      [`The selected words formed a message: CHECK THE NORTH WALL BEFORE FRIDAY.`,`คำที่เลือกประกอบเป็นข้อความว่า ตรวจผนังด้านเหนือก่อนวันศุกร์`],
      [`They showed the message to a teacher, who contacted the city maintenance office.`,`พวกเขาเอาข้อความให้ครูดู และครูติดต่อสำนักงานซ่อมบำรุงของเมือง`],
      [`Workers found a dangerous crack hidden behind a large advertising sign on the north side of the tower.`,`คนงานพบรอยร้าวอันตรายที่ซ่อนอยู่หลังป้ายโฆษณาขนาดใหญ่ด้านเหนือของหอ`],
      [`The tower was closed before a strong storm arrived on Friday afternoon.`,`หอนาฬิกาถูกปิดก่อนพายุแรงจะมาถึงในบ่ายวันศุกร์`],
      [`Nobody discovered who had changed the clock mechanism, but the strange code may have prevented a disaster.`,`ไม่มีใครพบว่าใครแก้กลไกนาฬิกา แต่รหัสประหลาดอาจช่วยป้องกันภัยครั้งใหญ่ไว้`]
    ]},
    {title:`The Empty Stadium`,thaiTitle:`สนามกีฬาที่ว่างเปล่า`,summary:`A young reporter enters a closed stadium and hears a match being played with no players on the field.`,thaiSummary:`นักข่าวหนุ่มเข้าไปในสนามกีฬาที่ปิดและได้ยินเสียงการแข่งขันทั้งที่ไม่มีผู้เล่นในสนาม`,sentences:[
      [`Jon entered the old stadium to photograph it before demolition began.`,`จอนเข้าไปในสนามกีฬาเก่าเพื่อถ่ายภาพก่อนเริ่มรื้อถอน`],
      [`The seats were empty, weeds covered the field, and the score screen had no power.`,`ที่นั่งว่างเปล่า วัชพืชปกคลุมสนาม และจอคะแนนไม่มีไฟ`],
      [`As he reached the center tunnel, a crowd suddenly roared through the loudspeakers.`,`เมื่อเขาไปถึงอุโมงค์กลาง เสียงฝูงชนก็ดังขึ้นจากลำโพงอย่างกะทันหัน`],
      [`A recorded announcer described a championship match that had taken place thirty years earlier.`,`เสียงผู้ประกาศที่บันทึกไว้บรรยายการแข่งขันชิงแชมป์เมื่อสามสิบปีก่อน`],
      [`Jon followed the sound to a control room where an ancient tape machine was running by itself.`,`จอนตามเสียงไปยังห้องควบคุมซึ่งเครื่องเทปเก่ากำลังทำงานด้วยตัวเอง`],
      [`Beside it lay a letter from the stadium's first announcer asking that the final broadcast be played one last time.`,`ข้างเครื่องมีจดหมายจากผู้ประกาศคนแรกของสนาม ขอให้เปิดการถ่ายทอดครั้งสุดท้ายอีกหนึ่งครั้ง`],
      [`Jon recorded the sound and shared the story before the building was taken down.`,`จอนบันทึกเสียงและเผยแพร่เรื่องราวก่อนอาคารจะถูกรื้อ`],
      [`For one evening, thousands of former fans listened online and remembered the stadium together.`,`ในเย็นวันหนึ่ง แฟนกีฬารุ่นเก่าหลายพันคนฟังออนไลน์และรำลึกถึงสนามแห่งนั้นร่วมกัน`]
    ]},
    {title:`The Island Without Phones`,thaiTitle:`เกาะที่ไม่มีโทรศัพท์`,summary:`Visitors to a remote island must solve a real emergency without internet, maps, or mobile service.`,thaiSummary:`ผู้มาเยือนเกาะห่างไกลต้องรับมือเหตุฉุกเฉินโดยไม่มีอินเทอร์เน็ต แผนที่ หรือสัญญาณมือถือ`,sentences:[
      [`Five university friends chose a remote island because they wanted one weekend without screens.`,`เพื่อนมหาวิทยาลัยห้าคนเลือกเกาะห่างไกลเพราะอยากใช้สุดสัปดาห์โดยไม่มีหน้าจอ`],
      [`The island had no mobile signal, and the guesthouse collected phones at check-in.`,`เกาะไม่มีสัญญาณมือถือ และเกสต์เฮาส์เก็บโทรศัพท์ไว้ตอนเช็กอิน`],
      [`On the second afternoon, a fishing boat failed to return before a sudden fog covered the coast.`,`บ่ายวันที่สอง เรือประมงลำหนึ่งไม่กลับมาตามเวลา ก่อนหมอกหนาจะปกคลุมชายฝั่ง`],
      [`Without online maps, the visitors joined local families using paper charts, bells, and lanterns.`,`เมื่อไม่มีแผนที่ออนไลน์ ผู้มาเยือนร่วมกับครอบครัวท้องถิ่นใช้แผนที่กระดาษ ระฆัง และโคมไฟ`],
      [`One friend climbed a hill and spotted a weak light moving near the northern rocks.`,`เพื่อนคนหนึ่งปีนเนินเขาและเห็นแสงอ่อน ๆ เคลื่อนไหวใกล้โขดหินทางเหนือ`],
      [`The rescue boat followed a line of lanterns placed along the shore and found the missing fishermen.`,`เรือกู้ภัยตามแนวโคมไฟที่วางตลอดชายฝั่งและพบชาวประมงที่หายไป`],
      [`That night nobody asked for a phone, even after the fog disappeared.`,`คืนนั้นไม่มีใครขอโทรศัพท์คืน แม้หมอกจะหายไปแล้ว`],
      [`The friends left the island with hundreds of photographs waiting in their minds instead of their devices.`,`เพื่อน ๆ ออกจากเกาะพร้อมภาพความทรงจำหลายร้อยภาพในใจแทนที่จะอยู่ในอุปกรณ์`]
    ]},
    {title:`The Box from Bangkok`,thaiTitle:`กล่องปริศนาจากกรุงเทพฯ`,summary:`A university student receives a package addressed to someone with the same name who lived there twenty years ago.`,thaiSummary:`นักศึกษามหาวิทยาลัยได้รับพัสดุถึงคนชื่อเดียวกันที่เคยอาศัยอยู่ที่นั่นเมื่อยี่สิบปีก่อน`,sentences:[
      [`Krit found a small wooden box outside his apartment in Bangkok with his full name written on it.`,`กฤตพบกล่องไม้เล็กหน้าห้องพักในกรุงเทพฯ พร้อมชื่อเต็มของเขาเขียนอยู่บนกล่อง`],
      [`The shipping label was faded and showed a date from twenty years earlier.`,`ฉลากส่งของซีดจางและระบุวันที่เมื่อยี่สิบปีก่อน`],
      [`Inside were a key, a train ticket, and a photograph of a young man who looked surprisingly like Krit.`,`ข้างในมีกุญแจ ตั๋วรถไฟ และรูปชายหนุ่มที่หน้าตาคล้ายกฤตอย่างน่าประหลาด`],
      [`The ticket led him to an old station where one row of storage lockers still remained.`,`ตั๋วพาเขาไปยังสถานีเก่าซึ่งยังมีตู้เก็บของเหลืออยู่หนึ่งแถว`],
      [`The key opened locker 36, revealing letters written to a person with Krit's exact name.`,`กุญแจเปิดตู้หมายเลข 36 และเผยจดหมายที่เขียนถึงคนชื่อเดียวกับกฤตทุกตัวอักษร`],
      [`The final letter explained that the writer had left the city suddenly and never delivered the box.`,`จดหมายฉบับสุดท้ายอธิบายว่าผู้เขียนออกจากเมืองอย่างกะทันหันและไม่เคยส่งกล่องได้`],
      [`Krit later learned that the young man in the photograph was his father's closest childhood friend.`,`ต่อมากฤตรู้ว่าชายหนุ่มในภาพคือเพื่อนสนิทวัยเด็กของพ่อ`],
      [`A package delayed for two decades finally reopened a story his family had almost forgotten.`,`พัสดุที่ล่าช้ามาสองทศวรรษเปิดเรื่องราวที่ครอบครัวของเขาเกือบลืมไปแล้วอีกครั้ง`]
    ]},
    {title:`The Road Beyond the City`,thaiTitle:`ถนนนอกเมือง`,summary:`Four friends take a shortcut and find a small town that does not appear on any modern map.`,thaiSummary:`เพื่อนสี่คนใช้ทางลัดและพบเมืองเล็กที่ไม่มีอยู่ในแผนที่สมัยใหม่`,sentences:[
      [`Four friends left the city early for a weekend road trip through the hills.`,`เพื่อนสี่คนออกจากเมืองแต่เช้าเพื่อเดินทางสุดสัปดาห์ผ่านเนินเขา`],
      [`A road closure forced them onto a narrow route shown only on an old paper map.`,`ถนนปิดทำให้พวกเขาต้องใช้เส้นทางแคบที่ปรากฏเฉพาะในแผนที่กระดาษเก่า`],
      [`After an hour, they reached a small town with a school, a bakery, and no mobile signal.`,`หลังหนึ่งชั่วโมง พวกเขามาถึงเมืองเล็กที่มีโรงเรียน ร้านขนมปัง และไม่มีสัญญาณมือถือ`],
      [`The people were friendly but surprised that visitors had arrived from the eastern road.`,`ผู้คนเป็นมิตรแต่ประหลาดใจที่มีนักท่องเที่ยวมาจากถนนด้านตะวันออก`],
      [`An elderly shopkeeper explained that a landslide had closed that road more than fifteen years earlier.`,`เจ้าของร้านสูงวัยอธิบายว่าดินถล่มปิดถนนนั้นมานานกว่าสิบห้าปีแล้ว`],
      [`When the friends looked back, thick fog covered the route they had just used.`,`เมื่อเพื่อน ๆ มองกลับไป หมอกหนาปกคลุมเส้นทางที่เพิ่งใช้มา`],
      [`They stayed the night and left by the western highway the next morning.`,`พวกเขาพักค้างคืนและออกทางทางหลวงฝั่งตะวันตกในเช้าวันถัดไป`],
      [`Later, they searched several digital maps, but none showed the town they had visited.`,`ต่อมาพวกเขาค้นแผนที่ดิจิทัลหลายแห่ง แต่ไม่มีแผนที่ใดแสดงเมืองที่พวกเขาเพิ่งไปมา`]
    ]}
  ];

  function overlay(){
    document.querySelector('#oxfordStoriesModal')?.remove();
    stopNarration();
    const root=document.createElement('div');root.id='oxfordStoriesModal';root.className='oxford-extra-overlay';
    root.innerHTML=`<section class="oxford-extra-panel oxford-story-panel"><header><div><h2>📚 Oxford 3000 · Short Stories</h2><small>${STORY_COUNT} เรื่องสั้น · อ่านสนุก · มีคำแปลและเสียงอ่าน</small></div><button class="oxford-extra-close" type="button">×</button></header><main id="oxfordStoriesBody"><div class="core-study-loading"><div class="listen-orb">Aa</div><h3>กำลังเตรียมเรื่องอ่าน...</h3></div></main></section>`;
    document.body.appendChild(root);root.querySelector('.oxford-extra-close').onclick=()=>{stopNarration();root.remove()};return root;
  }
  async function getData(){if(typeof window.ensureOxford3000==='function')await window.ensureOxford3000();const list=typeof window.getOxford3000==='function'?window.getOxford3000():[];if(list.length<3000)throw new Error(`oxford_not_ready_${list.length}`);return shuffle(list).slice(0,3000)}
  async function openStories(){const root=overlay();try{const list=await getData();drawMenu(root,list)}catch(err){root.querySelector('#oxfordStoriesBody').innerHTML=`<div class="core-study-error"><h3>เปิดเรื่องอ่านไม่ได้</h3><p>Oxford 3000 ยังโหลดไม่ครบ</p><small>${esc(err?.message||'unknown')}</small></div>`}}
  function drawMenu(root,list){
    stopNarration();
    root.querySelector('#oxfordStoriesBody').innerHTML=`<div class="oxford-story-intro"><h3>25 เรื่องใหม่ · คนละเหตุการณ์ คนละบรรยากาศ</h3><p>เนื้อเรื่องเขียนใหม่ให้สั้นและอ่านต่อเนื่อง ไม่ต่อประโยคตัวอย่างแบบเดิม แต่ละเรื่องมีคำแปลไทยแบบแตะดู มีเสียงอ่านทั้งเรื่อง และมี Oxford 3000 ชุดฝึก ${WORDS_PER_STORY} คำท้ายบท รวมครบ 3,000 คำโดยไม่ซ้ำกัน</p></div><div class="oxford-story-grid story-grid-25">${stories.map((t,i)=>`<button type="button" class="oxford-story-card" data-story="${i}"><span>เรื่อง ${i+1}</span><b>${esc(t.title)}</b><small>${esc(t.thaiTitle)}</small><p>${esc(t.summary)}</p><em>ประมาณ 3–5 นาที · ${WORDS_PER_STORY} คำฝึก</em></button>`).join('')}</div>`;
    root.querySelectorAll('[data-story]').forEach(btn=>btn.onclick=()=>drawStory(root,list,Number(btn.dataset.story)||0));
  }
  function wordKey(v){return String(v||'').toLowerCase().replace(/\([^)]*\)/g,'').trim()}
  function buildWordMap(list){const map=new Map();for(const entry of list){const key=wordKey(entry.word);if(!/^[a-z][a-z'-]{3,}$/.test(key)||stopWords.has(key))continue;if(!map.has(key))map.set(key,entry)}return map}
  function decorateSentence(text,wordMap,focusEntries,focusSeen){
    const tokens=String(text||'').split(/(\b[A-Za-z][A-Za-z'-]*\b)/g);let used=0;
    return tokens.map(token=>{const key=token.toLowerCase(),entry=wordMap.get(key);if(!entry||used>=4||focusSeen.has(entry.id))return esc(token);used++;focusSeen.add(entry.id);focusEntries.push(entry);return `<u class="story-vocab" data-say="${esc(entry.word)}" title="${esc(entry.thai||'')}">${esc(token)}</u>`}).join('');
  }

  let narration={root:null,sentences:[],index:0,paused:false,active:false,utterance:null};
  function setNarrationUI(){const root=narration.root;if(!root)return;const play=root.querySelector('#storyReadAll'),pause=root.querySelector('#storyPause'),stop=root.querySelector('#storyStop');if(play)play.textContent=narration.active?(narration.paused?'▶ อ่านต่อ':'🔊 กำลังอ่าน...'):'🔊 ฟังทั้งเรื่อง';if(pause){pause.disabled=!narration.active;pause.textContent=narration.paused?'▶ อ่านต่อ':'⏸ พัก'}if(stop)stop.disabled=!narration.active}
  function clearSpeakingMark(){narration.root?.querySelectorAll('.story-sentence.is-speaking').forEach(el=>el.classList.remove('is-speaking'))}
  function stopNarration(){try{speechSynthesis.cancel()}catch{}clearSpeakingMark();narration={root:null,sentences:[],index:0,paused:false,active:false,utterance:null}}
  function speakNarrationSentence(){
    if(!narration.active||narration.index>=narration.sentences.length){const r=narration.root;stopNarration();narration.root=r;setNarrationUI();return}
    clearSpeakingMark();const current=narration.sentences[narration.index];narration.root?.querySelector(`[data-story-sentence="${narration.index}"]`)?.classList.add('is-speaking');
    try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(current.en);u.lang='en-US';u.rate=.86;u.pitch=1;u.onend=()=>{if(!narration.active||narration.paused)return;narration.index++;speakNarrationSentence()};u.onerror=()=>{const r=narration.root;stopNarration();narration.root=r;setNarrationUI()};narration.utterance=u;speechSynthesis.speak(u);setNarrationUI()}catch{const r=narration.root;stopNarration();narration.root=r;setNarrationUI()}
  }
  function startNarration(root,sentences){if(narration.active&&narration.root===root&&narration.paused){try{speechSynthesis.resume();narration.paused=false;setNarrationUI()}catch{}return}stopNarration();narration={root,sentences,index:0,paused:false,active:true,utterance:null};speakNarrationSentence()}
  function pauseNarration(){if(!narration.active)return;try{if(narration.paused){speechSynthesis.resume();narration.paused=false}else{speechSynthesis.pause();narration.paused=true}setNarrationUI()}catch{}}
  function stopNarrationKeepUI(root){stopNarration();narration.root=root;setNarrationUI()}

  function drawStory(root,list,index){
    stopNarration();
    const story=stories[index],chunk=list.slice(index*WORDS_PER_STORY,(index+1)*WORDS_PER_STORY),wordMap=buildWordMap(list),focusEntries=[],focusSeen=new Set();
    const sentenceMap=story.sentences.map(([en,th],i)=>({en,th,index:i}));
    const sentenceHtml=sentenceMap.map(item=>`<section class="story-paragraph"><button type="button" class="story-sentence story-authored-sentence" data-story-sentence="${item.index}" aria-label="ดูคำแปลประโยค">${decorateSentence(item.en,wordMap,focusEntries,focusSeen)}</button><div class="story-paragraph-translation" hidden><b>คำแปล</b><p>${esc(item.th)}</p></div></section>`).join('');
    root.querySelector('#oxfordStoriesBody').innerHTML=`<article class="oxford-story-article"><div class="oxford-story-toolbar"><button type="button" id="oxfordStoryBack">← กลับ ${STORY_COUNT} เรื่อง</button><div class="oxford-story-toolbar-actions"><button type="button" id="storyReadAll">🔊 ฟังทั้งเรื่อง</button><button type="button" id="storyPause" disabled>⏸ พัก</button><button type="button" id="storyStop" disabled>■ หยุด</button><button type="button" id="oxfordTranslateAll" aria-pressed="false">🇹🇭 แปลทั้งเรื่อง</button><span>เรื่อง ${index+1}/${STORY_COUNT}</span></div></div><div class="oxford-story-title"><span>${esc(story.thaiTitle)}</span><h1>${esc(story.title)}</h1><p>${esc(story.summary)}</p><p class="story-summary-thai" hidden>${esc(story.thaiSummary)}</p></div><div class="oxford-story-translation-hint">💡 แตะประโยคเพื่อดูคำแปล · แตะคำที่ขีดเส้นใต้เพื่อฟังคำศัพท์ · ปุ่ม 🔊 ฟังทั้งเรื่อง จะอ่านทีละประโยค</div><div class="oxford-story-reading authored-story-reading">${sentenceHtml}</div>${focusEntries.length?`<section class="story-focus-list"><h2>คำศัพท์ที่พบในเนื้อเรื่อง</h2><div>${focusEntries.map(e=>`<button type="button" data-focus-say="${esc(e.word)}"><b>${esc(e.word)}</b><span>${esc(e.thai||'')}</span></button>`).join('')}</div></section>`:''}<section class="oxford-glossary"><h2>Oxford Practice · ${WORDS_PER_STORY} คำประจำเรื่อง</h2><p>ชุดฝึกถูกสุ่มและแบ่งไม่ซ้ำกัน เมื่ออ่านครบ ${STORY_COUNT} เรื่องจะครอบคลุม Oxford 3000 ครบ 3,000 รายการ</p><div class="oxford-glossary-grid">${chunk.map((e,i)=>`<div class="oxford-glossary-row"><span>${i+1}</span><div><b>${esc(e.word)} <em>${esc(e.level||'')}</em></b><small>${esc(reading(e.word))} · ${esc(e.thai||'-')}${e.part?` · ${esc(e.part)}`:''}</small></div><button type="button" data-glossary-say="${esc(e.word)}">🔊</button></div>`).join('')}</div></section><aside id="storyTranslationPopover" class="story-translation-popover" hidden aria-live="polite"><div class="story-translation-popover-head"><b>🇹🇭 คำแปลประโยค</b><button type="button" data-pop-close aria-label="ปิดคำแปล">×</button></div><p class="story-pop-en"></p><p class="story-pop-th"></p><button type="button" class="story-pop-say">🔊 ฟังประโยค</button></aside></article>`;
    root.querySelector('#oxfordStoryBack').onclick=()=>{stopNarration();drawMenu(root,list)};
    const translateAll=root.querySelector('#oxfordTranslateAll');translateAll.onclick=()=>{const show=translateAll.getAttribute('aria-pressed')!=='true';translateAll.setAttribute('aria-pressed',String(show));translateAll.textContent=show?'🇬🇧 ซ่อนคำแปลไทย':'🇹🇭 แปลทั้งเรื่อง';root.querySelectorAll('.story-paragraph-translation,.story-summary-thai').forEach(el=>el.hidden=!show)};
    root.querySelector('#storyReadAll').onclick=()=>startNarration(root,sentenceMap);root.querySelector('#storyPause').onclick=pauseNarration;root.querySelector('#storyStop').onclick=()=>stopNarrationKeepUI(root);
    const pop=root.querySelector('#storyTranslationPopover'),popEn=pop.querySelector('.story-pop-en'),popTh=pop.querySelector('.story-pop-th'),popSay=pop.querySelector('.story-pop-say');let activeSpeech='',hoverTimer=null,pinned=false;
    const hidePop=()=>{if(!pinned)pop.hidden=true};
    const showPop=(id,anchor,lock=false)=>{const item=sentenceMap[Number(id)];if(!item)return;pinned=lock;activeSpeech=item.en;popEn.textContent=item.en;popTh.textContent=item.th;pop.hidden=false;const rect=anchor.getBoundingClientRect(),w=Math.min(430,Math.max(280,window.innerWidth-24)),left=Math.max(12,Math.min(rect.left,window.innerWidth-w-12));let top=rect.bottom+8;if(top+220>window.innerHeight)top=Math.max(12,rect.top-220);pop.style.left=`${left}px`;pop.style.top=`${top}px`};
    root.querySelectorAll('[data-story-sentence]').forEach(btn=>{btn.onclick=e=>{if(e.target.closest('[data-say]'))return;showPop(btn.dataset.storySentence,btn,true)};btn.onmouseenter=()=>{if(window.matchMedia?.('(hover:hover) and (pointer:fine)').matches){clearTimeout(hoverTimer);showPop(btn.dataset.storySentence,btn,false)}};btn.onmouseleave=()=>{if(!pinned)hoverTimer=setTimeout(()=>{if(!pop.matches(':hover'))hidePop()},120)}});
    pop.onmouseenter=()=>clearTimeout(hoverTimer);pop.onmouseleave=()=>{if(!pinned)hoverTimer=setTimeout(hidePop,100)};pop.querySelector('[data-pop-close]').onclick=()=>{pinned=false;pop.hidden=true};popSay.onclick=()=>{stopNarrationKeepUI(root);if(typeof window.oxfordSpeak==='function')window.oxfordSpeak(activeSpeech)};
    root.querySelectorAll('[data-say],[data-glossary-say],[data-focus-say]').forEach(el=>{el.onclick=e=>{e.stopPropagation();stopNarrationKeepUI(root);const text=el.dataset.say||el.dataset.glossarySay||el.dataset.focusSay;if(typeof window.oxfordSpeak==='function')window.oxfordSpeak(text)}});
    narration.root=root;setNarrationUI();root.querySelector('.oxford-extra-panel')?.scrollTo({top:0,behavior:'instant'});
  }
  window.OXFORD_STORY_META={count:STORY_COUNT,wordsPerStory:WORDS_PER_STORY,totalWords:STORY_COUNT*WORDS_PER_STORY,version:'v46'};
  window.openOxford3000Stories=openStories;
})();
