"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, CircleDollarSign } from "lucide-react";

import {
  ConfirmationDialog,
  FormField,
  FormGrid,
  FormPage,
  FormSection,
  Input,
  Textarea,
  toast,
} from "@/src/components";

const selectClassName = `
  h-11 w-full rounded-xl border border-border bg-white px-4 text-sm
  transition-all duration-200 focus:border-primary
  focus:ring-4 focus:ring-primary/10
`;

export default function Page() {
  const router = useRouter();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveDialogOpen(true);
  };

  const confirmSave = () => {
    setSaveDialogOpen(false);
    toast.success({
      title: "Ledger Saved",
      description: "The new ledger was created successfully.",
    });
    router.push("/ledger");
  };

  return (
    <>
      <FormPage
        title="Register New Ledger"
        description="Create a ledger with account classification and opening balance details."
        submitLabel="Save Ledger"
        onCancel={() => router.push("/ledger")}
        onSubmit={handleSubmit}
      >
        <FormSection
          title="Ledger Information"
          description="Enter the primary ledger and account group details."
          icon={<BookOpen size={18} />}
        >
          <FormGrid columns={2}>
            <Input
              name="ledgerName"
              label="Ledger Name *"
              placeholder="Enter ledger name"
              required
            />

            <FormField label="Account Group" required>
              <select
                name="accountGroup"
                className={selectClassName}
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select account group
                </option>
                <option value="asset">Current Assets</option>
                <option value="liability">Current Liabilities</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>
            </FormField>

            <FormField label="Ledger Type" required>
              <select
                name="ledgerType"
                className={selectClassName}
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select ledger type
                </option>
                <option value="asset">Asset</option>
                <option value="liability">Liability</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </FormField>

            <FormField label="Status" required>
              <select
                name="status"
                className={selectClassName}
                defaultValue="active"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </FormField>
          </FormGrid>
        </FormSection>

        <FormSection
          title="Opening Balance"
          description="Set the starting debit or credit balance for this ledger."
          icon={<CircleDollarSign size={18} />}
          variant="soft"
        >
          <FormGrid columns={2}>
            <Input
              name="openingBalance"
              type="number"
              min="0"
              step="0.01"
              label="Opening Balance"
              placeholder="0.00"
            />

            <FormField label="Balance Type">
              <select
                name="balanceType"
                className={selectClassName}
                defaultValue="debit"
              >
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
              </select>
            </FormField>

            <div className="md:col-span-2">
              <Textarea
                name="notes"
                label="Notes"
                placeholder="Add optional ledger notes..."
                size="sm"
              />
            </div>
          </FormGrid>
        </FormSection>
      </FormPage>

      <ConfirmationDialog
        open={saveDialogOpen}
        variant="primary"
        title="Save this ledger?"
        description="Please confirm the ledger details and opening balance before saving."
        confirmText="Save Ledger"
        onConfirm={confirmSave}
        onCancel={() => setSaveDialogOpen(false)}
      />
    </>
  );
}
