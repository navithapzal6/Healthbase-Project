import {
  createHospitalTransactionRecords,
  hospitalPaymentModes,
  hospitalTransactionContacts,
} from "@/src/components/templates/transaction";

export const receiptContacts = hospitalTransactionContacts;
export const receiptModes = hospitalPaymentModes;

export const receiptCategories = [
  "Patient Consultation",
  "Pharmacy Sale",
  "Lab Collection",
  "Room Charges",
  "Insurance Settlement",
  "Advance Receipt",
  "Ambulance Charges",
  "Procedure Charges",
  "Registration Fee",
  "Other Income",
];

const receiptDescriptions = [
  "Consultation amount received",
  "Patient advance received",
  "Insurance settlement received",
  "Pharmacy bill collected",
  "Lab service amount received",
];

export const initialReceiptRecords = createHospitalTransactionRecords({
  prefix: "REC",
  categories: receiptCategories,
  descriptions: receiptDescriptions,
  amountOffset: 350,
});
