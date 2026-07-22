import type { ToastItem, ToastVariant } from "./types";

type ToastListener = (toast: ToastItem) => void;

const listeners = new Set<ToastListener>();

const emit = (toast: ToastItem) => {
  listeners.forEach((listener) => listener(toast));
};

const createToast = (
  variant: ToastVariant,
  options: Omit<ToastItem, "id" | "variant">
) => {
  emit({
    id: crypto.randomUUID(),
    variant,
    duration: 4000,
    ...options,
  });
};

export const toast = {
  success: (options: Omit<ToastItem, "id" | "variant">) =>
    createToast("success", options),

  error: (options: Omit<ToastItem, "id" | "variant">) =>
    createToast("error", options),

  warning: (options: Omit<ToastItem, "id" | "variant">) =>
    createToast("warning", options),

  info: (options: Omit<ToastItem, "id" | "variant">) =>
    createToast("info", options),
};

export const subscribe = (listener: ToastListener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};