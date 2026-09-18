export default {
  id: "hotel-checkin",
  order: 4,
  title: { ja: "ホテルでチェックイン", en: "Hotel Check-in" },
  icon: "🏨",
  place: "タモン パシフィックベイホテル",
  unlockAfter: ["taxi-hotel"],
  reward: { coins: 30, item: "shell-key" },
  intro: {
    ja: "ホテルに着いた。フロントで名前を伝えてチェックインしよう。",
    tips: [
      "名前は聞き取りにくいので、ゆっくりハッキリ言うのがコツ。予約票を見せてもいい。",
      "朝食の時間と Wi-Fi は、ここで聞いておくと後がラク。",
    ],
  },
  turns: [
    {
      speaker: "npc", who: "フロント",
      en: "Hafa adai! Welcome to the Pacific Bay Hotel. Are you checking in?",
      ja: "ハファデイ！パシフィックベイホテルへようこそ。チェックインですか？",
      note: "Hafa adai（ハファデイ）はチャモロ語の「こんにちは」。グアムでよく使われる挨拶。",
    },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「はい。ジョウズカの名前で予約しています」と伝えよう" },
      variants: {
        1: "Yes. Jozuka.",
        2: "Yes, I have a reservation. Jozuka.",
        3: "Yes, I have a reservation under the name Jozuka.",
      },
      keywords: ["reservation"],
      hint: { ja: "under the name 〜 = 〜という名前で" },
    },
    { speaker: "npc", who: "フロント", en: "Thank you. May I see your passport, please?", ja: "ありがとうございます。パスポートを見せていただけますか？" },
    {
      speaker: "user", mode: "choice",
      instruction: { ja: "「はい、どうぞ」はどれ？" },
      options: [
        { en: "Here you are.", correct: true },
        { en: "Here I am.", correct: false, why: "「ここにいます」という意味になってしまう" },
        { en: "Take it.", correct: false, why: "命令口調でぶっきらぼうに聞こえる" },
      ],
    },
    { speaker: "npc", who: "フロント", en: "Perfect. You're in room 812, on the eighth floor.", ja: "けっこうです。お部屋は8階の812号室です。" },
    {
      speaker: "user", mode: "listen",
      listenEn: "You're in room 812, on the eighth floor.",
      instruction: { ja: "もう一度聞いてみよう。部屋は何階？" },
      options: [
        { en: "8階", correct: true },
        { en: "18階", correct: false, why: "eighteenth ではなく eighth と言っている" },
        { en: "12階", correct: false, why: "812 は部屋番号。階は eighth floor" },
      ],
    },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「朝食は何時からですか？」と聞こう" },
      variants: {
        1: "What time is breakfast?",
        2: "What time does breakfast start?",
        3: "Could you tell me what time breakfast starts?",
      },
      keywords: ["breakfast"],
    },
    { speaker: "npc", who: "フロント", en: "Breakfast is from six thirty to ten, on the second floor.", ja: "朝食は6時半から10時まで、2階です。" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "時間が聞き取れなかった。「もう一度お願いします」と言おう" },
      variants: {
        1: "Sorry, again please?",
        2: "Sorry, could you say that again?",
        3: "I'm sorry, could you repeat that, please?",
      },
      keywords: ["sorry"],
      hint: { ja: "時間や数字は聞き取りにくい。その場で確認しておくほうが確実。" },
    },
    { speaker: "npc", who: "フロント", en: "Of course. Six thirty to ten, on the second floor.", ja: "もちろんです。6時半から10時まで、2階です。" },
    {
      speaker: "user", mode: "speak",
      instruction: { ja: "「Wi-Fiのパスワードを教えてもらえますか？」と聞こう" },
      variants: {
        1: "Wi-Fi password, please?",
        2: "Could I have the Wi-Fi password?",
        3: "Could you tell me the Wi-Fi password, please?",
      },
      keywords: ["wi-fi"],
      hint: { ja: "Wi-Fi は「ワイファイ」でそのまま通じる。" },
    },
    { speaker: "npc", who: "フロント", en: "Of course. It's printed on this card. Anything else?", ja: "もちろんです。このカードに書いてあります。他にご用件は？" },
    {
      speaker: "user", mode: "choice",
      instruction: { ja: "「いえ、大丈夫です。ありがとう」はどれ？" },
      options: [
        { en: "No, that's all. Thank you!", correct: true },
        { en: "No, I am fine thank you very much for it.", correct: false, why: "長すぎて不自然。短く言うほうが自然" },
        { en: "No more. Finish.", correct: false, why: "ぶっきらぼうで冷たく聞こえる" },
      ],
    },
    { speaker: "npc", who: "フロント", en: "Enjoy your stay!", ja: "ごゆっくりどうぞ！" },
  ],
  wrapUp: {
    ja: "チェックインはこの3つ。名前を伝えて、渡して、聞きたいことを聞く。",
    phrases: ["I have a reservation.", "Here you are.", "What time does breakfast start?"],
  },
};
