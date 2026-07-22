import type {
  NewTransactionPayload,
  TransactionContact,
  TransactionFormValues,
  TransactionPaymentMode,
  TransactionRecord,
} from "@/src/components/templates/transaction";

export type ExpenseMode = TransactionPaymentMode;
export type ExpenseContact = TransactionContact;
export type ExpenseRecord = TransactionRecord;
export type NewExpensePayload = NewTransactionPayload;
export type ExpenseFormValues = TransactionFormValues;
