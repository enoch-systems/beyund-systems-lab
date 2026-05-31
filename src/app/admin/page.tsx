"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { StudentRegistration } from "@/lib/types";

interface DashboardStats {
  totalStudents: number;
  pendingCount: number;
  enrolledCount: number;
  contactedCount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    pendingCount: 0,
    enrolledCount: 0,
    contactedCount: 0,
  });
  const [recentStudents, setRecentStudents] = useState<StudentRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    async function fetchDashboardData() {
      const { data: students } = await supabase
        .from("student_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (students) {
        setStats({
          totalStudents: students.length,
          pendingCount: students.filter((s: StudentRegistration) => s.status === "pending").length,
          enrolledCount: students.filter((s: StudentRegistration) => s.status === "enrolled").length,
          contactedCount: students.filter((s: StudentRegistration) => s.status === "contacted").length,
        });
        setRecentStudents(students.slice(0, 5));
      }
      setLoading(false);
    }

    fetchDashboardData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      bgColor: "bg-cyan-500/10",
      textColor: "text-cyan-400",
    },
    {
      label: "Pending Review",
      value: stats.pendingCount,
      bgColor: "bg-yellow-500/10",
      textColor: "text-yellow-400",
    },
    {
      label: "Contacted",
      value: stats.contactedCount,
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
    },
    {
      label: "Enrolled",
      value: stats.enrolledCount,
      bgColor: "bg-green-500/10",
      textColor: "text-green-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border border-gray-800 ${card.bgColor} p-6`}
          >
            <p className="text-sm text-gray-400">{card.label}</p>
            <p className={`text-3xl font-bold mt-2 ${card.textColor}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Registrations */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="font-semibold">Recent Registrations</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {recentStudents.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No registrations yet.
            </div>
          ) : (
            recentStudents.map((student) => (
              <div
                key={student.id}
                className="px-6 py-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium shrink-0">
                    {student.full_name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {student.full_name}
                    </p>
                    <p className="text-sm text-gray-400 truncate">
                      {student.email}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.status === "enrolled"
                        ? "bg-green-500/10 text-green-400"
                        : student.status === "contacted"
                          ? "bg-blue-500/10 text-blue-400"
                          : student.status === "rejected"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {student.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(student.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}