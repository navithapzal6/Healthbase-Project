import type {
  ServerValidationErrorPayload,
  ValidationErrors,
} from "./types";

const firstMessage = (message: string | string[]) =>
  Array.isArray(message) ? message[0] : message;

export const mapServerValidationErrors = <TValues extends object>(
  payload: ServerValidationErrorPayload | null | undefined,
  fieldAliases: Partial<Record<string, keyof TValues>> = {},
): ValidationErrors<TValues> => {
  const source = payload?.fieldErrors ?? payload?.errors ?? {};
  const mappedErrors: ValidationErrors<TValues> = {};

  Object.entries(source).forEach(([serverField, message]) => {
    const clientField = fieldAliases[serverField] ?? (serverField as keyof TValues);
    mappedErrors[clientField] = firstMessage(message);
  });

  return mappedErrors;
};
