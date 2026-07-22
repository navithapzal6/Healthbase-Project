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
    <TableContainer density="dense" className="h-full rounded-xl">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-200">
            <TableHead sticky="left" className="w-12 text-center">
              <ListCheckbox
                label="Select all visible user logs"
                checked={allSelected}
                indeterminate={someSelected}
                onChange={toggleAll}
              />
            </TableHead>
            <TableHead className="w-[8%]">S.No</TableHead>
            <TableHead className="w-[17%]">Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="w-[17%]">Log In</TableHead>
            <TableHead className="w-[19%]">Log Out</TableHead>
            <TableHead sticky="right" className="w-24 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {records.map((record, index) => {
            const selected = selectedIds.includes(record.id);

            return (
              <TableRow
                key={record.id}
                selected={selected}
                hoverable
              >
                <TableCell
                  sticky="left"
                  selected={selected}
                  className="text-center"
                >
                  <ListCheckbox
                    label={`Select ${record.user} log`}
                    checked={selected}
                    onChange={() => toggleRecord(record.id)}
                  />
                </TableCell>
                <TableCell className="font-medium text-slate-700">
                  {(page - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell>
                  {formatDate(record.date)}
                </TableCell>
                <TableCell
                  className="font-medium text-slate-800"
                  title={record.user}
                >
                  {record.user}
                </TableCell>
                <TableCell>{record.logIn}</TableCell>
                <TableCell>
                  <span
                    className={
                      record.logOut === "Active Session"
                        ? "rounded-full bg-green-100 px-3 py-1 text-[11px] font-medium text-green-700"
                        : "text-slate-600"
                    }
                  >
                    {record.logOut}
                  </span>
                </TableCell>
                <TableCell
                  sticky="right"
                  selected={selected}
                >
                  <ListRowActions
                    editLabel={`Edit ${record.user} log`}
                    deleteLabel={`Delete ${record.user} log`}
                    onEdit={() => onEdit(record)}
                    onDelete={() => onDelete([record.id])}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {!records.length && (
        <TableEmptyState title="No user log records found." />
      )}
    </TableContainer>
  );
};

export default UserLogTable;
