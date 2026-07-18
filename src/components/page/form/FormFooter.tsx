"use client";

import { Save } from "lucide-react";

import { Button } from "@/src/components/ui";
import { cn } from "@/src/lib/utils";

import { formFooterVariants } from "./variants";
import type { FormFooterProps } from "./types";

const FormFooter = ({
  submitLabel = "Save",
  cancelLabel = "Cancel",
  submitIcon,
  isSubmitting = false,
  onCancel,
  className,
  ...props
}: FormFooterProps) => {
  return (
    <footer className={cn(formFooterVariants(), className)} {...props}>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="sm:min-w-28"
      >
        {cancelLabel}
      </Button>

      <Button
        type="submit"
        loading={isSubmitting}
        leftIcon={submitIcon ?? <Save size={17} />}
        className="sm:min-w-36"
      >
        {submitLabel}
      </Button>
    </footer>
  );
};

export default FormFooter;
