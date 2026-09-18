/** スコア集計とごほうびの計算。SPEC.md §8.1 */
import { updateActive, getActiveProfile, todayStr } from "./store.js";
import { getScenario } from "../content/index.js";
import { newlyEarnedBadges } from "./badges.js";

let lastResult = null;
export function getLastResult() { return lastResult; }

/**
 * シナリオ終了時の処理。
 * @param {string} scenarioId
 * @param {number[]} scores 各ユーザーターンの 0-100
 */
export function finishScenario(scenarioId, scores) {
  const scenario = getScenario(scenarioId);
  const score = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const today = todayStr();

  const before = getActiveProfile();
  const rec = before?.scenarios?.[scenarioId];
  const isFirstClear = !rec?.cleared;
  const playsToday = rec?.lastPlayed === today ? (rec.playsToday || 0) : 0;

  // 周回で荒稼ぎさせない: 2回目は半分、その日3回目以降はポイントなし（練習は自由）
  let rate = 1;
  if (rec?.plays > 0) rate = 0.5;
  if (playsToday >= 2) rate = 0;

  const points = Math.floor((30 + score * 0.5) * rate);
  const coins = Math.floor(points / 3);

  const newItems = [];
  if (isFirstClear && scenario?.reward?.item) newItems.push(scenario.reward.item);

  updateActive((p) => {
    const prev = p.scenarios[scenarioId] || { cleared: false, bestScore: 0, plays: 0, playsToday: 0 };
    p.scenarios[scenarioId] = {
      cleared: true,
      bestScore: Math.max(prev.bestScore || 0, score),
      plays: (prev.plays || 0) + 1,
      playsToday: playsToday + 1,
      lastPlayed: today,
    };
    p.totalPoints += points;
    p.weekly.points += points;
    p.coins += coins;
    newItems.forEach((id) => { if (!p.items.includes(id)) p.items.push(id); });

    // 連続日数
    if (p.lastPlayedDate !== today) {
      const yesterday = new Date(Date.now() - 864e5);
      const y = todayStr(yesterday);
      p.streak = p.lastPlayedDate === y ? (p.streak || 0) + 1 : 1;
      p.lastPlayedDate = today;
    }
  });

  // おみやげ・ポイント・連続日数が確定したあとでバッジを判定する。
  // 順番が逆だと「おみやげ5こ」のようなバッジが1回ぶん遅れて付く。
  const newBadges = newlyEarnedBadges(getActiveProfile());
  if (newBadges.length) {
    updateActive((p) => {
      newBadges.forEach((id) => { if (!p.items.includes(id)) p.items.push(id); });
    });
  }

  lastResult = { scenarioId, score, points, coins, newItems, newBadges, isFirstClear, noPoints: rate === 0 };
  return lastResult;
}
