import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Create Directories
const dirs = ['app', 'app/api', 'app/api/chat', 'components'];
dirs.forEach(d => {
    const p = path.join(__dirname, d);
    if (!fs.existsSync(p)) {
        fs.mkdirSync(p, { recursive: true });
        console.log(`Created directory: ${d}`);
    }
});

// 2. File Contents
const files = {
    'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: "#0a0f2c",
        glass: "rgba(255, 255, 255, 0.05)",
        teal: {
          DEFAULT: "#14b8a6",
          dark: "#0d9488",
          glow: "#2dd4bf",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
};`,

    'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,

    'app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #0a0f2c;
  color: #e2e8f0;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}`,

    'app/layout.js': `import "./globals.css";

export const metadata = {
  title: "Insta AI | Smart Analysis",
  description: "AI-powered Instagram growth insights",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden antialiased">{children}</body>
    </html>
  );
}`,

    'app/page.js': `import ChatUI from "../components/ChatUI";

export default function Home() {
  return <ChatUI />;
}`,

    'app/api/chat/route.js': `import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { query } = await req.json();
    
    // TODO: Integrate actual AI logic here.
    // For now, we simulate a "Thinking..." delay and return a mock response.
    
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate thinking

    const mockResponse = "This is a simulated AI response for: " + query + ".\\n\\nThe backend integration is ready. You can now connect this to the OpenAI/Gemini logic in 'test-ai.js'.";

    return NextResponse.json({ response: mockResponse });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}`,

    'components/ChatUI.jsx': `"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your Instagram Growth AI. How can I help you analyze your content today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMsg.content }),
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
    <div className="flex h-screen bg-royal text-slate-200 font-sans selection:bg-teal-500/30">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:flex flex-col w-64 glass-panel p-4 border-r border-white/5">
        <button 
          onClick={() => setMessages([{ role: "assistant", content: "Hello! I'm your Instagram Growth AI. How can I help you analyze your content today?" }])}
          className="flex items-center gap-3 px-4 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-all shadow-lg shadow-teal-900/20 font-medium text-sm"
        >
          <span className="text-xl">+</span> New Chat
        </button>

        <div className="mt-8 flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Recent</p>
          <div className="space-y-1">
            {/* Placeholder History Items */}
            {["Content Strategy", "Viral Hooks", "Hashtag Analysis"].map((item, i) => (
              <div key={i} className="px-3 py-2 rounded-md hover:bg-white/5 cursor-pointer text-sm text-slate-400 hover:text-teal-200 transition-colors truncate">
                {item}
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500"></div>
            <div className="text-sm">
              <p className="font-medium text-white">Insta Pro</p>
              <p className="text-xs text-slate-500">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Header (Mobile Only) */}
        <div className="md:hidden p-4 border-b border-white/5 flex items-center justify-between glass-panel z-10">
          <span className="font-bold text-teal-400">Insta AI</span>
          <button className="text-slate-400">☰</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-8 space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={\`flex w-full \${msg.role === "user" ? "justify-end" : "justify-start"}\`}
              >
                <div 
                  className={\`
                    max-w-[85%] md:max-w-[75%] px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed
                    \${msg.role === "user" 
                      ? "bg-teal-600 text-white rounded-br-sm shadow-teal-900/20" 
                      : "bg-white/5 border border-white/5 text-slate-100 rounded-bl-sm backdrop-blur-sm"}
                  \`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start w-full">
                <div className="bg-white/5 border border-white/5 px-5 py-4 rounded-2xl rounded-bl-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-[#0a0f2c] via-[#0a0f2c] to-transparent">
          <div className="max-w-3xl mx-auto relative">
            <form onSubmit={handleSend} className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your content strategy..."
                className="w-full bg-[#131938] border border-white/10 rounded-xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 text-slate-200 placeholder-slate-500 shadow-2xl transition-all"
              />
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 top-2 bottom-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:hover:bg-teal-600 text-white p-2 rounded-lg transition-colors aspect-square flex items-center justify-center shadow-lg shadow-teal-900/30"
              >
                <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
                </svg>
              </button>
            </form>
            <p className="text-center text-xs text-slate-600 mt-3">
              AI can make mistakes. Review generated insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}`
};

// 3. Write Files
Object.entries(files).forEach(([name, content]) => {
    fs.writeFileSync(path.join(__dirname, name), content);
    console.log(`Created file: ${name}`);
});

// 4. Update Package.json
const pkgPath = path.join(__dirname, 'package.json');
if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    
    // Dependencies needed for Next.js App Router + Tailwind
    pkg.dependencies = { 
        ...pkg.dependencies, 
        "next": "^14.1.0", 
        "react": "^18.2.0", 
        "react-dom": "^18.2.0",
        "lucide-react": "^0.344.0" // for icons if needed
    };
    
    pkg.devDependencies = { 
        ...pkg.devDependencies, 
        "tailwindcss": "^3.4.1", 
        "postcss": "^8.4.35", 
        "autoprefixer": "^10.4.17" 
    };

    pkg.scripts = {
        ...pkg.scripts,
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "lint": "next lint"
    };

    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    console.log('Updated package.json dependencies');
}
