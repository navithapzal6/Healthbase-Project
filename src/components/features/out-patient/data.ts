import type { OutPatientSection } from "./types";

export const outPatientSections: OutPatientSection[] = [
  {
    id: "patient",
    label: "Patient",
    description: "Patient registration and demographic records",
  },
  {
    id: "consultation",
    label: "Consultation",
    description: "Clinical consultation and diagnosis records",
  },
  {
    id: "prescription",
    label: "Prescription",
    description: "Patient medicine and dosage instructions",
  },
];

export const genderOptions = ["Male", "Female", "Other"] as const;

export const bloodGroupOptions = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export const maritalStatusOptions = [
  "Single",
  "Married",
  "Divorced",
  "Widowed",
] as const;
