import type { ComponentType, ReactNode } from "react";

import type {
  ListSortDirection,
  ListSortOption,
} from "@/src/components/page/list";
import type { TypeaheadOptionsLoader } from "@/src/components/ui";

export type OutPatientSectionId =
  | "patient"
  | "consultation"
  | "prescription";

export type OutPatientViewId = "list" | "entry";

export interface OutPatientSection {
  id: OutPatientSectionId;
  label: string;
  description: string;
}

export interface OutPatientSectionNavProps {
  activeSection: OutPatientSectionId;
  collapsed?: boolean;
  onToggle?: () => void;
  onChange: (section: OutPatientSectionId) => void;
}

export interface OutPatientContentProps {
  section: OutPatientSection;
}

export interface PatientRecord {
  id: number;
  uhid: string;
  patientName: string;
  mobileNumber: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  email: string;
  address: string;
  bloodGroup: string;
  aadhaarNumber: string;
  maritalStatus: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationRecord {
  id: number;
  consultationNumber: string;
  patientId: number;
  patientName: string;
  patientUhid: string;
  consultationDate: string;
  illness: string;
  medicalHistory: string;
  allergy: string;
  examinationFindings: string;
  diagnosis: string;
  advice: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionRecord {
  id: number;
  prescriptionNumber: string;
  patientId: number;
  patientName: string;
  patientUhid: string;
  prescriptionDate: string;
  medicine: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PatientFormValues {
  patientName: string;
  mobileNumber: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  address: string;
  bloodGroup: string;
  aadhaarNumber: string;
  maritalStatus: string;
}

export interface ConsultationFormValues {
  patientId: number;
  consultationDate: string;
  illness: string;
  medicalHistory: string;
  allergy: string;
  examinationFindings: string;
  diagnosis: string;
  advice: string;
}

export interface PrescriptionFormValues {
  patientId: number;
  prescriptionDate: string;
  medicine: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface PatientOption {
  value: string;
  label: string;
  description?: string;
}

export interface ListRecordsParams {
  cursor?: string | null;
  limit: number;
  includeTotal?: boolean;
  search: string;
  sortBy: string;
  sortDirection: ListSortDirection;
  signal?: AbortSignal;
}

export interface PaginationMeta {
  limit: number;
  totalItems?: number;
  totalPages?: number;
  nextCursor?: string;
  hasMore: boolean;
}

export interface PaginatedResult<TRecord> {
  items: TRecord[];
  pagination: PaginationMeta;
}

export interface ApiEnvelope<TData> {
  success: boolean;
  message: string;
  data: TData;
}

export interface OutPatientColumn<TRecord> {
  id: string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  cellClassName?: string;
  render: (record: TRecord) => ReactNode;
}

export interface OutPatientModuleConfig {
  id: OutPatientSectionId;
  singular: string;
  plural: string;
  listTitle: string;
  createTitle: string;
  searchPlaceholder: string;
  sortOptions: ListSortOption[];
  defaultSort: string;
  defaultSortDirection: ListSortDirection;
  tableMinWidth: number;
  needsPatientOptions?: boolean;
}

export interface OutPatientEntryFormProps<TValues extends object> {
  initialValues?: TValues;
  patientOptions?: PatientOption[];
  loadPatientOptions?: TypeaheadOptionsLoader;
  saving?: boolean;
  submitLabel?: string;
  onSubmit: (values: TValues) => void;
}

export interface OutPatientModuleProps<
  TRecord extends { id: number },
  TValues extends object,
> {
  config: OutPatientModuleConfig;
  columns: OutPatientColumn<TRecord>[];
  EntryForm: ComponentType<OutPatientEntryFormProps<TValues>>;
  list: (params: ListRecordsParams) => Promise<PaginatedResult<TRecord>>;
  create: (values: TValues) => Promise<TRecord>;
  update: (id: number, values: TValues) => Promise<TRecord>;
  remove: (ids: number[]) => Promise<number>;
  toFormValues: (record: TRecord) => TValues;
  loadPatientOptions?: TypeaheadOptionsLoader;
  toPatientOption?: (record: TRecord) => PatientOption;
}
