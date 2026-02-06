/**
 * Vercel Serverless Function: /api/lead
 *
 * Receives lead data from the site and forwards it to Telegram.
 * Secrets (bot token/chat id) are stored ONLY in Vercel Environment Variables.
 *
 * Required env:
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_CHAT_ID
 *
 * Optional env:
 *   ALLOWED_ORIGINS="https://buildmybot.ru,https://www.buildmybot.ru,https://buildmybot.online,https://www.buildmybot.online"
 *   RATE_LIMIT_SECONDS="45"
 */

const RATE_LIMIT_SECONDS = parseInt(process.env.RATE_LIMIT_SECONDS || "45", 10);

// Best-effort in-memory rate limit (works on warm instances)
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
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
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

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      res.statusCode = 405;
      return res.end("Method Not Allowed");
    }

    // Optional: Origin allowlist (recommended)
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
      res.statusCode = 429;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ ok: false, error: "rate_limit" }));
    }

    const body = req.body || {};
    const lang = (body.lang === "en") ? "en" : "ru";
    const name = (body.name || "").toString().trim().slice(0, 80);
    const telegram = (body.telegram || "").toString().trim();
    const categoryKey = (body.categoryKey || "").toString().trim();
    const categoryLabel = (body.categoryLabel || "").toString().trim().slice(0, 80);
    const description = (body.description || "").toString().trim().slice(0, 1200);

    // Honeypot (if you keep it on frontend)
    const website = (body.website || "").toString().trim();
    if (website) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ ok: true }));
    }

    // Validate telegram username
    if (!/^@[a-zA-Z0-9_]{4,31}$/.test(telegram)) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ ok: false, error: "bad_telegram" }));
    }

    // Validate category (allowlist)
    const allowedCats = new Set(["support","sales","booking","community","edu","ai","game","custom"]);
    if (!allowedCats.has(categoryKey)) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ ok: false, error: "bad_category" }));
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

    const tgRes = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: msg,
        parse_mode: "HTML",
        disable_web_page_preview: true
      })
    });

    if (!tgRes.ok) {
      const txt = await tgRes.text().catch(() => "");
      res.statusCode = 502;
      return res.end("Telegram API error: " + txt);
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ ok: true }));
  } catch (e) {
    res.statusCode = 500;
    return res.end("Server error");
  }
};
