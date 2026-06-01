"use client";

import { useState, useEffect, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { downloadPDF } from "@/lib/pdf-generator";
import {
  X,
  Download,
  FileText,
  CheckCircle,
  Clock,
  Users,
  Loader2,
  MessageSquare,
} from "lucide-react";

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
      const supabase = createSupabaseBrowserClient();

      // Attempt storage upload
      try {
        const { error: uploadError } = await supabase.storage
          .from("reports")
          .upload(`exports/${fileName}`, blob, {
            contentType: "application/pdf",
            cacheControl: "3600",
          });
        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("reports")
            .getPublicUrl(`exports/${fileName}`);
          await supabase.from("export_reports").insert({
            file_name: fileName,
            file_url: urlData?.publicUrl || "",
            exported_by: exportedBy,
            student_count: students.length,
          });
        }
      } catch {
        // Storage unavailable — continue with local download
      }

      downloadBlob(blob, fileName);
      setSuccess("PDF exported successfully");
    } catch (err) {
      console.error("Export error:", err);
      try {
        const { blob, fileName } = downloadPDF(students, exportedBy);
        downloadBlob(blob, fileName);
        setSuccess("PDF downloaded locally");
      } catch {
        setSuccess("Export failed — please try again");
      }
    }
    setGenerating(false);
  }

  function downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleWhatsApp() {
    const message = encodeURIComponent(
      `📊 Beyund Labs Academy Student Report\n\nGenerated on ${new Date().toLocaleDateString()}\nStudents: ${students.length}\nReport attached — please download from the dashboard.`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  }

  if (!open) return null;

  const enrolled = students.filter(s => s.status === "enrolled").length;
  const pending = students.filter(s => s.status === "pending").length;
  const contacted = students.filter(s => s.status === "contacted").length;
  const rejected = students.filter(s => s.status === "rejected").length;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          ref={modalRef}
          className="w-full max-w-md bg-white dark:bg-[#1c1c1e] rounded-[16px] border border-[#e5e5ea] dark:border-[#38383a] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in zoom-in duration-200"
        >
          {/* Close button */}
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center text-[#86868b] hover:bg-[#e5e5ea] dark:hover:bg-[#38383a] transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-8 pb-8 text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-[20px] bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center mx-auto mb-5">
              <FileText className="w-8 h-8 text-[#8940fa]" />
            </div>

            {/* Title */}
            <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-white tracking-[-0.02em] mb-1">
              Export Student Report
            </h2>
            <p className="text-[15px] text-[#86868b] dark:text-[#98989d] mb-6">
              {students.length} student{students.length !== 1 ? "s" : ""} will be included
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: <Users className="w-4 h-4" />, label: "Students", value: students.length },
                { icon: <FileText className="w-4 h-4" />, label: "Format", value: "A4 PDF" },
                { icon: <Clock className="w-4 h-4" />, label: "Today", value: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-[12px] bg-[#f2f2f7] dark:bg-[#2c2c2e]">
                  <div className="flex items-center gap-1.5 mb-1 text-[#86868b] dark:text-[#98989d]">
                    {item.icon}
                    <span className="text-[11px]">{item.label}</span>
                  </div>
                  <p className="text-[20px] font-semibold text-[#1d1d1f] dark:text-white leading-none tracking-[-0.02em]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Status breakdown */}
            <div className="flex items-center justify-center gap-4 mb-6 px-4">
              {[
                { label: "Enrolled", count: enrolled, color: "#30d158" },
                { label: "Pending", count: pending, color: "#ff9f0a" },
                { label: "Contacted", count: contacted, color: "#0a84ff" },
                { label: "Rejected", count: rejected, color: "#ff453a" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-[13px] text-[#86868b] dark:text-[#98989d]">
                    {s.label}
                  </span>
                  <span className="text-[13px] font-semibold text-[#1d1d1f] dark:text-white">
                    {s.count}
                  </span>
                </div>
              ))}
            </div>

            {/* Success message */}
            {success && (
              <div className="flex items-center justify-center gap-2 p-3 rounded-[12px] bg-[#30d158]/10 text-[#30d158] text-[14px] font-medium mb-4 animate-in fade-in duration-200">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {success}
              </div>
            )}

            {/* Primary action */}
            <button
              onClick={handleGenerate}
              disabled={generating || students.length === 0}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-[14px] bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[15px] font-semibold hover:bg-[#2d2d2f] dark:hover:bg-[#f0f0f0] active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_2px_10px_-2px_rgba(0,0,0,0.15)]"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Generate & Download PDF
                </>
              )}
            </button>

            {/* Secondary action */}
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-3 rounded-[14px] mt-2.5 text-[14px] font-medium text-[#25d366] hover:bg-[#25d366]/5 active:scale-[0.98] transition-all duration-150"
            >
              <MessageSquare className="w-4 h-4" />
              Share on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </>
  );
}