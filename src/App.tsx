import React, { useState, useEffect, useRef } from 'react';
import { getUrlParams } from './utils/urlParams';
import { getBasicAstrologyData, createStreamUrl, sendChatMessage, describeHttpError, hasJapanese, ApiError } from './services/api';
import { watchIdle } from './utils/idleWatchdog';
import { UserFormData, AstrologyBasicData, Message, StreamResponse, AppConfig } from './types';
import ConsultationForm from './components/ConsultationForm';
import MessageBubble from './components/MessageBubble';
import ChatForm from './components/ChatForm';
import CountdownTimer from './components/CountdownTimer';
import LoadingSpinner from './components/LoadingSpinner';

// 以下は鑑定が届かなかったときに出す文言。鑑定には 1〜2 分かかり、その間に画面を離れたり
// 電波が切れたりすると iOS Safari は通信を落とす（fetch は "Load failed"、EventSource は onerror）。

// 通信そのものが失敗した（fetch・読み取りの失敗、75 秒なにも届かず打ち切った）うえ、本文が 1 文字も届いていないとき。
// Heroku の router のエラーページ（H12 などの 503）は CORS ヘッダが無いので、これも fetch の失敗として届く。
// 利用者の電波のせいとは限らないので、サーバーに接続できなかった場合も含めた文言にしてある。
const CONNECTION_LOST_MESSAGE =
  '通信が途切れたか、サーバーに接続できなかったため、鑑定結果を受け取れませんでした。電波の良い場所で、画面を開いたまま、少し時間をおいてもう一度お試しください。';
const CHAT_CONNECTION_LOST_MESSAGE =
  '通信が途切れたか、サーバーに接続できなかったため、回答を受け取れませんでした。電波の良い場所で、画面を開いたまま、少し時間をおいてもう一度お試しください。';

// 鑑定の通信が閉じた（EventSource の onerror・終わりの合図）のに、本文が 1 文字も届いていないとき。
// EventSource は HTTP の状態も本文も読めないので、通信断とサーバ側の失敗のどちらでも通じる文言にしてある。
// 住所は鑑定の前に基本占星術データの取得で確かめ済みなので、ここでは住所に触れない。
const STREAM_NO_CONTENT_MESSAGE =
  '鑑定結果を受け取れませんでした。電波の良い場所で、鑑定が終わるまで画面を開いたまま、少し時間をおいてもう一度お試しください。';
const CHAT_STREAM_NO_CONTENT_MESSAGE =
  '回答を受け取れませんでした。電波の良い場所で、画面を開いたまま、少し時間をおいてもう一度お試しください。';

// 本文の途中で切れたとき、届いた本文は残して吹き出しの末尾に添える
const CUT_OFF_NOTICE =
  '（通信が途中で途切れました。電波の良い場所で、画面を開いたままもう一度お試しください。）';

// サーバの type:'error' が英語だったとき（'An error occurred while processing your request.' など）の代わり。
// 日本語ならそのまま出す。
const ERROR_FRAME_MESSAGE =
  '鑑定に必要な占星術データを計算できませんでした。生年月日・誕生時間・誕生地住所（「東京都新宿区」のように都道府県と市区町村名）をご確認のうえ、もう一度お試しください。それでも表示されない場合は、しばらく時間をおいてお試しください。';
const CHAT_ERROR_FRAME_MESSAGE =
  'エラーが発生しました。しばらく時間をおいて、もう一度お試しください。';

function App() {
  const urlParamsResult = getUrlParams();
  const [config] = useState<AppConfig>(urlParamsResult);
  const [paramsError] = useState(urlParamsResult.error);
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
  // 鑑定が始まらなかった・結果が届かなかった理由（フォームの下に出す）
  const [submitError, setSubmitError] = useState('');
  // 吹き出しでエラーや知らせを出した回数。増えたらそこまでスクロールする
  const [noticeCount, setNoticeCount] = useState(0);
  // いま画面に書いてよい通信の番号。新しい通信を始めるたびに増やし、古い通信の後始末
  // （完了・途切れ・エラー）が新しい通信の吹き出しや読み込み表示を書き換えないようにする
  const requestIdRef = useRef(0);
  // いま走っている通信とその見張りを止める（新しい通信を始めるとき・画面を閉じるとき）
  const cancelRequestRef = useRef<(() => void) | null>(null);
  const submitErrorRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  // 理由を出したら、そこまでスクロールして必ず目に入るようにする
  useEffect(() => {
    if (submitError) {
      submitErrorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [submitError]);

  // 吹き出しでエラーや知らせを出したときも同じようにスクロールする。
  // 本文が流れてくる間はスクロールしない（読んでいる位置を動かさない）
  useEffect(() => {
    if (!noticeCount) return;
    const lastBubble = messagesRef.current?.lastElementChild;
    const notice = lastBubble?.querySelector('[data-notice]');
    if (notice) {
      notice.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (lastBubble) {
      // エラーは吹き出しの末尾にある（本文の後に【エラー】が続くこともある）。
      // 画面に収まらない長さなら末尾を見せる
      const fits = lastBubble.getBoundingClientRect().height < window.innerHeight;
      lastBubble.scrollIntoView({ behavior: 'smooth', block: fits ? 'center' : 'end' });
    }
  }, [noticeCount]);

  // 新しい通信を始める。走っている通信は止め、その後始末が画面に届かないようにする。
  // 返す関数は、その通信がまだ画面に書いてよい（いちばん新しい）通信かどうか
  const beginRequest = (): (() => boolean) => {
    cancelRequestRef.current?.();
    cancelRequestRef.current = null;
    const requestId = ++requestIdRef.current;
    return () => requestIdRef.current === requestId;
  };

  // 吹き出しでエラーを知らせる
  const pushErrorBubble = (content: string) => {
    setMessages(prev => [...prev, {
      type: 'ai',
      content,
      timestamp: new Date(),
    }]);
    setNoticeCount(count => count + 1);
  };

  // 終わりの合図を受け取らずに切れた吹き出しに、切れたことの知らせを添える。
  // 本文の HTML とは別に表示するので、本文がタグの途中で切れていても知らせは消えない
  const markCutOff = () => {
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (!last || last.type !== 'ai') return prev;
      return [...prev.slice(0, -1), { ...last, notice: CUT_OFF_NOTICE }];
    });
    setNoticeCount(count => count + 1);
  };

  const handleFormSubmit = async (formData: UserFormData) => {
    const isCurrent = beginRequest();
    setFormDisabled(true);
    setLoading(true);
    setSubmitError('');
    setMessages([]);
    setBasicData(null);
    setShowChatForm(false);
    setConversationId(null);
    setWaitingForResponse(false);
    // 追加の質問の途中から始めた場合も、その読み込み表示を残さない
    setStreaming(false);
    setChatLoading(false);
    setUserName(formData.name);

    // 75 秒たっても応答が無ければ打ち切る（下の catch で通信が途切れたとして扱う）
    const controller = new AbortController();
    const watchdog = watchIdle(() => controller.abort());
    cancelRequestRef.current = () => {
      watchdog.stop();
      controller.abort();
    };

    try {
      // 基本占星術データを取得
      const basicAstrologyData = await getBasicAstrologyData(formData, config, controller.signal);
      watchdog.stop();
      if (!isCurrent()) return;
      setBasicData(basicAstrologyData);
      setLoading(false);
      setWaitingForResponse(true);

      // ストリーミング開始
      startStreaming(formData, isCurrent);
    } catch (error) {
      watchdog.stop();
      // 新しい鑑定を始めたので止めた通信。何も書かない
      if (!isCurrent()) return;
      console.error('Error:', error);
      setSubmitError(error instanceof ApiError ? error.message : CONNECTION_LOST_MESSAGE);
      setFormDisabled(false);
      setLoading(false);
      setWaitingForResponse(false);
    }
  };

  const startStreaming = (formData: UserFormData, isCurrent: () => boolean) => {
    const streamUrl = createStreamUrl(formData, config);
    // この鑑定で届いた本文
    let content = '';
    // この鑑定が終わったか（終わりの合図・サーバのエラー・途切れ・打ち切りのどれか）。
    // 終わった後は、届いたもの・通信が閉じたこと・見張りの打ち切りのどれにも何もしない
    // （エラーの吹き出しを後から届いた本文で上書きしない。終わった鑑定に「途切れた」と出さない）
    let finished = false;

    setStreaming(true);

    const eventSource = new EventSource(streamUrl);
    // 75 秒なにも届かなければ（keepalive も来なければ）通信が死んでいる。打ち切って知らせる
    const watchdog = watchIdle(() => fail(CONNECTION_LOST_MESSAGE));
    cancelRequestRef.current = () => {
      watchdog.stop();
      eventSource.close();
    };

    // 通信を閉じて読み込み表示を消す。自動で再接続させない（同じ鑑定を最初からやり直してしまう）。
    // 終わりの合図の後でサーバが通信を閉じずにいても、閉じるのを待たずにここで終える。
    // 既に終わっていれば何もせず false を返す
    const finish = (): boolean => {
      if (finished) return false;
      finished = true;
      watchdog.stop();
      eventSource.close();
      setStreaming(false);
      setWaitingForResponse(false);
      setFormDisabled(false);
      return true;
    };

    // 終わりの合図 [DONE] を受け取らずに終わった。届いた本文は残して知らせを添え、
    // 1 文字も届いていなければ理由を出す
    const fail = (noContentMessage: string) => {
      if (!finish()) return;
      if (content.trim()) {
        markCutOff();
      } else {
        setSubmitError(noContentMessage);
      }
    };

    // 終わりの合図 [DONE] を受け取った
    const complete = (endConversationId?: string) => {
      if (!finish()) return;
      console.log('Streaming completed');
      // 本文が 1 文字も無いまま終わった。鑑定できたように見せない
      if (!content.trim()) {
        setSubmitError(STREAM_NO_CONTENT_MESSAGE);
        return;
      }

      if (endConversationId) {
        setConversationId(endConversationId);
        setShowChatForm(true);
      }

      // 最終メッセージを追加
      const finalContent = content;
      setMessages(prev => [
        ...prev.slice(0, -1), // 最後のストリーミングメッセージを削除
        {
          type: 'ai',
          content: finalContent,
          timestamp: new Date(),
        }
      ]);
    };

    eventSource.onopen = () => {
      if (isCurrent()) watchdog.reset();
    };

    eventSource.onmessage = (event) => {
      // 新しい通信を始めたので止めた鑑定か、もう終わった鑑定（エラーの吹き出しを出した後の本文も読まない）
      if (!isCurrent() || finished) return;
      // keepalive も含め、何か届いている間は通信が生きている
      watchdog.reset();

      // 終わりの合図だけの行（data: [DONE]）。追加の質問と同じく正常な終わりとして扱う
      if (event.data.trim() === '[DONE]') {
        complete();
        return;
      }

      try {
        const data: StreamResponse = JSON.parse(event.data);

        if (data.type === 'end') {
          if (data.status === '[DONE]') {
            // サーバは鑑定文を生成できなかったとき、【エラー】の文言を本文として流し、
            // 会話 ID を載せない終わりの合図を送る。そのエラーが目に入るようにする
            if (!data.conversationId && content.trim()) {
              setNoticeCount(count => count + 1);
            }
            complete(data.conversationId);
          } else {
            // [DONE] 以外の終わり（'ERROR' など）は失敗
            console.error('Streaming ended with status:', data.status);
            fail(STREAM_NO_CONTENT_MESSAGE);
          }
        } else if (data.type === 'message') {
          content += data.content || '';
          // 中身の無い本文（Dify が空の answer を返したとき）では空の吹き出しを作らない
          if (!content.trim()) return;
          setWaitingForResponse(false);

          const streamedContent = content;
          setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages.length > 0 && newMessages[newMessages.length - 1].type === 'ai') {
              // 既存のストリーミングメッセージを更新
              newMessages[newMessages.length - 1] = {
                type: 'ai',
                content: streamedContent,
                timestamp: new Date(),
              };
            } else {
              // 新しいストリーミングメッセージを追加
              newMessages.push({
                type: 'ai',
                content: streamedContent,
                timestamp: new Date(),
              });
            }
            return newMessages;
          });
        } else if (data.type === 'error') {
          console.error('Error from server:', data.message);
          // サーバはエラーを送ったら閉じる。閉じるのを待たずにここで終え、この後に届くものは読まない
          finish();
          pushErrorBubble(
            data.message && hasJapanese(data.message) ? `エラーが発生しました: ${data.message}` : ERROR_FRAME_MESSAGE
          );
        }
      } catch (error) {
        console.error('Error parsing message data:', error);
      }
    };

    eventSource.onerror = (event) => {
      if (!isCurrent()) {
        eventSource.close();
        return;
      }
      console.error('EventSource error:', event);
      // end が来ないまま切れた。サーバ側の失敗（ヘッダ前の 500・400・H12 の 503）も、
      // 画面を離れた・電波が切れた場合もここに来るが、EventSource では見分けられない。
      fail(STREAM_NO_CONTENT_MESSAGE);
    };
  };

  const handleChatMessage = async (message: string) => {
    if (!conversationId) {
      console.error('No conversation ID available');
      alert('会話IDが見つかりません。最初の鑑定を完了してから質問してください。');
      return;
    }

    console.log('Sending chat message:', { conversationId, message });
    const isCurrent = beginRequest();

    // ユーザーメッセージを追加
    setMessages(prev => [...prev, {
      type: 'user',
      content: message,
      timestamp: new Date(),
    }]);

    setShowChatForm(false);
    setChatLoading(true);
    // この回答で届いた本文
    let content = '';
    // サーバの終わりの合図（end）を受け取ったか。受け取らずに閉じたら途中で切れている
    let sawEnd = false;
    // end が失敗（[DONE] 以外）なのに、本文に【エラー】の文言が無かった。途中までの回答を完了に見せない
    let endedWithError = false;
    // サーバの type:'error' を表示したか（表示済みなら重ねて知らせない）
    let errorShown = false;
    // 終わりの合図（end・[DONE]）かサーバのエラーを受け取った。そこで読むのをやめ、
    // サーバが通信を閉じるのを待たずに終える。この後に届くものは読まない
    let terminal = false;
    // 通信そのものの失敗（fetch・読み取りの失敗、75 秒なにも届かず打ち切ったとき）
    let failure: unknown = null;

    // 75 秒なにも届かなければ打ち切る。読み取りが AbortError で失敗し、通信が途切れたとして扱われる
    const controller = new AbortController();
    const watchdog = watchIdle(() => controller.abort());
    cancelRequestRef.current = () => {
      watchdog.stop();
      controller.abort();
    };

    try {
      const response = await sendChatMessage(conversationId, message, userName, config, controller.signal);
      watchdog.reset();

      if (!response.ok) {
        // サーバが日本語の文言を返していればそれを出す（429 なら待ち時間入り）
        throw new ApiError(await describeHttpError(response));
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      // 1 回の read() がフレームの切れ目と揃う保証は無い（フレームの途中や、日本語 1 文字の途中でも切れる）。
      // 切れ端は buffer に残して次の read() と繋げ、空行で終わった完全なフレームだけを読む。
      let buffer = '';

      const handleFrame = (frame: string) => {
        // 新しい通信を始めたので止めた回答か、終わりの合図・エラーの後に届いたもの
        // （エラーの吹き出しを後から届いた本文で上書きしない）
        if (!isCurrent() || terminal) return;
        // keepalive もここを通るが、type が message / end / error のどれでもないので何もしない
        const jsonData = frame
          .split('\n')
          .filter(line => line.startsWith('data:'))
          .map(line => line.slice(5).trim())
          .join('\n');
        if (!jsonData) {
          return;
        }
        if (jsonData === '[DONE]') {
          sawEnd = true;
          terminal = true;
          return;
        }

        try {
          const data: StreamResponse = JSON.parse(jsonData);
          
          if (data.type === 'message') {
            content += data.content || '';
            // 中身の無い本文（Dify が空の answer を返したとき）では空の吹き出しを作らない
            if (!content.trim()) return;

            const streamedContent = content;
            setMessages(prev => {
              const newMessages = [...prev];
              if (newMessages.length > 0 && newMessages[newMessages.length - 1].type === 'ai') {
                newMessages[newMessages.length - 1] = {
                  type: 'ai',
                  content: streamedContent,
                  timestamp: new Date(),
                };
              } else {
                newMessages.push({
                  type: 'ai',
                  content: streamedContent,
                  timestamp: new Date(),
                });
              }
              return newMessages;
            });
          } else if (data.type === 'end') {
            sawEnd = true;
            terminal = true;
            if (data.conversationId) {
              setConversationId(data.conversationId);
            }
            if (data.status !== '[DONE]') {
              if (content.includes('【エラー】')) {
                // サーバは回答を生成できなかったとき、【エラー】の文言を本文として流し、
                // status:'ERROR' で終わる。そのエラーが目に入るようにする
                setNoticeCount(count => count + 1);
              } else {
                endedWithError = true;
              }
            }
            // チャットローディングを解除
            setChatLoading(false);
          } else if (data.type === 'error') {
            console.error('Chat stream error:', data.message);
            errorShown = true;
            terminal = true;
            pushErrorBubble(
              data.message && hasJapanese(data.message) ? `エラーが発生しました: ${data.message}` : CHAT_ERROR_FRAME_MESSAGE
            );
          }
        } catch (error) {
          console.error('JSON parse error:', error, 'Raw frame:', frame);
        }
      };

      // buffer から完全なフレームを取り出して読む。flush なら残りも最後のフレームとして読む
      const readFrames = (flush: boolean) => {
        const frames = buffer.replace(/\r\n/g, '\n').split('\n\n');
        buffer = flush ? '' : frames.pop() || '';
        frames.forEach(handleFrame);
      };

      // 読み取りの失敗（通信断・打ち切り）は下の catch で 1 回だけ受け取る
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        // keepalive も含め、何か届いている間は通信が生きている
        watchdog.reset();
        buffer += decoder.decode(value, { stream: true });
        readFrames(false);
        if (terminal) break;
      }

      if (terminal) {
        // 終わりの合図の後でサーバが通信を閉じずにいても待たない。こちらから閉じる
        controller.abort();
      } else {
        // 末尾に空行の無い最後のフレームと、デコーダに残った切れ端も読む
        buffer += decoder.decode();
        readFrames(true);
      }
    } catch (error) {
      failure = error;
    } finally {
      watchdog.stop();
    }

    // 新しい通信を始めたので止めた回答。何も書かない
    if (!isCurrent()) return;
    if (failure) {
      console.error('Chat error:', failure);
    }

    setChatLoading(false);
    setStreaming(false);
    setShowChatForm(true);

    // サーバのエラーを表示済みなら重ねて知らせない
    if (errorShown) return;

    if (!sawEnd || endedWithError) {
      // end を受け取らないまま終わった（通信断・サーバ側の打ち切り・75 秒の無音）か、
      // 【エラー】の文言なしに失敗の end で終わった。
      // 届いた本文は残して知らせを添え、1 文字も届いていなければ理由を吹き出しで出す
      if (content.trim()) {
        markCutOff();
      } else if (failure) {
        pushErrorBubble(failure instanceof ApiError ? failure.message : CHAT_CONNECTION_LOST_MESSAGE);
      } else {
        pushErrorBubble(CHAT_STREAM_NO_CONTENT_MESSAGE);
      }
      return;
    }

    // 終わりの合図は来たのに本文が 1 文字も無い
    if (!content.trim()) {
      pushErrorBubble(CHAT_STREAM_NO_CONTENT_MESSAGE);
      return;
    }

    // 最終メッセージを確定
    const finalContent = content;
    setMessages(prev => [
      ...prev.slice(0, -1),
      {
        type: 'ai',
        content: finalContent,
        timestamp: new Date(),
      }
    ]);
  };

  // 画面を閉じたら、走っている通信と見張りを止める（閉じた後の画面の更新は React が無視する）
  useEffect(() => {
    return () => {
      cancelRequestRef.current?.();
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

  // パラメータエラーの場合はエラー画面を表示
  if (paramsError?.hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl w-full">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-700 mb-4">パラメータエラー</h1>
            <p className="text-gray-700 mb-6">
              必要なURLパラメータが指定されていません。<br />
              正しいリンクからアクセスしてください。
            </p>
            <div className="bg-white rounded p-4 text-left">
              <p className="text-sm font-semibold text-gray-600 mb-2">不足しているパラメータ:</p>
              <ul className="list-disc list-inside text-red-600 text-sm">
                {paramsError.missingParams.map(param => (
                  <li key={param}>{param}</li>
                ))}
              </ul>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              <p>サポートが必要な場合は、管理者にお問い合わせください。</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          {/* 追加の質問の回答を待つ間も押せないようにする（新しい鑑定がその回答と混ざらないように） */}
          <ConsultationForm onSubmit={handleFormSubmit} disabled={formDisabled || chatLoading} />
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

        {/* 鑑定が始まらなかった・結果が届かなかった理由 */}
        {submitError && (
          <div
            ref={submitErrorRef}
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 leading-relaxed"
          >
            {submitError}
          </div>
        )}

        {/* メッセージ表示 */}
        {messages.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="space-y-4" ref={messagesRef}>
              {messages.map((message, index) => (
                <MessageBubble
                  key={index}
                  content={message.content}
                  type={message.type}
                  notice={message.notice}
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