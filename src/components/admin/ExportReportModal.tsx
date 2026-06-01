"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import { downloadPDF } from "@/lib/pdf-generator";
import {
  X,
  Download,
  Share2,
  Trash2,
  Eye,
  FileText,
  MessageSquare,
  Link,
  CheckCircle,
  Clock,
  Users,
  Loader2,
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

interface ExportRecord {
  id: string;
  file_name: string;
  file_url: string;
  created_at: string;
  exported_by: string;
  student_count: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  students: StudentData[];
  exportedBy: string;
}

export default function ExportReportModal({ open, onClose, students, exportedBy }: Props) {
  const [view, setView] = useState<"main" | "history">("main");
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [history, setHistory] = useState<ExportRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Load history on view change
  useEffect(() => {
    if (view === "history" && open) loadHistory();
  }, [view, open]);

  async function loadHistory() {
    setLoadingHistory(true);
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase
      .from("export_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setHistory(data);
    setLoadingHistory(false);
  }

  async function handleGenerate() {
    setGenerating(true);
    setSuccess(null);
    
    try {
      const { blob, fileName } = downloadPDF(students, exportedBy);
      const supabase = createSupabaseBrowserClient();

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("reports")
        .upload(`exports/${fileName}`, blob, {
          contentType: "application/pdf",
          cacheControl: "3600",
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        // Fallback: just download locally
        downloadBlob(blob, fileName);
        setSuccess("PDF downloaded locally (storage unavailable)");
      } else {
        // Get public URL
        const { data: urlData } = supabase.storage
          .from("reports")
          .getPublicUrl(`exports/${fileName}`);

        const fileUrl = urlData?.publicUrl || "";

        // Save metadata to database
        await supabase.from("export_reports").insert({
          file_name: fileName,
          file_url: fileUrl,
          exported_by: exportedBy,
          student_count: students.length,
        });

        downloadBlob(blob, fileName);
        setSuccess("PDF exported successfully");
        setView("history");
      }
    } catch (err) {
      console.error("Export error:", err);
      // Fallback: local download
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

  function handlePreview(record?: ExportRecord) {
    if (record?.file_url) {
      window.open(record.file_url, "_blank");
    } else {
      // Generate live preview
      const { blob, fileName } = downloadPDF(students, exportedBy);
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      window.open(url, "_blank");
    }
  }

  async function handleDownload(record?: ExportRecord) {
    if (record?.file_url) {
      const a = document.createElement("a");
      a.href = record.file_url;
      a.download = record.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const { blob, fileName } = downloadPDF(students, exportedBy);
      downloadBlob(blob, fileName);
    }
  }

  function handleWhatsApp(record?: ExportRecord) {
    const message = encodeURIComponent(
      `📊 Beyund Labs Academy Student Report\n\nGenerated on ${new Date().toLocaleDateString()}\nTotal Students: ${students.length}\n\nView report: ${record?.file_url || "Report attached"}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  }

  function handleCopyLink(record?: ExportRecord) {
    const url = record?.file_url || previewUrl || "";
    if (url) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  async function handleDelete(record: ExportRecord) {
    if (!confirm("Delete this exported report?")) return;
    const supabase = createSupabaseBrowserClient();
    
    // Delete from storage
    if (record.file_url) {
      const path = record.file_url.split("/reports/")[1];
      if (path) {
        await supabase.storage.from("reports").remove([`exports/${path}`]);
      }
    }
    
    // Delete from database
    await supabase.from("export_reports").delete().eq("id", record.id);
    setHistory((prev) => prev.filter((h) => h.id !== record.id));
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div ref={modalRef} className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-[#1c1c1e] rounded-[14px] border border-[#e5e5ea] dark:border-[#38383a] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5ea] dark:border-[#38383a]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center">
                <FileText className="w-4 h-4 text-[#86868b]" />
              </div>
              <div>
                <h2 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-white">
                  {view === "main" ? "Export Student Report" : "Export History"}
                </h2>
                <p className="text-[13px] text-[#86868b] dark:text-[#98989d]">
                  {view === "main" ? `${students.length} students will be included` : `${history.length} reports generated`}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-[10px] flex items-center justify-center text-[#86868b] hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Switch */}
          <div className="flex gap-1 px-6 py-3 border-b border-[#e5e5ea]/50 dark:border-[#38383a]/50">
            {(["main", "history"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setView(tab)}
                className={`px-4 py-1.5 rounded-[8px] text-[13px] font-medium transition-all duration-200 ${
                  view === tab
                    ? "bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f]"
                    : "text-[#86868b] hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e]"
                }`}
              >
                {tab === "main" ? "Generate" : "History"}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {view === "main" ? (
              <div className="space-y-5">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: <Users className="w-4 h-4" />, label: "Students", value: students.length.toString() },
                    { icon: <FileText className="w-4 h-4" />, label: "Format", value: "A4 PDF" },
                    { icon: <Clock className="w-4 h-4" />, label: "Generated", value: new Date().toLocaleDateString() },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-[12px] bg-[#f2f2f7] dark:bg-[#2c2c2e] text-center">
                      <div className="flex justify-center mb-1.5 text-[#86868b]">{item.icon}</div>
                      <p className="text-[11px] text-[#86868b] dark:text-[#98989d]">{item.label}</p>
                      <p className="text-[17px] font-semibold text-[#1d1d1f] dark:text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Status breakdown preview */}
                <div className="p-4 rounded-[12px] bg-[#f2f2f7] dark:bg-[#2c2c2e]">
                  <p className="text-[11px] font-medium text-[#86868b] dark:text-[#98989d] uppercase tracking-wider mb-3">Status Breakdown</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { label: "Enrolled", count: students.filter(s => s.status === "enrolled").length, color: "bg-[#30d158]" },
                      { label: "Pending", count: students.filter(s => s.status === "pending").length, color: "bg-[#ff9f0a]" },
                      { label: "Contacted", count: students.filter(s => s.status === "contacted").length, color: "bg-[#0a84ff]" },
                      { label: "Rejected", count: students.filter(s => s.status === "rejected").length, color: "bg-[#ff453a]" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${s.color}`} />
                        <span className="text-[13px] text-[#1d1d1f] dark:text-white">{s.label}</span>
                        <span className="text-[13px] font-semibold text-[#1d1d1f] dark:text-white ml-auto">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Success message */}
                {success && (
                  <div className="flex items-center gap-2 p-3 rounded-[10px] bg-[#30d158]/10 text-[#30d158] text-[13px] font-medium">
                    <CheckCircle className="w-4 h-4" />
                    {success}
                  </div>
                )}

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  disabled={generating || students.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-[12px] bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] text-[15px] font-semibold hover:bg-[#2d2d2f] dark:hover:bg-[#f0f0f0] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)]"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Generate & Download PDF
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* History View */
              <div className="space-y-3">
                {loadingHistory ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-[#86868b] animate-spin" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-10 h-10 text-[#e5e5ea] dark:text-[#38383a] mx-auto mb-3" />
                    <p className="text-[15px] text-[#86868b] font-medium">No exports yet</p>
                    <p className="text-[13px] text-[#98989d]">Generate your first report to see it here</p>
                  </div>
                ) : (
                  history.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center gap-4 p-4 rounded-[12px] border border-[#e5e5ea]/50 dark:border-[#38383a]/50 hover:bg-[#f9f9f9] dark:hover:bg-[#2c2c2e]/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-[10px] bg-[#f2f2f7] dark:bg-[#2c2c2e] flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-[#86868b]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[#1d1d1f] dark:text-white truncate">
                          {record.file_name.replace("Student_Report_", "").replace(/_\d+\.pdf/, "").replace(/_/g, " ")}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-[#86868b]">{record.student_count} students</span>
                          <span className="text-[11px] text-[#e5e5ea]">•</span>
                          <span className="text-[11px] text-[#86868b]">{new Date(record.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handlePreview(record)} className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#86868b] hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] transition-colors" title="Preview">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDownload(record)} className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#86868b] hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleWhatsApp(record)} className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#86868b] hover:bg-[#25d366]/10 transition-colors" title="Share on WhatsApp">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleCopyLink(record)} className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#86868b] hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] transition-colors" title="Copy link">
                          {copied ? <CheckCircle className="w-4 h-4 text-[#30d158]" /> : <Link className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDelete(record)} className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#86868b] hover:bg-[#ff453a]/10 hover:text-[#ff453a] transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[#e5e5ea] dark:border-[#38383a] flex justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-[8px] text-[13px] font-medium text-[#86868b] hover:bg-[#f2f2f7] dark:hover:bg-[#2c2c2e] transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}