import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyEmail } from "@/lib/email-verification";

/**
 * POST /api/registrations
 * Handles new student registration form submissions from the landing page.
 * Runs professional email verification before inserting into Supabase.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { full_name, email, phone_whatsapp, sex, country, state, course_applying_for, employment_status, has_laptop, heard_about_us, learning_reason } = body;

    // Validate required fields
    if (!full_name || !email || !phone_whatsapp || !sex || !country || !course_applying_for || !employment_status || !has_laptop || !heard_about_us || !learning_reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Server-side professional email verification (Abstract API → SMTP fallback)
    const emailResult = await verifyEmail(email.trim().toLowerCase());
    if (!emailResult.deliverable) {
      return NextResponse.json(
        { error: `Email verification failed: ${emailResult.message}` },
        { status: 400 }
      );
    }

    // Use service role key for server-side operations (bypasses RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert into the student_registrations table
    const { data, error } = await supabase
      .from("student_registrations")
      .insert({
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        phone_whatsapp: phone_whatsapp.trim(),
        sex,
        country,
        state: state || null,
        course_applying_for,
        employment_status,
        has_laptop,
        heard_about_us,
        learning_reason: learning_reason.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save registration" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Registration submitted successfully", data },
      { status: 201 }
    );
  } catch (err) {
    console.error("Registration API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/registrations
 * Fetch all registrations. Protected by proxy (admin only).
 * Ordered by newest first (created_at DESC).
 */
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from("student_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch registrations" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error("Registration fetch error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}