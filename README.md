# ココイングリッシュ（KoKo English）

グアム旅行（2027年3月下旬〜4月上旬）に向けた、家族4人用の英会話練習 Web アプリ。
仕様は [SPEC.md](./SPEC.md) を正とする。

## 動かす

ES モジュールを使っているため、HTML ファイルを直接開く（`file://`）と動かない。
かならずローカルサーバー経由で開くこと。

```bash
cd ~/Claude/GuamEnglish && python3 -m http.server 5173
```

→ ブラウザで http://localhost:5173 を開く。

## 実装状況

| Phase | 内容 | 状態 |
|---|---|---|
| 1 | 骨格・プロフィール・シナリオ再生・3択・リザルト・ポイント | ✅ |
| 2 | マイクでの発音チェック・採点・自己採点フォールバック | ✅ |
| 3 | コレクション（おみやげ・衣装・バッジ）とショップ | 未着手 |
| 4 | 家族対戦（コード共有）・フレーズ帳 | 未着手 |
| 5 | シナリオ全12本・PWA / Service Worker・GitHub Pages 配信 | 未着手 |

シナリオは現在 2 本（`airplane` / `immigration`）。

## 家族に配る（GitHub Pages）

スマホに `http://localhost:5173` を送っても**開けない**。localhost は「その端末自身」を指すため。
家族全員がいつでも使えるようにするには、GitHub Pages に上げて https の URL を配る。

1. **GitHub のアカウントを作る** … https://github.com/signup
2. **GitHub Desktop を入れてサインイン** … https://desktop.github.com
   （ターミナルでトークンを扱わずに済むのでこちらが楽）
3. GitHub Desktop で `File → Add Local Repository` → `~/Claude/GuamEnglish` を選ぶ
4. `Publish repository` を押す。名前は `koko-english`、**Public** のまま
   （Private + Pages は有料プランが必要。学習アプリなので公開で問題ない。
   　学習記録は各端末の中だけに保存されるので、公開されるのはアプリのコードだけ）
5. github.com の当該リポジトリ → `Settings` → `Pages`
   → Source を `Deploy from a branch`、ブランチを `main` / `/ (root)` にして `Save`
6. 数分待つと公開される:
   `https://<GitHubのユーザー名>.github.io/koko-english/`
7. この URL を家族の LINE に送る

更新するときは、GitHub Desktop で `Commit` → `Push origin`。数分で全員の端末に反映される。

> サブディレクトリ配信（`/koko-english/` 配下）で動くことは確認済み。パスはすべて相対にしてある。

## スマホで試すときの注意

マイク（発音チェック）は **セキュアコンテキストでしか動かない**。
つまり `https://` か `http://localhost` のときだけで、
Mac のローカル IP（`http://192.168.x.x:5173`）にスマホからアクセスしても**マイクは使えない**。

- Mac のブラウザで試す → `http://localhost:5173` でマイクが使える
- iPhone / Android で試す → **GitHub Pages（https）に上げてから**。それまではスマホでは自己採点モードになる

## 注意

- 外部ライブラリ・CDN・API を一切使わない。依存を増やさないこと。
- 学習記録は端末の localStorage（キー `kokoEnglish.v1`）にのみ保存される。
  設定画面の「バックアップをコピー」で書き出せる。
- 音声認識は通信が必要。オフライン時・非対応ブラウザでは自動で自己採点モードになる。
