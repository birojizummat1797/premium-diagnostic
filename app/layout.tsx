import type { Metadata } from "next";
import "./globals.css";
// Telegram bilan ishlash uchun Next.js Script kutubxonasini chaqiramiz
import Script from "next/script";

export const metadata: Metadata = {
  title: "Premium Diagnostic",
  description: "AI Karyera Diagnostikasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <head>
        {/* Telegram WebApp Dvigatelini ulaymiz */}
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body>{children}</body>
    </html>
  );
}