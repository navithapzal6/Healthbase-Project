"use client";

import { cn } from "@/src/lib/utils";

import FormContent from "./FormContent";
import FormFooter from "./FormFooter";
import FormHeader from "./FormHeader";
import { formPageVariants } from "./variants";
import type { FormPageProps } from "./types";

const FormPage = ({
  title,
  description,
  backLabel,
  children,
  headerActions,
  footer,
  submitLabel,
  cancelLabel,
  submitIcon,
  isSubmitting = false,
  showFooter = true,
  className,
  contentClassName,
  onBack,
  onCancel,
  onSubmit,
}: FormPageProps) => {
  return (
    <div className={cn(formPageVariants(), className)}>
      <FormHeader
        title={title}
        description={description}
        backLabel={backLabel}
        actions={headerActions}
        onBack={onBack}
      />

      <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
        <FormContent className={contentClassName}>{children}</FormContent>

        {footer ??
          (showFooter && (
            <FormFooter
              submitLabel={submitLabel}
              cancelLabel={cancelLabel}
              submitIcon={submitIcon}
              isSubmitting={isSubmitting}
              onCancel={onCancel}
            />
          ))}
      </form>
    </div>
  );
};

export default FormPage;
