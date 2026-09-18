/**
 * キャラクター「ココ」。
 * グアムの固有種 ko'ko'（グアムクイナ）がモチーフの案内役。
 * 画像ファイルは使わず、すべて SVG をコードで組み立てる。
 *
 * 衣装・帽子レイヤーは Phase 3 で中身を足す。今は装備なしでも成立する構造だけ用意してある。
 */

const EYES = {
  normal: (x) => `<g class="koko-blinker"><ellipse cx="${x}" cy="52" rx="6.5" ry="7.5" fill="#22313f"/><circle cx="${x + 2.2}" cy="49.5" r="2.2" fill="#fff"/></g>`,
  happy: (x) => `<path d="M${x - 7} 54 q7 -9 14 0" stroke="#22313f" stroke-width="3.4" fill="none" stroke-linecap="round"/>`,
  cheer: (x) => `<path d="M${x - 7} 54 q7 -10 14 0" stroke="#22313f" stroke-width="3.6" fill="none" stroke-linecap="round"/>`,
  listening: (x) => `<g class="koko-blinker"><ellipse cx="${x}" cy="52" rx="7.5" ry="8.5" fill="#22313f"/><circle cx="${x + 2.4}" cy="49" r="2.6" fill="#fff"/></g>`,
  surprised: (x) => `<g><circle cx="${x}" cy="52" r="9" fill="#fff" stroke="#22313f" stroke-width="2"/><circle cx="${x}" cy="52.5" r="4.6" fill="#22313f"/></g>`,
  sleepy: (x) => `<path d="M${x - 7} 52 q7 6 14 0" stroke="#22313f" stroke-width="3.2" fill="none" stroke-linecap="round"/>`,
};

const BEAK = {
  closed: `<path d="M84 60 l20 5 -20 7 z" fill="#f4a11e"/>`,
  open: `<g><path d="M84 59 l20 2 -20 5 z" fill="#f4a11e"/><path d="M84 66 l19 4 -19 5 z" fill="#d97c12"/></g>`,
};

const OUTFITS = {
  // Phase 3 で追加。id -> SVG 文字列を返す関数
};

const HATS = {
  // Phase 3 で追加
};

/**
 * ココの SVG 文字列を返す。
 * @param {{expression?: string, outfit?: string|null, hat?: string|null, size?: number}} opts
 */
export function renderKoko({ expression = "normal", outfit = null, hat = null, size = 160 } = {}) {
  const mood = EYES[expression] ? expression : "normal";
  const beak = mood === "cheer" || mood === "happy" || mood === "surprised" ? BEAK.open : BEAK.closed;
  const outfitSvg = outfit && OUTFITS[outfit] ? OUTFITS[outfit]() : "";
  const hatSvg = hat && HATS[hat] ? HATS[hat]() : "";
  const tilt = mood === "listening" ? "rotate(-7 60 70)" : "";

  return `
<svg class="koko" data-mood="${mood}" viewBox="0 0 130 130" width="${size}" height="${size}"
     role="img" aria-label="キャラクターのココ" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="62" cy="120" rx="34" ry="6" fill="rgba(20,33,61,.13)"/>
  <g class="koko-body-g" transform="${tilt}">
    <!-- 脚 -->
    <path d="M50 106 v10 M50 116 l-6 5 M50 116 l6 5" stroke="#f4a11e" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M74 106 v10 M74 116 l-6 5 M74 116 l6 5" stroke="#f4a11e" stroke-width="4" fill="none" stroke-linecap="round"/>
    <!-- しっぽ -->
    <path d="M22 84 q-12 -6 -14 -18 q12 6 18 8 z" fill="#8c6242"/>
    <!-- からだ -->
    <ellipse cx="60" cy="80" rx="40" ry="34" fill="#a9754d"/>
    <ellipse cx="66" cy="88" rx="28" ry="24" fill="#e8d3b4"/>
    <!-- おなかの縞（グアムクイナの特徴） -->
    <g stroke="#a9754d" stroke-width="2.6" stroke-linecap="round" opacity=".55">
      <path d="M52 84 h26"/><path d="M50 92 h30"/><path d="M52 100 h26"/>
    </g>
    <!-- つばさ -->
    <path d="M34 70 q16 -8 30 4 q-14 14 -30 6 z" fill="#8c6242"/>
    ${outfitSvg}
    <!-- あたま -->
    <circle cx="62" cy="50" r="30" fill="#a9754d"/>
    <path d="M36 44 q24 -14 50 -2 q-24 -6 -50 2 z" fill="#8c6242"/>
    <!-- 目のうしろの白い線（ko'ko' の模様） -->
    <path d="M44 44 q16 -5 30 -1" stroke="#f6efe2" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"/>
    ${EYES[mood](50)}
    ${EYES[mood](74)}
    ${beak}
    ${hatSvg}
  </g>
</svg>`;
}

/** 場面ごとのセリフ。同じものが連続しないように選ぶ。 */
const LINES = {
  onHome: [
    "今日も5分だけ、いっしょにやろう！",
    "英語は使った分だけ通じるようになるよ。",
    "グアムの人はゆっくり話してくれるから大丈夫。",
    "まちがえても平気。通じたら勝ちだよ！",
  ],
  onFirstVisit: ["はじめまして、ぼくはココ！ グアムから来たよ。いっしょに英語を練習しよう！"],
  onComeback: [
    "おかえり！ ゆっくりでいいよ。",
    "また会えてうれしいな。1本だけやってみる？",
  ],
  onCorrect: ["いいね！ 通じたよ！", "その言い方、バッチリ！", "Nice! 今のは自然だったよ。"],
  onWrong: ["おしい！ もう一回いってみよう。", "だいじょうぶ、ここはみんな間違えるところ。"],
  onResultHigh: ["すごい！ これならグアムでも通じるよ！"],
  onResultMid: ["いい調子！ あと少しで完璧だね。"],
  onResultLow: ["ここからが伸びるところ。もう一回やってみよう！"],
};

const lastPicked = {};

export function kokoLine(key) {
  const list = LINES[key] || LINES.onHome;
  if (list.length === 1) return list[0];
  let pick;
  do { pick = list[Math.floor(Math.random() * list.length)]; } while (pick === lastPicked[key]);
  lastPicked[key] = pick;
  return pick;
}
