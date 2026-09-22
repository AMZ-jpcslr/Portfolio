// audience に実際の利用者・利用場面を記入すると、一覧と詳細の両方へ反映されます。
// 未確認の利用人数・導入実績は掲載しません。
export const projects = [
  {
    "id": "Yomiage_Discord_Bot",
    "title": "Yomiage Bot",
    "category": "COMMUNICATION",
    "kind": "voice",
    "color": "violet",
    "number": "01",
    "label": "Discord Bot",
    "tagline": "声と言葉の壁を、もっと低く。",
    "summary": "チャットを音声に、メンションを相手の言語に。会話への参加を支える読み上げ・翻訳Bot。",
    "tags": [
      "TypeScript",
      "VOICEVOX",
      "DeepL"
    ],
    "audience": "",
    "features": [
      "投稿を順番に読み上げる音声キュー",
      "メンション・返信先に合わせた自動翻訳",
      "サーバーごとの音声設定と設定ファイルの永続化"
    ],
    "challenge": "声を出せない場面でも、テキストでボイスチャットに参加できるように。異なる言語を使うメンバーとの会話も支えます。",
    "engineering": "音声合成と翻訳を分離し、APIのタイムアウトやキュー上限を設計。翻訳に失敗しても、読み上げと後続の処理を継続します。",
    "demoNote": "実際のコマンドと機能をもとに再構成したUIです。音声再生や外部APIへの接続は行いません。",
    "steps": [
      "ボイスチャンネルへ接続",
      "テキストを読み上げ",
      "相手の言語へ翻訳"
    ]
  },
  {
    "id": "Shindo_Discord_Bot",
    "title": "Shindo Bot",
    "category": "DISASTER INFORMATION",
    "kind": "weather",
    "color": "blue",
    "number": "02",
    "label": "Discord Bot",
    "tagline": "必要な地域の情報を、いつもの場所に。",
    "summary": "地震・津波から地域別の気象警報、降水予報まで。必要な防災情報をDiscordに届けるBot。",
    "tags": [
      "TypeScript / JavaScript",
      "WebSocket",
      "気象API"
    ],
    "audience": "",
    "features": [
      "地震・津波の通知と震度による絞り込み",
      "市区町村ごとの気象・降水情報",
      "雨雲レーダーの画像合成と状態確認"
    ],
    "challenge": "防災情報を確認する場所を、日常使っているDiscordへ。地域と通知条件を設定し、必要な情報を受け取れる構成です。",
    "engineering": "重複通知を抑止する状態を保存し、取得・送信失敗時は次回に再試行。データ取得失敗を「警報なし」と誤って扱わない設計にしています。",
    "demoNote": "架空の地域・数値による説明用デモです。実際の災害情報ではありません。",
    "steps": [
      "地域と通知先を設定",
      "気象情報を取得",
      "条件に合う情報を通知"
    ]
  },
  {
    "id": "Streaming-Screen",
    "title": "Streaming Screen",
    "category": "CREATOR TOOLS",
    "kind": "stream",
    "color": "pink",
    "number": "03",
    "label": "Web Application",
    "tagline": "配信画面を、思いのままに組み立てる。",
    "summary": "テキスト・画像・時計を自由に配置。OBSの配信画面をつくるモジュール式レイアウトエディター。",
    "tags": [
      "JavaScript",
      "Node.js",
      "OBS"
    ],
    "audience": "",
    "features": [
      "ドラッグ操作と数値指定による配置",
      "レイヤー操作・80操作までのUndo / Redo",
      "保存したレイアウトをOBS出力へ反映"
    ],
    "challenge": "配信画面の配置や調整を、コードを書かずに行えるように。編集用の画面と、OBSに表示する透明な出力を分けています。",
    "engineering": "保存するまで配信へ反映しない編集フローを実装。共通の描画ロジックとスキーマを使い、編集と出力の整合性を保ちます。",
    "demoNote": "モジュールの追加・配置・保存の流れを再現しています。実際のOBSには接続しません。",
    "steps": [
      "テキストを追加",
      "レイアウトを調整",
      "OBS出力へ反映"
    ]
  },
  {
    "id": "Artificial-Moral-Architecture",
    "title": "Artificial Moral Architecture",
    "category": "AI / RESEARCH",
    "kind": "moral",
    "color": "green",
    "number": "04",
    "label": "Personal Research",
    "tagline": "AIが行動する、その前を考える。",
    "summary": "行動の未来を予測し、当事者への影響を評価。道徳判断を行動選択につなげる個人研究基盤。",
    "tags": [
      "Python",
      "Decision Pipeline",
      "Offline"
    ],
    "audience": "",
    "features": [
      "候補行動と代替案の未来予測",
      "当事者別の影響を6つの軸で評価",
      "許可された候補から行動を選びDry Run"
    ],
    "challenge": "目標の達成だけを評価するのではなく、その行動が誰にどのような影響を与えるかを判断に組み込めるか、という問いを実装で検証します。",
    "engineering": "予測・評価・判断・実行を独立したパイプラインに分離。重大な侵害を便益で相殺せず、許可済み行動のみを実行器へ渡します。",
    "demoNote": "公開デモの「試験」シナリオを説明用に再構成しています。研究用の固定ルールであり、現実の道徳的妥当性や汎化性能を実証したものではありません。",
    "steps": [
      "候補行動を生成",
      "当事者への影響を評価",
      "許可された代替案を選択"
    ]
  },
  {
    "id": "ssl-inspection-prodxy",
    "title": "Inspection Proxy",
    "category": "NETWORK / SECURITY",
    "kind": "proxy",
    "color": "sand",
    "number": "05",
    "label": "Learning Project",
    "tagline": "見えない通信を、見える仕組みに。",
    "summary": "HTTP / HTTPSの通信ログ、個人情報の検出、ドメイン制御を可視化する学習・検証用プロキシ。",
    "tags": [
      "JavaScript",
      "Node.js",
      "Docker"
    ],
    "audience": "",
    "features": [
      "HTTP / HTTPSの中継とログ可視化",
      "PIIの検出とドメインブロック",
      "管理操作の監査ログと認証"
    ],
    "challenge": "ブラウザとWebサイトの間で何がやり取りされるのか。通信を観察し、検出結果をダッシュボードで確認できる学習環境をつくっています。",
    "engineering": "プロキシ・検出・ログ保存・ダッシュボードを分離。検査対象や本文サイズを設定できるようにし、管理操作も監査ログに残します。",
    "demoNote": "架空の通信ログです。通信の傍受・証明書の変更は行いません。実プロジェクトは同意を得た検証環境向けです。",
    "steps": [
      "サンプル通信を受信",
      "通信内容を検査",
      "検出結果を可視化"
    ]
  },
  {
    "id": "SSL-DEMO",
    "title": "SSL Robot AI",
    "category": "SIMULATION / AI",
    "kind": "soccer",
    "color": "mint",
    "number": "06",
    "label": "Simulation",
    "tagline": "チームの判断を、コードにする。",
    "summary": "パス・シュート・位置取りを自律的に選択。ロボットサッカーの戦術を試すJava製2Dシミュレーター。",
    "tags": [
      "Java",
      "Online Learning",
      "2D Simulation"
    ],
    "audience": "",
    "features": [
      "攻撃・守備・サポートの役割別行動",
      "格子状の候補地点を評価する位置選択",
      "成功・失敗に応じた重みの逐次更新"
    ],
    "challenge": "複数のロボットが、それぞれどこへ動き、誰にパスするか。戦術の評価とチーム全体の振る舞いを2D環境で確認します。",
    "engineering": "ヒューリスティックな位置評価と軽量なオンライン学習を組み合わせ、パス・シュート・位置取りの重みを成功と失敗から更新します。",
    "demoNote": "戦術の流れを示す模式アニメーションです。Javaのシミュレーターや学習処理はこのページでは実行していません。",
    "steps": [
      "候補位置を評価",
      "味方へパス",
      "シュートを選択"
    ]
  },
  {
    "id": "Portfolio",
    "title": "This Portfolio",
    "category": "DESIGN / DEVELOPMENT",
    "kind": "portfolio",
    "color": "neutral",
    "number": "07",
    "label": "Web Portfolio",
    "tagline": "つくったものを、伝わる体験に。",
    "summary": "開発の背景と設計の工夫を、動くデモで伝えるポートフォリオ。このWebサイトも、ひとつの制作物です。",
    "tags": [
      "HTML / CSS",
      "JavaScript",
      "Vercel"
    ],
    "audience": "",
    "features": [
      "公開プロジェクト全7件の一覧と詳細",
      "プロジェクトに合わせたアニメーションデモ",
      "レスポンシブ対応と動きを抑える設定"
    ],
    "challenge": "リポジトリのコードだけでは伝わりにくい利用場面や設計意図を、採用担当の方にも短時間で理解してもらえる形にまとめます。",
    "engineering": "コンテンツと表示処理を分離し、利用者情報を一箇所から追記できる構成に。外部APIなしで表示でき、静的サイトとして公開できます。",
    "demoNote": "このサイトの「一覧 → 詳細 → デモ」という閲覧の流れを再現しています。",
    "steps": [
      "プロジェクトを一覧",
      "詳細で背景を知る",
      "デモで動きを理解"
    ]
  }
];
