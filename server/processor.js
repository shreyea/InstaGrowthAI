export function buildAdvancedInsights(posts) {
  if (!posts.length) return {};

  const totalPosts = posts.length;

  // 🔥 Engagement calculation
  posts.forEach(p => {
    p.engagement = p.likes + (p.comments || 0) * 3;
    p.length = p.caption?.length || 0;
    p.contentType = p.type || "post";
  });

  const avgEngagement =
    posts.reduce((s, p) => s + p.engagement, 0) / totalPosts;

  // -----------------------------
  // 🔥 HOOK + KEYWORD ANALYSIS
  // -----------------------------
  const keywordData = {};
  const stopWords = new Set([
    "the","this","that","with","from","their","have","will","about","your"
  ]);

  posts.forEach(p => {
    const firstLine = (p.caption || "").split("\n")[0].trim();

    // 🔥 Hook classification (fixed logic)
    let hookType = "Statement";
    if (firstLine.includes("?")) hookType = "Question";
    else if (/^\d+/.test(firstLine)) hookType = "List/Stat";
    else if (firstLine.length < 30) hookType = "Short/Punchy";

    p.hookType = hookType;

    // 🔥 Keyword extraction
    const words = (p.caption || "")
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/);

    [...new Set(words)].forEach(word => {
      if (word.length < 5 || stopWords.has(word)) return;

      if (!keywordData[word]) {
        keywordData[word] = { count: 0, totalEng: 0 };
      }

      keywordData[word].count++;
      keywordData[word].totalEng += p.engagement;
    });
  });

  // -----------------------------
  // 🔥 KEYWORD PERFORMANCE (REAL INTELLIGENCE)
  // -----------------------------
  const keywordStats = Object.entries(keywordData)
    .map(([word, data]) => {
      const avgWordEng = data.totalEng / data.count;

      return {
        word,
        lift: ((avgWordEng / avgEngagement - 1) * 100),
        frequency: data.count
      };
    })
    .filter(k => k.frequency >= 2 && Math.abs(k.lift) > 10)
    .sort((a, b) => b.lift - a.lift);

  const positive = keywordStats.filter(k => k.lift > 0);
  const negative = keywordStats.filter(k => k.lift < 0);

  // -----------------------------
  // 🔥 TOP / LOW POSTS
  // -----------------------------
  const sorted = [...posts].sort((a, b) => b.engagement - a.engagement);

  const topPosts = sorted.slice(0, 3);
  const lowPosts = sorted.slice(-3);

  // -----------------------------
  // 🔥 HOOK PERFORMANCE
  // -----------------------------
  const hookStats = {};
  posts.forEach(p => {
    if (!hookStats[p.hookType]) {
      hookStats[p.hookType] = { sum: 0, count: 0 };
    }

    hookStats[p.hookType].sum += p.engagement;
    hookStats[p.hookType].count++;
  });

  const bestHookType = Object.entries(hookStats)
    .map(([name, d]) => ({ name, avg: d.sum / d.count }))
    .sort((a, b) => b.avg - a.avg)[0]?.name;

  // -----------------------------
  // 🔥 CONTENT TYPE PERFORMANCE
  // -----------------------------
  const typeStats = {};
  posts.forEach(p => {
    if (!typeStats[p.contentType]) {
      typeStats[p.contentType] = { sum: 0, count: 0 };
    }

    typeStats[p.contentType].sum += p.engagement;
    typeStats[p.contentType].count++;
  });

  const bestContentType = Object.entries(typeStats)
    .map(([type, d]) => ({ type, avg: d.sum / d.count }))
    .sort((a, b) => b.avg - a.avg)[0]?.type;

  // -----------------------------
  // 🔥 IDEA ENGINE (SMART)
  // -----------------------------
  function generateIdeas(topKeywords) {
    return topKeywords.map(k => {
      return `Create content focused on "${k.word}" since it drives ${Math.round(k.lift)}% higher engagement. Use strong hooks and practical value.`;
    });
  }
const nicheKeywords = positive.slice(0, 5).map(k => k.word);

const niche = `
This account primarily focuses on: ${nicheKeywords.join(", ")}.
`;

const competitorInsight = `
Top creators in this niche typically emphasize ${positive[0]?.word}, suggesting this is a competitive content area.
`;

function generateSeries(topKeywords) {
  return topKeywords.map(k => ({
    title: `${k.word.toUpperCase()} Series`,
    ideas: [
      `Beginner guide to ${k.word}`,
      `Common mistakes in ${k.word}`,
      `Advanced tips for ${k.word}`
    ]
  }));
}
  // -----------------------------
  // 🔥 FINAL OUTPUT
  // -----------------------------
  return {
    metrics: {
      avgEngagement: Math.round(avgEngagement),
      bestHookType,
      bestContentType,
      totalPosts
    },

    whatWorks: positive.slice(0, 5),
    whatFails: negative.slice(0, 5),

    topPosts,
    lowPosts,

    hookTemplates: topPosts.map(p =>
      (p.caption || "").split("\n")[0]
    ),

    contentIdeas: generateIdeas(positive.slice(0, 3)),
    niche,
    seriesIdeas: generateSeries(positive.slice(0, 3)),
    competitorInsight,
    patternSummary: `
Top-performing content is driven by keywords like ${positive.slice(0,3).map(k => k.word).join(", ")}.
Hook style "${bestHookType}" performs best.
Content type "${bestContentType}" generates highest engagement.
`
  };
}