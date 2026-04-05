# 🚀 Deployment Guide

This project has TWO parts that deploy separately:
- **Frontend**: Next.js app → Deploy to **Vercel**
- **Backend**: Express API → Deploy to **Render**

---

## 📦 Part 1: Deploy Backend to Render

### Step 1: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:

```
Name: insta-ai-backend
Region: Choose closest to you
Branch: main
Root Directory: (leave blank)
Runtime: Node
Build Command: npm install
Start Command: npm run server
Instance Type: Free
```

### Step 2: Add Environment Variables on Render

In Render dashboard → Environment tab, add:

```
GEMINI_API_KEY=your_gemini_api_key_here
APIFY_API_TOKEN=your_apify_token_here
OPENROUTER_API_KEY=your_openrouter_key_here
PORT=(Render sets this automatically - don't add)
```

**Get your keys from:**
- Gemini: https://makersuite.google.com/app/apikey
- Apify: https://console.apify.com/account/integrations
- OpenRouter: https://openrouter.ai/keys

### Step 3: Deploy

Click **"Create Web Service"**

Wait for deployment. Note your backend URL:
```
https://insta-ai-backend.onrender.com
```

---

## 🌐 Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Import your GitHub repository
3. Configure:

```
Framework Preset: Next.js (auto-detected)
Root Directory: (leave blank)
Build Command: npm run build (auto)
Output Directory: .next (auto)
Install Command: npm install (auto)
```

### Step 2: Add Environment Variables on Vercel

In Vercel dashboard → Settings → Environment Variables, add:

```
NEXT_PUBLIC_API_URL=https://insta-ai-backend.onrender.com
```

**Important:** Replace with YOUR actual Render URL from Part 1!

### Step 3: Deploy

Click **"Deploy"**

Your frontend will be at:
```
https://your-app.vercel.app
```

---

## ✅ Testing Your Deployment

1. Open your Vercel URL: `https://your-app.vercel.app`
2. Enter an Instagram username
3. Ask a question
4. The frontend (Vercel) calls the backend (Render)
5. Backend scrapes Instagram and calls AI
6. Response comes back to frontend

---

## 🔧 Troubleshooting

### Backend (Render) Issues:

**Error: "next: not found"**
- ✅ Fixed: Use `npm run server` NOT `npm run build`

**Error: "Port already in use"**
- ✅ Fixed: server.js now uses `process.env.PORT`

**Error: "GEMINI_API_KEY is undefined"**
- Add environment variables in Render dashboard

### Frontend (Vercel) Issues:

**Error: "scrapeInstagram is not defined"**
- ✅ Fixed: Removed broken Next.js API route

**Error: "Failed to fetch"**
- Check `NEXT_PUBLIC_API_URL` in Vercel env vars
- Make sure Render backend is running
- Check Render logs for errors

**CORS errors:**
- ✅ Fixed: server.js already has CORS enabled

---

## 📁 What Goes Where?

### Deployed to Render (Backend):
```
server/
  ├── server.js      ← Express server
  ├── routes.js      ← API endpoints
  ├── scraper.js     ← Instagram scraping
  └── processor.js   ← Data analysis
package.json         ← Dependencies
.env (via Render)    ← API keys
```

### Deployed to Vercel (Frontend):
```
app/
  ├── page.js        ← Home page
  ├── layout.js      ← Root layout
  └── globals.css    ← Styles
components/
  └── ChatUI.jsx     ← Main UI
next.config.js       ← Next.js config
tailwind.config.js   ← Tailwind config
package.json         ← Dependencies
```

---

## 🎯 Quick Commands

**Local Development:**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

**Production URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`
- API endpoint: `https://your-backend.onrender.com/api/chat`

---

## ⚡ Important Notes

1. **Free Tier Limitations:**
   - Render: Server spins down after 15 min inactivity (first request may be slow)
   - Vercel: Unlimited bandwidth, but functions timeout at 10s on free tier

2. **Environment Variables:**
   - Backend keys: Add to **Render** only
   - Frontend URL: Add to **Vercel** as `NEXT_PUBLIC_API_URL`
   - Never commit `.env` to git!

3. **Custom Domain (Optional):**
   - Vercel: Settings → Domains → Add custom domain
   - Render: Settings → Custom Domain → Add domain

---

**Need help?** Check the logs:
- Render: Dashboard → Logs
- Vercel: Dashboard → Deployments → Click deployment → View Function Logs
