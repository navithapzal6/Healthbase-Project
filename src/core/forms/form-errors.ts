import type { ValidationErrors } from "../validation";

export const clearFieldError = <
  TValues extends object,
  TField extends keyof TValues,
>(
  errors: ValidationErrors<TValues>,
  field: TField,
): ValidationErrors<TValues> => {
  if (!errors[field]) return errors;

  const nextErrors = { ...errors };
  delete nextErrors[field];
  return nextErrors;
};
