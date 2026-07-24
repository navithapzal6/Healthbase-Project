import type { ReactNode, RefCallback } from "react";

export type PopoverAlign = "start" | "center" | "end";

export interface PopoverTriggerProps {
  ref: RefCallback<HTMLButtonElement>;
  onClick: () => void;
  "aria-expanded": boolean;
  "aria-haspopup": "menu";
}

export interface PopoverProps {
  trigger: (props: PopoverTriggerProps) => ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  align?: PopoverAlign;
  className?: string;
  contentClassName?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
