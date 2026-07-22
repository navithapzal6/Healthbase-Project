"use client";

import { useEffect } from "react";
import { Cookie, X } from "lucide-react";

import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components";

import {
  cancelButtonVariants,
  confirmButtonVariants,
  dialogVariants,
  overlayVariants,
} from "./variants";

import type { DialogProps } from "./types";

const Dialog = ({
  open,
  title,
  description,
  children,
  confirmText = "Accept",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant,
  size,
  className,
}: DialogProps) => {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel?.();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className={overlayVariants()} onClick={onCancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          dialogVariants({
            size,
            variant,
          }),
          className,
        )}
      >
        {/* Close */}

        <button
          onClick={onCancel}
          className="
            absolute
            right-4
            top-4
            rounded-lg
            p-2
            transition-all
            hover:bg-gray-100
          "
        >
          <X size={18} />
        </button>

        {/* Icon */}

        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-full
            bg-primary/10
            text-primary
          "
        >
          <Cookie size={32} />
        </div>

        {/* Title */}

        {title && (
          <h2
            className="
              text-xl
              font-bold
              text-gray-900
            "
          >
            {title}
          </h2>
        )}

        {/* Description */}

        {description && (
          <p
            className="
              max-w-sm
              text-sm
              leading-6
              text-gray-500
            "
          >
            {description}
          </p>
        )}

        {children}

        {/* Footer */}

        <div
          className="
            mt-3
            flex
            gap-4
          "
        >
          <Button className={cancelButtonVariants()} onClick={onCancel}>
            {cancelText}
          </Button>

          <Button
            className={confirmButtonVariants({
              variant,
            })}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
