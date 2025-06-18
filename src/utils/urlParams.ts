import { AppConfig } from '../types';

// 固定のAPIエンドポイント
export const API_STREAM_URL = 'https://get-jyotish-advise-89aa13840a57.herokuapp.com';

export interface UrlParamsError {
  hasError: boolean;
  missingParams: string[];
}

export const getUrlParams = (): AppConfig & { error?: UrlParamsError } => {
  const urlParams = new URLSearchParams(window.location.search);
  const missingParams: string[] = [];
  
  // 必須パラメータの取得
  const pid = urlParams.get('pid');
  const categoryId = urlParams.get('categoryId');
  const deadline = urlParams.get('deadline');
  const functionName = urlParams.get('functionName');
  const productName = urlParams.get('productName');
  
  // 必須パラメータのチェック
  if (!pid) missingParams.push('pid');
  if (!categoryId) missingParams.push('categoryId');
  if (!deadline) missingParams.push('deadline');
  if (!functionName) missingParams.push('functionName');
  if (!productName) missingParams.push('productName');
  
  // エラーがある場合はエラー情報を含めて返す
  if (missingParams.length > 0) {
    return {
      pid: pid || '',
      categoryId: categoryId || '',
      deadline: deadline ? new Date(deadline) : new Date(),
      functionName: functionName || '',
      productName: productName || '',
      apiStreamUrl: API_STREAM_URL,
      error: {
        hasError: true,
        missingParams
      }
    };
  }
  
  // 正常な場合
  return {
    pid: pid!,
    categoryId: categoryId!,
    deadline: new Date(deadline!),
    functionName: functionName!,
    productName: productName!,
    apiStreamUrl: API_STREAM_URL
  };
};