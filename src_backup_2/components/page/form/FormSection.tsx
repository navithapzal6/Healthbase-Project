import { cn } from "@/src/lib/utils";

import { formSectionVariants } from "./variants";
import type { FormSectionProps } from "./types";

const FormSection = ({
  title,
  description,
  icon,
  variant = "default",
  children,
  className,
  ...props
}: FormSectionProps) => {
  const showHeader = title || description || icon;

  return (
    <section
      className={cn(formSectionVariants({ variant }), className)}
      {...props}
    >
      {showHeader && (
        <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-4">
          {icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {icon}
            </span>
          )}

          <div className="min-w-0">
            {title && (
              <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            )}

            {description && (
              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                {description}
              </p>
            )}
          </div>
        </div>
      )}

      {children}
    </section>
  );
};

export default FormSection;
