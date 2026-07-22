import type { FormEventHandler, HTMLAttributes, ReactNode } from "react";

export type FormGridColumns = 1 | 2 | 3 | 4;
export type FormSectionVariant = "default" | "soft";

export interface FormPageProps {
  title: string;
  description?: string;
  backLabel?: string;
  children: ReactNode;
  headerActions?: ReactNode;
  footer?: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  submitIcon?: ReactNode;
  isSubmitting?: boolean;
  showFooter?: boolean;
  className?: string;
  contentClassName?: string;
  onBack?: () => void;
  onCancel?: () => void;
  onSubmit?: FormEventHandler<HTMLFormElement>;
}

export interface FormHeaderProps {
  title: string;
  description?: string;
  backLabel?: string;
  actions?: ReactNode;
  onBack?: () => void;
}

export interface FormContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface FormSectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  icon?: ReactNode;
  variant?: FormSectionVariant;
  children: ReactNode;
}

export interface FormGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: FormGridColumns;
  children: ReactNode;
}

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  htmlFor?: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: ReactNode;
}

export interface FormFooterProps extends HTMLAttributes<HTMLDivElement> {
  submitLabel?: string;
  cancelLabel?: string;
  submitIcon?: ReactNode;
  isSubmitting?: boolean;
  onCancel?: () => void;
}
