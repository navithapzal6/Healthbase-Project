"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { PopoverProps } from "./types";

const alignClasses = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};

const Popover = ({
  trigger,
  children,
  align = "end",
  className,
  contentClassName,
  open,
  defaultOpen = false,
  onOpenChange,
}: PopoverProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, [setOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, isOpen, setOpen]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex ${className ?? ""}`}
    >
      {trigger({
        ref: (node) => {
          triggerRef.current = node;
        },
        onClick: () => setOpen(!isOpen),
        "aria-expanded": isOpen,
        "aria-haspopup": "menu",
      })}

      {isOpen && (
        <div
          role="menu"
          className={`absolute top-full z-[70] mt-2 min-w-[220px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ${alignClasses[align]} ${contentClassName ?? ""}`}
        >
          {typeof children === "function" ? children(close) : children}
        </div>
      )}
    </div>
  );
};

export default Popover;
