"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { Eraser, Save } from "lucide-react";

import {
  Button,
  ConfirmationDialog,
  Input,
  Textarea,
} from "@/src/components/ui";

import type {
  LedgerEntryFormProps,
  LedgerFormValues,
} from "./types";

const emptyValues: LedgerFormValues = {
  ledgerName: "",
  description: "",
};

const LedgerEntryForm = ({ section, onSave }: LedgerEntryFormProps) => {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState<Partial<LedgerFormValues>>({});
  const [pendingValues, setPendingValues] =
    useState<LedgerFormValues | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues(emptyValues);
    setErrors({});
    setPendingValues(null);
  }, [section.id]);

  const clearForm = () => {
    setValues(emptyValues);
    setErrors({});
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<LedgerFormValues> = {};
    const ledgerName = values.ledgerName.trim();
    const description = values.description.trim();

    if (!ledgerName) {
      nextErrors.ledgerName = "Ledger name is required.";
    } else if (ledgerName.length < 3) {
      nextErrors.ledgerName = "Enter at least 3 characters.";
    }

    if (!description) {
      nextErrors.description = "Description is required.";
    } else if (description.length < 5) {
      nextErrors.description = "Enter at least 5 characters.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setPendingValues({ ledgerName, description });
  };

  const confirmSave = async () => {
    if (!pendingValues) return;

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    onSave(pendingValues);
    setPendingValues(null);
    clearForm();
    setSaving(false);
  };

  return (
    <section className="flex h-full min-h-0 flex-col bg-slate-50/50">
      <div className="border-b border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          New Entry
        </p>
        <h2 className="mt-1 text-lg font-bold text-slate-900">
          Add {section.label}
        </h2>
      </div>

      <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          <Input
            id="ledger-name"
            label="Ledger Name *"
            placeholder={`Enter ${section.label.toLowerCase()} name`}
            value={values.ledgerName}
            onChange={(event) => {
              setValues((current) => ({
                ...current,
                ledgerName: event.target.value,
              }));
              if (errors.ledgerName) {
                setErrors((current) => ({ ...current, ledgerName: undefined }));
              }
            }}
            error={errors.ledgerName}
            fullWidth
          />

          <Textarea
            id="ledger-description"
            label="Description *"
            placeholder="Enter a clear ledger description"
            value={values.description}
            onChange={(event) => {
              setValues((current) => ({
                ...current,
                description: event.target.value,
              }));
              if (errors.description) {
                setErrors((current) => ({
                  ...current,
                  description: undefined,
                }));
              }
            }}
            error={errors.description}
            maxLength={200}
            size="sm"
            fullWidth
          />

        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white p-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Eraser size={16} />}
            onClick={clearForm}
          >
            Clear
          </Button>
          <Button type="submit" size="sm" leftIcon={<Save size={16} />}>
            Save
          </Button>
        </div>
      </form>

      <ConfirmationDialog
        open={pendingValues !== null}
        title={`Save ${section.label}?`}
        description={
          pendingValues
            ? `${pendingValues.ledgerName} will be added to ${section.label}.`
            : undefined
        }
        confirmText="Save"
        variant="primary"
        loading={saving}
        onConfirm={confirmSave}
        onCancel={() => !saving && setPendingValues(null)}
      />
    </section>
  );
};

export default LedgerEntryForm;
