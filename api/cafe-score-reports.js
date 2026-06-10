const SUPABASE_URL = process.env.SUPABASE_URL || "https://dmymcnmsyhppwstpwmal.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const SCORE_KEYS = ["wifi", "seat", "quiet", "tasty", "cheap", "music"];

function send(res, status, body) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(body);
}

function readBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

function normalizeScore(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  const clamped = Math.min(5, Math.max(1, number));
  return Math.round(clamped * 2) / 2;
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return send(res, 200, { ok: true });
  if (req.method !== "POST") return send(res, 405, { ok: false, error: "Method not allowed" });
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    return send(res, 200, { ok: false, error: "missing_service_role_key" });
  }

  const body = readBody(req);
  const cafeId = String(body.cafe_id || "").trim().slice(0, 160);
  if (!cafeId) return send(res, 400, { ok: false, error: "missing_cafe_id" });

  const row = {
    cafe_id: cafeId,
    cafe_name: String(body.cafe_name || "").trim().slice(0, 200),
    cafe_source: String(body.cafe_source || "").trim().slice(0, 80),
  };

  for (const key of SCORE_KEYS) {
    const score = normalizeScore(body[key]);
    if (score == null) return send(res, 400, { ok: false, error: `invalid_${key}` });
    row[key] = score;
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/cafe_score_reports`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    return send(res, 200, { ok: false, error: typeof data === "string" ? data : JSON.stringify(data) });
  }

  return send(res, 200, { ok: true, report: Array.isArray(data) ? data[0] : data });
}
