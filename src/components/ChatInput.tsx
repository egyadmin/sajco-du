import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, X } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onAttachFile: (file: File) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onAttachFile }) => {
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ file: File; preview: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || previewFile) {
      if (message.trim()) {
        onSendMessage(message);
      }
      if (previewFile) {
        onAttachFile(previewFile.file);
      }
      setMessage('');
      setPreviewFile(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewFile({
            file,
            preview: reader.result as string
          });
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewFile({
          file,
          preview: ''
        });
      }
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
    setShowEmoji(false);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="p-4 border-t bg-white">
      {previewFile && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">المرفق</span>
            <button
              onClick={() => setPreviewFile(null)}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {previewFile.preview ? (
            <img
              src={previewFile.preview}
              alt="Preview"
              className="max-h-32 rounded-lg"
            />
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Paperclip className="w-4 h-4" />
              <span>{previewFile.file.name}</span>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-4">
          <div className="flex gap-2">
            <label className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              />
              <Paperclip className="w-5 h-5 text-gray-500" />
            </label>
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-lg relative"
              onClick={() => setShowEmoji(!showEmoji)}
            >
              <Smile className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب رسالتك..."
            className="flex-1 max-h-32 bg-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={1}
          />
          
          <button
            type="submit"
            disabled={!message.trim() && !previewFile}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {showEmoji && (
          <div className="absolute bottom-full right-0 mb-2">
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme="light"
              locale="ar"
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatInput;