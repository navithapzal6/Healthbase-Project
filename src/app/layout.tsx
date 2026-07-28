import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import {
  AppShell,
  BrowserInteractionGuard,
  NavigationLoader,
  Toaster,
} from "@/src/components";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Healthbase Software",
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
        <BrowserInteractionGuard />
        <AppShell>{children}</AppShell>

        <NavigationLoader />
        <Toaster />
      </body>
    </html>
  );
}
