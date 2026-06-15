export interface StudentRegistration {
  id: string;
  full_name: string;
  email: string;
  phone_whatsapp: string;
  sex: string;
  country: string;
  state?: string;
  course_applying_for: string;
  employment_status: string;
  has_laptop: string;
  heard_about_us: string;
  learning_reason: string;
  status: "pending" | "enrolled" | "restricted";
  created_at: string;
  // Lifecycle
  student_lifecycle?: "applied" | "accepted" | "active" | "completed" | "dropped";
  tags?: string[]; // "high_performer" | "at_risk" | "inactive"
  // Tuition
  tuition_status?: "paid" | "pending" | "partial" | "waived";
  receipt_id?: string;
  // Attendance
  attendance_percentage?: number;
  // Onboarding
  onboarding_complete?: boolean;
  // Certificate
  certificate_eligible?: boolean;
  certificate_issued?: boolean;
  certificate_date?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "super_admin";
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  instructor: string;
  cohort: string;
  start_date: string;
  end_date: string;
  status: "active" | "upcoming" | "completed";
  student_count: number;
  color: string;
}

export interface Assignment {
  id: string;
  title: string;
  course_id: string;
  course: string;
  cohort: string;
  due_date: string;
  total_students: number;
  submitted: number;
  status: "active" | "upcoming" | "completed";
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  student_name: string;
  course: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "system" | "academic" | "admin";
  priority: "low" | "medium" | "high" | "urgent";
  target: "all" | "course" | "cohort";
  course_id?: string;
  read: boolean;
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  student_id: string;
  student_name: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "partial" | "waived";
  reference_id: string;
  payment_date: string;
  notes?: string;
}

export interface Certificate {
  id: string;
  student_id: string;
  student_name: string;
  course: string;
  eligible: boolean;
  issued: boolean;
  issue_date?: string;
  certificate_id?: string;
}