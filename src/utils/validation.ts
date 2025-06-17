import { UserFormData } from '../types';

export const validateForm = (data: UserFormData): string | null => {
  if (!data.name) return 'お名前（ニックネーム）を入力してください';
  if (!data.birthYear || !data.birthMonth || !data.birthDay) return '生年月日を入力してください';
  if (!data.birthPlace) return '誕生地住所を入力してください';
  if (!data.birthTime) return '誕生時間を入力してください';
  if (!data.currentPlace) return '現在地の住所を入力してください';
  if (!data.astrologyLevel) return 'インド占星術の理解度を選択してください';
  if (!data.fortuneCategory) return '鑑定項目を選択してください';
  
  return null;
};

export const formatBirthDate = (year: string, month: string, day: string): string => {
  const paddedMonth = month.padStart(2, '0');
  const paddedDay = day.padStart(2, '0');
  return `${year}-${paddedMonth}-${paddedDay}`;
};