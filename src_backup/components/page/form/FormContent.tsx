import { cn } from "@/src/lib/utils";

import { formContentVariants } from "./variants";
import type { FormContentProps } from "./types";

const FormContent = ({ children, className, ...props }: FormContentProps) => {
  return (
    <div className={cn(formContentVariants(), className)} {...props}>
      <div className="space-y-5">{children}</div>
    </div>
  );
};

export default FormContent;
