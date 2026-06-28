"use client";

import { useState, useEffect } from "react";

type Registration = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
};

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/registrations");
      const json = await res.json();
      if (json.success) {
        setRegistrations(json.data);
      } else {
        setError(json.error || "Failed to fetch");
      }
    } catch {
      setError("Could not load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = registrations.filter(
    (r) => new Date(r.createdAt) >= today
  ).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-normal text-white">📋 Registrations</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Live from Supabase (PostgreSQL)
            </p>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition cursor-pointer"
          >
            ⟳ Refresh
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6 inline-block min-w-[200px]">
          <p className="text-3xl font-medium text-green-500">
            {registrations.length}
          </p>
          <p className="text-xs text-zinc-600 uppercase tracking-widest mt-1">
            Total Registrations
          </p>
        </div>

        {/* Desktop table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hidden sm:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-medium">
                  Name
                </th>
                <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-medium">
                  Email
                </th>
                <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-medium">
                  Date
                </th>
                <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-600">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-red-500">
                    ⚠️ {error}
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-600">
                    No registrations yet 🙃
                  </td>
                </tr>
              ) : (
                registrations.map((r) => (
                  <tr key={r.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                    <td className="p-4 text-sm text-zinc-300">{r.fullName}</td>
                    <td className="p-4 text-sm text-zinc-400">{r.email}</td>
                    <td className="p-4 text-sm text-zinc-500">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-500 border border-green-500/20">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="block sm:hidden space-y-3">
          {loading ? (
            <div className="p-8 text-center text-zinc-600">Loading...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">⚠️ {error}</div>
          ) : registrations.length === 0 ? (
            <div className="p-8 text-center text-zinc-600">No registrations yet 🙃</div>
          ) : (
            registrations.map((r) => (
              <div key={r.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
                <p className="text-sm text-zinc-300 font-medium">{r.fullName}</p>
                <p className="text-sm text-zinc-400">{r.email}</p>
                <p className="text-sm text-zinc-500">
                  {new Date(r.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-500 border border-green-500/20">
                    Active
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}