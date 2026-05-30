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
  title: "Enoch Chukwudi - Software Engineer & Product Designer",
  description: "I build exceptional digital experiences that blend creativity with technical excellence. Software Engineer and Product Designer with 5+ years of experience.",
  keywords: ["Software Engineer", "Product Designer", "Web Developer", "Full Stack", "React", "Next.js", "TypeScript"],
  authors: [{ name: "Enoch Chukwudi" }],
  creator: "Enoch Chukwudi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://enochchukwudi.com",
    title: "Enoch Chukwudi - Software Engineer & Product Designer",
    description: "I build exceptional digital experiences that blend creativity with technical excellence.",
    siteName: "Enoch Chukwudi Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enoch Chukwudi - Software Engineer & Product Designer",
    description: "I build exceptional digital experiences that blend creativity with technical excellence.",
    creator: "@enochchukwudi",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
