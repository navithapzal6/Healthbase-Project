import { cn } from "@/src/lib/utils";
import { buttonVariants } from "./variants";
import type { ButtonProps } from "./types";
import Loader from "../loader/Loader";

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
};

export default Button;
