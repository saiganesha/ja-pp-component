import React, { useState } from 'react';

interface ChatFormProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatForm: React.FC<ChatFormProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const maxLength = 2000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">追加の質問</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="他に何か聞きたいことがありますか？"
          maxLength={maxLength}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-none"
          disabled={disabled}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            {message.length} / {maxLength}
          </span>
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            送信
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatForm;