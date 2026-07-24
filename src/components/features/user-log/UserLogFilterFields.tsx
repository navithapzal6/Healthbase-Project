"use client";

import { Select } from "@/src/components/ui";
import { contacts } from "@/src/dummy-data/contacts";

import type { UserLogFilters } from "./types";

interface UserLogFilterFieldsProps {
  values: UserLogFilters;
  onChange: (values: UserLogFilters) => void;
}

const selectClassName = `
  h-11 w-full rounded-xl border border-border bg-white px-4
  text-sm text-foreground transition-all duration-200
  focus:border-primary focus:ring-4 focus:ring-primary/10
`;

const UserLogFilterFields = ({
  values,
  onChange,
}: UserLogFilterFieldsProps) => {
  return (
    <div>
      <label
        htmlFor="user-log-user-filter"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        User
      </label>
      <Select unstyled
        id="user-log-user-filter"
        className={selectClassName}
        value={values.userId}
        onChange={(event) =>
          onChange({ ...values, userId: event.target.value })
        }
      >
        <option value="">All users</option>
        {contacts.map((contact) => (
          <option key={contact.id} value={String(contact.id)}>
            {contact.name}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default UserLogFilterFields;
