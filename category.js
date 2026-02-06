// Category page script
//
// This script powers individual category pages for TG Bot Studio.
// It handles language switching (RU / EN), theme switching (dark / light),
// and populates category content based on the category key specified on the
// <body> element via data-cat attribute. Each category page shares the same
// style and basic layout as the main landing page.

// Basic DOM helpers
function qs(sel, root = document){ return root.querySelector(sel); }
function qsa(sel, root = document){ return Array.from(root.querySelectorAll(sel)); }

// Retrieve saved language or fallback to RU
function getLang(){
  const saved = localStorage.getItem("tgbot_lang");
  return (saved === "en" || saved === "ru") ? saved : "ru";
}

// Internationalization data for category pages.
// We reuse the service titles, descriptions, bullets, prices and hints from the main SERVICES
// definitions so that the content remains consistent with the landing page. Each category
// also includes an "example" field to demonstrate a typical use case.
const CATEGORY_CONTENT = {
  ru: {
    support: {
      example: "бот поддержки отвечает на частые вопросы, сообщает статус заказа и принимает обращения клиентов."
    },
    sales: {
      example: "бот для продаж предлагает каталог продуктов, корзину, оформление заказа и оплату прямо в Telegram."
    },
    booking: {
      example: "бот бронирований позволяет клиентам выбрать дату и время, отправляет напоминания и принимает оплату."
    },
    community: {
      example: "комьюнити-бот приветствует новых участников, проверяет на спам и выдаёт роли."
    },
    edu: {
      example: "обучающий бот отправляет уроки, проверяет задания и показывает прогресс."
    },
    ai: {
      example: "AI‑ассистент отвечает на вопросы по базе знаний и переключает на оператора при необходимости."
    },
    game: {
      example: "игровой бот предлагает мини‑игры, начисляет баллы и показывает рейтинг."
    },
    custom: {
      example: "индивидуальный бот разрабатывается под уникальные сценарии и задачи."
    }
  },
  en: {
    support: {
      example: "The support bot answers frequent questions, provides order status updates and accepts customer tickets."
    },
    sales: {
      example: "A sales bot offers a product catalog, shopping cart, checkout and payments directly in Telegram."
    },
    booking: {
      example: "Booking bot allows clients to choose date and time, sends reminders and collects payments."
    },
    community: {
      example: "A community bot welcomes new members, checks for spam and assigns roles."
    },
    edu: {
      example: "Learning bot delivers lessons, grades quizzes and tracks progress."
    },
    ai: {
      example: "AI assistant answers questions using a knowledge base and hands off to an operator when needed."
    },
    game: {
      example: "Game bot offers mini‑games, awards points and displays leaderboards."
    },
    custom: {
      example: "Custom bot is tailored to unique workflows and business requirements."
    }
  }
};

// Core translation dictionary for static strings on category pages.
const I18N_CAT = {
  ru: {
    brand: { tag: "Telegram-боты под ключ" },
    nav: { services: "Категории", process: "Как работаем", faq: "FAQ", request: "Заявка", theme: "Тема" },
    footer: { tag: "Сделаем бота, который продаёт и помогает", copy: "©", rights: "Все права защищены.", top: "Наверх ↑" },
    exampleLabel: "Пример работы",
    back: "← Назад"
  },
  en: {
    brand: { tag: "Telegram bots turnkey" },
    nav: { services: "Categories", process: "How it works", faq: "FAQ", request: "Request", theme: "Theme" },
    footer: { tag: "We build bots that sell & support", copy: "©", rights: "All rights reserved.", top: "Back to top ↑" },
    exampleLabel: "Example",
    back: "← Back"
  }
};

// Copy of SERVICES object from main script (we only need to read, not modify)
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
      price:"3 000–7 000 ₽", hint:"проект"
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
      text:"Group moderation, welcomes, roles, anti‑spam, access control and useful commands.",
      bullets:["Anti‑spam/CAPTCHA","Roles/rules","Logs & reports"],
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
      text:"Quests, mini‑games, leaderboards, rewards, internal currency, events.",
      bullets:["Gameplay & progress","Seasons/events","Leaderboards"],
      price:"$78–$182", hint:"MVP"
    },
    { key:"custom", title:"Custom bot", icon:"assets/icon-custom.svg",
      text:"Complex logic, integrations, advanced flows, dashboards, reporting.",
      bullets:["Brief + spec","Architecture & security","Support & growth"],
      price:"$78–$182", hint:"project"
    }
  ]
};

// Apply translations and populate category content
function applyCategory(lang){
  // Update language indicator and HTML lang
  qs("#langTxt").textContent = lang.toUpperCase();
  document.documentElement.lang = lang;

  // Update brand tag
  const brandTag = qs(".brand__tag");
  if(brandTag) brandTag.textContent = I18N_CAT[lang].brand.tag;

  // Update navigation texts
  qsa(".nav__links a").forEach(a => {
    const key = a.getAttribute("data-i18n-nav");
    if(key && I18N_CAT[lang].nav[key]){
      a.textContent = I18N_CAT[lang].nav[key];
    }
  });
  // Update theme button text (if exists)
  const themeTxt = qs("#themeBtn .theme__text");
  if(themeTxt) themeTxt.textContent = I18N_CAT[lang].nav.theme;

  // Update footer texts
  const footerTag = qs(".footer .brand__tag");
  if(footerTag) footerTag.textContent = I18N_CAT[lang].footer.tag;
  const rights = qs(".footer [data-i18n-footer='rights']");
  if(rights) rights.textContent = I18N_CAT[lang].footer.rights;
  const top = qs(".footer [data-i18n-footer='top']");
  if(top) top.textContent = I18N_CAT[lang].footer.top;

  // Determine category key from body
  const catKey = document.body.dataset.cat;
  const svc = SERVICES[lang].find(s => s.key === catKey);
  if(!svc) return;

  // Populate category details
  const titleEl = qs("#catTitle");
  const descEl = qs("#catDesc");
  const bulletsEl = qs("#catBullets");
  const priceEl = qs("#catPrice");
  const pricePrefixEl = qs("#catPricePrefix");
  const hintEl = qs("#catPriceHint");
  const exampleLabelEl = qs("#exampleLabel");
  const exampleEl = qs("#catExample");
  const iconEl = qs("#catIcon");

  if(titleEl) titleEl.textContent = svc.title;
  if(descEl) descEl.textContent = svc.text;
  if(bulletsEl && svc.bullets){
    bulletsEl.innerHTML = svc.bullets.map(b => `<li>${b}</li>`).join("");
  }
  if(priceEl) priceEl.textContent = svc.price;
  if(pricePrefixEl) pricePrefixEl.textContent = lang === "ru" ? "от " : "from ";
  if(hintEl) hintEl.textContent = svc.hint;
  if(exampleLabelEl) exampleLabelEl.textContent = I18N_CAT[lang].exampleLabel;
  if(exampleEl) exampleEl.textContent = CATEGORY_CONTENT[lang][catKey].example;
  if(iconEl) iconEl.setAttribute("src", svc.icon);
}

// Theme toggling utility
function updateThemeIcon(){
  const isLight = document.body.classList.contains("light");
  const icon = qs("#themeBtn .theme__icon");
  if(icon) icon.textContent = isLight ? "☀" : "☾";
}

// Initialize category page
function initCategory(){
  const lang = getLang();
  applyCategory(lang);
  updateThemeIcon();

  // Theme button
  const themeBtn = qs("#themeBtn");
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    localStorage.setItem("tgbot_theme", isLight ? "light" : "dark");
    updateThemeIcon();
  });

  // Language button
  const langBtn = qs("#langBtn");
  langBtn.addEventListener("click", () => {
    const cur = getLang();
    const next = cur === "ru" ? "en" : "ru";
    localStorage.setItem("tgbot_lang", next);
    applyCategory(next);
  });

  // Burger nav (mobile)
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

  // Restore theme
  const savedTheme = localStorage.getItem("tgbot_theme");
  if(savedTheme === "light"){
    document.body.classList.add("light");
    updateThemeIcon();
  }

  // Set current year in footer if present
  const yearEl = qs("#year");
  if(yearEl) yearEl.textContent = new Date().getFullYear();
}

// Run init after DOM ready
document.addEventListener("DOMContentLoaded", initCategory);