"use client";

import { useEffect, useState } from "react";

export const useDebouncedValue = <TValue>(
  value: TValue,
  delayMs = 250,
) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedValue(value),
      Math.max(0, delayMs),
    );

    return () => window.clearTimeout(timeout);
  }, [delayMs, value]);

  return debouncedValue;
};
