import type {
  ConsultationFormValues,
  ConsultationRecord,
  PatientFormValues,
  PatientRecord,
  PrescriptionFormValues,
  PrescriptionRecord,
} from "./types";

export const todayDate = () => new Date().toISOString().slice(0, 10);

export const calculateAge = (
  dateOfBirth: string,
  referenceDate = new Date(),
) => {
  if (!dateOfBirth) return "";

  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birthDate.getTime()) || birthDate > referenceDate) {
    return "";
  }

  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const monthDifference = referenceDate.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      referenceDate.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age >= 0 ? String(age) : "";
};

export const formatDisplayDate = (value: string) => {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const maskAadhaar = (value: string) =>
  value ? `•••• •••• ${value.slice(-4)}` : "—";

export const patientToFormValues = (
  record: PatientRecord,
): PatientFormValues => ({
  patientName: record.patientName,
  mobileNumber: record.mobileNumber,
  dateOfBirth: record.dateOfBirth,
  gender: record.gender,
  email: record.email,
  address: record.address,
  bloodGroup: record.bloodGroup,
  aadhaarNumber: record.aadhaarNumber,
  maritalStatus: record.maritalStatus,
});

export const consultationToFormValues = (
  record: ConsultationRecord,
): ConsultationFormValues => ({
  patientId: record.patientId,
  consultationDate: record.consultationDate,
  illness: record.illness,
  medicalHistory: record.medicalHistory,
  allergy: record.allergy,
  examinationFindings: record.examinationFindings,
  diagnosis: record.diagnosis,
  advice: record.advice,
});

export const prescriptionToFormValues = (
  record: PrescriptionRecord,
): PrescriptionFormValues => ({
  patientId: record.patientId,
  prescriptionDate: record.prescriptionDate,
  medicine: record.medicine,
  strength: record.strength,
  dosage: record.dosage,
  frequency: record.frequency,
  duration: record.duration,
  instructions: record.instructions,
});
