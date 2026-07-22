import type { ValidationRule } from "./types";

const isEmptyValue = (value: unknown) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
};

export const required = <TValues extends object>(
  message: string,
): ValidationRule<TValues> =>
  (value) => (isEmptyValue(value) ? message : undefined);

export const minLength = <TValues extends object>(
  minimum: number,
  message: string,
): ValidationRule<TValues> =>
  (value) => {
    if (isEmptyValue(value)) return undefined;
    return String(value).trim().length < minimum ? message : undefined;
  };

export const email = <TValues extends object>(
  message: string,
): ValidationRule<TValues> =>
  (value) => {
    if (isEmptyValue(value)) return undefined;

    const normalizedValue = String(value).trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(normalizedValue) ? undefined : message;
  };

export const positiveNumber = <TValues extends object>(
  message: string,
): ValidationRule<TValues> =>
  (value) => {
    if (isEmptyValue(value)) return message;

    const numericValue = Number(value);
    return Number.isFinite(numericValue) && numericValue > 0
      ? undefined
      : message;
  };

export const matchesField = <TValues extends object>(
  field: keyof TValues,
  message: string,
): ValidationRule<TValues> =>
  (value, values) => (value === values[field] ? undefined : message);
