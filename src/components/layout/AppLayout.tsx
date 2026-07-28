"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import {
  ConfirmationDialog,
  startNavigationLoading,
  toast,
} from "@/src/components/ui";
import {
  AUTH_SESSION_CHANGED_EVENT,
  authLogger,
  clearAuthSession,
  getAuthUser,
} from "@/src/core/auth";

import { getHeaderRouteConfig, Header } from "./header";
import type { HeaderUser as HeaderUserType } from "./header";
import { Sidebar } from "./sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

const toHeaderUser = (): HeaderUserType => {
  const storedUser = getAuthUser();
  const fullName = storedUser?.name?.trim() ?? "";
  const nameParts = fullName.split(/\s+/).filter(Boolean);

  return {
    firstName: storedUser?.firstName?.trim() || nameParts[0] || "User",
    lastName:
      storedUser?.lastName?.trim() || nameParts.slice(1).join(" ") || undefined,
    email: storedUser?.email,
    role: storedUser?.role || storedUser?.email || "User",
    avatar: storedUser?.avatar,
  };
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<HeaderUserType>(() => toHeaderUser());
  const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);
  const pathname = usePathname() || "/dashboard";
  const headerConfig = getHeaderRouteConfig(pathname);

  useEffect(() => {
    const syncUser = () => setUser(toHeaderUser());

    window.addEventListener("storage", syncUser);
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, syncUser);
    };
  }, []);

  const handleLogout = () => {
    const userEmail = getAuthUser()?.email;
    setLogoutConfirmationOpen(false);

    authLogger.info("Logout completed", { userEmail });

    toast.success({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });

    startNavigationLoading("Returning to login...");
    clearAuthSession();

    // Avoid router.replace() + router.refresh() competing during logout.
    // AuthGuard also performs this replace when it receives the session event.
    window.location.replace("/login");
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-100">
      {/* Sidebar */}
      <aside
        className={`fixed z-50 transition-[width] duration-300 ${
          sidebarCollapsed ? "w-20" : "w-[260px]"
        }`}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((current) => !current)}
        />
      </aside>

      {/* Right Side */}
      <div
        className={`flex h-screen flex-col transition-[margin] duration-300 ${
          sidebarCollapsed ? "ml-[90px]" : "ml-[270px]"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-40">
          <Header
            {...headerConfig}
            user={user}
            onLogout={() => setLogoutConfirmationOpen(true)}
          />
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-hidden px-4 pb-5">
          <div className="h-full overflow-hidden rounded-3xl bg-white p-5 shadow-sm">
            {children}
          </div>
        </main>
      </div>

      <ConfirmationDialog
        open={logoutConfirmationOpen}
        title="Logout from Healthbase?"
        description="Your current session will end and you will return to the login page."
        confirmText="Logout"
        variant="primary"
        icon={<LogOut size={24} />}
        onConfirm={handleLogout}
        onCancel={() => setLogoutConfirmationOpen(false)}
      />
    </div>
  );
};

export default AppLayout;
