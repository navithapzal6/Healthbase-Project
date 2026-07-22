export const validationMessages = {
  required: (label: string) => `${label} is required.`,
  select: (label: string) => `Select ${label.toLowerCase()}.`,
  minLength: (minimum: number) => `Enter at least ${minimum} characters.`,
  email: "Enter a valid email address.",
  positiveNumber: "Enter a valid amount.",
  passwordMismatch: "Password and confirm password must be the same.",
} as const;
