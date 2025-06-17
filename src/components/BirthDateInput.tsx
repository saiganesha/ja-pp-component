import React from 'react';

interface BirthDateInputProps {
  year: string;
  month: string;
  day: string;
  onYearChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onDayChange: (value: string) => void;
}

const BirthDateInput: React.FC<BirthDateInputProps> = ({
  year,
  month,
  day,
  onYearChange,
  onMonthChange,
  onDayChange,
}) => {
  return (
    <div className="mb-4">
      <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
        <i className="fas fa-calendar-alt w-5 text-center text-blue-500 mr-2"></i>
        生年月日:
      </label>
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="number"
            placeholder="年"
            value={year}
            onChange={(e) => onYearChange(e.target.value)}
            min="1900"
            max="9999"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
          <span className="text-sm text-gray-500 ml-1">年</span>
        </div>
        <div className="flex-1">
          <input
            type="number"
            placeholder="月"
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            min="1"
            max="12"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
          <span className="text-sm text-gray-500 ml-1">月</span>
        </div>
        <div className="flex-1">
          <input
            type="number"
            placeholder="日"
            value={day}
            onChange={(e) => onDayChange(e.target.value)}
            min="1"
            max="31"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
          />
          <span className="text-sm text-gray-500 ml-1">日</span>
        </div>
      </div>
    </div>
  );
};

export default BirthDateInput;