import airplane from "./scenarios/01-airplane.js";
import immigration from "./scenarios/02-immigration.js";

/**
 * 全シナリオ。order の昇順に並べる。
 * Phase 5 で 12 本まで増やす（SPEC.md §6.1）。
 */
export const scenarios = [airplane, immigration].sort((a, b) => a.order - b.order);

export const scenarioMap = Object.fromEntries(scenarios.map((s) => [s.id, s]));

export function getScenario(id) { return scenarioMap[id] || null; }

/** そのプロフィールでシナリオが解放済みか */
export function isUnlocked(scenario, profile) {
  const list = scenario.unlockAfter || [];
  if (!list.length) return true;
  return list.every((id) => profile?.scenarios?.[id]?.cleared);
}

/** 次にやるべきシナリオ（未クリアで解放済みの最初の1本。全部クリア済みなら最低スコアのもの） */
export function recommendNext(profile) {
  const unlocked = scenarios.filter((s) => isUnlocked(s, profile));
  const fresh = unlocked.find((s) => !profile?.scenarios?.[s.id]?.cleared);
  if (fresh) return fresh;
  return unlocked.slice().sort(
    (a, b) => (profile.scenarios[a.id]?.bestScore ?? 0) - (profile.scenarios[b.id]?.bestScore ?? 0)
  )[0] || scenarios[0];
}
