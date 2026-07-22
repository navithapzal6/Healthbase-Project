"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import type { TypeaheadOption, TypeaheadProps } from "./types";

const Typeahead = ({ id, label, placeholder = "Search and select...", value, options, error, disabled, emptyMessage = "No results found", onChange }: TypeaheadProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);
  const [query, setQuery] = useState(selected?.label ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => setQuery(selected?.label ?? ""), [selected?.label]);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term || selected?.label === query) return options;
    return options.filter((option) => `${option.label} ${option.description ?? ""}`.toLowerCase().includes(term));
  }, [options, query, selected?.label]);

  const select = (option: TypeaheadOption) => {
    setQuery(option.label);
    setOpen(false);
    onChange(option.value, option);
  };

  return (
    <div ref={rootRef} className="relative w-full">
      {label && <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id={id}
          value={query}
          disabled={disabled}
          autoComplete="off"
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            if (value) onChange("");
          }}
          className={`h-11 w-full rounded-xl border bg-white pl-10 pr-16 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10 ${error ? "border-red-400" : "border-slate-200"}`}
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {value && <button type="button" aria-label="Clear selection" onClick={() => { setQuery(""); onChange(""); setOpen(true); }} className="rounded-md p-1 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>}
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {open && !disabled && (
        <div className="absolute z-[80] mt-1.5 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
          {filtered.length ? filtered.map((option) => (
            <button key={option.value} type="button" onClick={() => select(option)} className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left hover:bg-primary/5">
              <span className="min-w-0"><span className="block truncate text-sm font-medium text-slate-800">{option.label}</span>{option.description && <span className="block truncate text-xs text-slate-500">{option.description}</span>}</span>
              {option.value === value && <Check className="h-4 w-4 shrink-0 text-primary" />}
            </button>
          )) : <p className="px-3 py-5 text-center text-sm text-slate-500">{emptyMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default Typeahead;
