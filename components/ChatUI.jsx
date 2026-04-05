"use client";
import { useState, useRef, useEffect } from "react";

// Format AI response with visual enhancements
function FormattedAIResponse({ content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Split content into sections
  const formatContent = (text) => {
    const lines = text.split('\n');
    const elements = [];
    let currentSection = [];
    
    lines.forEach((line, idx) => {
      // Headers (lines starting with symbols or emojis)
      if (line.match(/^\[(>|#|\*|!|\+)\]\s*.+/) || line.match(/^[🔍📊🧠🚀⚡💡📌⚠️✨🎯]\s*.+/) || line.match(/^\d+\.\s*.+/)) {
        if (currentSection.length > 0) {
          elements.push({ type: 'text', content: currentSection.join('\n') });
          currentSection = [];
        }
        elements.push({ type: 'header', content: line });
      }
      // Bullet points
      else if (line.match(/^[-•→]\s*.+/)) {
        if (currentSection.length > 0 && !currentSection[currentSection.length - 1].match(/^[-•→]/)) {
          elements.push({ type: 'text', content: currentSection.join('\n') });
          currentSection = [];
        }
        currentSection.push(line);
        if (idx === lines.length - 1 || !lines[idx + 1].match(/^[-•→]/)) {
          elements.push({ type: 'list', content: currentSection.join('\n') });
          currentSection = [];
        }
      }
      // Bold text (**text**)
      else if (line.includes('**')) {
        currentSection.push(line);
      }
      // Regular text
      else {
        currentSection.push(line);
      }
    });
    
    if (currentSection.length > 0) {
      elements.push({ type: 'text', content: currentSection.join('\n') });
    }
    
    return elements;
  };

  const renderContent = (text) => {
    // Handle **bold** syntax and highlight numbers/percentages
    const parts = text.split(/(\*\*.*?\*\*|\d+%|\d+\+)/);
    
    return parts.map((part, i) => {
      // Bold text
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      // Percentages and numbers
      if (part.match(/^\d+%$/) || part.match(/^\d+\+$/)) {
        return <span key={i} className="font-semibold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const sections = formatContent(content);

  return (
    <div className="space-y-3">
      {/* Copy button */}
      <div className="flex justify-end -mt-1 -mr-1">
        <button
          onClick={handleCopy}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-50"
        >
          {copied ? (
            <>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      
      {sections.map((section, idx) => {
        if (section.type === 'header') {
          // Check for symbol-based headers first [>], [#], [*], [!], [+]
          const symbolMatch = section.content.match(/^\[(.)\]\s*(.+)/);
          const emojiMatch = section.content.match(/^([🔍📊🧠🚀⚡💡📌⚠️✨🎯])\s*(.+)/);
          
          let icon = null;
          let text = section.content;
          let iconColor = "text-pink-500";
          
          if (symbolMatch) {
            const symbol = symbolMatch[1];
            text = symbolMatch[2];
            
            // Map symbols to icons and colors
            const symbolMap = {
              '>': { icon: '🔍', label: 'Insight', color: 'text-blue-500' },
              '#': { icon: '📊', label: 'Data', color: 'text-purple-500' },
              '*': { icon: '🧠', label: 'Analysis', color: 'text-indigo-500' },
              '!': { icon: '🚀', label: 'Action', color: 'text-pink-500' },
              '+': { icon: '💡', label: 'Idea', color: 'text-orange-500' },
            };
            
            const mapped = symbolMap[symbol];
            if (mapped) {
              icon = <span className={`text-lg flex-shrink-0 ${mapped.color} font-bold`}>{symbol}</span>;
              iconColor = mapped.color;
            }
          } else if (emojiMatch) {
            icon = <span className="text-lg flex-shrink-0">{emojiMatch[1]}</span>;
            text = emojiMatch[2];
          } else {
            text = section.content.replace(/^\d+\.\s*/, '');
          }
          
          return (
            <div key={idx} className="flex items-start gap-3 mt-4 first:mt-0">
              {icon}
              <h3 className="font-semibold text-gray-900 text-base leading-relaxed">
                {renderContent(text)}
              </h3>
            </div>
          );
        }
        
        if (section.type === 'list') {
          return (
            <ul key={idx} className="space-y-2 ml-1">
              {section.content.split('\n').map((item, i) => {
                const cleanItem = item.replace(/^[-•→]\s*/, '');
                return (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-pink-500 mt-1.5 flex-shrink-0">•</span>
                    <span className="flex-1">{renderContent(cleanItem)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }
        
        if (section.type === 'text' && section.content.trim()) {
          return (
            <p key={idx} className="text-gray-700 leading-relaxed">
              {renderContent(section.content)}
            </p>
          );
        }
        
        return null;
      })}
    </div>
  );
}

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your Instagram Growth AI. How can I help you analyze your content today?" }
  ]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState(""); // ✅ ADDED
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(Date.now());
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load saved chats on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("insta_chats")) || [];
    setChatHistory(saved);
  }, []);

  // Save chat on message update
  useEffect(() => {
    scrollToBottom();
    
    // Generate chat title from first user message
    const firstUserMessage = messages.find(m => m.role === "user");
    const chatTitle = firstUserMessage 
      ? firstUserMessage.content.slice(0, 50).trim() 
      : "New conversation";
    
    const updatedChats = chatHistory.filter(c => c.id !== currentChatId);

    updatedChats.push({
      id: currentChatId,
      title: chatTitle,
      messages,
      timestamp: Date.now(),
    });

    setChatHistory(updatedChats);
    localStorage.setItem("insta_chats", JSON.stringify(updatedChats));

  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
          query: userMsg.content,
          username: username || undefined,
          sessionId: currentChatId.toString(), // Use unique chat ID
        }),
      });
      
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-white text-gray-900 font-sans selection:bg-pink-100">
      
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-72 bg-white p-4 border-r border-gray-200 shadow-sm">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 p-0.5 shadow-md">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Growth AI</h1>
              <p className="text-xs text-gray-500">Analyze & Optimize</p>
            </div>
          </div>
          
          <button 
            onClick={() => {
              const newId = Date.now();
              setCurrentChatId(newId);
              setUsername(""); // Clear username for new chat

              setMessages([
                {
                  role: "assistant",
                  content: "Hello! I'm your Instagram Growth AI. How can I help you analyze your content today?",
                },
              ]);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg font-semibold text-sm transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Analysis
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-3">Recent Chats</p>
          <div className="space-y-1.5">
            {chatHistory.length === 0 ? (
              <div className="px-3 py-8 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-xs text-gray-400">No conversations yet</p>
                <p className="text-xs text-gray-400 mt-1">Start analyzing!</p>
              </div>
            ) : (
              chatHistory.slice().reverse().map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setCurrentChatId(chat.id);
                    setMessages(chat.messages);
                  }}
                  className={`group px-3 py-3 rounded-xl cursor-pointer transition-all ${
                    currentChatId === chat.id 
                      ? "bg-gradient-to-r from-purple-50 to-pink-50 shadow-sm" 
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <svg className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      currentChatId === chat.id ? "text-pink-500" : "text-gray-400 group-hover:text-gray-600"
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        currentChatId === chat.id ? "text-gray-900" : "text-gray-700"
                      }`}>
                        {chat.title || "New conversation"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(chat.timestamp || chat.id).toLocaleString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200 mt-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">Pro Plan</p>
                <p className="text-xs text-gray-600 truncate">Unlimited insights</p>
              </div>
              <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col h-full relative bg-white">

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Instagram username..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition-all"
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="hidden sm:inline">AI Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6 bg-gradient-to-b from-gray-50/50 to-white">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 p-0.5 shadow-md">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div 
                    className={`text-[15px] leading-relaxed shadow-sm
                    ${msg.role === "user" 
                      ? "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white rounded-[20px] rounded-tr-md px-5 py-3.5" 
                      : "bg-white text-gray-800 rounded-[20px] rounded-tl-md border border-gray-200 px-6 py-4"}`}
                  >
                    {msg.role === "user" ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <FormattedAIResponse content={msg.content} />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start w-full">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 p-0.5 shadow-md">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 px-6 py-4 rounded-[20px] rounded-tl-md shadow-sm flex gap-1.5">
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSend} className="relative">
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about content strategy, hooks, or growth insights..."
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white text-gray-900 placeholder-gray-400 transition-all text-[15px]"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || loading}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all transform ${
                    input.trim() && !loading
                      ? "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95" 
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 px-1">
                AI-powered Instagram growth insights • Ask anything
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}