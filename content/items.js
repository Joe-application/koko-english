/**
 * コレクション定義。Phase 3 で全種類（おみやげ12・衣装8・バッジ10）に増やす。
 * 今はシナリオ報酬で参照される分だけ。
 */
export const items = [
  { id: "paper-plane", type: "souvenir", name: "紙ひこうき", how: "「機内で」をクリア" },
  { id: "stamp", type: "souvenir", name: "入国スタンプ", how: "「入国審査」をクリア" },
];

export const itemMap = Object.fromEntries(items.map((i) => [i.id, i]));

export function itemName(id) { return itemMap[id]?.name || id; }
