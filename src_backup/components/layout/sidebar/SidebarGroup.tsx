"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { isRouteActive } from "./route";
import type { SidebarGroupProps } from "./types";

export default function SidebarGroup({
  icon: Icon,
  label,
  items,
  normalizedPath,
  collapsed = false,
  onExpand,
  onMenuClick,
}: SidebarGroupProps) {
  const isChildActive = items.some((item) =>
    isRouteActive(normalizedPath, item.route, item.matchRoutes),
  );

  const [open, setOpen] = useState(isChildActive);
  const [iconShaking, setIconShaking] = useState(false);

  useEffect(() => {
    if (isChildActive) setOpen(true);
  }, [isChildActive]);

  const handleToggle = () => {
    setIconShaking(true);

    if (collapsed) {
      setOpen(true);
      onExpand?.();
      return;
    }

    setOpen((current) => !current);
  };

  return (
    <div>
      <button
        type="button"
        title={collapsed ? label : undefined}
        aria-label={label}
        aria-expanded={!collapsed && open}
        onClick={handleToggle}
        className={`sidebar-menu-button flex w-full items-center rounded-xl py-2.5 text-sm transition-colors duration-200 ${
          collapsed ? "justify-center px-2" : "justify-between px-3"
        } ${
          isChildActive
            ? "bg-primary/10 font-semibold text-primary"
            : "text-slate-600 hover:bg-primary/10 hover:text-slate-900"
        }`}
      >
        <span
          className={`flex items-center ${
            collapsed ? "justify-center" : "gap-3"
          }`}
        >
          <Icon
            size={18}
            onAnimationEnd={() => setIconShaking(false)}
            className={`sidebar-menu-icon shrink-0 ${
              iconShaking ? "sidebar-icon-shaking" : ""
            }`}
          />
          {!collapsed && <span>{label}</span>}
        </span>

        {!collapsed &&
          (open ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
      </button>

      {!collapsed && open && (
        <div className="ml-7 mt-1 space-y-1 border-l border-slate-200 pl-2">
          {items.map((item) => {
            const active = isRouteActive(
              normalizedPath,
              item.route,
              item.matchRoutes,
            );

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => onMenuClick(item.name, item.route)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200 ${
                  active
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
