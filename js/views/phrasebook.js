import { html, raw, on, esc, $, $$ } from "../util/dom.js";
import { refreshActive, updateActive } from "../store.js";
import { categories, phrases, phraseMap, searchPhrases } from "../../content/phrases.js";
import * as tts from "../speech/tts.js";
import { go } from "../router.js";

let activeCat = "greeting";
let query = "";
let favOnly = false;

export function render(root) {
  const p = refreshActive();
  if (!p) { go("/welcome", { replace: true }); return; }
  const favs = new Set(p.favorites || []);

  let list = query ? searchPhrases(query) : phrases.filter((x) => x.cat === activeCat);
  if (favOnly) list = (query ? list : phrases).filter((x) => favs.has(x.id));

  root.innerHTML = html`
    <div class="pb-search">
      <input id="q" type="text" value="${query}" placeholder="日本語でも英語でもさがせます"
             autocomplete="off" autocapitalize="off" spellcheck="false">
      <button class="chip ${favOnly ? "is-on" : ""}" data-act="fav">★ ${favs.size}</button>
    </div>

    ${raw(query || favOnly ? "" : `
      <div class="pb-cats">
        ${categories.map((c) => `
          <button class="pb-cat ${c.key === activeCat ? "is-on" : ""}" data-act="cat" data-key="${c.key}">
            <span>${c.icon}</span>${c.label}
          </button>`).join("")}
      </div>`)}

    <p class="hint pb-note">タップすると大きく表示します。相手に画面を見せて使えます。</p>

    <div class="pb-list">
      ${raw(list.length ? list.map((x) => `
        <div class="pb-item">
          <button class="pb-main" data-act="show" data-id="${x.id}">
            <span class="pb-en">${esc(x.en)}</span>
            <span class="pb-ja">${esc(x.ja)}</span>
          </button>
          <button class="pb-btn" data-act="say" data-id="${x.id}" aria-label="読み上げ">🔊</button>
          <button class="pb-btn ${favs.has(x.id) ? "is-fav" : ""}" data-act="star" data-id="${x.id}"
                  aria-label="お気に入り">${favs.has(x.id) ? "★" : "☆"}</button>
        </div>`).join("")
        : `<p class="empty">${favOnly ? "★をつけたフレーズはまだありません。" : "見つかりませんでした。"}</p>`)}
    </div>

    <div id="bigView" class="big-view" hidden>
      <button class="big-close" data-act="close" aria-label="とじる">✕</button>
      <div class="big-en" data-big-en></div>
      <div class="big-ja" data-big-ja></div>
      <button class="btn btn-sub big-say" data-act="bigsay">🔊 読み上げる</button>
    </div>
  `;

  const input = $("#q", root);
  input.addEventListener("input", () => {
    query = input.value;
    const pos = input.selectionStart;
    render(root);
    const next = $("#q", root);
    next.focus();
    next.setSelectionRange(pos, pos);
  });

  on(root, "cat", (_, node) => { activeCat = node.dataset.key; render(root); });
  on(root, "fav", () => { favOnly = !favOnly; render(root); });
  on(root, "say", (_, node) => tts.speak(phraseMap[node.dataset.id].en));

  on(root, "star", (_, node) => {
    const id = node.dataset.id;
    updateActive((prof) => {
      const list2 = prof.favorites || [];
      prof.favorites = list2.includes(id) ? list2.filter((x) => x !== id) : [...list2, id];
    });
    render(root);
  });

  // 「見せて使う」モード。店員に画面を向けて読んでもらうので、英文だけを大きく出す。
  let shown = null;
  on(root, "show", (_, node) => {
    shown = phraseMap[node.dataset.id];
    const box = $("#bigView", root);
    $("[data-big-en]", box).textContent = shown.en;
    $("[data-big-ja]", box).textContent = shown.ja;
    box.hidden = false;
    tts.speak(shown.en);
  });
  on(root, "close", () => { $("#bigView", root).hidden = true; });
  on(root, "bigsay", () => { if (shown) tts.speak(shown.en); });
}
