/**
 * Vercel Serverless Function: /api/lead
 * Forwards lead to Telegram without using fetch (uses https).
 */

const https = require("https");

const RATE_LIMIT_SECONDS = parseInt(process.env.RATE_LIMIT_SECONDS || "45", 10);
const lastHitByIp = globalThis.__lead_rl__ || new Map();
globalThis.__lead_rl__ = lastHitByIp;

function tooFast(ip) {
  const now = Date.now();
  const last = lastHitByIp.get(ip) || 0;
  if (now - last < RATE_LIMIT_SECONDS * 1000) return true;
  lastHitByIp.set(ip, now);
  return false;
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseAllowedOrigins() {
  const raw = (process.env.ALLOWED_ORIGINS || "").trim();
  if (!raw) return null;
  return raw.split(",").map(s => s.trim()).filter(Boolean);
}

function getClientIp(req) {
  const xf = (req.headers["x-forwarded-for"] || "").toString();
  if (xf) return xf.split(",")[0].trim();
  return (req.socket && req.socket.remoteAddress) ? req.socket.remoteAddress : "";
}

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  return res.end(JSON.stringify(obj));
}

function tgSendMessage(token, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);

    const req = https.request(
      {
        hostname: "api.telegram.org",
        path: `/bot${token}/sendMessage`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (resp) => {
        let body = "";
        resp.on("data", (chunk) => (body += chunk));
        resp.on("end", () => resolve({ ok: resp.statusCode >= 200 && resp.statusCode < 300, status: resp.statusCode, body }));
      }
    );

    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.statusCode = 405;
      return res.end("Method Not Allowed");
    }

    const allowed = parseAllowedOrigins();
    const origin = (req.headers.origin || "").toString();
    if (allowed && origin && !allowed.includes(origin)) {
      res.statusCode = 403;
      return res.end("Forbidden");
    }

    const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    if (!TOKEN || !CHAT_ID) {
      res.statusCode = 500;
      return res.end("Backend is not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Vercel env vars.");
    }

    const ip = getClientIp(req);
    if (ip && tooFast(ip)) {
      return json(res, 429, { ok: false, error: "rate_limit" });
    }

    // body может прийти строкой или объектом
    let body = req.body || {};
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    body = body || {};

    const lang = (body.lang === "en") ? "en" : "ru";
    const name = String(body.name || "").trim().slice(0, 80);
    const telegram = String(body.telegram || "").trim();

    const categoryKey = String(body.categoryKey || body.category_key || "").trim();
    const categoryLabel = String(body.categoryLabel || body.category_label || "").trim();
    const description = String(body.description || "").trim().slice(0, 1200);

    const website = String(body.website || "").trim();
    if (website) return json(res, 200, { ok: true });

    if (!/^@[a-zA-Z0-9_]{4,31}$/.test(telegram)) {
      return json(res, 400, { ok: false, error: "bad_telegram" });
    }

    const allowedCats = new Set(["support","sales","booking","community","edu","ai","game","custom"]);
    if (!allowedCats.has(categoryKey)) {
      return json(res, 400, { ok: false, error: "bad_category" });
    }

    const header = (lang === "en") ? "🆕 New bot request" : "🆕 Новая заявка на бота";
    const nLabel = (lang === "en") ? "Name" : "Имя";
    const cLabel = (lang === "en") ? "Category" : "Категория";
    const dLabel = (lang === "en") ? "Description" : "Описание";
    const note = (lang === "en")
      ? "⚠️ Website prices are estimates. Final quote after the brief."
      : "⚠️ Цены на сайте ориентировочные. Итог — после брифа.";

    const msg =
`<b>${header}</b>

<b>👤 ${nLabel}:</b> ${escapeHtml(name || "—")}
<b>🔗 Telegram:</b> ${escapeHtml(telegram)}
<b>🤖 ${cLabel}:</b> ${escapeHtml(categoryLabel || categoryKey)} <i>(${escapeHtml(categoryKey)})</i>

<b>📝 ${dLabel}:</b>
${escapeHtml(description || "—")}

<i>${note}</i>`;

    const tg = await tgSendMessage(TOKEN, {
      chat_id: CHAT_ID,
      text: msg,
      parse_mode: "HTML",
      disable_web_page_preview: true
    });

    if (!tg.ok) {
      // вернём часть ответа Telegram для диагностики
      return json(res, 502, { ok: false, error: "telegram_error", details: String(tg.body || "").slice(0, 300) });
    }

    return json(res, 200, { ok: true });
  } catch (e) {
    // Важно: лог в Vercel
    console.error("Lead API error:", e);
    res.statusCode = 500;
    return res.end("Server error");
  }
};
