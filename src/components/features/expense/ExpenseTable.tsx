"use client";

import {
  TransactionTable,
  type TransactionTableProps,
} from "@/src/components/templates/transaction";

const ExpenseTable = (props: TransactionTableProps) => (
  <TransactionTable {...props} />
);

export default ExpenseTable;
