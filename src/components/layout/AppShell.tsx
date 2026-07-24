"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AuthGuard } from "../auth";
import AppLayout from "./AppLayout";

interface AppShellProps {
  children: ReactNode;
}

const authRoutes = ["/login", "/signup"];

const AppShell = ({ children }: AppShellProps) => {
  const pathname = usePathname() || "/";
  const isAuthPage = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isAuthPage) return <>{children}</>;

  return (
    <AuthGuard>
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  );
};

export default AppShell;
