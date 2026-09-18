export default {
  id: "beach",
  order: 8,
  title: { ja: "ビーチとアクティビティ", en: "At the Beach" },
  icon: "🏖",
  place: "タモンビーチ アクティビティ受付",
  unlockAfter: ["shopping"],
  reward: { coins: 30, item: "sea-turtle" },
  intro: {
    ja: "海へ。シュノーケリングを申し込んでみよう。",
    tips: [
      "子ども連れであることは必ず伝える。ライフジャケットや浅い場所を用意してくれる。",
      "安全にかかわることは、遠慮せず何度でも確認していい。",
    ],
  },
  turns: [
    { speaker: "npc", who: "受付", en: "Hafa adai! Looking to get out on the water today?", ja: "ハファデイ！今日は海に出られますか？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「シュノーケリングをしたいです」と伝えよう" },
      variants: {
        1: "Snorkeling, please.",
        2: "We'd like to try snorkeling.",
        3: "We'd like to book a snorkeling tour for four, please.",
      },
      keywords: ["snorkeling"],
    },
    { speaker: "npc", who: "受付", en: "Great! How many people, and any children?", ja: "いいですね！何名様ですか、お子さんはいますか？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「大人2人と子ども2人です」と伝えよう" },
      variants: {
        1: "Two adults, two kids.",
        2: "Two adults and two children.",
        3: "Two adults and two children — twelve and sixteen years old.",
      },
      keywords: ["two"],
      hint: { ja: "子どもがいることを伝えると、安全の配慮をしてもらえる。" },
    },
    { speaker: "npc", who: "受付", en: "Perfect. Life jackets are included for everyone.", ja: "承知しました。ライフジャケットは全員分に含まれています。" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「ここは泳いでも安全ですか？」と確認しよう" },
      variants: {
        1: "Is it safe here?",
        2: "Is it safe to swim here?",
        3: "Is it safe for children to swim here?",
      },
      keywords: ["safe"],
    },
    { speaker: "npc", who: "受付", en: "Very safe. The reef keeps the water calm, and a guide stays with you the whole time.", ja: "とても安全です。リーフのおかげで波が穏やかですし、ガイドがずっと付きます。" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "長くて聞き取れなかった。聞き返そう" },
      variants: {
        1: "Sorry, again please?",
        2: "Sorry, could you say that again?",
        3: "I'm sorry, could you go over that again?",
      },
      keywords: ["sorry"],
      hint: { ja: "安全の話は聞き流さない。わかるまで聞き返していい。" },
    },
    { speaker: "npc", who: "受付", en: "Sure. A guide stays with you the whole time.", ja: "もちろん。ガイドがずっと付いています。" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「何時に戻ればいいですか？」と聞こう" },
      variants: {
        1: "What time do we come back?",
        2: "What time should we be back?",
        3: "What time do we need to be back here?",
      },
      keywords: ["time"],
    },
    { speaker: "npc", who: "受付", en: "Be back at the desk by four. The tour is about two hours.", ja: "4時までに受付に戻ってください。ツアーは2時間ほどです。" },
    {
      speaker: "user", mode: "listen",
      listenEn: "Be back at the desk by four.",
      instruction: { ja: "もう一度聞いてみよう。何時までに戻る？" },
      options: [
        { en: "4時", correct: true },
        { en: "2時", correct: false, why: "two hours はツアーの長さ。戻る時刻は four" },
        { en: "14時", correct: false, why: "fourteen ではなく four と言っている" },
      ],
    },
    {
      speaker: "user", mode: "choice",
      instruction: { ja: "「写真を撮ってもらえますか？」はどれ？" },
      options: [
        { en: "Could you take a picture of us?", correct: true },
        { en: "Could you take us a picture?", correct: false, why: "of us が正しい。take us だと「私たちを連れて行く」に近い" },
        { en: "Please shoot me.", correct: false, why: "「撃って」という意味になってしまう" },
      ],
    },
    { speaker: "npc", who: "受付", en: "Happy to! Say cheese — one, two, three!", ja: "よろこんで！はいチーズ、いち、に、さん！" },
  ],
  wrapUp: {
    ja: "アクティビティはこの3つ。申し込む・安全を確かめる・時間を確かめる。",
    phrases: ["We'd like to try snorkeling.", "Is it safe to swim here?", "What time should we be back?"],
  },
};
