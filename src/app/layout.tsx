import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beyund Labs Academy - Acquire Building Skills in Software Fullstack Development",
  description: "Acquire real-world building skills in software fullstack development at Beyund Labs Academy. Master frontend, backend, APIs, databases, and system architecture through hands-on projects.",
  keywords: ["Fullstack Development", "Software Engineering", "Web Development", "Learn to Code", "Building Skills", "Next.js", "TypeScript", "Beyund Labs Academy"],
  authors: [{ name: "Enoch Chukwudi" }],
  creator: "Beyund Labs Academy",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://beyund-systems-lab.vercel.app",
    title: "Beyund Labs Academy - Acquire Building Skills in Software Fullstack Development",
    description: "Acquire real-world building skills in software fullstack development at Beyund Labs Academy. Master frontend, backend, APIs, databases, and system architecture through hands-on projects.",
    siteName: "Beyund Labs Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beyund Labs Academy - Acquire Building Skills in Software Fullstack Development",
    description: "Acquire real-world building skills in software fullstack development at Beyund Labs Academy. Master frontend, backend, APIs, databases, and system architecture through hands-on projects.",
    creator: "@enochchukwudi",
  },
  icons: {
    icon: "https://res.cloudinary.com/djdbcoyot/image/upload/v1780147439/bjswj073yms1b0tub3mc.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
