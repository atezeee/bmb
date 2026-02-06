# BuildMyBot — Deploy on Vercel (RU + EN) + Leads to Telegram

This project is ready for Vercel:
- Static site (HTML/CSS/JS) in the project root
- Serverless endpoint `/api/lead` sends заявки to Telegram
- Bot token/chat id are stored ONLY in Vercel Environment Variables

## Where to put TOKEN and CHAT_ID
Vercel → Project → Settings → Environment Variables:

- TELEGRAM_BOT_TOKEN = token from BotFather
- TELEGRAM_CHAT_ID = chat id (your personal chat / group / channel)

Optional (recommended):
- ALLOWED_ORIGINS = https://buildmybot.ru,https://www.buildmybot.ru,https://buildmybot.online,https://www.buildmybot.online
- RATE_LIMIT_SECONDS = 45

## Local test
You can open `index.html` directly, but `/api/lead` will work only on Vercel.
For local backend testing use a simple Node server or deploy to Vercel first.

## Domain redirects
`vercel.json` enforces 301 redirects:
- buildmybot.online → buildmybot.ru
- www.buildmybot.online → buildmybot.ru
- www.buildmybot.ru → buildmybot.ru
