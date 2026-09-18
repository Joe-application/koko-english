/** 発話の比較に使う正規化。SPEC.md §7.3 */

const CONTRACTIONS = {
  "i'm": "i am", "i've": "i have", "i'd": "i would", "i'll": "i will",
  "you're": "you are", "you've": "you have", "you'll": "you will", "you'd": "you would",
  "we're": "we are", "we've": "we have", "we'll": "we will",
  "they're": "they are", "they've": "they have", "they'll": "they will",
  "he's": "he is", "she's": "she is", "it's": "it is", "that's": "that is",
  "what's": "what is", "where's": "where is", "there's": "there is", "here's": "here is",
  "let's": "let us", "who's": "who is", "how's": "how is",
  "don't": "do not", "doesn't": "does not", "didn't": "did not",
  "can't": "can not", "cannot": "can not", "won't": "will not", "wouldn't": "would not",
  "couldn't": "could not", "shouldn't": "should not", "isn't": "is not", "aren't": "are not",
  "wasn't": "was not", "weren't": "were not", "haven't": "have not", "hasn't": "has not",
  "hadn't": "had not",
};

const NUMBERS = {
  "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five",
  "6": "six", "7": "seven", "8": "eight", "9": "nine", "10": "ten",
  "11": "eleven", "12": "twelve", "13": "thirteen", "14": "fourteen", "15": "fifteen",
  "16": "sixteen", "17": "seventeen", "18": "eighteen", "19": "nineteen", "20": "twenty",
  "30": "thirty", "40": "forty", "50": "fifty", "100": "one hundred",
};

/** 比較のじゃまになるだけの語 */
const IGNORED = new Set(["a", "an", "the"]);

/** 文字列 → 比較用のトークン配列 */
export function tokenize(input) {
  let s = String(input || "").toLowerCase();
  s = s.replace(/[‘’ʼ]/g, "'");           // カーリークォートを ' に
  s = s.replace(/[.,!?;:"“”()\[\]…\-–—]/g, " ");
  s = s.replace(/\s+/g, " ").trim();
  if (!s) return [];

  const out = [];
  for (const word of s.split(" ")) {
    const expanded = CONTRACTIONS[word];
    const parts = (expanded || word).split(" ");
    for (const part of parts) {
      const num = NUMBERS[part];
      (num ? num.split(" ") : [part]).forEach((t) => {
        const clean = t.replace(/[^a-z']/g, "");
        if (clean && !IGNORED.has(clean)) out.push(clean);
      });
    }
  }
  return out;
}

/**
 * 最長共通部分列。どのトークンが一致したかも返す。
 * @returns {{length:number, targetHit:boolean[], saidHit:boolean[]}}
 */
export function lcs(target, said) {
  const n = target.length, m = said.length;
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = target[i] === said[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const targetHit = new Array(n).fill(false);
  const saidHit = new Array(m).fill(false);
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (target[i] === said[j]) { targetHit[i] = true; saidHit[j] = true; i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return { length: dp[0][0], targetHit, saidHit };
}
