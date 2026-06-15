import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get("registrationId");

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let query = supabase
      .from("email_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (registrationId) {
      query = query.eq("registration_id", registrationId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("Email logs error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}