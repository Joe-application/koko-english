import { html, raw, on, esc, $, $$, toast } from "../util/dom.js";
import { getProfiles, getActiveProfile, addProfile, switchProfile, deleteProfile,
         AVATAR_COLORS, updateActive } from "../store.js";
import { renderKoko } from "../character/koko.js";
import { go, back } from "../router.js";

const LEVELS = [
  { v: 1, label: "Easy（小学生むけ）", desc: "みじかい言い方。まずは通じることを目指す" },
  { v: 2, label: "Normal（中高生むけ）", desc: "学校で習う言い方。ふつうの会話ができる" },
  { v: 3, label: "Hard（大人むけ）", desc: "英文をかくして聞き取り訓練。自然な言い回し" },
];

function levelPicker(selected) {
  return LEVELS.map((l) => `
    <button type="button" class="level-opt" data-level="${l.v}" aria-pressed="${l.v === selected}">
      <b>${l.label}</b><span>${l.desc}</span>
    </button>`).join("");
}

function colorPicker(selected) {
  return AVATAR_COLORS.map((c) => `
    <button type="button" class="color-dot" data-color="${c}" style="background:${c}"
            aria-pressed="${c === selected}" aria-label="色 ${c}"></button>`).join("");
}

/* ---------- はじめての起動 ---------- */
export function renderWelcome(root) {
  if (getActiveProfile()) { go("/", { replace: true }); return; }
  root.innerHTML = html`
    <div style="text-align:center;padding-top:10px">
      <div class="koko-stage">${raw(renderKoko({ expression: "happy", size: 150 }))}</div>
      <h2 style="margin:12px 0 4px">はじめまして、ココだよ！</h2>
      <p class="hint" style="margin-top:0">グアム旅行まで、いっしょに英語を練習しよう。<br>まずは名前を教えてね。</p>
    </div>
    ${raw(formMarkup({ name: "", level: 2, color: AVATAR_COLORS[0] }, "はじめる"))}
  `;
  bindForm(root, (data) => {
    const p = addProfile(data);
    switchProfile(p.id);
    go("/", { replace: true });
  });
}

/* ---------- プロフィール一覧 ---------- */
export function renderProfiles(root) {
  const profiles = getProfiles();
  const active = getActiveProfile();
  if (!profiles.length) { go("/welcome", { replace: true }); return; }

  root.innerHTML = html`
    <div class="section-title">だれが使う？</div>
    <div class="prof-list">
      ${raw(profiles.map((p) => `
        <button class="prof" data-act="pick" data-id="${p.id}" aria-current="${p.id === active?.id}">
          <span class="prof-av" style="background:${esc(p.avatarColor)}">${esc((p.name || "?").slice(0, 1))}</span>
          <span style="flex:1">
            <span class="prof-name">${esc(p.name)}</span>
            <span class="prof-meta">${["Easy", "Normal", "Hard"][p.level - 1]} ・ ${p.totalPoints}pt ・ 今週 ${p.weekly?.points ?? 0}pt</span>
          </span>
          ${p.id === active?.id ? '<span style="color:var(--turquoise);font-weight:800">使用中</span>' : ""}
        </button>`).join(""))}
    </div>
    ${raw(profiles.length < 4
      ? '<div style="margin-top:14px"><button class="btn btn-sub" data-act="add">+ 家族を追加する</button></div>'
      : '<p class="hint" style="text-align:center">プロフィールは4人までです。</p>')}
    <div style="margin-top:10px"><button class="btn btn-ghost" data-act="close">とじる</button></div>
  `;

  on(root, "pick", (_, node) => { switchProfile(node.dataset.id); go("/", { replace: true }); });
  on(root, "add", () => go("/profile/new"));
  on(root, "close", () => back("/"));
}

/* ---------- 新規作成 ---------- */
export function renderNewProfile(root) {
  if (getProfiles().length >= 4) { go("/profiles", { replace: true }); return; }
  root.innerHTML = html`
    <div class="section-title">家族を追加</div>
    ${raw(formMarkup({ name: "", level: 2, color: AVATAR_COLORS[getProfiles().length % AVATAR_COLORS.length] }, "追加する"))}
    <div style="margin-top:10px"><button class="btn btn-ghost" data-act="cancel">やめる</button></div>
  `;
  on(root, "cancel", () => back("/profiles"));
  bindForm(root, (data) => { addProfile(data); go("/profiles", { replace: true }); });
}

/* ---------- 共通フォーム ---------- */
function formMarkup(init, submitLabel) {
  return `
    <div class="card">
      <div class="field">
        <label for="pname">なまえ</label>
        <input id="pname" type="text" maxlength="12" placeholder="たろう" value="${esc(init.name)}" autocomplete="off">
      </div>
      <div class="field">
        <label>アイコンの色</label>
        <div class="color-picker">${colorPicker(init.color)}</div>
      </div>
      <div class="field">
        <label>レベル（あとで変えられます）</label>
        <div class="level-picker">${levelPicker(init.level)}</div>
      </div>
      <button class="btn" data-act="submit">${esc(submitLabel)}</button>
    </div>`;
}

function bindForm(root, done) {
  let color = $(".color-dot[aria-pressed='true']", root)?.dataset.color || AVATAR_COLORS[0];
  let level = Number($(".level-opt[aria-pressed='true']", root)?.dataset.level || 2);

  $$(".color-dot", root).forEach((b) => {
    b.onclick = () => {
      color = b.dataset.color;
      $$(".color-dot", root).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    };
  });
  $$(".level-opt", root).forEach((b) => {
    b.onclick = () => {
      level = Number(b.dataset.level);
      $$(".level-opt", root).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    };
  });
  on(root, "submit", () => {
    const name = $("#pname", root).value.trim();
    if (!name) { toast("なまえを入れてね"); $("#pname", root).focus(); return; }
    done({ name, level, avatarColor: color });
  });
}

/* ---------- レベル変更（設定から使う） ---------- */
export function changeLevel(level) {
  updateActive((p) => { p.level = level; });
}

export { LEVELS, levelPicker };
export { deleteProfile };
