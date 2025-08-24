'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('chatMessages');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing saved messages:', e);
      }
    }
  }, []);

  const saveMessages = (newMessages) => {
    localStorage.setItem('chatMessages', JSON.stringify(newMessages));
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    const userMessage = { type: 'user', content: prompt, timestamp: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }) };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setPrompt('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, messages })
      });
      const data = await res.json();
      
      const aiMessage = { 
        type: 'ai', 
        content: data.reply, 
        timestamp: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }) 
      };
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } catch (error) {
      console.error('Error:', error);
    }
    
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
      {/* Reset button buiten de chat interface */}
      <button 
        onClick={clearChat}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium shadow-lg z-10"
      >
        Reset Chat
      </button>
      
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full h-[600px] max-h-[80vh] flex flex-col">
        
        {/* Header - Blauw gedeelte */}
        <div className="bg-blue-500 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
              </svg>
            </div>
            <div>
              <h1 className="font-semibold text-lg">AI Marketing Assistant</h1>
              <p className="text-white/80 text-sm">Taakbegeleiding niet actief</p>
            </div>
          </div>
        </div>

        {/* Chat Messages - Witte achtergrond */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.type === 'ai' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-500">{message.timestamp}</span>
                    </div>
                  )}
                  {message.type === 'user' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="text-xs text-white/80">{message.timestamp}</span>
                    </div>
                  )}
                  <div 
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-3 max-w-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
                      </svg>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Ook witte achtergrond */}
        <div className="bg-white border-t border-gray-200 p-4 rounded-b-lg">
          <div className="flex gap-2">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Vraag om hulp bij je taak..."
              className="flex-1 border border-gray-200 rounded-full px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button 
              onClick={handleSubmit} 
              disabled={loading || !prompt.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-full p-3 transition-colors flex items-center justify-center min-w-[48px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}