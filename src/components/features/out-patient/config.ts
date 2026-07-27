import type {
  ConsultationRecord,
  OutPatientColumn,
  OutPatientModuleConfig,
  PatientRecord,
  PrescriptionRecord,
} from "./types";
import { formatDisplayDate, maskAadhaar } from "./utils";

const fallback = (value: string) => value || "—";

export const patientConfig: OutPatientModuleConfig = {
  id: "patient",
  singular: "Patient",
  plural: "Patients",
  listTitle: "Patient List",
  createTitle: "New Patient",
  searchPlaceholder: "Search patients...",
  sortOptions: [
    { label: "Patient Name", value: "patientName" },
    { label: "Date of Birth", value: "dateOfBirth" },
    { label: "Age", value: "age" },
    { label: "Created Date", value: "createdAt" },
  ],
  defaultSort: "patientName",
  defaultSortDirection: "asc",
  tableMinWidth: 1440,
};

export const consultationConfig: OutPatientModuleConfig = {
  id: "consultation",
  singular: "Consultation",
  plural: "Consultations",
  listTitle: "Consultation List",
  createTitle: "New Consultation",
  searchPlaceholder: "Search consultations...",
  sortOptions: [
    { label: "Patient Name", value: "patientName" },
    {
      label: "Consultation Date",
      shortLabel: "Date",
      value: "consultationDate",
    },
    { label: "Illness", value: "illness" },
    { label: "Diagnosis", value: "diagnosis" },
  ],
  defaultSort: "consultationDate",
  defaultSortDirection: "desc",
  tableMinWidth: 1510,
  needsPatientOptions: true,
};

export const prescriptionConfig: OutPatientModuleConfig = {
  id: "prescription",
  singular: "Prescription",
  plural: "Prescriptions",
  listTitle: "Prescription List",
  createTitle: "New Prescription",
  searchPlaceholder: "Search prescriptions...",
  sortOptions: [
    { label: "Patient Name", value: "patientName" },
    {
      label: "Prescription Date",
      shortLabel: "Date",
      value: "prescriptionDate",
    },
    { label: "Medicine", value: "medicine" },
    { label: "Frequency", value: "frequency" },
  ],
  defaultSort: "prescriptionDate",
  defaultSortDirection: "desc",
  tableMinWidth: 1405,
  needsPatientOptions: true,
};

export const patientColumns: OutPatientColumn<PatientRecord>[] = [
  { id: "uhid", label: "UHID", width: "110px", render: (record) => record.uhid },
  {
    id: "patientName",
    label: "Patient Name",
    width: "150px",
    cellClassName: "font-semibold text-slate-800",
    render: (record) => record.patientName,
  },
  {
    id: "mobileNumber",
    label: "Mobile Number",
    width: "120px",
    render: (record) => record.mobileNumber,
  },
  {
    id: "dateOfBirth",
    label: "Date of Birth",
    width: "120px",
    render: (record) => formatDisplayDate(record.dateOfBirth),
  },
  {
    id: "age",
    label: "Age",
    width: "65px",
    align: "center",
    render: (record) => record.age,
  },
  { id: "gender", label: "Gender", width: "90px", render: (record) => record.gender },
  {
    id: "email",
    label: "Email",
    width: "190px",
    render: (record) => fallback(record.email),
  },
  { id: "address", label: "Address", width: "220px", render: (record) => record.address },
  {
    id: "bloodGroup",
    label: "Blood Group",
    width: "95px",
    align: "center",
    render: (record) => fallback(record.bloodGroup),
  },
  {
    id: "aadhaarNumber",
    label: "Aadhaar Number",
    width: "140px",
    render: (record) => maskAadhaar(record.aadhaarNumber),
  },
  {
    id: "maritalStatus",
    label: "Marital Status",
    width: "110px",
    render: (record) => fallback(record.maritalStatus),
  },
];

export const consultationColumns: OutPatientColumn<ConsultationRecord>[] = [
  {
    id: "consultationNumber",
    label: "Consultation No.",
    width: "145px",
    render: (record) => record.consultationNumber,
  },
  {
    id: "patientName",
    label: "Patient Name",
    width: "170px",
    cellClassName: "font-semibold text-slate-800",
    render: (record) => record.patientName,
  },
  {
    id: "consultationDate",
    label: "Date",
    width: "115px",
    render: (record) => formatDisplayDate(record.consultationDate),
  },
  { id: "illness", label: "Illness", width: "150px", render: (record) => record.illness },
  {
    id: "medicalHistory",
    label: "Medical History",
    width: "190px",
    render: (record) => fallback(record.medicalHistory),
  },
  {
    id: "allergy",
    label: "Allergy",
    width: "150px",
    render: (record) => fallback(record.allergy),
  },
  {
    id: "examinationFindings",
    label: "Examination Findings",
    width: "220px",
    render: (record) => record.examinationFindings,
  },
  {
    id: "diagnosis",
    label: "Diagnosis",
    width: "190px",
    render: (record) => record.diagnosis,
  },
  {
    id: "advice",
    label: "Advice",
    width: "190px",
    render: (record) => fallback(record.advice),
  },
];

export const prescriptionColumns: OutPatientColumn<PrescriptionRecord>[] = [
  {
    id: "prescriptionNumber",
    label: "Prescription No.",
    width: "145px",
    render: (record) => record.prescriptionNumber,
  },
  {
    id: "patientName",
    label: "Patient Name",
    width: "170px",
    cellClassName: "font-semibold text-slate-800",
    render: (record) => record.patientName,
  },
  {
    id: "prescriptionDate",
    label: "Date",
    width: "115px",
    render: (record) => formatDisplayDate(record.prescriptionDate),
  },
  { id: "medicine", label: "Medicine", width: "170px", render: (record) => record.medicine },
  {
    id: "strength",
    label: "Strength",
    width: "100px",
    render: (record) => fallback(record.strength),
  },
  { id: "dosage", label: "Dosage", width: "110px", render: (record) => record.dosage },
  {
    id: "frequency",
    label: "Frequency",
    width: "130px",
    render: (record) => record.frequency,
  },
  { id: "duration", label: "Duration", width: "105px", render: (record) => record.duration },
  {
    id: "instructions",
    label: "Instructions",
    width: "260px",
    render: (record) => fallback(record.instructions),
  },
];
