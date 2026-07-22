export type ValidationErrors<TValues extends object> = Partial<
  Record<keyof TValues, string>
>;

export type ValidationRule<TValues extends object> = (
  value: unknown,
  values: TValues,
) => string | undefined;

export type ValidationSchema<TValues extends object> = Partial<{
  [TField in keyof TValues]: readonly ValidationRule<TValues>[];
}>;

export interface ValidationResult<TValues extends object> {
  isValid: boolean;
  errors: ValidationErrors<TValues>;
  values: TValues;
}

export interface ServerValidationErrorPayload {
  fieldErrors?: Record<string, string | string[]>;
  errors?: Record<string, string | string[]>;
}
