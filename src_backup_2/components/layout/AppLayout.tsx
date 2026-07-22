"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";

import { getHeaderRouteConfig, Header } from "./header";
import { Sidebar } from "./sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname() || "/";
  const headerConfig = getHeaderRouteConfig(pathname);

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
        <div
          className="
            sticky top-0 z-40 
          "
        >
          <Header
            {...headerConfig}
            user={{
              firstName: "Navith",
              lastName: "Apzal M",
              role: "Administrator",
            }}
          />
        </div>

        {/* Scrollable Content */}
        <main
          className="
            flex-1
            overflow-hidden
            px-4
            pb-5
          "
        >
          <div
            className="
               h-full
    rounded-3xl
    bg-white
    p-5
    shadow-sm
    overflow-hidden
            "
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
