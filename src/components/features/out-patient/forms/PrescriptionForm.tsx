"use client";

import {
  DatePicker,
  Form,
  Input,
  Textarea,
  Typeahead,
} from "@/src/components/ui";
import { useValidatedForm } from "@/src/core/forms";

import type {
  OutPatientEntryFormProps,
  PrescriptionFormValues,
} from "../types";
import { todayDate } from "../utils";
import { validatePrescriptionForm } from "../validation";
import FormActions from "./FormActions";

const emptyValues = (): PrescriptionFormValues => ({
  patientId: 0,
  prescriptionDate: todayDate(),
  medicine: "",
  strength: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
});

const PrescriptionForm = ({
  initialValues,
  patientOptions = [],
  loadPatientOptions,
  saving = false,
  submitLabel = "Save",
  onSubmit,
}: OutPatientEntryFormProps<PrescriptionFormValues>) => {
  const {
    values,
    errors,
    setField: set,
    resetForm: clear,
    handleSubmit: submit,
  } = useValidatedForm<PrescriptionFormValues>({
    createInitialValues: () => initialValues ?? emptyValues(),
    validate: validatePrescriptionForm,
    onValidSubmit: onSubmit,
    resetKey: initialValues,
  });

  return (
    <Form
      className="flex h-full min-h-0 flex-col"
      noValidate
      onSubmit={submit}
    >
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="grid gap-x-4 gap-y-3 md:grid-cols-2 xl:grid-cols-3">
          <Typeahead
            id="prescription-patient"
            label="Patient Name *"
            placeholder="Search patient name or UHID..."
            value={values.patientId ? String(values.patientId) : ""}
            options={patientOptions}
            error={errors.patientId}
            loadOptions={loadPatientOptions}
            pageSize={10}
            emptyMessage="No patients found"
            loadingMessage="Loading patients..."
            loadingMoreMessage="Loading more patients..."
            onChange={(value) =>
              set("patientId", value ? Number(value) : 0)
            }
          />

          <DatePicker
            id="prescription-date"
            label="Prescription Date *"
            value={values.prescriptionDate}
            error={errors.prescriptionDate}
            onChange={(value) => set("prescriptionDate", value)}
          />

          <Input
            id="prescription-medicine"
            label="Medicine *"
            value={values.medicine}
            error={errors.medicine}
            maxLength={191}
            fullWidth
            onChange={(event) => set("medicine", event.target.value)}
          />

          <Input
            id="prescription-strength"
            label="Strength"
            value={values.strength}
            placeholder="e.g. 500 mg"
            maxLength={80}
            fullWidth
            onChange={(event) => set("strength", event.target.value)}
          />

          <Input
            id="prescription-dosage"
            label="Dosage *"
            value={values.dosage}
            error={errors.dosage}
            placeholder="e.g. 1 tablet"
            maxLength={100}
            fullWidth
            onChange={(event) => set("dosage", event.target.value)}
          />

          <Input
            id="prescription-frequency"
            label="Frequency *"
            value={values.frequency}
            error={errors.frequency}
            placeholder="e.g. Twice daily"
            maxLength={100}
            fullWidth
            onChange={(event) => set("frequency", event.target.value)}
          />

          <Input
            id="prescription-duration"
            label="Duration *"
            value={values.duration}
            error={errors.duration}
            placeholder="e.g. 5 days"
            maxLength={100}
            fullWidth
            onChange={(event) => set("duration", event.target.value)}
          />

          <Textarea
            id="prescription-instructions"
            label="Instructions"
            value={values.instructions}
            rows={3}
            fullWidth
            className="min-h-24 md:col-span-2 xl:col-span-2"
            onChange={(event) => set("instructions", event.target.value)}
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

export default PrescriptionForm;
