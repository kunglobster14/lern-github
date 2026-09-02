const SCENARIOS = {
  coffee: 'ordering food and drinks at a cafe',
  travel: 'travel, transportation, hotels, and asking for directions',
  work: 'simple workplace conversation',
  daily: 'daily life and friendly small talk'
};

// Zero-cost policy: only models whose Vercel AI Gateway pages explicitly mark
// input/output as Free are allowed here. There is no paid fallback.
const FREE_MODELS = [
  { id: 'nvidia/nemotron-3.5-lightning-free', label: 'Nemotron 3.5 Lightning Free' },
  { id: 'inclusionai/ling-3.0-flash-fin-free', label: 'Ling 3.0 Flash Fin Free' },
  { id: 'poolside/laguna-s-2.1-free', label: 'Laguna S 2.1 Free' }
];

function gatewayToken() {
  return process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN || '';
}

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

async function callGateway(model, messages, system) {
  const token = gatewayToken();
  if (!token) {
    const error = new Error('Vercel AI Gateway authentication is not available in this deployment.');
    error.code = 'gateway_auth_missing';
    throw error;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${token}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: model.id,
        messages: [{ role: 'system', content: system }, ...messages],
        temperature: 0.35,
        max_tokens: 220,
        stream: false
      })
    });

    if (!response.ok) {
      const error = new Error(`AI Gateway returned HTTP ${response.status}`);
      error.code = `gateway_http_${response.status}`;
      throw error;
    }

    const payload = await response.json();
    const raw = payload?.choices?.[0]?.message?.content;
    if (!raw) {
      const error = new Error('AI Gateway returned no message content.');
      error.code = 'gateway_empty_response';
      throw error;
    }

    return {
      ...parseCoachReply(raw),
      model: model.id,
      modelLabel: model.label,
      source: 'vercel-ai-gateway',
      freeOnly: true
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function askFreeModels(messages, system) {
  const failures = [];
  for (const model of FREE_MODELS) {
    try {
      return await callGateway(model, messages, system);
    } catch (error) {
      failures.push({ model: model.id, code: error?.code || error?.name || 'unknown_error' });
      console.warn(`Free AI model unavailable: ${model.id} (${error?.code || error?.name || 'unknown'})`);
    }
  }
  const error = new Error('All zero-cost AI models are unavailable.');
  error.code = 'all_free_models_unavailable';
  error.failures = failures;
  throw error;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  // Safe health check: booleans only, never returns tokens or secrets.
  if (req.method === 'GET') {
    res.status(200).json({
      ok: true,
      mode: 'zero-cost-only',
      authPresent: Boolean(gatewayToken()),
      oidcPresent: Boolean(process.env.VERCEL_OIDC_TOKEN),
      apiKeyPresent: Boolean(process.env.AI_GATEWAY_API_KEY),
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
    console.error('Zero-cost AI Coach unavailable:', error?.code || error?.name || 'unknown');
    res.status(503).json({
      error: 'free_ai_unavailable',
      fallback: 'local_coach',
      freeOnly: true,
      authPresent: Boolean(gatewayToken()),
      failures: Array.isArray(error?.failures) ? error.failures : []
    });
  }
}
