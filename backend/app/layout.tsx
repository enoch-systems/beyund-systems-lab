import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Training Academy Management",
  description: "Academy admin dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-black text-zinc-100">
        <aside className="fixed top-0 left-0 h-screen w-64 bg-zinc-950 border-r border-zinc-800 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-8 text-orange-500">CMSolutions</h1>
          <nav className="flex flex-col gap-2">
            <a href="/" className="flex items-center gap-3 p-3 rounded hover:bg-zinc-900 transition text-zinc-400 hover:text-white">
              <span>🏠</span> Dashboard
            </a>
            <a href="/students" className="flex items-center gap-3 p-3 rounded hover:bg-zinc-900 transition text-zinc-400 hover:text-white">
              <span>👥</span> Students
            </a>
            <a href="/courses" className="flex items-center gap-3 p-3 rounded hover:bg-zinc-900 transition text-zinc-400 hover:text-white">
              <span>📚</span> Courses
            </a>
            <a href="/payments" className="flex items-center gap-3 p-3 rounded hover:bg-zinc-900 transition text-zinc-400 hover:text-white">
              <span>💳</span> Payments
            </a>
            <a href="/notifications" className="flex items-center gap-3 p-3 rounded hover:bg-zinc-900 transition text-zinc-400 hover:text-white">
              <span>🔔</span> Notifications
            </a>
            <a href="/certificates" className="flex items-center gap-3 p-3 rounded hover:bg-zinc-900 transition text-zinc-400 hover:text-white">
              <span>📜</span> Certificates
            </a>
            <a href="/settings" className="flex items-center gap-3 p-3 rounded hover:bg-zinc-900 transition text-zinc-400 hover:text-white">
              <span>⚙️</span> Settings
            </a>
            <a href="/email-history" className="flex items-center gap-3 p-3 rounded hover:bg-zinc-900 transition text-zinc-400 hover:text-white">
              <span>📧</span> Email History
            </a>
          </nav>
        </aside>
        <main className="ml-64 flex-1 p-8 bg-zinc-950">{children}</main>
      </body>
    </html>
  );
}
