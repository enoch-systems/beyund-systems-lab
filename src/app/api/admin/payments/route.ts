export const runtime = "nodejs";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}) as any);
    const res = await fetch(`${BACKEND}/registrations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return new Response(JSON.stringify(data), { status: res.status, headers: { "Content-Type": "application/json" } });
    return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ message: "Invalid request" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
}