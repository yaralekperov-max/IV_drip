/**
 * Экспорт ЛК пациента в один самодостаточный HTML-файл.
 * Снимается с реально работающего приложения (не переписывается вручную),
 * поэтому соответствует текущему коду.
 */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:3000";
const OUT = process.env.OUT || "portal-demo.html";

const ROUTES = [
  ["home", "/portal", "Главная"],
  ["notifications", "/portal/notifications", "Уведомления"],
  ["booking", "/portal/booking", "Записаться"],
  ["visits", "/portal/visits", "Мои визиты"],
  ["analyses", "/portal/analyses", "Анализы"],
  ["payments", "/portal/payments", "Платежи"],
  ["documents", "/portal/documents", "Документы"],
  ["bonuses", "/portal/bonuses", "Бонусы"],
  ["support", "/portal/support", "Поддержка"],
  ["profile", "/portal/profile", "Профиль"],
  ["track", "/portal/track", "Отслеживание визита"],
];

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

// --- вход (dev-код показывается прямо в форме) ---
await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
await page.fill('input[type="tel"]', "+79161234502");
await page.click('button:has-text("Получить код")');
await page.waitForSelector("text=Демо", { timeout: 15000 });
const t = (await page.textContent("body")) ?? "";
const code = t.match(/код\s*(\d{4})/)?.[1];
if (!code) throw new Error("dev-код не найден");
await page.fill('input[inputmode="numeric"]', code);
await page.click('button:has-text("Войти")');
await page.waitForURL("**/portal", { timeout: 20000 });
console.log("вход выполнен");

// --- собираем CSS приложения и вшиваем шрифты как data-URI ---
const cssHrefs = await page.$$eval('link[rel="stylesheet"]', (els) => els.map((e) => e.getAttribute("href")));
let css = "";
for (const href of cssHrefs) {
  const url = href.startsWith("http") ? href : `${BASE}${href}`;
  const res = await fetch(url);
  css += (await res.text()) + "\n";
}
console.log("CSS собран:", cssHrefs.length, "файл(ов),", css.length, "симв.");

const fontUrls = [...new Set([...css.matchAll(/url\((\/_next\/static\/media\/[^)]+\.(?:woff2|woff))\)/g)].map((m) => m[1]))];
for (const u of fontUrls) {
  const res = await fetch(`${BASE}${u}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const mime = u.endsWith(".woff2") ? "font/woff2" : "font/woff";
  css = css.split(`url(${u})`).join(`url(data:${mime};base64,${buf.toString("base64")})`);
}
console.log("шрифтов вшито:", fontUrls.length);

// --- снимаем сайдбар один раз и контент каждого экрана в двух состояниях ---
async function grabMain() {
  return page.evaluate(() => {
    const main = document.querySelector("main");
    if (!main) return "";
    const clone = main.cloneNode(true);
    // убираем демо-панель и мобильную шапку — в экспорте они не нужны
    clone.querySelectorAll("main > div").forEach((d) => {
      const txt = d.textContent || "";
      if (txt.includes("Демо-состояния")) d.remove();
    });
    return clone.innerHTML;
  });
}

const screens = {};
for (const state of ["filled", "new"]) {
  await page.evaluate((s) => localStorage.setItem("vena_portal_demo_state", s), state);
  for (const [key, route] of ROUTES) {
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(450);
    screens[`${key}:${state}`] = await grabMain();
    if (state === "filled" && key === "home") {
      screens.__aside = await page.evaluate(() => document.querySelector("aside")?.outerHTML ?? "");
    }
  }
  console.log("состояние снято:", state);
}

await browser.close();

// --- сборка одного файла ---
const navJson = JSON.stringify(ROUTES.map(([k, r, title]) => ({ k, r, title })));
const screensJson = JSON.stringify(screens);

const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VENA — личный кабинет пациента (демо)</title>
<style>${css}</style>
<style>
  /* --- обвязка автономного демо --- */
  body { margin: 0; }
  #vena-root { position: relative; z-index: 1; display: flex; min-height: 100vh; }
  #vena-main { width: 100%; flex-grow: 1; padding: 20px; max-width: 1020px; }
  @media (min-width: 768px) { #vena-main { margin-left: 240px; width: calc(100% - 240px); padding: 28px 40px 60px; } }
  .vena-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 24px;
    padding: 10px 14px; background: #13241D; border: 1px dashed rgba(201,168,106,.18);
    border-radius: 12px; font-size: 12px; color: #A8B5AD; font-family: Inter, system-ui, sans-serif; }
  .vena-bar b { color: #C9A86A; }
  .vena-bar button { font-size: 12px; padding: 6px 12px; border: 1px solid rgba(242,239,232,.08);
    background: transparent; color: #A8B5AD; border-radius: 999px; cursor: pointer; font-family: inherit; }
  .vena-bar button.on { border-color: #C9A86A; color: #F2EFE8; }
  .vena-note { margin-left: auto; color: #6E7C73; }
  #vena-burger { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 16px;
    font-size: 22px; cursor: pointer; color: #F2EFE8; background: none; border: 0; }
  @media (min-width: 768px) { #vena-burger { display: none; } }
  aside { z-index: 50; }
  aside.vena-open { transform: translateX(0) !important; }
</style>
</head>
<body class="bg-bg text-ink antialiased">
<div class="ambient min-h-screen">
  <div id="vena-root">
    ${screens.__aside || ""}
    <main id="vena-main">
      <button id="vena-burger" aria-label="Меню">☰ <span style="font-family:Fraunces,Georgia,serif;letter-spacing:.22em;font-size:16px">VENA</span></button>
      <div class="vena-bar">
        <b>Демо:</b>
        <button data-state="filled" class="on">Активный пациент</button>
        <button data-state="new">Новый пациент (пустой ЛК)</button>
        <span class="vena-note">автономная копия · данные условные</span>
      </div>
      <div id="vena-screen"></div>
    </main>
  </div>
</div>
<script>
  const SCREENS = ${screensJson};
  const NAV = ${navJson};
  let state = "filled";
  let current = "home";

  function render() {
    const html = SCREENS[current + ":" + state] || SCREENS[current + ":filled"] || "";
    document.getElementById("vena-screen").innerHTML = html;
    document.querySelectorAll("#vena-root aside a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      const item = NAV.find((n) => n.r === href);
      const active = item && item.k === current;
      a.classList.toggle("bg-[rgba(201,168,106,0.1)]", !!active);
      a.classList.toggle("text-gold-light", !!active);
      a.classList.toggle("text-ink-muted", !active);
    });
    window.scrollTo(0, 0);
  }

  // переходы по сайдбару
  document.querySelectorAll("#vena-root aside a").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      const item = NAV.find((n) => n.r === href);
      if (!item) return;
      e.preventDefault();
      current = item.k;
      document.querySelector("aside").classList.remove("vena-open");
      render();
    });
  });

  // внутренние ссылки на экранах (например «Следить за прибытием»)
  document.getElementById("vena-screen").addEventListener("click", (e) => {
    const a = e.target.closest("a[href^='/portal']");
    if (!a) return;
    const item = NAV.find((n) => n.r === a.getAttribute("href"));
    if (!item) return;
    e.preventDefault();
    current = item.k;
    render();
  });

  // переключатель состояния
  document.querySelectorAll(".vena-bar button").forEach((b) => {
    b.addEventListener("click", () => {
      state = b.dataset.state;
      document.querySelectorAll(".vena-bar button").forEach((x) => x.classList.toggle("on", x === b));
      render();
    });
  });

  document.getElementById("vena-burger").addEventListener("click", () => {
    document.querySelector("aside").classList.toggle("vena-open");
  });

  render();
</script>
</body>
</html>`;

fs.writeFileSync(OUT, html, "utf8");
console.log("готово:", OUT, (html.length / 1024).toFixed(0) + " KB");
