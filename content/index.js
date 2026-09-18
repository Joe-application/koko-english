import airplane from "./scenarios/01-airplane.js";
import immigration from "./scenarios/02-immigration.js";
import taxiHotel from "./scenarios/03-taxi-hotel.js";
import hotelCheckin from "./scenarios/04-hotel-checkin.js";
import restaurant from "./scenarios/05-restaurant.js";
import fastfood from "./scenarios/06-fastfood.js";
import shopping from "./scenarios/07-shopping.js";
import beach from "./scenarios/08-beach.js";
import directions from "./scenarios/09-directions.js";
import trouble from "./scenarios/10-trouble.js";
import smalltalk from "./scenarios/11-smalltalk.js";
import souvenir from "./scenarios/12-souvenir.js";

/** 全シナリオ。旅程の順（order の昇順）に並べる。 */
export const scenarios = [
  airplane, immigration, taxiHotel, hotelCheckin, restaurant, fastfood,
  shopping, beach, directions, trouble, smalltalk, souvenir,
].sort((a, b) => a.order - b.order);

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
