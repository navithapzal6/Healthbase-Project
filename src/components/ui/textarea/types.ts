import { ReactNode, TextareaHTMLAttributes } from "react";

export type TextareaVariant =
  | "default"
  | "filled"
  | "outline";

export type TextareaSize =
  | "sm"
  | "md"
  | "lg";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {

  label?: string;

  helperText?: string;

  error?: string;

  variant?: TextareaVariant;

  size?: TextareaSize;

  fullWidth?: boolean;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;
}