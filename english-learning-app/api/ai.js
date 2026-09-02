import { generateText } from 'ai';

const SCENARIOS = {
  coffee: 'ordering food and drinks at a cafe',
  travel: 'travel, transportation, hotels, and asking for directions',
  work: 'simple workplace conversation',
  daily: 'daily life and friendly small talk'
};

const FREE_MODELS = [
  { id: 'nvidia/nemotron-3.5-lightning-free', label: 'Nemotron 3.5 Lightning Free' },
  { id: 'inclusionai/ling-3.0-flash-fin-free', label: 'Ling 3.0 Flash Fin Free' },
  { id: 'poolside/laguna-s-2.1-free', label: 'Laguna S 2.1 Free' }
];

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.slice(-8).map((item) => ({
    role: item?.role === 'user' ? 'user' : 'assistant',
    content: String(item?.text || '').slice(0, 500)
  })).filter((item) => item.content);
}

function safeError(error) {
  const status = error?.statusCode || error?.status || error?.response?.status || null;
  const name = String(error?.name || 'Error').slice(0, 50);
  const code = String(error?.code || status || name || 'unknown_error').slice(0, 80);
  return { code, status: Number(status) || null };
}

function parseCoachReply(raw) {
  const text = String(raw || '').trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
  try {
    const value = JSON.parse(text);
    const english = String(value?.text || '').trim().slice(0, 700);
    const thai = String(value?.thai || '').trim().slice(0, 500);
    if (!english) throw new Error('empty_json_text');
    return { text: english, thai };
  } catch {
    return {
      text: text.slice(0, 700) || 'Nice to meet you! Tell me one simple thing about your day.',
      thai: 'AI ตอบกลับมาแล้วครับ ลองตอบต่อเป็นประโยคอังกฤษสั้น ๆ ได้เลย'
    };
  }
}

async function callFreeModel(model, messages, system, maxOutputTokens = 220) {
  const result = await generateText({
    model: model.id,
    system,
    messages,
    temperature: 0.35,
    maxOutputTokens
  });
  return {
    ...parseCoachReply(result.text),
    model: model.id,
    modelLabel: model.label,
    source: 'vercel-ai-gateway-oidc',
    freeOnly: true
  };
}

async function askFreeModels(messages, system, maxOutputTokens = 220) {
  const failures = [];
  for (const model of FREE_MODELS) {
    try {
      return await callFreeModel(model, messages, system, maxOutputTokens);
    } catch (error) {
      failures.push({ model: model.id, ...safeError(error) });
      console.warn(`Free AI model unavailable: ${model.id}`, safeError(error));
    }
  }
  const error = new Error('All zero-cost AI models are unavailable.');
  error.failures = failures;
  throw error;
}

async function runProbe() {
  try {
    const reply = await askFreeModels(
      [{ role: 'user', content: 'Reply with exactly OK.' }],
      'You are a connectivity probe. Reply with exactly OK and nothing else.',
      8
    );
    return { ok: true, online: true, mode: 'zero-cost-only', model: reply.model, modelLabel: reply.modelLabel };
  } catch (error) {
    return { ok: true, online: false, mode: 'zero-cost-only', failures: Array.isArray(error?.failures) ? error.failures : [] };
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    if (String(req.query?.probe || '') === '1') {
      const result = await runProbe();
      res.status(200).json(result);
      return;
    }
    res.status(200).json({
      ok: true,
      mode: 'zero-cost-only',
      authMode: 'vercel-runtime-oidc',
      models: FREE_MODELS.map((model) => model.id)
    });
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const message = String(body.message || '').trim().slice(0, 800);
    if (!message) {
      res.status(400).json({ error: 'message_required' });
      return;
    }

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
Return ONLY valid JSON in this exact shape: {"text":"English coach reply","thai":"short Thai coaching note"}.`;

    const reply = await askFreeModels(messages, system);
    res.status(200).json(reply);
  } catch (error) {
    console.error('Zero-cost AI Coach unavailable', Array.isArray(error?.failures) ? error.failures : safeError(error));
    res.status(503).json({
      error: 'free_ai_unavailable',
      fallback: 'local_coach',
      freeOnly: true,
      failures: Array.isArray(error?.failures) ? error.failures : [safeError(error)]
    });
  }
}
