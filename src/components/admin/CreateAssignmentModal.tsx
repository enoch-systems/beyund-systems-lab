"use client";

import { useState, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { X, Upload, FileText, Loader2, AlertCircle, Hash } from "lucide-react";

interface CreateAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const EXAMPLE_TITLES = [
  "Design a responsive registration form using React",
  "Build a login page with form validation",
  "Create a student dashboard using Next.js",
  "Implement CRUD operations with Supabase",
  "Build a course management API using Express",
];

const WEEK_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function CreateAssignmentModal({
  open,
  onClose,
  onCreated,
}: CreateAssignmentModalProps) {
  const [title, setTitle] = useState("");
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createSupabaseBrowserClient();

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Assignment title is required");
      return;
    }
    if (!weekNumber || weekNumber < 1) {
      setError("Please select a valid week number");
      return;
    }
    if (!file) {
      setError("Please upload an assignment document before continuing.");
      return;
    }

    setUploading(true);

    try {
      // 1. Upload file to Supabase Storage
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const filePath = `assignments/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("assignments")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.warn("Storage upload failed:", uploadError.message);
      }

      // 2. Get public URL
      const { data: urlData } = supabase.storage
        .from("assignments")
        .getPublicUrl(filePath);

      const fileUrl = urlData?.publicUrl || "";

      // 3. Insert assignment record (no due_date — timestamps are automatic)
      const { error: insertError } = await supabase
        .from("assignments")
        .insert({
          title: title.trim(),
          week_number: weekNumber,
          file_url: fileUrl,
          file_name: file.name,
          status: "active",
        });

      if (insertError) {
        setError(insertError.message);
        setUploading(false);
        return;
      }

      resetForm();
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setUploading(false);
    }
  }

  function resetForm() {
    setTitle("");
    setWeekNumber(1);
    setFile(null);
    setError("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-lg bg-white dark:bg-[#1c1c1e] rounded-[20px] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.5)] border border-[#e5e5ea]/60 dark:border-[#38383a]/60 overflow-hidden animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#f2f2f7] dark:border-[#2c2c2e]">
            <div>
              <h2 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.01em]">
                New Assignment
              </h2>
              <p className="text-[13px] text-[#86868b] dark:text-[#98989d] mt-0.5">
                Create a weekly assignment with an uploaded document
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#86868b] hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-white mb-1.5">
                Assignment Title <span className="text-[#ff453a]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={EXAMPLE_TITLES[Math.floor(Math.random() * EXAMPLE_TITLES.length)]}
                className="w-full h-[42px] px-3.5 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#38383a] text-[14px] text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#8940fa]/25 focus:border-[#8940fa]/40 transition-all"
              />
            </div>

            {/* Week Number */}
            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-white mb-1.5">
                Assignment Week <span className="text-[#ff453a]">*</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] pointer-events-none" />
                <select
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(Number(e.target.value))}
                  className="w-full h-[42px] pl-10 pr-10 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#38383a] text-[14px] text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#8940fa]/25 focus:border-[#8940fa]/40 transition-all appearance-none cursor-pointer"
                >
                  {WEEK_OPTIONS.map((week) => (
                    <option key={week} value={week} className="bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white">
                      Week {week}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b] pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-[13px] font-medium text-[#1d1d1f] dark:text-white mb-1.5">
                Assignment File <span className="text-[#ff453a]">*</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              {file ? (
                <div className="flex items-center gap-3 p-3.5 rounded-[12px] bg-[#f2f2f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#38383a]">
                  <div className="w-10 h-10 rounded-[10px] bg-white dark:bg-[#1c1c1e] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#8940fa]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#1d1d1f] dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-[#86868b] dark:text-[#98989d]">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[#86868b] hover:bg-white dark:hover:bg-[#1c1c1e] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2.5 h-[48px] rounded-[12px] border-2 border-dashed border-[#e5e5ea] dark:border-[#38383a] text-[#86868b] dark:text-[#98989d] text-[14px] font-medium hover:border-[#d0d0d5] dark:hover:border-[#4a4a4c] hover:text-[#1d1d1f] dark:hover:text-white transition-all"
                >
                  <Upload className="w-4 h-4" />
                  Upload PDF, DOC, or DOCX
                </button>
              )}
              <p className="text-[11px] text-[#86868b] dark:text-[#98989d] mt-1.5">
                Supported formats: PDF, DOC, DOCX
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-[10px] bg-[#ff453a]/8 dark:bg-[#ff453a]/12 border border-[#ff453a]/20">
                <AlertCircle className="w-4 h-4 text-[#ff453a] shrink-0 mt-0.5" />
                <p className="text-[13px] text-[#ff453a]">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={uploading}
                className="h-[40px] px-4 rounded-[10px] text-[13px] font-medium text-[#86868b] dark:text-[#98989d] hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="inline-flex items-center gap-2 h-[40px] px-5 rounded-[10px] bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[13px] font-semibold hover:bg-[#2d2d2f] dark:hover:bg-[#f0f0f0] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Create Assignment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}