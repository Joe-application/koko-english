export default {
  id: "taxi-hotel",
  order: 3,
  title: { ja: "空港からホテルへ", en: "To the Hotel" },
  icon: "🚕",
  place: "グアム国際空港 タクシー乗り場",
  unlockAfter: ["immigration"],
  reward: { coins: 30, item: "latte-stone" },
  intro: {
    ja: "荷物を受け取って外へ。タクシーでホテルに向かおう。",
    tips: [
      "行き先は「ホテル名」だけで通じる。文を作ろうとしなくていい。",
      "料金は先に聞いておくと安心。メーター制かどうかも確認できる。",
    ],
  },
  turns: [
    { speaker: "npc", who: "運転手", en: "Hi there! Where are you headed?", ja: "どうも！どちらまで？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「タモンのパシフィックベイホテルまでお願いします」と伝えよう" },
      variants: {
        1: "Pacific Bay Hotel, please.",
        2: "To the Pacific Bay Hotel, please.",
        3: "Could you take us to the Pacific Bay Hotel in Tumon, please?",
      },
      keywords: ["hotel"],
      hint: { ja: "行き先 + please だけで完全に通じる。" },
    },
    { speaker: "npc", who: "運転手", en: "Sure thing. Four of you, right? Let me get your bags.", ja: "了解。4人ですね？荷物を積みますね。" },
    {
      speaker: "user", mode: "choice",
      instruction: { ja: "「ありがとう、助かります」はどれ？" },
      options: [
        { en: "Thank you, that's very kind.", correct: true },
        { en: "Thank you for the helping.", correct: false, why: "for のあとに the helping とは言わない" },
        { en: "You are kind for me.", correct: false, why: "英語として不自然。Thank you. だけで十分伝わる" },
      ],
    },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「どのくらいかかりますか？」と聞いてみよう" },
      variants: {
        1: "How long?",
        2: "How long does it take?",
        3: "About how long does it take to get there?",
      },
      keywords: ["long"],
      hint: { ja: "How long? だけでも「どのくらい？」として通じる。" },
    },
    { speaker: "npc", who: "運転手", en: "About fifteen minutes. Traffic's light today.", ja: "15分くらいですね。今日は道が空いています。" },
    {
      speaker: "user", mode: "listen",
      listenEn: "About fifteen minutes.",
      instruction: { ja: "もう一度聞いてみよう。何分くらい？" },
      options: [
        { en: "15分くらい", correct: true },
        { en: "50分くらい", correct: false, why: "fifteen（15）と fifty（50）は音が似ている。アクセントの位置が違う" },
        { en: "5分くらい", correct: false, why: "five ではなく fifteen と言っている" },
      ],
    },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「いくらくらいですか？」と料金を聞こう" },
      variants: {
        1: "How much?",
        2: "How much is it?",
        3: "About how much will it be?",
      },
      keywords: ["much"],
    },
    { speaker: "npc", who: "運転手", en: "It runs on the meter. Usually around thirty dollars.", ja: "メーター制です。だいたい30ドルくらいですね。" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "聞き取れなかった。「もう一度お願いします」と言おう" },
      variants: {
        1: "Sorry, again please?",
        2: "Sorry, could you say that again?",
        3: "I'm sorry, could you repeat that, please?",
      },
      keywords: ["sorry"],
      hint: { ja: "車内は走行音で聞き取りにくい。遠慮せず聞き返そう。" },
    },
    { speaker: "npc", who: "運転手", en: "No problem. Around thirty dollars.", ja: "いいですよ。30ドルくらいです。" },
    { speaker: "npc", who: "運転手", en: "Here we are. The Pacific Bay Hotel.", ja: "着きましたよ。パシフィックベイホテルです。" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "お金を渡してお礼を言おう" },
      variants: {
        1: "Here you are. Thank you!",
        2: "Here you are. Thanks a lot!",
        3: "Here you are. Thank you very much. Have a good one!",
      },
      keywords: ["thank"],
    },
  ],
  wrapUp: {
    ja: "タクシーはこの3つで足りる。行き先・時間・料金。",
    phrases: ["Pacific Bay Hotel, please.", "How long does it take?", "How much is it?"],
  },
};
