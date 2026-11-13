import puppeteer from "puppeteer";
import { spawn } from "node:child_process";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("public");
const PAGE = "/zh-cn/features/jensen-huang/";
const OUT = "/opt/cursor/artifacts";
const PORT = 4173;
const forbidden = [
  "血书",
  "辞职信",
  "Kimberly",
  "Powell",
  "鲍威尔",
  "黄乐",
  "Alice Huang",
  "国会",
  "Tim Cook",
  "股价",
  "市值",
  "Wachtell",
  "layoutsubtree",
];

function startServer() {
  const child = spawn(
    "python3",
    ["-m", "http.server", String(PORT), "--bind", "127.0.0.1"],
    {
      cwd: ROOT,
      stdio: "ignore",
    }
  );
  return child;
}

async function waitForServer() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}${PAGE}`);
      if (res.ok) return;
    } catch (err) {
      await new Promise((r) => setTimeout(r, 150));
    }
  }
  throw new Error("local server did not start");
}

async function readMode(page) {
  return page.evaluate(() => {
    const root = document.getElementById("jh-root");
    const claim = document.getElementById("jh-claim");
    const canvas = document.getElementById("jh-canvas");
    const cta = document.querySelector(".jh-cta-link");
    const claimBox = claim.getBoundingClientRect();
    const canvasBox = canvas.getBoundingClientRect();
    return {
      mode: root.dataset.renderMode,
      apiContent: root.dataset.apiContent,
      apiDraw: root.dataset.apiDraw,
      geometry: root.dataset.geometry || "",
      status: document.getElementById("jh-status").textContent.trim(),
      claim: {
        width: claimBox.width,
        height: claimBox.height,
        top: claimBox.top,
        left: claimBox.left,
      },
      canvas: {
        hidden: canvas.hidden,
        width: canvas.width,
        height: canvas.height,
        clientWidth: canvas.clientWidth,
        clientHeight: canvas.clientHeight,
        top: canvasBox.top,
        left: canvasBox.left,
        right: canvasBox.right,
        bottom: canvasBox.bottom,
      },
      cta: cta.getAttribute("href"),
      bitmapScale: root.dataset.bitmapScale || "",
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      h1: document.querySelector(".jh h1").textContent,
    };
  });
}

const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const server = startServer();
const report = { chrome: "", checks: [], failures: [] };

function check(name, ok, detail) {
  report.checks.push({ name, ok, detail });
  if (!ok) report.failures.push(name + (detail ? `: ${detail}` : ""));
}

try {
  await mkdir(OUT, { recursive: true });
  const version = await browser.version();
  report.chrome = version;
  await waitForServer();

  const html = await readFile(
    path.join(ROOT, "zh-cn/features/jensen-huang/index.html"),
    "utf8"
  );
  const home = await readFile(path.join(ROOT, "zh-cn/index.html"), "utf8");
  check("home omits feature", !home.includes("黄仁勋走了"), "");
  check(
    "canonical",
    html.includes("https://maoxunxing.com/zh-cn/features/jensen-huang/"),
    ""
  );
  check("no base tag", !html.includes("<base "), "");
  check("no ads unit", !html.includes("adsense-container"), "");
  for (const word of forbidden) {
    check(`page omits ${word}`, !html.includes(word), "");
  }
  check(
    "tools cta",
    html.includes("href=/zh-cn/tools/") ||
      html.includes('href="/zh-cn/tools/"'),
    ""
  );

  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${PORT}${PAGE}`, {
    waitUntil: "networkidle0",
  });
  await new Promise((r) => setTimeout(r, 1200));
  const desktop = await readMode(page);
  report.desktop = desktop;
  report.pageErrors = errors;
  await page.screenshot({
    path: path.join(OUT, "huang-desktop.png"),
    fullPage: true,
  });
  check("desktop status present", desktop.status.length > 20, desktop.status);
  check(
    "desktop no horizontal overflow",
    desktop.overflow <= 1,
    String(desktop.overflow)
  );
  check(
    "no page errors",
    errors.filter((item) => !item.includes("initMathJax")).length === 0,
    errors.join(" | ")
  );
  if (desktop.apiDraw === "yes" && desktop.apiContent === "drawable") {
    check(
      "native mode when API exists",
      desktop.mode === "native",
      desktop.mode + " " + desktop.status
    );
    check("geometry matches", desktop.geometry === "match", desktop.geometry);
    check(
      "status does not call DOM native",
      !desktop.status.includes("普通网页"),
      desktop.status
    );
  } else {
    check(
      "unsupported stays readable",
      desktop.mode === "dom" && desktop.h1.includes("黄仁勋"),
      desktop.mode
    );
    check(
      "status does not claim native",
      !desktop.status.includes("原生 HTML-in-Canvas"),
      desktop.status
    );
  }

  const ctaHref = await page.$eval(".jh-cta-link", (el) =>
    el.getAttribute("href")
  );
  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    page.click(".jh-cta-link"),
  ]);
  check(
    "cta navigates to tools",
    page.url().includes("/zh-cn/tools/"),
    page.url() + " from " + ctaHref
  );
  await page.goto(`http://127.0.0.1:${PORT}${PAGE}`, {
    waitUntil: "networkidle0",
  });

  await page.setViewport({ width: 360, height: 780, deviceScaleFactor: 2 });
  await page.goto(`http://127.0.0.1:${PORT}${PAGE}`, {
    waitUntil: "networkidle0",
  });
  await new Promise((r) => setTimeout(r, 800));
  const mobile = await readMode(page);
  report.mobile = mobile;
  await page.screenshot({
    path: path.join(OUT, "huang-mobile.png"),
    fullPage: true,
  });
  const voices = await page.$("#scene-voices");
  await voices.screenshot({ path: path.join(OUT, "huang-voices.png") });
  check("mobile no overflow", mobile.overflow <= 1, String(mobile.overflow));
  check("mobile readable title", mobile.h1.includes("难补的是"), mobile.h1);
  check(
    "mobile bitmap matches device pixels",
    Number(mobile.bitmapScale || 0) >= 1.5,
    String(mobile.bitmapScale)
  );
  if (mobile.apiDraw === "yes") {
    check(
      "mobile native geometry",
      mobile.mode === "native" && mobile.geometry === "match",
      mobile.geometry
    );
  }

  const reduced = await browser.newPage();
  await reduced.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await reduced.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await reduced.goto(`http://127.0.0.1:${PORT}${PAGE}`, {
    waitUntil: "networkidle0",
  });
  await new Promise((r) => setTimeout(r, 400));
  const reducedMode = await readMode(reduced);
  report.reduced = reducedMode;
  const pauseHidden = await reduced.$eval("#jh-pause", (el) => el.hidden);
  check("reduced motion keeps text", reducedMode.h1.includes("黄仁勋"), "");
  check(
    "reduced motion hides pause when static or reduced",
    pauseHidden === true,
    String(pauseHidden)
  );
  await reduced.screenshot({
    path: path.join(OUT, "huang-reduced.png"),
    fullPage: false,
  });
  await reduced.close();

  const plain = await browser.newPage();
  await plain.setJavaScriptEnabled(false);
  await plain.setViewport({ width: 390, height: 844 });
  await plain.goto(`http://127.0.0.1:${PORT}${PAGE}`, {
    waitUntil: "domcontentloaded",
  });
  const plainText = await plain.$eval("h1", (el) => el.textContent);
  check("no-js still shows article", plainText.includes("黄仁勋"), plainText);
  await plain.screenshot({
    path: path.join(OUT, "huang-nojs.png"),
    fullPage: false,
  });
  await plain.close();

  const forced = await browser.newPage();
  await forced.setViewport({ width: 800, height: 700 });
  await forced.goto(`http://127.0.0.1:${PORT}${PAGE}?render=dom`, {
    waitUntil: "networkidle0",
  });
  const forcedMode = await readMode(forced);
  report.forcedDom = forcedMode;
  check("query forces dom", forcedMode.mode === "dom", forcedMode.mode);
  check(
    "forced dom not labeled native",
    !forcedMode.status.includes("drawElementImage"),
    forcedMode.status
  );
  await forced.screenshot({
    path: path.join(OUT, "huang-dom-mode.png"),
    fullPage: false,
  });
  await forced.close();
} finally {
  await writeFile(
    path.join(OUT, "huang-runtime.json"),
    JSON.stringify(report, null, 2)
  );
  await browser.close();
  server.kill();
}

if (report.failures.length) {
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}
console.log(
  JSON.stringify(
    {
      chrome: report.chrome,
      desktop: report.desktop,
      mobile: {
        mode: report.mobile.mode,
        geometry: report.mobile.geometry,
        overflow: report.mobile.overflow,
      },
    },
    null,
    2
  )
);
