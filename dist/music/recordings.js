// Actual recordings and source-specific limits. See scripts/prepare-recordings.mjs.
export const recordings={
  "mania": {
    "type": "recording",
    "title": "まにあう",
    "src": "/recordings/media/mania.mp4",
    "shortSrc": "/recordings/media/mania-short.mp4",
    "poster": "/recordings/media/mania.jpg",
    "size": "430 × 932",
    "orientation": "portrait",
    "duration": 18.28,
    "shortDuration": 8.08,
    "summary": "現在地の再取得、今出川駅の検索・選択、徒歩時間と電車の判定・詳細。",
    "note": "実アプリのローカル版を録画。位置情報には今出川駅付近のテスト座標をブラウザーで指定しています。このPCのGPS測定ではありません。徒歩API・駅検索・収録時の時刻表による計算は実際に実行しています。遅延・運休や実際の乗車を保証するものではありません。"
  },
  "career": {
    "type": "recording",
    "title": "しゅうかつ手帳",
    "src": "/recordings/media/career.mp4",
    "shortSrc": "/recordings/media/career-short.mp4",
    "poster": "/recordings/media/career.jpg",
    "size": "390 × 844",
    "orientation": "portrait",
    "duration": 8.56,
    "shortDuration": 4.8,
    "summary": "カレンダーのリストと予定詳細。架空の日程を使う旧版デモモードの録画です。",
    "note": "実アプリの隔離コピーをNEXT_PUBLIC_DEMO_MODE=trueで起動。架空の応募日程。リスト表示と予定の詳細。 2026年10月27日の保存済み実録画で、現在の最新版と異なる場合があります。"
  },
  "stream": {
    "type": "recording",
    "title": "Streaming Screen",
    "src": "/recordings/media/stream.mp4",
    "shortSrc": "/recordings/media/stream-short.mp4",
    "poster": "/recordings/media/stream.jpg",
    "size": "1440 × 1000",
    "orientation": "landscape",
    "duration": 13.56,
    "shortDuration": 7.52,
    "summary": "表題の編集、座標の変更、Undo / Redo、保存。2026年10月収録のエディターです。",
    "note": "実エディタとroutesを一時DATA_DIRで起動。架空の配信タイトルと座標、Undo/Redo、ローカル保存。外部連携なし。 2026年10月27日の保存済み実録画で、現在の最新版と異なる場合があります。"
  },
  "moral": {
    "type": "recording",
    "title": "Artificial Moral Architecture",
    "src": "/recordings/media/moral.mp4",
    "shortSrc": "/recordings/media/moral-short.mp4",
    "poster": "/recordings/media/moral.jpg",
    "size": "1440 × 720",
    "orientation": "landscape",
    "duration": 14.2,
    "shortDuration": 7.84,
    "summary": "合成シナリオをCLIで実行し、判断とJSON出力を確認します。",
    "note": "実際のPython CLIをWindows端末で実行。既存合成シナリオB/D/Eの要約とJSON。DryRunExecutor。 2026年10月27日の保存済み実録画で、現在の最新版と異なる場合があります。"
  },
  "proxy": {
    "type": "recording",
    "title": "Inspection Proxy",
    "src": "/recordings/media/proxy.mp4",
    "shortSrc": "/recordings/media/proxy-short.mp4",
    "poster": "/recordings/media/proxy.jpg",
    "size": "1440 × 1000",
    "orientation": "landscape",
    "duration": 14.2,
    "shortDuration": 7.88,
    "summary": "ローカルの合成HTTP通信によるログと検査結果を管理画面で確認します。",
    "note": "実際のプロキシと管理画面。合成loopback HTTP通信2件と遮断1件を処理し、フィルタ・PII件数詳細・イベントを閲覧。外部傍受やCA導入なし。 2026年10月27日の保存済み実録画で、現在の最新版と異なる場合があります。"
  },
  "soccer": {
    "type": "recording",
    "title": "SSL Robot AI",
    "src": "/recordings/media/soccer.mp4",
    "shortSrc": "/recordings/media/soccer-short.mp4",
    "poster": "/recordings/media/soccer.jpg",
    "size": "1778 × 1144",
    "orientation": "landscape",
    "duration": 18,
    "shortDuration": 8.04,
    "summary": "実際のJava 2Dシミュレーターの自律動作。実ロボットの映像ではありません。",
    "note": "本人の取得ソースをJDK21でビルド。自律動作する実際のJava 2Dシミュレーターをネイティブウィンドウ録画。実ロボット映像ではない。 2026年10月27日の保存済み実録画で、現在の最新版と異なる場合があります。"
  },
  "voice": {
    "type": "unavailable",
    "title": "Yomiage Bot",
    "note": "Discordの実動作動画は未収録です。録画にはテスト用サーバー・チャンネルへの接続と、コマンドやメッセージを送信する対象の指定が必要です。"
  },
  "weather": {
    "type": "unavailable",
    "title": "Shindo Bot",
    "note": "Discordの実動作動画は未収録です。録画にはテスト用サーバー・チャンネルへの接続と、コマンドやメッセージを送信する対象の指定が必要です。"
  }
};
