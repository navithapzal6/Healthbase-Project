"use client";

import { ArrowLeft } from "lucide-react";

import { formHeaderVariants } from "./variants";
import type { FormHeaderProps } from "./types";

const FormHeader = ({
  title,
  description,
  backLabel = "Back",
  actions,
  onBack,
}: FormHeaderProps) => {
  return (
    <header className={formHeaderVariants()}>
      <div className="min-w-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-primary"
          >
            <ArrowLeft size={15} strokeWidth={2.2} />
            {backLabel}
          </button>
        )}

        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 items-center gap-3">{actions}</div>
      )}
    </header>
  );
};

export default FormHeader;
