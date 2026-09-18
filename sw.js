/**
 * Service Worker（自動生成・直接編集しないこと）
 * 作り直す: node tools/make-sw.mjs
 *
 * 方針は cache-first。グアムの現地で通信がなくてもフレーズ帳と練習が開けることが目的。
 */
const CACHE = "koko-english-f4421f2afa";

const ASSETS = [
    "./content/index.js",
    "./content/items.js",
    "./content/phrases.js",
    "./content/scenarios/01-airplane.js",
    "./content/scenarios/02-immigration.js",
    "./content/scenarios/03-taxi-hotel.js",
    "./content/scenarios/04-hotel-checkin.js",
    "./content/scenarios/05-restaurant.js",
    "./content/scenarios/06-fastfood.js",
    "./content/scenarios/07-shopping.js",
    "./content/scenarios/08-beach.js",
    "./content/scenarios/09-directions.js",
    "./content/scenarios/10-trouble.js",
    "./content/scenarios/11-smalltalk.js",
    "./content/scenarios/12-souvenir.js",
    "./css/style.css",
    "./icons/apple-touch-icon.png",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/icon-maskable-512.png",
    "./index.html",
    "./js/badges.js",
    "./js/character/koko.js",
    "./js/main.js",
    "./js/progress.js",
    "./js/router.js",
    "./js/speech/score.js",
    "./js/speech/stt.js",
    "./js/speech/tts.js",
    "./js/store.js",
    "./js/util/code.js",
    "./js/util/dom.js",
    "./js/util/text.js",
    "./js/views/collection.js",
    "./js/views/family.js",
    "./js/views/home.js",
    "./js/views/phrasebook.js",
    "./js/views/profile.js",
    "./js/views/result.js",
    "./js/views/scenario.js",
    "./js/views/scenarios.js",
    "./js/views/settings.js",
    "./manifest.webmanifest"
  ];

self.addEventListener("install", (event) => {
  // 1つでも失敗すると全部入らないので、個別に入れて失敗したものだけ諦める
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(ASSETS.map((url) =>
      cache.add(new Request(url, { cache: "reload" })).catch((err) => {
        console.warn("[sw] キャッシュできませんでした", url, err);
      })
    ));
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n !== CACHE).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

// ページから「新しい版に切り替えて」と言われたときだけ即座に入れ替える。
// 勝手に切り替えると、練習の途中で画面が作り直されてしまう。
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res && res.ok && res.type === "basic") {
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone());
      }
      return res;
    } catch (err) {
      // オフラインで未キャッシュのページを開こうとした場合はトップを返す
      if (req.mode === "navigate") {
        const fallback = await caches.match("./index.html");
        if (fallback) return fallback;
      }
      throw err;
    }
  })());
});
