/**
 * コレクション定義。おみやげ12・衣装8・バッジ10。
 * 画像ファイルは使わず、すべて SVG をコードで描く（SPEC.md §8.2）。
 *
 * - souvenir … シナリオのクリア報酬。運要素なし
 * - outfit   … コインで確定交換。ココに着せられる。slot で体／頭を分ける
 * - badge    … 実績。プロフィールの状態から判定するので、条件は js/badges.js
 */

const svg = (body) => `<svg viewBox="0 0 48 48" class="item-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;

/** バッジは形を共通にして、中の絵だけ差し替える */
const medal = (inner, color) => svg(`
  <path d="M17 4 h14 l-4 13 h-6 z" fill="#e0e5ee"/>
  <path d="M17 4 h7 l-3.5 13 h-3.5 z" fill="#c8cfdb"/>
  <circle cx="24" cy="30" r="14" fill="${color}"/>
  <circle cx="24" cy="30" r="10.5" fill="#fff" fill-opacity="0.22"/>
  ${inner}`);

export const items = [
  /* ---------- おみやげ（シナリオ報酬・全12種） ---------- */
  { id: "paper-plane", type: "souvenir", name: "紙ひこうき", how: "「機内で」をクリア", from: "airplane",
    icon: svg(`<path d="M6 22 L42 8 L28 42 L23 28 z" fill="#8ecae6"/><path d="M6 22 L42 8 L23 28 z" fill="#bde3f2"/>`) },
  { id: "stamp", type: "souvenir", name: "入国スタンプ", how: "「入国審査」をクリア", from: "immigration",
    icon: svg(`<rect x="7" y="12" width="34" height="26" rx="4" fill="#fff" stroke="#c8cfdb" stroke-width="2"/><g transform="rotate(-12 24 25)"><ellipse cx="24" cy="25" rx="13" ry="9" fill="none" stroke="#e63946" stroke-width="2.6"/><path d="M15 25 h18 M24 20 v10" stroke="#e63946" stroke-width="2.2"/></g>`) },
  { id: "latte-stone", type: "souvenir", name: "ラッテストーン", how: "「空港からホテルへ」をクリア", from: "taxi-hotel",
    icon: svg(`<ellipse cx="24" cy="14" rx="11" ry="7" fill="#d8cbb6"/><path d="M17 16 q7 20 0 26 h14 q-7 -6 0 -26 z" fill="#c3b49b"/><ellipse cx="24" cy="42" rx="14" ry="3.5" fill="#a89a82"/>`) },
  { id: "shell-key", type: "souvenir", name: "貝がらのキーホルダー", how: "「ホテルでチェックイン」をクリア", from: "hotel-checkin",
    icon: svg(`<circle cx="34" cy="11" r="6" fill="none" stroke="#c0a062" stroke-width="2.4"/><path d="M24 40 q-16 -8 -12 -20 q12 -8 24 0 q4 12 -12 20 z" fill="#ffd6cf"/><path d="M24 40 q-2 -14 -8 -19 M24 40 q0 -16 0 -21 M24 40 q2 -14 8 -19" stroke="#f0a898" stroke-width="1.8" fill="none"/>`) },
  { id: "coconut", type: "souvenir", name: "ヤシの実ジュース", how: "「レストランで」をクリア", from: "restaurant",
    icon: svg(`<circle cx="23" cy="28" r="15" fill="#8b5e3c"/><circle cx="23" cy="28" r="15" fill="#6f4830" fill-opacity=".3"/><ellipse cx="23" cy="14" rx="7" ry="3" fill="#5c3a26"/><path d="M27 14 l10 -9" stroke="#ff6b6b" stroke-width="3.2" stroke-linecap="round"/><path d="M20 10 q-8 -4 -12 2 q8 1 12 -2 z" fill="#2a9d5c"/>`) },
  { id: "burger", type: "souvenir", name: "ハンバーガー", how: "「ファストフード」をクリア", from: "fastfood",
    icon: svg(`<path d="M8 20 q16 -14 32 0 z" fill="#e8a33d"/><rect x="7" y="20" width="34" height="5" rx="2.5" fill="#6aa84f"/><rect x="7" y="25" width="34" height="6" rx="2" fill="#8b5e3c"/><path d="M8 31 h32 q0 8 -16 8 q-16 0 -16 -8 z" fill="#e8a33d"/>`) },
  { id: "abc-bag", type: "souvenir", name: "おみやげの紙ぶくろ", how: "「買い物」をクリア", from: "shopping",
    icon: svg(`<path d="M11 16 h26 l2 26 h-30 z" fill="#3aa0d8"/><path d="M11 16 h26 l1 6 h-28 z" fill="#2b86b8"/><path d="M18 16 q0 -8 6 -8 q6 0 6 8" fill="none" stroke="#2b86b8" stroke-width="2.4"/>`) },
  { id: "sea-turtle", type: "souvenir", name: "ウミガメのぬいぐるみ", how: "「ビーチ」をクリア", from: "beach",
    icon: svg(`<ellipse cx="24" cy="26" rx="14" ry="11" fill="#3f8f6f"/><path d="M24 15 v22 M13 26 h22 M16 19 l16 14 M32 19 l-16 14" stroke="#2c6e54" stroke-width="1.8"/><circle cx="24" cy="12" r="5" fill="#4fa583"/><circle cx="22" cy="11" r="1.3" fill="#22313f"/><ellipse cx="11" cy="34" rx="5" ry="3" fill="#4fa583"/><ellipse cx="37" cy="34" rx="5" ry="3" fill="#4fa583"/>`) },
  { id: "compass", type: "souvenir", name: "ほうい磁石", how: "「道をたずねる」をクリア", from: "directions",
    icon: svg(`<circle cx="24" cy="24" r="17" fill="#f2efe4" stroke="#b9a77f" stroke-width="2.6"/><path d="M24 10 L28 24 L24 38 L20 24 z" fill="#e63946"/><path d="M24 38 L20 24 L24 10 z" fill="#f0f0f0" fill-opacity=".8"/><circle cx="24" cy="24" r="2.4" fill="#b9a77f"/>`) },
  { id: "first-aid", type: "souvenir", name: "きゅうきゅうセット", how: "「困ったとき」をクリア", from: "trouble",
    icon: svg(`<rect x="7" y="14" width="34" height="25" rx="4" fill="#e63946"/><rect x="19" y="10" width="10" height="5" rx="2" fill="#c1121f"/><path d="M21 22 h6 v4 h4 v6 h-4 v4 h-6 v-4 h-4 v-6 h4 z" fill="#fff"/>`) },
  { id: "friendship-band", type: "souvenir", name: "ミサンガ", how: "「現地の人と雑談」をクリア", from: "smalltalk",
    icon: svg(`<circle cx="24" cy="24" r="14" fill="none" stroke="#ff8fab" stroke-width="5"/><circle cx="24" cy="24" r="14" fill="none" stroke="#ffd166" stroke-width="5" stroke-dasharray="7 7"/><circle cx="24" cy="24" r="14" fill="none" stroke="#2ec4b6" stroke-width="5" stroke-dasharray="4 17" stroke-dashoffset="3"/>`) },
  { id: "sunset-card", type: "souvenir", name: "夕日の絵はがき", how: "「お土産・帰りの空港」をクリア", from: "souvenir",
    icon: svg(`<rect x="5" y="11" width="38" height="26" rx="3" fill="#fff" stroke="#e0d5bd" stroke-width="2"/><rect x="8" y="14" width="32" height="20" fill="#ffd8a8"/><circle cx="24" cy="26" r="7" fill="#ff8c42"/><path d="M8 28 h32 v6 h-32 z" fill="#2ec4b6"/><path d="M12 24 q3 -8 6 0" stroke="#3f8f6f" stroke-width="2" fill="none"/>`) },

  /* ---------- 衣装（コインで交換） ---------- */
  { id: "lei", type: "outfit", slot: "outfit", name: "花のレイ", cost: 40, how: "ショップで 40コイン",
    icon: svg(`<circle cx="24" cy="26" r="13" fill="none" stroke="#ff8fab" stroke-width="3"/>${[0,60,120,180,240,300].map(a=>`<g transform="rotate(${a} 24 26) translate(24 13)">${[0,72,144,216,288].map(b=>`<ellipse cx="0" cy="-3" rx="2" ry="3" fill="#ffd166" transform="rotate(${b})"/>`).join("")}<circle r="1.4" fill="#fff6d8"/></g>`).join("")}`) },
  { id: "cap", type: "outfit", slot: "hat", name: "キャップ", cost: 40, how: "ショップで 40コイン",
    icon: svg(`<path d="M9 30 q15 -22 30 -2 q1 3 0 4 h-30 z" fill="#3d8bfd"/><path d="M38 32 q9 1 9 5 q-9 2 -10 -4 z" fill="#2f6fd0"/><circle cx="24" cy="9" r="3" fill="#2f6fd0"/>`) },
  { id: "straw-hat", type: "outfit", slot: "hat", name: "麦わら帽子", cost: 50, how: "ショップで 50コイン",
    icon: svg(`<ellipse cx="24" cy="31" rx="20" ry="6" fill="#e0b876"/><path d="M14 31 q10 -20 20 0 z" fill="#f2d79b"/><path d="M15 29 q9 -6 18 0" stroke="#c98f3f" stroke-width="3.4" fill="none"/>`) },
  { id: "aloha-shirt", type: "outfit", slot: "outfit", name: "アロハシャツ", cost: 60, how: "ショップで 60コイン",
    icon: svg(`<path d="M12 14 q12 -7 24 0 q2 16 -1 24 q-11 5 -22 0 q-3 -8 -1 -24 z" fill="#ff7b54"/><path d="M19 12 l5 6 l5 -6" fill="none" stroke="#e8572f" stroke-width="2.4" stroke-linejoin="round"/><circle cx="17" cy="27" r="2.6" fill="#ffe066"/><circle cx="26" cy="34" r="2.6" fill="#ffe066"/><circle cx="32" cy="24" r="2.6" fill="#ffe066"/>`) },
  { id: "sunglasses", type: "outfit", slot: "hat", name: "サングラス", cost: 60, how: "ショップで 60コイン",
    icon: svg(`<rect x="5" y="19" width="17" height="12" rx="6" fill="#22313f"/><rect x="26" y="19" width="17" height="12" rx="6" fill="#22313f"/><path d="M22 24 h4" stroke="#22313f" stroke-width="3.4"/><path d="M9 22 q4 -2 7 0" stroke="#5b7086" stroke-width="2" fill="none" stroke-linecap="round"/>`) },
  { id: "backpack", type: "outfit", slot: "outfit", name: "リュック", cost: 70, how: "ショップで 70コイン",
    icon: svg(`<rect x="12" y="13" width="24" height="28" rx="8" fill="#4a7c59"/><rect x="17" y="24" width="14" height="8" rx="3" fill="#77ab89"/><path d="M17 13 q0 -7 7 -7 q7 0 7 7" fill="none" stroke="#3a6347" stroke-width="3"/>`) },
  { id: "float-ring", type: "outfit", slot: "outfit", name: "浮き輪", cost: 90, how: "ショップで 90コイン",
    icon: svg(`<circle cx="24" cy="24" r="16" fill="none" stroke="#ff5d5d" stroke-width="9"/><path d="M24 8 a16 16 0 0 1 11 5" stroke="#fff3e6" stroke-width="9" fill="none"/><path d="M24 40 a16 16 0 0 1 -11 -5" stroke="#fff3e6" stroke-width="9" fill="none"/>`) },
  { id: "snorkel-mask", type: "outfit", slot: "hat", name: "シュノーケル", cost: 100, how: "ショップで 100コイン",
    icon: svg(`<rect x="6" y="19" width="32" height="14" rx="6" fill="#9fd8f5" fill-opacity=".6" stroke="#2b7fb8" stroke-width="2.4"/><path d="M38 23 q7 -2 7 -12" stroke="#ff9f1c" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M11 22 q4 -1 7 0" stroke="#e8f6ff" stroke-width="2" fill="none" stroke-linecap="round"/>`) },

  /* ---------- バッジ（実績・条件は js/badges.js） ---------- */
  { id: "first-step", type: "badge", name: "はじめの一歩", how: "はじめてシナリオをクリア",
    icon: medal(`<path d="M18 30 l4 5 l9 -10" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, "#2ec4b6") },
  { id: "perfect", type: "badge", name: "パーフェクト", how: "100点でクリアする",
    icon: medal(`<path d="M24 21 l3 6 l7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1 z" fill="#fff"/>`, "#ff9f1c") },
  { id: "streak-3", type: "badge", name: "3日つづけて", how: "3日つづけて練習する",
    icon: medal(`<text x="24" y="36" text-anchor="middle" font-size="16" font-weight="bold" fill="#fff">3</text>`, "#e76f51") },
  { id: "streak-7", type: "badge", name: "1週間つづけて", how: "7日つづけて練習する",
    icon: medal(`<text x="24" y="36" text-anchor="middle" font-size="16" font-weight="bold" fill="#fff">7</text>`, "#c1121f") },
  { id: "point-500", type: "badge", name: "500ポイント", how: "累計500ポイントためる",
    icon: medal(`<text x="24" y="34" text-anchor="middle" font-size="11" font-weight="bold" fill="#fff">500</text>`, "#8367c7") },
  { id: "point-2000", type: "badge", name: "2000ポイント", how: "累計2000ポイントためる",
    icon: medal(`<text x="24" y="34" text-anchor="middle" font-size="10" font-weight="bold" fill="#fff">2000</text>`, "#5b3fa8") },
  { id: "collector", type: "badge", name: "おみやげ集め", how: "おみやげを5こ集める",
    icon: medal(`<path d="M15 28 h18 v10 h-18 z M14 23 h20 v5 h-20 z M24 23 v15" stroke="#fff" stroke-width="2.4" fill="none"/>`, "#3d8bfd") },
  { id: "dresser", type: "badge", name: "おしゃれさん", how: "衣装を3着そろえる",
    icon: medal(`<path d="M17 22 q7 -4 14 0 q1 9 -1 14 q-6 3 -12 0 q-2 -5 -1 -14 z" fill="#fff"/>`, "#ff8fab") },
  { id: "review-master", type: "badge", name: "ふくしゅうの達人", how: "同じシナリオを3回クリア",
    icon: medal(`<path d="M33 26 a10 10 0 1 0 -2 8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M33 19 v8 h-8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, "#2a9d5c") },
  { id: "all-clear", type: "badge", name: "グアム制覇", how: "すべてのシナリオをクリア",
    icon: medal(`<path d="M16 34 v-14 l16 5 -16 5" fill="#fff"/><path d="M16 20 v16" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>`, "#ffd166") },
];

export const itemMap = Object.fromEntries(items.map((i) => [i.id, i]));

export function itemName(id) { return itemMap[id]?.name || id; }
export function itemsOfType(type) { return items.filter((i) => i.type === type); }
