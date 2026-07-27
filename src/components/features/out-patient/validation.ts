import {
  dateNotAfterToday,
  email,
  maxLength,
  minLength,
  pattern,
  required,
  validDate,
  validate,
  validationMessages,
} from "@/src/core/validation";

import type {
  ConsultationFormValues,
  PatientFormValues,
  PrescriptionFormValues,
} from "./types";

const normalize = (value: string) => value.trim().replace(/\s+/g, " ");

export const validatePatientForm = (values: PatientFormValues) => {
  const normalized: PatientFormValues = {
    patientName: normalize(values.patientName),
    mobileNumber: values.mobileNumber.trim(),
    dateOfBirth: values.dateOfBirth,
    gender: values.gender,
    email: values.email.trim().toLowerCase(),
    address: normalize(values.address),
    bloodGroup: values.bloodGroup,
    aadhaarNumber: values.aadhaarNumber.trim(),
    maritalStatus: values.maritalStatus,
  };

  return validate(normalized, {
    patientName: [
      required<PatientFormValues>(validationMessages.required("Patient name")),
      minLength<PatientFormValues>(2, "Enter a valid patient name."),
      maxLength<PatientFormValues>(120, "Patient name is too long."),
    ],
    mobileNumber: [
      required<PatientFormValues>(
        validationMessages.required("Mobile number"),
      ),
      pattern<PatientFormValues>(
        /^[0-9]{10}$/,
        "Mobile number must contain exactly 10 digits.",
      ),
    ],
    dateOfBirth: [
      required<PatientFormValues>(
        validationMessages.required("Date of birth"),
      ),
      validDate<PatientFormValues>("Select a valid date of birth."),
      dateNotAfterToday<PatientFormValues>(
        "Date of birth cannot be in the future.",
      ),
    ],
    gender: [
      required<PatientFormValues>(validationMessages.select("Gender")),
    ],
    email: [
      email<PatientFormValues>(validationMessages.email),
      maxLength<PatientFormValues>(191, "Email is too long."),
    ],
    address: [
      required<PatientFormValues>(validationMessages.required("Address")),
      maxLength<PatientFormValues>(500, "Address is too long."),
    ],
    aadhaarNumber: [
      pattern<PatientFormValues>(
        /^[0-9]{12}$/,
        "Aadhaar number must contain exactly 12 digits.",
      ),
    ],
  });
};

export const validateConsultationForm = (
  values: ConsultationFormValues,
) => {
  const normalized: ConsultationFormValues = {
    ...values,
    illness: normalize(values.illness),
    medicalHistory: normalize(values.medicalHistory),
    allergy: normalize(values.allergy),
    examinationFindings: normalize(values.examinationFindings),
    diagnosis: normalize(values.diagnosis),
    advice: normalize(values.advice),
  };

  return validate(normalized, {
    patientId: [
      (value) =>
        Number(value) > 0 ? undefined : validationMessages.select("Patient"),
    ],
    consultationDate: [
      required<ConsultationFormValues>(
        validationMessages.required("Consultation date"),
      ),
      validDate<ConsultationFormValues>(
        "Select a valid consultation date.",
      ),
    ],
    illness: [
      required<ConsultationFormValues>(
        validationMessages.required("Illness"),
      ),
    ],
    examinationFindings: [
      required<ConsultationFormValues>(
        validationMessages.required("Examination findings"),
      ),
    ],
    diagnosis: [
      required<ConsultationFormValues>(
        validationMessages.required("Diagnosis"),
      ),
    ],
  });
};

export const validatePrescriptionForm = (
  values: PrescriptionFormValues,
) => {
  const normalized: PrescriptionFormValues = {
    ...values,
    medicine: normalize(values.medicine),
    strength: normalize(values.strength),
    dosage: normalize(values.dosage),
    frequency: normalize(values.frequency),
    duration: normalize(values.duration),
    instructions: normalize(values.instructions),
  };

  return validate(normalized, {
    patientId: [
      (value) =>
        Number(value) > 0 ? undefined : validationMessages.select("Patient"),
    ],
    prescriptionDate: [
      required<PrescriptionFormValues>(
        validationMessages.required("Prescription date"),
      ),
      validDate<PrescriptionFormValues>(
        "Select a valid prescription date.",
      ),
    ],
    medicine: [
      required<PrescriptionFormValues>(
        validationMessages.required("Medicine"),
      ),
    ],
    dosage: [
      required<PrescriptionFormValues>(
        validationMessages.required("Dosage"),
      ),
    ],
    frequency: [
      required<PrescriptionFormValues>(
        validationMessages.required("Frequency"),
      ),
    ],
    duration: [
      required<PrescriptionFormValues>(
        validationMessages.required("Duration"),
      ),
    ],
  });
};
