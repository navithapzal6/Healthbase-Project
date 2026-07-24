import { forwardRef } from "react";

import { cn } from "@/src/lib/utils";

import type { SelectProps } from "./types";

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      wrapperClassName,
      labelClassName,
      errorClassName,
      unstyled = false,
      children,
      id,
      ...props
    },
    ref,
  ) => {
    if (unstyled) {
      return (
        <select ref={ref} id={id} className={className} {...props}>
          {children}
        </select>
      );
    }

    return (
      <label className={cn("block", wrapperClassName)} htmlFor={id}>
        {label && (
          <span
            className={cn(
              "mb-1.5 block text-sm font-medium text-slate-700",
              labelClassName,
            )}
          >
            {label}
          </span>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            "h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10",
            error ? "border-red-400" : "border-slate-200",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error ? (
          <span
            className={cn(
              "mt-1 block text-xs text-red-600",
              errorClassName,
            )}
          >
            {error}
          </span>
        ) : helperText ? (
          <span className="mt-1 block text-xs text-slate-500">
            {helperText}
          </span>
        ) : null}
      </label>
    );
  },
);

Select.displayName = "Select";

export default Select;
