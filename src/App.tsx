import React, { useState, useEffect, useRef } from 'react';
import { getUrlParams } from './utils/urlParams';
import { getBasicAstrologyData, createStreamUrl, sendChatMessage } from './services/api';
import { UserFormData, AstrologyBasicData, Message, StreamResponse, AppConfig } from './types';
import ConsultationForm from './components/ConsultationForm';
import MessageBubble from './components/MessageBubble';
import ChatForm from './components/ChatForm';
import CountdownTimer from './components/CountdownTimer';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [config] = useState<AppConfig>(getUrlParams());
  const [basicData, setBasicData] = useState<AstrologyBasicData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [waitingForResponse, setWaitingForResponse] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showChatForm, setShowChatForm] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [chatLoading, setChatLoading] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const streamingMessageRef = useRef<string>('');

  const handleFormSubmit = async (formData: UserFormData) => {
    setFormDisabled(true);
    setLoading(true);
    setMessages([]);
    setBasicData(null);
    setShowChatForm(false);
    setConversationId(null);
    setWaitingForResponse(false);
    setUserName(formData.name);

    try {
      // 基本占星術データを取得
      const basicAstrologyData = await getBasicAstrologyData(formData, config);
      setBasicData(basicAstrologyData);
      setLoading(false);
      setWaitingForResponse(true);

      // ストリーミング開始
      startStreaming(formData);
    } catch (error) {
      console.error('Error:', error);
      alert('エラーが発生しました。もう一度お試しください。');
      setFormDisabled(false);
      setLoading(false);
      setWaitingForResponse(false);
    }
  };

  const startStreaming = (formData: UserFormData) => {
    const streamUrl = createStreamUrl(formData, config);
    streamingMessageRef.current = '';
    
    setStreaming(true);

    const eventSource = new EventSource(streamUrl);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data: StreamResponse = JSON.parse(event.data);

        if (data.type === 'end' && data.status === '[DONE]') {
          console.log('Streaming completed');
          eventSource.close();
          setStreaming(false);
          setWaitingForResponse(false);
          setFormDisabled(false);

          if (data.conversationId) {
            setConversationId(data.conversationId);
            setShowChatForm(true);
          }

          // 最終メッセージを追加
          if (streamingMessageRef.current) {
            setMessages(prev => [
              ...prev.slice(0, -1), // 最後のストリーミングメッセージを削除
              {
                type: 'ai',
                content: streamingMessageRef.current,
                timestamp: new Date(),
              }
            ]);
          }
        } else if (data.type === 'message') {
          setWaitingForResponse(false);
          streamingMessageRef.current += data.content || '';
          
          setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages.length > 0 && newMessages[newMessages.length - 1].type === 'ai') {
              // 既存のストリーミングメッセージを更新
              newMessages[newMessages.length - 1] = {
                type: 'ai',
                content: streamingMessageRef.current,
                timestamp: new Date(),
              };
            } else {
              // 新しいストリーミングメッセージを追加
              newMessages.push({
                type: 'ai',
                content: streamingMessageRef.current,
                timestamp: new Date(),
              });
            }
            return newMessages;
          });
        } else if (data.type === 'error') {
          console.error('Error from server:', data.message);
          setWaitingForResponse(false);
          setMessages(prev => [...prev, {
            type: 'ai',
            content: `エラーが発生しました: ${data.message}`,
            timestamp: new Date(),
          }]);
        }
      } catch (error) {
        console.error('Error parsing message data:', error);
      }
    };

    eventSource.onerror = (event) => {
      console.error('EventSource error:', event);
      setStreaming(false);
      setWaitingForResponse(false);
      setFormDisabled(false);
      eventSource.close();
    };
  };

  const handleChatMessage = async (message: string) => {
    if (!conversationId) {
      console.error('No conversation ID available');
      alert('会話IDが見つかりません。最初の鑑定を完了してから質問してください。');
      return;
    }

    console.log('Sending chat message:', { conversationId, message });

    // ユーザーメッセージを追加
    setMessages(prev => [...prev, {
      type: 'user',
      content: message,
      timestamp: new Date(),
    }]);

    setShowChatForm(false);
    setChatLoading(true);
    streamingMessageRef.current = '';

    try {
      const response = await sendChatMessage(conversationId, message, userName, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const readStream = async (): Promise<void> => {
        try {
          const { done, value } = await reader.read();
          
          if (done) {
            setStreaming(false);
            setShowChatForm(true);
            
            // 最終メッセージを確定
            if (streamingMessageRef.current) {
              setMessages(prev => [
                ...prev.slice(0, -1),
                {
                  type: 'ai',
                  content: streamingMessageRef.current,
                  timestamp: new Date(),
                }
              ]);
            }
            return;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          lines.forEach(line => {
            if (line.startsWith('data: ')) {
              try {
                const jsonData = line.slice(6).trim();
                if (jsonData === '[DONE]') {
                  return;
                }
                
                const data: StreamResponse = JSON.parse(jsonData);
                
                if (data.type === 'message') {
                  streamingMessageRef.current += data.content || '';
                  
                  setMessages(prev => {
                    const newMessages = [...prev];
                    if (newMessages.length > 0 && newMessages[newMessages.length - 1].type === 'ai') {
                      newMessages[newMessages.length - 1] = {
                        type: 'ai',
                        content: streamingMessageRef.current,
                        timestamp: new Date(),
                      };
                    } else {
                      newMessages.push({
                        type: 'ai',
                        content: streamingMessageRef.current,
                        timestamp: new Date(),
                      });
                    }
                    return newMessages;
                  });
                } else if (data.type === 'end') {
                  if (data.conversationId) {
                    setConversationId(data.conversationId);
                  }
                  // チャットローディングを解除
                  setChatLoading(false);
                } else if (data.type === 'error') {
                  console.error('Chat stream error:', data.message);
                  setMessages(prev => [...prev, {
                    type: 'ai',
                    content: `エラーが発生しました: ${data.message}`,
                    timestamp: new Date(),
                  }]);
                }
              } catch (error) {
                console.error('JSON parse error:', error, 'Raw line:', line);
              }
            }
          });

          await readStream();
        } catch (error) {
          console.error('Stream reading error:', error);
          throw error;
        }
      };

      await readStream();
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'エラーが発生しました。しばらく時間をおいてから再度お試しください。',
        timestamp: new Date(),
      }]);
      setChatLoading(false);
      setStreaming(false);
      setShowChatForm(true);
    }
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const createCtaButton = () => (
    <div className="text-center my-6">
      <a
        href={`https://sitarama.jp/?pid=${config.pid}`}
        className="inline-block px-8 py-4 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {config.productName}にお申し込みする
      </a>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <img
            src="https://img02.shop-pro.jp/PA01008/381/etc_base64/anlvdGlzaF9hZHZpc29y.jpeg?cmsp_timestamp=20250119161541"
            alt="ジョーティッシュ・アドバイザー、インド占星術鑑定"
            className="max-w-full h-auto mx-auto mb-4 rounded-lg"
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            無料のインド占星術鑑定で、プージャーの効果とあなたの未来をチェック
          </h1>
          <div className="text-gray-600 leading-relaxed space-y-4">
            <p>
              「<span className="font-semibold text-blue-600">{config.productName}</span>」を受けることで、<br />
              あなたの運命にどのように作用するのか？<br />
              古代インドの叡智、ジョーティッシュ（インド占星術）を活用して無料で確かめてみませんか？
            </p>
            <p>
              あなたのホロスコープから<strong>プージャーがもたらす影響</strong>を具体的に読み解き、<br />
              より良い未来に向けたアドバイスを提供いたします。
            </p>
          </div>
        </div>

        {/* サービス説明 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <ol className="space-y-6 text-gray-700">
            <li>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">1. 基本情報の入力</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>お名前（ニックネーム）</li>
                <li>生年月日と誕生時間</li>
                <li>誕生地と現在地の住所</li>
                <li>インド占星術の理解度</li>
                <li>ご希望の鑑定項目</li>
              </ul>
            </li>
            <li>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">2. ジョーティッシュによる詳細分析</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>グラハ（惑星）の配置とアスペクトを徹底解析</li>
                <li>マハーダシャー（大運）とアンタルダシャー（小運）の影響</li>
                <li>ゴーチャラ（惑星の運行）から見る運命のタイミング</li>
                <li>ヨーガ（惑星の組み合わせ）やナクシャトラ（月宿）が示す才能や強み</li>
                <li><span className="font-semibold text-blue-600">{config.productName}</span>の効果が高まる時期の把握</li>
              </ul>
            </li>
            <li>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">3. 実践的なアドバイス提供</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>プージャー効果を最大化するための具体的な行動プラン</li>
                <li>これから訪れるチャンスと課題の詳細な解説</li>
                <li>問題が表面化しやすい時期の対処法と最適なタイミング</li>
                <li>星の後押しを受けやすい時期を活かすヒント</li>
              </ul>
            </li>
          </ol>
          
          <div className="mt-6 text-center">
            <p className="text-gray-700 mb-2">
              5000年以上の歴史を持つジョーティッシュで、<br />
              <span className="font-semibold text-blue-600">{config.productName}</span>の神聖なパワーを知り、<br />
              あなたの人生をより良い方向へ導く準備を整えてみましょう。
            </p>
            <p className="text-blue-600 font-semibold bg-blue-50 p-3 rounded-lg">
              ※ このインド占星術鑑定は無料でご利用いただけます
            </p>
          </div>
        </div>

        {/* フォーム */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <ConsultationForm onSubmit={handleFormSubmit} disabled={formDisabled} />
        </div>

        {/* 基本占星術データ表示 */}
        {basicData && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-blue-800">あなたのアセンダント: {basicData.ascendant}</p>
            <p className="text-blue-800">あなたの月の星座（ラーシ）: {basicData.sign}</p>
            <p className="text-blue-800">あなたの月のナクシャトラ: {basicData.nakshatra}</p>
          </div>
        )}

        {/* ローディング */}
        {loading && <LoadingSpinner />}

        {/* 鑑定中表示 */}
        {waitingForResponse && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <div className="text-lg text-gray-700">
                <span className="font-semibold text-blue-600">鑑定中</span>
                <span className="ml-2">あなたのホロスコープを詳しく分析しています...</span>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>古代インドの叡智に基づいて、あなたの運命を読み解いています</p>
              <p>しばらくお待ちください</p>
            </div>
          </div>
        )}

        {/* メッセージ表示 */}
        {messages.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <MessageBubble
                  key={index}
                  content={message.content}
                  type={message.type}
                  isStreaming={streaming && index === messages.length - 1 && message.type === 'ai'}
                />
              ))}
            </div>

            {/* カウントダウン＆CTAボタン */}
            {!streaming && messages.length > 0 && (
              <>
                <CountdownTimer deadline={config.deadline} />
                {createCtaButton()}
              </>
            )}
          </div>
        )}

        {/* チャット用ローディング */}
        {chatLoading && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <div className="text-lg text-gray-700">
                <span className="font-semibold text-blue-600">追加の鑑定中</span>
                <span className="ml-2">あなたの質問に対する宇宙の答えを読み解いています...</span>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>インド占星術の叡智に基づいて、さらに深い洞察をお届けします</p>
            </div>
          </div>
        )}

        {/* チャットフォーム */}
        {showChatForm && !streaming && !chatLoading && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <ChatForm onSendMessage={handleChatMessage} disabled={streaming || chatLoading} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;