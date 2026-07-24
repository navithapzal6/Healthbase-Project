"use client";

import { useEffect, useRef } from "react";

import { Checkbox } from "@/src/components/ui";

import type { ListCheckboxProps } from "./types";

const ListCheckbox = ({
  indeterminate = false,
  label,
  ...props
}: ListCheckboxProps) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <Checkbox
      ref={checkboxRef}
      unstyled
      aria-label={label}
      className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[var(--primary)] focus:ring-2 focus:ring-primary/20"
      {...props}
    />
  );
};

export default ListCheckbox;
