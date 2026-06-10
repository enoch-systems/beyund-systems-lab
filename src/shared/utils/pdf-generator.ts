import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface StudentRow {
  full_name: string;
  email: string;
  phone_whatsapp: string;
  course_applying_for: string;
  status: string;
  country: string;
  created_at: string;
}

const LOGO_URL = "https://res.cloudinary.com/djdbcoyot/image/upload/v1780147439/bjswj073yms1b0tub3mc.png";

export function generateStudentReportPDF(
  students: StudentRow[],
  exportedBy: string = "Admin",
): jsPDF {
  const doc = new jsPDF("landscape", "mm", "a4");
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  // ── Header Section (on first page) ──
  // Logo
  try {
    doc.addImage(LOGO_URL, "PNG", W / 2 - 14, 15, 28, 28);
  } catch {
    // Logo unavailable — skip
  }

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(29, 29, 31);
  doc.text("Beyund Labs Academy", W / 2, 52, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(108, 108, 112);
  doc.text("Student Report", W / 2, 62, { align: "center" });

  // Thin divider
  doc.setDrawColor(204, 204, 209);
  doc.setLineWidth(0.4);
  doc.line(W / 2 - 40, 68, W / 2 + 40, 68);

  // Metadata row
  doc.setFontSize(9);
  doc.setTextColor(108, 108, 112);
  doc.setFont("helvetica", "normal");
  doc.text(`Exported: ${dateStr}  |  By: ${exportedBy}  |  Students: ${students.length}`, W / 2, 78, { align: "center" });

  // ── Table starts right after header ──
  const tableData = students.map((s) => [
    s.full_name || "-",
    s.email || "-",
    s.phone_whatsapp || "-",
    s.course_applying_for || "-",
    s.status.charAt(0).toUpperCase() + s.status.slice(1),
    s.country || "-",
  ]);

  autoTable(doc, {
    startY: 85,
    margin: { left: 12, right: 12 },
    head: [["Full Name", "Email", "Contact", "Course", "Status", "Country"]],
    body: tableData,
    theme: "grid",
    styles: {
      fontSize: 7.5,
      cellPadding: 3.5,
      textColor: [50, 50, 52],
      lineColor: [209, 209, 214],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [242, 242, 247],
      textColor: [29, 29, 31],
      fontStyle: "bold",
      fontSize: 7.5,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [249, 249, 251],
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 55 },
      2: { cellWidth: 35 },
      3: { cellWidth: 45 },
      4: { cellWidth: 25, halign: "center" },
      5: { cellWidth: 30 },
    },
    didDrawPage: (data) => {
      // Draw header on every page
      try {
        doc.addImage(LOGO_URL, "PNG", 12, 6, 14, 14);
      } catch {}
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(29, 29, 31);
      doc.text("Beyund Labs Academy", 30, 14);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(108, 108, 112);
      doc.text(`Student Report — ${dateStr}`, 30, 19);

      // Footer
      doc.setFontSize(6.5);
      doc.setTextColor(174, 174, 178);
      doc.text(`Page ${getNumPages(doc)}`, W / 2, H - 4, { align: "center" });
    },
  });

  // Page numbers on all pages
  const totalPages = getNumPages(doc);
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(6.5);
    doc.setTextColor(174, 174, 178);
    doc.text(`Page ${i} of ${totalPages}`, W / 2, H - 4, { align: "center" });
  }

  return doc;
}

function getNumPages(doc: jsPDF): number {
  return (doc as any).getNumberOfPages();
}

export function downloadPDF(
  students: StudentRow[],
  exportedBy: string = "Admin"
): { blob: Blob; fileName: string; dateStr: string } {
  const doc = generateStudentReportPDF(students, exportedBy);
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0];
  const fileName = `Student_Report_${dateStr}_${now.getTime()}.pdf`;
  const blob = doc.output("blob");
  return { blob, fileName, dateStr: `${dateStr} ${now.toLocaleTimeString()}` };
}