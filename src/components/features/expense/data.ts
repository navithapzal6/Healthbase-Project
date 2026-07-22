import {
  createHospitalTransactionRecords,
  hospitalPaymentModes,
  hospitalTransactionContacts,
} from "@/src/components/templates/transaction";

export const expenseContacts = hospitalTransactionContacts;
export const expenseModes = hospitalPaymentModes;

export const expenseCategories = [
  "Staff Salary",
  "Medical Supplies",
  "Pharmacy Purchase",
  "Lab Supplies",
  "Equipment Maintenance",
  "Housekeeping",
  "Biomedical Waste",
  "Utilities",
  "Ambulance Maintenance",
  "IT Services",
  "Rent",
  "Other Expense",
];

const expenseDescriptions = [
  "Monthly operating expense",
  "Approved vendor invoice",
  "Emergency purchase expense",
  "Scheduled maintenance expense",
  "Department expense settlement",
];

export const initialExpenseRecords = createHospitalTransactionRecords({
  prefix: "EXP",
  categories: expenseCategories,
  descriptions: expenseDescriptions,
  amountOffset: 725,
});
