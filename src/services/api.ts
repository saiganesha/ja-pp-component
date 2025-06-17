import { UserFormData, AstrologyBasicData, AppConfig } from '../types';

export const getBasicAstrologyData = async (
  formData: UserFormData,
  config: AppConfig
): Promise<AstrologyBasicData> => {
  const response = await fetch(`${config.apiStreamUrl}/basic-astrology-data`, {
    method: 'POST',
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
    throw new Error('基本占星術データの取得に失敗しました');
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
  config: AppConfig
): Promise<Response> => {
  console.log('Sending chat request to:', `${config.apiStreamUrl}/dl-jyotish-chat`);
  console.log('Request payload:', { conversationId, message, name });

  const response = await fetch(`${config.apiStreamUrl}/dl-jyotish-chat`, {
    method: 'POST',
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