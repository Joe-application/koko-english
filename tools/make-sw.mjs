/**
 * Service Worker を書き出す。
 *
 *   node tools/make-sw.mjs
 *
 * キャッシュ対象の一覧を手で書くと必ずズレて、
 * 「更新したのに古いままの人がいる」「オフラインで一部だけ開けない」が起きる。
 * なのでファイルを走査して一覧とバージョンを生成し、sw.js ごと書き出す。
 *
 * バージョンは全ファイルの内容から作ったハッシュにしてある。
 * 中身が変われば必ず変わるので、更新の取りこぼしが起きない。
 * また sw.js 自体が毎回書き換わるため、ブラウザが確実に更新を検知できる。
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const SKIP_DIRS = new Set([".git", "tools", "node_modules", ".claude"]);
const SKIP_FILES = new Set(["sw.js", ".DS_Store", ".gitignore", ".nojekyll", "SPEC.md", "README.md"]);
const KEEP_EXT = new Set([".html", ".css", ".js", ".mjs", ".png", ".svg", ".webmanifest", ".json"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(full, out);
    } else if (!SKIP_FILES.has(name) && KEEP_EXT.has(name.slice(name.lastIndexOf("."))))  {
      out.push("./" + relative(ROOT, full));
    }
  }
  return out;
}

const assets = walk(ROOT).sort();
// アイコン元の SVG はページから参照しないので、キャッシュ対象から外す
const serve = assets.filter((p) => !/^\.\/icons\/koko(-maskable)?\.svg$/.test(p));

const hash = createHash("sha256");
for (const p of serve) hash.update(p).update(readFileSync(join(ROOT, p)));
const version = hash.digest("hex").slice(0, 10);

const sw = `/**
 * Service Worker（自動生成・直接編集しないこと）
 * 作り直す: node tools/make-sw.mjs
 *
 * 方針は cache-first。グアムの現地で通信がなくてもフレーズ帳と練習が開けることが目的。
 */
const CACHE = "koko-english-${version}";

const ASSETS = ${JSON.stringify(serve, null, 2).split("\n").map((l, i) => (i ? "  " + l : l)).join("\n")};

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
`;

writeFileSync(join(ROOT, "sw.js"), sw);
console.log(`sw.js を書き出しました（${serve.length} ファイル / version ${version}）`);
