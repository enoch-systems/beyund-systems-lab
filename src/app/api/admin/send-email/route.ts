import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendApplicationReceivedEmail, sendEnrollmentConfirmedEmail } from "@/server/services/email.service";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { registrationId, emailType } = await request.json();

    if (!registrationId || !emailType) {
      return NextResponse.json({ error: "registrationId and emailType are required" }, { status: 400 });
    }

    if (!["welcome", "enrollment"].includes(emailType)) {
      return NextResponse.json({ error: "emailType must be 'welcome' or 'enrollment'" }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the registration
    const { data: registration, error: regError } = await supabase
      .from("student_registrations")
      .select("*")
      .eq("id", registrationId)
      .single();

    if (regError || !registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    const email = registration.email.trim().toLowerCase();
    const fullName = registration.full_name.trim();
    const courseName = registration.course_applying_for;

    let result: { success: boolean; error?: string } = { success: false };

    if (emailType === "welcome") {
      // Send Welcome Email #1 (payment instructions)
      try {
        await sendApplicationReceivedEmail({
          to: email,
          fullName,
          course: courseName,
        });
        result = { success: true };
      } catch (err: any) {
        result = { success: false, error: err.message };
      }
    } else if (emailType === "enrollment") {
      if (registration.status !== "enrolled") {
        return NextResponse.json({
          error: "Student must be enrolled before sending enrollment email. Click 'Enroll' first.",
        }, { status: 400 });
      }

      // Get student for auth_user_id
      const { data: student } = await supabase
        .from("students")
        .select("id")
        .eq("registration_id", registrationId)
        .maybeSingle();

      const portalUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://beyund-systems-lab.vercel.app";

      try {
        await sendEnrollmentConfirmedEmail({
          to: email,
          fullName,
          course: courseName,
          defaultPin: "123456",
          portalUrl,
        });
        result = { success: true };
      } catch (err: any) {
        result = { success: false, error: err.message };
      }
    }

    // Log the email attempt
    const { error: logError } = await supabase
      .from("email_logs")
      .insert({
        registration_id: registrationId,
        student_id: null, // Will be set if student exists
        email_type: emailType,
        recipient_email: email,
        status: result.success ? "sent" : "failed",
        error_message: result.error || null,
      });

    if (logError) {
      console.error("Failed to log email:", logError);
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Send email error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to send email" }, { status: 500 });
  }
}