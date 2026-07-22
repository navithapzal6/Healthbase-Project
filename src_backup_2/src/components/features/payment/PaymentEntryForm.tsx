"use client";

import { useState } from "react";
import { Eraser, Save } from "lucide-react";
import { Button, DatePicker, Input, Textarea, Typeahead } from "@/src/components/ui";
import { paymentContacts, paymentModes } from "./data";
import type { PaymentFormValues } from "./types";

const today = () => new Date().toISOString().slice(0, 10);
const emptyValues = (contactId = ""): PaymentFormValues => ({ date: today(), contactId, category: "", paymentMode: "", description: "", amount: "" });

interface PaymentEntryFormProps {
  singular?: string;
  categories?: string[];
  descriptionPlaceholder?: string;
  selectedContactId: string;
  saving?: boolean;
  onContactChange: (contactId: string) => void;
  onSubmit: (values: PaymentFormValues, clear: () => void) => void;
}

const PaymentEntryForm = ({ singular = "Payment", categories = [], descriptionPlaceholder = "Enter details", selectedContactId, saving, onContactChange, onSubmit }: PaymentEntryFormProps) => {
  const [values, setValues] = useState<PaymentFormValues>(emptyValues(selectedContactId));
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentFormValues, string>>>({});
  const set = <K extends keyof PaymentFormValues>(key: K, value: PaymentFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };
  const clear = () => { setValues(emptyValues(values.contactId)); setErrors({}); };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Partial<Record<keyof PaymentFormValues, string>> = {};
    if (!values.date) next.date = `${singular} date is required`;
    if (!values.contactId) next.contactId = "Select a contact";
    if (!values.category) next.category = "Select a category";
    if (!values.paymentMode) next.paymentMode = "Select a payment mode";
    if (!values.description.trim()) next.description = "Description is required";
    if (!values.amount || Number(values.amount) <= 0) next.amount = "Enter a valid amount";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSubmit(values, clear);
  };

  return (
    <form onSubmit={submit} className="flex min-h-full flex-col">
      <div className="space-y-4">
        <DatePicker id={`${singular.toLowerCase()}-date`} label={`${singular} Date *`} value={values.date} error={errors.date} onChange={(value) => set("date", value)} />
        <Typeahead id={`${singular.toLowerCase()}-contact`} label="Contact Name *" value={values.contactId} error={errors.contactId} options={paymentContacts.map((contact) => ({ value: contact.id, label: contact.name, description: contact.reference }))} onChange={(value) => { set("contactId", value); onContactChange(value); }} />
        <label className="block"><span className="mb-1.5 block text-sm font-medium text-slate-700">Category / Purpose *</span><select value={values.category} onChange={(event) => set("category", event.target.value)} className={`h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 ${errors.category ? "border-red-400" : "border-slate-200"}`}><option value="">Select purpose</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>{errors.category && <span className="mt-1 block text-xs text-red-600">{errors.category}</span>}</label>
        <label className="block"><span className="mb-1.5 block text-sm font-medium text-slate-700">Payment Mode *</span><select value={values.paymentMode} onChange={(event) => set("paymentMode", event.target.value as PaymentFormValues["paymentMode"])} className={`h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 ${errors.paymentMode ? "border-red-400" : "border-slate-200"}`}><option value="">Select payment mode</option>{paymentModes.map((item) => <option key={item}>{item}</option>)}</select>{errors.paymentMode && <span className="mt-1 block text-xs text-red-600">{errors.paymentMode}</span>}</label>
        <Textarea label="Description *" value={values.description} error={errors.description} onChange={(event) => set("description", event.target.value)} placeholder={descriptionPlaceholder} className="min-h-24" fullWidth />
        <Input label="Amount *" type="number" min="1" step="0.01" value={values.amount} error={errors.amount} onChange={(event) => set("amount", event.target.value)} placeholder="₹ 0.00" fullWidth />
      </div>
      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
        <Button type="button" variant="outline" leftIcon={<Eraser className="h-4 w-4" />} onClick={clear}>Clear</Button>
        <Button type="submit" variant="primary" loading={saving} leftIcon={<Save className="h-4 w-4" />}>Save {singular}</Button>
      </div>
    </form>
  );
};

export default PaymentEntryForm;
