import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { registrationId } = await request.json();

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    // Use service role for admin operations (no session persistence)
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

    // 1. Create auth user using service role
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
      // If user already exists, update their password
      if (createError.message?.includes("already exists") || createError.status === 409) {
        const { data: users } = await supabase.auth.admin.listUsers();
        const found = users?.users?.find((u: any) => u.email && u.email.toLowerCase() === email);
        if (found) {
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            found.id,
            { password: defaultPin }
          );
          if (updateError) throw new Error(`Failed to update auth user: ${updateError.message}`);

          // Now verify the password works by signing in with anon client
          const anonClient = createClient(supabaseUrl, supabaseAnonKey);
          const { data: verified } = await anonClient.auth.signInWithPassword({
            email,
            password: defaultPin,
          });
          if (!verified?.user) {
            throw new Error("Password was set but login verification failed");
          }
          // Sign out the anon session
          await anonClient.auth.signOut();

          // Update registration + create student record with found.id
          await updateStudentAndRegistration(supabase, registration, found.id, email, fullName, courseName, registrationId, defaultPin);
          return NextResponse.json({
            message: "Student enrolled successfully (updated existing)",
            data: { email, defaultPin },
          });
        }
      }
      throw new Error(`Failed to create auth user: ${createError.message}`);
    }

    if (!newUser?.user) {
      throw new Error("No user returned from auth creation");
    }

    const authUserId = newUser.user.id;

    // 2. Verify the password works by actually signing in
    const anonClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: signInTest, error: signInError } = await anonClient.auth.signInWithPassword({
      email,
      password: defaultPin,
    });

    if (signInError || !signInTest?.user) {
      throw new Error(`Password verification failed: ${signInError?.message || "Unknown"}`);
    }

    // Sign out the test session
    await anonClient.auth.signOut();

    // 3. Get course ID from course title
    const { data: course } = await supabase
      .from("courses")
      .select("id")
      .ilike("title", `%${courseName}%`)
      .limit(1)
      .maybeSingle();

    // 4. Create students table record
    const { error: insertStudentError } = await supabase
      .from("students")
      .insert({
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

    if (insertStudentError) throw new Error(`Failed to create student: ${insertStudentError.message}`);

    // 5. Update registration status to enrolled
    const { error: updateRegError } = await supabase
      .from("student_registrations")
      .update({ status: "enrolled" })
      .eq("id", registrationId);

    if (updateRegError) throw new Error(`Failed to update registration status: ${updateRegError.message}`);

    // 6. Create a notification
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
    return NextResponse.json({ error: err.message || "Failed to enroll student" }, { status: 500 });
  }
}

// Helper: update existing student's registration + record
async function updateStudentAndRegistration(
  supabase: any,
  registration: any,
  authUserId: string,
  email: string,
  fullName: string,
  courseName: string,
  registrationId: string,
  defaultPin: string
) {
  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .ilike("title", `%${courseName}%`)
    .limit(1)
    .maybeSingle();

  const { data: existingStudent } = await supabase
    .from("students")
    .select("id")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (existingStudent) {
    await supabase.from("students").update({
      full_name: fullName, email,
      phone: registration.phone_whatsapp, sex: registration.sex,
      country: registration.country, state: registration.state,
      course_id: course?.id || null, status: "active",
    }).eq("id", existingStudent.id);
  } else {
    await supabase.from("students").insert({
      auth_user_id: authUserId, full_name: fullName, email,
      phone: registration.phone_whatsapp, sex: registration.sex,
      country: registration.country, state: registration.state,
      course_id: course?.id || null, registration_id: registrationId,
      status: "active",
    });
  }

  await supabase.from("student_registrations").update({ status: "enrolled" }).eq("id", registrationId);

  await supabase.from("notifications").insert({
    title: "Student Enrolled",
    message: `${fullName} has been enrolled in ${courseName}`,
    category: "student", status: "unread", link: "/admin/students",
  });
}