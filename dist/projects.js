// 利用実績は本人から提供された情報です。audience / impact / outlook を編集できます。
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
    "audience": "友人約10人が利用",
    "features": [
      "投稿を順番に読み上げる音声キュー",
      "メンション・返信先に合わせた自動翻訳",
      "サーバーごとの音声設定と設定ファイルの永続化"
    ],
    "challenge": "声を出せない場面でも、テキストでボイスチャットに参加できるように。異なる言語を使うメンバーとの会話も支えます。",
    "engineering": "音声合成と翻訳を分離し、APIのタイムアウトやキュー上限を設計。翻訳に失敗しても、読み上げと後続の処理を継続します。",
    "demoNote": "実際のコマンドと機能をもとに再構成したUIです。音声再生や外部APIへの接続は行いません。",
    "steps": [
      "コマンドでボイス接続",
      "入力した文章を発話",
      "メンションに翻訳返信"
    ],
    "impact": "家庭の事情などで声を出せない人も、テキストチャンネルに入力するだけでボイスチャットの会話に参加できる点が好評です。"
  },
  {
    "id": "Shindo_Discord_Bot",
    "title": "Shindo Bot",
    "category": "DISASTER INFORMATION",
    "kind": "weather",
    "color": "blue",
    "number": "02",
    "label": "Discord Bot",
    "tagline": "地震の知らせを、いつものDiscordに。",
    "summary": "PC作業中も地震速報を受け取れるDiscord Bot。震源・規模・震度を届け、津波や気象情報にも対応。",
    "tags": [
      "TypeScript / JavaScript",
      "WebSocket",
      "地震情報API"
    ],
    "audience": "友人約10人が利用",
    "features": [
      "緊急地震速報・地震情報の通知と震度による絞り込み",
      "市区町村ごとの気象・降水情報",
      "雨雲レーダーの画像合成と状態確認"
    ],
    "challenge": "PC作業に集中しているときも、地震の知らせに気づけるように。普段開いているDiscordへ震源・規模・震度を届け、通知先や震度の条件を設定できます。",
    "engineering": "重複通知を抑止する状態を保存し、取得・送信失敗時は次回に再試行。データ取得失敗を「警報なし」と誤って扱わない設計にしています。",
    "demoNote": "架空の地域・数値による説明用デモです。実際の災害情報ではありません。",
    "steps": [
      "地震情報の通知先を設定",
      "地震情報と通知条件を照合",
      "震源・規模・震度を通知"
    ],
    "impact": "PC作業中にほぼ必ず開いているDiscordで災害通知を受け取れるため、PCでも速報に気づける点が好評です。"
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
    "audience": "小規模YouTuberからの依頼で制作",
    "features": [
      "ドラッグ操作と数値指定による配置",
      "レイヤー操作・80操作までのUndo / Redo",
      "保存したレイアウトをOBS出力へ反映"
    ],
    "challenge": "小規模YouTuberからの依頼を受け、配信画面の知識がなくても直感的に操作できるエディターを制作。編集画面と、OBSに表示する透明な出力を分けています。",
    "engineering": "保存するまで配信へ反映しない編集フローを実装。共通の描画ロジックとスキーマを使い、編集と出力の整合性を保ちます。",
    "demoNote": "モジュールの追加・配置・保存の流れを再現しています。実際のOBSには接続しません。",
    "steps": [
      "テキストを追加",
      "レイアウトを調整",
      "OBS出力へ反映"
    ],
    "impact": "配信画面の専門知識がなくても、直感的な操作でレイアウトをつくれる点が好評です。"
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
    "audience": "個人研究として開発中",
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
    ],
    "impact": "現在は研究段階です。行動前の予測・影響評価・判断をつなぐ仕組みを検証しています。",
    "outlook": "今後は、この判断の仕組みを既存のAIモデルに活用できないかを探究します。モデルが提案した行動の評価や代替案の選択に接続し、実際の問題解決に役立つかを検証していく構想です。"
  },
  {
    "id": "ssl-inspection-prodxy",
    "title": "Inspection Proxy",
    "category": "NETWORK / SECURITY",
    "kind": "proxy",
    "color": "sand",
    "number": "05",
    "label": "In-house Tool",
    "tagline": "見えない通信を、見える仕組みに。",
    "summary": "HTTP / HTTPSの通信を可視化し、個人情報の検出やドメイン制御を行うプロキシ。自社での通信理解にも活用。",
    "tags": [
      "JavaScript",
      "Node.js",
      "Docker"
    ],
    "audience": "母と営む小規模な会社で利用",
    "features": [
      "HTTP / HTTPSの中継とログ可視化",
      "PIIの検出とドメインブロック",
      "管理操作の監査ログと認証"
    ],
    "challenge": "普段は見えない通信を可視化し、監視だけでなく通信の仕組みへの理解につなげる。母と営む小規模な会社で活用し、ネットリテラシーの向上を支えています。",
    "engineering": "プロキシ・検出・ログ保存・ダッシュボードを分離。検査対象や本文サイズを設定できるようにし、管理操作も監査ログに残します。",
    "demoNote": "架空の通信ログで、ログ取得・検出・ブロックの流れを再現しています。このページから実際の通信検査や証明書の変更は行いません。",
    "steps": [
      "サンプル通信を受信",
      "通信内容を検査",
      "検出結果を可視化"
    ],
    "impact": "普段は見ることのできない通信を可視化。監視に加え、どのような情報がやり取りされているかを理解することで、ネットリテラシーの向上にも貢献しています。"
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
    "audience": "立命館大学 Ri-oneのSSLチームで活用",
    "features": [
      "攻撃・守備・サポートの役割別行動",
      "格子状の候補地点を評価する位置選択",
      "成功・失敗に応じた重みの逐次更新"
    ],
    "challenge": "複数のロボットが、それぞれどこへ動き、誰にパスするか。戦術の評価とチーム全体の振る舞いを2D環境で確認します。",
    "engineering": "ヒューリスティックな位置評価と軽量なオンライン学習を組み合わせ、パス・シュート・位置取りの重みを成功と失敗から更新します。",
    "demoNote": "戦術の流れを示す模式アニメーションです。Javaのシミュレーターや学習処理はこのページでは実行していません。",
    "steps": [
      "候補位置をスコアリング",
      "空いた味方へパス",
      "コースを評価しシュート"
    ],
    "impact": "自身が参加するRi-oneのSSLチームで、マップ上の候補位置をスコアリングする技術が、導入するシステムのプロトタイプとして活用されました。"
  }
];
