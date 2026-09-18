import { route, start, go, path } from "./router.js";
import { load, getActiveProfile, isStorageBroken } from "./store.js";
import { toast } from "./util/dom.js";
import * as tts from "./speech/tts.js";

import * as home from "./views/home.js";
import * as scenarioList from "./views/scenarios.js";
import * as scenarioPlay from "./views/scenario.js";
import * as result from "./views/result.js";
import * as profile from "./views/profile.js";
import * as settings from "./views/settings.js";
import * as collection from "./views/collection.js";
import * as family from "./views/family.js";
import * as phrasebook from "./views/phrasebook.js";

/* ---------- タブ ---------- */
const TABS = [
  { to: "/", ico: "🏝", label: "ホーム" },
  { to: "/scenarios", ico: "🗣", label: "練習" },
  { to: "/collection", ico: "🎁", label: "コレクション" },
  { to: "/family", ico: "👪", label: "家族" },
  { to: "/phrasebook", ico: "📖", label: "フレーズ" },
];

/** タブを出さない画面（会話に集中させる） */
const FULLSCREEN = ["/scenario/:id", "/welcome", "/profile/new"];
/** 戻るボタンを出す画面 */
const TITLES = {
  "/": { title: "ココイングリッシュ", back: false },
  "/scenarios": { title: "練習", back: false },
  "/scenario/:id": { title: "会話の練習", back: true },
  "/result/:id": { title: "けっか", back: false },
  "/collection": { title: "コレクション", back: false },
  "/family": { title: "家族", back: false },
  "/phrasebook": { title: "フレーズ帳", back: false },
  "/settings": { title: "設定", back: true },
  "/profiles": { title: "プロフィール", back: true },
  "/profile/new": { title: "家族を追加", back: true },
  "/welcome": { title: "ようこそ", back: false },
};

function buildTabs() {
  const nav = document.getElementById("tabbar");
  nav.innerHTML = TABS.map((t) => `
    <button class="tab" data-to="${t.to}">
      <span class="tab-ico" aria-hidden="true">${t.ico}</span>
      <span>${t.label}</span>
    </button>`).join("");
  nav.querySelectorAll(".tab").forEach((b) => {
    b.addEventListener("click", () => go(b.dataset.to));
  });
}

function syncChrome(pattern) {
  const meta = TITLES[pattern] || { title: "ココイングリッシュ", back: true };
  document.getElementById("appTitle").textContent = meta.title;
  document.getElementById("backBtn").hidden = !meta.back;

  const nav = document.getElementById("tabbar");
  nav.classList.toggle("is-hidden", FULLSCREEN.includes(pattern));
  const p = path();
  nav.querySelectorAll(".tab").forEach((b) => {
    const active = b.dataset.to === "/" ? p === "/" : p.startsWith(b.dataset.to);
    if (active) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  });

  const avatar = document.getElementById("profileBtn");
  const prof = getActiveProfile();
  if (prof) {
    avatar.hidden = false;
    avatar.style.background = prof.avatarColor;
    avatar.textContent = (prof.name || "?").slice(0, 1);
  } else {
    avatar.hidden = true;
  }
}

/** 画面遷移のたびに読み上げを止め、ヘッダ・タブを同期する */
function wrap(handler) {
  return async (view, params) => {
    tts.stop();
    await handler(view, params);
    syncChrome(currentPattern);
    if (isStorageBroken()) showStorageWarning(view);
  };
}

let currentPattern = "/";
function def(pattern, handler) {
  route(pattern, async (view, params) => {
    currentPattern = pattern;
    await wrap(handler)(view, params);
  });
}

function showStorageWarning(view) {
  if (view.querySelector(".warn-bar")) return;
  const bar = document.createElement("div");
  bar.className = "warn-bar";
  bar.textContent = "記録を保存できていません。プライベートブラウズを解除するか、空き容量を確認してください。";
  view.prepend(bar);
}

/* ---------- ルート定義 ---------- */
def("/", (v) => home.render(v));
def("/scenarios", (v) => scenarioList.render(v));
def("/scenario/:id", (v, p) => scenarioPlay.render(v, p));
def("/result/:id", (v, p) => result.render(v, p));
def("/collection", (v) => collection.render(v));
def("/family", (v) => family.render(v));
def("/phrasebook", (v) => phrasebook.render(v));
def("/settings", (v) => settings.render(v));
def("/profiles", (v) => profile.renderProfiles(v));
def("/profile/new", (v) => profile.renderNewProfile(v));
def("/welcome", (v) => profile.renderWelcome(v));

/* ---------- 起動 ---------- */
function boot() {
  load();
  tts.init();
  buildTabs();

  document.getElementById("backBtn").addEventListener("click", () => history.back());
  document.getElementById("profileBtn").addEventListener("click", () => go("/profiles"));

  // iOS: 最初のユーザー操作で読み上げを解錠する
  const unlockOnce = () => { tts.unlock(); document.removeEventListener("pointerdown", unlockOnce); };
  document.addEventListener("pointerdown", unlockOnce);

  window.addEventListener("store:error", (e) => toast(e.detail, 5000));
  registerServiceWorker();

  if (!getActiveProfile() && path() !== "/welcome") {
    location.replace("#/welcome");
  }
  start();
}

/**
 * オフラインで開けるようにする。
 * 新しい版が届いても勝手に入れ替えない（練習の途中で画面が作り直されると困る）。
 * 代わりに上部にバーを出し、押されたときだけ切り替える。
 */
function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (location.protocol !== "https:" && location.hostname !== "localhost") return;

  navigator.serviceWorker.register("./sw.js").then((reg) => {
    const offerUpdate = (worker) => {
      if (!worker) return;
      worker.addEventListener("statechange", () => {
        // controller がいる = すでに動いている版がある = これは「更新」
        if (worker.state === "installed" && navigator.serviceWorker.controller) showUpdateBar(worker);
      });
    };
    if (reg.waiting && navigator.serviceWorker.controller) showUpdateBar(reg.waiting);
    reg.addEventListener("updatefound", () => offerUpdate(reg.installing));
  }).catch((err) => console.warn("[sw] 登録できませんでした", err));

  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloading) return;
    reloading = true;
    location.reload();
  });
}

function showUpdateBar(worker) {
  const bar = document.getElementById("updateBar");
  const btn = document.getElementById("updateBtn");
  if (!bar || !btn) return;
  bar.hidden = false;
  btn.onclick = () => { bar.hidden = true; worker.postMessage("SKIP_WAITING"); };
}

boot();
