"use client";

import { Filter, Plus } from "lucide-react";

import ListSortMenu from "./ListSortMenu";
import type { ListToolbarProps } from "./types";

interface Props extends ListToolbarProps {
  title: string;
}

const ListToolbar = ({
  title,
  showFilter = true,
  showAdd = true,
  addLabel = "Add New",
  filterOpen = false,
  filterCount = 0,
  sortOptions = [{ label: "Name", value: "name" }],
  sortValue = "name",
  sortDirection = "asc",
  onFilter,
  onAdd,
  onSortChange,
}: Props) => {
  return (
    <div className="mb-4 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>

      <div className="flex flex-wrap items-center gap-3">
        {showFilter && (
          <button
            type="button"
            onClick={onFilter}
            aria-expanded={filterOpen}
            className={`inline-flex h-9 items-center gap-2 rounded-xl px-4 text-sm font-medium shadow-sm transition-all duration-200 ${
              filterOpen
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
            }`}
          >
            <Filter size={16} />
            Filter
            {filterCount > 0 && (
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-semibold ${
                  filterOpen ? "bg-white text-primary" : "bg-primary text-white"
                }`}
              >
                {filterCount}
              </span>
            )}
          </button>
        )}

        <ListSortMenu
          options={sortOptions}
          value={sortValue}
          direction={sortDirection}
          onChange={onSortChange}
        />

        {showAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-primary/75"
          >
            <Plus size={16} />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default ListToolbar;
