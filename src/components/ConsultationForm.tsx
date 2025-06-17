import React, { useState, useEffect } from 'react';
import { UserFormData } from '../types';
import { saveFormData, getFormData, clearFormData } from '../utils/storage';
import { validateForm } from '../utils/validation';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import BirthDateInput from './BirthDateInput';

interface ConsultationFormProps {
  onSubmit: (data: UserFormData) => void;
  disabled?: boolean;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({ onSubmit, disabled = false }) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthPlace: '',
    birthTime: '',
    currentPlace: '',
    astrologyLevel: '',
    fortuneCategory: '',
    specificQuestion: '',
  });
  const [saveInput, setSaveInput] = useState(false);
  const [showSpecificQuestion, setShowSpecificQuestion] = useState(false);

  useEffect(() => {
    const savedData = getFormData();
    setFormData(prev => ({ ...prev, ...savedData }));
  }, []);

  useEffect(() => {
    setShowSpecificQuestion(formData.fortuneCategory !== '');
  }, [formData.fortuneCategory]);

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (saveInput) {
      saveFormData({ [field]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm(formData);
    if (validationError) {
      alert(validationError);
      return;
    }

    if (saveInput) {
      saveFormData(formData);
    }

    onSubmit(formData);
  };

  const handleClear = () => {
    clearFormData();
    setFormData({
      name: '',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      birthPlace: '',
      birthTime: '',
      currentPlace: '',
      astrologyLevel: '',
      fortuneCategory: '',
      specificQuestion: '',
    });
  };

  const astrologyLevelOptions = [
    { value: '1', label: 'はじめて - 占星術の専門用語は使わず、わかりやすく解説してほしい' },
    { value: '2', label: '少し知っている - 基本的な用語を交えながら解説してほしい' },
    { value: '3', label: '詳しい - 専門的な用語を使って詳しく解説してほしい' },
  ];

  const fortuneCategoryOptions = [
    { value: '1', label: '総合運について: 全体的な運勢の流れ、幸運期、注意点などを占います。' },
    { value: '2', label: '恋愛運について: 出会い、片思い、パートナーとの関係、結婚などを占います。' },
    { value: '3', label: '仕事運について: 転職、昇進、人間関係、適職などを占います。' },
    { value: '4', label: '金運について: 収入、貯蓄、投資、浪費傾向などを占います。' },
    { value: '5', label: '健康運について: 体調、病気、怪我、メンタルヘルスなどを占います。' },
    { value: '6', label: '家庭運について: 家族関係、引っ越し、不動産購入などを占います。' },
    { value: '7', label: '対人運について: 友人関係、職場の人間関係、トラブルなどを占います。' },
    { value: '8', label: '学業運について: 試験、受験、進路、学習方法などを占います。' },
    { value: '9', label: '旅行運について: 国内旅行、海外旅行、レジャー、アクシデントなどを占います。' },
    { value: '10', label: '運気アップ方法について: 具体的な開運アクション、ラッキーアイテムなどを占います。' },
    { value: '11', label: 'ダシャーについて: インド占星術の時期区分システムによる運命の流れと転機を占います。' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        id="name"
        label="お名前（ニックネーム）"
        type="text"
        value={formData.name}
        onChange={(value) => handleInputChange('name', value)}
        required
        placeholder="お名前（ニックネーム）を入力"
        icon="fas fa-user"
      />

      <BirthDateInput
        year={formData.birthYear}
        month={formData.birthMonth}
        day={formData.birthDay}
        onYearChange={(value) => handleInputChange('birthYear', value)}
        onMonthChange={(value) => handleInputChange('birthMonth', value)}
        onDayChange={(value) => handleInputChange('birthDay', value)}
      />

      <FormInput
        id="birthPlace"
        label="誕生地住所"
        type="text"
        value={formData.birthPlace}
        onChange={(value) => handleInputChange('birthPlace', value)}
        required
        placeholder="誕生地住所を入力"
        icon="fas fa-map-marker-alt"
      />

      <FormInput
        id="birthTime"
        label="誕生時間"
        type="time"
        value={formData.birthTime}
        onChange={(value) => handleInputChange('birthTime', value)}
        required
        icon="fas fa-clock"
      />

      <FormInput
        id="currentPlace"
        label="現在地の住所"
        type="text"
        value={formData.currentPlace}
        onChange={(value) => handleInputChange('currentPlace', value)}
        required
        placeholder="現在地の住所を入力"
        icon="fas fa-home"
      />

      <FormSelect
        id="astrologyLevel"
        label="インド占星術の理解度"
        value={formData.astrologyLevel}
        onChange={(value) => handleInputChange('astrologyLevel', value)}
        options={astrologyLevelOptions}
        required
        icon="fas fa-star"
      />

      <FormSelect
        id="fortuneCategory"
        label="鑑定項目"
        value={formData.fortuneCategory}
        onChange={(value) => handleInputChange('fortuneCategory', value)}
        options={fortuneCategoryOptions}
        required
        icon="fas fa-magic"
      />

      {showSpecificQuestion && (
        <div className="mb-4">
          <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
            <i className="fas fa-comment-dots w-5 text-center text-blue-500 mr-2"></i>
            具体的な質問内容:
          </label>
          <textarea
            value={formData.specificQuestion}
            onChange={(e) => handleInputChange('specificQuestion', e.target.value)}
            placeholder="選択した鑑定項目について、具体的に知りたいことがありましたら入力してください。(2000文字以内)"
            maxLength={2000}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-none"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.specificQuestion.length} / 2000
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={saveInput}
            onChange={(e) => setSaveInput(e.target.checked)}
            className="mr-2"
          />
          入力情報を保存する
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 py-3 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          クリア
        </button>
        <button
          type="submit"
          disabled={disabled}
          className="flex-1 py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          送信
        </button>
      </div>
    </form>
  );
};

export default ConsultationForm;