import { html, raw, on, esc, $ } from "../util/dom.js";
import { refreshActive } from "../store.js";
import { getScenario, isUnlocked } from "../../content/index.js";
import { go, back } from "../router.js";
import * as tts from "../speech/tts.js";
import * as stt from "../speech/stt.js";
import { scoreBest, verdict, diffHtml } from "../speech/score.js";
import { finishScenario } from "../progress.js";
import { renderKoko } from "../character/koko.js";

export function render(root, { id }) {
  const profile = refreshActive();
  const sc = getScenario(id);
  if (!profile) { go("/welcome", { replace: true }); return; }
  if (!sc || !isUnlocked(sc, profile)) { go("/scenarios", { replace: true }); return; }

  const level = profile.level || 2;
  const hideEnglish = level === 3; // L3 は聞き取り訓練のため英文を隠す

  let idx = 0;
  const scores = [];
  let selfCheckMode = !stt.isUsable(); // 音声認識が使えないときは自己採点に倒す

  /* ---------- イントロ ---------- */
  root.innerHTML = html`
    <div class="sc-intro">
      <div class="koko-stage">${raw(renderKoko({ expression: "normal", outfit: profile.equipped?.outfit, size: 120 }))}</div>
      <div style="font-size:40px">${sc.icon}</div>
      <h2>${sc.title.ja}</h2>
      <div class="sc-place">${sc.place}</div>
      <div class="tip">${sc.intro.ja}</div>
      ${raw((sc.intro.tips || []).map((t) => `<div class="tip">💡 ${esc(t)}</div>`).join(""))}
      <div style="margin-top:20px"><button class="btn" data-act="begin">はじめる</button></div>
      <div style="margin-top:8px"><button class="btn btn-ghost" data-act="cancel">もどる</button></div>
    </div>
  `;
  on(root, "cancel", () => back("/scenarios"));
  on(root, "begin", () => {
    tts.unlock(); // iOS: 最初のタップで読み上げを解錠する
    startPlay();
  });

  /* ---------- 再生 ---------- */
  function startPlay() {
    root.innerHTML = `
      <div class="progress"><i id="bar" style="width:0%"></i></div>
      <div class="log" id="log"></div>
      <div id="stage"></div>`;
    step();
  }

  const logEl = () => $("#log", root);
  const stageEl = () => $("#stage", root);

  function setProgress() {
    const bar = $("#bar", root);
    if (bar) bar.style.width = Math.round((idx / sc.turns.length) * 100) + "%";
  }

  function scrollToStage() {
    requestAnimationFrame(() => {
      stageEl()?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function appendLog(markup) {
    const wrap = document.createElement("div");
    wrap.innerHTML = markup;
    const node = wrap.firstElementChild;
    logEl().appendChild(node);
    return node;
  }

  function step() {
    setProgress();
    if (idx >= sc.turns.length) return finish();
    const turn = sc.turns[idx];
    if (turn.speaker === "npc") return renderNpc(turn);
    if (turn.mode === "choice") return renderChoice(turn);
    if (turn.mode === "listen") return renderListen(turn);
    return renderSpeak(turn);
  }

  /* ---------- NPC ---------- */
  function renderNpc(turn) {
    if (turn.silent) {
      appendLog(`<div class="msg msg-npc"><div class="msg-inner"><div class="msg-ja">${esc(turn.ja)}</div></div></div>`);
      idx++;
      return step();
    }

    const node = appendLog(`
      <div class="msg msg-npc">
        <div class="msg-who">${esc(turn.who || "あいて")}</div>
        <div class="msg-inner">
          <div class="msg-en ${hideEnglish ? "msg-hidden" : ""}" data-en>${hideEnglish ? "（英文はかくれています）" : esc(turn.en)}</div>
          <div class="msg-ja" data-ja hidden>${esc(turn.ja)}</div>
          ${turn.note ? `<div class="msg-note">${esc(turn.note)}</div>` : ""}
          <div class="msg-tools">
            <button class="chip" data-t="replay">🔁 もう一度</button>
            <button class="chip" data-t="slow">🐢 ゆっくり</button>
            ${hideEnglish ? '<button class="chip" data-t="showen">英文を見る</button>' : ""}
            <button class="chip" data-t="ja">訳を見る</button>
          </div>
        </div>
      </div>`);

    node.querySelector('[data-t="replay"]').onclick = () => tts.speak(turn.en);
    node.querySelector('[data-t="slow"]').onclick = () => tts.speak(turn.en, { slow: true });
    node.querySelector('[data-t="ja"]').onclick = (ev) => {
      const ja = node.querySelector("[data-ja]");
      ja.hidden = !ja.hidden;
      ev.currentTarget.classList.toggle("is-on", !ja.hidden);
    };
    const showEn = node.querySelector('[data-t="showen"]');
    if (showEn) {
      showEn.onclick = () => {
        const en = node.querySelector("[data-en]");
        en.textContent = turn.en;
        en.classList.remove("msg-hidden");
        showEn.remove();
      };
    }

    tts.speak(turn.en);

    stageEl().innerHTML = `<button class="btn" data-act="next">つぎへ</button>`;
    on(stageEl(), "next", () => { idx++; step(); });
    scrollToStage();
  }

  /* ---------- 話す（マイクで採点。使えないときは自己採点） ---------- */
  function renderSpeak(turn) {
    const model = turn.variants[level] || turn.variants[2];
    const masked = hideEnglish;
    let attempts = 0;
    let bestScore = 0;
    let micReady = false; // 一度マイクが通ったか（2回目以降は待たせずに録音へ入る）

    stageEl().innerHTML = `
      <div class="prompt">
        <div class="prompt-label">あなたの番</div>
        <div class="prompt-ja">${esc(turn.instruction.ja)}</div>
        <div class="model ${masked ? "is-masked" : ""}" data-model>${esc(model)}</div>
        ${masked ? '<button class="chip" style="margin-top:8px" data-t="reveal">お手本を見る</button>' : ""}
        ${turn.hint ? `<div class="hint">💡 ${esc(turn.hint.ja)}</div>` : ""}
        <div class="msg-tools">
          <button class="chip" data-t="listen">🔊 お手本を聞く</button>
          <button class="chip" data-t="slow">🐢 ゆっくり</button>
        </div>
      </div>
      <div id="speakArea"></div>`;

    const st = stageEl();
    st.querySelector('[data-t="listen"]').onclick = () => tts.speak(model);
    st.querySelector('[data-t="slow"]').onclick = () => tts.speak(model, { slow: true });
    const reveal = st.querySelector('[data-t="reveal"]');
    if (reveal) {
      reveal.onclick = () => { st.querySelector("[data-model]").classList.remove("is-masked"); reveal.remove(); };
    }

    const area = () => document.getElementById("speakArea");

    /* --- マイクで話す --- */
    function showMicUI(message) {
      area().innerHTML = `
        ${message ? `<p class="stt-msg">${esc(message)}</p>` : ""}
        <p class="hint" style="text-align:center;margin:0 0 10px">ボタンを押して、声に出して言ってみよう</p>
        <button class="mic-btn" data-t="mic" aria-label="マイクで話す"><span>🎤</span></button>
        <div style="margin-top:10px"><button class="btn btn-ghost" data-t="toSelf">マイクを使わずに自分で採点する</button></div>`;
      area().querySelector('[data-t="mic"]').onclick = startListening;
      area().querySelector('[data-t="toSelf"]').onclick = () => showSelfCheck();
    }

    function showListeningUI() {
      area().innerHTML = `
        <div class="listening">
          <div class="mic-wave"><i></i><i></i><i></i><i></i><i></i></div>
          <p class="stt-interim" data-interim>聞いています…</p>
        </div>`;
    }

    async function startListening() {
      // 許可済みならボタンを押した瞬間に録音表示へ。待たされる感じをなくす。
      if (micReady) showListeningUI();

      // マイクの許可。未許可ならここで求める（必ずタップ起点）
      const state = await stt.micPermission();
      if (state !== "granted") {
        const res = await stt.requestMic();
        if (!res.ok) {
          if (res.reason === "NotAllowedError" || res.reason === "SecurityError") {
            selfCheckMode = true;
            return showSelfCheck(res.message + " 今回は自分で採点しよう。");
          }
          return showMicUI(res.message);
        }
      }
      micReady = true;

      showListeningUI();
      const kokoWatching = root.querySelector(".koko");
      if (kokoWatching) kokoWatching.dataset.mood = "listening";

      const res = await stt.listenOnce({
        onInterim: (text) => {
          const el = area()?.querySelector("[data-interim]");
          if (el) el.textContent = text || "聞いています…";
        },
      });

      if (!res.ok) {
        if (res.error === "not-allowed" || res.error === "network") {
          selfCheckMode = true;
          return showSelfCheck(res.message + " 今回は自分で採点しよう。");
        }
        // no-speech などは減点しない。もう一度すぐ話せる状態に戻す。
        return showMicUI(res.message);
      }

      attempts++;
      const result = scoreBest(res.alternatives, model, turn.keywords || [], level);
      bestScore = Math.max(bestScore, result?.score || 0);
      showResultUI(result);
    }

    function showResultUI(result) {
      const v = verdict(result?.score || 0);
      area().innerHTML = `
        <div class="stt-result">
          <div class="stt-verdict ${v.ok ? "is-ok" : ""}">${esc(v.label)} <b>${result?.score ?? 0}点</b></div>
          <div class="stt-said">聞こえた言葉: 「${esc(result?.said || "")}」</div>
          ${diffHtml(result)}
          ${result?.missingKeywords?.length
            ? `<div class="diff-extra">この言葉が入るともっと伝わる: <b>${result.missingKeywords.map(esc).join(", ")}</b></div>`
            : ""}
          <p class="hint">うまく聞き取れないこともあります。通じた実感があれば、それでだいじょうぶ。</p>
        </div>
        ${v.ok
          ? `<button class="btn" data-t="accept">つぎへ</button>
             <div style="margin-top:10px"><button class="btn btn-ghost" data-t="again">🎤 もう一度話す</button></div>`
          : attempts >= 3
            ? `<button class="btn btn-sub" data-t="again">🎤 もう一度話す</button>
               <div style="margin-top:10px"><button class="btn" data-t="accept">お手本を聞いてつぎへ</button></div>`
            : `<button class="btn" data-t="again">🎤 もう一度話す</button>
               <div style="margin-top:10px"><button class="btn btn-ghost" data-t="accept">つぎへすすむ</button></div>`}`;

      // 「もう一度話す」は押した時点で録音を開始する（マイクを押し直させない）
      area().querySelector('[data-t="again"]')?.addEventListener("click", startListening);
      area().querySelector('[data-t="accept"]')?.addEventListener("click", () => {
        if (!v.ok && attempts >= 3) tts.speak(model);
        commit(bestScore, `${bestScore}点`);
      });
    }

    /* --- 自己採点（マイクが使えないとき） --- */
    function showSelfCheck(message) {
      const reason = message || stt.unusableReason();
      area().innerHTML = `
        ${reason ? `<p class="stt-msg">${esc(reason)}</p>` : ""}
        <p class="hint" style="text-align:center;margin:0 0 10px">声に出して言ってみよう</p>
        <div class="selfcheck">
          <button class="btn" data-v="90">◎ 言えた</button>
          <button class="btn btn-sun" data-v="70">○ まあまあ</button>
          <button class="btn btn-sub" data-v="40">△ むずかしい</button>
        </div>
        ${stt.isUsable() ? '<div style="margin-top:10px"><button class="btn btn-ghost" data-t="toMic">マイクで採点する</button></div>' : ""}`;
      area().querySelectorAll("[data-v]").forEach((b) => {
        b.onclick = () => {
          const v = Number(b.dataset.v);
          commit(v, v >= 90 ? "◎ 言えた" : v >= 70 ? "○ まあまあ" : "△ むずかしい");
        };
      });
      area().querySelector('[data-t="toMic"]')?.addEventListener("click", () => showMicUI());
    }

    function commit(score, label) {
      scores.push(score);
      appendLog(`
        <div class="msg msg-me">
          <div class="msg-inner">
            <div class="msg-en">${esc(model)}</div>
            <div class="msg-ja">${esc(label)}</div>
          </div>
        </div>`);
      idx++;
      step();
    }

    if (selfCheckMode) showSelfCheck(); else showMicUI();
    tts.speak(model);
    scrollToStage();
  }

  /* ---------- 3択 ---------- */
  function renderChoice(turn) {
    let wrongCount = 0;
    stageEl().innerHTML = `
      <div class="prompt">
        <div class="prompt-label">えらぼう</div>
        <div class="prompt-ja">${esc(turn.instruction.ja)}</div>
      </div>
      ${turn.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o.en)}</button>`).join("")}`;

    stageEl().querySelectorAll(".opt").forEach((btn) => {
      btn.onclick = () => {
        const opt = turn.options[Number(btn.dataset.i)];
        if (opt.correct) {
          btn.classList.add("is-correct");
          stageEl().querySelectorAll(".opt").forEach((b) => (b.disabled = true));
          tts.speak(opt.en);
          scores.push(wrongCount === 0 ? 100 : 60);
          appendLog(`<div class="msg msg-me"><div class="msg-inner"><div class="msg-en">${esc(opt.en)}</div></div></div>`);
          setTimeout(() => { idx++; step(); }, 900);
        } else {
          wrongCount++;
          btn.classList.add("is-wrong");
          btn.disabled = true;
          if (opt.why && !btn.querySelector(".opt-why")) {
            btn.insertAdjacentHTML("beforeend", `<span class="opt-why">${esc(opt.why)}</span>`);
          }
        }
      };
    });
    scrollToStage();
  }

  /* ---------- 聞き取り ---------- */
  function renderListen(turn) {
    let wrongCount = 0;
    const line = turn.listenEn;
    stageEl().innerHTML = `
      <div class="prompt">
        <div class="prompt-label">ききとり</div>
        <div class="prompt-ja">${esc(turn.instruction.ja)}</div>
        <div class="msg-tools">
          <button class="chip" data-t="play">🔊 もう一度きく</button>
          <button class="chip" data-t="slow">🐢 ゆっくり</button>
        </div>
      </div>
      ${turn.options.map((o, i) => `<button class="opt" data-i="${i}">${esc(o.en)}</button>`).join("")}`;

    const st = stageEl();
    st.querySelector('[data-t="play"]').onclick = () => tts.speak(line);
    st.querySelector('[data-t="slow"]').onclick = () => tts.speak(line, { slow: true });
    st.querySelectorAll(".opt").forEach((btn) => {
      btn.onclick = () => {
        const opt = turn.options[Number(btn.dataset.i)];
        if (opt.correct) {
          btn.classList.add("is-correct");
          st.querySelectorAll(".opt").forEach((b) => (b.disabled = true));
          scores.push(wrongCount === 0 ? 100 : 60);
          appendLog(`<div class="msg msg-npc"><div class="msg-inner"><div class="msg-en">${esc(line)}</div><div class="msg-ja">${esc(opt.en)}</div></div></div>`);
          setTimeout(() => { idx++; step(); }, 900);
        } else {
          wrongCount++;
          btn.classList.add("is-wrong");
          btn.disabled = true;
          if (opt.why && !btn.querySelector(".opt-why")) {
            btn.insertAdjacentHTML("beforeend", `<span class="opt-why">${esc(opt.why)}</span>`);
          }
        }
      };
    });
    tts.speak(line);
    scrollToStage();
  }

  function finish() {
    tts.stop();
    finishScenario(sc.id, scores);
    go(`/result/${sc.id}`, { replace: true });
  }
}
