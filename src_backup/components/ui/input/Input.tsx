import { cn } from "@/src/lib/utils";

import { inputVariants } from "./variants";
import type { InputProps } from "./types";

const Input = ({
  label,
  error,
  helperText,

  leftIcon,
  rightIcon,

  variant,
  inputSize,
  fullWidth,

  className,

  ...props
}: InputProps) => {
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
        {/* Left Icon */}
        {leftIcon && (
          <div
            className="
              absolute
              left-3
              top-1/2
              flex
              -translate-y-1/2
              items-center
              justify-center
            "
          >
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          className={cn(
            inputVariants({
              variant,
              inputSize,
              fullWidth,
            }),

            leftIcon && "pl-14",
            rightIcon && "pr-14",

            error &&
              "border-destructive focus:ring-destructive/30",

            className
          )}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div
            className="
              absolute
              right-3
              top-1/2
              flex
              -translate-y-1/2
              items-center
              justify-center
            "
          >
            {rightIcon}
          </div>
        )}
      </div>

      {/* Helper / Error */}
      {error ? (
        <p className="mt-1 text-sm text-destructive">
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

export default Input;
