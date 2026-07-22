import { ReceiptIndianRupee } from "lucide-react";

import type { TransactionConfig } from "@/src/components/templates/transaction";

import {
  expenseCategories,
  expenseModes,
  initialExpenseRecords,
} from "./data";

export const expenseConfig: TransactionConfig = {
  singular: "Expense",
  plural: "Expenses",
  prefix: "EXP",
  icon: ReceiptIndianRupee,
  categories: expenseCategories,
  paymentModes: expenseModes,
  loadingLabel: "Loading hospital expenses...",
  modalSubtitle:
    "Create a hospital expense and review this contact's previous expense history.",
  descriptionPlaceholder: "Enter expense details",
  initialRecords: initialExpenseRecords,
};
