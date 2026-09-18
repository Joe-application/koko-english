export default {
  id: "directions",
  order: 9,
  title: { ja: "道をたずねる", en: "Asking Directions" },
  icon: "🧭",
  place: "タモンの通り",
  unlockAfter: ["beach"],
  reward: { coins: 30, item: "compass" },
  intro: {
    ja: "行きたい店が見つからない。近くの人に聞いてみよう。",
    tips: [
      "道案内は聞き取れないのが普通。大事なのは「右か左か」「まっすぐか」だけ。",
      "わからなければ地図を見せて Where am I? と聞くのが確実。",
    ],
  },
  turns: [
    {
      speaker: "npc", who: "通りがかりの人",
      en: "…",
      ja: "店を探して困っている。近くにいる人に声をかけよう。",
      silent: true,
    },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「すみません、ちょっといいですか？」と声をかけよう" },
      variants: {
        1: "Excuse me.",
        2: "Excuse me, can I ask you something?",
        3: "Excuse me, sorry to bother you — could I ask you something?",
      },
      keywords: ["excuse"],
      hint: { ja: "いきなり質問せず、まず Excuse me. でワンクッション置くのが礼儀。" },
    },
    { speaker: "npc", who: "通りがかりの人", en: "Sure, what's up?", ja: "いいですよ、どうしました？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「ABCストアはどこですか？」と聞こう" },
      variants: {
        1: "Where is the ABC Store?",
        2: "Where is the ABC Store, please?",
        3: "Could you tell me how to get to the ABC Store?",
      },
      keywords: ["where"],
    },
    { speaker: "npc", who: "通りがかりの人", en: "Go straight for two blocks, then turn left at the traffic light. It's on your right.", ja: "2ブロックまっすぐ行って、信号を左です。右側にありますよ。" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "長くてわからない。「ゆっくりお願いします」と頼もう" },
      variants: {
        1: "Slowly, please.",
        2: "Sorry, could you speak more slowly?",
        3: "I'm sorry, could you say that more slowly, please?",
      },
      keywords: ["slowly"],
    },
    { speaker: "npc", who: "通りがかりの人", en: "No worries. Straight two blocks. Then left at the light.", ja: "いいですよ。まっすぐ2ブロック。それから信号を左です。" },
    {
      speaker: "user", mode: "listen",
      listenEn: "Straight two blocks. Then left at the light.",
      instruction: { ja: "もう一度聞いてみよう。信号でどちらに曲がる？" },
      options: [
        { en: "左", correct: true },
        { en: "右", correct: false, why: "right ではなく left と言っている" },
        { en: "曲がらずまっすぐ", correct: false, why: "turn left / left at the light と言っている" },
      ],
    },
    {
      speaker: "user", mode: "choice",
      instruction: { ja: "念のため確認したい。「まっすぐ行って、左ですね？」はどれ？" },
      options: [
        { en: "Straight, then left. Right?", correct: true },
        { en: "Straight and left, is it true?", correct: false, why: "本当かどうかを疑う言い方になってしまう" },
        { en: "I go straight left.", correct: false, why: "まっすぐなのか左なのかが伝わらない" },
      ],
    },
    { speaker: "npc", who: "通りがかりの人", en: "Exactly. You can't miss it — it's a big blue sign.", ja: "そのとおり。大きな青い看板だから、すぐわかりますよ。" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「歩いてどのくらいですか？」と聞こう" },
      variants: {
        1: "How long to walk?",
        2: "How long does it take to walk?",
        3: "About how long does it take on foot?",
      },
      keywords: ["long"],
    },
    { speaker: "npc", who: "通りがかりの人", en: "Maybe five minutes. It's close.", ja: "5分くらいかな。すぐですよ。" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "お礼を言って別れよう" },
      variants: {
        1: "Thank you so much!",
        2: "Thank you so much. Have a nice day!",
        3: "Thank you so much for your help. Have a great day!",
      },
      keywords: ["thank"],
    },
  ],
  wrapUp: {
    ja: "道をたずねるのはこの3つ。声をかける・聞く・確認する。",
    phrases: ["Excuse me, can I ask you something?", "Where is the ABC Store?", "Straight, then left. Right?"],
  },
};
