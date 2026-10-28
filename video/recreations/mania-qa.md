# まにあう：再現映像の仕様と再生成

実アプリの録画ではなく、機能を説明するためにローカルで制作したRemotion再現映像です。駅・時刻・ダイヤは説明用の模擬例で、現在の運行情報ではありません。映像内にも固定時計14:00と再現映像の表示があります。

## 表示する操作

- 駅名を入力し、検索結果から駅を選ぶ。
- 徒歩時間を1分から6分へ変更し、今出る目安の便が変わる。
- 条件に合う一本後を選び、推薦された便と手動で選択した便を見比べる。
- 自動選択へ戻す。

時計14:00、徒歩1分＋駅構内・余裕3分では、14:08発の出発目安は14:04、残り4分です。徒歩6分＋余裕3分では14:08に間に合う出発目安は過ぎているため、14:15が推薦され、出発目安14:06・残り6分になります。14:22を手動選択すると14:13・残り13分になり、自動推薦とは区別して表示します。これは比較例で、予約・決済・実際の列車運行を表しません。

## 出力

- `site/recreation/media/mania.mp4` と `mania.jpg`。
- H.264 / yuv420p、1240×900、24fps、20秒・480フレーム、音声トラックなし。
- MP4：1,187,252 bytes、SHA256 `2bb30949ed05862130fea6f56a684517fd6f436d9f3838ed777470125bd39ea7`。
- ポスター：186,995 bytes、SHA256 `fc69b26ec79063f5a801762d492a1ed071e8ede6c0ad56728f56f39885a12175`。

## 再生成

リポジトリのルートで実行します。`video/` の既存依存パッケージと、インストール済みのChromiumを使います。ブラウザーや認証情報を自動で追加しません。

```powershell
$env:REMOTION_BROWSER_EXECUTABLE='C:/path/to/installed/chrome-headless-shell.exe'
node video/recreations/render-mania.mjs
node video/recreations/verify-mania.mjs
node video/recreations/playback-mania.mjs
npm run build
```

`STILL=1` は確認用のPNGだけを `.review/mania-local/` に生成します。FFmpegはWindowsでは既存のRemotion同梱版、他の環境ではPATH上の `ffmpeg` を使います。`FFMPEG_EXECUTABLE` で既存の実行ファイルを指定することもできます。

全フレームのデコード、7時点の符号化済みフレーム、Chromiumでの20秒全体の再生を確認しました。再生は480フレームで終了し、メディアエラーはありませんでした。生の検証画像・ログ・ビルドキャッシュは公開出力へ含めません。
