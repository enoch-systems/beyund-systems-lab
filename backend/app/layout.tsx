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
      <body className="min-h-full flex">
        <aside className="fixed top-0 left-0 h-screen w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-8 text-black dark:text-zinc-50">Academy Admin</h1>
          <nav className="flex flex-col gap-4">
            <a href="/" className="p-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Dashboard</a>
            <a href="/students" className="p-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Students</a>
            <a href="/courses" className="p-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Courses</a>
            <a href="/payments" className="p-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Payments</a>
            <a href="/notifications" className="p-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Notifications</a>
            <a href="/certificates" className="p-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Certificates</a>
            <a href="/settings" className="p-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Settings</a>
            <a href="/email-history" className="p-3 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">Email History</a>
          </nav>
        </aside>
        <main className="ml-64 flex-1 p-8">{children}</main>
      </body>
    </html>
  );
}
