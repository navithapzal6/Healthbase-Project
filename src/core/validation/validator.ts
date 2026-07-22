import type {
  ValidationErrors,
  ValidationResult,
  ValidationSchema,
} from "./types";

export const validate = <TValues extends object>(
  values: TValues,
  schema: ValidationSchema<TValues>,
): ValidationResult<TValues> => {
  const errors: ValidationErrors<TValues> = {};
  const fields = Object.keys(schema) as Array<keyof TValues>;

  fields.forEach((field) => {
    const rules = schema[field] ?? [];

    for (const rule of rules) {
      const message = rule(values[field], values);

      if (message) {
        errors[field] = message;
        break;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    values,
  };
};
