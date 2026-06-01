"use client";

import { useState, useEffect, useRef } from "react";
import { downloadPDF } from "@/lib/pdf-generator";
import { X, Download, FileText, CheckCircle, Loader2, Eye } from "lucide-react";

interface StudentData {
  full_name: string;
  email: string;
  phone_whatsapp: string;
  course_applying_for: string;
  status: string;
  country: string;
  created_at: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  students: StudentData[];
  exportedBy: string;
}

export default function ExportReportModal({ open, onClose, students, exportedBy }: Props) {
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  async function handleGenerate() {
    setGenerating(true);
    setSuccess(null);

    try {
      const { blob, fileName } = downloadPDF(students, exportedBy);
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);

      // Trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setSuccess("PDF exported successfully");
    } catch {
      setSuccess("Export failed — please try again");
    }
    setGenerating(false);
  }

  function handleView() {
    if (blobUrl) window.open(blobUrl, "_blank");
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          ref={modalRef}
          className="w-full max-w-sm bg-white dark:bg-[#1c1c1e] rounded-[18px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="p-7">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-[20px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.02em] leading-tight">
                  Students Export
                </h2>
                <p className="text-[13px] text-[#8e8e93] dark:text-[#98989d] mt-1">
                  {students.length} students · A4 PDF
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center text-[#8e8e93] hover:bg-[#e5e5ea] dark:hover:bg-[#38383a] transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metadata */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-2.5 px-4 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e]">
                <span className="text-[13px] text-[#8e8e93] dark:text-[#98989d]">Date</span>
                <span className="text-[13px] font-medium text-[#1d1d1f] dark:text-white">
                  {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center justify-between py-2.5 px-4 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e]">
                <span className="text-[13px] text-[#8e8e93] dark:text-[#98989d]">Format</span>
                <span className="text-[13px] font-medium text-[#1d1d1f] dark:text-white">A4 PDF</span>
              </div>
              <div className="flex items-center justify-between py-2.5 px-4 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e]">
                <span className="text-[13px] text-[#8e8e93] dark:text-[#98989d]">Students</span>
                <span className="text-[13px] font-medium text-[#1d1d1f] dark:text-white">{students.length}</span>
              </div>
            </div>

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] mb-4">
                <CheckCircle className="w-4 h-4 text-[#30d158] shrink-0" />
                <span className="text-[13px] font-medium text-[#1d1d1f] dark:text-white flex-1">{success}</span>
                <button
                  onClick={handleView}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-[#007aff] dark:text-[#0a84ff] hover:bg-[#007aff]/10 dark:hover:bg-[#0a84ff]/10 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
              </div>
            )}

            {/* Generate */}
            <button
              onClick={handleGenerate}
              disabled={generating || students.length === 0}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-[12px] bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[14px] font-semibold hover:bg-[#2d2d2f] dark:hover:bg-[#f0f0f0] active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}