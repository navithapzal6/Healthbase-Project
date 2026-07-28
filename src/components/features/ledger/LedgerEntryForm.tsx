"use client";

import { useEffect, useState } from "react";
import { Eraser, Save } from "lucide-react";

import {
  Button,
  ConfirmationDialog,
  Form,
  Input,
  Textarea,
} from "@/src/components/ui";
import { useValidatedForm } from "@/src/core/forms";

import type {
  LedgerEntryFormProps,
  LedgerFormValues,
} from "./types";
import { validateLedgerForm } from "./validation";

const emptyValues: LedgerFormValues = {
  ledgerName: "",
  description: "",
};

const LedgerEntryForm = ({ section, onSave }: LedgerEntryFormProps) => {
  const [pendingValues, setPendingValues] =
    useState<LedgerFormValues | null>(null);
  const [saving, setSaving] = useState(false);
  const {
    values,
    errors,
    setField: updateField,
    resetForm: clearForm,
    handleSubmit,
  } = useValidatedForm<LedgerFormValues>({
    createInitialValues: () => ({ ...emptyValues }),
    validate: validateLedgerForm,
    onValidSubmit: setPendingValues,
    resetKey: section.id,
  });

  useEffect(() => {
    setPendingValues(null);
  }, [section.id]);

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

      <Form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
          <Input
            id="ledger-name"
            label="Ledger Name *"
            placeholder={`Enter ${section.label.toLowerCase()} name`}
            value={values.ledgerName}
            onChange={(event) => updateField("ledgerName", event.target.value)}
            error={errors.ledgerName}
            fullWidth
          />

          <Textarea
            id="ledger-description"
            label="Description *"
            placeholder="Enter a clear ledger description"
            value={values.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
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
            onClick={() => clearForm()}
          >
            Clear
          </Button>
          <Button type="submit" size="sm" leftIcon={<Save size={16} />}>
            Save
          </Button>
        </div>
      </Form>

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
