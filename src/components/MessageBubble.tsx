import React from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

interface MessageBubbleProps {
  content: string;
  type: 'user' | 'ai';
  isStreaming?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ content, type, isStreaming }) => {
  const renderContent = () => {
    if (type === 'user') {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }

    // AIメッセージの場合、まずマークダウンをHTMLに変換してからサニタイズ
    try {
      // マークダウンをHTMLに変換
      const htmlContent = marked.parse(content);
      
      // HTMLをサニタイズ
      const sanitizedContent = DOMPurify.sanitize(htmlContent);
      
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          className="ai-message-content prose prose-gray max-w-none"
        />
      );
    } catch (error) {
      console.error('Markdown/HTML parsing error:', error);
      return <p className="whitespace-pre-wrap">{content}</p>;
    }
  };

  return (
    <div className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
          type === 'user'
            ? 'bg-blue-500 text-white ml-4'
            : 'bg-gray-100 text-gray-900 mr-4'
        } ${isStreaming ? 'animate-pulse' : ''}`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default MessageBubble;