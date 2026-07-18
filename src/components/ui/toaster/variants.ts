import { cva } from "class-variance-authority";

export const toastVariants = cva(
  [
    "relative",
    "flex",
    "items-start",
    "gap-3",
    "overflow-hidden",
    "rounded-xl",
    "border-l-4",
    "px-4",
    "py-3",
    "shadow-lg",
    "backdrop-blur-sm",
    "transition-all",
    "duration-300",
    "ease-out",
    "hover:-translate-y-1",
    "hover:scale-[1.02]",
    "hover:shadow-xl",
    "animate-in",
    "slide-in-from-right",
    "fade-in",
  ],
  {
    variants: {
      variant: {
        success:
          "border-green-500 bg-green-50 text-green-900",

        info:
          "border-blue-500 bg-blue-50 text-blue-900",

        warning:
          "border-yellow-500 bg-yellow-50 text-yellow-900",

        error:
          "border-red-500 bg-red-50 text-red-900",
      },
    },

    defaultVariants: {
      variant: "success",
    },
  }
);