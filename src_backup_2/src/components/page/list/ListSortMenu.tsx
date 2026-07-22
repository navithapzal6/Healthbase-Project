"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import type { ListSortDirection, ListSortOption } from "./types";

interface ListSortMenuProps {
  options: ListSortOption[];
  value: string;
  direction: ListSortDirection;
  onChange?: (value: string, direction: ListSortDirection) => void;
  compact?: boolean;
}

const ListSortMenu = ({
  options,
  value,
  direction,
  onChange,
  compact = false,
}: ListSortMenuProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  const visibleOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase()),
  );

  const selectField = (nextValue: string) => {
    onChange?.(nextValue, direction);
  };

  const selectDirection = (nextDirection: ListSortDirection) => {
    onChange?.(value, nextDirection);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={`inline-flex items-center rounded-xl border border-border bg-white font-medium shadow-sm transition-all duration-200 hover:border-primary/30 ${compact ? "h-8 gap-1.5 px-3 text-xs" : "h-9 gap-2 px-4 text-sm"}`}
      >
        {!compact && <span className="text-slate-500">Sort By :</span>}
        <span>{selectedOption?.label ?? "Select"}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          {options.length > 5 && (
            <div className="relative mb-2">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search fields"
                className="h-9 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          )}

          <div className="max-h-48 overflow-y-auto">
            {visibleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => selectField(option.value)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
              >
                {option.label}
                {value === option.value && (
                  <Check size={16} className="text-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="my-2 border-t border-slate-100" />

          {(["asc", "desc"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => selectDirection(item)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                direction === item
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {item === "asc" ? "Ascending" : "Descending"}
              {direction === item && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListSortMenu;
