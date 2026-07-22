"use client";

import {
  TransactionTable,
  type TransactionTableProps,
} from "@/src/components/templates/transaction";

const ReceiptTable = (props: TransactionTableProps) => (
  <TransactionTable {...props} />
);

export default ReceiptTable;
