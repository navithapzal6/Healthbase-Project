import { cn } from "@/src/lib/utils";

import { formGridVariants } from "./variants";
import type { FormGridProps } from "./types";

const FormGrid = ({
  columns = 2,
  children,
  className,
  ...props
}: FormGridProps) => {
  return (
    <div className={cn(formGridVariants({ columns }), className)} {...props}>
      {children}
    </div>
  );
};

export default FormGrid;
