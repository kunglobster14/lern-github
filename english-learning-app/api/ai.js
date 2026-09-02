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

function safeFailure(model, status, payload) {
  const apiCode = payload?.error?.code || payload?.error?.type || payload?.error?.message || `HTTP_${status || 0}`;
  return {
    model,
    status: Number(status) || null,
    code: String(apiCode || 'unknown_error').slice(0, 100)
  };
}

async function callGroq(model, messages, system, maxTokens = 220) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    const error = new Error('GROQ_API_KEY is not configured');
    error.failure = { model: model.id, status: null, code: 'MISSING_GROQ_API_KEY' };
    throw error;
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model.id,
      messages: [
        { role: 'system', content: system },
        ...messages
      ],
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

  const raw = payload?.choices?.[0]?.message?.content || '';
  return {
    ...parseCoachReply(raw),
    model: model.id,
    modelLabel: model.label,
    source: 'groq-free-plan',
    freeOnly: true
  };
}

async function askFreeModels(messages, system, maxTokens = 220) {
  const failures = [];
  for (const model of FREE_MODELS) {
    try {
      return await callGroq(model, messages, system, maxTokens);
    } catch (error) {
      failures.push(error?.failure || { model: model.id, status: null, code: 'unknown_error' });
    }
  }
  const error = new Error('All Groq Free Plan models are unavailable.');
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
    return {
      ok: true,
      online: true,
      provider: 'groq-free-plan',
      mode: 'zero-cost-only',
      model: reply.model,
      modelLabel: reply.modelLabel
    };
  } catch (error) {
    return {
      ok: true,
      online: false,
      provider: 'groq-free-plan',
      mode: 'zero-cost-only',
      failures: Array.isArray(error?.failures) ? error.failures : []
    };
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
      res.status(200).json(await runProbe());
      return;
    }
    res.status(200).json({
      ok: true,
      provider: 'groq-free-plan',
      mode: 'zero-cost-only',
      keyConfigured: Boolean(process.env.GROQ_API_KEY),
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
    res.status(503).json({
      error: 'free_ai_unavailable',
      fallback: 'local_coach',
      provider: 'groq-free-plan',
      freeOnly: true,
      failures: Array.isArray(error?.failures) ? error.failures : []
    });
  }
}
