/** 小さな DOM ヘルパー */

export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

/** タグ付きテンプレート: 埋め込み値を自動エスケープする。生 HTML は raw() で包む。 */
export function html(strings, ...vals) {
  return strings.reduce((out, str, i) => {
    if (i === 0) return str;
    const v = vals[i - 1];
    const s = v && v.__raw ? v.value : Array.isArray(v) ? v.map((x) => (x && x.__raw ? x.value : esc(x))).join("") : esc(v);
    return out + s + str;
  }, "");
}

export function raw(value) { return { __raw: true, value }; }

export function $(sel, root = document) { return root.querySelector(sel); }
export function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

/** クリックハンドラをまとめて割り当てる（data-act 属性ベース） */
export function on(root, act, handler) {
  $$(`[data-act="${act}"]`, root).forEach((node) => {
    node.addEventListener("click", (ev) => handler(ev, node));
  });
}

let toastTimer = null;
export function toast(message, ms = 2600) {
  const node = document.getElementById("toast");
  if (!node) return;
  node.textContent = message;
  node.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => node.classList.remove("is-on"), ms);
}
