"use client";

import {
  TransactionTable,
  type TransactionTableProps,
} from "@/src/components/templates/transaction";

const PaymentTable = (props: TransactionTableProps) => (
  <TransactionTable {...props} />
);

export default PaymentTable;
