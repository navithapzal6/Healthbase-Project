"use client";

import { useState } from "react";
import { Eraser, Save } from "lucide-react";

import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Textarea,
  Typeahead,
} from "@/src/components/ui";
import { clearFieldError } from "@/src/core/forms";
import type { ValidationErrors } from "@/src/core/validation";

import type {
  TransactionFormRendererProps,
  TransactionFormValues,
} from "./types";
import { validateTransactionForm } from "./validation";

const today = () => new Date().toISOString().slice(0, 10);

const emptyValues = (contactId = ""): TransactionFormValues => ({
  date: today(),
  contactId,
  category: "",
  paymentMode: "",
  description: "",
  amount: "",
});

const TransactionEntryForm = ({
  singular = "Payment",
  categories = [],
  contacts,
  paymentModes,
  descriptionPlaceholder = "Enter details",
  selectedContactId,
  saving,
  onContactChange,
  onSubmit,
}: TransactionFormRendererProps) => {
  const [values, setValues] = useState<TransactionFormValues>(
    emptyValues(selectedContactId),
  );
  const [errors, setErrors] = useState<
    ValidationErrors<TransactionFormValues>
  >({});

  const set = <TField extends keyof TransactionFormValues>(
    field: TField,
    value: TransactionFormValues[TField],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => clearFieldError(current, field));
  };

  const clear = () => {
    setValues(emptyValues(values.contactId));
    setErrors({});
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = validateTransactionForm(values, singular);
    setErrors(result.errors);

    if (!result.isValid) return;
    onSubmit(result.values, clear);
  };

  return (
    <Form onSubmit={submit} className="flex min-h-full flex-col" noValidate>
      <div className="space-y-4">
        <DatePicker
          id={`${singular.toLowerCase()}-date`}
          label={`${singular} Date *`}
          value={values.date}
          error={errors.date}
          onChange={(value) => set("date", value)}
        />

        <Typeahead
          id={`${singular.toLowerCase()}-contact`}
          label="Contact Name *"
          value={values.contactId}
          error={errors.contactId}
          options={contacts.map((contact) => ({
            value: contact.id,
            label: contact.name,
            description: contact.reference,
          }))}
          onChange={(value) => {
            set("contactId", value);
            onContactChange(value);
          }}
        />

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Category / Purpose *
          </span>
          <Select unstyled
            value={values.category}
            onChange={(event) => set("category", event.target.value)}
            className={`h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 ${
              errors.category ? "border-red-400" : "border-slate-200"
            }`}
          >
            <option value="">Select purpose</option>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          {errors.category && (
            <span className="mt-1 block text-xs text-red-600">
              {errors.category}
            </span>
          )}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">
            Payment Mode *
          </span>
          <Select unstyled
            value={values.paymentMode}
            onChange={(event) =>
              set(
                "paymentMode",
                event.target.value as TransactionFormValues["paymentMode"],
              )
            }
            className={`h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 ${
              errors.paymentMode ? "border-red-400" : "border-slate-200"
            }`}
          >
            <option value="">Select payment mode</option>
            {paymentModes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          {errors.paymentMode && (
            <span className="mt-1 block text-xs text-red-600">
              {errors.paymentMode}
            </span>
          )}
        </label>

        <Textarea
          label="Description *"
          value={values.description}
          error={errors.description}
          onChange={(event) => set("description", event.target.value)}
          placeholder={descriptionPlaceholder}
          className="min-h-24"
          fullWidth
        />

        <Input
          label="Amount *"
          type="number"
          min="1"
          step="0.01"
          value={values.amount}
          error={errors.amount}
          onChange={(event) => set("amount", event.target.value)}
          placeholder="₹ 0.00"
          fullWidth
        />
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
        <Button
          type="button"
          variant="outline"
          leftIcon={<Eraser className="h-4 w-4" />}
          onClick={clear}
        >
          Clear
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={saving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save {singular}
        </Button>
      </div>
    </Form>
  );
};

export default TransactionEntryForm;
