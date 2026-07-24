import type { ReactNode, SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  error?: string;
  helperText?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  /** Render only the native select plus supplied attributes/classes. */
  unstyled?: boolean;
}
