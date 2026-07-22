"use client";

import { CalendarDays } from "lucide-react";
import type { DatePickerProps } from "./types";

const DatePicker = ({ label, error, value, onChange, id, className = "", ...props }: DatePickerProps) => (
  <div className="w-full">
    {label && <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>}
    <div className="relative">
      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        {...props}
        id={id}
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 w-full rounded-xl border bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 ${error ? "border-red-400" : "border-slate-200"} ${className}`}
      />
    </div>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export default DatePicker;
