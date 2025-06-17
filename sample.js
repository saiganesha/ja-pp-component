<!-- プージャー設定 -->
<script>
  // プージャーの基本設定
  const pid = '134061458'; // 商品ID
  const categoryId = '2018040'; // カテゴリーID
  const deadline = new Date('2025-08-05T18:00:00'); // 申込締切日時
  const functionName = 'Puja20241203'; // 関数名
  const productName = 'ヴァラ・ラクシュミー・ヴラタ・プージャー'; // プージャー名
  const apiStreamUrl = 'https://get-jyotish-advise-89aa13840a57.herokuapp.com';
</script>

<!-- Font Awesome CDNを追加（headタグ内に配置） -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

<!-- 占星術サービス案内 -->
<div id="jyotish-advisor">
  <div id="daily-advice-content">
    <img
      src="https://img02.shop-pro.jp/PA01008/381/etc_base64/anlvdGlzaF9hZHZpc29y.jpeg?cmsp_timestamp=20250119161541"
      alt="ジョーティッシュ・アドバイザー、インド占星術鑑定"
      class="puja-product-image"
    />
    <h3>無料のインド占星術鑑定で、プージャーの効果とあなたの未来をチェック</h3>
    <p>
      「<span class="product-name"></span>」を受けることで、<br />
      あなたの運命にどのように作用するのか？<br />
      古代インドの叡智、ジョーティッシュ（インド占星術）を活用して無料で確かめてみませんか？<br />
      あなたのホロスコープから<strong>プージャーがもたらす影響</strong>を具体的に読み解き、<br />
      より良い未来に向けたアドバイスを提供いたします。
    </p>
    <p class="advisor-description"></p>

    <ol class="custom-ol">
      <li>
        <strong>基本情報の入力</strong>
        <ul>
          <li>お名前（ニックネーム）</li>
          <li>生年月日と誕生時間</li>
          <li>誕生地と現在地の住所</li>
          <li>インド占星術の理解度</li>
          <li>ご希望の鑑定項目</li>
        </ul>
      </li>
      <li>
        <strong>ジョーティッシュによる詳細分析</strong>
        <ul>
          <li>グラハ（惑星）の配置とアスペクトを徹底解析</li>
          <li>マハーダシャー（大運）とアンタルダシャー（小運）の影響</li>
          <li>ゴーチャラ（惑星の運行）から見る運命のタイミング</li>
          <li>ヨーガ（惑星の組み合わせ）やナクシャトラ（月宿）が示す才能や強み</li>
          <li><span class="product-name"></span>の効果が高まる時期の把握</li>
        </ul>
      </li>
      <li>
        <strong>実践的なアドバイス提供</strong>
        <ul>
          <li>プージャー効果を最大化するための具体的な行動プラン</li>
          <li>これから訪れるチャンスと課題の詳細な解説</li>
          <li>問題が表面化しやすい時期の対処法と最適なタイミング</li>
          <li>星の後押しを受けやすい時期を活かすヒント</li>
        </ul>
      </li>
    </ol>
    <p>
      5000年以上の歴史を持つジョーティッシュで、<br />
      <span class="product-name"></span>の神聖なパワーを知り、<br />
      あなたの人生をより良い方向へ導く準備を整えてみましょう。
    </p>
    <p class="free-service-notice" style="color: #007bff; margin-top: 10px; text-align: center">
      ※ このインド占星術鑑定は無料でご利用いただけます
    </p>
  </div>

  <form id="textForm">
    <div>
      <label for="nameInput"><i class="fas fa-user"></i> お名前（ニックネーム）：</label>
      <input
        id="nameInput"
        placeholder="お名前（ニックネーム）を入力"
        type="text"
        required
        oninvalid="this.setCustomValidity('お名前（ニックネーム）を入力してください')"
        oninput="this.setCustomValidity('')"
      />
    </div>
    <div class="birth-date-container">
      <label><i class="fas fa-calendar-alt"></i> 生年月日：</label>
      <div class="birth-date-inputs" style="width: 100%">
        <div class="birth-date-field" style="flex: 1">
          <input
            id="birthYearInput"
            type="number"
            placeholder="年"
            min="1900"
            max="9999"
            required
            oninvalid="this.setCustomValidity('生年を入力してください')"
            oninput="this.setCustomValidity(''); updateBirthDate();"
            style="width: 100%"
          />
          <span class="birth-date-label">年</span>
        </div>
        <div class="birth-date-field" style="flex: 1">
          <input
            id="birthMonthInput"
            type="number"
            placeholder="月"
            min="1"
            max="12"
            required
            oninvalid="this.setCustomValidity('生月を入力してください')"
            oninput="this.setCustomValidity(''); updateBirthDate();"
            style="width: 100%"
          />
          <span class="birth-date-label">月</span>
        </div>
        <div class="birth-date-field" style="flex: 1">
          <input
            id="birthDayInput"
            type="number"
            placeholder="日"
            min="1"
            max="31"
            required
            oninvalid="this.setCustomValidity('生日を入力してください')"
            oninput="this.setCustomValidity(''); updateBirthDate();"
            style="width: 100%"
          />
          <span class="birth-date-label">日</span>
        </div>
      </div>
      <input type="hidden" id="birthDateInput" />
    </div>
    <div>
      <label for="birthPlaceInput"><i class="fas fa-map-marker-alt"></i> 誕生地住所：</label>
      <input
        id="birthPlaceInput"
        placeholder="誕生地住所を入力"
        type="text"
        required
        oninvalid="this.setCustomValidity('誕生地住所を入力してください')"
        oninput="this.setCustomValidity('')"
      />
    </div>
    <div>
      <label for="birthTimeInput"><i class="fas fa-clock"></i> 誕生時間：</label>
      <input
        id="birthTimeInput"
        placeholder="誕生時間を入力"
        type="time"
        required
        oninvalid="this.setCustomValidity('誕生時間を入力してください')"
        oninput="this.setCustomValidity('')"
      />
    </div>
    <div>
      <label for="currentPlaceInput"><i class="fas fa-home"></i> 現在地の住所：</label>
      <input
        id="currentPlaceInput"
        placeholder="現在地の住所を入力"
        type="text"
        required
        oninvalid="this.setCustomValidity('現在地の住所を入力してください')"
        oninput="this.setCustomValidity('')"
      />
    </div>
    <div>
      <label for="astrologyLevel"><i class="fas fa-star"></i> インド占星術の理解度：</label>
      <select
        id="astrologyLevel"
        name="astrologyLevel"
        required
        oninvalid="this.setCustomValidity('理解度を選択してください')"
        oninput="this.setCustomValidity('')"
      >
        <option value="">インド占星術の理解度を教えてください</option>
        <option value="1">はじめて - 占星術の専門用語は使わず、わかりやすく解説してほしい</option>
        <option value="2">少し知っている - 基本的な用語を交えながら解説してほしい</option>
        <option value="3">詳しい - 専門的な用語を使って詳しく解説してほしい</option>
      </select>
    </div>
    <div>
      <label for="fortuneCategory"><i class="fas fa-magic"></i> 鑑定項目：</label>
      <select
        id="fortuneCategory"
        name="fortuneCategory"
        required
        onchange="showSpecificQuestion()"
        oninvalid="this.setCustomValidity('鑑定項目を選択してください')"
        oninput="this.setCustomValidity('')"
      >
        <option value="">ご希望の鑑定項目を選択してください</option>
        <option value="1">総合運について: 全体的な運勢の流れ、幸運期、注意点などを占います。</option>
        <option value="2">恋愛運について: 出会い、片思い、パートナーとの関係、結婚などを占います。</option>
        <option value="3">仕事運について: 転職、昇進、人間関係、適職などを占います。</option>
        <option value="4">金運について: 収入、貯蓄、投資、浪費傾向などを占います。</option>
        <option value="5">健康運について: 体調、病気、怪我、メンタルヘルスなどを占います。</option>
        <option value="6">家庭運について: 家族関係、引っ越し、不動産購入などを占います。</option>
        <option value="7">対人運について: 友人関係、職場の人間関係、トラブルなどを占います。</option>
        <option value="8">学業運について: 試験、受験、進路、学習方法などを占います。</option>
        <option value="9">旅行運について: 国内旅行、海外旅行、レジャー、アクシデントなどを占います。</option>
        <option value="10">運気アップ方法について: 具体的な開運アクション、ラッキーアイテムなどを占います。</option>
        <option value="11">ダシャーについて: インド占星術の時期区分システムによる運命の流れと転機を占います。</option>
      </select>
    </div>
    <div id="specificQuestionDiv" style="display: none">
      <label for="specificQuestion"><i class="fas fa-comment-dots"></i> 具体的な質問内容：</label>
      <textarea
        id="specificQuestion"
        name="specificQuestion"
        rows="4"
        cols="50"
        maxlength="1000"
        placeholder="選択した鑑定項目について、具体的に知りたいことがありましたら入力してください。(1000文字以内)"
        oninput="countChars(this)"
      ></textarea>
      <div id="charCount">0 / 1000</div>
    </div>
    <div>
      <label class="checkbox-container">
        入力情報を保存する
        <input id="saveInput" type="checkbox" />
        <span class="checkmark"></span>
      </label>
    </div>
    <div>
      <button class="btn btn-lg" onclick="clearData()" type="button">クリア</button>
      <button id="submitButton" class="btn btn-lg submit-btn" onclick="validateForm()" type="button">送信</button>
    </div>
  </form>

  <div id="basic-astro-info"></div>
  <div id="result"></div>

  <!-- チャット入力フォーム -->
  <div id="chat-form" style="display: none">
    <h3 class="p-product__ttl">追加の質問</h3>
    <textarea
      id="chat-input"
      rows="4"
      cols="50"
      placeholder="他に何か聞きたいことがありますか？"
      oninput="countChars(this)"
      maxlength="1000"
    ></textarea>
    <div id="chat-charCount">0 / 1000</div>
    <div class="button-container">
      <button class="btn btn-lg submit-btn" onclick="validateAndSendChat()">送信</button>
    </div>
  </div>

  <div id="loading-container" style="display: none">
    <div class="loading-spinner"></div>
  </div>
</div>

<!-- marked.jsを追加 -->
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<script>
  // HTMLの属性を動的に更新する
  document.addEventListener('DOMContentLoaded', function () {
    // すべてのCTAボタンのhrefを更新
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach((button) => {
      button.href = `https://sitarama.jp/?pid=${pid}`;
    });

    // プージャー名を動的に挿入（すべての要素に対して）
    document.querySelectorAll('.product-name').forEach((element) => {
      element.textContent = productName;
    });
  });

  // ストリーミング用のCTAボタンHTML
  const ctaButtonHtml = `<p><a href="https://sitarama.jp/?pid=${pid}" class="btn btn-lg cta-btn">${productName}にお申し込みする</a></p>`;

  // ページ読み込み時にローカルストレージから読み込む
  var savedName = localStorage.getItem('name');
  var savedBirthPlace = localStorage.getItem('birthPlace');
  var savedBirthDate = localStorage.getItem('birthDate');
  var savedBirthTime = localStorage.getItem('birthTime');
  var savedCurrentPlace = localStorage.getItem('currentPlace');
  var savedAstrologyLevel = localStorage.getItem('astrologyLevel');

  if (savedName) {
    document.getElementById('nameInput').value = savedName;
  }
  if (savedBirthPlace) {
    document.getElementById('birthPlaceInput').value = savedBirthPlace;
  }
  if (savedBirthDate) {
    const [year, month, day] = savedBirthDate.split('-');
    document.getElementById('birthYearInput').value = parseInt(year);
    document.getElementById('birthMonthInput').value = parseInt(month);
    document.getElementById('birthDayInput').value = parseInt(day);
    updateBirthDate();
  }
  if (savedBirthTime) {
    document.getElementById('birthTimeInput').value = savedBirthTime;
  }
  if (savedCurrentPlace) {
    document.getElementById('currentPlaceInput').value = savedCurrentPlace;
  }
  if (savedAstrologyLevel) {
    document.getElementById('astrologyLevel').value = savedAstrologyLevel;
  }

  // グローバル変数としてconversationIdを保存
  let conversationId = null;

  function submitText() {
    const submitButton = document.getElementById('submitButton');
    submitButton.disabled = true;

    // basic-astro-info と result の内容をクリア
    document.getElementById('basic-astro-info').innerHTML = '';
    document.getElementById('result').innerHTML = '';

    // チャットフォームを非表示に
    const chatForm = document.getElementById('chat-form');
    chatForm.style.display = 'none';

    // conversationIdをリセット
    conversationId = null;

    const name = document.getElementById('nameInput').value;
    const birthPlace = document.getElementById('birthPlaceInput').value;
    const birthDate = document.getElementById('birthDateInput').value;
    const birthTime = document.getElementById('birthTimeInput').value;
    const currentPlace = document.getElementById('currentPlaceInput').value;
    const saveInput = document.getElementById('saveInput').checked;
    const astrologyLevel = document.getElementById('astrologyLevel').value;
    const fortuneCategory = document.getElementById('fortuneCategory').value;
    const specificQuestion = document.getElementById('specificQuestion').value;

    // 入力情報をローカルストレージに保存する
    if (saveInput) {
      localStorage.setItem('name', name);
      localStorage.setItem('birthPlace', birthPlace);
      localStorage.setItem('birthDate', birthDate);
      localStorage.setItem('birthTime', birthTime);
      localStorage.setItem('currentPlace', currentPlace);
      localStorage.setItem('astrologyLevel', astrologyLevel);
    }

    var [year, month, day] = birthDate.split('-');
    var [hour, min] = birthTime.split(':');

    // basic-astrology-dataエンドポイントからデータを取得し、表示する
    fetch(`${apiStreamUrl}/basic-astrology-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
        hour: parseInt(hour),
        min: parseInt(min),
        birthPlace: birthPlace,
        currentPlace: currentPlace,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const nameDisplay = name ? `${name}さんの` : 'あなたの';

        const basicAstroInfoDiv = document.getElementById('basic-astro-info');
        basicAstroInfoDiv.innerHTML = `
                  <p>${nameDisplay}アセンダント: ${data.ascendant}</p>
                  <p>${nameDisplay}月の星座（ラーシ）: ${data.sign}</p>
                  <p>${nameDisplay}月のナクシャトラ: ${data.nakshatra}</p>
                `;
      })
      .catch((error) => {
        console.error('Error fetching basic astrology data:', error);
      });

    // エンドポイントURLの構築
    var url = `${apiStreamUrl}/dl-jyotish-advice-stream?functionName=${functionName}&year=${year}&month=${month}&day=${day}&hour=${hour}&min=${min}&birthAddress=${encodeURIComponent(
      birthPlace
    )}&currentAddress=${encodeURIComponent(
      currentPlace
    )}&productId=${pid}&categoryId=${categoryId}&name=${encodeURIComponent(name)}&astrologyLevel=${encodeURIComponent(
      astrologyLevel
    )}&fortuneCategory=${encodeURIComponent(fortuneCategory)}&specificQuestion=${encodeURIComponent(specificQuestion)}`;

    // ローディングコンテナを表示
    document.getElementById('loading-container').style.display = 'block';

    // メッセージバブルの作成
    const resultElement = document.getElementById('result');
    const aiContainer = document.createElement('div');
    aiContainer.className = 'message-container ai-message';
    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    aiContainer.appendChild(messageBubble);
    resultElement.appendChild(aiContainer);

    // EventSourceを使用してサーバーからのストリームを受け取る
    var eventSource = new EventSource(url);
    let accumulatedMessage = '';

    eventSource.onmessage = function (event) {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'end' && data.status === '[DONE]') {
          console.log('Streaming completed');
          eventSource.close();

          // カウントダウンとCTAボタンを追加（順序を修正）
          const newCountdownElement = document.createElement('div');
          newCountdownElement.id = 'countdown';
          newCountdownElement.className = 'deadline-notice';
          resultElement.appendChild(newCountdownElement);

          const newCtaButton = document.createElement('div');
          newCtaButton.innerHTML = ctaButtonHtml;
          resultElement.appendChild(newCtaButton);

          // カウントダウンの更新を開始
          updateCountdown(deadline);

          document.getElementById('submitButton').disabled = false;

          if (data.conversationId) {
            conversationId = data.conversationId;
            console.log('Received conversationId:', conversationId);
            document.getElementById('chat-form').style.display = 'block';
          } else {
            console.error('conversationId not found in the response');
          }
        } else if (data.type === 'message') {
          document.getElementById('loading-container').style.display = 'none';
          accumulatedMessage += data.content || '';
          messageBubble.innerHTML = marked.parse(closeOpenTags(accumulatedMessage));
        } else if (data.type === 'error') {
          console.error('Error from server:', data.message);
          messageBubble.innerHTML += `<p style="color: red;">エラーが発生しました: ${data.message}</p>`;
        }
      } catch (error) {
        console.error('Error parsing message data:', error);
      }
    };

    eventSource.onerror = function (event) {
      if (event.target.readyState === EventSource.CLOSED) {
        console.error('Stream closed by the server.');
        document.getElementById('loading-container').style.display = 'none';
        messageBubble.innerHTML += '<p style="color: red;">サーバーとの接続が閉じられました。</p>';
      } else {
        console.error('An error occurred:', event);
        document.getElementById('loading-container').style.display = 'none';
        messageBubble.innerHTML += '<p style="color: red;">エラーが発生しました。</p>';
      }
      document.getElementById('submitButton').disabled = false;
    };
  }

  function clearData() {
    localStorage.removeItem('name');
    localStorage.removeItem('birthPlace');
    localStorage.removeItem('birthDate');
    localStorage.removeItem('birthTime');
    localStorage.removeItem('currentPlace');
    document.getElementById('nameInput').value = '';
    document.getElementById('birthPlaceInput').value = '';
    document.getElementById('birthYearInput').value = '';
    document.getElementById('birthMonthInput').value = '';
    document.getElementById('birthDayInput').value = '';
    document.getElementById('birthTimeInput').value = '';
    document.getElementById('currentPlaceInput').value = '';
  }

  function validateForm() {
    const nameInput = document.getElementById('nameInput');
    const birthYearInput = document.getElementById('birthYearInput');
    const birthMonthInput = document.getElementById('birthMonthInput');
    const birthDayInput = document.getElementById('birthDayInput');
    const birthPlaceInput = document.getElementById('birthPlaceInput');
    const birthTimeInput = document.getElementById('birthTimeInput');
    const currentPlaceInput = document.getElementById('currentPlaceInput');
    const astrologyLevelInput = document.getElementById('astrologyLevel');
    const fortuneCategoryInput = document.getElementById('fortuneCategory');

    if (!nameInput.value) {
      alert('お名前（ニックネーム）を入力してください');
      return false;
    }
    if (!birthYearInput.value || !birthMonthInput.value || !birthDayInput.value) {
      alert('生年月日を入力してください');
      return false;
    }
    if (!birthPlaceInput.value) {
      alert('誕生地住所を入力してください');
      return false;
    }
    if (!birthTimeInput.value) {
      alert('誕生時間を入力してください');
      return false;
    }
    if (!currentPlaceInput.value) {
      alert('現在地の住所を入力してください');
      return false;
    }
    if (!astrologyLevelInput.value) {
      alert('インド占星術の理解度を選択してください');
      return false;
    }
    if (!fortuneCategoryInput.value) {
      alert('鑑定項目を選択してください');
      return false;
    }

    submitText();
  }

  function validateAndSendChat() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    const name = document.getElementById('nameInput').value;

    if (!message) {
      alert('メッセージを入力してください');
      return;
    }

    sendChatMessage();
  }

  function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    const resultElement = document.getElementById('result');
    const chatForm = document.getElementById('chat-form');
    const name = document.getElementById('nameInput').value;

    if (message && conversationId) {
      // 既存のカウントダウンとCTAボタンを削除
      const existingCountdown = document.getElementById('countdown');
      const existingCtaButton = document.querySelector('.cta-btn')?.closest('p');
      if (existingCountdown) existingCountdown.remove();
      if (existingCtaButton) existingCtaButton.remove();

      chatForm.style.display = 'none';

      // ユーザーメッセージの表示
      resultElement.innerHTML += `
              <div class="message-container user-message">
                <div class="message-bubble">
                  <p>${message}</p>
                </div>
              </div>
            `;

      // AI応答用のメッセージバブルを作成
      const aiResponseElement = document.createElement('div');
      aiResponseElement.className = 'message-container ai-message';
      const messageBubble = document.createElement('div');
      messageBubble.className = 'message-bubble';
      aiResponseElement.appendChild(messageBubble);
      resultElement.appendChild(aiResponseElement);

      let accumulatedMessage = '';
      fetch(`${apiStreamUrl}/dl-jyotish-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: conversationId,
          message: message,
          name: name,
        }),
      })
        .then((response) => {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          function readStream() {
            return reader.read().then(({done, value}) => {
              if (done) {
                // チャット応答完了時にカウントダウン要素とCTAボタンを作成
                const countdownContainer = document.createElement('div');
                countdownContainer.id = 'countdown';
                countdownContainer.className = 'deadline-notice';
                resultElement.appendChild(countdownContainer);

                const ctaButton = document.createElement('div');
                ctaButton.innerHTML = ctaButtonHtml;
                resultElement.appendChild(ctaButton);

                // カウントダウンの更新を開始
                updateCountdown(deadline);

                chatForm.style.display = 'block';
                return;
              }
              const chunk = decoder.decode(value, {stream: true});
              const lines = chunk.split('\n');
              lines.forEach((line) => {
                if (line.startsWith('data: ')) {
                  try {
                    const data = JSON.parse(line.slice(6));
                    if (data.type === 'message') {
                      accumulatedMessage += data.content || '';
                      messageBubble.innerHTML = marked.parse(closeOpenTags(accumulatedMessage));
                    } else if (data.type === 'end') {
                      console.log('チャットストリーミングが完了しました');
                      if (data.conversationId) {
                        conversationId = data.conversationId;
                        console.log('更新されたconversationId:', conversationId);
                      }
                    } else if (data.type === 'error') {
                      console.error('サーバーからのエラー:', data.message);
                      messageBubble.innerHTML += `<br><span style="color: red;">エラー: ${data.message}</span>`;
                    }
                  } catch (error) {
                    console.error('JSONパースエラー:', error, '生データ:', line);
                  }
                }
              });
              return readStream();
            });
          }

          return readStream();
        })
        .catch((error) => {
          console.error('エラー:', error);
          messageBubble.innerHTML += '<br>エラーが発生しました。';
        })
        .finally(() => {
          chatInput.value = '';
          chatForm.style.display = 'block';
        });
    } else {
      alert('メッセージを入力するか、最初の鑑定を行ってください。');
    }
  }

  function closeOpenTags(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const openTags = Array.from(tempDiv.getElementsByTagName('*'))
      .filter((element) => !element.nextSibling)
      .map((element) => element.tagName.toLowerCase());

    const closeTags = openTags.map((tag) => `</${tag}>`).reverse();

    return html + closeTags.join('');
  }

  function updateCountdown(deadline) {
    if (!deadline || isNaN(deadline.getTime())) {
      return;
    }

    const countdownElement = document.getElementById('countdown');
    let intervalId;

    function update() {
      countdownElement.textContent = calculateRemainingTime();

      if (new Date() >= deadline) {
        clearInterval(intervalId);
      }
    }

    update();
    intervalId = setInterval(update, 1000);
  }

  function calculateRemainingTime() {
    const now = new Date();
    const remainingTime = deadline - now;

    if (remainingTime <= 0) {
      return '';
    }

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    let countdownText = '';

    if (days > 0) {
      countdownText = `申し込み締切まで、あと${days}日${hours}時間${minutes}分${seconds}秒`;
    } else if (hours > 0) {
      countdownText = `申し込み締切まで、あと${hours}時間${minutes}分${seconds}秒`;
    } else if (minutes > 0) {
      countdownText = `申し込み締切まで、あと${minutes}分${seconds}秒`;
    } else {
      countdownText = `申し込み締切まで、あと${seconds}秒`;
    }

    return countdownText;
  }

  function showSpecificQuestion() {
    const specificQuestionDiv = document.getElementById('specificQuestionDiv');
    if (document.getElementById('fortuneCategory').value === '') {
      specificQuestionDiv.style.display = 'none';
    } else {
      specificQuestionDiv.style.display = 'block';
    }
  }

  function countChars(textarea) {
    const maxLength = 1000;
    const currentLength = textarea.value.length;
    const remainingLength = maxLength - currentLength;

    // テキストエリアのIDに基づいて、対応するカウンター要素のIDを決定
    const counterId = textarea.id === 'chat-input' ? 'chat-charCount' : 'charCount';
    document.getElementById(counterId).textContent = `${currentLength} / ${maxLength}`;
  }

  function updateBirthDate() {
    const year = document.getElementById('birthYearInput').value;
    const month = document.getElementById('birthMonthInput').value.padStart(2, '0');
    const day = document.getElementById('birthDayInput').value.padStart(2, '0');

    if (year && month && day) {
      const dateStr = `${year}-${month}-${day}`;
      document.getElementById('birthDateInput').value = dateStr;
    }
  }

  // ページ読み込み時にカウントダウンを開始
  document.addEventListener('DOMContentLoaded', function () {
    updateCountdown(deadline);
  });
</script>

<!-- 商品説明セクション -->
<style type="text/css">
  /* レスポンシブ対応のスタイル追加・修正 */
  @media (max-width: 768px) {
    /* 商品タイトルの調整 */
    .product-title {
      font-size: 1.5rem;
      padding: 0 1rem;
      line-height: 1.6;
    }

    /* 商品説明文のマージン調整 */
    .product-description {
      padding: 0 1rem;
      font-size: 0.95rem;
      line-height: 1.8;
    }

    /* フォーム要素の調整 */
    #textForm input,
    #textForm select,
    #textForm textarea {
      font-size: 16px; /* iOSでズームインを防ぐため */
      padding: 12px; /* タップ領域を広げる */
    }

    /* 生年月日入力の調整 */
    .birth-date-inputs {
      gap: 5px; /* スマホでは間隔を狭める */
    }

    .birth-date-field input {
      padding: 12px 5px; /* 横パディングを減らす */
    }

    .birth-date-label {
      font-size: 0.9rem; /* ラベルを少し小さく */
    }

    /* セレクトボックスの調整 */
    #astrologyLevel,
    #fortuneCategory {
      padding-right: 30px; /* 矢印アイコンのための余白 */
    }

    /* メッセージ表示エリアの調整 */
    .message-bubble {
      padding: 12px;
      font-size: 0.95rem;
      line-height: 1.6;
    }

    /* 特徴セクションの調整 */
    .features-section {
      padding: 1.5rem 1rem;
      margin: 1.5rem 0;
    }

    .features-list li {
      font-size: 0.95rem;
      padding-left: 1.8em;
      line-height: 1.6;
    }

    /* CTAボタンの調整 */
    .cta-btn {
      width: 90%; /* 横幅を調整 */
      padding: 15px; /* タップ領域を広げる */
      font-size: 1.1rem;
      margin: 20px auto;
    }

    /* カウントダウン表示の調整 */
    .deadline-notice {
      font-size: 1.1rem;
      padding: 0.8rem;
      margin: 1rem;
    }

    /* チャット入力エリアの調整 */
    #chat-form {
      margin: 15px;
    }

    #chat-input {
      font-size: 16px;
      padding: 12px;
    }

    /* アイコンラベルの調整 */
    #textForm label {
      font-size: 0.95rem;
      margin-bottom: 8px;
    }

    #textForm label i {
      width: 18px;
      margin-right: 6px;
    }

    /* カスタムリストのスタイル */
    .custom-ol {
      padding: 1.5rem 1.5rem 1.5rem 2.5rem;
      margin: 15px 0;
    }

    .custom-ol li {
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 0.8rem;
    }

    .custom-ol ul {
      padding-left: 1.2em;
      margin: 0.3rem 0;
    }

    .custom-ol ul li {
      font-size: 0.9rem;
      line-height: 1.4;
      margin-bottom: 0.2rem;
    }
  }
  /* 商品説明セクションのスタイル */
  .product-header {
    text-align: center;
    margin: 2rem 0;
  }

  .puja-product-image {
    max-width: 100%;
    max-height: 400px;
    width: auto;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
    object-fit: contain;
  }

  .product-title {
    font-size: 1.8rem;
    color: #333;
    margin: 1rem 0;
    line-height: 1.4;
    font-weight: 600;
  }

  .product-description {
    font-size: 1rem;
    line-height: 1.8;
    color: #444;
    margin: 1.5rem 0;
    text-align: left;
  }

  .deadline-notice {
    background-color: #ffebee;
    color: #c62828;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
    font-weight: bold;
    text-align: center;
    font-size: 1.5rem;
  }

  /* 特徴セクションのスタイル */
  .features-section {
    background-color: #f8f9fa;
    padding: 2rem;
    border-radius: 10px;
    margin: 2rem 0;
  }

  .features-title {
    color: #1a73e8;
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }

  .features-list {
    list-style-type: none;
    padding: 0;
  }

  .features-list li {
    position: relative;
    padding-left: 1.5em;
    margin-bottom: 0.8rem;
    line-height: 1.8;
    font-size: 1rem;
  }

  .features-list li:before {
    content: '★';
    position: absolute;
    left: 0;
    color: #1a73e8;
    font-size: 1em;
    top: 50%;
    transform: translateY(-50%);
  }

  /* フォーム要素のスタイル */
  #textForm input,
  #textForm select,
  #textForm textarea {
    width: 100%;
    height: auto;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 15px;
    box-sizing: border-box;
    font-size: 16px;
  }

  #textForm div {
    margin-bottom: 1rem;
  }

  #textForm label {
    display: flex;
    align-items: center;
    white-space: nowrap;
    text-align: left;
  }

  /* チェックボックスのスタイル */
  .checkbox-container {
    display: inline-block;
    position: relative;
    padding-left: 35px;
    cursor: pointer;
    font-size: 16px;
    user-select: none;
  }

  .checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: #eee;
    border-radius: 4px;
  }

  .checkbox-container:hover input ~ .checkmark {
    background-color: #ccc;
  }

  .checkbox-container input:checked ~ .checkmark {
    background-color: #2196f3;
  }

  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }

  .checkbox-container input:checked ~ .checkmark:after {
    display: block;
  }

  .checkbox-container .checkmark:after {
    left: 7px;
    top: 3px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }

  /* ボタンとローディングのスタイル */
  .submit-btn {
    background-color: #007bff;
    color: white;
  }

  .submit-btn:hover {
    background-color: #0056b3;
    color: white;
  }

  #loading-container {
    text-align: center;
    margin-top: 20px;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #007bff;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* メッセージ関連のスタイル */
  .message-container {
    display: flex;
    margin: 15px 0;
  }

  .user-message {
    justify-content: flex-end;
  }

  .ai-message {
    justify-content: flex-start;
  }

  .message-bubble {
    max-width: 100%;
    padding: 10px 15px;
    border-radius: 20px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    font-size: 15px;
    line-height: 1.7;
  }

  .message-bubble p,
  .message-bubble li,
  .message-bubble ul,
  .message-bubble ol {
    font-size: inherit;
    line-height: inherit;
    margin: 0.5rem 0;
  }

  .message-bubble ul,
  .message-bubble ol {
    padding-left: 1.5em;
  }

  .message-container.user-message .message-bubble {
    background-color: #007bff;
    color: white;
  }

  .message-container.user-message .message-bubble p,
  .message-container.user-message .message-bubble li,
  .message-container.user-message .message-bubble ul,
  .message-container.user-message .message-bubble ol,
  .message-container.user-message .message-bubble strong {
    color: white;
  }

  .message-container.ai-message .message-bubble {
    background-color: #f8f9fa;
    color: #000000;
  }

  /* チャットフォームのスタイル */
  #chat-form {
    margin-top: 20px;
  }

  #chat-input {
    width: 100%;
    margin-bottom: 10px;
  }

  .button-container {
    display: flex;
    justify-content: flex-end;
  }

  /* カスタムリストのスタイル */
  .custom-ol {
    background-color: #f8f9fa;
    padding: 2rem 2rem 2rem 3.5rem;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    list-style-type: decimal;
    margin: 20px 0;
  }

  .custom-ol li {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1rem;
    color: #333;
  }

  .custom-ol ul {
    list-style-type: disc;
    padding-left: 1.5em;
    margin: 0.5rem 0;
  }

  .custom-ol ul li {
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 0.3rem;
    color: #555;
  }

  /* ジョーティッシュ・アドバイザーセクションのスタイル */
  #jyotish-advisor {
    margin: 2rem 0;
  }

  #daily-advice-content h3 {
    font-size: 1.5rem;
    color: #333;
    margin: 2rem 0 1rem;
    line-height: 1.6;
    font-weight: 600;
    text-align: center;
  }

  .free-service-notice {
    font-size: 1.2rem;
    font-weight: 600;
    background-color: #e3f2fd;
    padding: 1rem;
    border-radius: 8px;
    margin: 2rem 0;
    text-align: center;
    color: #1a73e8;
  }

  /* ヘルパーテキスト */
  .input-helper {
    display: block;
    font-size: 0.9em;
    color: #666;
    margin-top: 5px;
  }

  /* 文字数カウント */
  #charCount,
  #chat-charCount {
    text-align: right;
    margin-top: 5px;
    color: #666;
  }

  .c-ttl-second {
    display: none;
  }

  /* CTAボタン */
  .cta-btn {
    display: block;
    width: fit-content;
    margin: 20px auto 0;
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 4px;
    font-size: 18px;
    text-align: center;
  }

  /* レスポンシブ対応 */
  @media (max-width: 768px) {
    .product-title {
      font-size: 1.5rem;
      padding: 0 1rem;
    }

    .features-section {
      padding: 1.5rem;
      margin: 1.5rem;
    }

    #jyotish-advisor {
      padding: 1.5rem;
      margin: 2rem 1rem;
    }

    .product-description,
    .features-list li {
      font-size: 1rem;
    }

    #jyotish-advisor p,
    .custom-ol li,
    .custom-ol ul li,
    .free-service-notice {
      font-size: 1.1rem;
      padding: 0.8rem;
    }

    .message-bubble {
      max-width: 100%;
      padding: 12px;
      font-size: 14px;
    }

    .message-container {
      margin: 10px 0;
      padding: 0 10px;
    }

    .message-bubble p,
    .message-bubble li,
    .message-bubble ul,
    .message-bubble ol {
      font-size: 14px;
      line-height: 1.6;
      margin: 0.4rem 0;
    }

    #chat-form {
      margin: 15px 10px;
    }

    #chat-input {
      font-size: 16px;
      padding: 10px;
    }
  }

  /* 生年月日入力フォームのスタイル */
  .birth-date-container {
    margin-bottom: 1rem;
    width: 100%;
  }

  .birth-date-inputs {
    display: flex;
    gap: 10px;
    margin-top: 5px;
    width: 100%;
  }

  .birth-date-field {
    display: flex;
    align-items: center;
    flex: 1;
  }

  .birth-date-field input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }

  .birth-date-label {
    margin-left: 5px;
    white-space: nowrap;
  }

  /* アイコンのスタイリングを追加 */
  #textForm label i {
    margin-right: 8px;
    color: #007bff; /* アイコンの色 */
    width: 20px; /* アイコンの幅を固定 */
    text-align: center;
  }

  #textForm label {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }

  /* スマートフォン向けのフォントサイズ統一 */
  @media screen and (max-width: 767px) {
    body {
      font-size: 16px;
      line-height: 1.6;
    }

    h1 {
      font-size: 24px;
    }

    h2 {
      font-size: 22px;
    }

    h3 {
      font-size: 20px;
    }

    h4 {
      font-size: 18px;
    }

    h5 {
      font-size: 17px;
    }

    h6 {
      font-size: 16px;
    }

    p,
    label,
    input,
    select,
    textarea {
      font-size: 16px;
    }

    .p-product__ttl {
      font-size: 18px;
    }

    #result p,
    #basic-astro-info p,
    .message-bubble p {
      font-size: 16px;
    }

    .btn {
      font-size: 16px;
    }

    #charCount,
    #chat-charCount {
      font-size: 14px;
    }
  }

  /* 寺院リストのスタイル */
  .temple-list-container {
    background-color: #f8f9fa;
    padding: 1.5rem;
    border-radius: 10px;
    margin: 1.5rem 0;
  }

  .temple-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .temple-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e9ecef;
    transition: background-color 0.3s ease;
  }

  .temple-item:last-child {
    border-bottom: none;
  }

  .temple-item:hover {
    background-color: #e9ecef;
  }

  .temple-item i:first-child {
    font-size: 1.2rem;
    color: #1a73e8;
    width: 30px;
    text-align: center;
    margin-right: 1rem;
  }

  .element-name {
    font-weight: 600;
    color: #495057;
    margin-right: 1rem;
    white-space: nowrap;
  }

  .temple-link {
    color: #1a73e8;
    text-decoration: none;
    display: flex;
    align-items: center;
    flex: 1;
  }

  .temple-link:hover {
    text-decoration: underline;
  }

  .temple-link .fa-external-link-alt {
    font-size: 0.8rem;
    margin-left: 0.5rem;
    opacity: 0.7;
  }

  /* レスポンシブ対応 */
  @media (max-width: 768px) {
    .temple-item {
      flex-wrap: wrap;
      padding: 0.8rem;
    }

    .element-name {
      margin-right: 0.5rem;
    }

    .temple-link {
      width: 100%;
      margin-top: 0.5rem;
      padding-left: 2.5rem;
    }
  }

  .closing-message {
    font-size: 1.1rem;
    line-height: 1.8;
    margin: 2rem 0;
    color: #333;
  }

  .deadline-highlight {
    font-size: 1.1rem;
    color: #c62828;
    margin: 1rem 0;
    line-height: 1.8;
  }

  @media (max-width: 768px) {
    .closing-message,
    .deadline-highlight {
      font-size: 1rem;
      padding: 0 1rem;
    }
  }

  #daily-advice-content h3,
  #daily-advice-content > p,
  #daily-advice-content > img {
    text-align: center; /* 見出し、段落、画像のみ中央寄せ */
  }

  #daily-advice-content .custom-ol {
    text-align: left; /* リストは左寄せに */
  }

  .puja-product-image {
    display: block;
    margin: 1rem auto;
  }
</style>