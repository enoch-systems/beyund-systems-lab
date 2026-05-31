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
  status: "pending" | "contacted" | "enrolled" | "rejected";
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "super_admin";
}