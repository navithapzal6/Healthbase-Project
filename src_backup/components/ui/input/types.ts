import {
  InputHTMLAttributes,
  ReactNode,
} from "react";

import { VariantProps } from "class-variance-authority";

import { inputVariants } from "./variants";

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;

  error?: string;

  helperText?: string;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;

  inputSize?: "sm" | "md" | "lg";

  fullWidth?: boolean;

  className?: string;
}