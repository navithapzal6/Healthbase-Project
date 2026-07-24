"use client";

import { useState } from "react";

import { Button } from "@/src/components/ui";

import type { SidebarItemProps } from "./types";

export default function SidebarItem({
  icon: Icon,
  label,
  route,
  active,
  collapsed = false,
  onClick,
}: SidebarItemProps) {
  const [iconShaking, setIconShaking] = useState(false);

  const handleClick = () => {
    setIconShaking(true);
    onClick(label, route);
  };

  return (
    <Button unstyled
      type="button"
      title={collapsed ? label : undefined}
      aria-label={label}
      onClick={handleClick}
      className={`sidebar-menu-button flex w-full items-center rounded-xl py-2.5 text-sm transition-colors duration-200 ${
        collapsed ? "justify-center px-2" : "gap-3 px-3"
      } ${
        active
          ? "bg-primary/90 font-semibold text-white"
          : "text-slate-600 hover:bg-primary/10 hover:text-slate-900"
      }`}
    >
      <Icon
        size={18}
        onAnimationEnd={() => setIconShaking(false)}
        className={`sidebar-menu-icon shrink-0 ${
          iconShaking ? "sidebar-icon-shaking" : ""
        }`}
      />
      {!collapsed && <span className="truncate">{label}</span>}
    </Button>
  );
}
