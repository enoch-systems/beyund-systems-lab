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
  title: "Beyund systems labs - Learn Fullstack Development",
  description: "Learn fullstack development at Beyund systems labs. Build real-world operational systems using modern web technologies.",
  keywords: ["Fullstack Development", "Software Engineering", "Web Development", "Learn to Code", "Next.js", "TypeScript", "Beyund systems labs"],
  authors: [{ name: "Enoch Chukwudi" }],
  creator: "Beyund systems labs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://beyund-systems-lab.vercel.app",
    title: "Beyund systems labs - Learn Fullstack Development",
    description: "Learn fullstack development at Beyund systems labs. Build real-world operational systems using modern web technologies.",
    siteName: "Beyund systems labs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beyund systems labs - Learn Fullstack Development",
    description: "Learn fullstack development at Beyund systems labs. Build real-world operational systems using modern web technologies.",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
