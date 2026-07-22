"use client";

import {
  ListCheckbox,
  ListRowActions,
} from "@/src/components/page/list";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableEmptyState,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui";
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
    <TableContainer density="dense" className="h-full rounded-xl">
      <Table>
        <TableHeader>
          <TableRow className="h-10 border-slate-200">
            {selectable && (
              <TableHead sticky="left" className="w-12 text-center">
                <ListCheckbox
                  label="Select all visible transactions"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                />
              </TableHead>
            )}
            {!hideContact && (
              <TableHead className="w-[18%]">Contact</TableHead>
            )}
            <TableHead className="w-[15%]">Category</TableHead>
            <TableHead className="w-[13%]">Date</TableHead>
            <TableHead className="w-[15%]">Payment Mode</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[13%] text-right">
              Amount
            </TableHead>
            {showActions && (
              <TableHead sticky="right" className="w-24 text-right">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => {
            const selected = selectedIds.includes(record.id);

            return (
              <TableRow
                key={record.id}
                selected={selected}
                hoverable
                className={compact ? "h-11" : "h-12"}
              >
                {selectable && (
                  <TableCell
                    sticky="left"
                    selected={selected}
                    className="text-center"
                  >
                    <ListCheckbox
                      label={`Select ${record.id}`}
                      checked={selected}
                      onChange={() => toggle(record.id)}
                    />
                  </TableCell>
                )}
                {!hideContact && (
                  <TableCell
                    className="font-medium text-slate-800"
                    title={record.contactName}
                  >
                    {record.contactName}
                  </TableCell>
                )}
                <TableCell className="text-slate-700" title={record.category}>
                  {record.category}
                </TableCell>
                <TableCell className="text-slate-600">
                  {formatDate(record.date)}
                </TableCell>
                <TableCell>
                  <span className="rounded-full bg-primary/8 px-2 py-1 font-medium text-primary">
                    {record.paymentMode}
                  </span>
                </TableCell>
                <TableCell
                  className="text-slate-600"
                  title={record.description}
                >
                  {record.description}
                </TableCell>
                <TableCell className="text-right font-semibold text-slate-900">
                  {formatAmount(record.amount)}
                </TableCell>
                {showActions && (
                  <TableCell sticky="right" selected={selected}>
                    <ListRowActions
                      editLabel={`Edit ${record.id}`}
                      deleteLabel={`Delete ${record.id}`}
                      onEdit={onEdit ? () => onEdit(record) : undefined}
                      onDelete={
                        onDelete ? () => onDelete([record.id]) : undefined
                      }
                    />
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {!records.length && (
        <TableEmptyState title="No transaction records found." />
      )}
    </TableContainer>
  );
};

export default PaymentTable;
