"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

const PER_PAGE = 7;

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
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ fullName: "", email: "" });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/registrations");
      const json = await res.json();
      if (json.success) {
        setRegistrations(json.data);
        setPage(1);
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

  const startEdit = (r: Registration) => {
    setEditingId(r.id);
    setEditForm({ fullName: r.fullName, email: r.email });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ fullName: "", email: "" });
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (json.success) {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === id ? json.data : r))
        );
        setEditingId(null);
      } else {
        alert(json.error || "Failed to save");
      }
    } catch {
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  const deleteReg = async (id: string) => {
    if (!confirm("Delete this registration?")) return;
    try {
      const res = await fetch(`/api/registrations/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setRegistrations((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert(json.error || "Failed to delete");
      }
    } catch {
      alert("Network error");
    }
  };

  const totalPages = Math.max(1, Math.ceil(registrations.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const paginated = registrations.slice(start, start + PER_PAGE);

  const goTo = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ---------- Pagination component ---------- */
  const Pagination = () => {
    if (totalPages <= 1) return null;
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);

    return (
      <div className="flex items-center justify-center gap-2 mt-5 pb-2">
        <button
          onClick={() => goTo(safePage - 1)}
          disabled={safePage <= 1}
          className="px-3 py-1.5 rounded-lg text-sm bg-zinc-800 text-zinc-400 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
        >
          ‹ Prev
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={`w-9 h-9 rounded-lg text-sm transition cursor-pointer ${
              p === safePage
                ? "bg-green-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => goTo(safePage + 1)}
          disabled={safePage >= totalPages}
          className="px-3 py-1.5 rounded-lg text-sm bg-zinc-800 text-zinc-400 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
        >
          Next ›
        </button>
      </div>
    );
  };

  const localIndex = (r: Registration) =>
    paginated.findIndex((x) => x.id === r.id);

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
                <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-medium w-10">
                  #
                </th>
                <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-medium">
                  Name
                </th>
                <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-medium">
                  Email
                </th>
                <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-medium">
                  Date
                </th>
                <th className="p-4 text-xs uppercase tracking-widest text-zinc-500 font-medium w-28">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-600">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-red-500">
                    ⚠️ {error}
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-600">
                    No registrations yet 🙃
                  </td>
                </tr>
              ) : (
                paginated.map((r, i) =>
                  editingId === r.id ? (
                    <tr
                      key={r.id}
                      className="border-b border-zinc-800/50 bg-zinc-800/20"
                    >
                      <td colSpan={5} className="p-4">
                        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                          <span className="text-xs text-zinc-600 w-8">
                            #{start + i + 1}
                          </span>
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              value={editForm.fullName}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  fullName: e.target.value,
                                }))
                              }
                              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
                              placeholder="Full name"
                            />
                            <input
                              value={editForm.email}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  email: e.target.value,
                                }))
                              }
                              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
                              placeholder="Email"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(r.id)}
                              disabled={saving}
                              className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50 transition cursor-pointer"
                            >
                              {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-2 rounded-lg bg-zinc-700 text-zinc-300 text-sm hover:bg-zinc-600 transition cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={r.id}
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/30"
                    >
                      <td className="p-4 text-sm text-zinc-600">{start + i + 1}</td>
                      <td className="p-4 text-sm text-zinc-300">{r.fullName}</td>
                      <td className="p-4 text-sm text-zinc-400">{r.email}</td>
                      <td className="p-4 text-sm text-zinc-500">{formatDate(r.createdAt)}</td>
                      <td className="p-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(r)}
                              className="text-zinc-500 hover:text-green-500 transition cursor-pointer"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => deleteReg(r.id)}
                              className="text-zinc-500 hover:text-red-500 transition cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
          <Pagination />
        </div>

        {/* Mobile cards */}
        <div className="block sm:hidden space-y-3">
          {loading ? (
            <div className="p-8 text-center text-zinc-600">Loading...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">⚠️ {error}</div>
          ) : registrations.length === 0 ? (
            <div className="p-8 text-center text-zinc-600">
              No registrations yet 🙃
            </div>
          ) : (
            paginated.map((r, i) =>
              editingId === r.id ? (
                <div
                  key={r.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-600">#{start + i + 1}</span>
                    <p className="text-sm text-zinc-300 font-medium">Edit registration</p>
                  </div>
                  <input
                    value={editForm.fullName}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, fullName: e.target.value }))
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
                    placeholder="Full name"
                  />
                  <input
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/50"
                    placeholder="Email"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(r.id)}
                      disabled={saving}
                      className="flex-1 px-3 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50 transition cursor-pointer"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex-1 px-3 py-2 rounded-lg bg-zinc-700 text-zinc-300 text-sm hover:bg-zinc-600 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={r.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-600">#{start + i + 1}</span>
                      <p className="text-sm text-zinc-300 font-medium">
                        {r.fullName}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(r)}
                        className="text-zinc-500 hover:text-green-500 transition cursor-pointer"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteReg(r.id)}
                        className="text-zinc-500 hover:text-red-500 transition cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400">{r.email}</p>
                  <p className="text-sm text-zinc-500">{formatDate(r.createdAt)}</p>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs bg-green-500/10 text-green-500 border border-green-500/20">
                      Active
                    </span>
                  </div>
                </div>
              )
            )
          )}
          <Pagination />
        </div>
      </div>
    </div>
  );
}