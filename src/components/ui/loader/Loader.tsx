"use client";

import { cn } from "@/src/lib/utils";

import type { LoaderProps, LoaderSize } from "./types";

const sizeClasses: Record<LoaderSize, string> = {
  sm: "h-5 w-5",
  md: "h-9 w-9",
  lg: "h-14 w-14",
};

const spokeOpacity = [1, 0.88, 0.75, 0.62, 0.5, 0.38, 0.27, 0.18];

const Loader = ({
  className,
  label = "Loading...",
  size = "md",
  variant = "inline",
}: LoaderProps) => {
  const indicator = (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn("flex items-center justify-center gap-3", className)}
    >
      <div
        aria-hidden="true"
        className={cn("relative shrink-0 animate-spin", sizeClasses[size])}
      >
        {spokeOpacity.map((opacity, index) => (
          <span
            key={index}
            className="absolute inset-0"
            style={{ transform: `rotate(${index * 45}deg)` }}
          >
            <span
              className="mx-auto block h-[32%] w-[13%] rounded-full bg-primary"
              style={{ opacity }}
            />
          </span>
        ))}
      </div>

      {label && (
        <span className="text-sm font-medium text-slate-600">{label}</span>
      )}
    </div>
  );

  if (variant === "overlay") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/85 backdrop-blur-[2px]">
        {indicator}
      </div>
    );
  }

  if (variant === "content") {
    return (
      <div className="flex h-full min-h-48 items-center justify-center">
        {indicator}
      </div>
    );
  }

  return indicator;
};

export default Loader;
