# 機能フローの再確認と映像の更新

確認日：2026-11-05。ポートフォリオの基準コミットは `7cc534311e0199ddf005c6a61bdc380e3d890bba`。
作品リポジトリは読み取り用に別フォルダへ取得し、本人の作業フォルダを変更していません。

概要と作成記録は約12秒・4段階のフロー、詳細は20秒・4段階の再現映像です。いずれも実アプリの録画ではありません。入力、条件の処理、判断、結果を同じ定義から生成し、架空のデータを使用します。

## 確認した実装と採用したフロー

| 作品 / 確認コミット | 主な根拠 | 映像にした一連の流れ |
| --- | --- | --- |
| [まにあう / 0c00d25](https://github.com/AMZ-jpcslr/train_time/tree/0c00d25beea0de6e4ca6f4cd333e3d2c8e6e66f0) | `src/domain/journey.ts` の `routeMinutes`・`judge`・`leavingWindow`、`src/useWalking.ts`、`src/useGeolocation.ts`、`src/railway/RailWalkingSetup.tsx`、公開トップ画面 | 人と現在時刻 → 位置情報の許可・駅入口の選択 → 徒歩経路 → 構内と余裕の時間を加算 → 時刻表との照合 → 次の電車と出る目安 |
| [しゅうかつ手帳 / 1b7edbe](https://github.com/AMZ-jpcslr/Syukatu-Note/tree/1b7edbe1e1c02be1c615ff2ce559fdcabf1d4ba1) | `src/components/import-inbox.tsx`、`src/lib/import/parser.ts`、`tests/e2e/import.spec.ts`、READMEのv2画面、公開サイトのシェル | MyPageの日程テキスト → 端末内解析 → 抽出候補をInboxへ保存 → 根拠・項目・反映先を確認 → 明示的に承認 → タスク・カレンダー |
| [Streaming Screen / f1cc00b](https://github.com/AMZ-jpcslr/Streaming-Screen/tree/f1cc00b3eb47243565c6fe9cef1336812fbc5bc8) | `studio/editor.html`・`editor.js`・`render.js`、READMEの実画面画像 | 表題を追加 → ドラッグで配置 → 保存 → `/overlay` のOBSブラウザソースへ反映 |
| [Yomiage Bot / 70128b0](https://github.com/AMZ-jpcslr/Yomiage_Discord_Bot/tree/70128b0f4141ef7713193356dea2740b1650d879) | `src/commands/voice_web.ts`、`src/voice_web_api.ts`、`src/translation.ts`、README | VCに入る → `/voice_web join` → 対象チャンネルへ投稿 → 順番に音声生成 → 同じVCで読み上げ |
| [Shindo Bot / 10451b9](https://github.com/AMZ-jpcslr/Shindo_Discord_Bot/tree/10451b90a1fba3b271ec2943e31230862973640b) | `src/eq_notify.ts`・`storage.ts`・`weather.ts`・`weather_notify.ts`、README | 管理者が通知先と最低震度を設定 → 新しい地震情報 → 条件と重複を確認 → 指定チャンネルへ通知 |
| [Artificial Moral Architecture / 634707e](https://github.com/AMZ-jpcslr/Artificial-Moral-Architecture/tree/634707e1c519e810a26d54350095b1966a99ecb9) | `examples/demo.py`、`docs/assets/cli-demo.txt`、READMEの制約優先・Dry Run・CLI中心の説明 | B_informationの状況 → 非公開情報と公開情報の候補 → 未来・当事者への影響 → 制約を先に適用 → 公開情報を使う代替案をMODIFYとして選択 → simulated |
| [Inspection Proxy / 218b625](https://github.com/AMZ-jpcslr/ssl-inspection-prodxy/tree/218b625673c169171c0422e7fae6f16b60ec5493) | `src/inspection.js`・`pii.js`・`privacy.js`・`securityEvents.js`・`dashboard/render.js`、README | サンプルHTTP通信 → 宛先を判定して転送 → 転送後に上限付きメモリでPII形式候補を検査 → 種類と件数をセキュリティイベントで確認 |
| [SSL Robot AI / 7359aeb](https://github.com/AMZ-jpcslr/SSL-DEMO/tree/7359aeb1f7b4851c834cdfd6ff37d45c27729e3d) | `ssl-robot-ai/src/main/java/tactics/ScoreGrid.java`・`PositionLearning.java`・`ai/ActionLearning.java` | 2Dの味方・相手・ボール位置 → グリッドを走査して候補評価 → パス・シュートを比較 → 結果に応じて重みを更新 |

## 重要な表現の修正

- まにあうは「徒歩時間を入力して電車が出る」だけの表現から変更しました。位置情報と入口の関係を描き、計算と時刻表の比較を分けています。GPSを取得できれば必ず計算できる、という表現にはしていません。
- 例の計算は、現在9:04・徒歩5分・構内と余裕3分です。必要時間8分なので9:10発は対象外、9:15発までの余裕は3分、出る目安は9:07です。これは保存ダイヤの引用ではありません。
- しゅうかつ手帳は最新版のv2取り込みInboxへ更新しました。抽出直後に勝手に予定が作られるようには見せず、保存・項目確認・承認を挟んでいます。任意のGmailやAI連携が常に接続済みとは表現していません。
- 読み上げと翻訳を一つの直列処理として描くのをやめました。翻訳は設定された相手へのメンション・返信が対象で、訳文は自動読み上げしません。
- 通信本文の検出を送信前のブロックやDLPに見せる表現を使いません。転送後のPII候補通知、原文を保存しない記録範囲を明示します。
- AMAはGUIではなくCLIの判断を模式化しています。公開情報の有用性0.75と非公開情報0.95、最終判断MODIFY、実行simulatedは保存済みデモの例です。研究全体の性能を表す数値ではありません。
- SSLの配置と評価値は説明用です。実機や試合結果・性能向上の証拠として扱いません。

## 画面の確認範囲

- 公開版のまにあうは、クリーム色とオリーブ色、縦の列車カード、現在時刻・方向・徒歩条件の画面をPC・スマホ幅で確認しました。公開画面と最新ソース内の別UI実装には差があるため、映像は公開画面の文言・配色を参考にした簡略図です。完全な画面再現とは表示しません。
- しゅうかつ手帳の公開版でv2シェルを確認しました。データ領域は確認時に読み込み中でした。取り込み画面の構成は最新版コンポーネント、テスト、READMEの実際のローカルデモ画面を根拠にしています。本番DBへの反映成功を確認したとは扱いません。
- Streaming Screenは最新版リポジトリ内の実画面画像とエディター実装を確認しました。
- その他は最新ソース・保存された実行例を照合した模式図です。架空のUIを既存製品画面として表示しません。
- 調査用の画面・ソース・ログはGit対象外の `.review/` に保存し、公開出力には同梱しません。

## 今回確認していないこと

実際のGPS精度と徒歩経路の現地検証、本番でのMyPage・Gmail取り込みとDB更新、Discordへの実送信と音声合成API、OBS・VTube Studioとの実接続、実通信のTLS検査・CA導入、ロボット実機の試合は行っていません。

## 再生成と検証

`site/music/feature-flows.js` が4段階の定義と図形の共通ソースです。概要・作成記録は `core-demo.js` と `core-demo.css`、詳細動画は `video/recreations/flow-films.tsx` が参照します。

```powershell
$env:REMOTION_BROWSER_EXECUTABLE='C:/path/to/installed/chromium.exe'
$env:STILL='1'  # 確認用の4時点だけ生成するとき
node video/recreations/render.mjs
Remove-Item Env:STILL
node video/recreations/render.mjs
npm run build
node scripts/review-core-demos.mjs
node scripts/review-book-overview.mjs
```

映像は1240×900・24fps・20秒・H.264/yuv420p・無音です。概要は12秒の軽いSVG/CSSで、動画の先読みを追加しません。停止・再生、画面外・バックグラウンド停止、動きを減らす設定、履歴とフォーカスを維持します。

公開前の検証はローカルで行い、確認用動画を本人が見た後、今回の8作品の変更について公開の承認を受けています。公開後も実サービスへの接続や現地実測を検証したという意味ではありません。

## 今回の検証結果

- `npm run build`：成功。現行8作品、出力一致、構文、メタデータ、既存資料のチェックを含みます。
- 概要・作成記録：8作品を1440・390・320・844px幅で確認。4段階の切り替え、停止・再開、画面外・バックグラウンド停止、動きを減らす設定と手動再生、履歴・フォーカスの確認が成功しました。動画の通信は0件です。共有フロー定義を含むコードは29,405 bytes、gzipで12,090 bytesです。
- 詳細：8作品×PC・スマホ幅で、4時点の映像と外側の説明を照合。説明は14px以上で再生位置に同期し、横はみ出しはありません。
- 全8動画：H.264・1240×900・24fps・20秒・音声なし。FFmpegで480フレームを全デコードし、4段階のフレームが異なることを確認。Edgeでも全体を最後まで再生し、メディアエラーは0件です。
- 本棚、詳細リンク、戻る・進む、キャンセル、検索履歴、繰り返し操作の既存回帰検証も成功しました。
- AMAの `examples/demo.py` を取得したソースで実行し、B_informationのBLOCK・MODIFY・公開情報の代替案・simulatedの出力を再確認しました。
- 生の結果は `.review/core-demos/results.json`、`.review/flow-playback/results.json`、`.review/flow-media/results.json`、`.review/book-overview/results.json` にあります。ブラウザーはheadless Edgeで、スマートフォンはエミュレーションです。実機スマホの操作検証ではありません。
