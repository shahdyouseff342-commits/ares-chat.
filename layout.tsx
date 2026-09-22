import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARES Chat - إدارة الرسائل وتحليل البصمات والدفعات",
  description: "نظام ARES الذكي لإدارة محادثات الزبائن، تسجيل أنظمة الدفعات والأقساط، الكلايش الجاهزة، وتحليل البصمات الصوتية.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0b0e14",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="bg-[#07090e] text-white antialiased overflow-hidden selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
