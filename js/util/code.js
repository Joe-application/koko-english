/**
 * 家族対戦のスコア共有コード。
 *
 * サーバーを持たないので、今週の成績を短い文字列にしてLINE等で送り合う。
 * 目的は改ざん防止ではなく「貼り付けミスの検出」なので、暗号強度は不要。
 * ただし読み込む側にとっては外から来たデータなので、必ず検証してから使う。
 *
 *   KE1.<base64url(なまえ)>.<週ID>.<ポイント>.<チェックサム>
 *
 * 週ID とポイントは ASCII で URL 安全なのでそのまま入れる。
 * なまえだけ日本語が入りうるので base64url にする。
 */

const PREFIX = "KE1";
const NAME_MAX = 8;      // 全体を60文字以内に収めるため、共有時は名前を切り詰める
const POINTS_MAX = 999999;

function b64u(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function unb64u(s) {
  let t = s.replace(/-/g, "+").replace(/_/g, "/");
  while (t.length % 4) t += "=";
  const bin = atob(t);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** 貼り付けミスを見つけるための簡易チェックサム（36進数2桁） */
function checksum(payload) {
  let sum = 0;
  for (let i = 0; i < payload.length; i++) sum = (sum + payload.charCodeAt(i) * (i + 1)) % 1296;
  return sum.toString(36).padStart(2, "0");
}

/**
 * 共有コードを作る。
 * @param {{name:string, weekId:string, points:number}} data
 */
export function encodeScore({ name, weekId, points }) {
  const safeName = String(name || "?").slice(0, NAME_MAX);
  const pts = Math.max(0, Math.min(POINTS_MAX, Math.round(points || 0)));
  const payload = `${PREFIX}.${b64u(safeName)}.${weekId}.${pts}`;
  return `${payload}.${checksum(payload)}`;
}

/**
 * 共有コードを読む。外部入力なので、形式・チェックサム・値の範囲をすべて検証する。
 * @returns {{ok:true, name:string, weekId:string, points:number} | {ok:false, error:string}}
 */
export function decodeScore(text) {
  const raw = String(text || "").trim();
  // 前後に説明文が付いたまま貼られることが多いので、コードらしい部分だけ拾う
  const m = raw.match(/KE1\.[A-Za-z0-9\-_]+\.\d{4}-W\d{2}\.\d+\.[a-z0-9]{2}/);
  if (!m) return { ok: false, error: "コードの形が違うようです。KE1. で始まる部分をそのまま貼り付けてください。" };

  const code = m[0];
  const parts = code.split(".");
  if (parts.length !== 5) return { ok: false, error: "コードの形が違うようです。" };

  const [, nameB64, weekId, ptsStr, chk] = parts;
  const payload = parts.slice(0, 4).join(".");
  if (checksum(payload) !== chk) {
    return { ok: false, error: "コードが途中で欠けているようです。もう一度そのままコピーして貼り付けてください。" };
  }

  let name;
  try { name = unb64u(nameB64); } catch { return { ok: false, error: "なまえを読み取れませんでした。" }; }
  if (!name) return { ok: false, error: "なまえが空でした。" };

  const points = Number(ptsStr);
  if (!Number.isFinite(points) || points < 0 || points > POINTS_MAX) {
    return { ok: false, error: "ポイントの値がおかしいようです。" };
  }

  return { ok: true, name: name.slice(0, NAME_MAX), weekId, points };
}

/** LINE などにそのまま貼れる共有文を作る */
export function shareText({ name, weekId, points }) {
  return [
    "🏝 ココイングリッシュ 今週の成績",
    `${name} / ${weekId} / ${points}pt`,
    "↓このコードをアプリの「家族」画面に貼ってね",
    encodeScore({ name, weekId, points }),
  ].join("\n");
}
