# 7作品のRemotion PV更新

2026年10月15日。ローカルUser Skill「remotion」に沿って、7作品の機能再現PVを更新しました。ローカルのプレビュー確認後に承認を受け、同日GitHubの `master` ブランチを通じてVercelの本番サイトへ公開しました。

## 見せ方

紙の色 `#f3f2ee`、インク色 `#1d2b32`、朱色 `#bb3c20` を使い、サイトと映像の印象を揃えました。明朝体の導入、細い罫線、操作を説明する3章の字幕、利用状況を示す結びを共通化しています。実際の利用状況・研究段階の区別は既存の事実に沿っています。

映像はすべて**UIの再現であり、実アプリを録画したものではありません**。個人情報や非公開データは使わず、地震情報・通信ログ・就活予定は説明用サンプルです。代表作の実画面・情報構造の資料は、引き続き別の項目で掲載しています。

| 種類 | 動作の流れ |
| --- | --- |
| しゅうかつ手帳 | 公開募集を探す → 自分の予定に引用 → カレンダー |
| Streaming Screen | モジュール追加 → ドラッグ配置 → 保存して出力 |
| Yomiage Bot | ボイスチャンネル参加 → 緑の発話表示で読み上げ → 翻訳 |
| Shindo Bot | 通知先設定 → 震度・重複の条件確認 → 地震情報を通知 |
| Artificial Moral Architecture | 行動候補 → 影響評価 → 代替案とDry Run（個人研究の模式表現） |
| Inspection Proxy | 通信ログ → 形式検出 → ブロックと記録 |
| SSL Robot AI | 位置評価 → パス → シュート（6対6の模式表現） |

## 実装と編集

スキルが想定するStitchの画面取得ツールはこの環境では利用できないため、既存のローカル再現UIを素材にしました。Remotion CLIとrendererを実際に導入し、Studioで構成を表示、全7本をMP4へ書き出しています。

- `video/src/index.tsx`：7つのComposition。各1240 × 900px、30fps、720フレーム＝24秒。
- `video/src/ProductFilm.tsx`：導入・章の字幕・結び、フォントの読み込み、操作のフレーム同期。
- `video/src/film.css`：既存の操作UIを映像内へ配置。
- `video/render.mjs`：H.264・yuv420p・CRF18での一括書き出し。12秒時点のJPEGポスターも生成。
- `dist/assets/films/`：7本のMP4とポスター、共通の書き出し設定。
- `dist/editorial-films.css`：動画と、動画を読み込めない場合のHTML / CSS再現UIの表示。

既存UIのCSSキーフレームをWeb Animationsのトラックとして取り出し、Remotionのフレーム番号に合わせて位置・表示状態を設定しています。ページを開いてからの経過時間に依存せず、シークや並列書き出しでも同じフレームを描きます。フォントはローカルのNoto Sans JPとShippori Minchoを読み込み、準備ができてから描画します。

```sh
npm --prefix video ci
npm run video:studio
npm run video:render
```

単体で書き出す場合（PowerShell）：

```powershell
$env:FILM='career' # career / stream / voice / weather / moral / proxy / soccer
npm run video:render
Remove-Item Env:FILM
```

Remotionと関連パッケージは4.0.535に固定し、`video/package-lock.json` を含めています。初回はChrome Headless Shellのダウンロードが発生します。サイト閲覧・通常のビルド時にはRemotionのインストールは不要です。

## 再生と負荷

動画は表示領域に入ったときにソースを設定し、自動再生します。画面外・詳細表示中の背景・非表示タブ・個別停止・全体停止では再生を止めます。動画の背面にあるCSSアニメーションも停止し、二重に動かしません。OSの「動きを減らす」設定では、MP4を取得せずJPEGを表示します。映像を読み込めない場合にはHTML / CSSの再現UIへ戻ります。

ローカルサーバーもMP4のMIMEとHTTP Rangeに対応し、再生位置の移動に必要な範囲を取得できます。合計のMP4容量は約22.2MBで、7本を初期表示で一括読み込みする構成にはしていません。

## 確認した内容

Microsoft Edgeの自動ブラウザで次を確認しました。

- Remotion Studioに全7作品が表示されること。
- 全7本で動画の寸法・24秒の長さ・自動再生・停止・再開・シーク・詳細の終了が動くこと。
- 各動画の1秒・12秒・22.5秒の描画。読み上げBotの緑の発話リング、地震速報の処理画面、6対6の配置も確認。
- 全体停止で動画と操作部品が停止し、再開できること。
- 動きを減らす設定で、MP4リクエストが発生せず静止画になること。
- 動画取得の失敗を再現し、再現UIへ切り替わること。
- Rangeの通常範囲・末尾範囲・無効範囲、HEAD応答。
- 1440・1024・768・760・390・320pxで横にはみ出さず、2列の一覧で行の上端と高さが揃うこと。
- 3Dの全7パネルから正しい作品へ直接移動すること。ドラッグでは詳細を開かないこと。EnterとEscapeでも操作できること。
- 通常確認でJavaScript実行エラーがないことと、`npm run build` の通過。

これらはブラウザでの確認です。実機のスマートフォンによる性能・通信量・電池消費の測定は行っていません。

## プレビュー

[本番サイト](https://portfolio-amz-jpcslr.vercel.app/#spatial)にも反映済みです。コミット `375991e` のProductionデプロイ成功と、公開URLでの全7動画の読み込み・停止・シークをブラウザで確認しています。以下のローカルURLはサーバー起動中に利用できます。

- [作品一覧・3D](http://127.0.0.1:4180/#spatial)
- [Streaming Screen](http://127.0.0.1:4180/#project=Streaming-Screen)（詳細内「再現デモ」）
- [Remotion Studio](http://localhost:3001/Film-career)

参考：[Remotion useCurrentFrame](https://www.remotion.dev/docs/use-current-frame)、[renderMedia](https://www.remotion.dev/docs/renderer/render-media)、[ensureBrowser](https://www.remotion.dev/docs/renderer/ensure-browser)。
