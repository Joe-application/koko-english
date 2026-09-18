export default {
  id: "trouble",
  order: 10,
  title: { ja: "困ったとき", en: "When You Need Help" },
  icon: "🆘",
  place: "ホテルのフロントと薬局",
  unlockAfter: ["directions"],
  reward: { coins: 30, item: "first-aid" },
  intro: {
    ja: "使わずに済むのが一番だけど、いざというときに出てこないと困るフレーズ。",
    tips: [
      "困ったときは、きれいな文より「短く・はっきり」が大事。",
      "Could you help me? だけ言えれば、あとは相手が助けてくれる。",
    ],
  },
  turns: [
    { speaker: "npc", who: "フロント", en: "Good morning. Is everything all right?", ja: "おはようございます。どうかされましたか？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「助けてもらえますか」と伝えよう" },
      variants: {
        1: "Could you help me?",
        2: "Could you help me, please?",
        3: "I'm sorry to bother you — could you help me with something?",
      },
      keywords: ["help"],
      hint: { ja: "困ったときの最初の一言。これさえ言えれば伝わる。" },
    },
    { speaker: "npc", who: "フロント", en: "Of course. What happened?", ja: "もちろんです。どうされました？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「部屋のエアコンが動きません」と伝えよう" },
      variants: {
        1: "The air conditioner doesn't work.",
        2: "The air conditioner in our room isn't working.",
        3: "The air conditioner in room 812 isn't working.",
      },
      keywords: ["work"],
      hint: { ja: "「壊れている」は doesn't work / isn't working で十分。" },
    },
    { speaker: "npc", who: "フロント", en: "I'm sorry about that. I'll send someone up right away.", ja: "申し訳ありません。すぐに人をうかがわせます。" },
    {
      speaker: "user", mode: "listen",
      listenEn: "I'll send someone up right away.",
      instruction: { ja: "もう一度聞いてみよう。フロントは何と言った？" },
      options: [
        { en: "すぐに人を行かせます", correct: true },
        { en: "部屋を変えてください", correct: false, why: "部屋の変更の話はしていない" },
        { en: "明日まで待ってください", correct: false, why: "right away は「すぐに」という意味" },
      ],
    },
    { speaker: "npc", who: "フロント", en: "Anything else I can help with?", ja: "他に何かございますか？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「子どもの具合がよくありません」と伝えよう" },
      variants: {
        1: "My child doesn't feel well.",
        2: "My son doesn't feel well.",
        3: "My son isn't feeling well. He has a stomachache.",
      },
      keywords: ["feel"],
      hint: { ja: "don't feel well =「具合がよくない」。体調全般に使える便利な言い方。" },
    },
    { speaker: "npc", who: "フロント", en: "Oh no. There's a pharmacy across the street, and a clinic ten minutes away.", ja: "それは大変。向かいに薬局が、10分ほどのところに診療所があります。" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "早口だった。もう一度言ってもらおう" },
      variants: {
        1: "Sorry, again please?",
        2: "Sorry, could you say that again?",
        3: "I'm sorry, could you repeat that more slowly?",
      },
      keywords: ["sorry"],
    },
    { speaker: "npc", who: "フロント", en: "Sure. A pharmacy is right across the street.", ja: "もちろん。薬局は通りの向かいです。" },
    {
      speaker: "user", mode: "choice",
      instruction: { ja: "薬局で「子ども用の薬はありますか？」はどれ？" },
      options: [
        { en: "Do you have medicine for children?", correct: true },
        { en: "Give me child medicine.", correct: false, why: "命令口調で、薬を買う場面では特に不適切" },
        { en: "I want children medicine now.", correct: false, why: "for が抜けていて意味が取りにくい" },
      ],
    },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "念のため「書いてもらえますか？」と頼もう" },
      variants: {
        1: "Could you write it down?",
        2: "Could you write it down, please?",
        3: "Could you write that down for me, please?",
      },
      keywords: ["write"],
      hint: { ja: "聞き取れなくても、書いてもらえば読める。最後の手段として覚えておくと心強い。" },
    },
    { speaker: "npc", who: "フロント", en: "Here you go. I hope he feels better soon.", ja: "どうぞ。早くよくなりますように。" },
  ],
  wrapUp: {
    ja: "困ったときはこの3つ。助けを求める・状況を伝える・書いてもらう。",
    phrases: ["Could you help me?", "My child doesn't feel well.", "Could you write it down, please?"],
  },
};
