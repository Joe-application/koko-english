/**
 * ココの SVG から PWA 用アイコンを書き出す。
 * キャラの見た目を変えたら、これを実行してアイコンも作り直す。
 *
 *   node tools/make-icons.mjs
 *
 * rsvg-convert（librsvg）が必要。macOS なら `brew install librsvg`。
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { renderKoko } from "../js/character/koko.js";

const OUT = new URL("../icons/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

// ココ本体（130x130 の座標系）を、余白をとって背景の上に載せる
const koko = renderKoko({ expression: "happy", size: 130 })
  .replace(/<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "");

const iconSvg = `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2ec4b6"/>
      <stop offset="1" stop-color="#1f9c90"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <ellipse cx="256" cy="430" rx="150" ry="26" fill="#14213d" fill-opacity="0.12"/>
  <g transform="translate(76 72) scale(2.77)">${koko}</g>
</svg>`;

const svgPath = OUT + "koko.svg";
writeFileSync(svgPath, iconSvg);

// maskable 用は、丸く切られても欠けないように内側に寄せる（安全領域は中央80%）
const maskableSvg = iconSvg
  .replace('<rect width="512" height="512" rx="112"', '<rect width="512" height="512" rx="0"')
  .replace('transform="translate(76 72) scale(2.77)"', 'transform="translate(115 112) scale(2.17)"')
  .replace('<ellipse cx="256" cy="430" rx="150" ry="26"', '<ellipse cx="256" cy="392" rx="118" ry="20"');
const maskablePath = OUT + "koko-maskable.svg";
writeFileSync(maskablePath, maskableSvg);

for (const [src, name, size] of [
  [svgPath, "icon-192.png", 192],
  [svgPath, "icon-512.png", 512],
  [svgPath, "apple-touch-icon.png", 180],
  [maskablePath, "icon-maskable-512.png", 512],
]) {
  execFileSync("rsvg-convert", ["-w", String(size), "-h", String(size), "-o", OUT + name, src]);
  console.log("書き出し:", name, `${size}x${size}`);
}
