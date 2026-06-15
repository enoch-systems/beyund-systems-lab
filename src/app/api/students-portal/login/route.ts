import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Check if user exists in students table
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("*")
      .eq("auth_user_id", data.user.id)
      .single();

    if (studentError || !student) {
      // Sign out since they're not a registered student
      await supabase.auth.admin.deleteUser(data.user.id);
      return NextResponse.json({ error: "Access denied. You are not registered as a student." }, { status: 403 });
    }

    if (student.status === "suspended") {
      return NextResponse.json({ error: "Your account has been suspended. Contact admin." }, { status: 403 });
    }

    return NextResponse.json({
      user: {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
        course_id: student.course_id,
      },
      session: data.session,
    });
  } catch (err) {
    console.error("Student login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}