"use client";

import { useEffect, useId } from "react";
import { CircleAlert, CircleHelp, Save, Trash2, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";

import type { ButtonVariant } from "@/src/components/ui/button/types";
import type { ConfirmationDialogProps, ConfirmationVariant } from "./types";

const iconStyles: Record<ConfirmationVariant, string> = {
  default: "bg-secondary text-slate-700",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
};

const buttonVariants: Record<ConfirmationVariant, ButtonVariant> = {
  default: "primary",
  primary: "primary",
  success: "success",
  warning: "warning",
  danger: "destructive",
};

const defaultIcons = {
  default: <CircleHelp size={26} />,
  primary: <Save size={26} />,
  success: <Save size={26} />,
  warning: <CircleAlert size={26} />,
  danger: <Trash2 size={26} />,
};

const ConfirmationDialog = ({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  icon,
  loading = false,
  showCancel = true,
  closeOnOverlay = true,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) => {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onCancel();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [loading, onCancel, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (
          closeOnOverlay &&
          !loading &&
          event.target === event.currentTarget
        ) {
          onCancel();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          aria-label="Close confirmation"
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-50"
        >
          <X size={18} />
        </button>

        <div
          className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${iconStyles[variant]}`}
        >
          {icon ?? defaultIcons[variant]}
        </div>

        <h2
          id={titleId}
          className="pr-8 text-xl font-semibold tracking-tight text-slate-900"
        >
          {title}
        </h2>

        {description && (
          <p
            id={descriptionId}
            className="mt-2 text-sm leading-6 text-slate-500"
          >
            {description}
          </p>
        )}

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {showCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="sm:min-w-28"
            >
              {cancelText}
            </Button>
          )}

          <Button
            type="button"
            variant={buttonVariants[variant]}
            onClick={onConfirm}
            loading={loading}
            className="sm:min-w-32"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
