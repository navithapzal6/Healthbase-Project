import type { PaymentContact, PaymentMode, PaymentRecord } from "./types";
import { formatAppDate } from "@/src/core/date";

export const paymentContacts: PaymentContact[] = [
  { id: "c-001", name: "Dr. Aravind Kumar", reference: "Consultant · Cardiology" },
  { id: "c-002", name: "Dr. Meena Priya", reference: "Consultant · Pediatrics" },
  { id: "c-003", name: "Apollo Medical Supplies", reference: "Vendor · MED-1042" },
  { id: "c-004", name: "Kavitha R", reference: "Staff · Nursing" },
  { id: "c-005", name: "Suresh Babu", reference: "Staff · Administration" },
  { id: "c-006", name: "CarePlus Diagnostics", reference: "Vendor · LAB-2081" },
  { id: "c-007", name: "Sri Ambulance Services", reference: "Vendor · TRN-1120" },
  { id: "c-008", name: "Ravi Chandran", reference: "Patient · UHID-52018" },
  { id: "c-009", name: "Ayesha Begum", reference: "Staff · Pharmacy" },
  { id: "c-010", name: "GreenClean Facility", reference: "Vendor · HSK-4405" },
  { id: "c-011", name: "MedTech Equipments", reference: "Vendor · EQP-3007" },
  { id: "c-012", name: "Dr. Sanjay Raj", reference: "Consultant · Orthopedics" },
  { id: "c-013", name: "Lakshmi Devi", reference: "Patient · UHID-52044" },
  { id: "c-014", name: "BioSafe Waste Care", reference: "Vendor · WST-1009" },
  { id: "c-015", name: "Vijayalakshmi S", reference: "Staff · Reception" },
];

export const paymentCategories = [
  "Staff Salary", "Doctor Consultation Fee", "Medical Supplies", "Lab Services",
  "Pharmacy Purchase", "Ambulance Service", "Equipment Maintenance", "Housekeeping",
  "Biomedical Waste", "Patient Refund", "Utilities", "IT Services",
];

export const paymentModes: PaymentMode[] = ["Cash", "UPI", "Bank Transfer", "Cheque", "Card"];

const descriptions = [
  "Monthly service settlement", "Approved invoice payment", "Emergency requirement purchase",
  "Scheduled monthly payout", "Service and maintenance charges", "Advance payment against order",
  "Patient account refund", "Consumables purchase settlement",
];

const appDate = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  return formatAppDate(date);
};

export const initialPaymentRecords: PaymentRecord[] = Array.from({ length: 50 }, (_, index) => {
  const contact = paymentContacts[index % paymentContacts.length];
  const category = paymentCategories[(index * 5 + contact.id.length) % paymentCategories.length];
  return {
    id: `PAY-${String(index + 1).padStart(4, "0")}`,
    date: appDate(index % 45),
    contactId: contact.id,
    contactName: contact.name,
    category,
    paymentMode: paymentModes[index % paymentModes.length],
    description: descriptions[index % descriptions.length],
    amount: 1250 + ((index * 1375) % 48500),
  };
});
