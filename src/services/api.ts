import { UserFormData, AstrologyBasicData, AppConfig } from '../types';

// 利用者にそのまま見せてよい文言を持つエラー。
// これ以外（fetch 自体の失敗など）は英語の内部エラーなので、画面には出さない。
export class ApiError extends Error {}

// 基本占星術データの計算に失敗したとき（このルートは理由を返さず、常に 'Internal Server Error'）。
// 一番多いのは住所から場所を特定できない場合なので、入力し直し方まで案内する。
const BASIC_DATA_FAILED_MESSAGE =
  '占星術データを計算できませんでした。住所から場所を特定できなかった可能性があります。誕生地住所・現在地の住所を「東京都新宿区」のように都道府県と市区町村名で入力し直すか、しばらく時間をおいてもう一度お試しください。';

// 429 で、サーバが日本語の文言を返さなかったとき
const TOO_MANY_REQUESTS_MESSAGE =
  'アクセスが集中しています。しばらく時間をおいて、もう一度お試しください。（429）';

// 日本語（かな・漢字）を含むか
export const hasJapanese = (text: string): boolean => /[\u3040-\u30ff\u4e00-\u9fff]/.test(text);

// サーバの文言を利用者にそのまま見せてよいか。
// 'Internal Server Error' や Heroku の英語のエラーページは見せない。
const isShowableServerText = (text: unknown): text is string =>
  typeof text === 'string' &&
  text.trim() !== '' &&
  text.trim().length <= 300 &&
  hasJapanese(text) &&
  !text.includes('<');

/**
 * 失敗したレスポンスから、利用者に見せられるサーバの文言を取り出す。
 * JSON の {error} / {message} のうち見せてよい最初のもの、または本文そのもの。
 * 見せてよいものが無ければ空文字を返す。
 */
export const readServerMessage = async (response: Response): Promise<string> => {
  let text = '';
  try {
    text = await response.text();
  } catch {
    return '';
  }
  let candidates: unknown[] = [text];
  try {
    const body = JSON.parse(text);
    candidates = [body?.error, body?.message];
  } catch {
    // JSON でなければ本文そのもの
  }
  const message = candidates.find(isShowableServerText);
  return message ? message.trim() : '';
};

/**
 * 失敗したレスポンス（2xx 以外）で利用者に出す文言。
 * サーバの日本語の文言があればそれを、無ければ状態に合わせた文言を返す。
 */
export const describeHttpError = async (response: Response, on500?: string): Promise<string> => {
  const serverMessage = await readServerMessage(response);
  if (serverMessage) {
    return serverMessage;
  }
  if (response.status === 429) {
    return TOO_MANY_REQUESTS_MESSAGE;
  }
  if (response.status === 500 && on500) {
    return on500;
  }
  return `サーバーでエラーが発生しました（${response.status}）。しばらく時間をおいて、もう一度お試しください。`;
};

export const getBasicAstrologyData = async (
  formData: UserFormData,
  config: AppConfig,
  signal?: AbortSignal
): Promise<AstrologyBasicData> => {
  const response = await fetch(`${config.apiStreamUrl}/basic-astrology-data`, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      year: parseInt(formData.birthYear),
      month: parseInt(formData.birthMonth),
      day: parseInt(formData.birthDay),
      hour: parseInt(formData.birthTime.split(':')[0]),
      min: parseInt(formData.birthTime.split(':')[1]),
      birthPlace: formData.birthPlace,
      currentPlace: formData.currentPlace,
    }),
  });

  if (!response.ok) {
    throw new ApiError(await describeHttpError(response, BASIC_DATA_FAILED_MESSAGE));
  }

  return response.json();
};

export const createStreamUrl = (formData: UserFormData, config: AppConfig): string => {
  const params = new URLSearchParams({
    functionName: config.functionName,
    year: formData.birthYear,
    month: formData.birthMonth,
    day: formData.birthDay,
    hour: formData.birthTime.split(':')[0],
    min: formData.birthTime.split(':')[1],
    birthAddress: formData.birthPlace,
    currentAddress: formData.currentPlace,
    productId: config.pid,
    categoryId: config.categoryId,
    name: formData.name,
    astrologyLevel: formData.astrologyLevel,
    fortuneCategory: formData.fortuneCategory,
    specificQuestion: formData.specificQuestion,
  });

  return `${config.apiStreamUrl}/dl-jyotish-advice-stream?${params.toString()}`;
};

export const sendChatMessage = async (
  conversationId: string,
  message: string,
  name: string,
  config: AppConfig,
  signal?: AbortSignal
): Promise<Response> => {
  console.log('Sending chat request to:', `${config.apiStreamUrl}/dl-jyotish-chat`);
  console.log('Request payload:', { conversationId, message, name });

  const response = await fetch(`${config.apiStreamUrl}/dl-jyotish-chat`, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      conversationId,
      message,
      name,
    }),
  });

  console.log('Chat response status:', response.status);
  console.log('Chat response headers:', response.headers);

  return response;
};