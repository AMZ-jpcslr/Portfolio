# AMZ — Developer Portfolio

**日常の不便から、社会の課題まで。個人開発から、問題解決の糸口をつくる。**

[公開サイトを見る](https://portfolio-amz-jpcslr.vercel.app/) · [制作一覧](https://portfolio-amz-jpcslr.vercel.app/#work) · [GitHub](https://github.com/AMZ-jpcslr)

7つの個人開発について、動作デモに加え、**課題設定・検討プロセス・意思決定の理由・担当範囲・AIの活用方法・利用者に届いた価値**を紹介するポートフォリオです。

![ポートフォリオのトップページ。開発コンセプトと本人・AIの担当を表示](docs/images/portfolio-home.jpg)

## 制作体制とAIの活用

掲載作品は個人開発です。本人が課題を捉え、具体的にどのような機能を持たせるかを設計し、**コーディングはすべてAIが担当**しています。このポートフォリオでは、本人の担当である課題設定・機能設計・仕様の判断を中心に紹介します。

| 担当 | 内容 |
| --- | --- |
| 本人 | 取り組む課題の設定、必要な機能の検討、機能・仕様の設計 |
| AI | 設計内容に沿ったコーディング全般 |
| 利用者・依頼者 | 実際の利用や依頼を通じた関わり。共同開発者とは区別して記載 |

SSLの試作は、自身が参加する立命館大学Ri-oneのSSLチームで活用されました。ここでは個人制作したプロトタイプの貢献範囲を示し、チーム全体の成果と区別しています。

## 完成までの考え方を読む

各プロジェクトの詳細は、次の順で読むことができます。

1. **設計の焦点・担当** — 何を目指し、本人とAIが何を担ったか
2. **プロモーション映像** — 導入・操作・利用価値を24秒で紹介
3. **課題設定・検討プロセス** — 利用場面から必要な機能へ落とし込む流れ
4. **意思決定と理由** — 採用した構成、その狙い、制約やトレードオフ
5. **担当範囲・AI活用** — 個人で設計した範囲と、AIに任せた実装
6. **実装・利用実績** — 設計を支える仕組みと、利用者に届いた価値

![Streaming Screenの詳細。課題、検討プロセス、設計判断とトレードオフ](docs/images/case-study-process.jpg)

利用実績・担当範囲・AIとの分担は本人の申告に基づきます。設計の狙いは課題と公開仕様をもとに整理した説明であり、未確認の比較実験・開発履歴・定量成果は追加していません。

## 掲載プロジェクト

| プロジェクト | 課題と設計上の判断 | 利用・活用先 |
| --- | --- | --- |
| [Yomiage Bot](https://github.com/AMZ-jpcslr/Yomiage_Discord_Bot) | 声を出せない人の会話参加を支援。読み上げと翻訳を分離し、会話の継続を重視 | 友人約10人。テキストだけでボイスチャットへ参加できる点が好評 |
| [Shindo Bot](https://github.com/AMZ-jpcslr/Shindo_Discord_Bot) | PC作業中に地震速報へ気づけるよう、Discordへ通知。震度条件と重複判定を設計 | 友人約10人。普段開いているDiscordで速報を受け取れる |
| [Streaming Screen](https://github.com/AMZ-jpcslr/Streaming-Screen) | 配信画面を直感的に編集。編集と出力を分け、保存時に配信へ反映 | 小規模YouTuberからの依頼。専門知識なしで操作できる点が好評 |
| [Artificial Moral Architecture](https://github.com/AMZ-jpcslr/Artificial-Moral-Architecture) | 行動の未来と当事者への影響を評価。判断と実行を独立した段階に分離 | 個人研究。既存AIモデルへの活用を今後探究 |
| [Inspection Proxy](https://github.com/AMZ-jpcslr/ssl-inspection-prodxy) | 見えない通信を可視化。中継・検出・記録・表示を分離 | 母と営む小規模な会社。監視とネットリテラシー向上に活用 |
| [SSL Robot AI](https://github.com/AMZ-jpcslr/SSL-DEMO) | 位置取りの候補をマップ上でスコアリング。パス・シュート判断につなげる | 立命館大学Ri-oneのSSLチームへ導入するシステムのプロトタイプ |
| [しゅうかつ手帳](https://github.com/AMZ-jpcslr/Syukatu-Note) | 就活の日程管理と公開募集の引用。共有情報と個人の記録を分離 | 友人数人。予定を整理しやすく、ほかの人が見つけた応募機会に触れられる点が好評 |

## デモのスクリーンショット

以下は**このポートフォリオ内で動く機能再現デモを、ブラウザで撮影した画像**です。元の製品やDiscord・OBSの実稼働画面のキャプチャではありません。実装や公開仕様に沿って、操作と処理の流れを説明するために再構成しています。

### 配信画面の編集

テキストを追加し、カーソルと一緒にドラッグして配置を調整。保存すると配信用の表示へ反映する流れです。

![Streaming Screenの機能再現デモ。配信画面を編集する様子](docs/images/demo-streaming.jpg)

### ロボットサッカーの位置評価

6対6の配置から候補位置を評価し、移動・パス・シュートへつなげる模式デモです。

![SSL Robot AIの機能再現デモ。位置評価と6対6のロボットサッカー](docs/images/demo-soccer.jpg)

7作品すべてに、作品別の導入コピー・奥行きのあるカメラ移動・操作に同期した字幕・利用価値を伝えるエンドカードを用意しています。

各デモは24秒で自動再生・ループし、一時停止・再開、最初からの再生、再生位置の移動ができます。映像はブラウザ内のHTML / CSSで描画する無音のアニメーションで、MP4ファイルではありません。Discord送信、音声合成、外部APIへの接続、実際の通信検査、Java / Pythonの実行は行いません。地震情報・通信ログ・位置評価の色は説明用サンプルです。

### しゅうかつ手帳

公開募集を見つけ、自分専用のコピーとして引用し、カレンダーで次の予定を確認します。友人数人が利用し、予定の管理しやすさと、ほかの人が見つけた応募先に触れられる点が好評です。

![しゅうかつ手帳のプロモーション映像。引用した募集の日程をカレンダーで確認](docs/images/demo-career.jpg)

[しゅうかつ手帳を開く](https://syukatu-note.vercel.app/) · [公開リポジトリ](https://github.com/AMZ-jpcslr/Syukatu-Note)

## ローカルで動かす

Node.js 22以上を使用します。外部npmパッケージのインストールは不要です。

```sh
npm run dev
# npmがない場合
node scripts/serve.mjs
```

`http://127.0.0.1:4173` を開きます。ファイルを編集したらブラウザを再読み込みしてください。ポートは `PORT` 環境変数で変更できます。ES Modulesを使うため、HTMLファイルのダブルクリックではなくHTTPサーバー経由で表示します。

```sh
npm run check  # データ・アセット・JavaScript構文などを検証
npm run build  # 公開URLをOGPへ反映してから検証
# npmがない場合
node scripts/check.mjs
node scripts/build.mjs
```

`dist/` は編集するソース兼公開フォルダです。ビルドで生成し直すフォルダではないため、削除しないでください。

## 紹介内容を更新する

`dist/projects.js` がプロジェクト情報の元データです。一覧と詳細に共通で使います。

| 項目 | 内容 |
| --- | --- |
| `summary` / `challenge` | 一覧の概要 / 解決したい課題 |
| `caseStudy.focus` | 設計の焦点。一覧と詳細冒頭に表示 |
| `caseStudy.process` | 課題から機能・実装へ至る説明。`title` と `body` の配列 |
| `caseStudy.decision` | `choice`：設計判断、`reason`：理由、`tradeoff`：制約 |
| `caseStudy.role` | `scope`：本人の担当、`collaboration`：利用者・依頼者・チームとの関係 |
| `caseStudy.ai` | `human`：本人が担当したこと、`assistant`：AIが担当したこと |
| `engineering` / `features` | 実装の構成 / 主な機能 |
| `audience` / `impact` | 利用者 / 利用者に届いた価値 |
| `outlook` | 研究などの今後の展望 |

新しい判断経緯、使用したAIツール、検証手順を追加するときは、実際に確認できた内容を記入してください。画像は `docs/images/` に保存し、READMEから相対パスで参照します。画像の更新方法は [キャプチャの記録](docs/images/README.md) を参照してください。

## サイトの動作

- 一覧からネイティブのモーダルダイアログで詳細を表示。Esc・閉じるボタン・背景クリックで閉じます。
- `/#project=Streaming-Screen` のようなURLで詳細を直接開けます。
- CSSの同一時間軸でカメラや登場要素を動かし、一時停止した位置から再開します。
- 画面外のカード、詳細表示中の背景、非表示タブのデモは一時停止します。
- サイト全体のアニメーション停止とOSの `prefers-reduced-motion` に対応。説明文は停止中も読めます。
- スマートフォンでは1列、デスクトップでは2列のカード表示。検討プロセスや担当情報も画面幅に合わせて折り返します。
- GitHub APIを閲覧時に呼び出さず、Google Fontsが使えない場合はシステムフォントへ切り替えます。

## Vercelへの公開・共有画像

[公開サイト](https://portfolio-amz-jpcslr.vercel.app/)へ変更を反映するには、接続したGitHubリポジトリへ変更を反映し、Vercelで再デプロイします。

| 設定 | 値 |
| --- | --- |
| Framework Preset | Other |
| Root Directory | リポジトリ直下 |
| Build Command | `npm run build` |
| Output Directory | `dist` |

`vercel.json` に公開設定を用意しています。通常はAPIキーや追加環境変数は不要です。

`dist/og-image.png`（1200 × 630 px）をOGP・X向けの画像に設定しています。メタ情報は初期HTMLに含まれます。公開URLの優先順位は `SITE_URL` → `VERCEL_PROJECT_PRODUCTION_URL` → `VERCEL_URL` → 現在の公開URLです。独自ドメインを使う場合は `SITE_URL` を設定してください。

PNGはリポジトリに含まれ、Vercelでの画像生成やPythonのインストールは不要です。共有画像を作り直す場合だけ、PillowとWindowsのArial / 游ゴシックがある環境で `python scripts/create-social-image.py` を実行します。

## ファイル構成

```text
dist/
  index.html          トップページ・ダイアログ・OGP
  projects.js         作品情報・ケーススタディの元データ
  case-study.js       検討プロセス・担当・AI分担の表示
  app.js              一覧・詳細・デモ制御
  styles.css          サイト全体とケーススタディのレイアウト
  demos.js / demos.css 機能再現デモとCSSアニメーション
  films.js / films.css 7作品の構成・字幕・カメラ・映像演出
  og-image.png        リンク共有用サムネイル
docs/images/          READMEに掲載するブラウザキャプチャ
scripts/
  serve.mjs           ローカルプレビュー
  build.mjs           OGP公開URLの反映と検証
  check.mjs           データ・構文・アセットのチェック
  create-social-image.py 共有画像の再生成（任意）
vercel.json           Vercel公開設定
```

## 情報の出典

公開リポジトリのREADME・仕様をもとに、Portfolio自身を除く7件を掲載しています。利用実績は本人の提供情報、担当範囲・AI利用は2026-09-24の本人申告を反映しています。リポジトリの自動同期は行いません。

- [Yomiage BotのREADME](https://github.com/AMZ-jpcslr/Yomiage_Discord_Bot/blob/master/README.md)
- [Shindo BotのREADME](https://github.com/AMZ-jpcslr/Shindo_Discord_Bot/blob/master/README.md)
- [Streaming ScreenのREADME](https://github.com/AMZ-jpcslr/Streaming-Screen/blob/master/README.md)
- [Artificial Moral ArchitectureのREADME](https://github.com/AMZ-jpcslr/Artificial-Moral-Architecture/blob/master/README.md)
- [Inspection ProxyのREADME](https://github.com/AMZ-jpcslr/ssl-inspection-prodxy/blob/main/README.md)
- [SSL Robot AIのREADME](https://github.com/AMZ-jpcslr/SSL-DEMO/blob/master/ssl-robot-ai/README.md)
- [しゅうかつ手帳のREADME](https://github.com/AMZ-jpcslr/Syukatu-Note/blob/master/README.md)（2026-09-27確認）
- [Vercelの公開設定](https://vercel.com/docs/project-configuration) / [公開URL環境変数](https://vercel.com/docs/environment-variables/system-environment-variables#vercel_project_production_url) / [Open Graph](https://ogp.me/)
