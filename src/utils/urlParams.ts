import { AppConfig } from '../types';

export const getUrlParams = (): AppConfig => {
  const urlParams = new URLSearchParams(window.location.search);
  
  // デフォルト値
  const defaults = {
    pid: '134061458',
    categoryId: '2018040',
    deadline: new Date('2025-08-05T18:00:00'),
    functionName: 'Puja20241203',
    productName: 'ヴァラ・ラクシュミー・ヴラタ・プージャー',
    apiStreamUrl: 'https://get-jyotish-advise-89aa13840a57.herokuapp.com'
  };

  return {
    pid: urlParams.get('pid') || defaults.pid,
    categoryId: urlParams.get('categoryId') || defaults.categoryId,
    deadline: urlParams.get('deadline') ? new Date(urlParams.get('deadline')!) : defaults.deadline,
    functionName: urlParams.get('functionName') || defaults.functionName,
    productName: urlParams.get('productName') || defaults.productName,
    apiStreamUrl: urlParams.get('apiStreamUrl') || defaults.apiStreamUrl
  };
};