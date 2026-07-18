import { cva } from "class-variance-authority";

export const modalVariants = cva(
  [
    "relative",
    "w-full",
    "rounded-2xl",
    "border",
    "border-slate-200",
    "bg-white",
    "shadow-2xl",
    "transition-all",
    "duration-300",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);