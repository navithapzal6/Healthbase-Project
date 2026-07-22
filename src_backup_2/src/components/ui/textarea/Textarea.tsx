import { cn } from "@/src/lib/utils";
import { textareaVariants } from "./variants";
import type { TextareaProps } from "./types";

const Textarea = ({
  label,
  helperText,
  error,
  variant,
  size,
  fullWidth,
  className,
  ...props
}: TextareaProps) => {
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

      <textarea
        className={cn(
          textareaVariants({
            variant,
            size,
            fullWidth,
          }),
          error &&
            "border-destructive focus:ring-destructive/30",
          className
        )}
        {...props}
      />

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

export default Textarea;
