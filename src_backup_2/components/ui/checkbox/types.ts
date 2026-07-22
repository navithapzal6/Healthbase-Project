import { InputHTMLAttributes, ReactNode } from "react";

export type CheckboxSize =
  | "sm"
  | "md"
  | "lg";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {

  label?: ReactNode;

  helperText?: string;

  error?: string;

  size?: CheckboxSize;
}