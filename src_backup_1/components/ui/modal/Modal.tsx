"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import { cn } from "@/src/lib/utils";
import { modalVariants } from "./variants";
import type { ModalProps } from "./types";

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC key close
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Outside click close
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      onClick={handleOverlayClick}
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        backdrop-blur-sm
        p-4
      "
    >
      <div
        ref={modalRef}
        className={cn(
  modalVariants({ size }),
  `
  transition-all
  duration-300
  ease-out
  `
)}
      >
        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-slate-200
            px-6
            py-4
          "
        >
          <h2
            className="
              text-lg
              font-semibold
              text-slate-900
            "
          >
            {title}
          </h2>

          {showCloseButton && (
            <button
              onClick={onClose}
              className="
                rounded-lg
                p-2
                transition
                hover:bg-slate-100
              "
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Body */}

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}