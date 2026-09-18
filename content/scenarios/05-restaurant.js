export default {
  id: "restaurant",
  order: 5,
  title: { ja: "レストランで", en: "At the Restaurant" },
  icon: "🍽",
  place: "タモンのシーフードレストラン",
  unlockAfter: ["hotel-checkin"],
  reward: { coins: 30, item: "coconut" },
  intro: {
    ja: "家族4人で夕食へ。人数を伝えて、注文して、会計まで。",
    tips: [
      "入口で待って、店員さんに案内してもらうのがアメリカ式。勝手に座らない。",
      "メニューが読めなくても指さして This one, please. で通じる。",
    ],
  },
  turns: [
    { speaker: "npc", who: "店員", en: "Good evening! How many in your party?", ja: "こんばんは！何名様ですか？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「4人です」と伝えよう" },
      variants: { 1: "Four, please.", 2: "Four people, please.", 3: "A table for four, please." },
      keywords: ["four"],
      hint: { ja: "party は「団体・グループ」の意味。パーティーではない。" },
    },
    { speaker: "npc", who: "店員", en: "Right this way. Here are your menus.", ja: "こちらへどうぞ。メニューです。" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「おすすめは何ですか？」と聞いてみよう" },
      variants: {
        1: "What's good here?",
        2: "What do you recommend?",
        3: "What would you recommend for a first visit?",
      },
      keywords: ["recommend"],
      hint: { ja: "地元の人のおすすめを聞くのは、会話のきっかけとしても最高。" },
    },
    { speaker: "npc", who: "店員", en: "Our grilled shrimp is very popular. And the coconut rice goes well with it.", ja: "焼きエビが人気です。ココナッツライスもよく合いますよ。" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "早口でわからなかった。「もう少しゆっくりお願いします」と伝えよう" },
      variants: {
        1: "Slowly, please.",
        2: "Sorry, could you speak more slowly?",
        3: "I'm sorry, could you say that a little more slowly?",
      },
      keywords: ["slowly"],
    },
    { speaker: "npc", who: "店員", en: "Sure! The grilled shrimp is very popular.", ja: "もちろん！焼きエビがとても人気です。" },
    {
      speaker: "user", mode: "listen",
      listenEn: "The grilled shrimp is very popular.",
      instruction: { ja: "もう一度聞いてみよう。人気なのは何？" },
      options: [
        { en: "焼いたエビ", correct: true },
        { en: "焼いた魚", correct: false, why: "fish ではなく shrimp（エビ）と言っている" },
        { en: "揚げたエビ", correct: false, why: "fried ではなく grilled（焼いた）" },
      ],
    },
    {
      speaker: "user", mode: "choice",
      instruction: { ja: "「じゃあそれを2つください」はどれ？" },
      options: [
        { en: "We'll have two of those, please.", correct: true },
        { en: "Give me two shrimp now.", correct: false, why: "命令口調で失礼に聞こえる" },
        { en: "Two that, please.", correct: false, why: "that は単数。those か of those を使う" },
      ],
    },
    { speaker: "npc", who: "店員", en: "Great. Anything to drink?", ja: "かしこまりました。お飲み物は？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「お水を4つお願いします」と頼もう" },
      variants: {
        1: "Four waters, please.",
        2: "Four waters, please. No ice.",
        3: "Could we have four waters, please? No ice for the kids.",
      },
      keywords: ["water"],
      hint: { ja: "アメリカは氷をたっぷり入れる。苦手なら No ice, please. を添える。" },
    },
    { speaker: "npc", who: "店員", en: "Coming right up. … How is everything?", ja: "すぐお持ちします。…お料理はいかがですか？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「とてもおいしいです」と伝えよう" },
      variants: {
        1: "It's very good!",
        2: "It's delicious, thank you!",
        3: "Everything's delicious. Thank you for the recommendation!",
      },
      keywords: ["delicious"],
    },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "食べ終わった。「お会計をお願いします」と伝えよう" },
      variants: {
        1: "Check, please.",
        2: "Could I have the check, please?",
        3: "Could we get the check when you have a moment?",
      },
      keywords: ["check"],
      hint: { ja: "アメリカでは伝票を席まで持ってきてもらう。レジに行かない。" },
    },
    {
      speaker: "npc", who: "店員",
      en: "Here you go. You can leave the tip on the table or add it to the card.",
      ja: "どうぞ。チップはテーブルに置いても、カードに追加してもいいですよ。",
      note: "グアムのレストランではチップが必要。だいたい15〜20%。伝票にチップ欄があるので、そこに書いて合計を記入する。",
    },
  ],
  wrapUp: {
    ja: "レストランはこの3つ。人数・注文・会計。",
    phrases: ["A table for four, please.", "What do you recommend?", "Could I have the check, please?"],
  },
};
