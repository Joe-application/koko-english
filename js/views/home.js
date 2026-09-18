import { html, raw, on, esc } from "../util/dom.js";
import { refreshActive, daysUntilTrip, todayStr } from "../store.js";
import { renderKoko, kokoLine } from "../character/koko.js";
import { scenarios, recommendNext, isUnlocked } from "../../content/index.js";
import { go } from "../router.js";
import * as tts from "../speech/tts.js";

export function render(root) {
  const p = refreshActive();
  if (!p) { go("/welcome", { replace: true }); return; }

  const next = recommendNext(p);
  const clearedCount = scenarios.filter((s) => p.scenarios?.[s.id]?.cleared).length;
  const unlockedCount = scenarios.filter((s) => isUnlocked(s, p)).length;

  const lastPlayed = p.lastPlayedDate;
  const gapDays = lastPlayed
    ? Math.round((new Date(todayStr()) - new Date(lastPlayed)) / 864e5)
    : null;
  const lineKey = lastPlayed === null ? "onFirstVisit" : gapDays >= 3 ? "onComeback" : "onHome";
  const mood = lineKey === "onComeback" ? "happy" : "normal";

  root.innerHTML = html`
    <div class="home-hero">
      <span class="countdown">グアムまであと <b>${daysUntilTrip()}</b> 日</span>
      <div class="koko-stage">${raw(renderKoko({ expression: mood, outfit: p.equipped?.outfit, hat: p.equipped?.hat, size: 150 }))}</div>
      <div class="bubble" data-act="kokoTap" role="button" tabindex="0">${kokoLine(lineKey)}</div>
    </div>

    <div class="stat-row">
      <div class="stat"><div class="stat-v">${p.totalPoints}</div><div class="stat-l">ポイント</div></div>
      <div class="stat"><div class="stat-v">${p.coins}</div><div class="stat-l">コイン</div></div>
      <div class="stat"><div class="stat-v">${clearedCount}<small>/${scenarios.length}</small></div><div class="stat-l">クリア</div></div>
    </div>
    ${raw(p.streak > 0 ? `<p class="streak-line">${p.streak}日つづけて練習中</p>` : "")}

    <div class="section-title">今日の練習</div>
    <button class="sc-card" data-act="start">
      <span class="sc-ico">${next.icon}</span>
      <span class="sc-body">
        <span class="sc-title">${next.title.ja}</span>
        <span class="sc-en">${next.title.en}</span>
        <span class="sc-meta">${p.scenarios?.[next.id]?.cleared ? "復習しよう" : "はじめてのシナリオ"}</span>
      </span>
      <span aria-hidden="true">▶</span>
    </button>

    <div class="btn-row" style="margin-top:14px">
      <button class="btn btn-sub" data-act="all">シナリオ一覧（${unlockedCount}本）</button>
    </div>
  `;

  on(root, "start", () => go(`/scenario/${next.id}`));
  on(root, "all", () => go("/scenarios"));
  on(root, "kokoTap", (_, node) => {
    const svg = root.querySelector(".koko");
    if (svg) { svg.dataset.mood = "cheer"; setTimeout(() => { svg.dataset.mood = mood; }, 1400); }
    tts.speakKoko("Hafa adai! I am Koko. Let us practice English together!");
    node.textContent = kokoLine("onHome");
  });
}
