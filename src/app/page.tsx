'use client';
import { useEffect, useState, useRef } from 'react';

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

interface Task {
  id: number;
  title: string;
  reliability: 'high' | 'medium' | 'low';
}

export default function Home() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [isTaskGuidanceActive, setIsTaskGuidanceActive] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Hardcoded demo taken
  const tasks: Task[] = [
    { id: 1, title: 'Verplaats hoofdknop naar boven de vouw', reliability: 'high' },
    { id: 2, title: 'Test verschillende kleuren voor CTA-knop', reliability: 'medium' },
    { id: 3, title: 'Voeg testimonials toe nabij de CTA', reliability: 'low' }
  ];

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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const saveMessages = (newMessages: Message[]) => {
    localStorage.setItem('chatMessages', JSON.stringify(newMessages));
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    const userMessage: Message = {
      type: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setPrompt('');

    try {
      const activeTask = tasks.find(t => t.id === activeTaskId);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          messages,
          provider: selectedProvider,
          isTaskGuidanceActive,
          activeTask: activeTask?.title || ''
        })
      });
      const data = await res.json();

      // Log token usage to browser console
      console.log('🤖 AI Response:', {
        provider: data.provider || 'Unknown',
        model: data.modelUsed || 'Unknown',
        tokens: data.tokensUsed || 'Unknown'
      });

      const aiMessage: Message = {
        type: 'ai' as const,
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  const startTask = async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setActiveTaskId(taskId);
    setIsTaskGuidanceActive(true);
    setLoading(true);

    // Reset chat bij het starten van een taak
    setMessages([]);
    saveMessages([]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Start taakbegeleiding voor: ${task.title}`,
          messages: [], // Start met lege messages array
          provider: selectedProvider,
          isTaskGuidanceActive: true,
          activeTask: task.title
        })
      });
      const data = await res.json();

      // Log token usage to browser console
      console.log('🎯 Task Started - AI Response:', {
        provider: data.provider || 'Unknown',
        model: data.modelUsed || 'Unknown',
        tokens: data.tokensUsed || 'Unknown'
      });

      const welcomeMessage: Message = {
        type: 'ai' as const,
        content: data.reply,
        timestamp: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
      };
      const updatedMessages = [welcomeMessage];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } catch (error) {
      console.error('Error:', error);
    }

    setLoading(false);
  };

  const closeTask = () => {
    setIsTaskGuidanceActive(false);
    setActiveTaskId(null);
  };

  const completeTask = async () => {
    setLoading(true);

    try {
      const activeTask = tasks.find(t => t.id === activeTaskId);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'De gebruiker heeft aangegeven dat de taak voltooid is. Geef een felicitatiebericht en vraag om feedback over de begeleiding.',
          messages,
          provider: selectedProvider,
          isTaskGuidanceActive: true,
          activeTask: activeTask?.title || ''
        })
      });
      const data = await res.json();

      // Log token usage to browser console
      console.log('✅ Task Completed - AI Response:', {
        provider: data.provider || 'Unknown',
        model: data.modelUsed || 'Unknown',
        tokens: data.tokensUsed || 'Unknown'
      });

      const feedbackMessage: Message = {
        type: 'ai' as const,
        content: data.reply,
        timestamp: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
      };
      const updatedMessages = [...messages, feedbackMessage];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
      setIsTaskGuidanceActive(false);
      setActiveTaskId(null);
    } catch (error) {
      console.error('Error:', error);
      setIsTaskGuidanceActive(false);
      setActiveTaskId(null);
    }

    setLoading(false);
  };

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getReliabilityLabel = (reliability: string) => {
    switch (reliability) {
      case 'high': return 'Hoge betrouwbaarheid';
      case 'medium': return 'Gemiddelde betrouwbaarheid';
      case 'low': return 'Onzekere betrouwbaarheid';
      default: return 'Betrouwbaarheid onbekend';
    }
  };

  const activeTask = tasks.find(t => t.id === activeTaskId);

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      {/* Takenlijst Links */}
      <aside className={`border-r border-gray-200 bg-white flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
        <div className="h-16 px-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-gray-900 whitespace-nowrap">Open taken</h2>
            <span className="text-sm text-gray-500">{tasks.length}</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Sluit takenlijst"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => startTask(task.id)}
              disabled={loading}
              className={`w-full text-left p-3 mb-2 rounded-lg transition-all cursor-pointer ${activeTaskId === task.id
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${activeTaskId === task.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                  {activeTaskId === task.id && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getReliabilityColor(task.reliability)}`}>
                  {getReliabilityLabel(task.reliability)}
                </span>
              </div>
              <p className={`text-sm font-medium ml-6 ${activeTaskId === task.id ? 'text-blue-900' : 'text-gray-900'
                }`}>
                {task.title}
              </p>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'linear-gradient(to bottom, #FFFFFF 0%, #E5EFFE 100%)' }}>
        {/* Top Navigation */}
        <header className="border-b border-gray-200 bg-transparent h-16 flex items-center justify-center px-6 flex-shrink-0">
          <div className="w-full max-w-4xl flex items-center justify-between">
            {/* Left - Logo & Toggle */}
            <div className="flex items-center gap-3">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Open takenlijst"
                >
                  <img
                    src="/tasklist.svg"
                    alt="Open takenlijst"
                    className="w-6 h-6 grayscale"
                  />
                </button>
              )}
              <img
                src="/InsightAI_logo.png"
                alt="InsightAI Logo"
                className="h-8 w-auto"
              />
            </div>

            {/* Right - Menu & Close */}
            <div className="flex items-center gap-3">
              {/* Hamburgermenu */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">AI Provider</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedProvider('openai');
                              setIsMenuOpen(false);
                            }}
                            className={`flex-1 px-3 py-2 text-sm rounded font-medium transition-colors ${selectedProvider === 'openai'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                          >
                            OpenAI
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProvider('mistral');
                              setIsMenuOpen(false);
                            }}
                            className={`flex-1 px-3 py-2 text-sm rounded font-medium transition-colors ${selectedProvider === 'mistral'
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                          >
                            Mistral
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          clearChat();
                          setIsMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        🔄 Reset Chat
                      </button>
                    </div>
                  </>
                )}
              </div>

              <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Sluiten
              </button>
            </div>
          </div>
        </header>

        {/* Actieve Taakbegeleiding Banner */}
        {isTaskGuidanceActive && activeTask && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex-shrink-0">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Actieve taakbegeleiding</p>
                  <p className="text-sm text-blue-700">{activeTask.title}</p>
                </div>
              </div>
              <button
                onClick={() => completeTask()}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
              >
                ✓ Taak voltooid
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages Area */}
        <main className="flex-1 flex flex-col min-h-0">
          <div ref={chatContainerRef} className=" flex-1 overflow-y-auto px-6 py-6">
            <div className="max-w-4xl mx-auto">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">Hallo! Wat kan ik voor je analyseren?</h2>
                  <p className="text-gray-600 mb-8 max-w-lg">
                    Ik help je met het analyseren van je marketing data en begeleid je met het optimaliseren van je website.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {messages.map((message: Message, index: number) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.type === 'ai' && (
                      <div className="max-w-3xl bg-white p-6 rounded-xl border">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-xs text-gray-400">{message.timestamp}</span>
                        </div>
                        <div
                          className="text-gray-800 leading-relaxed prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: message.content }}
                        />
                      </div>
                    )}
                    {message.type === 'user' && (
                      <div className="bg-blue-500 rounded-2xl px-5 py-3 max-w-2xl">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="text-xs text-white/70">{message.timestamp}</span>
                        </div>
                        <div
                          className="text-white leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: message.content }}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-1 pt-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Input Area onderaan */}
          <div className="border-t border-gray-200 bg-transparent px-6 py-4 flex-shrink-0">
            <div className="max-w-4xl mx-auto">
              {/* Snelknoppen - alleen als er GEEN taakbegeleiding actief is */}
              {!isTaskGuidanceActive && (
                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    onClick={() => setPrompt("Hoe presteert mijn website?")}
                    className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm rounded-xl transition-colors border border-gray-200"
                    disabled={loading}
                  >
                    Hoe presteert mijn website?
                  </button>
                  <button
                    onClick={() => setPrompt("Hoe presteer ik in SEO?")}
                    className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm rounded-xl transition-colors border border-gray-200"
                    disabled={loading}
                  >
                    Hoe presteer ik in SEO?
                  </button>
                  <button
                    onClick={() => setPrompt("Hoe is mijn conversie ratio?")}
                    className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm rounded-xl transition-colors border border-gray-200"
                    disabled={loading}
                  >
                    Hoe is mijn conversie ratio?
                  </button>
                </div>
              )}

              {/* Taakbegeleiding knoppen - alleen als taakbegeleiding ACTIEF is */}
              {isTaskGuidanceActive && (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setPrompt("Begeleid me")}
                    className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm rounded-full transition-colors border border-gray-200"
                    disabled={loading}
                  >
                    Begeleid me
                  </button>
                  <button
                    onClick={closeTask}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm rounded-full transition-colors border border-red-200"
                    disabled={loading}
                  >
                    ✕ Stop taakbegeleiding
                  </button>
                </div>
              )}
              <div className="flex gap-3 items-center">
                <div className="flex items-center flex-1 relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Vraag om hulp bij je taak..."
                    className="w-full border bg-white border-gray-300 rounded-xl px-5 py-3 pr-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={loading}
                    rows={1}
                    style={{ minHeight: '52px', maxHeight: '150px' }}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !prompt.trim()}
                  className="bg-blue-500 hover:bg-blue-600 rotate-90 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-xl p-3 transition-colors flex items-center justify-center min-w-[52px] h-[52px]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
