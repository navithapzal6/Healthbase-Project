import { forwardRef } from "react";

import "./checkbox.css";

import { cn } from "@/src/lib/utils";
import type { CheckboxProps } from "./types";
import { checkboxVariants } from "./variants";

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helperText,
      error,
      size,
      className,
      id,
      unstyled = false,
      ...props
    },
    ref,
  ) => {
    if (unstyled) {
      return (
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={className}
          {...props}
        />
      );
    }

    const inputId = id ?? crypto.randomUUID();

    return (
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="group inline-flex cursor-pointer items-center gap-3"
        >
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />

          <div
            className={cn(
              checkboxVariants({ size }),
              "checkbox-box",
              error && "checkbox-error",
              className,
            )}
          >
            <svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
              <path
                className="box-path"
                d="M12,4 H32 A8,8 0 0 1 40,12 V32 A8,8 0 0 1 32,40 H12 A8,8 0 0 1 4,32 V12 A8,8 0 0 1 12,4 Z"
              />
              <path className="check-path" d="M14,23 L19,28 L30,15" />
            </svg>
          </div>

          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
        </label>

        {helperText && !error && (
          <p className="pl-14 text-sm text-gray-500">{helperText}</p>
        )}

        {error && (
          <p className="pl-14 text-sm font-medium text-red-500">{error}</p>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
