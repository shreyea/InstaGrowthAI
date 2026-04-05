import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { query } = await req.json();
    
    // TODO: Integrate actual AI logic here.
    // For now, we simulate a "Thinking..." delay and return a mock response.
    
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate thinking

    const mockResponse = "This is a simulated AI response for: " + query + ".\n\nThe backend integration is ready. You can now connect this to the OpenAI/Gemini logic in 'test-ai.js'.";

    return NextResponse.json({ response: mockResponse });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
const username = "instagram"; // later dynamic

const posts = await scrapeInstagram(username);
const insights = buildInsights(posts);