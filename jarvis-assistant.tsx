import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Database, Brain, Code, Sparkles, Zap, Search, FileText, ChevronDown, Terminal, History, Upload, Download, Trash2, Settings, Menu } from 'lucide-react';

export default function JarvisAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your personal AI assistant powered by advanced language models and vector search. Ask me anything!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'Product Support Questions', date: '2 hours ago', preview: 'How can I contact support?' },
    { id: 2, title: 'Premium Features Discussion', date: 'Yesterday', preview: 'Tell me about premium features' },
    { id: 3, title: 'Security & Compliance', date: '2 days ago', preview: 'How do you protect my data?' }
  ]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulatedVectorDB = {
    documents: [
      { id: 1, text: 'Our company offers 24/7 customer support via email and chat.', embedding: [0.1, 0.2, 0.3], relevance: 0.95 },
      { id: 2, text: 'We provide a 30-day money-back guarantee on all products.', embedding: [0.2, 0.3, 0.1], relevance: 0.89 },
      { id: 3, text: 'Our premium plan includes unlimited API calls and priority support.', embedding: [0.3, 0.1, 0.2], relevance: 0.87 },
      { id: 4, text: 'Data security is our top priority. We use end-to-end encryption.', embedding: [0.15, 0.25, 0.35], relevance: 0.92 }
    ]
  };

  const semanticSearch = (query) => {
    const queryLower = query.toLowerCase();
    const results = simulatedVectorDB.documents.filter(doc => {
      const keywords = ['support', 'guarantee', 'refund', 'security', 'pricing', 'premium', 'api'];
      return keywords.some(keyword => queryLower.includes(keyword));
    });
    return results.length > 0 ? results : [simulatedVectorDB.documents[0]];
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const relevantDocs = fetch("http://localhost:8000/query");
      const context = relevantDocs.map(doc => doc.text).join('\n');
      
      setKnowledgeBase(relevantDocs);

      const response = generateResponse(currentInput, context);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setLoading(false);
    }, 1500);
  };

  const generateResponse = (query, context) => {
    const responses = {
      support: 'Based on our knowledge base, we offer 24/7 customer support via email and chat. Our support team is always ready to assist you with any questions or concerns.',
      guarantee: 'We stand behind our products with a comprehensive 30-day money-back guarantee. If you\'re not completely satisfied, you can request a full refund within this period, no questions asked.',
      premium: 'Our premium plan is designed for enterprise needs and includes unlimited API calls, priority support with dedicated account managers, and advanced analytics dashboards.',
      security: 'Data security is our top priority. We implement end-to-end encryption, regular security audits, and comply with industry standards like SOC 2 and GDPR to protect your information.'
    };

    for (const [key, value] of Object.entries(responses)) {
      if (query.toLowerCase().includes(key)) {
        return value;
      }
    }

    return `Based on the context retrieved from our knowledge base, here's what I found: ${context}`;
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: `I've received ${files.length} file(s): ${files.map(f => f.name).join(', ')}. I'll process these and add them to my knowledge base.` 
    }]);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Chat cleared. How can I help you?' }]);
    setKnowledgeBase([]);
  };

  const exportChat = () => {
    const chatText = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jarvis-chat-${Date.now()}.txt`;
    a.click();
  };

  const suggestions = [
    { icon: '🎯', text: 'How can I contact support?', category: 'Support' },
    { icon: '💰', text: 'What is your refund policy?', category: 'Billing' },
    { icon: '⚡', text: 'Tell me about premium features', category: 'Features' },
    { icon: '🔒', text: 'How do you protect my data?', category: 'Security' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen p-4 md:p-6">
        <div className="max-w-[1800px] mx-auto">
          {/* Compact Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center gap-3 mb-2">
              <Bot className="w-10 h-10 text-purple-400 animate-pulse" />
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                JARVIS AI
              </h1>
            </div>
            <p className="text-purple-200 text-sm">Enterprise AI Assistant with RAG Architecture</p>
          </div>

          {/* Compact Action Buttons */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => setShowArchitecture(!showArchitecture)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 backdrop-blur-xl rounded-lg border border-purple-400/30 transition-all text-sm text-purple-200"
            >
              <Code className="w-4 h-4" />
              Architecture
            </button>
            <button
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 backdrop-blur-xl rounded-lg border border-green-400/30 transition-all text-sm text-green-200"
            >
              <Terminal className="w-4 h-4" />
              Setup Guide
              <ChevronDown className={`w-4 h-4 transition-transform ${showSetupGuide ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Collapsible Architecture */}
          {showArchitecture && (
            <div className="mb-6 bg-black/30 backdrop-blur-xl rounded-xl p-4 border border-purple-400/30 animate-in fade-in duration-300">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-blue-300" />
                    <h3 className="font-bold text-white">User Input</h3>
                  </div>
                  <p className="text-xs text-blue-200">Chat interface captures queries</p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-green-300" />
                    <h3 className="font-bold text-white">Vector Search</h3>
                  </div>
                  <p className="text-xs text-green-200">Pinecone retrieves context</p>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5 text-purple-300" />
                    <h3 className="font-bold text-white">LLM Response</h3>
                  </div>
                  <p className="text-xs text-purple-200">LLaMA generates answers</p>
                </div>
              </div>
            </div>
          )}

          {/* Collapsible Setup Guide */}
          {showSetupGuide && (
            <div className="mb-6 bg-black/30 backdrop-blur-xl rounded-xl p-6 border border-green-400/30 animate-in fade-in duration-300">
              <h3 className="text-xl font-bold text-white mb-4">Quick Setup Guide</h3>
              <div className="space-y-4">
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-400/30">
                  <h4 className="font-bold text-green-300 mb-2">1. Get API Keys</h4>
                  <ul className="text-sm text-green-100 space-y-1">
                    <li>• Pinecone: <a href="https://www.pinecone.io/" target="_blank" className="underline">pinecone.io</a></li>
                    <li>• Anthropic Claude: <a href="https://console.anthropic.com/" target="_blank" className="underline">console.anthropic.com</a></li>
                  </ul>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-400/30">
                  <h4 className="font-bold text-blue-300 mb-2">2. Install Backend</h4>
                  <code className="text-xs text-blue-100 block bg-black/40 p-2 rounded">
                    pip install fastapi uvicorn pinecone-client anthropic
                  </code>
                </div>
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-400/30">
                  <h4 className="font-bold text-purple-300 mb-2">3. Run Server</h4>
                  <code className="text-xs text-purple-100 block bg-black/40 p-2 rounded">
                    uvicorn main:app --reload
                  </code>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-12 gap-4">
            {/* Chat History Sidebar - Collapsible on Mobile */}
            <div className={`lg:col-span-2 ${showHistory ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-400/30 p-4 h-[750px] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-purple-400" />
                    History
                  </h3>
                  <button onClick={() => setShowHistory(false)} className="lg:hidden text-purple-300">
                    ×
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2">
                  {chatHistory.map(chat => (
                    <button
                      key={chat.id}
                      className="w-full text-left bg-purple-500/10 hover:bg-purple-500/20 rounded-lg p-3 border border-purple-400/30 transition-all"
                    >
                      <p className="text-xs font-semibold text-white truncate">{chat.title}</p>
                      <p className="text-xs text-purple-300 mt-1">{chat.date}</p>
                    </button>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-semibold transition-all">
                  + New Chat
                </button>
              </div>
            </div>

            {/* Main Chat Area - ENLARGED */}
            <div className="lg:col-span-7">
              <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-400/30 shadow-2xl flex flex-col h-[750px]">
                {/* Chat Header */}
                <div className="p-4 border-b border-purple-400/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setShowHistory(!showHistory)} className="lg:hidden">
                        <Menu className="w-5 h-5 text-purple-300" />
                      </button>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-white">AI Assistant</h2>
                        <p className="text-xs text-green-400">● Online</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={exportChat} className="p-2 hover:bg-purple-500/20 rounded-lg transition-all" title="Export Chat">
                        <Download className="w-4 h-4 text-purple-300" />
                      </button>
                      <button onClick={clearChat} className="p-2 hover:bg-red-500/20 rounded-lg transition-all" title="Clear Chat">
                        <Trash2 className="w-4 h-4 text-red-300" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-xl p-4 ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl text-white border border-purple-400/30'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl p-4 border border-purple-400/30">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* File Upload Area */}
                {uploadedFiles.length > 0 && (
                  <div className="px-4 py-2 border-t border-purple-400/30 bg-purple-500/10">
                    <div className="flex flex-wrap gap-2">
                      {uploadedFiles.map(file => (
                        <div key={file.id} className="flex items-center gap-2 bg-purple-600/30 rounded-lg px-3 py-1 text-xs">
                          <FileText className="w-3 h-3 text-purple-300" />
                          <span className="text-purple-100">{file.name}</span>
                          <span className="text-purple-300">({file.size})</span>
                          <button onClick={() => removeFile(file.id)} className="text-red-400 hover:text-red-300">×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t border-purple-400/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      multiple
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg transition-all border border-purple-400/30"
                      title="Upload Files"
                    >
                      <Upload className="w-5 h-5 text-purple-300" />
                    </button>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 bg-white/10 backdrop-blur-xl text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-white/20 placeholder-purple-300/50"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={loading || !input.trim()}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg px-6 py-3 flex items-center gap-2 transition-all font-semibold"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Quick Suggestions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.slice(0, 2).map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(s.text)}
                        className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full transition-all border border-purple-400/30"
                      >
                        {s.icon} {s.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Knowledge Base Sidebar */}
            <div className="lg:col-span-3">
              <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-400/30 p-4 h-[750px] flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5 text-green-400" />
                  <h2 className="text-sm font-bold text-white">Knowledge Base</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3">
                  {knowledgeBase.length > 0 ? (
                    knowledgeBase.map((doc, idx) => (
                      <div key={idx} className="bg-green-500/10 rounded-lg p-3 border border-green-400/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-green-300">Doc #{doc.id}</span>
                          <span className="text-xs text-green-300">{(doc.relevance * 100).toFixed(0)}%</span>
                        </div>
                        <p className="text-xs text-white/90">{doc.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-300 text-xs mt-8">
                      <Database className="w-8 h-8 mx-auto mb-2 text-purple-400 opacity-50" />
                      <p>Send a message to see relevant context</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-purple-400/30">
                  <h3 className="text-xs font-bold text-white mb-2">Quick Actions:</h3>
                  <div className="space-y-2">
                    {suggestions.slice(2).map((s, i) => (
                      <button
                        key={i}
                        onClick={() => setInput(s.text)}
                        className="w-full text-left text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-lg px-3 py-2 transition-all"
                      >
                        {s.icon} {s.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}