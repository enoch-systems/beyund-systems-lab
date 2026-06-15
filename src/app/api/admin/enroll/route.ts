import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { registrationId } = await request.json();

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    // Service role client — no session, no cookies, just admin API calls
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Get the student registration
    const { data: registration, error: regError } = await supabase
      .from("student_registrations")
      .select("*")
      .eq("id", registrationId)
      .single();

    if (regError || !registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    if (registration.status === "enrolled") {
      return NextResponse.json({ error: "Student is already enrolled" }, { status: 400 });
    }

    const email = registration.email.trim().toLowerCase();
    const fullName = registration.full_name.trim();
    const defaultPin = "123456";
    const courseName = registration.course_applying_for;

    // 1. Create or update auth user
    let authUserId: string;

    // Try to create the user first
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: defaultPin,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: "student",
      },
    });

    if (createError) {
      // User already exists — find and update password
      if (
        createError.status === 409 ||
        createError.message?.toLowerCase().includes("already")
      ) {
        const { data: users } = await supabase.auth.admin.listUsers();
        const found = users?.users?.find(
          (u) => u.email && u.email.toLowerCase() === email
        );
        if (!found) {
          throw new Error(`Could not find existing user for ${email}`);
        }
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          found.id,
          { password: defaultPin }
        );
        if (updateError) {
          throw new Error(`Failed to reset password: ${updateError.message}`);
        }
        authUserId = found.id;
      } else {
        throw new Error(`Failed to create auth user: ${createError.message}`);
      }
    } else {
      if (!newUser?.user) {
        throw new Error("No user returned from auth creation");
      }
      authUserId = newUser.user.id;
    }

    // 2. Get course ID
    const { data: course } = await supabase
      .from("courses")
      .select("id")
      .ilike("title", `%${courseName}%`)
      .limit(1)
      .maybeSingle();

    // 3. Create or update students table record
    const { data: existingStudent } = await supabase
      .from("students")
      .select("id")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (existingStudent) {
      const { error: updateErr } = await supabase
        .from("students")
        .update({
          full_name: fullName,
          email,
          phone: registration.phone_whatsapp,
          sex: registration.sex,
          country: registration.country,
          state: registration.state,
          course_id: course?.id || null,
          status: "active",
        })
        .eq("id", existingStudent.id);
      if (updateErr) throw new Error(`Failed to update student: ${updateErr.message}`);
    } else {
      const { error: insertErr } = await supabase.from("students").insert({
        auth_user_id: authUserId,
        full_name: fullName,
        email,
        phone: registration.phone_whatsapp,
        sex: registration.sex,
        country: registration.country,
        state: registration.state,
        course_id: course?.id || null,
        registration_id: registrationId,
        status: "active",
      });
      if (insertErr) throw new Error(`Failed to create student: ${insertErr.message}`);
    }

    // 4. Update registration status
    const { error: updateRegError } = await supabase
      .from("student_registrations")
      .update({ status: "enrolled" })
      .eq("id", registrationId);
    if (updateRegError) {
      throw new Error(`Failed to update registration: ${updateRegError.message}`);
    }

    // 5. Create notification
    await supabase.from("notifications").insert({
      title: "Student Enrolled",
      message: `${fullName} has been enrolled in ${courseName}`,
      category: "student",
      status: "unread",
      link: "/admin/students",
    });

    return NextResponse.json({
      message: "Student enrolled successfully",
      data: { email, defaultPin },
    });
  } catch (err: any) {
    console.error("Enroll API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to enroll student" },
      { status: 500 }
    );
  }
}
