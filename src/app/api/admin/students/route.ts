export const runtime = "nodejs";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/registrations`, { next: { revalidate: 0 } });
    if (!res.ok) return new Response(JSON.stringify([]), { status: res.status, headers: { "content-type": "application/json" } });
    const data = await res.json();
    const mapped = (data || []).map((r: any) => ({
      id: String(r.id),
      full_name: r.fullName || r.full_name,
      email: r.email,
      phone_whatsapp: r.phoneWhatsapp || r.phone_whatsapp,
      country: r.country,
      state: r.state,
      course_applying_for: r.courseApplyingFor || r.course_applying_for,
      status: r.status || "pending",
      created_at: r.createdAt || r.created_at || new Date().toISOString(),
    }));
    return new Response(JSON.stringify(mapped), { headers: { "content-type": "application/json" } });
  } catch {
    return new Response(JSON.stringify([]), { headers: { "content-type": "application/json" } });
  }
}