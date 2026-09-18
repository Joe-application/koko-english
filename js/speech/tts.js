/**
 * 読み上げ（Web Speech Synthesis）。
 * iOS Safari の癖に合わせた実装ルールは SPEC.md §7.1 を参照。
 */
import { getSettings } from "../store.js";

const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

let voices = [];
let unlocked = false;
let ready = false;

export function isSupported() {
  return !!synth && typeof window.SpeechSynthesisUtterance === "function";
}

/** iOS は音声リストが非同期で届くため voiceschanged を待つ。 */
export function init() {
  if (!isSupported()) return;
  const pull = () => {
    const list = synth.getVoices();
    if (list && list.length) {
      const had = ready;
      voices = list;
      ready = true;
      if (!had) window.dispatchEvent(new CustomEvent("tts:voices"));
    }
  };
  pull();
  synth.addEventListener?.("voiceschanged", pull);
  // Safari で voiceschanged が飛ばないことがあるので数回だけ追いかける
  // Safari は voiceschanged が飛ばないことがあるので、しばらく追いかける
  let tries = 0;
  const timer = setInterval(() => {
    pull();
    if (ready || ++tries > 40) clearInterval(timer);
  }, 250);
}

/** iOS は最初の発話がユーザー操作起点でないと鳴らない。最初のタップで無音発話を流して解錠する。 */
export function unlock() {
  if (unlocked || !isSupported()) return;
  try {
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    synth.speak(u);
    unlocked = true;
  } catch (err) {
    console.warn("[tts] unlock に失敗", err);
  }
}

export function listEnglishVoices() {
  return voices.filter((v) => /^en/i.test(v.lang));
}

/**
 * macOS / iOS はジョーク用の音声（Albert, Zarvox, Bubbles …）も同じ一覧に混ぜてくる。
 * これらを選ぶと不気味・不明瞭になり、教材としても成立しないので除外する。
 */
const NOVELTY = [
  "albert", "bad news", "bahh", "bells", "boing", "bubbles", "cellos", "deranged",
  "good news", "hysterical", "jester", "junior", "kathy", "organ", "pipe organ",
  "princess", "ralph", "superstar", "trinoids", "whisper", "wobble", "zarvox",
  "bruce", "fred", "grandma", "grandpa", "rocko", "sandy", "shelley", "flo", "eddy", "reed",
  "ささやき声", "オルガン", "スーパースター", "トリノイド", "ベル", "道化", "震え", "うめき声",
];

/** 教材の読み上げに向く、聞き取りやすい音声（前にあるものほど優先） */
const GOOD = [
  "samantha", "ava", "allison", "susan", "alex", "tom", "nicky", "aaron",
  "google us english", "microsoft aria", "microsoft jenny", "microsoft zira",
  "daniel", "karen", "moira", "tessa",
];

/** ココの声に向く、明るく親しみやすい音声 */
const FRIENDLY = ["samantha", "ava", "allison", "nicky", "karen", "google us english", "microsoft aria"];

function isNovelty(v) {
  const n = v.name.toLowerCase();
  return NOVELTY.some((bad) => n.includes(bad));
}

function byPreference(list, prefs) {
  for (const want of prefs) {
    const hit = list.find((v) => v.name.toLowerCase().includes(want));
    if (hit) return hit;
  }
  return null;
}

/** 好みの順に英語の音声を1つ選ぶ。ジョーク音声は最後の手段としても選ばない。 */
function chooseVoice({ savedURI, prefs }) {
  const en = listEnglishVoices();
  if (!en.length) return null;
  if (savedURI) {
    const saved = en.find((v) => v.voiceURI === savedURI);
    if (saved) return saved;
  }
  const usable = en.filter((v) => !isNovelty(v));
  const pool = usable.length ? usable : en;
  const us = pool.filter((v) => /^en[-_]us/i.test(v.lang));

  return (
    byPreference(us, prefs) ||
    byPreference(pool, prefs) ||
    us.find((v) => v.default) ||
    pool.find((v) => v.default) ||
    us[0] ||
    pool[0]
  );
}

function pickVoice() {
  return chooseVoice({ savedURI: getSettings().ttsVoiceURI, prefs: GOOD });
}

/** いま実際に使われる音声（設定画面の表示用） */
export function currentVoice() { return pickVoice(); }

/**
 * 英文を読み上げる。
 * @param {string} text
 * @param {{slow?: boolean, rate?: number}} opts
 * @returns {Promise<void>} 読み終わり（またはエラー）で解決する
 */
export function speak(text, { slow = false, rate, pitch = 1, voice } = {}) {
  return new Promise((resolve) => {
    if (!isSupported() || !text) return resolve();
    const settings = getSettings();
    try {
      // iOS でキューが詰まって無音になるのを防ぐ
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = voice || pickVoice();
      if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "en-US"; }
      const base = rate ?? settings.ttsRate ?? 0.9;
      u.rate = slow ? Math.max(0.1, base * 0.65) : base;
      u.pitch = pitch;
      let done = false;
      const finish = () => { if (!done) { done = true; resolve(); } };
      u.onend = finish;
      u.onerror = (e) => { console.warn("[tts] 読み上げエラー", e.error); finish(); };
      // onend が飛ばない環境への保険（文字数からおおよその上限を見積もる）
      setTimeout(finish, Math.min(20000, 1800 + text.length * 110));
      synth.speak(u);
    } catch (err) {
      console.warn("[tts] speak に失敗", err);
      resolve();
    }
  });
}

export function stop() {
  if (isSupported()) { try { synth.cancel(); } catch { /* noop */ } }
}

/* ---------- ココの声 ---------- */
/**
 * ココがしゃべるときは、教材の読み上げとは別の声にする。
 * 低くゆっくりだと不気味に聞こえるので、高め・ふつうの速さの子どもっぽい声にする。
 */
function pickKokoVoice() {
  return chooseVoice({ savedURI: getSettings().kokoVoiceURI, prefs: FRIENDLY });
}

export function currentKokoVoice() { return pickKokoVoice(); }

export function speakKoko(text) {
  const { kokoPitch = 1.55 } = getSettings();
  return speak(text, { rate: 1.0, pitch: kokoPitch, voice: pickKokoVoice() });
}

/**
 * 読み上げが実際に鳴るかを確かめる。
 * speechSynthesis は「対応しているのに音が出ない」ことがある（ブラウザの自動再生制限、
 * 音声が1つも入っていない端末、アプリ内ブラウザなど）。押しても無音、という状態を
 * ユーザーが自力で切り分けられるようにするための検査。必ずタップから呼ぶこと。
 * @returns {Promise<{ok:boolean, reason:string, voice:string|null}>}
 */
export function diagnose() {
  return new Promise((resolve) => {
    if (!isSupported()) return resolve({ ok: false, reason: "このブラウザは読み上げに対応していません", voice: null });
    const v = pickVoice();
    if (!voices.length) return resolve({ ok: false, reason: "この端末に音声が1つも入っていません", voice: null });
    if (!listEnglishVoices().length) return resolve({ ok: false, reason: "英語の音声が入っていません", voice: null });

    let started = false;
    try { synth.cancel(); } catch { /* noop */ }
    const u = new SpeechSynthesisUtterance("Hello");
    if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = "en-US"; }
    u.onstart = () => { started = true; };
    synth.speak(u);
    setTimeout(() => {
      if (started) resolve({ ok: true, reason: "読み上げは正常に鳴っています", voice: v?.name || null });
      else resolve({ ok: false, reason: "音声は用意できましたが、再生が始まりませんでした。端末のサイレントスイッチ・音量、またはブラウザの自動再生設定を確認してください", voice: v?.name || null });
    }, 2000);
  });
}
