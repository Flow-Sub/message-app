
import React, { useState, useRef } from 'react';
import { Camera, Paperclip, Mic, Send, Smile, X } from 'lucide-react';
import { Attachment } from '../types';

interface ChatInputProps {
  onSendMessage: (text: string, attachments: Attachment[]) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showEmojis, setShowEmojis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const commonEmojis = ["😊", "👍", "❤️", "😂", "🔥", "🤔", "🙌", "✨", "🚀", "💡"];

  const handleSend = () => {
    if ((text.trim() || attachments.length > 0) && !disabled) {
      onSendMessage(text, attachments);
      setText('');
      setAttachments([]);
      setShowEmojis(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newAttachment: Attachment = {
            id: Math.random().toString(36).substr(2, 9),
            type: file.type.startsWith('image/') ? 'image' : 'file',
            url: event.target?.result as string,
            name: file.name
          };
          setAttachments(prev => [...prev, newAttachment]);
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="p-3 bg-white dark:bg-mateblack border-t border-gray-100 dark:border-zinc-800 safe-area-bottom">
      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar">
          {attachments.map((att) => (
            <div key={att.id} className="relative flex-shrink-0">
              {att.type === 'image' ? (
                <img src={att.url} alt="preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-zinc-800" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-zinc-900 flex flex-col items-center justify-center p-1 border border-gray-200 dark:border-zinc-800">
                  <Paperclip size={16} className="text-gray-500" />
                  <span className="text-[9px] text-gray-500 truncate w-full text-center">{att.name}</span>
                </div>
              )}
              <button 
                onClick={() => removeAttachment(att.id)}
                className="absolute -top-1.5 -right-1.5 bg-gray-500 text-white rounded-full p-0.5 shadow-md"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex gap-2 pb-1">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-gray-500 hover:text-[#007AFF] transition-colors"
          >
            <Camera size={24} />
          </button>
          <button 
             type="button"
             onClick={() => fileInputRef.current?.click()}
             className="p-1.5 text-gray-500 hover:text-[#007AFF] transition-colors"
          >
            <Paperclip size={24} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            multiple 
            className="hidden" 
          />
        </div>

        <div className="relative flex-1 bg-[#F2F2F7] dark:bg-[#1C1C1E] rounded-2xl px-3 py-1.5 flex items-end">
          <button 
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            className="p-1 text-gray-400 hover:text-yellow-500 transition-colors"
          >
            <Smile size={20} />
          </button>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="iMessage"
            className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] max-h-32 min-h-[24px] py-1 px-2 resize-none text-black dark:text-white dark:placeholder-zinc-500"
            rows={1}
          />
        </div>

        <div className="flex gap-2 pb-1">
           <button 
            disabled // Voice disabled as per request
            className="p-1.5 text-gray-300 dark:text-zinc-700 cursor-not-allowed"
          >
            <Mic size={24} />
          </button>
          <button 
            onClick={handleSend}
            disabled={(!text.trim() && attachments.length === 0) || disabled}
            className={`p-1.5 rounded-full transition-all ${
              (text.trim() || attachments.length > 0) && !disabled
              ? 'bg-[#007AFF] text-white' 
              : 'text-gray-300 dark:text-zinc-700'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Emoji Picker Popover */}
      {showEmojis && (
        <div className="absolute bottom-16 left-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-xl p-3 flex gap-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {commonEmojis.map(emoji => (
            <button 
              key={emoji} 
              onClick={() => setText(prev => prev + emoji)}
              className="text-xl hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatInput;
