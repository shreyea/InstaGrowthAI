import express from "express";
import axios from "axios";
import { scrapeInstagram } from "./scraper.js";
import { buildAdvancedInsights } from "./processor.js";

const router = express.Router();
const memoryStore = new Map();
// -----------------------------
// SCRAPE ROUTE
// -----------------------------
router.get("/scrape", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }

  try {
    const posts = await scrapeInstagram(username);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Scraping failed" });
  }
});

// -----------------------------
// CHAT ROUTE (NOW USING SCRAPER)

router.post("/chat", async (req, res) => {
  const { query, username, sessionId = "default" } = req.body;

  try {
    // -----------------------------
    //  MEMORY LOAD
    // -----------------------------
    let history = memoryStore.get(sessionId) || [];

    // -----------------------------
    //  USERNAME EXTRACTION
    // -----------------------------
    let user = username;

    if (!user) {
      const match = query.match(/@([a-zA-Z0-9._]+)/);
      if (match) user = match[1];
    }

    if (!user && history.length === 0) {
      return res.json({
        response: "Please provide an Instagram username (e.g., @virat.kohli).",
      });
    }

    // -----------------------------
    // REMEMBER LAST USERNAME
    // -----------------------------
    if (user) {
      memoryStore.set(sessionId + "_username", user);
    } else {
      user = memoryStore.get(sessionId + "_username");
    }

    console.log(" Using username:", user);

    // -----------------------------
    //  SCRAPE + PROCESS
    // -----------------------------
    const posts = await scrapeInstagram(user);

    if (!posts.length) {
      return res.json({
        response: "Could not fetch Instagram data.",
      });
    }

    const insights = buildAdvancedInsights(posts);

    // -----------------------------
    //  BUILD CONTEXT (SHORTER)
    // -----------------------------
    const context = `
User is analyzing Instagram account: ${user}

Avg Engagement: ${insights.metrics.avgEngagement}
Best Hook Type: ${insights.metrics.bestHookType}
Best Content Type: ${insights.metrics.bestContentType}

Winning Keywords:
${insights.whatWorks.map(k => `${k.word} (${Math.round(k.lift)}%)`).join(", ")}

Top Hooks:
${insights.hookTemplates.join("\n")}
`;

    // -----------------------------
    // ADD USER MESSAGE
    // -----------------------------
    history.push({
      role: "user",
      content: query,
    });

    // limit memory
    if (history.length > 10) {
      history = history.slice(-10);
    }

    // -----------------------------
    //  FINAL PROMPT 
    // -----------------------------
    const finalPrompt = `
You are an elite Instagram strategist.

Conversation History:
${history.map(h => `${h.role}: ${h.content}`).join("\n")}

DATA:
${context}

RULES:
- Remember previous conversation
- Stay consistent with same account
- Answer ONLY current query
- Use data to justify answers
- No generic advice

FORMAT YOUR RESPONSE WITH:
- Use these symbols for sections: [>] for insights, [#] for data, [*] for analysis, [!] for actions, [+] for ideas
- Use bullet points with - or • for lists
- Use **bold** for important keywords and metrics
- Keep sections short and scannable
- Start with the most important insight

Example format:
[>] Key Insight
Your main finding here with **bold metrics**

[#] Evidence
- Point one with **data**
- Point two with **numbers**

[!] Action Steps
- Clear actionable item
- Another specific recommendation
`;

    // -----------------------------
    //  AI CALL
    // -----------------------------
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const MODEL = "gemini-2.5-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
    let aiText = "";

    try {
      // PRIMARY: Google Gemini
      console.log(" Using: Google Gemini (Primary)");
      console.log(" Model:", MODEL);
      
      const response = await axios.post(url, {
        contents: [
          {
            role: "user",
            parts: [{ text: "You are an elite Instagram growth strategist. " + finalPrompt }]
          }
        ],
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 8192,
        }
      });

      aiText = response.data.candidates[0].content.parts[0].text;
      console.log(" Google Gemini response received");

    } catch (primaryErr) {
      console.log(" Google Gemini failed:", primaryErr.message);
      console.error(" Status:", primaryErr.response?.status);
      console.error(" Data:", primaryErr.response?.data);
      console.log(" Switching to fallback...");

      try {
        // FALLBACK: OpenRouter with DeepSeek
        console.log(" Using: OpenRouter DeepSeek (Fallback)");
        console.log(" Model: deepseek/deepseek-chat");
        
        const fallbackResponse = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "deepseek/deepseek-chat",
            messages: [
              {
                role: "system",
                content: "You are an elite Instagram growth strategist.",
              },
              {
                role: "user",
                content: finalPrompt,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        aiText = fallbackResponse.data.choices[0].message.content;
        console.log(" OpenRouter DeepSeek response received");

      } catch (fallbackErr) {
        console.error(" Both AI providers failed");
        console.error("Primary error:", primaryErr.message);
        console.error("Fallback error:", fallbackErr.message);
        throw new Error("All AI providers failed");
      }
    }

    // -----------------------------
    //  SAVE RESPONSE
    // -----------------------------
    history.push({
      role: "assistant",
      content: aiText,
    });

    memoryStore.set(sessionId, history);

    res.json({ response: aiText });

  } catch (err) {
    console.error(" CHAT ROUTE ERROR:", err.message);
    res.status(500).json({ 
      error: "Failed to process request",
      details: err.message 
    });
  }
});
// -----------------------------
// DEBUG ROUTE
// -----------------------------
router.get("/insights", async (req, res) => {
  const posts = await scrapeInstagram("instagram");
  const insights = buildAdvancedInsights(posts);
  res.json(insights);
});

// -----------------------------
export default router;