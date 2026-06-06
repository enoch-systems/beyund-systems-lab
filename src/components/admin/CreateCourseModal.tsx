"use client";

import { useState, useEffect, useRef } from "react";
import { X, Plus, BookOpen, Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateCourseModal({ open, onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && title.trim()) handleCreate();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, title]);

  async function handleCreate() {
    if (!title.trim()) return;
    setSaving(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.from("courses").insert({ title: title.trim() });
    setSaving(false);
    onCreated();
    onClose();
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="w-full max-w-sm bg-white dark:bg-[#121212] rounded-[20px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-7">
            {/* Icon */}
            <div className="w-12 h-12 rounded-[14px] bg-[#f2f2f7] dark:bg-[#181818] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-[#8940fa]" />
            </div>

            {/* Title */}
            <h2 className="text-[20px] font-semibold text-[#1d1d1f] dark:text-white text-center tracking-[-0.02em] mb-1">
              New Course
            </h2>
            <p className="text-[14px] text-[#86868b] dark:text-[#98989d] text-center mb-5">
              Enter the course name to get started
            </p>

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full Stack Development"
              className="w-full px-4 py-3 rounded-[12px] bg-[#f2f2f7] dark:bg-[#181818] border border-[#e5e5ea] dark:border-[#1a1a1a] text-[15px] text-[#1d1d1f] dark:text-white placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#8940fa]/30 focus:border-[#8940fa] transition-all"
              maxLength={120}
            />
            <p className="text-[11px] text-[#86868b] dark:text-[#98989d] mt-1.5 text-right">{title.length}/120</p>

            {/* Actions */}
            <div className="flex items-center gap-2.5 mt-5">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-[12px] text-[14px] font-medium text-[#86868b] hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!title.trim() || saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[12px] bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[14px] font-semibold hover:bg-[#2d2d2f] dark:hover:bg-[#f0f0f0] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}