"use client";

import { useEffect, useMemo, useState } from "react";

import {
  DatePicker,
  Form,
  Input,
  Select,
  Textarea,
} from "@/src/components/ui";
import { clearFieldError } from "@/src/core/forms";
import type { ValidationErrors } from "@/src/core/validation";

import {
  bloodGroupOptions,
  genderOptions,
  maritalStatusOptions,
} from "../data";
import type {
  OutPatientEntryFormProps,
  PatientFormValues,
} from "../types";
import { calculateAge, todayDate } from "../utils";
import { validatePatientForm } from "../validation";
import FormActions from "./FormActions";

const emptyValues = (): PatientFormValues => ({
  patientName: "",
  mobileNumber: "",
  dateOfBirth: "",
  gender: "",
  email: "",
  address: "",
  bloodGroup: "",
  aadhaarNumber: "",
  maritalStatus: "",
});

const PatientForm = ({
  initialValues,
  saving = false,
  submitLabel = "Save",
  onSubmit,
}: OutPatientEntryFormProps<PatientFormValues>) => {
  const [values, setValues] = useState<PatientFormValues>(
    () => initialValues ?? emptyValues(),
  );
  const [errors, setErrors] = useState<ValidationErrors<PatientFormValues>>(
    {},
  );

  useEffect(() => {
    setValues(initialValues ?? emptyValues());
    setErrors({});
  }, [initialValues]);

  const age = useMemo(
    () => calculateAge(values.dateOfBirth),
    [values.dateOfBirth],
  );

  const set = <TField extends keyof PatientFormValues>(
    field: TField,
    value: PatientFormValues[TField],
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
    const result = validatePatientForm(values);
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
        <div className="grid gap-x-4 gap-y-3 md:grid-cols-2 xl:grid-cols-3">
          <Input
            id="patient-name"
            label="Patient Name *"
            value={values.patientName}
            error={errors.patientName}
            maxLength={120}
            fullWidth
            onChange={(event) => set("patientName", event.target.value)}
          />

          <Input
            id="patient-mobile"
            label="Mobile Number *"
            value={values.mobileNumber}
            error={errors.mobileNumber}
            inputMode="numeric"
            maxLength={10}
            fullWidth
            onChange={(event) =>
              set("mobileNumber", event.target.value.replace(/\D/g, ""))
            }
          />

          <DatePicker
            id="patient-date-of-birth"
            label="Date of Birth *"
            value={values.dateOfBirth}
            error={errors.dateOfBirth}
            max={todayDate()}
            onChange={(value) => set("dateOfBirth", value)}
          />

          <Input
            id="patient-age"
            label="Age"
            value={age}
            helperText="Calculated automatically from date of birth."
            readOnly
            fullWidth
            className="cursor-not-allowed bg-slate-50"
          />

          <Select
            id="patient-gender"
            label="Gender *"
            value={values.gender}
            error={errors.gender}
            onChange={(event) => set("gender", event.target.value)}
          >
            <option value="">Select gender</option>
            {genderOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>

          <Input
            id="patient-email"
            label="Email"
            type="email"
            value={values.email}
            error={errors.email}
            maxLength={191}
            fullWidth
            onChange={(event) => set("email", event.target.value)}
          />

          <Select
            id="patient-blood-group"
            label="Blood Group"
            value={values.bloodGroup}
            onChange={(event) => set("bloodGroup", event.target.value)}
          >
            <option value="">Select blood group</option>
            {bloodGroupOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>

          <Input
            id="patient-aadhaar"
            label="Aadhaar Number"
            value={values.aadhaarNumber}
            error={errors.aadhaarNumber}
            inputMode="numeric"
            maxLength={12}
            fullWidth
            onChange={(event) =>
              set("aadhaarNumber", event.target.value.replace(/\D/g, ""))
            }
          />

          <Select
            id="patient-marital-status"
            label="Marital Status"
            value={values.maritalStatus}
            onChange={(event) => set("maritalStatus", event.target.value)}
          >
            <option value="">Select marital status</option>
            {maritalStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>

          <Textarea
            id="patient-address"
            label="Address *"
            value={values.address}
            error={errors.address}
            maxLength={500}
            rows={3}
            fullWidth
            className="min-h-24"
            onChange={(event) => set("address", event.target.value)}
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

export default PatientForm;
