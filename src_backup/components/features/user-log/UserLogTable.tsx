"use client";

import {
  ListCheckbox,
  ListRowActions,
} from "@/src/components/page/list";

import type { UserLogRecord } from "./types";

interface UserLogTableProps {
  records: UserLogRecord[];
  page: number;
  pageSize: number;
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onEdit: (record: UserLogRecord) => void;
  onDelete: (recordIds: string[]) => void;
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));

const UserLogTable = ({
  records,
  page,
  pageSize,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
}: UserLogTableProps) => {
  const pageIds = records.map((record) => record.id);
  const selectedOnPage = pageIds.filter((id) => selectedIds.includes(id));
  const allSelected =
    pageIds.length > 0 && selectedOnPage.length === pageIds.length;
  const someSelected = selectedOnPage.length > 0 && !allSelected;

  const toggleAll = () => {
    onSelectionChange(
      allSelected
        ? selectedIds.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...selectedIds, ...pageIds])),
    );
  };

  const toggleRecord = (recordId: string) => {
    onSelectionChange(
      selectedIds.includes(recordId)
        ? selectedIds.filter((id) => id !== recordId)
        : [...selectedIds, recordId],
    );
  };

  return (
    <div className="h-full overflow-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[900px] table-fixed border-collapse text-left text-xs">
        <thead className="sticky top-0 z-20 bg-slate-50 text-slate-600">
          <tr className="h-10 border-b border-slate-200">
            <th className="sticky left-0 z-30 w-12 bg-slate-50 px-3 text-center shadow-[8px_0_12px_-12px_rgba(15,23,42,0.35)]">
              <ListCheckbox
                label="Select all visible user logs"
                checked={allSelected}
                indeterminate={someSelected}
                onChange={toggleAll}
              />
            </th>
            <th className="w-20 px-3 font-semibold">S.No</th>
            <th className="w-40 px-3 font-semibold">Date</th>
            <th className="px-3 font-semibold">User</th>
            <th className="w-40 px-3 font-semibold">Log In</th>
            <th className="w-44 px-3 font-semibold">Log Out</th>
            <th className="sticky right-0 z-30 w-24 bg-slate-50 px-3 text-right font-semibold shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.35)]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="text-slate-600">
          {records.map((record, index) => {
            const selected = selectedIds.includes(record.id);

            return (
              <tr
                key={record.id}
                className={`group h-12 border-b border-slate-100 transition-colors last:border-b-0 ${
                  selected ? "bg-primary/[0.04]" : "hover:bg-primary/[0.025]"
                }`}
              >
                <td
                  className={`sticky left-0 z-10 px-3 text-center shadow-[8px_0_12px_-12px_rgba(15,23,42,0.35)] transition-colors ${
                    selected
                      ? "bg-primary-surface"
                      : "bg-white group-hover:bg-[#fcfcff]"
                  }`}
                >
                  <ListCheckbox
                    label={`Select ${record.user} log`}
                    checked={selected}
                    onChange={() => toggleRecord(record.id)}
                  />
                </td>
                <td className="px-3 font-medium text-slate-700">
                  {(page - 1) * pageSize + index + 1}
                </td>
                <td className="whitespace-nowrap px-3">
                  {formatDate(record.date)}
                </td>
                <td
                  className="truncate px-3 font-medium text-slate-800"
                  title={record.user}
                >
                  {record.user}
                </td>
                <td className="whitespace-nowrap px-3">{record.logIn}</td>
                <td className="whitespace-nowrap px-3">
                  <span
                    className={
                      record.logOut === "Active Session"
                        ? "rounded-full bg-green-100 px-3 py-1 text-[11px] font-medium text-green-700"
                        : "text-slate-600"
                    }
                  >
                    {record.logOut}
                  </span>
                </td>
                <td
                  className={`sticky right-0 z-10 px-3 shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.35)] ${
                    selected
                      ? "bg-primary-surface"
                      : "bg-white group-hover:bg-[#fcfcff]"
                  }`}
                >
                  <ListRowActions
                    editLabel={`Edit ${record.user} log`}
                    deleteLabel={`Delete ${record.user} log`}
                    onEdit={() => onEdit(record)}
                    onDelete={() => onDelete([record.id])}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {!records.length && (
        <div className="flex h-48 items-center justify-center text-sm text-slate-500">
          No user log records found.
        </div>
      )}
    </div>
  );
};

export default UserLogTable;
