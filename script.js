// ==============================
// TG Bot Studio — frontend logic
// ==============================
//
// Важно:
// Данные формы не отправляются напрямую в Telegram из браузера.
// Отправка идёт на ваш backend (например Vercel Serverless) по эндпоинту:
//   POST /api/lead
// Это безопаснее: токен бота хранится на сервере, а не на клиенте.

// ==============================
// i18n (RU / EN)
// ==============================
const I18N = {
  ru: {
    brand: { tag: "Telegram-боты под ключ" },
    nav: { services: "Категории", process: "Как работаем", faq: "FAQ", request: "Оставить заявку", theme: "Тема" },
    hero: {
      badge: "Быстро. Надёжно. Красиво.",
      title: "Разработка <span class=\"grad\">Telegram-ботов</span> для бизнеса и сервисов",
      subtitle: "Автоматизируем продажи, поддержку, бронирования и интеграции. Помогаем сформировать ТЗ, дизайн, тексты и логику — под ваш кейс.",
      cta: { primary: "Рассчитать стоимость", secondary: "Посмотреть категории" },
      stats: ["дней на MVP", "лишней бюрократии", "интеграций (API)"],
      note: "Цены ниже — ориентировочные. Итоговая стоимость зависит от логики, интеграций и сроков. После короткого созвона/переписки менеджер предложит точный план и смету."
    },
    chips: ["Оплата", "CRM", "AI", "Каталоги", "Поддержка"],
    services: {
      title: "Категории ботов",
      subtitle: "Ниже — самые популярные типы. Если у вас нестандартная задача — выбирайте «Индивидуальный бот».",
      cta: "Подробнее →",
      callout: {
        title: "Нужны интеграции?",
        text: "Подключаем оплату, CRM, Google Sheets, базы данных, вебхуки и внешние API. Добавим админ-панель, аналитику и уведомления.",
        rows: [
          ["Оплата", "ЮKassa / CloudPayments / Stripe"],
          ["CRM", "amoCRM / Bitrix / HubSpot"],
          ["Данные", "Sheets / Airtable / DB"],
          ["Авто-сообщения", "воронки / триггеры"]
        ]
      }
    },
    process: {
      title: "Как мы работаем",
      subtitle: "Прозрачные шаги, чтобы вы понимали результат на каждом этапе.",
      steps: [
        { n: "1", t: "Бриф", d: "Понимаем задачу, аудиторию и нужные сценарии." },
        { n: "2", t: "Прототип", d: "Собираем карту экранов/команд и согласуем логику." },
        { n: "3", t: "Разработка", d: "Делаем MVP, подключаем интеграции, тестируем на реальных кейсах." },
        { n: "4", t: "Запуск", d: "Деплой, инструкции, поддержка и улучшения по метрикам." }
      ],
      strip: [
        ["Дизайн", "кнопки, тексты, UX"],
        ["Качество", "тесты и логирование"],
        ["Поддержка", "после запуска"],
        ["Сроки", "по этапам"]
      ]
    },
    faq: {
      title: "FAQ",
      subtitle: "Ответы на вопросы, которые обычно задают перед стартом.",
      items: [
        {
          q: "Почему цены “от” и что влияет на стоимость?",
          a: "На цену влияют интеграции (оплата/CRM/база), сложность сценариев, количество ролей (админ/оператор/клиент), языки, админ-панель, аналитика и сроки. Поэтому мы даём ориентир и уточняем смету после брифа.",
          open: true
        },
        {
          q: "Можно ли сделать бот без сервера?",
          a: "Для простых сценариев возможно (через внешние платформы), но для стабильной работы и интеграций обычно нужен сервер. Мы подскажем оптимальный вариант под ваш бюджет и задачу."
        },
        {
          q: "Вы помогаете с текстами и структурой меню?",
          a: "Да. Мы можем предложить структуру диалогов, тексты кнопок, сообщения, тон общения и “человеческий” UX."
        },
        {
          q: "Что по поддержке после запуска?",
          a: "Есть варианты: фикс “включён” на N дней, либо абонентская поддержка. Обсуждаем после запуска и по потребности."
        }
      ]
    },
    cta: {
      title: "Оставьте заявку — менеджер напишет вам в Telegram",
      subtitle: "Укажите ваш username и тип бота. Можно добавить краткое описание — мы вернёмся с вопросами и предложением.",
      trust: ["ответ обычно в течение дня", "смета после брифа", "конфиденциальность"]
    },
    form: {
      name: { label: "Ваше имя", ph: "Например, Алекс" },
      tg: { label: "Telegram username", hint: "Формат: @username (латиница, цифры, _)" },
      cat: { label: "Категория", ph: "Выберите тип" },
      desc: { label: "Коротко о задаче", ph: "Например: каталог услуг + запись + напоминания" },
      submit: "Отправить заявку",
      fine: "Нажимая “Отправить”, вы соглашаетесь на обработку данных для связи. Мы не спамим.",
      security: "⚠️ Заявка отправляется через серверный эндпоинт <code>/api/lead</code>. На Vercel добавьте переменные окружения бота (токен хранится на сервере).",
      errors: {
        tgEmpty: "Укажите username (пример: @username)",
        tgBad: "Неверный формат. Разрешены латиница, цифры и _. Длина: 5–32.",
        cat: "Выберите категорию",
        captchaRequired: "Пройдите капчу и попробуйте снова.",
        captchaFailed: "Капча не пройдена. Обновите капчу и попробуйте ещё раз.",
        missingCreds: "Не настроено: проверьте /api/lead и переменные окружения на сервере",
        sent: "Заявка отправлена 🚀 Мы напишем вам в Telegram.",
        fail: "Ошибка отправки. Проверьте, что /api/lead работает и переменные окружения настроены."
      }
    },
    footer: { tag: "Сделаем бота, который продаёт и помогает", copy: "©", rights: "Все права защищены.", top: "Наверх ↑" }
  },

  en: {
    brand: { tag: "Telegram bots turnkey" },
    nav: { services: "Categories", process: "How it works", faq: "FAQ", request: "Request a quote", theme: "Theme" },
    hero: {
      badge: "Fast. Reliable. Beautiful.",
      title: "<span class=\"grad\">Telegram bot</span> development for businesses & services",
      subtitle: "We automate sales, support, bookings and integrations. We help with scope, UX, copy and logic — tailored to your case.",
      cta: { primary: "Get an estimate", secondary: "See categories" },
      stats: ["days to MVP", "extra bureaucracy", "integrations (API)"],
      note: "Prices below are estimates. Final cost depends on logic, integrations and timeline. After a short chat our manager will propose a clear plan and a fixed quote."
    },
    chips: ["Payments", "CRM", "AI", "Catalogs", "Support"],
    services: {
      title: "Bot categories",
      subtitle: "Popular types below. If your task is unique — choose “Custom bot”.",
      cta: "Details →",
      callout: {
        title: "Need integrations?",
        text: "We connect payments, CRM, Google Sheets, databases, webhooks and external APIs. We can add an admin panel, analytics and notifications.",
        rows: [
          ["Payments", "Stripe / PayPal / YooKassa"],
          ["CRM", "HubSpot / Bitrix / amoCRM"],
          ["Data", "Sheets / Airtable / DB"],
          ["Automations", "funnels / triggers"]
        ]
      }
    },
    process: {
      title: "How we work",
      subtitle: "Clear steps so you always know what you get at each stage.",
      steps: [
        { n: "1", t: "Brief", d: "We clarify goals, audience and required scenarios." },
        { n: "2", t: "Prototype", d: "We map flows/screens and agree on bot logic." },
        { n: "3", t: "Build", d: "We deliver MVP, connect integrations, test real cases." },
        { n: "4", t: "Launch", d: "Deployment, handover, support and iterative improvements." }
      ],
      strip: [
        ["UX & Copy", "buttons, texts, UX"],
        ["Quality", "tests & logging"],
        ["Support", "post-launch"],
        ["Timeline", "by milestones"]
      ]
    },
    faq: {
      title: "FAQ",
      subtitle: "Answers to common questions before we start.",
      items: [
        {
          q: "Why “starting at” pricing and what affects the cost?",
          a: "Cost depends on integrations (payments/CRM/database), flow complexity, roles (admin/operator/client), languages, admin panel, analytics and timeline. We provide estimates and confirm a fixed quote after a brief.",
          open: true
        },
        {
          q: "Can a bot work without a server?",
          a: "For simple cases — sometimes (via platforms). For stability and integrations, a server is usually needed. We’ll recommend the best option for your budget."
        },
        {
          q: "Do you help with copy and menu structure?",
          a: "Yes. We can propose dialog structure, button texts, messages, tone of voice and a “human” UX."
        },
        {
          q: "What about support after launch?",
          a: "Options: a fixed included period or a monthly support plan. We’ll choose what fits your needs."
        }
      ]
    },
    cta: {
      title: "Send a request — our manager will message you on Telegram",
      subtitle: "Leave your Telegram username and bot type. Add a short description — we’ll follow up with questions and a proposal.",
      trust: ["reply usually within 24h", "quote after brief", "confidential"]
    },
    form: {
      name: { label: "Your name", ph: "e.g., Alex" },
      tg: { label: "Telegram username", hint: "Format: @username (latin letters, digits, _)" },
      cat: { label: "Category", ph: "Select a type" },
      desc: { label: "Short description", ph: "e.g., catalog + booking + reminders" },
      submit: "Send request",
      fine: "By clicking “Send”, you agree to data processing for contacting you. No spam.",
      security: "⚠️ The form sends data via the server endpoint <code>/api/lead</code>. Configure bot secrets in your hosting environment (token stays on the server).",
      errors: {
        tgEmpty: "Please enter your username (example: @username)",
        tgBad: "Invalid format. Use latin letters, digits and _. Length: 5–32.",
        cat: "Please choose a category",
        captchaRequired: "Please complete the captcha and try again.",
        captchaFailed: "Captcha failed. Please refresh the captcha and try again.",
        missingCreds: "Not configured: check /api/lead and server environment variables",
        sent: "Request sent 🚀 We'll message you on Telegram.",
        fail: "Send failed. Check that /api/lead works and server environment variables are configured."
      }
    },
    footer: { tag: "We build bots that sell & support", copy: "©", rights: "All rights reserved.", top: "Back to top ↑" }
  }
};

// Services data (titles, bullets, prices in RUB / USD)
const SERVICES = {
  ru: [
    { key:"support", title:"Бот поддержки", icon:"assets/icon-support.svg",
      text:"Разгружает менеджеров: FAQ, статусы заказов, приём обращений, быстрые ответы, эскалация.",
      bullets:["Меню + сценарии","Сбор заявок и теги","Передача оператору"],
      price:"3 000–7 000 ₽", hint:"MVP"
    },
    { key:"sales", title:"Бот для продаж", icon:"assets/icon-sales.svg",
      text:"Витрина в Telegram: каталог, корзина, промокоды, оплата, уведомления и автоворонки.",
      bullets:["Каталог/услуги","Квалификация лидов","Интеграции (CRM/Sheets)"],
      price:"3 000–7 000 ₽", hint:"MVP"
    },
    { key:"booking", title:"Бот бронирований", icon:"assets/icon-booking.svg",
      text:"Запись на услуги, слоты времени, напоминания, отмены/перенос, подтверждения.",
      bullets:["Календарь/слоты","Напоминания","Оплата/предоплата"],
      price:"3 000–7 000 ₽", hint:"MVP"
    },
    { key:"community", title:"Комьюнити-бот", icon:"assets/icon-community.svg",
      text:"Модерация групп, приветствия, роли, антиспам, выдача доступов и полезные команды.",
      bullets:["Антиспам/капча","Роли/правила","Логи и отчёты"],
      price:"3 000–7 000 ₽", hint:"MVP"
    },
    { key:"edu", title:"Обучающий бот", icon:"assets/icon-edu.svg",
      text:"Уроки, тесты, прогресс, выдача материалов, домашние задания, напоминания.",
      bullets:["Уроки + квизы","Личный прогресс","Платный доступ"],
      price:"3 000–7 000 ₽", hint:"MVP"
    },
    { key:"ai", title:"AI-ассистент", icon:"assets/icon-ai.svg",
      text:"Помощник для клиентов/сотрудников: ответы по базе знаний, сценарии, генерация текстов.",
      bullets:["База знаний","Режим «оператор»","Контроль тональности"],
      price:"3 000–7 000 ₽", hint:"MVP"
    },
    { key:"game", title:"Игровой бот", icon:"assets/icon-game.svg",
      text:"Квесты, мини-игры, рейтинги, награды, внутренняя «валюта», события.",
      bullets:["Геймплей и прогресс","Сезоны/ивенты","Рейтинги"],
      price:"3 000–7 000 ₽", hint:"MVP"
    },
    { key:"custom", title:"Индивидуальный бот", icon:"assets/icon-custom.svg",
      text:"Нестандартная логика, интеграции, сложные сценарии, личные кабинеты, отчёты.",
      bullets:["Бриф + ТЗ","Архитектура и безопасность","Поддержка и развитие"],
      price:"3 000–7 000 ₽", hint:"проект", accent:true
    }
  ],
  en: [
    { key:"support", title:"Support bot", icon:"assets/icon-support.svg",
      text:"Reduce workload: FAQ, order status, tickets, quick replies, escalation to a human.",
      bullets:["Menu + flows","Lead/ticket capture","Handoff to operator"],
      price:"$78–$182", hint:"MVP"
    },
    { key:"sales", title:"Sales bot", icon:"assets/icon-sales.svg",
      text:"Telegram storefront: catalog, cart, promo codes, payments, notifications and funnels.",
      bullets:["Catalog/services","Lead qualification","Integrations (CRM/Sheets)"],
      price:"$78–$182", hint:"MVP"
    },
    { key:"booking", title:"Booking bot", icon:"assets/icon-booking.svg",
      text:"Appointments, time slots, reminders, cancel/reschedule, confirmations.",
      bullets:["Calendar/slots","Reminders","Payment/deposit"],
      price:"$78–$182", hint:"MVP"
    },
    { key:"community", title:"Community bot", icon:"assets/icon-community.svg",
      text:"Group moderation, welcomes, roles, anti-spam, access control and useful commands.",
      bullets:["Anti-spam/CAPTCHA","Roles/rules","Logs & reports"],
      price:"$78–$182", hint:"MVP"
    },
    { key:"edu", title:"Learning bot", icon:"assets/icon-edu.svg",
      text:"Lessons, quizzes, progress tracking, content delivery, assignments and reminders.",
      bullets:["Lessons + quizzes","Personal progress","Paid access"],
      price:"$78–$182", hint:"MVP"
    },
    { key:"ai", title:"AI assistant", icon:"assets/icon-ai.svg",
      text:"Customer/staff helper: knowledge base Q&A, flows, content generation.",
      bullets:["Knowledge base","Operator mode","Tone control"],
      price:"$78–$182", hint:"MVP"
    },
    { key:"game", title:"Game bot", icon:"assets/icon-game.svg",
      text:"Quests, mini-games, leaderboards, rewards, internal currency, events.",
      bullets:["Gameplay & progress","Seasons/events","Leaderboards"],
      price:"$78–$182", hint:"MVP"
    },
    { key:"custom", title:"Custom bot", icon:"assets/icon-custom.svg",
      text:"Complex logic, integrations, advanced flows, dashboards, reporting.",
      bullets:["Brief + spec","Architecture & security","Support & growth"],
      price:"$78–$182", hint:"project", accent:true
    }
  ]
};

// ==============================
// DOM helpers
// ==============================
function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

function escapeHtml(str){
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function deepGet(obj, key){
  const parts = key.split(".");
  let cur = obj;
  for(const p of parts){
    cur = cur?.[p];
  }
  return cur;
}

function getLang(){
  const saved = localStorage.getItem("tgbot_lang");
  return (saved === "en" || saved === "ru") ? saved : "ru";
}

// ==============================
// Reveal animations (supports dynamic content)
// ==============================
let io = null;
function setupRevealObserver(){
  if(io) return;
  io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add("show");
        io.unobserve(e.target);
      }
    });
  }, {threshold: .14});
}

function revealObserveNew(){
  setupRevealObserver();
  qsa(".reveal:not(.show)").forEach(el => io.observe(el));
}

// ==============================
// Render sections (services / process / faq)
// ==============================
function renderServices(lang){
  const wrap = qs("#servicesCards");
  wrap.innerHTML = "";

  SERVICES[lang].forEach(s => {
    const card = document.createElement("article");
    card.className = `card reveal ${s.accent ? "card--accent" : ""}`;

    const pricePrefix = lang === "ru" ? "от " : "from ";
    card.innerHTML = `
      <div class="card__icon"><img src="${s.icon}" alt=""></div>
      <h3 class="card__title">${escapeHtml(s.title)}</h3>
      <p class="card__text">${escapeHtml(s.text)}</p>
      <ul class="card__list">
        ${s.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}
      </ul>
      <div class="card__foot">
        <div class="price">
          <span class="price__from">${escapeHtml(pricePrefix)}</span>${escapeHtml(s.price)}
          <span class="price__hint">${escapeHtml(s.hint)}</span>
        </div>
        <a class="link" href="${escapeHtml(s.key)}.html">${escapeHtml(I18N[lang].services.cta)}</a>
      </div>
    `;
    wrap.appendChild(card);
  });

  const c = I18N[lang].services.callout;
  const callout = qs("#integrationsCallout");
  callout.className = "callout reveal";
  callout.innerHTML = `
    <div class="callout__left">
      <h3 class="callout__title">${escapeHtml(c.title)}</h3>
      <p class="callout__text">${escapeHtml(c.text)}</p>
    </div>
    <div class="callout__right">
      <div class="mini">
        ${c.rows.map(r => `
          <div class="mini__row"><span>${escapeHtml(r[0])}</span><span class="mini__tag">${escapeHtml(r[1])}</span></div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderProcess(lang){
  const stepsWrap = qs("#processSteps");
  const stripWrap = qs("#processStrip");
  stepsWrap.innerHTML = "";
  stripWrap.innerHTML = "";

  I18N[lang].process.steps.forEach(s => {
    const div = document.createElement("div");
    div.className = "step reveal";
    div.innerHTML = `
      <div class="step__n">${escapeHtml(s.n)}</div>
      <h3 class="step__t">${escapeHtml(s.t)}</h3>
      <p class="step__d">${escapeHtml(s.d)}</p>
    `;
    stepsWrap.appendChild(div);
  });

  I18N[lang].process.strip.forEach(it => {
    const div = document.createElement("div");
    div.className = "strip__item";
    div.innerHTML = `
      <div class="strip__k">${escapeHtml(it[0])}</div>
      <div class="strip__v">${escapeHtml(it[1])}</div>
    `;
    stripWrap.appendChild(div);
  });

  stripWrap.classList.add("reveal");
}

function renderFAQ(lang){
  const faq = qs("#faqList");
  faq.innerHTML = "";
  I18N[lang].faq.items.forEach(item => {
    const det = document.createElement("details");
    det.className = "faq__item reveal";
    if(item.open) det.setAttribute("open", "open");
    det.innerHTML = `
      <summary>${escapeHtml(item.q)}</summary>
      <div class="faq__body">${escapeHtml(item.a)}</div>
    `;
    faq.appendChild(det);
  });
}

// ==============================
// Custom select (dark dropdown)
// ==============================
function openSelect(sel){
  qsa(".select.open").forEach(s => { if(s !== sel) closeSelect(s); });
  sel.classList.add("open");
  const btn = sel.querySelector(".select__btn");
  btn?.setAttribute("aria-expanded", "true");
  sel.querySelector(".select__list")?.focus();
}

function closeSelect(sel){
  sel.classList.remove("open");
  const btn = sel.querySelector(".select__btn");
  btn?.setAttribute("aria-expanded", "false");
}

document.addEventListener("click", (e) => {
  qsa(".select.open").forEach(sel => {
    if(!sel.contains(e.target)) closeSelect(sel);
  });
});

function buildSelect(rootId, options, hiddenId, valueId, onChange){
  const root = qs(rootId);
  const btn = qs(rootId + " .select__btn");
  const list = qs(rootId + " .select__list");
  const hidden = qs(hiddenId);
  const valueEl = qs(valueId);

  list.innerHTML = "";

  options.forEach(opt => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "select__opt";
    b.setAttribute("role", "option");
    b.dataset.value = opt.value;
    b.textContent = opt.label;

    b.addEventListener("click", () => {
      hidden.value = opt.value;
      valueEl.textContent = opt.label;
      markSelected(rootId, opt.value);
      onChange?.(opt.value, opt.label);
      closeSelect(root);
    });

    list.appendChild(b);
  });

  btn.addEventListener("click", () => {
    if(root.classList.contains("open")) closeSelect(root);
    else openSelect(root);
  });

  list.addEventListener("keydown", (e) => {
    const opts = qsa(".select__opt", list);
    const idx = opts.findIndex(x => x === document.activeElement);

    if(e.key === "Escape"){
      e.preventDefault();
      closeSelect(root);
      btn.focus();
    }
    if(e.key === "ArrowDown"){
      e.preventDefault();
      (opts[Math.min(idx + 1, opts.length - 1)] || opts[0])?.focus();
    }
    if(e.key === "ArrowUp"){
      e.preventDefault();
      (opts[Math.max(idx - 1, 0)] || opts[0])?.focus();
    }
    if(e.key === "Enter"){
      e.preventDefault();
      const el = document.activeElement;
      if(el && el.classList.contains("select__opt")) el.click();
    }
  });

  markSelected(rootId, hidden.value || "");
}

function markSelected(rootId, value){
  qsa(rootId + " .select__opt").forEach(btn => {
    const isSel = btn.dataset.value === value;
    btn.setAttribute("aria-selected", isSel ? "true" : "false");
  });
}

function rebuildCategorySelect(lang){
  const oldRoot = qs("#categorySelect");
  const parent = oldRoot.parentElement;

  const currentKey = qs("#category").value || "";

  const clone = oldRoot.cloneNode(true);
  parent.replaceChild(clone, oldRoot);

  qs("#category").value = currentKey;

  const options = SERVICES[lang].map(s => ({ value: s.key, label: s.title }));

  buildSelect("#categorySelect", options, "#category", "#categoryValue", () => validateCategory(lang));

  const exists = SERVICES[lang].some(s => s.key === currentKey);
  if(!exists){
    qs("#category").value = "";
  }

  if(!qs("#category").value){
    qs("#categoryValue").textContent = I18N[lang].form.cat.ph;
    markSelected("#categorySelect", "");
  }
}

// ==============================
// Form validation + send
// ==============================
const form = qs("#requestForm");
const tgInput = qs("#telegram");
const tgError = qs("#tgError");
const catError = qs("#catError");
const comment = qs("#comment");
const count = qs("#count");
const toast = qs("#toast");

qs("#year").textContent = new Date().getFullYear();

comment.addEventListener("input", () => {
  count.textContent = String(comment.value.length);
});

function showToast(text, ok=true){
  toast.style.display = "block";
  toast.style.borderColor = ok ? "rgba(52,211,153,.25)" : "rgba(251,113,133,.30)";
  toast.style.background = ok ? "rgba(52,211,153,.12)" : "rgba(251,113,133,.12)";
  toast.textContent = text;
  setTimeout(() => { toast.style.display = "none"; }, 4500);
}

// Telegram username: @ + letters/digits/_; 5–32 chars total
const TG_REGEX = /^@[a-zA-Z0-9_]{4,31}$/;

function normalizeUsername(value){
  let v = (value || "").trim();
  if(v && !v.startsWith("@")) v = "@" + v;
  return v;
}

function validateTelegram(lang){
  const err = I18N[lang].form.errors;
  const v = normalizeUsername(tgInput.value);
  tgInput.value = v;

  if(!v){
    tgError.textContent = err.tgEmpty;
    tgInput.setAttribute("aria-invalid", "true");
    return false;
  }
  if(!TG_REGEX.test(v)){
    tgError.textContent = err.tgBad;
    tgInput.setAttribute("aria-invalid", "true");
    return false;
  }
  tgError.textContent = "";
  tgInput.removeAttribute("aria-invalid");
  return true;
}

function validateCategory(lang){
  const err = I18N[lang].form.errors;
  const hidden = qs("#category");
  if(!hidden.value){
    catError.textContent = err.cat;
    hidden.setAttribute("aria-invalid", "true");
    return false;
  }
  catError.textContent = "";
  hidden.removeAttribute("aria-invalid");
  return true;
}

tgInput.addEventListener("blur", () => validateTelegram(getLang()));
tgInput.addEventListener("input", () => {
  const v = normalizeUsername(tgInput.value);
  if(v.length < 2) { tgError.textContent = ""; return; }
  if(TG_REGEX.test(v)) tgError.textContent = "";
});

function getHCaptchaToken(){
  // hCaptcha добавляет скрытое поле name="h-captcha-response"
  return document.querySelector('[name="h-captcha-response"]')?.value || "";
}

function resetHCaptcha(){
  if(window.hcaptcha && typeof window.hcaptcha.reset === "function"){
    try { window.hcaptcha.reset(); } catch {}
  }
}

async function sendToServer(data){
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });

  let payload = null;
  try { payload = await res.json(); } catch { payload = null; }

  if(!res.ok){
    // backend использует поле "error"
    const reason = payload?.error || "server_error";
    const err = new Error("Server error");
    err.reason = reason;
    err.payload = payload;
    throw err;
  }

  if(payload && payload.ok === false){
    const err = new Error("Lead rejected");
    err.reason = payload.error || "rejected";
    err.payload = payload;
    throw err;
  }

  return payload || { ok: true };
}

// ==============================
// Bind pick links (cards → form)
// ==============================
function bindPickLinks(){
  qsa("[data-pick]").forEach(a => {
    a.addEventListener("click", () => {
      const key = a.getAttribute("data-pick");
      const lang = getLang();
      const svc = SERVICES[lang].find(x => x.key === key);
      if(!svc) return;

      qs("#category").value = svc.key;
      qs("#categoryValue").textContent = svc.title;
      markSelected("#categorySelect", svc.key);
      validateCategory(lang);
    });
  });
}

// ==============================
// Theme + language + mobile nav
// ==============================
const burger = qs("#burger");
const navLinks = qs("#navLinks");

burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(open));
});
qsa("#navLinks a").forEach(a => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  });
});

const themeBtn = qs("#themeBtn");
const savedTheme = localStorage.getItem("tgbot_theme");
if(savedTheme === "light") document.body.classList.add("light");

function updateThemeIcon(){
  const isLight = document.body.classList.contains("light");
  const icon = qs("#themeBtn .theme__icon");
  if(icon) icon.textContent = isLight ? "☀" : "☾";
}
updateThemeIcon();

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("tgbot_theme", isLight ? "light" : "dark");
  updateThemeIcon();
});

const langBtn = qs("#langBtn");
langBtn.addEventListener("click", () => {
  const cur = getLang();
  const next = cur === "ru" ? "en" : "ru";
  applyI18n(next);
});

// ==============================
// Apply i18n to static text + render dynamic sections
// ==============================
function applyI18n(lang){
  const dict = I18N[lang];

  qsa("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = deepGet(dict, key);
    if(typeof val === "string") el.textContent = val;
  });

  qsa("[data-i18n-html]").forEach(el => {
    const key = el.getAttribute("data-i18n-html");
    const val = deepGet(dict, key);
    if(typeof val === "string") el.innerHTML = val;
  });

  qsa("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    const val = deepGet(dict, key);
    if(typeof val === "string") el.setAttribute("placeholder", val);
  });

  const statEls = qsa(".hero__stats .stat__v");
  dict.hero.stats.forEach((t, i) => { if(statEls[i]) statEls[i].textContent = t; });

  const chipEls = qsa(".chips .chip");
  dict.chips.forEach((t, i) => { if(chipEls[i]) chipEls[i].textContent = t; });

  const trustEls = qsa(".trust .trust__item span[data-i18n^='cta.trust']");
  dict.cta.trust.forEach((t, i) => { if(trustEls[i]) trustEls[i].textContent = t; });

  renderServices(lang);
  renderProcess(lang);
  renderFAQ(lang);

  bindPickLinks();
  rebuildCategorySelect(lang);

  if(!qs("#category").value) qs("#categoryValue").textContent = dict.form.cat.ph;

  qs("#langTxt").textContent = lang.toUpperCase();
  document.documentElement.lang = lang;
  localStorage.setItem("tgbot_lang", lang);

  tgError.textContent = "";
  catError.textContent = "";

  revealObserveNew();
}

// ==============================
// Init
// ==============================
(function init(){
  const lang = getLang();
  applyI18n(lang);
})();

// ==============================
// Submit handler
// ==============================
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const lang = getLang();
  const err = I18N[lang].form.errors;

  // honeypot
  const hp = qs("#website");
  if(hp && hp.value.trim()){
    showToast(err.sent, true);
    return;
  }

  const okTg = validateTelegram(lang);
  const okCat = validateCategory(lang);
  if(!okTg || !okCat) return;

  // ✅ hCaptcha token
  const captchaToken = getHCaptchaToken();
  if(!captchaToken){
    showToast(err.captchaRequired, false);
    return;
  }

  const name = qs("#name").value.trim();
  const telegram = normalizeUsername(tgInput.value);
  const catKey = qs("#category").value;
  const svc = SERVICES[lang].find(x => x.key === catKey);
  const catLabel = svc ? svc.title : catKey;
  const text = comment.value.trim();

  try{
    await sendToServer({
      lang,
      name: name || "",
      telegram,
      category_key: catKey,
      category_label: catLabel,
      description: text || "",
      captcha_token: captchaToken
    });

    showToast(err.sent, true);
    form.reset();
    count.textContent = "0";

    qs("#category").value = "";
    qs("#categoryValue").textContent = I18N[lang].form.cat.ph;
    markSelected("#categorySelect", "");

  }catch(ex){
    console.error(ex);

    // точные причины с бэка
    if(ex?.reason === "backend_not_configured" || ex?.reason === "captcha_not_configured"){
      showToast(err.missingCreds, false);
      return;
    }
    if(ex?.reason === "captcha_required"){
      showToast(err.captchaRequired, false);
      return;
    }
    if(ex?.reason === "captcha_failed"){
      showToast(err.captchaFailed, false);
      return;
    }

    showToast(err.fail, false);
  } finally {
    // сброс капчи, чтобы можно было отправить ещё раз
    resetHCaptcha();
  }
});
