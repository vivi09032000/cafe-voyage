const SUPABASE_URL = process.env.SUPABASE_URL || "https://dmymcnmsyhppwstpwmal.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const CATEGORIES = new Set(["suggestion", "bug", "new_cafe", "other"]);
const MAX_MESSAGE = 2000;

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

const clean = (value, max) => String(value || "").trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return send(res, 200, { ok: true });
  if (req.method !== "POST") return send(res, 405, { ok: false, error: "Method not allowed" });
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    return send(res, 500, { ok: false, error: "missing_service_role_key" });
  }

  const body = readBody(req);
  const category = clean(body.category, 40);
  if (!CATEGORIES.has(category)) return send(res, 400, { ok: false, error: "invalid_category" });

  const message = clean(body.message, MAX_MESSAGE + 1);
  if (!message) return send(res, 400, { ok: false, error: "missing_message" });
  if (message.length > MAX_MESSAGE) return send(res, 400, { ok: false, error: "message_too_long" });

  const email = clean(body.email, 200);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return send(res, 400, { ok: false, error: "invalid_email" });
  }

  const row = {
    category,
    message,
    email,
    lang: clean(body.lang, 10),
    country: clean(body.country, 40),
    region: clean(body.region, 80),
    page_url: clean(body.page_url, 500),
    user_agent: clean(req.headers?.["user-agent"], 300),
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    console.error(`feedback insert failed: ${response.status} ${await response.text()}`);
    return send(res, 502, { ok: false, error: "save_failed" });
  }

  return send(res, 200, { ok: true });
}
