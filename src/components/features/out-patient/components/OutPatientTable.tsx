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
  TableSkeletonRows,
} from "@/src/components/ui";
import { cn } from "@/src/lib/utils";

import type { OutPatientColumn } from "../types";

interface OutPatientTableProps<TRecord extends { id: number }> {
  records: TRecord[];
  columns: OutPatientColumn<TRecord>[];
  selectedIds: number[];
  loading?: boolean;
  tableMinWidth: number;
  emptyTitle: string;
  emptyDescription?: string;
  getRecordLabel: (record: TRecord) => string;
  onSelectionChange: (ids: number[]) => void;
  onEdit: (record: TRecord) => void;
  onDelete: (ids: number[]) => void;
}

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const OutPatientTable = <TRecord extends { id: number }>({
  records,
  columns,
  selectedIds,
  loading = false,
  tableMinWidth,
  emptyTitle,
  emptyDescription,
  getRecordLabel,
  onSelectionChange,
  onEdit,
  onDelete,
}: OutPatientTableProps<TRecord>) => {
  const pageIds = records.map((record) => record.id);
  const selectedOnPage = pageIds.filter((id) => selectedIds.includes(id));
  const allSelected =
    pageIds.length > 0 && selectedOnPage.length === pageIds.length;
  const someSelected = selectedOnPage.length > 0 && !allSelected;

  const toggleAll = () =>
    onSelectionChange(
      allSelected
        ? selectedIds.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...selectedIds, ...pageIds])),
    );

  const toggle = (id: number) =>
    onSelectionChange(
      selectedIds.includes(id)
        ? selectedIds.filter((item) => item !== id)
        : [...selectedIds, id],
    );

  return (
    <TableContainer
      density="dense"
      allowHorizontalScroll
      className="h-full min-h-[300px] rounded-xl"
    >
      <Table style={{ minWidth: tableMinWidth }}>
        <TableHeader>
          <TableRow className="border-slate-200">
            <TableHead sticky="left" className="w-11 text-center">
              <ListCheckbox
                label="Select all visible records"
                checked={allSelected}
                indeterminate={someSelected}
                disabled={loading || records.length === 0}
                onChange={toggleAll}
              />
            </TableHead>

            {columns.map((column) => (
              <TableHead
                key={column.id}
                style={{ width: column.width }}
                className={alignClass[column.align ?? "left"]}
              >
                {column.label}
              </TableHead>
            ))}

            <TableHead sticky="right" className="w-20 text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableSkeletonRows
              rows={10}
              columns={columns.length}
              hasSelection
              hasActions
            />
          ) : (
            records.map((record) => {
              const selected = selectedIds.includes(record.id);
              const recordLabel = getRecordLabel(record);

              return (
                <TableRow key={record.id} selected={selected} hoverable>
                  <TableCell
                    sticky="left"
                    selected={selected}
                    className="text-center"
                  >
                    <ListCheckbox
                      label={`Select ${recordLabel}`}
                      checked={selected}
                      onChange={() => toggle(record.id)}
                    />
                  </TableCell>

                  {columns.map((column) => {
                    const content = column.render(record);

                    return (
                      <TableCell
                        key={column.id}
                        title={
                          typeof content === "string" ||
                          typeof content === "number"
                            ? String(content)
                            : undefined
                        }
                        className={cn(
                          alignClass[column.align ?? "left"],
                          column.cellClassName,
                        )}
                      >
                        {content}
                      </TableCell>
                    );
                  })}

                  <TableCell sticky="right" selected={selected}>
                    <ListRowActions
                      editLabel={`Edit ${recordLabel}`}
                      deleteLabel={`Delete ${recordLabel}`}
                      onEdit={() => onEdit(record)}
                      onDelete={() => onDelete([record.id])}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {!loading && records.length === 0 && (
        <TableEmptyState
          title={emptyTitle}
          description={emptyDescription}
        />
      )}
    </TableContainer>
  );
};

export default OutPatientTable;
