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
  
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // Check if user already exists by trying to get them
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => u.email === email);

    if (existingUser) {
      // Update existing user's password
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { password: defaultPin }
      );
      if (updateError) throw new Error(`Failed to update auth user: ${updateError.message}`);
      authUserId = existingUser.id;
    } else {
      // Create new auth user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: defaultPin,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          role: "student",
        },
      });

      if (createError) throw new Error(`Failed to create auth user: ${createError.message}`);
      if (!newUser?.user) throw new Error("No user returned from auth creation");
      authUserId = newUser.user.id;
    }

    // 2. Get course ID from course title
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
      // Update existing student
      const { error: updateStudentError } = await supabase
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

      if (updateStudentError) throw new Error(`Failed to update student: ${updateStudentError.message}`);
    } else {
      // Create new student
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
    }

    // 4. Update registration status to enrolled
    const { error: updateRegError } = await supabase
      .from("student_registrations")
      .update({
        status: "enrolled",
      })
      .eq("id", registrationId);

    if (updateRegError) throw new Error(`Failed to update registration status: ${updateRegError.message}`);

    // 5. Create a notification
    await supabase
      .from("notifications")
      .insert({
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