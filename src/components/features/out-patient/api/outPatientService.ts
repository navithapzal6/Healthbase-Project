import { apiClient } from "@/src/core/api";
import { getAuthToken } from "@/src/core/auth";

import type {
  ApiEnvelope,
  ConsultationFormValues,
  ConsultationRecord,
  ListRecordsParams,
  PaginatedResult,
  PatientFormValues,
  PatientOption,
  PatientRecord,
  PrescriptionFormValues,
  PrescriptionRecord,
} from "../types";

const BASE_PATH = "/api/v1/out-patients";

interface DeleteResult {
  deletedCount: number;
}

const token = () => getAuthToken() ?? undefined;

const unwrap = <TData>(response: ApiEnvelope<TData>) => response.data;

const listQuery = (params: ListRecordsParams) => {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    search: params.search,
    sortBy: params.sortBy,
    sortDirection: params.sortDirection,
  });

  return query.toString();
};

const list = async <TRecord>(
  resource: string,
  params: ListRecordsParams,
) => {
  const response = await apiClient<
    ApiEnvelope<PaginatedResult<TRecord>>
  >(`${BASE_PATH}/${resource}?${listQuery(params)}`, {
    method: "GET",
    token: token(),
  });

  return unwrap(response);
};

const create = async <TRecord, TValues extends object>(
  resource: string,
  values: TValues,
) => {
  const response = await apiClient<ApiEnvelope<TRecord>>(
    `${BASE_PATH}/${resource}`,
    {
      method: "POST",
      token: token(),
      body: JSON.stringify(values),
    },
  );

  return unwrap(response);
};

const update = async <TRecord, TValues extends object>(
  resource: string,
  id: number,
  values: TValues,
) => {
  const response = await apiClient<ApiEnvelope<TRecord>>(
    `${BASE_PATH}/${resource}/${id}`,
    {
      method: "PUT",
      token: token(),
      body: JSON.stringify(values),
    },
  );

  return unwrap(response);
};

const remove = async (resource: string, ids: number[]) => {
  const response = await apiClient<ApiEnvelope<DeleteResult>>(
    `${BASE_PATH}/${resource}`,
    {
      method: "DELETE",
      token: token(),
      body: JSON.stringify({ ids }),
    },
  );

  return unwrap(response).deletedCount;
};

export const outPatientService = {
  listPatients(params: ListRecordsParams) {
    return list<PatientRecord>("patients", params);
  },

  createPatient(values: PatientFormValues) {
    return create<PatientRecord, PatientFormValues>("patients", values);
  },

  updatePatient(id: number, values: PatientFormValues) {
    return update<PatientRecord, PatientFormValues>(
      "patients",
      id,
      values,
    );
  },

  deletePatients(ids: number[]) {
    return remove("patients", ids);
  },

  listConsultations(params: ListRecordsParams) {
    return list<ConsultationRecord>("consultations", params);
  },

  createConsultation(values: ConsultationFormValues) {
    return create<ConsultationRecord, ConsultationFormValues>(
      "consultations",
      values,
    );
  },

  updateConsultation(id: number, values: ConsultationFormValues) {
    return update<ConsultationRecord, ConsultationFormValues>(
      "consultations",
      id,
      values,
    );
  },

  deleteConsultations(ids: number[]) {
    return remove("consultations", ids);
  },

  listPrescriptions(params: ListRecordsParams) {
    return list<PrescriptionRecord>("prescriptions", params);
  },

  createPrescription(values: PrescriptionFormValues) {
    return create<PrescriptionRecord, PrescriptionFormValues>(
      "prescriptions",
      values,
    );
  },

  updatePrescription(id: number, values: PrescriptionFormValues) {
    return update<PrescriptionRecord, PrescriptionFormValues>(
      "prescriptions",
      id,
      values,
    );
  },

  deletePrescriptions(ids: number[]) {
    return remove("prescriptions", ids);
  },

  async listPatientOptions(): Promise<PatientOption[]> {
    const result = await list<PatientRecord>("patients", {
      page: 1,
      pageSize: 100,
      search: "",
      sortBy: "patientName",
      sortDirection: "asc",
    });

    return result.items.map((patient) => ({
      value: String(patient.id),
      label: patient.patientName,
      description: `${patient.uhid} · ${patient.mobileNumber}`,
    }));
  },
};
