import { CreditCard } from "lucide-react";

import type { TransactionConfig } from "@/src/components/templates/transaction";

import {
  initialPaymentRecords,
  paymentCategories,
  paymentModes,
} from "./data";

export const paymentConfig: TransactionConfig = {
  singular: "Payment",
  plural: "Payments",
  prefix: "PAY",
  icon: CreditCard,
  categories: paymentCategories,
  paymentModes,
  loadingLabel: "Loading hospital payments...",
  modalSubtitle:
    "Create a hospital payment and review this contact's previous history.",
  descriptionPlaceholder: "Enter payment details",
  initialRecords: initialPaymentRecords,
};
