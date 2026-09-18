/**
 * 現地でそのまま使えるフレーズ帳。
 * 学習用ではなく「その場で開いて言う・見せる」ためのものなので、
 * 短く・失礼にならず・発音しやすいものを選ぶ。
 */

export const categories = [
  { key: "greeting", label: "あいさつ", icon: "👋" },
  { key: "airport", label: "空港", icon: "✈️" },
  { key: "hotel", label: "ホテル", icon: "🏨" },
  { key: "food", label: "食事", icon: "🍽" },
  { key: "shopping", label: "買い物", icon: "🛍" },
  { key: "beach", label: "ビーチ", icon: "🏖" },
  { key: "trouble", label: "こまったとき", icon: "🆘" },
];

export const phrases = [
  /* ---------- あいさつ ---------- */
  { id: "g1", cat: "greeting", en: "Hello.", ja: "こんにちは。" },
  { id: "g2", cat: "greeting", en: "Hafa adai!", ja: "こんにちは！（グアムのチャモロ語のあいさつ）" },
  { id: "g3", cat: "greeting", en: "Thank you.", ja: "ありがとう。" },
  { id: "g4", cat: "greeting", en: "Thank you so much.", ja: "本当にありがとう。" },
  { id: "g5", cat: "greeting", en: "Excuse me.", ja: "すみません。（声をかけるとき）" },
  { id: "g6", cat: "greeting", en: "I'm sorry.", ja: "ごめんなさい。" },
  { id: "g7", cat: "greeting", en: "You're welcome.", ja: "どういたしまして。" },
  { id: "g8", cat: "greeting", en: "Nice to meet you.", ja: "はじめまして。" },
  { id: "g9", cat: "greeting", en: "Have a nice day!", ja: "よい一日を！" },
  { id: "g10", cat: "greeting", en: "Sorry, could you say that again?", ja: "すみません、もう一度言ってもらえますか？" },
  { id: "g11", cat: "greeting", en: "Could you speak more slowly, please?", ja: "もう少しゆっくり話してもらえますか？" },
  { id: "g12", cat: "greeting", en: "I don't speak English very well.", ja: "英語があまり得意ではありません。" },
  { id: "g13", cat: "greeting", en: "Just a moment, please.", ja: "少し待ってください。" },

  /* ---------- 空港 ---------- */
  { id: "a1", cat: "airport", en: "Sightseeing.", ja: "観光です。（入国審査で目的を聞かれたら）" },
  { id: "a2", cat: "airport", en: "For five days.", ja: "5日間です。（滞在日数）" },
  { id: "a3", cat: "airport", en: "I'm traveling with my family.", ja: "家族と一緒です。" },
  { id: "a4", cat: "airport", en: "Here you are.", ja: "はい、どうぞ。（パスポートなどを渡すとき）" },
  { id: "a5", cat: "airport", en: "Where is the baggage claim?", ja: "手荷物受取所はどこですか？" },
  { id: "a6", cat: "airport", en: "My suitcase hasn't come out.", ja: "スーツケースが出てきません。" },
  { id: "a7", cat: "airport", en: "Where can I get a taxi?", ja: "タクシーはどこで乗れますか？" },
  { id: "a8", cat: "airport", en: "Could I have a blanket, please?", ja: "毛布をもらえますか？（機内で）" },
  { id: "a9", cat: "airport", en: "Excuse me, can I get through?", ja: "すみません、通してもらえますか？" },
  { id: "a10", cat: "airport", en: "Where is the check-in counter?", ja: "チェックインカウンターはどこですか？" },

  /* ---------- ホテル ---------- */
  { id: "h1", cat: "hotel", en: "I have a reservation.", ja: "予約しています。" },
  { id: "h2", cat: "hotel", en: "Checking in, please.", ja: "チェックインをお願いします。" },
  { id: "h3", cat: "hotel", en: "What time does breakfast start?", ja: "朝食は何時からですか？" },
  { id: "h4", cat: "hotel", en: "Could I have the Wi-Fi password?", ja: "Wi-Fi のパスワードを教えてもらえますか？" },
  { id: "h5", cat: "hotel", en: "Could I have some more towels?", ja: "タオルをもう少しもらえますか？" },
  { id: "h6", cat: "hotel", en: "The air conditioner isn't working.", ja: "エアコンが動きません。" },
  { id: "h7", cat: "hotel", en: "Could you keep my luggage until three?", ja: "3時まで荷物を預かってもらえますか？" },
  { id: "h8", cat: "hotel", en: "What time is checkout?", ja: "チェックアウトは何時ですか？" },
  { id: "h9", cat: "hotel", en: "Could I have a wake-up call at seven?", ja: "7時にモーニングコールをお願いできますか？" },
  { id: "h10", cat: "hotel", en: "Is there a convenience store nearby?", ja: "近くにコンビニはありますか？" },

  /* ---------- 食事 ---------- */
  { id: "f1", cat: "food", en: "A table for four, please.", ja: "4人です。（席を頼むとき）" },
  { id: "f2", cat: "food", en: "Could I see the menu, please?", ja: "メニューを見せてもらえますか？" },
  { id: "f3", cat: "food", en: "What do you recommend?", ja: "おすすめは何ですか？" },
  { id: "f4", cat: "food", en: "I'll have this one, please.", ja: "これをください。（指さしながら）" },
  { id: "f5", cat: "food", en: "The same, please.", ja: "同じものをください。" },
  { id: "f6", cat: "food", en: "For here, please.", ja: "店内で食べます。" },
  { id: "f7", cat: "food", en: "To go, please.", ja: "持ち帰ります。" },
  { id: "f8", cat: "food", en: "No ice, please.", ja: "氷は入れないでください。" },
  { id: "f9", cat: "food", en: "Could I have some water, please?", ja: "お水をもらえますか？" },
  { id: "f10", cat: "food", en: "Could we have separate plates?", ja: "取り皿をもらえますか？" },
  { id: "f11", cat: "food", en: "Is this spicy?", ja: "これは辛いですか？" },
  { id: "f12", cat: "food", en: "Could I have the check, please?", ja: "お会計をお願いします。" },
  { id: "f13", cat: "food", en: "It was delicious. Thank you!", ja: "おいしかったです。ありがとう！" },

  /* ---------- 買い物 ---------- */
  { id: "s1", cat: "shopping", en: "I'm just looking, thank you.", ja: "見ているだけです、ありがとう。" },
  { id: "s2", cat: "shopping", en: "How much is this?", ja: "これはいくらですか？" },
  { id: "s3", cat: "shopping", en: "Do you have this in a larger size?", ja: "もう少し大きいサイズはありますか？" },
  { id: "s4", cat: "shopping", en: "Can I try this on?", ja: "試着してもいいですか？" },
  { id: "s5", cat: "shopping", en: "I'll take this.", ja: "これをください。" },
  { id: "s6", cat: "shopping", en: "Do you take credit cards?", ja: "クレジットカードは使えますか？" },
  { id: "s7", cat: "shopping", en: "Could I have a bag, please?", ja: "袋をもらえますか？" },
  { id: "s8", cat: "shopping", en: "Could you wrap it as a gift?", ja: "プレゼント用に包んでもらえますか？" },
  { id: "s9", cat: "shopping", en: "Where is the restroom?", ja: "トイレはどこですか？" },
  { id: "s10", cat: "shopping", en: "I'm looking for souvenirs.", ja: "おみやげを探しています。" },

  /* ---------- ビーチ ---------- */
  { id: "b1", cat: "beach", en: "I'd like to rent two beach chairs.", ja: "ビーチチェアを2つ借りたいです。" },
  { id: "b2", cat: "beach", en: "How much is it for one hour?", ja: "1時間でいくらですか？" },
  { id: "b3", cat: "beach", en: "Is it safe to swim here?", ja: "ここで泳いでも大丈夫ですか？" },
  { id: "b4", cat: "beach", en: "My children are with me.", ja: "子どもが一緒です。" },
  { id: "b5", cat: "beach", en: "Do we need a reservation?", ja: "予約は必要ですか？" },
  { id: "b6", cat: "beach", en: "What time do we need to be back?", ja: "何時までに戻ればいいですか？" },
  { id: "b7", cat: "beach", en: "Could you take a picture of us?", ja: "写真を撮ってもらえますか？" },
  { id: "b8", cat: "beach", en: "Where can I change?", ja: "着替えはどこでできますか？" },

  /* ---------- こまったとき ---------- */
  { id: "t1", cat: "trouble", en: "Could you help me?", ja: "助けてもらえますか？" },
  { id: "t2", cat: "trouble", en: "I don't feel well.", ja: "体調がよくありません。" },
  { id: "t3", cat: "trouble", en: "My child doesn't feel well.", ja: "子どもの具合がよくありません。" },
  { id: "t4", cat: "trouble", en: "Is there a hospital nearby?", ja: "近くに病院はありますか？" },
  { id: "t5", cat: "trouble", en: "I lost my wallet.", ja: "財布をなくしました。" },
  { id: "t6", cat: "trouble", en: "I left my bag in the taxi.", ja: "タクシーにかばんを忘れました。" },
  { id: "t7", cat: "trouble", en: "I can't find my child.", ja: "子どもが見つかりません。" },
  { id: "t8", cat: "trouble", en: "Could you call the police?", ja: "警察を呼んでもらえますか？" },
  { id: "t9", cat: "trouble", en: "Where am I on this map?", ja: "地図で今どこにいますか？" },
  { id: "t10", cat: "trouble", en: "I'm staying at the Pacific Bay Hotel.", ja: "パシフィックベイホテルに泊まっています。" },
  { id: "t11", cat: "trouble", en: "Could you write it down, please?", ja: "書いてもらえますか？" },
];

export const phraseMap = Object.fromEntries(phrases.map((p) => [p.id, p]));

/** 日本語でも英語でも引っかかるように、両方を対象にした部分一致 */
export function searchPhrases(query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return phrases;
  return phrases.filter((p) => p.en.toLowerCase().includes(q) || p.ja.includes(q));
}
