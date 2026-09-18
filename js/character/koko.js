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

/**
 * くちばし。目（cy=52）より下、かつ頭の円（cx=62 cy=50 r=30）の内側に収まる頂点にする。
 * 頭からはみ出すと顔に貼り付いていないように見えて浮く。
 */
const BEAK = {
  closed: `<path d="M64 62 L84 68 L64 74 z" fill="#f4a11e"/>`,
  open: `<g><path d="M64 61 L84 67 L64 69 z" fill="#f4a11e"/><path d="M64 70 L79 74 L64 77 z" fill="#d97c12"/></g>`,
};

/**
 * 衣装レイヤー。
 * からだ（OUTFITS）は つばさ の上・あたま の下に重ね、
 * あたま まわり（HATS）は くちばし の上に重ねる。
 * どのレイヤーも「無くても絵として成立する」ように、本体を隠さない形で描く。
 */
export const OUTFITS = {
  "aloha-shirt": () => `
    <g>
      <path d="M38 76 q24 -12 48 0 q3 24 -5 33 q-19 8 -38 0 q-8 -9 -5 -33 z" fill="#ff7b54"/>
      <path d="M54 74 l8 9 l8 -9" fill="none" stroke="#e8572f" stroke-width="2.6" stroke-linejoin="round"/>
      <circle cx="50" cy="94" r="3.4" fill="#ffe066"/>
      <circle cx="66" cy="102" r="3.4" fill="#ffe066"/>
      <circle cx="78" cy="88" r="3.4" fill="#ffe066"/>
    </g>`,
  "lei": () => `
    <g>
      ${[[38, 68], [44, 78], [54, 84], [66, 86], [78, 82], [86, 73]]
        .map(([x, y], i) => `
          <g transform="translate(${x} ${y})">
            ${[0, 72, 144, 216, 288].map((a) =>
              `<ellipse cx="0" cy="-3.6" rx="2.2" ry="3.6" fill="${i % 2 ? "#ff8fab" : "#ffd166"}" transform="rotate(${a})"/>`
            ).join("")}
            <circle r="1.6" fill="#fff6d8"/>
          </g>`).join("")}
    </g>`,
  "float-ring": () => `
    <g>
      <ellipse cx="60" cy="94" rx="40" ry="14" fill="none" stroke="#ff5d5d" stroke-width="11"/>
      <path d="M22 90 a40 14 0 0 1 12 -9" stroke="#fff3e6" stroke-width="11" fill="none"/>
      <path d="M86 103 a40 14 0 0 1 -12 8" stroke="#fff3e6" stroke-width="11" fill="none"/>
    </g>`,
  "backpack": () => `
    <g>
      <rect x="14" y="60" width="24" height="32" rx="9" fill="#4a7c59"/>
      <rect x="18" y="70" width="16" height="9" rx="4" fill="#77ab89"/>
      <path d="M36 68 q18 6 24 18 M36 80 q16 6 22 16" stroke="#3a6347" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>`,
};

export const HATS = {
  "straw-hat": () => `
    <g>
      <ellipse cx="62" cy="28" rx="37" ry="8.5" fill="#e0b876"/>
      <path d="M43 28 q19 -24 38 0 z" fill="#f2d79b"/>
      <path d="M45 26 q17 -7 34 0" stroke="#c98f3f" stroke-width="4" fill="none"/>
    </g>`,
  "sunglasses": () => `
    <g>
      <rect x="39" y="44" width="22" height="14" rx="7" fill="#22313f"/>
      <rect x="63" y="44" width="22" height="14" rx="7" fill="#22313f"/>
      <path d="M61 50 h2" stroke="#22313f" stroke-width="4"/>
      <path d="M39 50 h-6" stroke="#22313f" stroke-width="3" stroke-linecap="round"/>
      <path d="M43 47 q5 -2 9 0" stroke="#5b7086" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>`,
  "cap": () => `
    <g>
      <path d="M34 36 q28 -24 56 -2 q1 5 -1 7 h-55 z" fill="#3d8bfd"/>
      <path d="M89 41 q15 1 15 7 q-15 3 -17 -5 z" fill="#2f6fd0"/>
      <circle cx="62" cy="17" r="3.4" fill="#2f6fd0"/>
    </g>`,
  "snorkel-mask": () => `
    <g>
      <rect x="35" y="41" width="54" height="20" rx="9" fill="#9fd8f5" fill-opacity="0.55" stroke="#2b7fb8" stroke-width="2.6"/>
      <path d="M35 51 h-4" stroke="#2b7fb8" stroke-width="3" stroke-linecap="round"/>
      <path d="M89 46 q11 -3 11 -17" stroke="#ff9f1c" stroke-width="5.5" fill="none" stroke-linecap="round"/>
      <path d="M41 45 q6 -2 11 0" stroke="#e8f6ff" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    </g>`,
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
