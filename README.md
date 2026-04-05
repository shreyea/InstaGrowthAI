## Instagram AI Growth Analyzer

> An AI-powered Instagram analytics platform that helps content creators and marketers understand what works, what doesn't, and how to optimize their Instagram strategy using advanced data analysis and AI insights.

![Instagram AI](https://img.shields.io/badge/Instagram-Analytics-E4405F?style=for-the-badge&logo=instagram&logoColor=white)
![AI Powered](https://img.shields.io/badge/AI-Powered-00D9FF?style=for-the-badge&logo=google&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)

---

## Live Demo

- Try the app: [insta-growth-ai.vercel.app](https://insta-growth-ai.vercel.app)

---

##  Features

###  **AI-Powered Insights**
- **Smart Content Analysis**: Analyzes your Instagram posts to identify patterns in high-performing vs low-performing content
- **Keyword Intelligence**: Discovers which keywords and themes drive the most engagement
- **Hook Analysis**: Identifies the most effective hook types for your audience
- **Performance Predictions**: Understands what makes content viral based on real data

###  **Advanced Analytics**
- **Engagement Metrics**: Track likes, comments, and overall engagement rates
- **Content Type Analysis**: Compare performance across posts, reels, and carousels
- **Timing Insights**: Understand when your audience is most active
- **Competitive Intelligence**: Compare your strategy with industry trends

###  **Actionable Recommendations**
- **Content Ideas**: AI generates personalized content ideas based on your winning patterns
- **Hook Templates**: Get proven hook formulas from your best-performing posts
- **Growth Strategies**: Receive specific action steps to improve engagement
- **Trend Alerts**: Stay ahead with insights on emerging content patterns

###  **Conversational AI Interface**
- **Chat History**: Persistent chat sessions with full conversation memory
- **Multi-Account Support**: Analyze different Instagram accounts in separate sessions
- **Smart Formatting**: Beautiful, easy-to-read AI responses with color-coded sections
- **Copy & Share**: One-click copy functionality for all insights

---

## Tech Stack

### **Frontend**
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **LocalStorage API** - Client-side chat persistence

### **Backend**
- **[Express.js](https://expressjs.com/)** - REST API server
- **[Node.js](https://nodejs.org/)** - Runtime environment
- **[Axios](https://axios-http.com/)** - HTTP client for API calls

### **AI & APIs**
- **[Google Gemini 2.5 Flash](https://ai.google.dev/)** - Primary AI model for insights
- **[OpenRouter](https://openrouter.ai/)** - Fallback AI provider (DeepSeek)
- **[Apify Instagram Scraper](https://apify.com/)** - Instagram data extraction

### **Additional Libraries**
- **[CORS](https://www.npmjs.com/package/cors)** - Cross-origin resource sharing
- **[dotenv](https://www.npmjs.com/package/dotenv)** - Environment variable management
- **[Lucide React](https://lucide.dev/)** - Icon library

---


##  Usage

### **1. Start a New Analysis**
- Click the "**+ New Analysis**" button
- Enter an Instagram username (e.g., `@nike`, `@viralcontent`)
- Start asking questions about their content strategy

### **2. Ask Questions**
```
Examples:
- "What content performs best for this account?"
- "Generate 10 content ideas based on top posts"
- "What hooks should I use?"
- "Why are some posts underperforming?"
```

### **3. Get AI Insights**
The AI analyzes:
-  Top performing posts vs low performing
-  Winning keywords and phrases
-  Best hook types and content formats
-  Engagement patterns and trends

### **4. Multiple Sessions**
- Each chat is saved automatically
- Switch between different accounts
- All conversations persist in your browser
- Click any saved chat to restore the full context


---

## 🔧 Configuration

### **AI Models**
The app uses a **primary + fallback** AI strategy:

**Primary:** Google Gemini 2.5 Flash
- Fast, high-quality responses
- Cost-effective
- Handles complex analysis

**Fallback:** DeepSeek via OpenRouter
- Activates if Gemini fails
- Ensures 99.9% uptime

### **Instagram Scraping**
- Uses Apify's Instagram Profile Scraper
- Fetches latest 25 posts per account
- Extracts: captions, likes, comments, timestamps, post types

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 🙏 Acknowledgments

- **Google Gemini** for powering the AI insights
- **Apify** for Instagram data extraction
- **OpenRouter** for fallback AI capabilities
- **Next.js** team for the amazing framework
- **Tailwind CSS** for beautiful styling

---

