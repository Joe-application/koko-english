import { html, raw, on, esc, $, toast } from "../util/dom.js";
import { refreshActive, updateActive, weekIdOf } from "../store.js";
import { shareText, decodeScore } from "../util/code.js";
import { renderKoko } from "../character/koko.js";
import { go } from "../router.js";

export function render(root) {
  const p = refreshActive();
  if (!p) { go("/welcome", { replace: true }); return; }

  const weekId = weekIdOf();
  const myPoints = p.weekly?.points ?? 0;

  // ランキングは「今週」だけで競う。累計だと大人が有利で子どもが追いつけない。
  const rivals = (p.rivals || []).filter((r) => r.weekId === weekId);
  const board = [{ name: p.name, points: myPoints, isMe: true }, ...rivals]
    .sort((a, b) => b.points - a.points);

  const stale = (p.rivals || []).filter((r) => r.weekId !== weekId).length;

  root.innerHTML = html`
    <div class="fam-hero">
      <div class="koko-stage">
        ${raw(renderKoko({ expression: "happy", outfit: p.equipped?.outfit, hat: p.equipped?.hat, size: 110 }))}
      </div>
      <div class="fam-week">${weekId.replace("-W", " 年 第 ")} 週</div>
      <div class="fam-mine"><b>${myPoints}</b> pt</div>
      <div class="hint" style="margin:0">今週のポイントで競争中！</div>
    </div>

    <div class="section-title">今週のランキング</div>
    <div class="board">
      ${raw(board.map((r, i) => `
        <div class="board-row ${r.isMe ? "is-me" : ""}">
          <span class="board-rank">${i === 0 && r.points > 0 ? "👑" : i + 1}</span>
          <span class="board-name">${esc(r.name)}${r.isMe ? "<small>（じぶん）</small>" : ""}</span>
          <span class="board-pt">${r.points}<small>pt</small></span>
        </div>`).join(""))}
    </div>
    ${raw(rivals.length === 0
      ? '<p class="hint">まだ家族のスコアがありません。下の「コードを作る」で自分の成績を送って、送ってもらったコードを読み込むとランキングになります。</p>'
      : "")}

    <div class="card" style="margin-top:16px">
      <div class="section-title">自分の成績を送る</div>
      <p class="hint" style="margin-top:0">コピーして、家族のLINEに貼り付けてください。</p>
      <button class="btn" data-act="make">コードを作る</button>
      <div id="shareBox" hidden style="margin-top:12px">
        <textarea id="shareText" class="share-text" rows="5" readonly></textarea>
        <div style="margin-top:8px"><button class="btn btn-sub" data-act="copy">コピーする</button></div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">家族のコードを読み込む</div>
      <p class="hint" style="margin-top:0">送られてきたメッセージをそのまま貼り付けてOKです。</p>
      <input id="codeIn" type="text" placeholder="KE1.…" autocomplete="off" autocapitalize="off" spellcheck="false">
      <div style="margin-top:8px"><button class="btn btn-sun" data-act="load">読み込む</button></div>
      <p id="codeMsg" class="hint"></p>
    </div>

    ${raw(stale ? `<p class="hint" style="text-align:center">先週までのスコア ${stale} 件は、週がかわったので表示していません。</p>` : "")}
  `;

  on(root, "make", () => {
    const box = $("#shareBox", root);
    $("#shareText", root).value = shareText({ name: p.name, weekId, points: myPoints });
    box.hidden = false;
  });

  on(root, "copy", async () => {
    const text = $("#shareText", root).value;
    try {
      await navigator.clipboard.writeText(text);
      toast("コピーしました");
    } catch {
      const ta = $("#shareText", root);
      ta.select();
      toast("長押しして「コピー」を選んでください");
    }
  });

  on(root, "load", () => {
    const msg = $("#codeMsg", root);
    const res = decodeScore($("#codeIn", root).value);
    if (!res.ok) { msg.textContent = "⚠️ " + res.error; return; }

    if (res.weekId !== weekId) {
      msg.textContent = `⚠️ そのコードは ${res.weekId} のものです。今週（${weekId}）のコードを送ってもらってください。`;
      return;
    }
    if (res.name === p.name) {
      msg.textContent = "⚠️ 自分と同じなまえのコードです。相手のコードを貼り付けてください。";
      return;
    }

    updateActive((prof) => {
      prof.rivals = (prof.rivals || []).filter((r) => !(r.name === res.name && r.weekId === res.weekId));
      prof.rivals.push({ name: res.name, weekId: res.weekId, points: res.points, importedAt: new Date().toISOString().slice(0, 10) });
    });
    toast(`${res.name} のスコアを読み込みました`);
    render(root);
  });
}
