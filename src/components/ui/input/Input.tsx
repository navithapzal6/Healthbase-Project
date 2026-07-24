import { forwardRef } from "react";

import { cn } from "@/src/lib/utils";

import type { InputProps } from "./types";
import { inputVariants } from "./variants";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      variant,
      inputSize,
      fullWidth,
      className,
      unstyled = false,
      ...props
    },
    ref,
  ) => {
    if (unstyled) {
      return <input ref={ref} className={className} {...props} />;
    }

    return (
      <div className={cn(fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={props.id}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center justify-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              inputVariants({
                variant,
                inputSize,
                fullWidth,
              }),
              leftIcon && "pl-14",
              rightIcon && "pr-14",
              error && "border-destructive focus:ring-destructive/30",
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="mt-1 text-sm text-destructive">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
