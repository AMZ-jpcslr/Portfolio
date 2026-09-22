const wave = '<div class="wave" aria-hidden="true">' + '<i></i>'.repeat(20) + '</div>';
const message = (avatar, name, content, bot = true) => `<div class="mini-message stage-message"><i class="avatar ${bot ? 'bot' : 'human'}">${avatar}</i><div><b>${name}${bot ? ' <em>APP</em>' : ''}</b>${content}</div></div>`;
const discord = (channel, messages, input, weather = false) => `<div class="mini-discord demo-frame"><aside class="mini-sidebar"><b>amz community⌄</b><span>TEXT CHANNELS</span><p># general</p><p class="active"># ${channel}</p><span>${weather ? 'INFORMATION' : 'VOICE CHANNELS'}</span><p>${weather ? '☂ 地域の気象情報' : '◖ General'}</p><p class="connected">● ${weather ? 'Demo mode' : 'Voice connected'}</p></aside><div class="mini-chat"><div class="mini-chat-header"># ${channel} <small>DEMO</small></div>${messages}<div class="mini-compose">＋ ${input}</div></div></div>`;

export const captions = {
  voice: ['メンバーが /voice_web join を実行し、Botをボイスチャンネルへ接続します。', '投稿されたテキストをキューに入れ、VOICEVOXで順番に読み上げます。', '登録済みの相手へのメンションをDeepLで翻訳し、返信します。'],
  weather: ['市区町村と通知先を指定し、降水通知の条件を登録します。', '地域の予報を取得し、指定した降水量の基準と比較します。', '条件に合った降水予報を通知します。同じ時間枠の重複通知は抑止します。'],
  stream: ['空のキャンバスに、配信タイトルのテキストを追加します。', 'タイトルの配置を調整し、時計と背景パネルを組み合わせます。', '保存すると、編集枠のないOBS用の画面へレイアウトが反映されます。'],
  moral: ['「試験で最高点を取る」という目標に対し、候補行動と代替案を用意します。', '将来の出来事と、ユーザー・第三者などへの影響を6つの軸で評価します。', '不正アクセスをBLOCKし、自力で解答する代替案を選択。最終判断はMODIFYです。'],
  proxy: ['検証用の架空のHTTP / HTTPSリクエストを受け取ります。', 'サンプルの送信内容からメールアドレス形式を検出します。', '検出結果とブロックしたドメインを、通信ログに表示します。'],
  soccer: ['ロボットの位置関係とパスレーンを評価し、次の行動を選びます。', '受け手が空いた位置に移動し、味方からのパスを受けます。', 'ゴールへのコースを評価してシュート。実プロジェクトでは結果を学習に利用します。'],
  portfolio: ['色分けされたプロジェクトカードから、気になる開発を見つけます。', '詳細画面で、解決したい課題と実装の工夫を読みます。', '動くデモで利用場面を理解し、GitHubでソースコードへ進めます。']
};

export function renderDemoFrame(project, step) {
  if (!Number.isInteger(step) || step < 0 || step > 2) throw new RangeError('Demo step must be 0, 1 or 2');
  const kind = project.kind;
  if (kind === 'voice') {
    const frames = [
      message('A', 'Member', '<p><code>/voice_web join</code></p>', false) + message('y.', 'Yomiage', '<p>ボイスチャンネルに接続しました。</p><div class="demo-success">✓ General に接続</div>'),
      message('A', 'Member', '<p>こんばんは！今から参加します。</p>', false) + message('y.', 'Yomiage', '<p>読み上げイメージ</p>' + wave + '<span class="demo-small">テキスト → 音声合成 → 順番に再生</span>'),
      message('A', 'Member', '<p><span class="mention">@Alice</span> 明日は何時に集まりますか？</p>', false) + message('y.', 'Yomiage', '<div class="translation"><span>日本語 → English (US)</span><p>What time shall we meet tomorrow?</p></div>')
    ];
    return discord('voice-chat', frames[step], 'Message #voice-chat');
  }
  if (kind === 'weather') {
    const frames = [
      message('A', 'Member', '<p><code>/weather set</code></p><p>area: デモ市　channel: #weather</p>', false) + message('s.', 'Shindo', '<div class="demo-success">✓ デモ市の通知を登録</div><p>降水基準：1 mm / h</p>'),
      message('s.', 'Shindo', '<p>デモ市の予報を確認しています…</p><div class="scan-track"><span></span></div><div class="forecast-values"><span>18:00<b>0.2 mm</b></span><span class="forecast-hit">19:00<b>2.0 mm</b></span><span>20:00<b>1.4 mm</b></span></div>'),
      message('s.', 'Shindo', '<div class="weather-embed"><span>☂ 降水予報 / 架空のサンプル</span><strong>デモ市で雨の予報</strong><p>19:00までの1時間に 2.0 mm</p><div class="rain-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><p>同じ時間枠の通知は重複させません。</p></div>')
    ];
    return discord('weather', frames[step], 'サンプルデータ / 実際の災害情報ではありません', true);
  }
  if (kind === 'stream') return `<div class="mini-studio demo-frame stream-step-${step}"><div class="studio-bar">◫ ${step === 2 ? 'OBS Browser Output' : 'Streaming Studio'}<span>${step === 2 ? 'OUTPUT' : '1920 × 1080'}</span></div><div class="studio-body">${step !== 2 ? '<div class="studio-tools">＋<br>Ｔ<br>▧<br>◷</div>' : ''}<div class="studio-canvas"><div class="stream-heading ${step === 1 ? 'module-moving' : ''}">JUST<br><b>CHATTING.</b></div>${step > 0 ? '<div class="stream-clock">20:30<small>ASIA / TOKYO</small></div><div class="stream-panel">WELCOME TO MY STREAM<br><span>今日も、ゆっくり話そう。</span></div>' : '<span class="canvas-hint">TEXT MODULE / SELECTED</span>'}</div></div><div class="studio-bottom">${step === 2 ? '✓ 保存したレイアウトを反映' : 'EDIT MODE / 配信への反映前'}<span>${step === 2 ? 'SAVED' : 'UNSAVED'}</span></div></div>`;
  if (kind === 'moral') {
    const axes = ['Harm', 'Rights', 'Consent', 'Fairness', 'Reversibility', 'Uncertainty'];
    const main = step === 0 ? '<div class="flow-top"><span>GOAL</span><p>試験で<br>最高点を取る</p></div><div class="flow-connector">↓ 候補行動</div><div class="flow-options"><span>候補 A<small>無断アクセス</small></span><span>代替案 B<small>自力で解答</small></span></div>' : step === 1 ? `<div class="axis-title">候補ごとの影響を評価</div><div class="axis-grid">${axes.map((name, i) => `<div class="axis-item"><span>${name}</span><div><i style="--bar:${[80, 92, 89, 70, 30, 18][i]}%;--delay:${i * 90}ms"></i></div></div>`).join('')}</div><p class="axis-note">模式表示 / 数値は説明用</p>` : '<div class="flow-top"><span>FINAL DECISION</span><p class="decision-word">MODIFY</p></div><div class="flow-options"><span class="blocked">BLOCK<small>無断アクセス</small></span><span class="allowed">ALLOW<small>自力で解答</small></span></div><div class="demo-success">✓ 許可された代替案のみをDry Run</div>';
    return `<div class="mini-moral demo-frame"><div class="mini-label">MORAL DECISION PIPELINE<span>RESEARCH / v0.1</span></div>${main}</div>`;
  }
  if (kind === 'proxy') {
    return `<div class="mini-proxy demo-frame"><div class="mini-label">INSPECTION DASHBOARD<span>SAMPLE DATA</span></div><div class="proxy-stats"><span><small>REQUESTS</small><b>003</b></span><span><small>DETECTED</small><b>${step > 0 ? '001' : '—'}</b></span><span><small>BLOCKED</small><b>${step === 2 ? '001' : '—'}</b></span></div><div class="proxy-row"><span>GET</span><span>example.com</span><em>200 OK</em></div><div class="proxy-row"><span>POST</span><span>example.test/form</span><em class="${step > 0 ? 'warn' : ''}">${step > 0 ? 'PII' : 'QUEUED'}</em></div><div class="proxy-row"><span>GET</span><span>blocked.test</span><em class="${step === 2 ? 'danger' : ''}">${step === 2 ? 'BLOCK' : 'QUEUED'}</em></div>${step === 1 ? '<div class="inspection-code">email: <mark>demo@example.test</mark><span>EMAIL PATTERN DETECTED</span></div>' : step === 2 ? '<div class="demo-success">✓ 検出結果をアクセスログに記録</div>' : '<div class="scan-track"><span></span></div>'}</div>`;
  }
  if (kind === 'soccer') return `<div class="mini-soccer demo-frame soccer-step-${step}"><div class="soccer-meta">SSL SIMULATION<span>TACTICAL DEMO</span></div><div class="pitch"><div class="pitch-center"></div><div class="goal left"></div><div class="goal right"></div><i class="player b1">1</i><i class="player b2">2</i><i class="player b3">3</i><i class="player y1">1</i><i class="player y2">2</i><i class="player y3">3</i><i class="ball travel-ball"></i>${step === 0 ? '<div class="position-target"></div>' : ''}</div><div class="soccer-bottom">${['EVALUATE POSITION', 'PASS TO TEAMMATE', 'SELECT SHOOT'][step]}<span>模式アニメーション</span></div></div>`;
  if (kind === 'portfolio') return `<div class="mini-portfolio demo-frame portfolio-step-${step}"><span>amz.</span>${step === 0 ? '<strong>小さな不便を、<br><em>つくるきっかけに。</em></strong><div class="portfolio-blocks"><i></i><i></i><i></i></div><small>01 / FIND A PROJECT</small>' : step === 1 ? '<div class="portfolio-detail"><span>PROJECT DETAILS</span><strong>Yomiage Bot</strong><p>声と言葉の壁を、もっと低く。</p><div class="portfolio-detail-lines"><i></i><i></i><i></i></div></div><small>02 / UNDERSTAND THE IDEA</small>' : '<div class="portfolio-detail"><span>INTERACTIVE WALKTHROUGH</span><strong>Message → Voice</strong><div class="portfolio-wave">' + wave + '</div><p>開発の背景も、動きも、ひとつの場所で。</p></div><small>03 / SEE IT IN ACTION → GITHUB</small>'}</div>`;
  throw new Error(`Unknown demo kind: ${kind}`);
}
