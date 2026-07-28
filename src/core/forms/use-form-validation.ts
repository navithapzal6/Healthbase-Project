"use client";

import { useCallback, useState } from "react";

import type {
  ValidationErrors,
  ValidationResult,
} from "../validation";
import { clearFieldError } from "./form-errors";

export type FormValidator<TValues extends object> = (
  values: TValues,
) => ValidationResult<TValues>;

/**
 * Shared validation state for controlled and native FormData based forms.
 * Feature files own their rules; this hook owns the reusable error lifecycle.
 */
export const useFormValidation = <TValues extends object>() => {
  const [errors, setErrors] = useState<ValidationErrors<TValues>>({});

  const clearError = useCallback((field: keyof TValues) => {
    setErrors((current) => clearFieldError(current, field));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const validateValues = useCallback(
    (values: TValues, validator: FormValidator<TValues>) => {
      const result = validator(values);
      setErrors(result.errors);
      return result;
    },
    [],
  );

  return {
    errors,
    setErrors,
    clearError,
    clearErrors,
    validateValues,
  };
};
