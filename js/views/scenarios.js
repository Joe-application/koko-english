import { html, raw, on } from "../util/dom.js";
import { refreshActive } from "../store.js";
import { scenarios, isUnlocked } from "../../content/index.js";
import { go } from "../router.js";

export function render(root) {
  const p = refreshActive();
  if (!p) { go("/welcome", { replace: true }); return; }

  const cards = scenarios.map((s) => {
    const rec = p.scenarios?.[s.id];
    const unlocked = isUnlocked(s, p);
    const meta = !unlocked
      ? `「${s.unlockAfter.map((id) => scenarios.find((x) => x.id === id)?.title.ja || id).join("・")}」をクリアすると解放`
      : rec?.cleared
        ? `<span class="sc-cleared">クリア済み</span> ・ <span class="sc-best">ベスト ${rec.bestScore}点</span>`
        : "まだ挑戦していません";
    return `
      <button class="sc-card ${unlocked ? "" : "is-locked"}" ${unlocked ? `data-act="open" data-id="${s.id}"` : "disabled"}>
        <span class="sc-ico">${unlocked ? s.icon : "🔒"}</span>
        <span class="sc-body">
          <span class="sc-title">${s.title.ja}</span>
          <span class="sc-en">${s.title.en}</span>
          <span class="sc-meta">${meta}</span>
        </span>
        ${unlocked ? '<span aria-hidden="true">▶</span>' : ""}
      </button>`;
  }).join("");

  root.innerHTML = html`
    <div class="section-title">旅のじゅんばんに練習しよう</div>
    ${raw(cards)}
    <p class="empty" style="padding:20px 0 0;font-size:13px">シナリオはこれから全12本まで増えます。</p>
  `;

  on(root, "open", (_, node) => go(`/scenario/${node.dataset.id}`));
}
