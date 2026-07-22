import { cva } from "class-variance-authority";

export const headerVariants = cva(
  [
    // Layout
    "sticky top-0 z-40",
    "flex items-center justify-between",
    "w-full h-20 px-6",

    // Glass Effect
    "backdrop-blur-xl",

    // Animation
    "transition-all duration-300",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",

        bordered: "border-border",

        elevated: "shadow-sm",

        floating:
          "rounded-2xl border border-border shadow-lg bg-white/70 mx-4 mt-4",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);

// export const iconButtonVariants = cva(
//   [
//     "flex items-center justify-center",
//     "w-10 h-10",
//     "rounded-xl",
//     "transition-all duration-200",
//     "cursor-pointer",
//     "border border-transparent",
//     "focus:outline-none",
//     "focus:ring-2 focus:ring-primary/20",
//   ].join(" "),
//   {
//     variants: {
//       variant: {
//         default:
//           "bg-secondary text-primary hover:bg-primary hover:text-white",

//         active:
//           "bg-primary text-white",

//         ghost:
//           "bg-transparent hover:bg-secondary text-primary",
//       },
//     },

//     defaultVariants: {
//       variant: "default",
//     },
//   }
// );

export const iconButtonVariants = cva(
  "inline-flex items-center justify-center h-10 w-10 rounded-xl transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary hover:bg-primary hover:text-white active:bg-primary",

        primary: "bg-primary text-white hover:opacity-90",

        ghost: "bg-transparent hover:bg-secondary text-primary",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);
export const searchVariants = cva(`
  flex
  items-center
  h-9
  w-full
  rounded-2xl
  border-slate-200
  bg-white
  shadow-sm
  transition-all
  duration-200
  focus-within:border-primary
  focus-within:ring-2
  focus-within:ring-primary/10
`);

export const avatarVariants = cva(
  [
    "flex items-center justify-center",
    "w-9 h-9",
    "rounded-full",
    "bg-primary",
    "text-white",
    "font-semibold",
    "text-base",
    "select-none",
  ].join(" "),
);
