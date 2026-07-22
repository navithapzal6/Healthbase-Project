import { cva } from "class-variance-authority";

export const overlayVariants = cva([
  "fixed inset-0 z-50",
  "bg-black/50",
  "backdrop-blur-sm",
  "flex items-center justify-center",
  "animate-in fade-in duration-200",
]);

export const dialogVariants = cva(
  [
    "relative",
    "rounded-2xl",
    "bg-white",
    "shadow-2xl",
    "border",
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "gap-4",
    "px-8",
    "py-8",
    "text-center",
    "animate-in zoom-in-95 duration-200",
  ],
  {
    variants: {
      size: {
        sm: "w-[320px]",

        md: "w-[420px]",

        lg: "w-[520px]",
      },

      variant: {
        default: "",

        success: "",

        warning: "",

        danger: "",
      },
    },

    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

export const confirmButtonVariants = cva(
  [
    "rounded-full",
    "px-6",
    "py-2",
    "font-semibold",
    "text-white",
    "transition-all",
    "duration-200",
    "hover:-translate-y-0.5",
    "shadow-md",
  ],
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary/90",

        success: "bg-green-600 hover:bg-green-700",

        warning: "bg-yellow-500 hover:bg-yellow-600",

        danger: "bg-red-500 hover:bg-red-600",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);

export const cancelButtonVariants = cva([
  "rounded-full",
  "bg-gray-200",
  "px-6",
  "py-2",
  "font-semibold",
  "text-gray-700",
  "transition-all",
  "duration-200",
  "hover:bg-gray-300",
  "hover:-translate-y-0.5",
  "shadow-sm",
]);
