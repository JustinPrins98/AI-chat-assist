'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('openai');

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
        body: JSON.stringify({ prompt, messages, provider: selectedProvider })
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

  const simulateTaskGuidance = () => {
    // Functionaliteit komt later
    console.log('Simuleer taakbegeleiding aangeklikt');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center flex-col gap-4 p-4 relative">
      {/* Settings Menu - rechtsboven */}
      <div className="absolute top-4 right-4 z-10 group">
        {/* Settings knop */}
        <button className="flex items-center justify-center w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors shadow-lg cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Onzichtbare overlay om hover state te behouden */}
        <div className="absolute top-12 right-0 w-full h-4 opacity-0 invisible group-hover:opacity-0 group-hover:visible"></div>

        {/* Menu items - verschijnen bij hover */}
        <div className="absolute top-14 right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 space-y-3">
          {/* Reset button */}
          <div className="flex justify-end">
            <button
              onClick={clearChat}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium shadow-lg cursor-pointer"
            >
              Reset Chat
            </button>
          </div>

          {/* Simuleer taakbegeleiding button */}
          <button
            onClick={simulateTaskGuidance}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium shadow-lg whitespace-nowrap cursor-pointer"
          >
            Simuleer Taakbegeleiding
          </button>

          {/* AI Provider Selection */}
          <div className="flex justify-end">
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-lg">
              <span className="text-xs text-gray-600 font-medium">LLM:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedProvider('openai')}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-colors cursor-pointer ${selectedProvider === 'openai'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                >
                  OpenAI
                </button>
                <button
                  onClick={() => setSelectedProvider('mistral')}
                  className={`px-3 py-1 text-xs rounded-full font-medium transition-colors cursor-pointer ${selectedProvider === 'mistral'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                >
                  Mistral
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${message.type === 'user'
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a7 7 0 00-7-7z" />
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
          <div className="flex gap-2 mb-3">
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
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-full p-3 transition-colors flex items-center justify-center min-w-[48px] cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5 origin-center rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>

          {/* Suggestie buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPrompt("Doe een verkeer analyse en hoe kan ik het verkeer verbeteren?")}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors cursor-pointer"
              disabled={loading}
            >
              Verkeer analyse
            </button>
            <button
              onClick={() => setPrompt("Wat zijn mijn SEO prestaties en hoe kan ik die verbeteren?")}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors cursor-pointer"
              disabled={loading}
            >
              SEO prestaties
            </button>
            <button
              onClick={() => setPrompt("Wat is de conversie ratio en hoe kan ik die verbeteren?")}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors cursor-pointer"
              disabled={loading}
            >
              Conversie ratio
            </button>
          </div>


        </div>
      </div>
    </div>

  );
}