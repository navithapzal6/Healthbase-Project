import { cn } from "@/src/lib/utils";

import type { FormFieldProps } from "./types";

const FormField = ({
  label,
  htmlFor,
  required = false,
  helperText,
  error,
  children,
  className,
  ...props
}: FormFieldProps) => {
  return (
    <div className={cn("w-full", className)} {...props}>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
        {required && (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {error ? (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default FormField;
