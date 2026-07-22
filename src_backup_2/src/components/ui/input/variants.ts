import { cva } from "class-variance-authority";

export const inputVariants = cva(
  `
    flex
    h-11
    rounded-xl
    border
    border-border
    bg-white
    px-4
    text-sm
    text-foreground
    placeholder:text-slate-400
    outline-none
    transition-all
    duration-200
    focus:border-primary
    focus:ring-4
    focus:ring-primary/10
    disabled:cursor-not-allowed
    disabled:opacity-50
  `,
  {
    variants: {
      variant: {
        default: "",
        filled: "bg-slate-100 border-transparent",
        outline: "border-border bg-transparent",
      },

      inputSize: {
        sm: "h-9 text-xs",
        md: "h-11 text-sm",
        lg: "h-12 text-base",
      },

      fullWidth: {
        true: "w-full",
      },
    },

    defaultVariants: {
      variant: "default",
      inputSize: "md",
      fullWidth: true,
    },
  }
);