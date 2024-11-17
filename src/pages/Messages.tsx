import React, { useState, useRef, useEffect } from 'react';
import { Search, Users, Phone, Video, X } from 'lucide-react';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import CallModal from '../components/CallModal';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  avatar?: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
  attachment?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  };
}

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'أحمد محمد',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    content: 'هل تم مراجعة المخططات الجديدة؟',
    timestamp: new Date('2024-03-15T10:30:00'),
    isOwn: false,
    status: 'read',
  },
  {
    id: '2',
    sender: 'أنت',
    content: 'نعم، سأرسل التعليقات خلال ساعة',
    timestamp: new Date('2024-03-15T10:35:00'),
    isOwn: true,
    status: 'read',
  },
  {
    id: '3',
    sender: 'سارة أحمد',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
    content: 'يجب أن نجتمع لمناقشة التغييرات في التصميم',
    timestamp: new Date('2024-03-15T11:15:00'),
    isOwn: false,
    status: 'delivered',
    attachment: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&auto=format&fit=crop',
      name: 'التصميم الجديد.jpg'
    }
  },
];

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [callModal, setCallModal] = useState<{ isOpen: boolean; type: 'audio' | 'video' }>({
    isOpen: false,
    type: 'audio'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'أنت',
      content,
      timestamp: new Date(),
      isOwn: true,
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate message being delivered
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );
    }, 1000);

    // Simulate message being read
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, status: 'read' }
            : msg
        )
      );
    }, 2000);
  };

  const handleAttachFile = (file: File) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'أنت',
      content: '',
      timestamp: new Date(),
      isOwn: true,
      status: 'sent',
      attachment: {
        type: file.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(file),
        name: file.name
      }
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const startCall = (type: 'audio' | 'video') => {
    setCallModal({ isOpen: true, type });
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">مجموعة المشروع</h2>
              <p className="text-sm text-gray-500">8 أعضاء</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => startCall('audio')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => startCall('video')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Video className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="البحث في المحادثة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages
          .filter((msg) =>
            msg.content.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        onAttachFile={handleAttachFile}
      />

      <CallModal
        isOpen={callModal.isOpen}
        onClose={() => setCallModal({ isOpen: false, type: 'audio' })}
        type={callModal.type}
        participants={['أحمد محمد', 'سارة أحمد', 'محمد علي']}
      />
    </div>
  );
};

export default Messages;