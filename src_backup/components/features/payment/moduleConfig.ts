import { CreditCard, HandCoins, ReceiptIndianRupee } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { initialPaymentRecords, paymentCategories } from "./data";
import type { PaymentRecord } from "./types";

export type TransactionModule = "payment" | "receipt" | "expense";

export interface TransactionModuleConfig {
  singular: string;
  plural: string;
  prefix: string;
  icon: LucideIcon;
  categories: string[];
  loadingLabel: string;
  modalSubtitle: string;
  descriptionPlaceholder: string;
  initialRecords: PaymentRecord[];
}

const receiptCategories = [
  "Patient Consultation", "Pharmacy Sale", "Lab Collection", "Room Charges",
  "Insurance Settlement", "Advance Receipt", "Ambulance Charges", "Procedure Charges",
  "Registration Fee", "Other Income",
];

const expenseCategories = [
  "Staff Salary", "Medical Supplies", "Pharmacy Purchase", "Lab Supplies",
  "Equipment Maintenance", "Housekeeping", "Biomedical Waste", "Utilities",
  "Ambulance Maintenance", "IT Services", "Rent", "Other Expense",
];

const createRecords = (
  prefix: string,
  categories: string[],
  descriptions: string[],
  amountOffset: number,
) => initialPaymentRecords.map((record, index) => ({
  ...record,
  id: `${prefix}-${String(index + 1).padStart(4, "0")}`,
  category: categories[(index * 3) % categories.length],
  description: descriptions[index % descriptions.length],
  amount: record.amount + amountOffset,
}));

export const transactionConfigs: Record<TransactionModule, TransactionModuleConfig> = {
  payment: {
    singular: "Payment",
    plural: "Payments",
    prefix: "PAY",
    icon: CreditCard,
    categories: paymentCategories,
    loadingLabel: "Loading hospital payments...",
    modalSubtitle: "Create a hospital payment and review this contact's previous history.",
    descriptionPlaceholder: "Enter payment details",
    initialRecords: initialPaymentRecords,
  },
  receipt: {
    singular: "Receipt",
    plural: "Receipts",
    prefix: "REC",
    icon: HandCoins,
    categories: receiptCategories,
    loadingLabel: "Loading hospital receipts...",
    modalSubtitle: "Create a hospital receipt and review this contact's previous receipt history.",
    descriptionPlaceholder: "Enter receipt details",
    initialRecords: createRecords(
      "REC",
      receiptCategories,
      ["Consultation amount received", "Patient advance received", "Insurance settlement received", "Pharmacy bill collected", "Lab service amount received"],
      350,
    ),
  },
  expense: {
    singular: "Expense",
    plural: "Expenses",
    prefix: "EXP",
    icon: ReceiptIndianRupee,
    categories: expenseCategories,
    loadingLabel: "Loading hospital expenses...",
    modalSubtitle: "Create a hospital expense and review this contact's previous expense history.",
    descriptionPlaceholder: "Enter expense details",
    initialRecords: createRecords(
      "EXP",
      expenseCategories,
      ["Monthly operating expense", "Approved vendor invoice", "Emergency purchase expense", "Scheduled maintenance expense", "Department expense settlement"],
      725,
    ),
  },
};
