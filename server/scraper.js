export async function scrapeInstagram(username) {
  try {
    console.log(" Scraping username:", username);

    const res = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_API_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernames: [username],
           resultsLimit: 25,
           addParentData: false,
        }),
      }
    );

    // 🔥 Check HTTP status
    if (!res.ok) {
      const text = await res.text();
      console.error(" API ERROR:", text);
      return [];
    }

    const data = await res.json();

    console.log(" RAW PROFILE DATA:", data?.[0]?.username || "No data");

    // 🔥 Handle Apify error response
    if (data?.[0]?.error) {
      console.error(" API ERROR:", data[0]);
      return [];
    }

    if (!data || !data.length) {
      console.log("No data returned");
      return [];
    }

    const profile = data[0];

    const posts = (profile.latestPosts || []).map((post) => ({
      caption: post.caption || "",
      likes: post.likesCount || 0,
      comments: post.commentsCount || 0,
      timestamp: post.timestamp || "",
      type: post.type || "post",
    }));

    console.log(`Extracted ${posts.length} posts`);

    return posts;

  } catch (err) {
    console.error(" SCRAPER CRASH:", err.message);
    return [];
  }
}