"use client";

import { Search } from "lucide-react";

import {
  ListSortMenu,
  type ListSortDirection,
  type ListSortOption,
} from "@/src/components/page/list";
import { Input } from "@/src/components/ui";

import OutPatientViewNav from "./OutPatientViewNav";
import type { OutPatientViewId } from "../types";

interface OutPatientToolbarProps {
  title: string;
  totalItems: number;
  view: OutPatientViewId;
  createLabel: string;
  search: string;
  searchPlaceholder: string;
  sortOptions: ListSortOption[];
  sortValue: string;
  sortDirection: ListSortDirection;
  onViewChange: (view: OutPatientViewId) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string, direction: ListSortDirection) => void;
}

const OutPatientToolbar = ({
  title,
  totalItems,
  view,
  createLabel,
  search,
  searchPlaceholder,
  sortOptions,
  sortValue,
  sortDirection,
  onViewChange,
  onSearchChange,
  onSortChange,
}: OutPatientToolbarProps) => (
  <div className="mb-3 flex shrink-0 flex-col gap-3 xl:flex-row xl:items-center">
    <div className="flex min-w-0 items-baseline gap-2 xl:flex-1">
      <h2 className="truncate text-lg font-bold text-slate-900">{title}</h2>
      {view === "list" && (
        <span className="shrink-0 text-[11px] text-slate-500">
          {totalItems} records
        </span>
      )}
    </div>

    <div className="flex min-w-0 flex-wrap items-center gap-2 xl:shrink-0 xl:flex-nowrap xl:justify-end">
      {view === "list" && (
        <>
          <div className="relative w-full min-w-[190px] sm:w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              unstyled
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <ListSortMenu
            options={sortOptions}
            value={sortValue}
            direction={sortDirection}
            compact
            className="w-[126px] shrink-0"
            triggerClassName="w-full justify-between"
            onChange={onSortChange}
          />
        </>
      )}

      <OutPatientViewNav
        activeView={view}
        createLabel={createLabel}
        onChange={onViewChange}
      />
    </div>
  </div>
);

export default OutPatientToolbar;
