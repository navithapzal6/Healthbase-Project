"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  BriefcaseBusiness,
  MapPin,
  NotebookPen,
  UserRound,
} from "lucide-react";

import {
  Checkbox,
  ConfirmationDialog,
  FormField,
  FormGrid,
  FormPage,
  FormSection,
  Input,
  startNavigationLoading,
  Textarea,
  toast,
} from "@/src/components";

const selectClassName = `
  flex h-11 w-full rounded-xl border border-border bg-white px-4
  text-sm text-foreground outline-none transition-all duration-200
  focus:border-primary focus:ring-4 focus:ring-primary/10
  disabled:cursor-not-allowed disabled:opacity-50
`;

export default function Page() {
  const router = useRouter();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const goToList = () => {
    startNavigationLoading("Loading contacts...");
    router.push("/list");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaveDialogOpen(true);
  };

  const confirmSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    toast.success({
      title: "Contact Added",
      description: "The new contact was saved successfully.",
    });

    setSaveDialogOpen(false);
    goToList();
  };

  return (
    <>
      <FormPage
        title="Register New Contact"
        description="Create a contact profile with personal, work and address information."
        submitLabel="Save Contact"
        cancelLabel="Cancel"
        onCancel={goToList}
        onSubmit={handleSubmit}
        isSubmitting={saving}
      >
        <FormSection
          title="Personal Information"
          description="Enter the contact's primary identity and communication details."
          icon={<UserRound size={18} />}
        >
          <FormGrid columns={2}>
            <Input
              id="contact-name"
              name="name"
              label="Full Name *"
              placeholder="Enter full name"
              autoComplete="name"
              required
            />

            <Input
              id="contact-email"
              name="email"
              type="email"
              label="Email Address *"
              placeholder="name@company.com"
              autoComplete="email"
              required
            />

            <Input
              id="contact-phone"
              name="phone"
              type="tel"
              label="Phone Number *"
              placeholder="Enter phone number"
              autoComplete="tel"
              required
            />

            <Input
              id="contact-alt-phone"
              name="alternatePhone"
              type="tel"
              label="Alternate Phone"
              placeholder="Enter alternate number"
            />
          </FormGrid>
        </FormSection>

        <FormSection
          title="Work Details"
          description="Add business classification and organization details."
          icon={<BriefcaseBusiness size={18} />}
        >
          <FormGrid columns={3}>
            <FormField label="Contact Type" htmlFor="contact-type" required>
              <select
                id="contact-type"
                name="contactType"
                className={selectClassName}
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select contact type
                </option>
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="employee">Employee</option>
                <option value="partner">Partner</option>
              </select>
            </FormField>

            <Input
              id="contact-company"
              name="company"
              label="Company Name"
              placeholder="Enter company name"
              autoComplete="organization"
            />

            <Input
              id="contact-designation"
              name="designation"
              label="Designation"
              placeholder="Enter designation"
              autoComplete="organization-title"
            />

            <FormField label="Department" htmlFor="contact-department">
              <select
                id="contact-department"
                name="department"
                className={selectClassName}
                defaultValue=""
              >
                <option value="">Select department</option>
                <option value="accounts">Accounts</option>
                <option value="sales">Sales</option>
                <option value="operations">Operations</option>
                <option value="hr">Human Resources</option>
              </select>
            </FormField>

            <Input
              id="contact-tax-id"
              name="taxId"
              label="GST / Tax ID"
              placeholder="Enter GST or tax ID"
            />

            <FormField label="Status" htmlFor="contact-status" required>
              <select
                id="contact-status"
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
          title="Address"
          description="Add the contact's billing or primary communication address."
          icon={<MapPin size={18} />}
        >
          <FormGrid columns={2}>
            <div className="md:col-span-2">
              <Textarea
                id="contact-address"
                name="address"
                label="Street Address"
                placeholder="Enter door number, street and area"
                size="sm"
                autoComplete="street-address"
              />
            </div>

            <Input
              id="contact-city"
              name="city"
              label="City"
              placeholder="Enter city"
              autoComplete="address-level2"
            />

            <Input
              id="contact-state"
              name="state"
              label="State"
              placeholder="Enter state"
              autoComplete="address-level1"
            />

            <Input
              id="contact-country"
              name="country"
              label="Country"
              placeholder="Enter country"
              defaultValue="India"
              autoComplete="country-name"
            />

            <Input
              id="contact-pincode"
              name="pincode"
              label="PIN Code"
              placeholder="Enter PIN code"
              inputMode="numeric"
              autoComplete="postal-code"
            />
          </FormGrid>
        </FormSection>

        <FormSection
          title="Additional Information"
          description="Keep optional internal notes and communication preferences."
          icon={<NotebookPen size={18} />}
          variant="soft"
        >
          <div className="space-y-5">
            <Textarea
              id="contact-notes"
              name="notes"
              label="Notes"
              placeholder="Add notes about this contact..."
              helperText="This note is visible only to your team."
              size="sm"
            />

            <Checkbox
              id="contact-updates"
              name="receiveUpdates"
              label="Send account updates and notifications to this contact"
              size="sm"
            />
          </div>
        </FormSection>
      </FormPage>

      <ConfirmationDialog
        open={saveDialogOpen}
        variant="primary"
        title="Save this contact?"
        description="Please confirm that the entered contact information is correct before saving."
        confirmText="Save Contact"
        loading={saving}
        onConfirm={confirmSave}
        onCancel={() => !saving && setSaveDialogOpen(false)}
      />
    </>
  );
}
