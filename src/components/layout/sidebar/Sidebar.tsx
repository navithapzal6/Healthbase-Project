"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { Button, startNavigationLoading } from "@/src/components/ui";

import { menus } from "./menu";
import { isRouteActive } from "./route";
import SidebarItem from "./SidebarItem";
import type { SidebarProps, SidebarSubItem } from "./types";

const normalizePath = (path: string) => {
  let value = path.split("?")[0].split("#")[0];

  if (value.length > 1 && value.endsWith("/")) {
    value = value.slice(0, -1);
  }

  return value.startsWith("/") ? value : `/${value}`;
};

const isSubItemActive = (
  pathname: string,
  searchParams: URLSearchParams,
  item: SidebarSubItem,
) => {
  const [routePath, query = ""] = item.route.split("?");

  if (normalizePath(pathname) !== normalizePath(routePath)) return false;

  const itemParams = new URLSearchParams(query);

  for (const [key, value] of itemParams.entries()) {
    const currentValue = searchParams.get(key);

    if (currentValue !== value) return false;
  }

  return true;
};

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();

  const normalizedPath = useMemo(() => normalizePath(pathname), [pathname]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const activeGroup = menus.find(
      (menu) =>
        menu.items?.length &&
        menu.route &&
        isRouteActive(normalizedPath, menu.route, menu.matchRoutes),
    );

    setOpenMenu(activeGroup?.label ?? null);
  }, [normalizedPath]);

  const navigate = (label: string, route: string) => {
    const [routePath] = route.split("?");
    const currentQuery = searchParams.toString();
    const currentRoute = `${normalizedPath}${currentQuery ? `?${currentQuery}` : ""}`;

    if (currentRoute !== route) {
      startNavigationLoading(`Loading ${label.toLowerCase()}...`);
      router.push(route);
      return;
    }

    if (normalizedPath !== normalizePath(routePath)) {
      startNavigationLoading(`Loading ${label.toLowerCase()}...`);
      router.push(route);
    }
  };

  const handleClick = (label: string, route: string) => {
    const menu = menus.find((item) => item.label === label);

    if (menu?.items?.length) {
      if (collapsed) {
        onToggle?.();
        setOpenMenu(label);
        return;
      }

      setOpenMenu((current) => (current === label ? null : label));
      return;
    }

    setOpenMenu(null);
    navigate(label, route);
  };

  const handleSubItemClick = (item: SidebarSubItem) => {
    navigate(item.label, item.route);
  };

  return (
    <aside className="flex h-screen w-full flex-col bg-white px-4 py-5 shadow-sm">
      <div
        className={`mb-6 flex h-11 items-center ${
          collapsed ? "justify-center" : "gap-3 px-2"
        }`}
      >
        <Image
          src="/healthbase-logo.png"
          alt="Healthbase"
          width={30}
          height={30}
          className="shrink-0"
        />

        {!collapsed && (
          <h1 className="truncate text-xl font-bold text-[#103BB5]">
            Healthbase
          </h1>
        )}
      </div>

      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {menus.map((menu) => {
          const active =
            menu.route &&
            isRouteActive(normalizedPath, menu.route, menu.matchRoutes);
          const hasItems = Boolean(menu.items?.length);
          const expanded = hasItems && openMenu === menu.label && !collapsed;

          return (
            <div key={menu.label}>
              <div className="relative">
                <SidebarItem
                  icon={menu.icon}
                  label={menu.label}
                  route={menu.route}
                  active={Boolean(active)}
                  collapsed={collapsed}
                  onClick={handleClick}
                />

                {hasItems && !collapsed && (
                  <ChevronDown
                    size={15}
                    aria-hidden="true"
                    className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 ${
                      active ? "text-white" : "text-slate-400"
                    } ${expanded ? "rotate-180" : ""}`}
                  />
                )}
              </div>

              {expanded && menu.items && (
                <div className="mt-1 space-y-1 pl-9 pr-1">
                  {menu.items.map((item) => {
                    const itemActive = isSubItemActive(
                      normalizedPath,
                      new URLSearchParams(searchParams.toString()),
                      item,
                    );

                    return (
                      <Button
                        unstyled
                        key={item.label}
                        type="button"
                        onClick={() => handleSubItemClick(item)}
                        className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200 ${
                          itemActive
                            ? "bg-primary/10 font-semibold text-primary"
                            : "text-slate-500 hover:bg-primary/5 hover:text-slate-900"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <Button
        unstyled
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
      </Button>
    </aside>
  );
}
