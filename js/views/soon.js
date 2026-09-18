import { html, raw } from "../util/dom.js";
import { renderKoko } from "../character/koko.js";

const INFO = {
  collection: { title: "コレクション", body: "おみやげ・衣装・バッジを集める画面。Phase 3 で作ります。" },
  family: { title: "家族対戦", body: "今週のポイントをコードで送り合って、家族でランキングを作る画面。Phase 4 で作ります。" },
  phrasebook: { title: "フレーズ帳", body: "グアムでそのまま使えるフレーズ集。オフラインでも開けます。Phase 4 で作ります。" },
};

export function render(root, { key }) {
  const info = INFO[key] || { title: "準備中", body: "" };
  root.innerHTML = html`
    <div class="empty">
      <div class="koko-stage">${raw(renderKoko({ expression: "sleepy", size: 130 }))}</div>
      <h2 style="margin:8px 0 4px">${info.title}</h2>
      <p>${info.body}</p>
    </div>`;
}
