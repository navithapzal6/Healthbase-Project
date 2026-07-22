import type {
  NewTransactionPayload,
  TransactionContact,
  TransactionFormValues,
  TransactionPaymentMode,
  TransactionRecord,
} from "@/src/components/templates/transaction";

export type ReceiptMode = TransactionPaymentMode;
export type ReceiptContact = TransactionContact;
export type ReceiptRecord = TransactionRecord;
export type NewReceiptPayload = NewTransactionPayload;
export type ReceiptFormValues = TransactionFormValues;
