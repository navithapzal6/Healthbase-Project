"use client";

import { useEffect, useState } from "react";

import {
  DatePicker,
  Form,
  Input,
  Textarea,
  Typeahead,
} from "@/src/components/ui";
import { clearFieldError } from "@/src/core/forms";
import type { ValidationErrors } from "@/src/core/validation";

import type {
  ConsultationFormValues,
  OutPatientEntryFormProps,
} from "../types";
import { todayDate } from "../utils";
import { validateConsultationForm } from "../validation";
import FormActions from "./FormActions";

const emptyValues = (): ConsultationFormValues => ({
  patientId: 0,
  consultationDate: todayDate(),
  illness: "",
  medicalHistory: "",
  allergy: "",
  examinationFindings: "",
  diagnosis: "",
  advice: "",
});

const ConsultationForm = ({
  initialValues,
  patientOptions = [],
  saving = false,
  submitLabel = "Save",
  onSubmit,
}: OutPatientEntryFormProps<ConsultationFormValues>) => {
  const [values, setValues] = useState<ConsultationFormValues>(
    () => initialValues ?? emptyValues(),
  );
  const [errors, setErrors] = useState<
    ValidationErrors<ConsultationFormValues>
  >({});

  useEffect(() => {
    setValues(initialValues ?? emptyValues());
    setErrors({});
  }, [initialValues]);

  const set = <TField extends keyof ConsultationFormValues>(
    field: TField,
    value: ConsultationFormValues[TField],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => clearFieldError(current, field));
  };

  const clear = () => {
    setValues(emptyValues());
    setErrors({});
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateConsultationForm(values);
    setErrors(result.errors);

    if (result.isValid) onSubmit(result.values);
  };

  return (
    <Form
      className="flex h-full min-h-0 flex-col"
      noValidate
      onSubmit={submit}
    >
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
          <Typeahead
            id="consultation-patient"
            label="Patient Name *"
            placeholder="Search patient name or UHID..."
            value={values.patientId ? String(values.patientId) : ""}
            options={patientOptions}
            error={errors.patientId}
            emptyMessage="No patients found"
            onChange={(value) =>
              set("patientId", value ? Number(value) : 0)
            }
          />

          <DatePicker
            id="consultation-date"
            label="Consultation Date *"
            value={values.consultationDate}
            error={errors.consultationDate}
            onChange={(value) => set("consultationDate", value)}
          />

          <Input
            id="consultation-illness"
            label="Illness *"
            value={values.illness}
            error={errors.illness}
            maxLength={250}
            fullWidth
            onChange={(event) => set("illness", event.target.value)}
          />

          <Input
            id="consultation-allergy"
            label="Allergy"
            value={values.allergy}
            maxLength={500}
            fullWidth
            onChange={(event) => set("allergy", event.target.value)}
          />

          <Textarea
            id="consultation-medical-history"
            label="Medical History"
            value={values.medicalHistory}
            rows={3}
            fullWidth
            className="min-h-24"
            onChange={(event) => set("medicalHistory", event.target.value)}
          />

          <Textarea
            id="consultation-examination"
            label="Examination Findings *"
            value={values.examinationFindings}
            error={errors.examinationFindings}
            rows={3}
            fullWidth
            className="min-h-24"
            onChange={(event) =>
              set("examinationFindings", event.target.value)
            }
          />

          <Textarea
            id="consultation-diagnosis"
            label="Diagnosis *"
            value={values.diagnosis}
            error={errors.diagnosis}
            rows={3}
            fullWidth
            className="min-h-24"
            onChange={(event) => set("diagnosis", event.target.value)}
          />

          <Textarea
            id="consultation-advice"
            label="Advice"
            value={values.advice}
            rows={3}
            fullWidth
            className="min-h-24"
            onChange={(event) => set("advice", event.target.value)}
          />
        </div>
      </div>

      <FormActions
        saving={saving}
        submitLabel={submitLabel}
        onClear={clear}
      />
    </Form>
  );
};

export default ConsultationForm;
