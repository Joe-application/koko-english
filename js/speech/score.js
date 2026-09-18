/** 発話の採点。SPEC.md §7.3 */
import { tokenize, lcs } from "../util/text.js";

/**
 * 1 候補ぶんの採点。
 * @param {string} said 認識されたテキスト
 * @param {string} target お手本の英文
 * @param {string[]} keywords 必須語（レベル1では無視される）
 * @param {number} level
 */
export function scoreOne(said, target, keywords = [], level = 2) {
  const t = tokenize(target);
  const s = tokenize(said);
  if (!t.length) return { score: 0, ratio: 0, targetHit: [], saidHit: [], missingKeywords: [], t, s };

  const { length, targetHit, saidHit } = lcs(t, s);
  let ratio = length / Math.max(t.length, s.length);

  const saidSet = new Set(s);
  const missingKeywords = level === 1
    ? []
    : keywords.filter((k) => !tokenize(k).every((tok) => saidSet.has(tok)));

  if (keywords.length && level !== 1) {
    if (missingKeywords.length) ratio *= 0.8;
    else ratio = Math.min(1, ratio + 0.1);
  }

  return {
    score: Math.round(Math.max(0, Math.min(1, ratio)) * 100),
    ratio, targetHit, saidHit, missingKeywords, t, s,
  };
}

/**
 * 認識の揺れで理不尽に減点しないよう、候補のうち最高点を採用する。
 * @param {string[]} alternatives
 */
export function scoreBest(alternatives, target, keywords = [], level = 2) {
  const results = (alternatives || []).filter(Boolean).map((a) => ({ said: a, ...scoreOne(a, target, keywords, level) }));
  if (!results.length) return null;
  return results.reduce((best, r) => (r.score > best.score ? r : best), results[0]);
}

export function verdict(score) {
  if (score >= 90) return { label: "Perfect! 完璧！", mood: "cheer", ok: true };
  if (score >= 70) return { label: "Good! 通じるよ", mood: "happy", ok: true };
  if (score >= 50) return { label: "もう少し！", mood: "normal", ok: false };
  return { label: "もう一度いこう", mood: "normal", ok: false };
}

/** 正解文を、言えた語／言えなかった語に色分けするための HTML を作る */
export function diffHtml(result) {
  if (!result) return "";
  const words = result.t.map((w, i) =>
    `<span class="${result.targetHit[i] ? "w-ok" : "w-miss"}">${w}</span>`
  ).join(" ");
  const extras = result.s.filter((_, i) => !result.saidHit[i]);
  const extraHtml = extras.length
    ? `<div class="diff-extra">よけいに聞こえた言葉: ${extras.map((w) => `<span class="w-extra">${w}</span>`).join(" ")}</div>`
    : "";
  return `<div class="diff">${words}</div>${extraHtml}`;
}
