
import React from 'react';
import { Message, Source } from '../types';
import { FileText, ExternalLink, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
  onImageClick: (url: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onImageClick }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex flex-col w-full mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
      {/* Attachments (above bubble like iMessage) */}
      {message.attachments && message.attachments.length > 0 && (
        <div className={`flex flex-wrap gap-2 mb-1 max-w-[70%] ${isUser ? 'justify-end' : 'justify-start'}`}>
          {message.attachments.map((att) => (
            <div key={att.id} className="relative group">
              {att.type === 'image' ? (
                <img 
                  src={att.url} 
                  alt={att.name}
                  onClick={() => onImageClick(att.url)}
                  className="w-32 h-32 object-cover rounded-2xl cursor-pointer border border-gray-200 dark:border-gray-800 shadow-sm transition-transform hover:scale-105"
                />
              ) : (
                  <a
                    href={att.url}
                    download={att.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 text-sm hover:bg-gray-200 dark:hover:bg-zinc-800 transition"
                  >
                    <FileText size={18} className="text-blue-500" />
                    <span className="truncate max-w-[120px] dark:text-gray-300">
                      {att.name}
                    </span>
                  </a>
                )}
            </div>
          ))}
        </div>
      )}

      {/* Main Bubble */}
      <div 
        className={`max-w-[75%] px-4 py-2.5 rounded-[20px] text-[15px] leading-tight shadow-sm relative
          ${isUser 
            ? 'bg-[#34C759] text-white rounded-tr-none' 
            : 'bg-[#E9E9EB] dark:bg-[#262629] text-black dark:text-white rounded-tl-none'}
        `}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none">
  <ReactMarkdown
    components={{
      strong: ({ children }) => (
        <strong className="font-semibold">{children}</strong>
      ),
      ul: ({ children }) => (
        <ul className="list-disc ml-5 space-y-1">{children}</ul>
      ),
      li: ({ children }) => (
        <li className="leading-snug">{children}</li>
      ),
      p: ({ children }) => (
        <p className="mb-2 last:mb-0">{children}</p>
      ),
    }}
  >
    {message.text}
  </ReactMarkdown>
</div>

        
        {/* Tail logic - CSS simplified */}
        <div className={`absolute bottom-0 w-4 h-4 overflow-hidden ${isUser ? '-right-1' : '-left-1'}`}>
           {/* Tail graphics can be complex; using rounded corners handles 90% of iMessage vibe */}
        </div>
      </div>

      {/* Sources (Agent only) */}
      {!isUser && message.sources && message.sources.length > 0 && (
        <div className="mt-2 ml-1 flex flex-col gap-1 max-w-[75%]">
          <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            <Info size={10} />
            Sources
          </div>
          {message.sources.map((src, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[12px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
              <ExternalLink size={12} />
              <span className="truncate">{src.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Timestamp */}
      <span className="mt-1 text-[10px] text-gray-400 dark:text-zinc-600 px-2">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};

export default ChatMessage;
