"use client";

import {
  TransactionEntryForm,
  type TransactionEntryFormProps,
} from "@/src/components/templates/transaction";

import { receiptContacts, receiptModes } from "./data";

const ReceiptEntryForm = (props: TransactionEntryFormProps) => (
  <TransactionEntryForm
    {...props}
    contacts={receiptContacts}
    paymentModes={receiptModes}
  />
);

export default ReceiptEntryForm;
