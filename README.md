# AMZ — Developer Portfolio

就職活動で使うためのポートフォリオ・プロトタイプです。6件の個人開発の概要、設計の工夫、GitHubリンク、利用実績と自動再生する機能再現デモを掲載しています。

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

`dist/projects.js` の `audience`（利用者）、`impact`（利用者に届いた価値）を編集します。同じ値がカードと詳細の両方に反映されます。研究の将来構想は `outlook` に記入します。

```js
// 実際に確認できた情報を記入してください。
audience: '友人のDiscordコミュニティで、ボイスチャット参加者が利用',
```

本人から提供された利用実績を掲載しています。読み上げ・防災Botは友人約10人、配信画面は小規模YouTuberからの依頼、自社での通信可視化、立命館大学Ri-oneでのSSLプロトタイプ活用を反映しています。Artificial Moral Architectureは研究段階であり、既存AIモデルへの活用は今後の展望として記載しています。

`summary` は一覧の概要、`challenge` は課題、`engineering` は実装の工夫、`features` は主な機能、`tags` は技術タグです。名前や自己紹介は `dist/index.html` から編集できます。

## デモの仕様

- カードをクリックするとネイティブのモーダルダイアログで詳細を表示します。Esc、閉じるボタン、背景クリックで閉じます。
- 一覧・詳細のデモは、18.6秒で全工程を見せる1本のCSSアニメーションとして自動再生・ループします。操作は一時停止と再生だけです。カメラ・アイコン・ロボットなどが同じ時間軸で動き、一時停止した位置から再開します。
- `/#project=Yomiage_Discord_Bot` のようなURLで詳細へ直接移動できます。
- Discord BotはDiscord風UI、配信ツールはエディター、AI研究は判断フロー、通信検査はダッシュボード、ロボットサッカーは模式図で説明します。
- デモは機能説明用です。実際のDiscordへの送信、音声合成、翻訳、地震・気象情報の取得、通信検査、Java / Pythonの実行はしません。
- サイト下部の「アニメーションを停止」とOSの `prefers-reduced-motion` に対応しています。動きを抑える設定のときも、デモの下にある説明文を読めます。
- 画面外のカード、詳細表示中の背景、非表示タブのデモは停止します。再び見えると再開しますが、自分で一時停止したデモは自動再開しません。詳細を閉じるとそのアニメーションを破棄します。

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
- `dist/demos.js` — 一覧・詳細で共有する永続DOMのデモシーン
- `dist/demos.css` — カメラ移動・発話リング・入室・パスなどの動作
- `scripts/serve.mjs` — ローカル専用プレビューサーバー
- `scripts/check.mjs` — 静的ファイル・データ・デモ・構文の検証
- `vercel.json` — Vercel公開設定

スマートフォンでは1列、デスクトップでは2列のカードレイアウトです。外部フォント（Google Fonts）が利用できない場合もシステムフォントで表示できます。閲覧時にGitHub APIは呼びません。

## 調査元と更新

2026-09-22にGitHubの公開APIで確認したリポジトリのうち、本人の希望でPortfolio自身を除いた6件を収録しています。リポジトリ一覧の自動同期は行いません。新規リポジトリを追加するときは、データ・対応するデモ・表示件数・検証スクリプトを更新してください。

- https://github.com/AMZ-jpcslr/Yomiage_Discord_Bot/blob/master/README.md
- https://github.com/AMZ-jpcslr/Shindo_Discord_Bot/blob/master/README.md
- https://github.com/AMZ-jpcslr/Streaming-Screen/blob/master/README.md
- https://github.com/AMZ-jpcslr/Artificial-Moral-Architecture/blob/master/README.md
- https://github.com/AMZ-jpcslr/ssl-inspection-prodxy/blob/main/README.md
- https://github.com/AMZ-jpcslr/SSL-DEMO/blob/master/ssl-robot-ai/README.md

公開READMEの機能をもとに紹介しています。利用実績や性能を独自に保証するものではなく、研究プロジェクトの限界は詳細に明記しています。

## デモの再現範囲

Discordの入室・発話表示・実コマンド、地震情報の通知、配信エディターの追加・ドラッグ・保存、Pythonの判断経路、通信検査のログ、Javaシミュレーターの6対6と位置評価に沿って動作を再構成しています。画面を切り替えて作り直さず同じDOMを動かすため、カメラ・選手・モジュールが連続して移動します。UI上の操作とバックグラウンド処理の解説を分けています。実サービスやモデルへ接続するライブデモではありません。地震情報・気象値・通信ログ・位置評価の色は説明用のサンプルです。

再生はCSSの共通時間軸で制御します。旧来のsetTimeoutによるステップ切り替えと「次のステップ」操作は削除しました。


## リンク共有時のサムネイル

`dist/og-image.png`（1200 × 630 px）をOGPとXの画像付きカードに設定しています。メタ情報は初期HTMLに含まれるので、JavaScriptを実行しない共有サービスでも読み取れます。

公開URLは `https://portfolio-amz-jpcslr.vercel.app` です。`npm run build` は `scripts/build.mjs` でURLを書き込んでからチェックを実行します。優先順位は `SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_URL` → 上記の公開URLです。独自ドメインに変更する場合は、Vercelの `SITE_URL` に `https://` から始まるURLを設定してください。

PNGはコミット対象です。Vercelで画像生成やPythonのインストールは不要です。デザインを変更する場合は `scripts/create-social-image.py` を編集し、PillowとWindowsのArial / 游ゴシックが利用できる環境で実行します。

公開サイトへの反映には再デプロイが必要です。共有サービスに以前の表示が残る場合は、キャッシュ更新後に新しい画像が表示されます。

仕様: [Open Graph](https://ogp.me/) / [Vercelの公開URL環境変数](https://vercel.com/docs/environment-variables/system-environment-variables#vercel_project_production_url)
