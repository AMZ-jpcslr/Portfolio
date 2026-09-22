# AMZ — Developer Portfolio

就職活動で使うためのポートフォリオ・プロトタイプです。7件の公開リポジトリの概要、設計の工夫、GitHubリンク、3ステップの説明用デモを掲載しています。

## ローカルプレビュー

Node.js 22以上を使用します。外部npmパッケージは使わないため、インストールは不要です。

```sh
npm run dev
# npmが利用できない環境では: node scripts/serve.mjs
```

表示されたURL（通常 `http://127.0.0.1:4173`）を開いてください。ファイルを編集したらブラウザを再読み込みします。ポートを変える場合は `PORT` 環境変数を指定します。`index.html` をダブルクリックして開く方法ではES Modulesを読み込めません。

```sh
npm run check
npm run build
# npmが利用できない環境では: node scripts/check.mjs
```

`build` は静的ファイルの構成・構文チェックです。`dist/` が編集するソース兼公開フォルダです。生成物として削除しないでください。

## 利用者・利用シーンを追加する

`dist/projects.js` の各プロジェクトの `audience` を編集します。同じ値がカードと詳細の両方に反映されます。

```js
// 実際に確認できた情報を記入してください。
audience: '友人のDiscordコミュニティで、ボイスチャット参加者が利用',
```

空文字のときは「後日掲載予定」と表示します。利用人数や導入先は未確認のため初期データに含めていません。公開可能な実績だけを追記してください。

`summary` は一覧の概要、`challenge` は課題、`engineering` は実装の工夫、`features` は主な機能、`tags` は技術タグです。名前や自己紹介は `dist/index.html` から編集できます。

## デモの仕様

- カードをクリックするとネイティブのモーダルダイアログで詳細を表示します。Esc、閉じるボタン、背景クリックで閉じます。
- 各プロジェクトのデモは「再生」「一時停止」「次のステップ」「再生し直し」に対応します。1回の再生は3ステップで終了します。
- `/#project=Yomiage_Discord_Bot` のようなURLで詳細へ直接移動できます。
- Discord BotはDiscord風UI、配信ツールはエディター、AI研究は判断フロー、通信検査はダッシュボード、ロボットサッカーは模式図で説明します。
- デモは機能説明用です。実際のDiscordへの送信、音声合成、翻訳、気象情報の取得、通信検査、Java / Pythonの実行はしません。
- サイト下部の「アニメーションを停止」とOSの `prefers-reduced-motion` に対応しています。動きを抑える設定のときも、手動のステップ送りで内容を読めます。
- デモを閉じる、または別のタブへ移動すると、自動ステップ送りを停止します。

## Vercelへの公開

`vercel.json` に公開設定を用意しています。今回の作業には本番デプロイは含みません。

1. このフォルダの変更をGitHubのPortfolioリポジトリに反映します。
2. Vercelで「Add New → Project」からリポジトリをImportします。
3. Framework Presetは **Other**、Root Directoryはリポジトリ直下を指定します。
4. Build Commandは **npm run build**、Output Directoryは **dist** です（`vercel.json` に記載済み）。
5. Deploy後に発行されるURLから閲覧できます。APIキーや環境変数の設定は不要です。

設定の参考: https://vercel.com/docs/project-configuration / https://vercel.com/docs/builds/configure-a-build

## 構成

- `dist/index.html` — トップページ、ナビゲーション、ダイアログ
- `dist/styles.css` — 配色、レスポンシブレイアウト、アニメーション
- `dist/projects.js` — プロジェクトの紹介・利用者情報
- `dist/app.js` — 一覧、詳細、デモ制御、動きの設定
- `dist/demos.js` — プロジェクト別の3ステップデモ
- `scripts/serve.mjs` — ローカル専用プレビューサーバー
- `scripts/check.mjs` — 静的ファイル・データ・デモ・構文の検証
- `vercel.json` — Vercel公開設定

スマートフォンでは1列、デスクトップでは2列のカードレイアウトです。外部フォント（Google Fonts）が利用できない場合もシステムフォントで表示できます。閲覧時にGitHub APIは呼びません。

## 調査元と更新

2026-09-22にGitHubの公開APIで確認した公開リポジトリ7件を静的に収録しています。リポジトリ一覧の自動同期は行いません。新規リポジトリを追加するときは、データ・対応するデモ・表示件数・検証スクリプトを更新してください。

- https://github.com/AMZ-jpcslr/Yomiage_Discord_Bot/blob/master/README.md
- https://github.com/AMZ-jpcslr/Shindo_Discord_Bot/blob/master/README.md
- https://github.com/AMZ-jpcslr/Streaming-Screen/blob/master/README.md
- https://github.com/AMZ-jpcslr/Artificial-Moral-Architecture/blob/master/README.md
- https://github.com/AMZ-jpcslr/ssl-inspection-prodxy/blob/main/README.md
- https://github.com/AMZ-jpcslr/SSL-DEMO/blob/master/ssl-robot-ai/README.md
- https://github.com/AMZ-jpcslr/Portfolio （本サイトのプロトタイプとして記載）

公開READMEの機能をもとに紹介しています。利用実績や性能を独自に保証するものではなく、研究プロジェクトの限界は詳細に明記しています。
