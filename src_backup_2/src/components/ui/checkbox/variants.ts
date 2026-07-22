import { cva } from "class-variance-authority";

export const checkboxVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center",
    "rounded-xl",
    "transition-all duration-300 ease-out",
    "select-none",
  ],

  {

    variants: {

      size: {

        sm: "h-9 w-9",

        md: "h-11 w-11",

        lg: "h-14 w-14",

      },

    },

    defaultVariants: {

      size: "md",

    },

  }
);