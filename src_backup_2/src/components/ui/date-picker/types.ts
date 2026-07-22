import type { InputHTMLAttributes } from "react";

export interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
}
