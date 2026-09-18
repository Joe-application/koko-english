export default {
  id: "fastfood",
  order: 6,
  title: { ja: "ファストフード", en: "Fast Food" },
  icon: "🍔",
  place: "ショッピングモールのフードコート",
  unlockAfter: ["restaurant"],
  reward: { coins: 30, item: "burger" },
  intro: {
    ja: "お昼はフードコートで。ここは子どもが自分で注文しやすい場所。",
    tips: [
      "早口で聞かれるのは、だいたい「セットにする？」「店内？持ち帰り？」の2つ。",
      "答えが決まっているので、先に用意しておけばこわくない。",
    ],
  },
  turns: [
    { speaker: "npc", who: "店員", en: "Hi! What can I get for you?", ja: "いらっしゃいませ！ご注文は？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「チーズバーガーをひとつください」と頼もう" },
      variants: {
        1: "One cheeseburger, please.",
        2: "Can I get a cheeseburger, please?",
        3: "Could I get a cheeseburger, please?",
      },
      keywords: ["cheeseburger"],
      hint: { ja: "Can I get 〜? はアメリカの店でいちばんよく使う頼み方。" },
    },
    { speaker: "npc", who: "店員", en: "Would you like to make that a combo?", ja: "セットにしますか？" },
    {
      speaker: "user", mode: "choice",
      instruction: { ja: "「はい、セットでお願いします」はどれ？" },
      options: [
        { en: "Yes, please.", correct: true },
        { en: "Yes, I make combo.", correct: false, why: "自分が作ることになってしまう" },
        { en: "Combo yes.", correct: false, why: "通じなくはないが、Yes, please. のほうが自然で簡単" },
      ],
    },
    { speaker: "npc", who: "店員", en: "What would you like to drink with that?", ja: "お飲み物は何にしますか？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「オレンジジュースをお願いします」と答えよう" },
      variants: { 1: "Orange juice, please.", 2: "Orange juice, please.", 3: "Orange juice, please. No ice, if that's okay." },
      keywords: ["orange"],
    },
    { speaker: "npc", who: "店員", en: "For here or to go?", ja: "店内でお召し上がりですか、お持ち帰りですか？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「ここで食べます」と答えよう" },
      variants: { 1: "For here.", 2: "For here, please.", 3: "For here, please. Thank you." },
      keywords: ["here"],
      hint: { ja: "持ち帰りなら To go, please. この2つは丸暗記でいい。" },
    },
    { speaker: "npc", who: "店員", en: "That'll be twelve fifty.", ja: "12ドル50セントになります。" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "金額が聞き取れなかった。「もう一度お願いします」と言おう" },
      variants: {
        1: "Sorry, again please?",
        2: "Sorry, how much was that?",
        3: "I'm sorry, could you say that again?",
      },
      keywords: ["sorry"],
      hint: { ja: "レジは早口になりがち。聞き返すのは当たり前のことなので遠慮しない。" },
    },
    { speaker: "npc", who: "店員", en: "Sure. Twelve fifty.", ja: "はい。12ドル50セントです。" },
    {
      speaker: "user", mode: "listen",
      listenEn: "That'll be twelve fifty.",
      instruction: { ja: "もう一度聞いてみよう。いくら？" },
      options: [
        { en: "12ドル50セント", correct: true },
        { en: "20ドル15セント", correct: false, why: "twelve（12）fifty（50）と言っている" },
        { en: "50ドル12セント", correct: false, why: "先に言うほうがドル。twelve fifty = $12.50" },
      ],
    },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「カードで払えますか？」と聞こう" },
      variants: {
        1: "Card, okay?",
        2: "Can I pay by card?",
        3: "Do you take credit cards?",
      },
      keywords: ["card"],
    },
    { speaker: "npc", who: "店員", en: "Sure. Go ahead and tap right here.", ja: "もちろん。ここにタッチしてください。" },
    {
      speaker: "user", mode: "choice",
      instruction: { ja: "受け取ってお礼を言おう。自然なのはどれ？" },
      options: [
        { en: "Thanks! Have a good one.", correct: true },
        { en: "Thank you for the hamburger giving me.", correct: false, why: "語順が崩れていて意味が取れない" },
        { en: "Goodbye forever.", correct: false, why: "「永遠にさようなら」になってしまう" },
      ],
    },
  ],
  wrapUp: {
    ja: "フードコートはこの3つを覚えれば自分で注文できる。",
    phrases: ["Can I get a cheeseburger, please?", "For here, please.", "Can I pay by card?"],
  },
};
