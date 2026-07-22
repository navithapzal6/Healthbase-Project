"use client";

import {
  TransactionEntryForm,
  type TransactionEntryFormProps,
} from "@/src/components/templates/transaction";

import { paymentContacts, paymentModes } from "./data";

const PaymentEntryForm = (props: TransactionEntryFormProps) => (
  <TransactionEntryForm
    {...props}
    contacts={paymentContacts}
    paymentModes={paymentModes}
  />
);

export default PaymentEntryForm;
