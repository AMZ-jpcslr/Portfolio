# 外部公開素材・データの確認記録

確認日：2026-10-28。外部サイトへの更新・投稿や認証は行っていません。

## Ri-one

- 公式サイト：https://rione.org/
- 公式サイトは、立命館大学情報理工学部の公認プロジェクト団体であり、サッカー小型リーグ（SSL）へ参加していることを説明しています。既存ポートフォリオの団体名・大学名・競技と一致します。
- 大学側の確認資料：https://www.ritsumei.ac.jp/sports-culture/culture/topics/detail/?id=990
- ロゴは公式サイトのヘッダー／フッターで使用されているPNGです：https://rione.org/wp-content/uploads/2025/06/logo_En_1-scaled.png
- 保存先：`rione-logo.png`。2560×578px、16,913 bytes。SHA256：`5088bb7020ce3907b5f57f6da31affe8809efa6e22ed478f5281f63b5ef3a571`。
- 画像は変更せず、CSSで縦横比を保って表示しています。団体の識別用に公式サイトへのリンクを併記しました。確認した公式ページに一般向けのロゴ再利用ガイドやオープンライセンスは見つかっていません。公式サイトの権利表示はAll Rights Reservedです。このローカル案での掲載を、自由な再配布や公式の推薦を受けた証拠として扱わないでください。
- 団体の受賞・人数などを本人の実績として追加していません。既存の本人の活動説明は保持しています。

## GitHub日記

- 本人の確認済みプロフィール：https://github.com/AMZ-jpcslr （表示名Kitaoka Yoma）。公開ユーザーAPIでもloginとID `149338110` を照合しました。
- データ源：https://api.github.com/users/AMZ-jpcslr/events/public?per_page=30
- 既存7作品の正しいリポジトリ名は `dist/projects.js` と現行contentから取得。まにあうは既に確認済みの `train_time` を対象としています。
- まにあうの年表追加に際し、https://api.github.com/repos/AMZ-jpcslr/train_time で `private=false`、`full_name=AMZ-jpcslr/train_time`、`created_at=2026-10-22T05:16:27Z` を確認しました。表示は2026.10で、公開版のリリース日や開発開始日には置き換えていません。
- 表示はその本人・対象8作品・public=trueに限定。最大8件を時刻降順で表示し、イベント日時（日本時間／JST）と実際の記録リンクを付けています。外部人物の投稿本文・メールアドレスや非公開活動は保存していません。
- `github-snapshot.json` は上記公開APIから取得した実データの必要項目だけを保存したものです。取得日時はJSON内にあります。現在の最新項目は2026-10-26 15:40:15 JSTのtrain_timeへのpushで、リリースとは表示していません。
- ページ表示後、日記が画面近くに来ると必要時だけ取得します。15分のクールダウン、8秒のタイムアウト、上限エラー時のresetヘッダー考慮、保存データの代替表示があります。繰り返しの自動ポーリングはしません。認証ヘッダー・Cookie・トークンは使いません。
- API仕様：https://docs.github.com/en/rest/activity/events#list-public-events-for-a-user 。公開イベントAPIには反映の遅延と取得範囲の上限があり、完全な作業履歴ではありません。
- 利用上限：https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api 。未認証の基本上限はIP単位で60回／時。アプリ側のクールダウンがあっても、同じIPの別利用によって上限に達する場合があります。

## GitHubマーク

公式Primer Octiconsの mark-github-16.svg を使用しています。出典：https://github.com/primer/octicons/blob/main/icons/mark-github-16.svg 。元のSVGとMITライセンスを site/assets/ に保持し、GitHubへのリンクに文字と併記しています。推薦や提携を示すものではありません。
