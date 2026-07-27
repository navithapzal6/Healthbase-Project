"use client";

import { useRef, type MouseEvent } from "react";
import { CalendarDays } from "lucide-react";
import {
  APP_DATE_FORMAT,
  formatAppDate,
  formatAppDateInput,
  fromNativeDateValue,
  toNativeDateValue,
} from "@/src/core/date";
import type { DatePickerProps } from "./types";

const DatePicker = ({
  label,
  error,
  value,
  onChange,
  id,
  className = "",
  min,
  max,
  disabled,
  readOnly,
  placeholder = APP_DATE_FORMAT,
  onClick,
  ...props
}: DatePickerProps) => {
  const calendarInputRef = useRef<HTMLInputElement>(null);
  const displayValue = formatAppDate(value, value);
  const nativeValue = toNativeDateValue(value);
  const nativeMin =
    typeof min === "string" ? toNativeDateValue(min) : undefined;
  const nativeMax =
    typeof max === "string" ? toNativeDateValue(max) : undefined;

  const openCalendar = (event: MouseEvent<HTMLInputElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || disabled || readOnly) return;

    const calendarInput = calendarInputRef.current;
    if (!calendarInput) return;

    try {
      calendarInput.showPicker();
    } catch {
      calendarInput.click();
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          {...props}
          id={id}
          type="text"
          inputMode="numeric"
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={10}
          aria-invalid={Boolean(error)}
          onClick={openCalendar}
          onChange={(event) =>
            onChange(formatAppDateInput(event.target.value))
          }
          className={`h-11 w-full rounded-xl border bg-white pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 ${error ? "border-red-400" : "border-slate-200"} ${className}`}
        />
        <input
          ref={calendarInputRef}
          type="date"
          aria-label={`${label ?? "Date"} calendar`}
          tabIndex={-1}
          value={nativeValue}
          min={nativeMin}
          max={nativeMax}
          disabled={disabled || readOnly}
          onChange={(event) =>
            onChange(fromNativeDateValue(event.target.value))
          }
          className="pointer-events-none absolute bottom-0 right-0 h-px w-px opacity-0"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default DatePicker;
