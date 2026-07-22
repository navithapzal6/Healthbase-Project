import { HandCoins } from "lucide-react";

import type { TransactionConfig } from "@/src/components/templates/transaction";

import {
  initialReceiptRecords,
  receiptCategories,
  receiptModes,
} from "./data";

export const receiptConfig: TransactionConfig = {
  singular: "Receipt",
  plural: "Receipts",
  prefix: "REC",
  icon: HandCoins,
  categories: receiptCategories,
  paymentModes: receiptModes,
  loadingLabel: "Loading hospital receipts...",
  modalSubtitle:
    "Create a hospital receipt and review this contact's previous receipt history.",
  descriptionPlaceholder: "Enter receipt details",
  initialRecords: initialReceiptRecords,
};
