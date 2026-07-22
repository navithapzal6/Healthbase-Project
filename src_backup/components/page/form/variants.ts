import { cva } from "class-variance-authority";

export const formPageVariants = cva("flex h-full min-h-0 flex-col");

export const formHeaderVariants = cva([
  "flex shrink-0 flex-col gap-4",
  "border-b border-slate-100 pb-5",
  "sm:flex-row sm:items-end sm:justify-between",
]);

export const formContentVariants = cva(
  "min-h-0 flex-1 overflow-y-auto py-5 pr-1",
);

export const formSectionVariants = cva(
  ["rounded-2xl border p-5", "transition-colors duration-200", "sm:p-6"],
  {
    variants: {
      variant: {
        default:
          "border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]",
        soft: "border-primary/10 bg-primary/[0.025]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export const formGridVariants = cva("grid grid-cols-1 gap-x-5 gap-y-5", {
  variants: {
    columns: {
      1: "",
      2: "md:grid-cols-2",
      3: "md:grid-cols-2 xl:grid-cols-3",
      4: "md:grid-cols-2 xl:grid-cols-4",
    },
  },
  defaultVariants: {
    columns: 2,
  },
});

export const formFooterVariants = cva([
  "flex shrink-0 flex-col-reverse gap-3",
  "border-t border-slate-100 bg-white pt-4",
  "sm:flex-row sm:items-center sm:justify-end",
]);
