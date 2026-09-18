import { html, raw, on, esc } from "../util/dom.js";
import { getScenario, recommendNext } from "../../content/index.js";
import { refreshActive } from "../store.js";
import { getLastResult } from "../progress.js";
import { renderKoko, kokoLine } from "../character/koko.js";
import { itemName } from "../../content/items.js";
import { go } from "../router.js";
import * as tts from "../speech/tts.js";

export function render(root, { id }) {
  const r = getLastResult();
  const sc = getScenario(id);
  if (!r || r.scenarioId !== id || !sc) { go("/scenarios", { replace: true }); return; }

  const p = refreshActive();
  const mood = r.score >= 90 ? "cheer" : r.score >= 70 ? "happy" : "normal";
  const lineKey = r.score >= 90 ? "onResultHigh" : r.score >= 70 ? "onResultMid" : "onResultLow";
  const next = recommendNext(p);

  root.innerHTML = html`
    <div class="card" style="text-align:center">
      <div class="koko-stage">${raw(renderKoko({ expression: mood, outfit: p.equipped?.outfit, size: 140 }))}</div>
      <div class="bubble" style="text-align:center">${kokoLine(lineKey)}</div>
      <div class="result-score" style="margin-top:14px">${r.score}<small> 点</small></div>
      <div class="reward-row">
        <div class="reward">+${r.points}<small>ポイント</small></div>
        <div class="reward">+${r.coins}<small>コイン</small></div>
      </div>
      ${raw(r.noPoints ? '<p class="hint">今日はこのシナリオを何度も練習したので、ポイントはここまで。練習は何回でもできるよ。</p>' : "")}
      ${raw(r.isFirstClear && r.newItems.length
        ? `<p class="hint">🎁 おみやげ「${esc(itemName(r.newItems[0]))}」を手に入れた！（コレクションは次のアップデートで見られるようになります）</p>`
        : "")}
    </div>

    <div class="card">
      <div class="section-title">今日おぼえる3つ</div>
      <p class="hint" style="margin-top:0">${esc(sc.wrapUp.ja)}</p>
      <ul class="phrase-list">
        ${raw(sc.wrapUp.phrases.map((ph, i) =>
          `<li><button class="chip" data-act="say" data-i="${i}">🔊</button><span>${esc(ph)}</span></li>`
        ).join(""))}
      </ul>
    </div>

    <div class="btn-row">
      <button class="btn btn-sub" data-act="again">もう一度</button>
      <button class="btn" data-act="next">${next.id === sc.id ? "ホームへ" : "つぎのシナリオ"}</button>
    </div>
    <div style="margin-top:10px"><button class="btn btn-ghost" data-act="home">ホームにもどる</button></div>
  `;

  on(root, "say", (_, node) => tts.speak(sc.wrapUp.phrases[Number(node.dataset.i)]));
  on(root, "again", () => go(`/scenario/${sc.id}`, { replace: true }));
  on(root, "next", () => go(next.id === sc.id ? "/" : `/scenario/${next.id}`, { replace: true }));
  on(root, "home", () => go("/", { replace: true }));
}
