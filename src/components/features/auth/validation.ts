import {
  email,
  matchesField,
  minLength,
  required,
  validate,
  validationMessages,
  type ValidationSchema,
} from "@/src/core/validation";

import type { AuthFormValues, AuthMode } from "./types";

const loginSchema: ValidationSchema<AuthFormValues> = {
  email: [
    required("Email address is required."),
    email(validationMessages.email),
  ],
  password: [
    required("Password is required."),
    minLength(6, validationMessages.minLength(6)),
  ],
};

const signupSchema: ValidationSchema<AuthFormValues> = {
  fullName: [
    required("Full name is required."),
    minLength(2, validationMessages.minLength(2)),
  ],
  email: [
    required("Email address is required."),
    email(validationMessages.email),
  ],
  password: [
    required("Password is required."),
    minLength(6, validationMessages.minLength(6)),
  ],
  confirmPassword: [
    required("Confirm password is required."),
    matchesField("password", validationMessages.passwordMismatch),
  ],
};

export const getAuthFormValues = (
  form: HTMLFormElement,
): AuthFormValues => {
  const formData = new FormData(form);

  return {
    fullName: String(formData.get("fullName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };
};

export const validateAuthForm = (
  mode: AuthMode,
  values: AuthFormValues,
) => validate(values, mode === "login" ? loginSchema : signupSchema);
