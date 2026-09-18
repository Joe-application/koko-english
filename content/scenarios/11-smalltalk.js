export default {
  id: "smalltalk",
  order: 11,
  title: { ja: "現地の人と雑談", en: "Small Talk" },
  icon: "💬",
  place: "ビーチのベンチ",
  unlockAfter: ["trouble"],
  reward: { coins: 30, item: "friendship-band" },
  intro: {
    ja: "用事のない会話。旅でいちばん記憶に残るのは、たいていこれ。",
    tips: [
      "聞かれることはほぼ決まっている。どこから来たか、何日いるか、グアムはどうか。",
      "質問されたら、答えて終わりにせず How about you? と返すと会話が続く。",
    ],
  },
  turns: [
    { speaker: "npc", who: "地元の人", en: "Beautiful day, isn't it?", ja: "いい天気ですね。" },
    {
      speaker: "user", mode: "choice",
      instruction: { ja: "「本当ですね！」はどれ？" },
      options: [
        { en: "It really is!", correct: true },
        { en: "Yes, it is a day.", correct: false, why: "「日ですね」になってしまう" },
        { en: "I think so too much.", correct: false, why: "too much が余計で意味が変わる" },
      ],
    },
    { speaker: "npc", who: "地元の人", en: "Where are you folks from?", ja: "みなさん、どちらから？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「日本から来ました」と答えよう" },
      variants: {
        1: "From Japan.",
        2: "We're from Japan.",
        3: "We're from Japan — near Tokyo.",
      },
      keywords: ["japan"],
      hint: { ja: "folks は「みなさん」というくだけた言い方。" },
    },
    { speaker: "npc", who: "地元の人", en: "Oh, nice! How long are you staying?", ja: "いいですね！どのくらい滞在されるんですか？" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「5日間です」と答えて、相手にも聞き返してみよう" },
      variants: {
        1: "Five days.",
        2: "Five days. Do you live here?",
        3: "Five days. Have you lived here long?",
      },
      keywords: ["five"],
      hint: { ja: "答えたあとに質問を返すと、会話が一方通行にならない。" },
    },
    { speaker: "npc", who: "地元の人", en: "Born and raised! My family's been here for generations.", ja: "生まれも育ちもここ！家族は何代も前からここに住んでいます。" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "聞き取れなかった。聞き返そう" },
      variants: {
        1: "Sorry, again please?",
        2: "Sorry, could you say that again?",
        3: "I'm sorry, I didn't catch that. Could you say it again?",
      },
      keywords: ["sorry"],
    },
    { speaker: "npc", who: "地元の人", en: "I said I was born here. This is my home.", ja: "ここで生まれたって言ったんです。ここが故郷です。" },
    {
      speaker: "user", mode: "listen",
      listenEn: "I was born here. This is my home.",
      instruction: { ja: "もう一度聞いてみよう。この人はグアムとどんな関係？" },
      options: [
        { en: "ここで生まれ育った人", correct: true },
        { en: "旅行で来ている人", correct: false, why: "born here = ここで生まれた、と言っている" },
        { en: "仕事で来ている人", correct: false, why: "This is my home. は「ここが自分の故郷」という意味" },
      ],
    },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「グアムはとてもきれいですね」と伝えよう" },
      variants: {
        1: "Guam is beautiful!",
        2: "Guam is really beautiful.",
        3: "Guam is beautiful. We're really enjoying it here.",
      },
      keywords: ["beautiful"],
    },
    { speaker: "npc", who: "地元の人", en: "Thank you! Have you tried red rice yet? You really should.", ja: "ありがとう！レッドライスはもう食べました？ぜひ食べてみて。" },
    {
      speaker: "user", mode: "choice",
      instruction: { ja: "「まだです。試してみます！」はどれ？" },
      options: [
        { en: "Not yet. We'll try it!", correct: true },
        { en: "No still. We try it.", correct: false, why: "still ではなく yet を使う" },
        { en: "Never. I don't eat that.", correct: false, why: "せっかくのすすめを強く断る形になってしまう" },
      ],
    },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「教えてくれてありがとう」と伝えて別れよう" },
      variants: {
        1: "Thanks for telling me!",
        2: "Thanks for the tip! Have a nice day.",
        3: "Thanks for the tip. It was nice talking with you!",
      },
      keywords: ["thanks"],
      hint: { ja: "It was nice talking with you. は別れぎわの定番。覚えておくと会話をきれいに終えられる。" },
    },
  ],
  wrapUp: {
    ja: "雑談はこの3つ。答える・聞き返す・お礼を言う。",
    phrases: ["We're from Japan.", "Have you lived here long?", "It was nice talking with you!"],
  },
};
