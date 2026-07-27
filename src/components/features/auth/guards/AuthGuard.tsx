"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { startNavigationLoading } from "@/src/components/ui";
import {
  AUTH_SESSION_CHANGED_EVENT,
  authLogger,
  hasAuthSession,
} from "@/src/core/auth";

interface AuthGuardProps {
  children: ReactNode;
}

type AuthStatus = "checking" | "authenticated" | "redirecting";

const AuthGuard = ({ children }: AuthGuardProps) => {
  const pathname = usePathname() || "/dashboard";
  const [status, setStatus] = useState<AuthStatus>("checking");
  const redirectingRef = useRef(false);

  useEffect(() => {
    const verifySession = () => {
      if (hasAuthSession()) {
        redirectingRef.current = false;
        setStatus("authenticated");
        return;
      }

      if (redirectingRef.current) return;

      redirectingRef.current = true;
      setStatus("redirecting");
      authLogger.warn("Protected route blocked", { pathname });
      startNavigationLoading("Redirecting to login...");

      // A hard replace is intentional here. It prevents a pending App Router
      // refresh/transition from keeping the protected page mounted after logout.
      window.location.replace("/login");
    };

    verifySession();

    window.addEventListener("storage", verifySession);
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, verifySession);

    return () => {
      window.removeEventListener("storage", verifySession);
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, verifySession);
    };
  }, [pathname]);

  if (status !== "authenticated") {
    return (
      <div
        className="h-screen bg-slate-100"
        aria-busy="true"
        aria-label="Checking authentication"
      />
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
