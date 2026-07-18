import { cn } from "@/src/lib/utils";
import { buttonVariants } from "./variants";
import type { ButtonProps } from "./types";

const Button = ({
  children,
  variant,
  size,
  className,
  leftIcon,
  rightIcon,
  loading = false,
  fullWidth,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        buttonVariants({
          variant,
          size,
          fullWidth,
          loading,
        }),
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
};

export default Button;