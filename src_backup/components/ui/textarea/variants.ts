import { cva } from "class-variance-authority";

export const textareaVariants = cva(
  [
    "w-full rounded-xl border",
    "transition-all duration-300",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-primary/30",
    "resize-y",
    "disabled:opacity-60",
    "disabled:cursor-not-allowed",
    "placeholder:text-gray-400",
  ],

  {
    variants: {

      variant: {

        default:
          "bg-white border-gray-300 hover:border-primary",

        filled:
          "bg-gray-100 border-transparent hover:bg-gray-200",

        outline:
          "bg-white border-2 border-gray-300 hover:border-primary",

      },

      size: {

        sm:
          "min-h-[90px] px-3 py-2 text-sm",

        md:
          "min-h-[120px] px-4 py-3 text-sm",

        lg:
          "min-h-[160px] px-5 py-4 text-base",

      },

      fullWidth: {

        true:
          "w-full",

      }

    },

    defaultVariants: {

      variant: "default",

      size: "md",

    }

  }
);