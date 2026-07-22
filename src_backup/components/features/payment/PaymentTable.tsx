"use client";

import {
  ListCheckbox,
  ListRowActions,
} from "@/src/components/page/list";
import type { PaymentRecord } from "./types";

interface PaymentTableProps {
  records: PaymentRecord[];
  selectedIds?: string[];
  hideContact?: boolean;
  compact?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  onEdit?: (record: PaymentRecord) => void;
  onDelete?: (recordIds: string[]) => void;
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const PaymentTable = ({
  records,
  selectedIds = [],
  hideContact = false,
  compact = false,
  onSelectionChange,
  onEdit,
  onDelete,
}: PaymentTableProps) => {
  const selectable = Boolean(onSelectionChange);
  const showActions = Boolean(onEdit || onDelete);
  const pageIds = records.map((record) => record.id);
  const selectedOnPage = pageIds.filter((id) => selectedIds.includes(id));
  const allSelected =
    pageIds.length > 0 && selectedOnPage.length === pageIds.length;
  const someSelected = selectedOnPage.length > 0 && !allSelected;

  const toggleAll = () =>
    onSelectionChange?.(
      allSelected
        ? selectedIds.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...selectedIds, ...pageIds])),
    );

  const toggle = (id: string) =>
    onSelectionChange?.(
      selectedIds.includes(id)
        ? selectedIds.filter((item) => item !== id)
        : [...selectedIds, id],
    );

  return (
    <div className="h-full overflow-auto rounded-xl border border-slate-200 bg-white">
      <table
        className={`w-full table-fixed border-collapse text-left text-xs ${
          hideContact
            ? "min-w-[720px]"
            : showActions
              ? "min-w-[1050px]"
              : "min-w-[920px]"
        }`}
      >
        <thead className="sticky top-0 z-20 bg-slate-50 text-slate-600">
          <tr className="h-10 border-b border-slate-200">
            {selectable && (
              <th className="sticky left-0 z-30 w-12 bg-slate-50 px-3 text-center shadow-[8px_0_12px_-12px_rgba(15,23,42,0.35)]">
                <ListCheckbox
                  label="Select all visible transactions"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                />
              </th>
            )}
            {!hideContact && (
              <th className="w-48 px-3 font-semibold">Contact</th>
            )}
            <th className="w-40 px-3 font-semibold">Category</th>
            <th className="w-32 whitespace-nowrap px-3 font-semibold">
              Date
            </th>
            <th className="w-40 whitespace-nowrap px-3 font-semibold">
              Payment Mode
            </th>
            <th className="px-3 font-semibold">Description</th>
            <th className="w-28 whitespace-nowrap px-3 text-right font-semibold">
              Amount
            </th>
            {showActions && (
              <th className="sticky right-0 z-30 w-24 bg-slate-50 px-3 text-right font-semibold shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.35)]">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const selected = selectedIds.includes(record.id);

            return (
              <tr
                key={record.id}
                className={`group ${compact ? "h-11" : "h-12"} border-b border-slate-100 last:border-0 ${
                  selected ? "bg-primary/[0.04]" : "hover:bg-primary/[0.025]"
                }`}
              >
                {selectable && (
                  <td
                    className={`sticky left-0 z-10 px-3 text-center shadow-[8px_0_12px_-12px_rgba(15,23,42,0.35)] ${
                      selected
                        ? "bg-primary-surface"
                        : "bg-white group-hover:bg-[#fcfcff]"
                    }`}
                  >
                    <ListCheckbox
                      label={`Select ${record.id}`}
                      checked={selected}
                      onChange={() => toggle(record.id)}
                    />
                  </td>
                )}
                {!hideContact && (
                  <td
                    className="truncate px-3 font-medium text-slate-800"
                    title={record.contactName}
                  >
                    {record.contactName}
                  </td>
                )}
                <td
                  className="truncate px-3 text-slate-700"
                  title={record.category}
                >
                  {record.category}
                </td>
                <td className="whitespace-nowrap px-3 text-slate-600">
                  {formatDate(record.date)}
                </td>
                <td className="whitespace-nowrap px-3">
                  <span className="rounded-full bg-primary/8 px-2 py-1 font-medium text-primary">
                    {record.paymentMode}
                  </span>
                </td>
                <td
                  className="truncate px-3 text-slate-600"
                  title={record.description}
                >
                  {record.description}
                </td>
                <td className="whitespace-nowrap px-3 text-right font-semibold text-slate-900">
                  {formatAmount(record.amount)}
                </td>
                {showActions && (
                  <td
                    className={`sticky right-0 z-10 px-3 shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.35)] ${
                      selected
                        ? "bg-primary-surface"
                        : "bg-white group-hover:bg-[#fcfcff]"
                    }`}
                  >
                    <ListRowActions
                      editLabel={`Edit ${record.id}`}
                      deleteLabel={`Delete ${record.id}`}
                      onEdit={onEdit ? () => onEdit(record) : undefined}
                      onDelete={
                        onDelete ? () => onDelete([record.id]) : undefined
                      }
                    />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {!records.length && (
        <div className="flex h-48 items-center justify-center text-sm text-slate-500">
          No transaction records found.
        </div>
      )}
    </div>
  );
};

export default PaymentTable;
