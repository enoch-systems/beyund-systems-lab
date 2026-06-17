export const runtime = "nodejs";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

function hashStr(str: string) {
  let h = 0;
  for (let i = 0; i < (str || "").length; i++) h = (h * 31 + (str.charCodeAt(i) || 0)) >>> 0;
  return h;
}

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/registrations`, { next: { revalidate: 0 } });
    if (!res.ok) return new Response(JSON.stringify([]), { status: res.status, headers: { "content-type": "application/json" } });
    const data = await res.json();
    const mapped = (data || []).map((r: any) => {
      const id = String(r.id);
      const h = hashStr(id);
      const totalFee = 150000;
      const amountPaid = (h % 5 === 0) ? totalFee : (h % 3 === 0) ? Math.floor(totalFee * 0.6) : 0;
      const balance = totalFee - amountPaid;
      const status = amountPaid === 0 ? "pending" : amountPaid >= totalFee ? "paid" : "installment";
      return {
        id,
        student_id: id,
        total_fee: totalFee,
        amount_paid: amountPaid,
        balance,
        payment_status: status,
        updated_at: r.createdAt || r.created_at || new Date().toISOString(),
      };
    });
    return new Response(JSON.stringify(mapped), { headers: { "content-type": "application/json" } });
  } catch {
    return new Response(JSON.stringify([]), { headers: { "content-type": "application/json" } });
  }
}