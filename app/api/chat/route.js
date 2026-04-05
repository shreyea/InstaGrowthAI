// This API route is not used - using Express backend instead
// The actual API is at server/routes.js running on port 5000
export async function POST() {
  return new Response(JSON.stringify({ 
    error: "Use Express backend at port 5000" 
  }), { 
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}
