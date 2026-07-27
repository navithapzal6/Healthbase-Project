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
import type { OutPatientContentProps } from "../types";
import {
  consultationToFormValues,
  patientToFormValues,
  prescriptionToFormValues,
} from "../utils";

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
