import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-xl",
    "text-sm font-medium tracking-wide",
    "transition-all duration-300 ease-out",
    "active:scale-[0.98]",
    "focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-primary/30",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "select-none",
  ],

  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white border border-primary/80 shadow-[0_4px_12px_rgba(79,70,229,0.25)] hover:bg-primary/90 hover:shadow-[0_8px_20px_rgba(79,70,229,0.35)] hover:-translate-y-0.5",

        secondary:
          "bg-secondary text-secondary-foreground border border-gray-200 shadow-sm hover:bg-secondary/80 hover:shadow-md hover:-translate-y-0.5",

        destructive:
          "bg-destructive text-white border border-destructive/80 shadow-[0_4px_12px_rgba(239,68,68,0.25)] hover:bg-destructive/90 hover:shadow-[0_8px_20px_rgba(239,68,68,0.35)] hover:-translate-y-0.5",

        success:
          "bg-success text-white border border-success/80 shadow-[0_4px_12px_rgba(22,163,74,0.25)] hover:bg-success/90 hover:shadow-[0_8px_20px_rgba(22,163,74,0.35)] hover:-translate-y-0.5",

        warning:
          "bg-warning text-white border border-warning/80 shadow-[0_4px_12px_rgba(245,158,11,0.25)] hover:bg-warning/90 hover:shadow-[0_8px_20px_rgba(245,158,11,0.35)] hover:-translate-y-0.5",

        outline:
          "bg-white text-black border border-gray-300 shadow-sm hover:bg-gray-50 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5",

        ghost:
          "text-gray-700 hover:bg-gray-100 hover:text-black hover:-translate-y-0.5",

        link:
          "text-primary underline-offset-4 hover:underline",
      },

      size: {
        sm: "h-9 px-4",

        md: "h-10 px-5",

        lg: "h-12 px-7 text-base",

        icon: "h-10 w-10 p-0",
      },

      fullWidth: {
        true: "w-full",
      },

      loading: {
        true: "cursor-wait",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);