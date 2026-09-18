/**
 * バッジの判定。
 * バッジは「達成した瞬間」を持たず、プロフィールの状態から毎回計算できる形にしてある。
 * こうしておくと、あとから条件を足したり直したりしても、過去の記録から自然に付与される。
 */
import { itemMap, itemsOfType } from "../content/items.js";
import { scenarios } from "../content/index.js";

const RULES = {
  "first-step": (p) => clearedCount(p) >= 1,
  "perfect": (p) => Object.values(p.scenarios || {}).some((s) => s.bestScore >= 100),
  "streak-3": (p) => (p.streak || 0) >= 3,
  "streak-7": (p) => (p.streak || 0) >= 7,
  "point-500": (p) => (p.totalPoints || 0) >= 500,
  "point-2000": (p) => (p.totalPoints || 0) >= 2000,
  "collector": (p) => ownedOfType(p, "souvenir") >= 5,
  "dresser": (p) => ownedOfType(p, "outfit") >= 3,
  "review-master": (p) => Object.values(p.scenarios || {}).some((s) => (s.plays || 0) >= 3),
  "all-clear": (p) => scenarios.length > 0 && clearedCount(p) >= scenarios.length,
};

function clearedCount(p) {
  return scenarios.filter((s) => p.scenarios?.[s.id]?.cleared).length;
}

function ownedOfType(p, type) {
  return (p.items || []).filter((id) => itemMap[id]?.type === type).length;
}

/** いま条件を満たしているバッジの id 一覧 */
export function earnedBadges(profile) {
  if (!profile) return [];
  return itemsOfType("badge").map((b) => b.id).filter((id) => RULES[id]?.(profile));
}

/** まだ持っていない、かつ条件を満たしたバッジ */
export function newlyEarnedBadges(profile) {
  const have = new Set(profile?.items || []);
  return earnedBadges(profile).filter((id) => !have.has(id));
}

/** 進み具合の表示用（「5こ中3こ」のような表示に使う） */
export function badgeProgress(profile) {
  const all = itemsOfType("badge");
  return { earned: earnedBadges(profile).length, total: all.length };
}
