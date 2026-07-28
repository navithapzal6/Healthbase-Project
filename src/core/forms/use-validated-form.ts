"use client";

import type { FormEvent } from "react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { FormValidator } from "./use-form-validation";
import { useFormValidation } from "./use-form-validation";

interface ValidatedFormHelpers<TValues extends object> {
  resetForm: (nextValues?: TValues) => void;
}

interface UseValidatedFormOptions<TValues extends object> {
  createInitialValues: () => TValues;
  validate: FormValidator<TValues>;
  onValidSubmit: (
    values: TValues,
    helpers: ValidatedFormHelpers<TValues>,
  ) => void;
  resetKey?: unknown;
}

/**
 * Reusable controlled-form lifecycle:
 * values, typed field updates, field-error clearing, validation, submit and
 * reset. Feature forms keep only their fields and business validation rules.
 */
export const useValidatedForm = <TValues extends object>({
  createInitialValues,
  validate,
  onValidSubmit,
  resetKey,
}: UseValidatedFormOptions<TValues>) => {
  const createInitialValuesRef = useRef(createInitialValues);
  const validateRef = useRef(validate);
  const onValidSubmitRef = useRef(onValidSubmit);
  const previousResetKeyRef = useRef(resetKey);

  createInitialValuesRef.current = createInitialValues;
  validateRef.current = validate;
  onValidSubmitRef.current = onValidSubmit;

  const [values, setValues] = useState<TValues>(() =>
    createInitialValues(),
  );
  const {
    errors,
    setErrors,
    clearError,
    clearErrors,
    validateValues,
  } = useFormValidation<TValues>();

  const resetForm = useCallback(
    (nextValues?: TValues) => {
      setValues(nextValues ?? createInitialValuesRef.current());
      clearErrors();
    },
    [clearErrors],
  );

  useEffect(() => {
    if (Object.is(previousResetKeyRef.current, resetKey)) return;

    previousResetKeyRef.current = resetKey;
    resetForm();
  }, [resetForm, resetKey]);

  const setField = useCallback(
    <TField extends keyof TValues>(
      field: TField,
      value: TValues[TField],
    ) => {
      setValues((current) => ({
        ...current,
        [field]: value,
      }));
      clearError(field);
    },
    [clearError],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const result = validateValues(values, validateRef.current);
      if (!result.isValid) return;

      onValidSubmitRef.current(result.values, { resetForm });
    },
    [resetForm, validateValues, values],
  );

  return {
    values,
    errors,
    setValues,
    setErrors,
    setField,
    clearError,
    clearErrors,
    resetForm,
    handleSubmit,
  };
};
