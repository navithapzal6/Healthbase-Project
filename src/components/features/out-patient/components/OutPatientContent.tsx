import {
  consultationColumns,
  consultationConfig,
  patientColumns,
  patientConfig,
  prescriptionColumns,
  prescriptionConfig,
} from "../config";
import {
  ConsultationForm,
  PatientForm,
  PrescriptionForm,
} from "../forms";
import OutPatientModule from "./OutPatientModule";
import { outPatientService } from "../api/outPatientService";
import type {
  ConsultationRecord,
  OutPatientContentProps,
  PrescriptionRecord,
} from "../types";
import {
  consultationToFormValues,
  patientToFormValues,
  prescriptionToFormValues,
} from "../utils";

const patientOptionFromRecord = (
  record: ConsultationRecord | PrescriptionRecord,
) => ({
  value: String(record.patientId),
  label: record.patientName,
  description: record.patientUhid,
});

const OutPatientContent = ({ section }: OutPatientContentProps) => {
  if (section.id === "consultation") {
    return (
      <OutPatientModule
        key={section.id}
        config={consultationConfig}
        columns={consultationColumns}
        EntryForm={ConsultationForm}
        list={outPatientService.listConsultations}
        create={outPatientService.createConsultation}
        update={outPatientService.updateConsultation}
        remove={outPatientService.deleteConsultations}
        toFormValues={consultationToFormValues}
        loadPatientOptions={outPatientService.loadPatientOptions}
        toPatientOption={patientOptionFromRecord}
      />
    );
  }

  if (section.id === "prescription") {
    return (
      <OutPatientModule
        key={section.id}
        config={prescriptionConfig}
        columns={prescriptionColumns}
        EntryForm={PrescriptionForm}
        list={outPatientService.listPrescriptions}
        create={outPatientService.createPrescription}
        update={outPatientService.updatePrescription}
        remove={outPatientService.deletePrescriptions}
        toFormValues={prescriptionToFormValues}
        loadPatientOptions={outPatientService.loadPatientOptions}
        toPatientOption={patientOptionFromRecord}
      />
    );
  }

  return (
    <OutPatientModule
      key={section.id}
      config={patientConfig}
      columns={patientColumns}
      EntryForm={PatientForm}
      list={outPatientService.listPatients}
      create={outPatientService.createPatient}
      update={outPatientService.updatePatient}
      remove={outPatientService.deletePatients}
      toFormValues={patientToFormValues}
    />
  );
};

export default OutPatientContent;
