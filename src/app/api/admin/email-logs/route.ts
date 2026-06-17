import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get("registrationId");

    // Stubbed email logs response until email logging backend is implemented.
    const data = registrationId
      ? [{ id: "stub-1", registration_id: registrationId, status: "sent", created_at: new Date().toISOString() }]
      : [];

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("Email logs error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
