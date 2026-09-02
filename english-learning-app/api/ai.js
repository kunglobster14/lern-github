import { generateText } from 'ai';

const SCENARIOS = {
  coffee: 'ordering food and drinks at a cafe',
  travel: 'travel, transportation, hotels, and asking for directions',
  work: 'simple workplace conversation',
  daily: 'daily life and friendly small talk'
};

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
    return {
      text: String(value?.text || '').trim().slice(0, 700),
      thai: String(value?.thai || '').trim().slice(0, 500)
    };
  } catch {
    return {
      text: text.slice(0, 700) || 'Good try! Can you tell me one more thing?',
      thai: 'ลองตอบต่ออีกหนึ่งประโยคสั้น ๆ ได้เลยครับ'
    };
  }
}

async function askFreeModel(messages, system) {
  const result = await generateText({
    model: 'poolside/laguna-s-2.1-free',
    system,
    messages,
    temperature: 0.45,
    maxOutputTokens: 220
  });
  return parseCoachReply(result.text);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
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
Keep each response short and useful: 1-3 simple English sentences, then ask one easy follow-up question.
If the learner makes an important English mistake, gently provide a corrected version without giving a long grammar lecture.
The learner may type Thai when stuck; help them express the same idea in simple English.
Return ONLY valid JSON in this exact shape: {"text":"English reply","thai":"short Thai explanation or correction"}.`;

    const reply = await askFreeModel(messages, system);
    res.status(200).json(reply);
  } catch (error) {
    console.error('Free AI Coach unavailable:', error);
    // Frontend automatically falls back to its local/offline coach.
    res.status(503).json({ error: 'free_ai_unavailable', fallback: 'local_coach' });
  }
}
