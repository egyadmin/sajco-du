import React from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ChatMessageProps {
  message: {
    id: string;
    sender: string;
    content: string;
    timestamp: Date;
    avatar?: string;
    isOwn: boolean;
    status?: 'sent' | 'delivered' | 'read';
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex items-start gap-4 ${message.isOwn ? 'flex-row-reverse' : ''}`}>
      {!message.isOwn && message.avatar && (
        <img
          src={message.avatar}
          alt={message.sender}
          className="w-10 h-10 rounded-full object-cover"
        />
      )}
      
      <div className={`max-w-[70%] ${
        message.isOwn
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-900'
      } rounded-lg p-4`}>
        {!message.isOwn && (
          <p className="text-sm font-medium mb-1">{message.sender}</p>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <div className={`text-xs mt-2 flex items-center justify-end gap-2 ${
          message.isOwn ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span>{format(message.timestamp, 'HH:mm', { locale: ar })}</span>
          {message.isOwn && message.status && (
            <span className="text-xs">
              {message.status === 'sent' && '✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.status === 'read' && (
                <span className="text-blue-300">✓✓</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;