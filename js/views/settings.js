import { html, raw, on, esc, $, $$, toast } from "../util/dom.js";
import { refreshActive, getSettings, setSetting, exportJSON, importJSON,
         deleteProfile, getProfiles, TRIP_DATE } from "../store.js";
import { levelPicker, changeLevel } from "./profile.js";
import * as tts from "../speech/tts.js";
import * as stt from "../speech/stt.js";
import { go } from "../router.js";

export function render(root) {
  const p = refreshActive();
  if (!p) { go("/welcome", { replace: true }); return; }
  const s = getSettings();
  const voices = tts.listEnglishVoices();
  const inUse = tts.currentVoice();
  const kokoInUse = tts.currentKokoVoice();

  root.innerHTML = html`
    <div class="card">
      <div class="section-title">レベル</div>
      <div class="level-picker">${raw(levelPicker(p.level))}</div>
      <p class="hint">変えても、これまでの記録はそのまま残ります。</p>
    </div>

    <div class="card">
      <div class="section-title">読み上げ</div>
      <div class="field">
        <label>スピード</label>
        <div class="btn-row">
          ${raw([[0.7, "ゆっくり"], [0.85, "ふつう"], [1.0, "はやい"]].map(([v, l]) =>
            `<button class="btn btn-sub" data-rate="${v}" ${Math.abs(s.ttsRate - v) < 0.01 ? 'style="border-color:var(--turquoise)"' : ""}>${l}</button>`
          ).join(""))}
        </div>
      </div>
      <div class="field">
        <label for="voice">声</label>
        ${raw(voices.length
          ? `<select id="voice">
               <option value="">おまかせ（いま: ${esc(inUse?.name || "—")}）</option>
               ${voices.map((v) => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === s.ttsVoiceURI ? "selected" : ""}>${esc(v.name)} (${esc(v.lang)})</option>`).join("")}
             </select>`
          : '<p class="hint" style="margin:0">英語の声をまだ読み込めていません。数秒待つか、端末の設定で英語の音声を追加してください。</p>')}
      </div>
      <button class="btn btn-sub" data-act="test">🔊 テスト再生</button>
    </div>

    <div class="card">
      <div class="section-title">ココの声</div>
      <p class="hint" style="margin-top:0">ココがしゃべるときの声の高さ。高いほど子どもっぽくなります。</p>
      <div class="btn-row">
        ${raw([[1.2, "ひくめ"], [1.55, "ふつう"], [1.9, "とても高い"]].map(([v, l]) =>
          `<button class="btn btn-sub" data-pitch="${v}" ${Math.abs((s.kokoPitch ?? 1.55) - v) < 0.01 ? 'style="border-color:var(--turquoise)"' : ""}>${l}</button>`
        ).join(""))}
      </div>
      ${raw(voices.length
        ? `<div class="field" style="margin-top:12px">
             <label for="kokoVoice">ココの声</label>
             <select id="kokoVoice">
               <option value="">おまかせ（いま: ${esc(kokoInUse?.name || "—")}）</option>
               ${voices.map((v) => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === s.kokoVoiceURI ? "selected" : ""}>${esc(v.name)} (${esc(v.lang)})</option>`).join("")}
             </select>
           </div>`
        : "")}
      <div style="margin-top:10px"><button class="btn btn-sub" data-act="testKoko">🔊 ココの声を聞く</button></div>
    </div>

    <div class="card">
      <div class="section-title">マイク・発音チェック</div>
      <p class="perm-state" id="permState">確認中…</p>
      <p class="hint" style="margin-top:0">
        発音チェックを使うには、マイクの使用を許可してください。<br>
        ※ 音声認識はインターネット接続が必要です。つながっていないときは自動で「自己採点」に切り替わります。
      </p>
      <div class="btn-row">
        <button class="btn btn-sub" data-act="mic">マイクの使用を許可する</button>
      </div>
      <div style="margin-top:10px">
        <button class="btn btn-sub" data-act="toggleStt">
          発音チェック: ${s.sttEnabled === false ? "オフ（自己採点のみ）" : "オン"}
        </button>
      </div>
    </div>

    <div class="card">
      <div class="section-title">うまく動かないとき</div>
      <p class="hint" style="margin-top:0">音が出ない・マイクが使えないときは、ここを押すと原因がわかります。</p>
      <button class="btn btn-sub" data-act="diag">🔎 この端末をチェックする</button>
      <div id="diagOut"></div>
    </div>

    <div class="card">
      <div class="section-title">データ</div>
      <p class="hint" style="margin-top:0">記録はこの端末のブラウザにだけ保存されます。機種変更やデータ消去にそなえて、ときどきバックアップをコピーして残しておくと安心です。</p>
      <div class="btn-row">
        <button class="btn btn-sub" data-act="backup">バックアップをコピー</button>
        <button class="btn btn-sub" data-act="restore">復元する</button>
      </div>
      <div id="restoreBox" hidden style="margin-top:12px">
        <label for="restoreText">バックアップの文字列を貼り付け</label>
        <input id="restoreText" type="text" placeholder="{&quot;version&quot;:1,...}">
        <div style="margin-top:8px"><button class="btn" data-act="doRestore">この内容で上書きする</button></div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">プロフィール</div>
      <div class="btn-row">
        <button class="btn btn-sub" data-act="profiles">切り替え・追加</button>
      </div>
      ${raw(getProfiles().length > 1
        ? `<div style="margin-top:10px"><button class="btn btn-danger" data-act="del">「${esc(p.name)}」を削除</button></div>`
        : '<p class="hint">プロフィールが1つだけのときは削除できません。</p>')}
    </div>

    <p class="hint" style="text-align:center">ココイングリッシュ ・ 旅行日 ${TRIP_DATE}</p>
  `;

  $$(".level-opt", root).forEach((b) => {
    b.onclick = () => {
      const lv = Number(b.dataset.level);
      changeLevel(lv);
      $$(".level-opt", root).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      toast("レベルを変えました");
    };
  });

  $$("[data-rate]", root).forEach((b) => {
    b.onclick = () => { setSetting("ttsRate", Number(b.dataset.rate)); render(root); toast("スピードを変えました"); };
  });

  const voiceSel = $("#voice", root);
  if (voiceSel) voiceSel.onchange = () => {
    setSetting("ttsVoiceURI", voiceSel.value || null);
    tts.speak("Can I have orange juice, please?");
  };

  const kokoSel = $("#kokoVoice", root);
  if (kokoSel) kokoSel.onchange = () => {
    setSetting("kokoVoiceURI", kokoSel.value || null);
    tts.speakKoko("Hi! I am Koko!");
  };

  // 音声の一覧はあとから届くことがある。届いたら設定画面を描き直す。
  const onVoices = () => { window.removeEventListener("tts:voices", onVoices); render(root); };
  window.addEventListener("tts:voices", onVoices);

  on(root, "diag", async (ev, node) => {
    const out = $("#diagOut", root);
    node.disabled = true;
    out.innerHTML = '<p class="hint">チェック中…</p>';
    const rows = [];

    const t = await tts.diagnose();
    rows.push([t.ok, "読み上げ", t.reason + (t.voice ? `（使用中の声: ${t.voice}）` : "")]);

    rows.push([
      window.isSecureContext,
      "接続の安全性",
      window.isSecureContext
        ? "https または localhost で開いています（マイクが使えます）"
        : `${location.protocol}// で開いているため、マイクは使えません。https か localhost で開いてください`,
    ]);

    rows.push([stt.isSupported(), "音声認識", stt.isSupported() ? "このブラウザは対応しています" : "このブラウザは対応していません（自己採点で練習できます）"]);

    const perm = await stt.micPermission();
    const permText = {
      granted: "許可されています",
      denied: "ブロックされています。ブラウザのサイト設定でマイクを許可してください",
      prompt: "まだ許可していません。「マイクの使用を許可する」を押してください",
      unknown: "確認できません。「マイクの使用を許可する」を押すと確認できます",
    }[perm] || "確認できません";
    rows.push([perm === "granted", "マイクの許可", permText]);

    rows.push([navigator.onLine, "インターネット", navigator.onLine ? "つながっています" : "オフラインです（発音チェックは使えません）"]);

    node.disabled = false;
    out.innerHTML = rows.map(([ok, label, text]) =>
      `<div class="diag-row"><span class="diag-mark">${ok ? "✅" : "⚠️"}</span>
        <span><b>${esc(label)}</b><br><span class="hint">${esc(text)}</span></span></div>`
    ).join("");
  });

  on(root, "test", () => tts.speak("Hello! Welcome to Guam. How are you today?"));
  on(root, "testKoko", () => tts.speakKoko("Hi! I am Koko. Let us practice English together!"));

  $$("[data-pitch]", root).forEach((b) => {
    b.onclick = () => {
      setSetting("kokoPitch", Number(b.dataset.pitch));
      tts.speakKoko("Hi! I am Koko!");
      $$("[data-pitch]", root).forEach((x) => { x.style.borderColor = x === b ? "var(--turquoise)" : ""; });
    };
  });

  // マイクの許可状態を表示する
  (async () => {
    const el = $("#permState", root);
    if (!el) return;
    if (!stt.isSupported()) {
      el.textContent = "このブラウザは音声認識に対応していません（自己採点で練習できます）";
      el.className = "perm-state is-ng";
      return;
    }
    const state = await stt.micPermission();
    const map = {
      granted: ["マイクは許可されています", "is-ok"],
      denied: ["マイクがブロックされています。ブラウザの設定から許可してください", "is-ng"],
      prompt: ["まだマイクの使用を許可していません", ""],
      unknown: ["マイクの状態を確認できません。「許可する」を押すと確認できます", ""],
    };
    const [text, cls] = map[state] || map.unknown;
    el.textContent = text;
    el.className = "perm-state " + cls;
  })();

  on(root, "mic", async () => {
    const res = await stt.requestMic();
    toast(res.ok ? "マイクを使えるようになりました" : res.message);
    render(root);
  });

  on(root, "toggleStt", () => {
    setSetting("sttEnabled", s.sttEnabled === false);
    render(root);
  });
  on(root, "profiles", () => go("/profiles"));

  on(root, "backup", async () => {
    const text = exportJSON();
    try {
      await navigator.clipboard.writeText(text);
      toast("バックアップをコピーしました");
    } catch {
      window.prompt("この文字列をコピーして保存してください", text);
    }
  });
  on(root, "restore", () => { const box = $("#restoreBox", root); box.hidden = !box.hidden; });
  on(root, "doRestore", () => {
    const text = $("#restoreText", root).value.trim();
    if (!text) return;
    if (!confirm("いまの記録をすべて上書きします。よろしいですか？")) return;
    try { importJSON(text); toast("復元しました"); go("/", { replace: true }); }
    catch (err) { console.error(err); toast("読み込めませんでした。文字列を確認してください"); }
  });
  on(root, "del", () => {
    if (!confirm(`「${p.name}」の学習記録をすべて削除します。取り消せません。よろしいですか？`)) return;
    deleteProfile(p.id);
    go("/", { replace: true });
  });
}
