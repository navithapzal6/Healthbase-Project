"use client";

import { useMemo } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { startNavigationLoading } from "@/src/components/ui";

import { menus } from "./menu";
import { isRouteActive } from "./route";
import SidebarGroup from "./SidebarGroup";
import SidebarItem from "./SidebarItem";
import type { SidebarProps } from "./types";

const normalizePath = (path: string) => {
  let value = path.split("?")[0].split("#")[0];

  if (value.length > 1 && value.endsWith("/")) {
    value = value.slice(0, -1);
  }

  return value.startsWith("/") ? value : `/${value}`;
};

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname() || "/";

  const normalizedPath = useMemo(() => normalizePath(pathname), [pathname]);

  const handleClick = (label: string, route: string) => {
    if (normalizedPath !== normalizePath(route)) {
      startNavigationLoading(`Loading ${label.toLowerCase()}...`);
      router.push(route);
    }
  };

  return (
    <aside className="flex h-screen w-full flex-col bg-white px-4 py-5 shadow-sm">
      <div
        className={`mb-6 flex h-11 items-center ${
          collapsed ? "justify-center" : "gap-3 px-2"
        }`}
      >
        <Image
          src="/stonebuild-logo.png"
          alt="Stonebuild"
          width={42}
          height={42}
          className="shrink-0"
        />

        {!collapsed && (
          <h1 className="truncate text-xl font-bold text-[#103BB5]">
            Stonebuild
          </h1>
        )}
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {menus.map((menu) => {
          const active =
            menu.route &&
            isRouteActive(normalizedPath, menu.route, menu.matchRoutes);

          if (menu.children) {
            return (
              <SidebarGroup
                key={menu.label}
                icon={menu.icon}
                label={menu.label}
                items={menu.children}
                normalizedPath={normalizedPath}
                collapsed={collapsed}
                onExpand={onToggle}
                onMenuClick={handleClick}
              />
            );
          }

          return (
            <SidebarItem
              key={menu.label}
              icon={menu.icon}
              label={menu.label}
              route={menu.route!}
              active={Boolean(active)}
              collapsed={collapsed}
              onClick={handleClick}
            />
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={`mt-4 flex h-10 w-full items-center rounded-xl border border-slate-200 text-sm font-medium text-slate-500 transition-colors hover:border-primary/20 hover:bg-primary/5 hover:text-primary ${
          collapsed ? "justify-center" : "gap-3 px-3"
        }`}
      >
        {collapsed ? (
          <PanelLeftOpen size={18} />
        ) : (
          <>
            <PanelLeftClose size={18} />
            <span>Collapse</span>
          </>
        )}
      </button>
    </aside>
  );
}
