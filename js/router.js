/** hash ベースの軽量ルーター。 `#/scenario/airplane` のような形。 */

const routes = [];
let current = null;

export function route(pattern, handler) {
  const names = [];
  const rx = new RegExp(
    "^" + pattern.replace(/:([A-Za-z]+)/g, (_, n) => { names.push(n); return "([^/]+)"; }) + "$"
  );
  routes.push({ rx, names, handler, pattern });
}

export function path() {
  const h = location.hash.replace(/^#/, "");
  return h.startsWith("/") ? h : "/";
}

export function go(to, { replace = false } = {}) {
  const target = "#" + to;
  if (location.hash === target) { render(); return; }
  if (replace) location.replace(target);
  else location.hash = target;
}

export function back(fallback = "/") {
  if (history.length > 1) history.back();
  else go(fallback, { replace: true });
}

export function currentRoute() { return current; }

export async function render() {
  const p = path();
  for (const r of routes) {
    const m = p.match(r.rx);
    if (!m) continue;
    const params = {};
    r.names.forEach((n, i) => { params[n] = decodeURIComponent(m[i + 1]); });
    current = { pattern: r.pattern, path: p, params };
    const view = document.getElementById("view");
    view.innerHTML = "";
    window.scrollTo(0, 0);
    try {
      await r.handler(view, params);
    } catch (err) {
      console.error("[router] 画面の表示に失敗しました", err);
      view.innerHTML = '<div class="empty">画面を表示できませんでした。<br>もう一度お試しください。</div>';
    }
    return;
  }
  go("/", { replace: true });
}

export function start() {
  window.addEventListener("hashchange", render);
  render();
}
