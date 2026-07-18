export type LoaderSize = "sm" | "md" | "lg";
export type LoaderVariant = "inline" | "content" | "overlay";

export interface LoaderProps {
  className?: string;
  label?: string;
  size?: LoaderSize;
  variant?: LoaderVariant;
}
