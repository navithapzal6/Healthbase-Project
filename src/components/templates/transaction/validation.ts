import {
  positiveNumber,
  required,
  validDate,
  validate,
  validationMessages,
  type ValidationSchema,
} from "@/src/core/validation";

import type { TransactionFormValues } from "./types";

const normalizeTransactionValues = (
  values: TransactionFormValues,
): TransactionFormValues => ({
  ...values,
  date: values.date.trim(),
  contactId: values.contactId.trim(),
  category: values.category.trim(),
  paymentMode: values.paymentMode,
  description: values.description.trim(),
  amount: values.amount.trim(),
});

const createTransactionSchema = (
  singular: string,
): ValidationSchema<TransactionFormValues> => ({
  date: [
    required(`${singular} date is required`),
    validDate(`Enter ${singular.toLowerCase()} date in DD/MM/YYYY format`),
  ],
  contactId: [required("Select a contact")],
  category: [required("Select a category")],
  paymentMode: [required("Select a payment mode")],
  description: [required("Description is required")],
  amount: [positiveNumber(validationMessages.positiveNumber)],
});

export const validateTransactionForm = (
  values: TransactionFormValues,
  singular: string,
) => {
  const normalizedValues = normalizeTransactionValues(values);
  return validate(normalizedValues, createTransactionSchema(singular));
};
