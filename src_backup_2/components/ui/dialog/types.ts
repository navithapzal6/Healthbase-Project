import { HTMLAttributes, ReactNode } from "react";

export type DialogVariant = "default" | "success" | "warning" | "danger";

export type DialogSize = "sm" | "md" | "lg";

export type ConfirmationVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger";

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;

  title?: string;

  description?: string;

  children?: ReactNode;

  confirmText?: string;

  cancelText?: string;

  onConfirm?: () => void;

  onCancel?: () => void;

  variant?: DialogVariant;

  size?: DialogSize;
}

export interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  icon?: ReactNode;
  loading?: boolean;
  showCancel?: boolean;
  closeOnOverlay?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}
