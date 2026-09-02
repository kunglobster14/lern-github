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
      temperature: 0.35,
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
    const reply = await askFreeModels(
      [{ role: 'user', content: 'Reply with exactly OK.' }],
      'You are a connectivity probe. Reply with exactly OK and nothing else. Do not output reasoning.',
      8
    );
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
Vary the mechanic and keep it friendly and achievable.
The English text must be the short mission title/challenge. The Thai field must explain exactly what to do, with one tiny example if helpful.
Do not output analysis, reasoning, chain-of-thought, <think> tags, markdown, or commentary.
Return ONLY valid JSON in this exact shape: {"text":"short English mission","thai":"clear Thai mission instructions"}.`;
  return askFreeModels([{ role: 'user', content: 'Create today’s surprise mission. Output only the final JSON.' }], system, 160);
}

async function makeVocabularyBatch(body) {
  const input = Array.isArray(body.words) ? body.words : [];
  const words = [...new Set(input.map((w) => String(w || '').toLowerCase().trim()).filter((w) => /^[a-z]+$/.test(w)))].slice(0, 20);
  if (!words.length) throw new Error('words_required');

  const system = `You create compact vocabulary cards for a Thai beginner learning practical English.
For EVERY supplied English word, return one item in the same order.
Use the most common everyday meaning. Thai must be concise and natural.
Example must be one short, easy, natural English sentence that clearly demonstrates the word. exampleThai is its concise Thai translation.
Do not output IPA, phonetic spellings, analysis, reasoning, markdown, <think> tags, or extra commentary.
Return ONLY a valid JSON array in this exact shape:
[{"word":"example","thai":"ตัวอย่าง","example":"This is an example.","exampleThai":"นี่คือตัวอย่าง"}]`;

  const result = await askFreeModelsRaw(
    [{ role: 'user', content: `Create cards for these words only: ${words.join(', ')}` }],
    system,
    Math.min(1400, 100 + words.length * 90)
  );
  const clean = stripReasoning(result.raw);
  const candidate = extractJsonCandidate(clean);
  let data;
  try { data = JSON.parse(candidate); } catch { data = []; }
  if (!Array.isArray(data)) data = [];

  const byWord = new Map(data.map((item) => [String(item?.word || '').toLowerCase(), item]));
  const cards = words.map((word) => {
    const item = byWord.get(word) || {};
    return {
      word,
      thai: stripReasoning(item.thai || '').slice(0, 120) || 'ดูความหมายจากตัวอย่างและฝึกใช้กับ AI Coach',
      example: stripReasoning(item.example || '').slice(0, 180) || `I use the word ${word}.`,
      exampleThai: stripReasoning(item.exampleThai || '').slice(0, 180) || ''
    };
  });
  return { cards, model: result.model, modelLabel: result.modelLabel, source: 'groq-free-plan', freeOnly: true };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  if (req.method === 'GET') {
    if (String(req.query?.probe || '') === '1') { res.status(200).json(await runProbe()); return; }
    res.status(200).json({
      ok: true,
      provider: 'groq-free-plan',
      mode: 'zero-cost-only',
      keyConfigured: Boolean(process.env.GROQ_API_KEY),
      models: FREE_MODELS.map((model) => model.id),
      features: ['coach', 'surprise-mission', 'vocab-batch'],
      reasoningVisible: false
    });
    return;
  }

  if (req.method !== 'POST') { res.status(405).json({ error: 'method_not_allowed' }); return; }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    if (body.mode === 'mission') {
      const reply = await makeMission(body);
      res.status(200).json({ ...reply, kind: 'surprise-mission' });
      return;
    }

    if (body.mode === 'vocab_batch') {
      const reply = await makeVocabularyBatch(body);
      res.status(200).json({ ...reply, kind: 'vocab-batch' });
      return;
    }

    const message = String(body.message || '').trim().slice(0, 800);
    if (!message) { res.status(400).json({ error: 'message_required' }); return; }

    const scenario = SCENARIOS[body.scenario] || SCENARIOS.daily;
    const learner = String(body.name || 'ผู้เรียน').trim().slice(0, 30);
    const history = cleanHistory(body.history);
    const messages = [...history, { role: 'user', content: message }];

    const system = `You are My English Coach for a Thai beginner named ${learner}. Practice ${scenario}.
Respond to the learner's actual meaning, not with generic praise.
Use very simple, natural everyday English. Keep the English to 1-3 short sentences and finish with exactly one easy question related to what the learner just said.
If the learner's English is correct, briefly reinforce the natural sentence. If it needs correction, show the corrected sentence gently.
The Thai field must be a short, useful explanation, correction, or suggested phrase in Thai. Do not give a long grammar lecture.
The learner may type Thai when stuck; help them say the same idea in simple English.
Do not output analysis, reasoning, chain-of-thought, <think> tags, markdown, or commentary.
Return ONLY valid JSON in this exact shape: {"text":"English coach reply","thai":"short Thai coaching note"}.`;

    const reply = await askFreeModels(messages, system);
    res.status(200).json(reply);
  } catch (error) {
    res.status(503).json({
      error: 'free_ai_unavailable', fallback: 'local_coach', provider: 'groq-free-plan', freeOnly: true,
      failures: Array.isArray(error?.failures) ? error.failures : []
    });
  }
}
