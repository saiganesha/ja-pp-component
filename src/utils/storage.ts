import { UserFormData } from '../types';

const STORAGE_KEY = 'astrology_form_data';

export const saveFormData = (data: Partial<UserFormData>): void => {
  const existingData = getFormData();
  const updatedData = { ...existingData, ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
};

export const getFormData = (): Partial<UserFormData> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

export const clearFormData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};