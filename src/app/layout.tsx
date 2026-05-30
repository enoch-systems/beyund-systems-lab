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
  title: "Enoch Chukwudi - Fullstack Engineer (Backend-Focused)",
  description: "Shipping end to end operational systems across web apps, mobile apps, dashboards, and desktop software using modern web technologies.",
  keywords: ["Software Engineer", "Product Designer", "Web Developer", "Full Stack", "React", "Next.js", "TypeScript"],
  authors: [{ name: "Enoch Chukwudi" }],
  creator: "Enoch Chukwudi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://enochchukwudi.com",
    title: "Enochsystems - Fullstack Engineer (Backend-Focused)",
    description: "Shipping end to end operational systems across web apps, mobile apps, dashboards, and desktop software using modern web technologies.",
    siteName: "Enochsystems Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enochsystems - Fullstack Engineer (Backend-Focused)",
    description: "Shipping end to end operational systems across web apps, mobile apps, dashboards, and desktop software using modern web technologies.",
    creator: "@enochchukwudi",
  },
  icons: {
    icon: "https://res.cloudinary.com/djdbcoyot/image/upload/v1780133162/mnteqbivqp3h4rd5umcn.png",
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
