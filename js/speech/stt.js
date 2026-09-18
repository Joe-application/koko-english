/**
 * 音声認識（Web Speech Recognition）と マイク許可。
 * 実装ルールと「使えないときは必ず自己採点へ倒す」方針は SPEC.md §7.2 / §7.4 を参照。
 */
import { getSettings, setSetting } from "../store.js";

const SR = typeof window !== "undefined"
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null;

const TIMEOUT_MS = 8000;

export function isSupported() { return !!SR; }

export function isOnline() { return navigator.onLine !== false; }

/** 音声認識を使える状態か（対応・設定・通信） */
export function isUsable() {
  return isSupported() && getSettings().sttEnabled !== false && isOnline();
}

/** なぜ使えないのかを日本語で返す。使える場合は null。 */
export function unusableReason() {
  if (!isSupported()) return "このブラウザは音声認識に対応していません";
  if (getSettings().sttEnabled === false) return "設定で音声認識をオフにしています";
  if (!isOnline()) return "音声認識にはインターネット接続が必要です";
  return null;
}

/* ---------- マイクの使用許可 ---------- */

/** 'granted' | 'denied' | 'prompt' | 'unknown' */
export async function micPermission() {
  try {
    if (!navigator.permissions?.query) return "unknown";
    const st = await navigator.permissions.query({ name: "microphone" });
    return st.state;
  } catch {
    return "unknown";
  }
}

/**
 * マイクの使用許可をユーザーに求める。必ずタップなどの操作から呼ぶこと。
 * @returns {Promise<{ok:boolean, reason?:string, message?:string}>}
 */
export async function requestMic() {
  setSetting("micAsked", true);
  if (!navigator.mediaDevices?.getUserMedia) {
    return { ok: false, reason: "unsupported", message: "このブラウザではマイクを使えません" };
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop()); // 許可の確認だけなのですぐ止める
    return { ok: true };
  } catch (err) {
    const map = {
      NotAllowedError: "マイクの使用が許可されませんでした。ブラウザの設定から許可してください。",
      SecurityError: "マイクの使用が許可されませんでした。ブラウザの設定から許可してください。",
      NotFoundError: "マイクが見つかりませんでした。",
      NotReadableError: "マイクを他のアプリが使っているようです。",
    };
    return { ok: false, reason: err.name, message: map[err.name] || "マイクを使えませんでした。" };
  }
}

/* ---------- 認識 ---------- */

/**
 * 一度だけ聞き取る。
 * @param {{onInterim?:(text:string)=>void, onStart?:()=>void}} hooks
 * @returns {Promise<{ok:boolean, alternatives?:string[], error?:string, message?:string}>}
 */
export function listenOnce({ onInterim, onStart } = {}) {
  return new Promise((resolve) => {
    if (!isSupported()) {
      return resolve({ ok: false, error: "unsupported", message: "このブラウザは音声認識に対応していません" });
    }
    let rec;
    try { rec = new SR(); } catch (err) {
      return resolve({ ok: false, error: "init", message: "マイクを起動できませんでした" });
    }

    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 3;

    let settled = false;
    let got = null;
    const finish = (payload) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { rec.abort(); } catch { /* noop */ }
      resolve(payload);
    };

    const timer = setTimeout(() => {
      // 8秒で自動停止。無音のままなら減点せずに終える。
      if (got) finish({ ok: true, alternatives: got });
      else finish({ ok: false, error: "no-speech", message: "聞こえなかったみたい。もう一度話してみて。" });
    }, TIMEOUT_MS);

    rec.onstart = () => onStart?.();

    rec.onresult = (ev) => {
      const last = ev.results[ev.results.length - 1];
      if (!last) return;
      if (last.isFinal) {
        got = Array.from(last).map((alt) => alt.transcript).filter(Boolean);
        finish({ ok: true, alternatives: got });
      } else {
        onInterim?.(last[0]?.transcript || "");
      }
    };

    rec.onerror = (ev) => {
      const e = ev.error;
      if (e === "no-speech" || e === "aborted") {
        return finish({ ok: false, error: e, message: "聞こえなかったみたい。もう一度話してみて。" });
      }
      if (e === "not-allowed" || e === "service-not-allowed") {
        return finish({ ok: false, error: "not-allowed", message: "マイクの使用が許可されていません。" });
      }
      if (e === "network") {
        return finish({ ok: false, error: "network", message: "ネットにつながっていないと採点できません。" });
      }
      finish({ ok: false, error: e || "unknown", message: "うまく聞き取れませんでした。" });
    };

    rec.onend = () => {
      if (settled) return;
      if (got) finish({ ok: true, alternatives: got });
      else finish({ ok: false, error: "no-speech", message: "聞こえなかったみたい。もう一度話してみて。" });
    };

    try { rec.start(); } catch (err) {
      finish({ ok: false, error: "start", message: "マイクを起動できませんでした" });
    }
  });
}
