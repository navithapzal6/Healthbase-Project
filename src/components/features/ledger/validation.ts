import {
  minLength,
  required,
  validate,
  validationMessages,
  type ValidationSchema,
} from "@/src/core/validation";

import type { LedgerFormValues } from "./types";

const ledgerSchema: ValidationSchema<LedgerFormValues> = {
  ledgerName: [
    required("Ledger name is required."),
    minLength(3, validationMessages.minLength(3)),
  ],
  description: [
    required("Description is required."),
    minLength(5, validationMessages.minLength(5)),
  ],
};

const normalizeLedgerValues = (
  values: LedgerFormValues,
): LedgerFormValues => ({
  ledgerName: values.ledgerName.trim(),
  description: values.description.trim(),
});

export const validateLedgerForm = (values: LedgerFormValues) =>
  validate(normalizeLedgerValues(values), ledgerSchema);
