const SCENARIOS = {
  coffee: 'ordering food and drinks at a cafe',
  travel: 'travel, transportation, hotels, and asking for directions',
  work: 'simple workplace conversation',
  daily: 'daily life and friendly small talk',
  restaurant: 'ordering food, asking about dishes, and paying at a restaurant',
  shopping: 'shopping, asking prices, sizes, colors, and paying',
  hotel: 'checking in, asking about rooms, facilities, and simple hotel needs',
  airport: 'airport check-in, gates, baggage, and simple flight questions'
};

// Zero-cost policy: Groq Free Plan only. No paid-provider fallback.
const FREE_MODELS = [
  { id: 'qwen/qwen3.6-27b', label: 'Qwen 3.6 27B' },
  { id: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B' }
];

// Deterministic starter cards so essential function words never show a fake placeholder.
const STARTER_VOCAB = {
  the:{thai:'คำนำหน้านามที่ชี้เฉพาะ (มักไม่แปลตรงตัว)',part:'article',example:'The door is open.',exampleThai:'ประตูบานนั้นเปิดอยู่'},
  of:{thai:'ของ / แห่ง / จาก',part:'preposition',example:'A cup of coffee, please.',exampleThai:'ขอกาแฟหนึ่งถ้วยครับ/ค่ะ'},
  and:{thai:'และ',part:'conjunction',example:'I like tea and coffee.',exampleThai:'ฉันชอบชาและกาแฟ'},
  to:{thai:'ไปยัง / ถึง / เพื่อ',part:'preposition',example:'I go to work every day.',exampleThai:'ฉันไปทำงานทุกวัน'},
  a:{thai:'หนึ่ง / คำนำหน้านามทั่วไป (มักไม่แปลตรงตัว)',part:'article',example:'I have a car.',exampleThai:'ฉันมีรถหนึ่งคัน'},
  in:{thai:'ใน / ข้างใน',part:'preposition',example:'The keys are in my bag.',exampleThai:'กุญแจอยู่ในกระเป๋าของฉัน'},
  for:{thai:'สำหรับ / เพื่อ / เป็นเวลา',part:'preposition',example:'This gift is for you.',exampleThai:'ของขวัญนี้สำหรับคุณ'},
  is:{thai:'เป็น / อยู่ / คือ (ใช้กับ he, she, it หรือเอกพจน์)',part:'verb',example:'She is at home.',exampleThai:'เธออยู่ที่บ้าน'},
  on:{thai:'บน / อยู่บน / ใน (วันหรือวันที่)',part:'preposition',example:'The phone is on the table.',exampleThai:'โทรศัพท์อยู่บนโต๊ะ'},
  that:{thai:'นั้น / นั่น / ที่',part:'determiner',example:'That is my bag.',exampleThai:'นั่นคือกระเป๋าของฉัน'},
  by:{thai:'โดย / ข้าง / ด้วยวิธี',part:'preposition',example:'I go to work by bus.',exampleThai:'ฉันไปทำงานโดยรถบัส'},
  this:{thai:'นี้ / นี่',part:'determiner',example:'This is my room.',exampleThai:'นี่คือห้องของฉัน'},
  with:{thai:'กับ / ด้วย',part:'preposition',example:'I live with my family.',exampleThai:'ฉันอยู่กับครอบครัว'},
  i:{thai:'ฉัน / ผม / ดิฉัน',part:'pronoun',example:'I am ready.',exampleThai:'ฉันพร้อมแล้ว'},
  you:{thai:'คุณ / พวกคุณ',part:'pronoun',example:'You are very kind.',exampleThai:'คุณใจดีมาก'},
  it:{thai:'มัน / สิ่งนั้น',part:'pronoun',example:'It is very hot today.',exampleThai:'วันนี้อากาศร้อนมาก'},
  not:{thai:'ไม่',part:'adverb',example:'I am not tired.',exampleThai:'ฉันไม่เหนื่อย'},
  or:{thai:'หรือ',part:'conjunction',example:'Tea or coffee?',exampleThai:'ชาหรือกาแฟ'},
  be:{thai:'เป็น / อยู่ / คือ',part:'verb',example:'Please be careful.',exampleThai:'กรุณาระวัง'},
  are:{thai:'เป็น / อยู่ / คือ (ใช้กับ you, we, they หรือพหูพจน์)',part:'verb',example:'We are at work.',exampleThai:'พวกเราอยู่ที่ทำงาน'},
  from:{thai:'จาก',part:'preposition',example:'I am from Thailand.',exampleThai:'ฉันมาจากประเทศไทย'},
  at:{thai:'ที่ / ณ / ตอนเวลา',part:'preposition',example:'I am at the station.',exampleThai:'ฉันอยู่ที่สถานี'},
  as:{thai:'ในฐานะ / เหมือนกับ / ตามที่',part:'preposition',example:'I work as a nurse.',exampleThai:'ฉันทำงานเป็นพยาบาล'},
  your:{thai:'ของคุณ',part:'determiner',example:'What is your name?',exampleThai:'คุณชื่ออะไร'},
  all:{thai:'ทั้งหมด / ทุก',part:'determiner',example:'All the rooms are clean.',exampleThai:'ห้องทั้งหมดสะอาด'},
  have:{thai:'มี / ได้',part:'verb',example:'I have two brothers.',exampleThai:'ฉันมีพี่น้องผู้ชายสองคน'},
  new:{thai:'ใหม่',part:'adjective',example:'I have a new phone.',exampleThai:'ฉันมีโทรศัพท์ใหม่'},
  more:{thai:'มากขึ้น / เพิ่มเติม',part:'determiner',example:'I need more time.',exampleThai:'ฉันต้องการเวลาเพิ่ม'},
  an:{thai:'หนึ่ง / คำนำหน้านามทั่วไปที่ขึ้นต้นด้วยเสียงสระ',part:'article',example:'She has an umbrella.',exampleThai:'เธอมีร่มหนึ่งคัน'},
  was:{thai:'เป็น / อยู่ / คือ ในอดีต',part:'verb',example:'I was busy yesterday.',exampleThai:'เมื่อวานฉันยุ่ง'},
  we:{thai:'พวกเรา / เรา',part:'pronoun',example:'We work together.',exampleThai:'พวกเราทำงานด้วยกัน'},
  will:{thai:'จะ',part:'modal verb',example:'I will call you tomorrow.',exampleThai:'ฉันจะโทรหาคุณพรุ่งนี้'},
  home:{thai:'บ้าน / ที่บ้าน',part:'noun',example:'I am at home.',exampleThai:'ฉันอยู่ที่บ้าน'},
  can:{thai:'สามารถ / ทำได้',part:'modal verb',example:'I can speak a little English.',exampleThai:'ฉันพูดภาษาอังกฤษได้นิดหน่อย'},
  us:{thai:'พวกเรา / เรา (รูปกรรม)',part:'pronoun',example:'Please help us.',exampleThai:'กรุณาช่วยพวกเรา'},
  about:{thai:'เกี่ยวกับ / ประมาณ',part:'preposition',example:'Tell me about your work.',exampleThai:'เล่าเรื่องงานของคุณให้ฉันฟัง'},
  if:{thai:'ถ้า / หาก',part:'conjunction',example:'Call me if you need help.',exampleThai:'โทรหาฉันถ้าคุณต้องการความช่วยเหลือ'},
  my:{thai:'ของฉัน / ของผม',part:'determiner',example:'My name is Kung.',exampleThai:'ฉันชื่อกุ้ง'},
  has:{thai:'มี (ใช้กับ he, she, it)',part:'verb',example:'She has a new job.',exampleThai:'เธอมีงานใหม่'},
  but:{thai:'แต่',part:'conjunction',example:'I am tired, but I am okay.',exampleThai:'ฉันเหนื่อย แต่ฉันโอเค'},
  our:{thai:'ของพวกเรา',part:'determiner',example:'This is our house.',exampleThai:'นี่คือบ้านของพวกเรา'},
  one:{thai:'หนึ่ง / หนึ่งคน / หนึ่งอัน',part:'number',example:'I need one ticket.',exampleThai:'ฉันต้องการตั๋วหนึ่งใบ'},
  other:{thai:'อื่น / อีก',part:'adjective',example:'Do you have another color?',exampleThai:'คุณมีสีอื่นไหม'},
  do:{thai:'ทำ / ใช้ช่วยสร้างคำถามและปฏิเสธ',part:'verb',example:'What do you do?',exampleThai:'คุณทำงานอะไร'},
  no:{thai:'ไม่ / ไม่มี',part:'determiner',example:'No problem.',exampleThai:'ไม่มีปัญหา'},
  information:{thai:'ข้อมูล',part:'noun',example:'I need more information.',exampleThai:'ฉันต้องการข้อมูลเพิ่มเติม'},
  time:{thai:'เวลา / ครั้ง',part:'noun',example:'What time is it?',exampleThai:'ตอนนี้กี่โมง'},
  they:{thai:'พวกเขา / พวกมัน',part:'pronoun',example:'They are my friends.',exampleThai:'พวกเขาเป็นเพื่อนของฉัน'},
  he:{thai:'เขา (ผู้ชาย)',part:'pronoun',example:'He works here.',exampleThai:'เขาทำงานที่นี่'},
  up:{thai:'ขึ้น / ด้านบน',part:'adverb',example:'Please stand up.',exampleThai:'กรุณายืนขึ้น'},
  may:{thai:'อาจ / สามารถ (แบบสุภาพ)',part:'modal verb',example:'May I come in?',exampleThai:'ฉันขอเข้าไปได้ไหม'},
  what:{thai:'อะไร / สิ่งที่',part:'question word',example:'What is this?',exampleThai:'นี่คืออะไร'},
  which:{thai:'อันไหน / ซึ่ง',part:'question word',example:'Which one do you want?',exampleThai:'คุณต้องการอันไหน'},
  their:{thai:'ของพวกเขา',part:'determiner',example:'This is their room.',exampleThai:'นี่คือห้องของพวกเขา'},
  out:{thai:'ออก / ข้างนอก',part:'adverb',example:'Let us go out.',exampleThai:'ออกไปข้างนอกกันเถอะ'},
  use:{thai:'ใช้ / การใช้',part:'verb',example:'I use this phone every day.',exampleThai:'ฉันใช้โทรศัพท์นี้ทุกวัน'},
  any:{thai:'ใด ๆ / บ้าง',part:'determiner',example:'Do you have any questions?',exampleThai:'คุณมีคำถามไหม'},
  there:{thai:'ที่นั่น / มี (ใน there is/are)',part:'adverb',example:'There is a cafe nearby.',exampleThai:'มีร้านกาแฟอยู่ใกล้ ๆ'},
  see:{thai:'เห็น / พบ',part:'verb',example:'I can see the station.',exampleThai:'ฉันมองเห็นสถานี'},
  only:{thai:'เท่านั้น / เพียง',part:'adverb',example:'I have only ten minutes.',exampleThai:'ฉันมีเวลาเพียงสิบ分钟'},
  so:{thai:'ดังนั้น / มาก',part:'conjunction',example:'I am tired, so I will go home.',exampleThai:'ฉันเหนื่อย ดังนั้นฉันจะกลับบ้าน'},
  his:{thai:'ของเขา (ผู้ชาย)',part:'determiner',example:'His name is Tom.',exampleThai:'เขาชื่อทอม'},
  when:{thai:'เมื่อไร / เมื่อ',part:'question word',example:'When do you start work?',exampleThai:'คุณเริ่มงานเมื่อไร'},
  here:{thai:'ที่นี่',part:'adverb',example:'Please wait here.',exampleThai:'กรุณารอที่นี่'},
  who:{thai:'ใคร / ผู้ที่',part:'question word',example:'Who is that?',exampleThai:'คนนั้นคือใคร'},
  also:{thai:'ด้วย / เช่นกัน',part:'adverb',example:'I also like music.',exampleThai:'ฉันก็ชอบดนตรีด้วย'},
  now:{thai:'ตอนนี้',part:'adverb',example:'I am busy now.',exampleThai:'ตอนนี้ฉันยุ่ง'},
  help:{thai:'ช่วย / ความช่วยเหลือ',part:'verb/noun',example:'Can you help me?',exampleThai:'คุณช่วยฉันได้ไหม'},
  get:{thai:'ได้ / ได้รับ / ไปถึง',part:'verb',example:'I get home at six.',exampleThai:'ฉันถึงบ้านตอนหกโมง'},
  first:{thai:'แรก / อันดับแรก',part:'adjective',example:'This is my first day.',exampleThai:'นี่เป็นวันแรกของฉัน'},
  am:{thai:'เป็น / อยู่ / คือ (ใช้กับ I)',part:'verb',example:'I am happy.',exampleThai:'ฉันมีความสุข'},
  been:{thai:'เคยเป็น / เคยอยู่',part:'verb',example:'I have been here before.',exampleThai:'ฉันเคยมาที่นี่มาก่อน'},
  would:{thai:'จะ / อยากจะ (สุภาพ)',part:'modal verb',example:'I would like some water.',exampleThai:'ฉันขอน้ำหน่อยครับ/ค่ะ'},
  how:{thai:'อย่างไร / แค่ไหน',part:'question word',example:'How are you?',exampleThai:'คุณเป็นอย่างไรบ้าง'},
  were:{thai:'เป็น / อยู่ / คือ ในอดีต (พหูพจน์/you)',part:'verb',example:'We were at home.',exampleThai:'พวกเราอยู่บ้าน'},
  me:{thai:'ฉัน / ผม / ดิฉัน (รูปกรรม)',part:'pronoun',example:'Please call me later.',exampleThai:'กรุณาโทรหาฉันทีหลัง'},
  some:{thai:'บาง / จำนวนหนึ่ง',part:'determiner',example:'I need some water.',exampleThai:'ฉันต้องการน้ำหน่อย'},
  these:{thai:'เหล่านี้ / พวกนี้',part:'determiner',example:'These are my keys.',exampleThai:'พวกนี้คือกุญแจของฉัน'},
  its:{thai:'ของมัน',part:'determiner',example:'The dog is in its bed.',exampleThai:'สุนัขอยู่บนที่นอนของมัน'},
  like:{thai:'ชอบ / เหมือน',part:'verb',example:'I like coffee.',exampleThai:'ฉันชอบกาแฟ'},
  than:{thai:'กว่า',part:'conjunction',example:'This room is bigger than that one.',exampleThai:'ห้องนี้ใหญ่กว่าห้องนั้น'},
  find:{thai:'หา / พบ',part:'verb',example:'I cannot find my phone.',exampleThai:'ฉันหาโทรศัพท์ไม่เจอ'},
  back:{thai:'กลับ / ด้านหลัง',part:'adverb',example:'I will be back soon.',exampleThai:'ฉันจะกลับมาเร็ว ๆ นี้'},
  people:{thai:'คน / ผู้คน',part:'noun',example:'Many people work here.',exampleThai:'มีหลายคนทำงานที่นี่'},
  had:{thai:'มี / ได้ ในอดีต',part:'verb',example:'I had coffee this morning.',exampleThai:'เช้านี้ฉันดื่มกาแฟ'},
  name:{thai:'ชื่อ',part:'noun',example:'What is your name?',exampleThai:'คุณชื่ออะไร'},
  just:{thai:'เพิ่ง / เพียง / แค่',part:'adverb',example:'I just got home.',exampleThai:'ฉันเพิ่งถึงบ้าน'},
  over:{thai:'เหนือ / เกิน / จบ',part:'preposition',example:'The meeting is over.',exampleThai:'การประชุมจบแล้ว'},
  year:{thai:'ปี',part:'noun',example:'I travel once a year.',exampleThai:'ฉันเดินทางปีละครั้ง'},
  day:{thai:'วัน',part:'noun',example:'Have a nice day.',exampleThai:'ขอให้เป็นวันที่ดี'},
  into:{thai:'เข้าไปใน',part:'preposition',example:'Please come into the room.',exampleThai:'กรุณาเข้ามาในห้อง'},
  two:{thai:'สอง',part:'number',example:'I need two tickets.',exampleThai:'ฉันต้องการตั๋วสองใบ'},
  world:{thai:'โลก',part:'noun',example:'English is used around the world.',exampleThai:'ภาษาอังกฤษถูกใช้ทั่วโลก'},
  next:{thai:'ถัดไป / หน้า',part:'adjective',example:'See you next week.',exampleThai:'เจอกันสัปดาห์หน้า'},
  used:{thai:'ใช้แล้ว / เคย',part:'verb',example:'I used this computer yesterday.',exampleThai:'เมื่อวานฉันใช้คอมพิวเตอร์เครื่องนี้'},
  go:{thai:'ไป',part:'verb',example:'I go to work at eight.',exampleThai:'ฉันไปทำงานแปดโมง'},
  work:{thai:'ทำงาน / งาน',part:'verb/noun',example:'I work every day.',exampleThai:'ฉันทำงานทุกวัน'},
  last:{thai:'สุดท้าย / ที่แล้ว',part:'adjective',example:'I saw him last week.',exampleThai:'ฉันเจอเขาเมื่อสัปดาห์ที่แล้ว'},
  most:{thai:'มากที่สุด / ส่วนใหญ่',part:'determiner',example:'Most people are friendly.',exampleThai:'คนส่วนใหญ่เป็นมิตร'},
  music:{thai:'ดนตรี / เพลง',part:'noun',example:'I like listening to music.',exampleThai:'ฉันชอบฟังเพลง'},
  buy:{thai:'ซื้อ',part:'verb',example:'I want to buy this shirt.',exampleThai:'ฉันต้องการซื้อเสื้อตัวนี้'},
  make:{thai:'ทำ / สร้าง',part:'verb',example:'I make coffee every morning.',exampleThai:'ฉันชงกาแฟทุกเช้า'},
  should:{thai:'ควร',part:'modal verb',example:'You should get some rest.',exampleThai:'คุณควรพักผ่อน'},
  good:{thai:'ดี',part:'adjective',example:'This food is good.',exampleThai:'อาหารนี้อร่อย'},
  where:{thai:'ที่ไหน',part:'question word',example:'Where is the bathroom?',exampleThai:'ห้องน้ำอยู่ที่ไหน'},
  need:{thai:'ต้องการ / จำเป็นต้อง',part:'verb',example:'I need help.',exampleThai:'ฉันต้องการความช่วยเหลือ'},
  want:{thai:'ต้องการ / อยาก',part:'verb',example:'I want some water.',exampleThai:'ฉันต้องการน้ำ'},
  please:{thai:'กรุณา / โปรด',part:'adverb',example:'Water, please.',exampleThai:'ขอน้ำครับ/ค่ะ'},
  read:{thai:'อ่าน',part:'verb',example:'I read English every day.',exampleThai:'ฉันอ่านภาษาอังกฤษทุกวัน'},
  write:{thai:'เขียน',part:'verb',example:'Please write your name here.',exampleThai:'กรุณาเขียนชื่อของคุณตรงนี้'},
  speak:{thai:'พูด',part:'verb',example:'Please speak slowly.',exampleThai:'กรุณาพูดช้า ๆ'},
  listen:{thai:'ฟัง',part:'verb',example:'Listen to this sentence.',exampleThai:'ฟังประโยคนี้'},
  learn:{thai:'เรียนรู้',part:'verb',example:'I want to learn English.',exampleThai:'ฉันอยากเรียนภาษาอังกฤษ'}
};

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.slice(-8).map((item) => ({
    role: item?.role === 'user' ? 'user' : 'assistant',
    content: String(item?.text || '').slice(0, 500)
  })).filter((item) => item.content);
}

function stripReasoning(raw) {
  let text = String(raw || '');
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, ' ');
  text = text.replace(/^\s*<think>[\s\S]*?(?=\{\s*"(?:text|thai)"|\[\s*\{|```json|$)/i, ' ');
  text = text.replace(/<\/?think>/gi, ' ');
  text = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
  return text.trim();
}

function extractJsonCandidate(text) {
  const cleaned = String(text || '').trim();
  if (!cleaned) return '';
  const objFirst = cleaned.indexOf('{');
  const objLast = cleaned.lastIndexOf('}');
  const arrFirst = cleaned.indexOf('[');
  const arrLast = cleaned.lastIndexOf(']');
  if (arrFirst >= 0 && arrLast > arrFirst && (objFirst < 0 || arrFirst < objFirst)) return cleaned.slice(arrFirst, arrLast + 1);
  if (objFirst >= 0 && objLast > objFirst) return cleaned.slice(objFirst, objLast + 1);
  return cleaned;
}

function parseCoachReply(raw) {
  const clean = stripReasoning(raw);
  const candidate = extractJsonCandidate(clean);
  try {
    const value = JSON.parse(candidate);
    const english = stripReasoning(value?.text).slice(0, 700);
    const thai = stripReasoning(value?.thai).slice(0, 500);
    if (!english) throw new Error('empty_json_text');
    return { text: english, thai };
  } catch {
    const safeText = stripReasoning(clean).slice(0, 700);
    return {
      text: safeText || 'Nice to meet you! Tell me one simple thing about your day.',
      thai: 'AI ตอบกลับมาแล้วครับ ลองตอบต่อเป็นประโยคอังกฤษสั้น ๆ ได้เลย'
    };
  }
}

function safeFailure(model, status, payload) {
  const apiCode = payload?.error?.code || payload?.error?.type || payload?.error?.message || `HTTP_${status || 0}`;
  return { model, status: Number(status) || null, code: String(apiCode || 'unknown_error').slice(0, 100) };
}

async function callGroqRaw(model, messages, system, maxTokens = 220) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    const error = new Error('GROQ_API_KEY is not configured');
    error.failure = { model: model.id, status: null, code: 'MISSING_GROQ_API_KEY' };
    throw error;
  }
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model.id,
      messages: [{ role: 'system', content: system }, ...messages],
      temperature: 0.25,
      max_completion_tokens: maxTokens,
      stream: false
    })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error('Groq request failed');
    error.failure = safeFailure(model.id, response.status, payload);
    throw error;
  }
  return { raw: payload?.choices?.[0]?.message?.content || '', model: model.id, modelLabel: model.label };
}

async function callGroq(model, messages, system, maxTokens = 220) {
  const result = await callGroqRaw(model, messages, system, maxTokens);
  return { ...parseCoachReply(result.raw), model: result.model, modelLabel: result.modelLabel, source: 'groq-free-plan', freeOnly: true };
}

async function askFreeModels(messages, system, maxTokens = 220) {
  const failures = [];
  for (const model of FREE_MODELS) {
    try { return await callGroq(model, messages, system, maxTokens); }
    catch (error) { failures.push(error?.failure || { model: model.id, status: null, code: 'unknown_error' }); }
  }
  const error = new Error('All Groq Free Plan models are unavailable.');
  error.failures = failures;
  throw error;
}

async function askFreeModelsRaw(messages, system, maxTokens = 800) {
  const failures = [];
  for (const model of FREE_MODELS) {
    try { return await callGroqRaw(model, messages, system, maxTokens); }
    catch (error) { failures.push(error?.failure || { model: model.id, status: null, code: 'unknown_error' }); }
  }
  const error = new Error('All Groq Free Plan models are unavailable.');
  error.failures = failures;
  throw error;
}

async function runProbe() {
  try {
    const reply = await askFreeModels([{ role: 'user', content: 'Reply with exactly OK.' }], 'You are a connectivity probe. Reply with exactly OK and nothing else. Do not output reasoning.', 8);
    return { ok: true, online: true, provider: 'groq-free-plan', mode: 'zero-cost-only', model: reply.model, modelLabel: reply.modelLabel };
  } catch (error) {
    return { ok: true, online: false, provider: 'groq-free-plan', mode: 'zero-cost-only', failures: Array.isArray(error?.failures) ? error.failures : [] };
  }
}

async function makeMission(body) {
  const level = Math.max(1, Math.min(20, Number(body.level) || 1));
  const learner = String(body.name || 'ผู้เรียน').trim().slice(0, 30);
  const scenario = SCENARIOS[body.scenario] || SCENARIOS.daily;
  const system = `You design playful 2-minute English micro-missions for a Thai beginner named ${learner}, level ${level}.
The current theme is ${scenario}.
Make ONE surprising but practical challenge that can be completed by speaking or typing 1-3 short English sentences.
The English text must be the short mission title/challenge. The Thai field must explain exactly what to do, with one tiny example if helpful.
Do not output analysis, reasoning, chain-of-thought, <think> tags, markdown, or commentary.
Return ONLY valid JSON in this exact shape: {"text":"short English mission","thai":"clear Thai mission instructions"}.`;
  return askFreeModels([{ role: 'user', content: 'Create today’s surprise mission. Output only the final JSON.' }], system, 160);
}

function validThai(value) { return /[ก-๙]/.test(String(value || '')) && String(value || '').trim().length >= 2; }
function validVocabItem(item) {
  return validThai(item?.thai) && String(item?.example || '').trim().length >= 5 && validThai(item?.exampleThai);
}
function normalizeVocab(word, item) {
  return {
    word,
    thai: stripReasoning(item?.thai || '').slice(0, 140),
    part: stripReasoning(item?.part || '').slice(0, 40),
    example: stripReasoning(item?.example || '').slice(0, 200),
    exampleThai: stripReasoning(item?.exampleThai || '').slice(0, 200)
  };
}

async function generateVocabAttempt(words) {
  if (!words.length) return { cards: [], model: '', modelLabel: '' };
  const system = `You create reliable vocabulary cards for a Thai beginner.
For EVERY supplied English word, return exactly one item in the same order.
Thai must give the common everyday Thai meaning. For grammar/function words such as articles, prepositions, auxiliaries, and pronouns, explain their FUNCTION briefly in Thai rather than pretending there is one literal translation.
part is a short English part-of-speech label.
example must be a short, natural sentence a beginner can actually use or understand. exampleThai must be an accurate Thai translation of that sentence.
Never write filler such as "look at the example", "practice with AI", or "I use the word X".
Do not output IPA, analysis, reasoning, markdown, <think> tags, or commentary.
Return ONLY a valid JSON array:
[{"word":"example","thai":"ตัวอย่าง","part":"noun","example":"This is an example.","exampleThai":"นี่คือตัวอย่าง"}]`;
  const result = await askFreeModelsRaw([{ role: 'user', content: `Cards for these exact words: ${words.join(', ')}` }], system, Math.min(1800, 160 + words.length * 115));
  const clean = stripReasoning(result.raw);
  const candidate = extractJsonCandidate(clean);
  let data = [];
  try { data = JSON.parse(candidate); } catch { data = []; }
  if (!Array.isArray(data)) data = [];
  const byWord = new Map(data.map((item) => [String(item?.word || '').toLowerCase().trim(), item]));
  const cards = [];
  for (const word of words) {
    const item = byWord.get(word);
    if (item && validVocabItem(item)) cards.push(normalizeVocab(word, item));
  }
  return { cards, model: result.model, modelLabel: result.modelLabel };
}

async function makeVocabularyBatch(body) {
  const input = Array.isArray(body.words) ? body.words : [];
  const words = [...new Set(input.map((w) => String(w || '').toLowerCase().trim()).filter((w) => /^[a-z]+$/.test(w)))].slice(0, 20);
  if (!words.length) throw new Error('words_required');

  const collected = new Map();
  // Use deterministic cards first for the most important beginner words.
  for (const word of words) if (STARTER_VOCAB[word]) collected.set(word, { word, ...STARTER_VOCAB[word] });

  let lastMeta = { model: 'local-starter', modelLabel: 'Starter dictionary' };
  for (let attempt = 0; attempt < 3; attempt++) {
    const missing = words.filter((w) => !collected.has(w));
    if (!missing.length) break;
    const chunkSize = attempt === 0 ? 12 : (attempt === 1 ? 5 : 2);
    for (let i = 0; i < missing.length; i += chunkSize) {
      const chunk = missing.slice(i, i + chunkSize);
      try {
        const result = await generateVocabAttempt(chunk);
        lastMeta = result;
        result.cards.forEach((card) => collected.set(card.word, card));
      } catch { /* next retry or model will handle it */ }
    }
  }

  const stillMissing = words.filter((w) => !collected.has(w));
  if (stillMissing.length) {
    const error = new Error(`vocab_cards_incomplete:${stillMissing.join(',')}`);
    error.failures = [{ model: lastMeta.model || 'groq', status: null, code: `MISSING_VALID_CARDS_${stillMissing.length}` }];
    throw error;
  }
  return { cards: words.map((w) => collected.get(w)), model: lastMeta.model, modelLabel: lastMeta.modelLabel, source: 'core3000-validated', freeOnly: true };
}

async function checkWriting(body) {
  const text = String(body.text || '').trim().slice(0, 1200);
  if (!text) throw new Error('writing_required');
  const level = String(body.level || 'A1').slice(0, 8);
  const topic = String(body.topic || 'everyday English').slice(0, 120);
  const system = `You are a friendly English writing coach for a Thai learner at ${level} level. Topic: ${topic}.
Correct the learner's writing while preserving their intended meaning. Use simple natural English appropriate to the level.
Return a score from 0 to 100. Thai explanation must be concise and useful. tips must contain 1-3 short Thai tips.
Do not output reasoning, chain-of-thought, markdown, or <think> tags.
Return ONLY JSON: {"corrected":"...","thai":"...","score":80,"tips":["..."]}`;
  const result = await askFreeModelsRaw([{ role: 'user', content: text }], system, 320);
  const clean = stripReasoning(result.raw);
  let value;
  try { value = JSON.parse(extractJsonCandidate(clean)); } catch { value = null; }
  if (!value || !String(value.corrected || '').trim()) throw new Error('writing_parse_failed');
  return {
    corrected: stripReasoning(value.corrected).slice(0, 1200),
    thai: stripReasoning(value.thai || '').slice(0, 700),
    score: Math.max(0, Math.min(100, Number(value.score) || 0)),
    tips: Array.isArray(value.tips) ? value.tips.slice(0, 3).map((x) => stripReasoning(x).slice(0, 220)) : [],
    model: result.model, modelLabel: result.modelLabel, source: 'groq-free-plan', freeOnly: true
  };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method === 'GET') {
    if (String(req.query?.probe || '') === '1') { res.status(200).json(await runProbe()); return; }
    res.status(200).json({ ok: true, provider: 'groq-free-plan', mode: 'zero-cost-only', keyConfigured: Boolean(process.env.GROQ_API_KEY), models: FREE_MODELS.map((model) => model.id), features: ['coach','surprise-mission','vocab-batch','writing-check'], reasoningVisible: false });
    return;
  }
  if (req.method !== 'POST') { res.status(405).json({ error: 'method_not_allowed' }); return; }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (body.mode === 'mission') { res.status(200).json({ ...(await makeMission(body)), kind: 'surprise-mission' }); return; }
    if (body.mode === 'vocab_batch') { res.status(200).json({ ...(await makeVocabularyBatch(body)), kind: 'vocab-batch' }); return; }
    if (body.mode === 'writing_check') { res.status(200).json({ ...(await checkWriting(body)), kind: 'writing-feedback' }); return; }

    const message = String(body.message || '').trim().slice(0, 800);
    if (!message) { res.status(400).json({ error: 'message_required' }); return; }
    const scenario = SCENARIOS[body.scenario] || SCENARIOS.daily;
    const learner = String(body.name || 'ผู้เรียน').trim().slice(0, 30);
    const history = cleanHistory(body.history);
    const messages = [...history, { role: 'user', content: message }];
    const system = `You are My English Coach for a Thai beginner named ${learner}. Practice ${scenario}.
Respond to the learner's actual meaning. Use simple, natural everyday English. Keep English to 1-3 short sentences and finish with exactly one easy related question.
If English needs correction, show a natural corrected sentence gently. Thai must be a short useful explanation or suggested phrase. The learner may type Thai when stuck.
Do not output analysis, reasoning, chain-of-thought, <think> tags, markdown, or commentary.
Return ONLY JSON: {"text":"English coach reply","thai":"short Thai coaching note"}.`;
    res.status(200).json(await askFreeModels(messages, system));
  } catch (error) {
    res.status(503).json({ error: 'free_ai_unavailable', fallback: 'local_coach', provider: 'groq-free-plan', freeOnly: true, failures: Array.isArray(error?.failures) ? error.failures : [] });
  }
}
