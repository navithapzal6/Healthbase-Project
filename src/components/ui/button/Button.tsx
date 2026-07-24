import { forwardRef } from "react";

import { cn } from "@/src/lib/utils";

import Loader from "../loader/Loader";
import type { ButtonProps } from "./types";
import { buttonVariants } from "./variants";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant,
      size,
      className,
      leftIcon,
      rightIcon,
      loading = false,
      fullWidth,
      disabled,
      unstyled = false,
      ...props
    },
    ref,
  ) => {
    if (unstyled) {
      return (
        <button
          ref={ref}
          className={className}
          disabled={loading || disabled}
          {...props}
        >
          {children}
        </button>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({
            variant,
            size,
            fullWidth,
            loading,
          }),
          className,
        )}
        disabled={loading || disabled}
        {...props}
      >
        {loading ? (
          <>
            <Loader size="sm" tone="current" inline label="" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="flex items-center justify-center">
                {leftIcon}
              </span>
            )}

            <span>{children}</span>

            {rightIcon && (
              <span className="flex items-center justify-center">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
