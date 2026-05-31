export interface Registration {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  program_interest: string;
  experience_level: string;
  message?: string;
  created_at: string;
}

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  program_interest: string;
  experience_level: string;
  message?: string;
  status: "pending" | "contacted" | "enrolled" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "super_admin";
}