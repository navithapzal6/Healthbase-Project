"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/src/lib/utils";

import type { CollapsiblePanelProps } from "./types";

const CollapsiblePanel = ({
  children,
  collapsed,
  onToggle,
  collapseLabel = "Collapse panel",
  expandLabel = "Expand panel",
  expandedWidth = 240,
  collapsedWidth = 72,
  togglePosition = "top",
  className,
}: CollapsiblePanelProps) => {
  const label = collapsed ? expandLabel : collapseLabel;

  return (
    <aside
      data-collapsed={collapsed}
      style={{ width: collapsed ? collapsedWidth : expandedWidth }}
      className={cn(
        "relative flex min-h-0 shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-slate-50/70 transition-[width] duration-300 ease-in-out",
        className,
      )}
    >
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={onToggle}
        className={cn(
          "absolute right-2 z-20 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
          togglePosition === "center"
            ? "top-1/2 -translate-y-1/2"
            : "top-2",
        )}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {children}
    </aside>
  );
};

export default CollapsiblePanel;
