"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  CircleX,
  Info,
  X,
} from "lucide-react";

import { cn } from "@/src/lib/utils";
import { toastVariants } from "./variants";
import { subscribe } from "./toast";
import type { ToastItem } from "./types";

const icons = {
  success: <CheckCircle2 className="h-5 w-5 text-green-600" />,
  error: <CircleX className="h-5 w-5 text-red-600" />,
  warning: <CircleAlert className="h-5 w-5 text-yellow-600" />,
  info: <Info className="h-5 w-5 text-blue-600" />,
};

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    const unsubscribe = subscribe((toast) => {
      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        removeToast(toast.id);
      }, toast.duration ?? 4000);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="pointer-events-none fixed top-5 right-5 z-[9999] flex w-full max-w-sm flex-col gap-3">

      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            toastVariants({
              variant: toast.variant,
            }),
            "pointer-events-auto"
          )}
        >
          {/* Icon */}
          <div className="mt-0.5 shrink-0">
            {icons[toast.variant]}
          </div>

          {/* Content */}
          <div className="flex-1">

            {toast.title && (
              <h4 className="text-sm font-semibold">
                {toast.title}
              </h4>
            )}

            <p className="mt-0.5 text-sm opacity-90">
              {toast.description}
            </p>

          </div>

          {/* Close */}
          <button
            onClick={() => removeToast(toast.id)}
            className="
              rounded-md
              p-1
              transition
              hover:bg-black/10
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}

    </div>
  );
}