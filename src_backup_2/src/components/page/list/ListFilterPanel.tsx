"use client";

import { SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/src/components/ui";

import type { ListFilterPanelProps } from "./types";

const ListFilterPanel = ({
  open,
  title = "Filters",
  children,
  onClose,
  onApply,
  onReset,
}: ListFilterPanelProps) => {
  if (!open) return null;

  return (
    <aside className="flex h-full w-full shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 shadow-sm md:w-80 xl:w-96">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <SlidersHorizontal size={16} />
          </span>
          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <X size={18} />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
        {children}
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white p-4">
        <Button type="button" variant="outline" onClick={onReset}>
          Reset
        </Button>
        <Button type="button" onClick={onApply}>
          Apply Filters
        </Button>
      </div>
    </aside>
  );
};

export default ListFilterPanel;
