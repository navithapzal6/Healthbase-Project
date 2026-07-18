import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { Toaster, AppShell } from "@/src/components";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stonebuild",
  description: "ERP Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body
        className="
          h-screen
          overflow-hidden
          bg-slate-100
        "
      >
        <AppShell>{children}</AppShell>

        <Toaster />
      </body>
    </html>
  );
}
