
import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Info, Bot } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import MediaViewer from './components/MediaViewer';
import { Message, Attachment, User, ApiRequestPayload, ApiResponseSuccess, ApiResponseError } from './types';

const WEBHOOK_URL = 'https://constructiveloans.app.n8n.cloud/webhook/constructiveloans';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [sessionId] = useState(`session_${Math.random().toString(36).substr(2, 9)}`);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome-1',
        text: 'Hello! How can I help you today?',
        role: 'agent',
        timestamp: new Date().toISOString(),
      }
    ]);
  }, []);

  // Sync theme with document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleSendMessage = async (text: string, attachments: Attachment[]) => {
    const userMessageId = `msg_${Date.now()}`;
    const userMessage: Message = {
      id: userMessageId,
      text,
      role: 'user',
      timestamp: new Date().toISOString(),
      attachments,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    const currentUser: User = { id: 'user_001', name: 'John Doe' };
    const payload: ApiRequestPayload = {
      sessionId,
      user: currentUser,
      message: {
        id: userMessageId,
        text,
        timestamp: userMessage.timestamp,
      }
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s safety

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (data.error) {
        const err = data as ApiResponseError;
        addAgentMessage({
          id: `reply_${Date.now()}`,
          text: `Error: ${err.error.message}`,
          role: 'agent',
          timestamp: new Date().toISOString(),
          metadata: { responseType: 'error' }
        });
      } else {
        const success = data as ApiResponseSuccess;
        addAgentMessage({
          id: success.reply.id,
          text: success.reply.text,
          role: 'agent',
          timestamp: success.reply.timestamp,
          sources: success.sources,
          confidence: success.confidence,
          metadata: success.metadata
        });
      }
    } catch (error: any) {
  if (error.name === 'AbortError') {
    addAgentMessage({
      id: `timeout_${Date.now()}`,
      text: "The request is taking longer than expected. Please try again in a moment.",
      role: 'agent',
      timestamp: new Date().toISOString(),
      metadata: { responseType: 'timeout' }
    });
  } else {
    console.error('API Error:', error);
    addAgentMessage({
      id: `err_${Date.now()}`,
      text: "I encountered a network error. Please try again later.",
      role: 'agent',
      timestamp: new Date().toISOString(),
      metadata: { responseType: 'error' }
    });
  }
} finally {
      setIsTyping(false);
    }
  };

  const addAgentMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto bg-white dark:bg-mateblack transition-colors duration-300 border-x border-gray-100 dark:border-zinc-800 shadow-2xl">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-mateblack/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#007AFF] rounded-full flex items-center justify-center text-white shadow-sm">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-black dark:text-white leading-tight">Assistant</h1>
            <p className="text-[11px] text-[#34C759] font-semibold">Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-[#007AFF] transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </header>

      {/* Message List */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth no-scrollbar"
      >
        <div className="flex flex-col gap-2">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 py-20 space-y-4">
              <Info size={40} strokeWidth={1.5} />
              <p className="text-sm">No messages yet. Say hi!</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              onImageClick={(url) => setSelectedMedia(url)} 
            />
          ))}
          
          {isTyping && (
            <div className="flex items-start mb-4">
              <div className="bg-[#E9E9EB] dark:bg-[#262629] px-4 py-3 rounded-[20px] rounded-tl-none">
                <div className="flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-zinc-600 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />

      {/* Full Screen Image Viewer */}
      {selectedMedia && (
        <MediaViewer url={selectedMedia} onClose={() => setSelectedMedia(null)} />
      )}
    </div>
  );
};

export default App;
