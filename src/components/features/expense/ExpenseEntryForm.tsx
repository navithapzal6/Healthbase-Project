"use client";

import {
  TransactionEntryForm,
  type TransactionEntryFormProps,
} from "@/src/components/templates/transaction";

import { expenseContacts, expenseModes } from "./data";

const ExpenseEntryForm = (props: TransactionEntryFormProps) => (
  <TransactionEntryForm
    {...props}
    contacts={expenseContacts}
    paymentModes={expenseModes}
  />
);

export default ExpenseEntryForm;
