"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface SplitModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  leftTitle: ReactNode;
  leftHeaderAction?: ReactNode;
  rightTitle: string;
  left: ReactNode;
  right: ReactNode;
  onClose: () => void;
}

const SplitModal = ({
  open,
  title,
  subtitle,
  leftTitle,
  leftHeaderAction,
  rightTitle,
  left,
  right,
  onClose,
}: SplitModalProps) => {
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex h-[min(760px,calc(100vh-32px))] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)]">
          <div className="flex min-h-0 flex-col border-b border-slate-200 lg:border-b-0 lg:border-r">
            <div className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-5 py-2.5">
              <h3 className="min-w-0 truncate text-sm font-semibold text-slate-800">
                {leftTitle}
              </h3>
              {leftHeaderAction}
            </div>
            <div className="min-h-0 flex-1 overflow-hidden p-5">{left}</div>
          </div>
          <div className="flex min-h-0 flex-col bg-slate-50/50">
            <div className="shrink-0 border-b border-slate-100 bg-white px-5 py-3">
              <h3 className="text-sm font-semibold text-slate-800">
                {rightTitle}
              </h3>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">{right}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SplitModal;
