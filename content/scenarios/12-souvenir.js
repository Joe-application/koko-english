export default {
  id: "souvenir",
  order: 12,
  title: { ja: "お土産と帰りの空港", en: "Souvenirs and Going Home" },
  icon: "🎁",
  place: "免税店とグアム国際空港",
  unlockAfter: ["smalltalk"],
  reward: { coins: 40, item: "sunset-card" },
  intro: {
    ja: "いよいよ最終日。お土産を買って、空港へ。旅の総仕上げ。",
    tips: [
      "お土産選びで迷ったら、店員さんに聞くのがいちばん早い。",
      "空港のチェックインは入国審査と同じで、聞かれることが決まっている。",
    ],
  },
  turns: [
    { speaker: "npc", who: "店員", en: "Hi! Looking for anything in particular?", ja: "こんにちは！何かお探しですか？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「お土産を探しています」と伝えよう" },
      variants: {
        1: "Souvenirs, please.",
        2: "I'm looking for souvenirs.",
        3: "I'm looking for souvenirs for my friends back home.",
      },
      keywords: ["souvenirs"],
    },
    { speaker: "npc", who: "店員", en: "Our chocolate and coffee are the most popular. Both are made here on Guam.", ja: "チョコレートとコーヒーが一番人気です。どちらもグアム産ですよ。" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "後半が聞き取れなかった。聞き返そう" },
      variants: {
        1: "Sorry, again please?",
        2: "Sorry, could you say that again?",
        3: "I'm sorry, I didn't catch the last part. Could you say it again?",
      },
      keywords: ["sorry"],
    },
    { speaker: "npc", who: "店員", en: "Sure. Both of them are made here on Guam.", ja: "もちろん。どちらもグアムで作られています。" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「チョコレートを5箱ください」と頼もう" },
      variants: {
        1: "Five boxes of chocolate, please.",
        2: "Could I have five boxes of chocolate?",
        3: "Could I get five boxes of the chocolate, please?",
      },
      keywords: ["five"],
    },
    { speaker: "npc", who: "店員", en: "Sure. Would you like them gift-wrapped?", ja: "承知しました。プレゼント用に包みますか？" },
    {
      speaker: "user", mode: "choice",
      instruction: { ja: "「はい、お願いします」はどれ？" },
      options: [
        { en: "Yes, please. That would be great.", correct: true },
        { en: "Yes, wrap it fast.", correct: false, why: "急かす言い方で失礼に聞こえる" },
        { en: "Yes, I wrap them.", correct: false, why: "自分が包むことになってしまう" },
      ],
    },
    { speaker: "npc", who: "店員", en: "All done. That'll be forty-five dollars even.", ja: "できました。ちょうど45ドルです。" },
    {
      speaker: "user", mode: "listen",
      listenEn: "That'll be forty-five dollars even.",
      instruction: { ja: "もう一度聞いてみよう。いくら？" },
      options: [
        { en: "ちょうど45ドル", correct: true },
        { en: "ちょうど55ドル", correct: false, why: "fifty-five ではなく forty-five と言っている" },
        { en: "45ドル50セント", correct: false, why: "even は「ちょうど」。端数はない" },
      ],
    },
    { speaker: "npc", who: "航空会社", en: "Good evening. May I have your passport and see your bags?", ja: "こんばんは。パスポートと、お荷物を拝見できますか？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「はいどうぞ。預ける荷物は2つです」と伝えよう" },
      variants: {
        1: "Here you are. Two bags.",
        2: "Here you are. We have two bags to check.",
        3: "Here you are. We'd like to check two bags, please.",
      },
      keywords: ["two"],
      hint: { ja: "check a bag で「荷物を預ける」。チェックインの check と同じ語。" },
    },
    { speaker: "npc", who: "航空会社", en: "Would you like seats together?", ja: "お席はご一緒がよろしいですか？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「はい、家族4人で並びたいです」と伝えよう" },
      variants: {
        1: "Yes, together please.",
        2: "Yes, together please. We're a family of four.",
        3: "Yes, please. We'd like four seats together if possible.",
      },
      keywords: ["together"],
    },
    { speaker: "npc", who: "航空会社", en: "All set. Gate 7, boarding at nine twenty. Thank you for visiting Guam!", ja: "完了です。7番ゲート、9時20分搭乗開始です。グアムへお越しいただきありがとうございました！" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "旅の締めくくり。お礼を伝えよう" },
      variants: {
        1: "Thank you! We had a great time.",
        2: "Thank you. We had a wonderful time here.",
        3: "Thank you. We had a wonderful time. We'll definitely come back!",
      },
      keywords: ["thank"],
      hint: { ja: "We had a great time. は旅の最後にぴったりの一言。" },
    },
  ],
  wrapUp: {
    ja: "最終日はこの3つ。買う・預ける・お礼を言う。おつかれさま！",
    phrases: ["I'm looking for souvenirs.", "We have two bags to check.", "We had a great time!"],
  },
};
