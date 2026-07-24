import type { InputHTMLAttributes, ReactNode } from "react";

export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: ReactNode;
  helperText?: string;
  error?: string;
  size?: CheckboxSize;
  /** Render only the native checkbox plus supplied attributes/classes. */
  unstyled?: boolean;
}
