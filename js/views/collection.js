import { html, raw, on, esc, $, $$, toast } from "../util/dom.js";
import { refreshActive, updateActive } from "../store.js";
import { itemsOfType, itemMap } from "../../content/items.js";
import { renderKoko } from "../character/koko.js";
import { go } from "../router.js";

const TABS = [
  { key: "souvenir", label: "おみやげ" },
  { key: "outfit", label: "衣装" },
  { key: "badge", label: "バッジ" },
];

let activeTab = "souvenir";

export function render(root) {
  const p = refreshActive();
  if (!p) { go("/welcome", { replace: true }); return; }

  const owned = new Set(p.items || []);
  const list = itemsOfType(activeTab);
  const ownedCount = list.filter((i) => owned.has(i.id)).length;

  root.innerHTML = html`
    <div class="coll-head">
      <div class="koko-stage">
        ${raw(renderKoko({ expression: "happy", outfit: p.equipped?.outfit, hat: p.equipped?.hat, size: 130 }))}
      </div>
      <div class="coin-pill">🪙 ${p.coins} コイン</div>
    </div>

    <div class="seg" role="tablist">
      ${raw(TABS.map((t) => {
        const n = itemsOfType(t.key).filter((i) => owned.has(i.id)).length;
        return `<button class="seg-btn" role="tab" data-act="tab" data-key="${t.key}"
                  aria-selected="${t.key === activeTab}">${t.label}<small>${n}/${itemsOfType(t.key).length}</small></button>`;
      }).join(""))}
    </div>

    <p class="hint coll-count">${ownedCount} / ${list.length} こ集めた</p>

    <div class="item-grid">
      ${raw(list.map((item) => card(item, owned.has(item.id), p)).join(""))}
    </div>
  `;

  on(root, "tab", (_, node) => { activeTab = node.dataset.key; render(root); });

  on(root, "buy", (_, node) => {
    const item = itemMap[node.dataset.id];
    if (!item || (p.coins ?? 0) < item.cost) return;
    updateActive((prof) => {
      if (prof.coins < item.cost || prof.items.includes(item.id)) return;
      prof.coins -= item.cost;
      prof.items.push(item.id);
      prof.equipped[item.slot] = item.id; // 買ったらすぐ着せる
    });
    toast(`${item.name}を手に入れた！`);
    render(root);
  });

  on(root, "equip", (_, node) => {
    const item = itemMap[node.dataset.id];
    if (!item) return;
    updateActive((prof) => {
      prof.equipped[item.slot] = prof.equipped[item.slot] === item.id ? null : item.id;
    });
    render(root);
  });
}

function card(item, isOwned, p) {
  const equipped = item.type === "outfit" && p.equipped?.[item.slot] === item.id;
  const canBuy = item.type === "outfit" && !isOwned && (p.coins ?? 0) >= item.cost;

  const action = item.type !== "outfit"
    ? ""
    : isOwned
      ? `<button class="btn btn-sm ${equipped ? "" : "btn-sub"}" data-act="equip" data-id="${item.id}">${equipped ? "ぬぐ" : "きる"}</button>`
      : `<button class="btn btn-sm btn-sun" data-act="buy" data-id="${item.id}" ${canBuy ? "" : "disabled"}>🪙 ${item.cost}</button>`;

  return `
    <div class="item-card ${isOwned ? "is-owned" : "is-locked"} ${equipped ? "is-equipped" : ""}">
      <div class="item-ico">${item.icon}</div>
      <div class="item-name">${isOwned ? esc(item.name) : "？？？"}</div>
      <div class="item-how">${esc(item.how)}</div>
      ${action}
    </div>`;
}
