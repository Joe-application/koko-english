/**
 * 永続化の唯一の窓口。ここ以外から localStorage を触らないこと。
 */
const KEY = "kokoEnglish.v1";
const VERSION = 1;

export const AVATAR_COLORS = ["#ff9f1c", "#2ec4b6", "#e76f51", "#8367c7", "#3d8bfd", "#2a9d5c"];

/** 旅行初日（グアム着）。ホームのカウントダウンに使う。 */
export const TRIP_DATE = "2027-03-27";

let state = null;
let storageBroken = false;

/* ---------- 週 ID（ISO 週番号 / 月曜はじまり） ---------- */
export function weekIdOf(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  // 木曜日基準で ISO 週番号を求める
  const day = (d.getDay() + 6) % 7; // 月=0
  d.setDate(d.getDate() - day + 3);
  const firstThu = new Date(d.getFullYear(), 0, 4);
  const firstDay = (firstThu.getDay() + 6) % 7;
  firstThu.setDate(firstThu.getDate() - firstDay + 3);
  const week = 1 + Math.round((d - firstThu) / (7 * 864e5));
  return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function todayStr(date = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

export function daysUntilTrip() {
  const today = new Date(todayStr() + "T00:00:00");
  const trip = new Date(TRIP_DATE + "T00:00:00");
  return Math.max(0, Math.round((trip - today) / 864e5));
}

/* ---------- 初期値 ---------- */
function emptyState() {
  return {
    version: VERSION,
    activeProfileId: null,
    profiles: [],
    settings: { ttsRate: 0.9, ttsVoiceURI: null, sttEnabled: true, seEnabled: true, kokoPitch: 1.55, kokoVoiceURI: null, micAsked: false },
  };
}

export function newProfile({ name, level = 2, avatarColor = AVATAR_COLORS[0] }) {
  return {
    id: "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
    name,
    level,
    avatarColor,
    createdAt: todayStr(),
    coins: 0,
    totalPoints: 0,
    weekly: { weekId: weekIdOf(), points: 0 },
    lastPlayedDate: null,
    streak: 0,
    scenarios: {},
    items: [],
    equipped: { outfit: null, hat: null },
    favorites: [],
    rivals: [],
  };
}

/* ---------- 読み書き ---------- */
function migrate(raw) {
  // 将来バージョンが上がったときの入り口。現状は何もしない。
  if (!raw || typeof raw !== "object") return emptyState();
  if (raw.version !== VERSION) raw.version = VERSION;
  const base = emptyState();
  return {
    ...base,
    ...raw,
    settings: { ...base.settings, ...(raw.settings || {}) },
    profiles: Array.isArray(raw.profiles) ? raw.profiles : [],
  };
}

export function load() {
  if (state) return state;
  try {
    const raw = localStorage.getItem(KEY);
    state = migrate(raw ? JSON.parse(raw) : null);
  } catch (err) {
    console.error("[store] 読み込みに失敗しました", err);
    state = emptyState();
    storageBroken = true;
  }
  return state;
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    storageBroken = false;
  } catch (err) {
    console.error("[store] 保存に失敗しました", err);
    storageBroken = true;
    window.dispatchEvent(new CustomEvent("store:error", {
      detail: "記録を保存できませんでした。ブラウザのプライベートモードを解除するか、空き容量を確認してください。",
    }));
  }
}

export function isStorageBroken() { return storageBroken; }

/** state を書き換えて保存する。唯一の更新経路。 */
export function update(fn) {
  const s = load();
  fn(s);
  persist();
  window.dispatchEvent(new CustomEvent("store:change"));
  return s;
}

/* ---------- プロフィール ---------- */
export function getProfiles() { return load().profiles; }

export function getActiveProfile() {
  const s = load();
  return s.profiles.find((p) => p.id === s.activeProfileId) || null;
}

export function addProfile(data) {
  const p = newProfile(data);
  update((s) => {
    s.profiles.push(p);
    if (!s.activeProfileId) s.activeProfileId = p.id;
  });
  return p;
}

export function switchProfile(id) {
  update((s) => { if (s.profiles.some((p) => p.id === id)) s.activeProfileId = id; });
}

export function deleteProfile(id) {
  update((s) => {
    s.profiles = s.profiles.filter((p) => p.id !== id);
    if (s.activeProfileId === id) s.activeProfileId = s.profiles[0]?.id || null;
  });
}

/** アクティブなプロフィールを書き換える。週またぎのリセットもここで面倒を見る。 */
export function updateActive(fn) {
  update((s) => {
    const p = s.profiles.find((x) => x.id === s.activeProfileId);
    if (!p) return;
    rolloverWeek(p);
    fn(p);
  });
}

function rolloverWeek(p) {
  const wid = weekIdOf();
  if (!p.weekly || p.weekly.weekId !== wid) p.weekly = { weekId: wid, points: 0 };
}

/** 画面表示前に呼び、週またぎを反映させる。 */
export function refreshActive() {
  const p = getActiveProfile();
  if (!p) return null;
  if (!p.weekly || p.weekly.weekId !== weekIdOf()) updateActive(() => {});
  return getActiveProfile();
}

/* ---------- 設定 ---------- */
export function getSettings() { return load().settings; }
export function setSetting(key, value) { update((s) => { s.settings[key] = value; }); }

/* ---------- バックアップ ---------- */
export function exportJSON() { return JSON.stringify(load()); }

export function importJSON(text) {
  const parsed = JSON.parse(text);
  if (!parsed || !Array.isArray(parsed.profiles)) throw new Error("形式が違います");
  state = migrate(parsed);
  persist();
  window.dispatchEvent(new CustomEvent("store:change"));
}
