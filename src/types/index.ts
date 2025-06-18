export interface UserFormData {
  name: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  birthPlace: string;
  birthTime: string;
  currentPlace: string;
  astrologyLevel: string;
  fortuneCategory: string;
  specificQuestion: string;
}

export interface AstrologyBasicData {
  ascendant: string;
  sign: string;
  nakshatra: string;
}

export interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface AppConfig {
  pid: string;
  categoryId: string;
  deadline: Date;
  functionName: string;
  productName: string;
  apiStreamUrl: string;
  error?: {
    hasError: boolean;
    missingParams: string[];
  };
}

export interface StreamResponse {
  type: 'message' | 'end' | 'error';
  content?: string;
  status?: string;
  conversationId?: string;
  message?: string;
}