"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  ListBulkActions,
  ListCheckbox,
  ListRowActions,
  ListSortMenu,
  ListTable,
  Pagination,
  type ListSortDirection,
} from "@/src/components/page/list";
import { Input } from "@/src/components/ui";

import type { LedgerListPanelProps, LedgerRecord } from "./types";

const sortOptions = [
  { label: "Name", value: "name" },
  { label: "Date", value: "createdAt" },
];

const LedgerListPanel = ({
  section,
  records,
  onEdit,
  onDelete,
}: LedgerListPanelProps) => {
  const [search, setSearch] = useState("");
  const [sortValue, setSortValue] = useState("name");
  const [sortDirection, setSortDirection] =
    useState<ListSortDirection>("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setSelectedIds([]);
    setPage(1);
    setSearch("");
  }, [section.id]);

  useEffect(() => {
    const recordIds = new Set(records.map((record) => record.id));
    setSelectedIds((current) => current.filter((id) => recordIds.has(id)));
  }, [records]);

  const visibleRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = records.filter(
      (record) =>
        !query ||
        record.name.toLowerCase().includes(query) ||
        record.description.toLowerCase().includes(query),
    );

    return [...filtered].sort((first, second) => {
      const firstValue = first[sortValue as keyof LedgerRecord];
      const secondValue = second[sortValue as keyof LedgerRecord];
      const result = firstValue.localeCompare(secondValue);
      return sortDirection === "asc" ? result : -result;
    });
  }, [records, search, sortDirection, sortValue]);

  const totalPages = Math.max(1, Math.ceil(visibleRecords.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRecords = visibleRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const pageIds = pageRecords.map((record) => record.id);
  const selectedOnPage = pageIds.filter((id) => selectedIds.includes(id));
  const allOnPageSelected =
    pageIds.length > 0 && selectedOnPage.length === pageIds.length;

  const toggleAll = () => {
    setSelectedIds((current) =>
      allOnPageSelected
        ? current.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...current, ...pageIds])),
    );
  };

  const toggleRecord = (recordId: string) => {
    setSelectedIds((current) =>
      current.includes(recordId)
        ? current.filter((id) => id !== recordId)
        : [...current, recordId],
    );
  };

  const deleteSelected = () => {
    onDelete(selectedIds);
  };

  const selectedRecord = records.find((record) =>
    selectedIds.includes(record.id),
  );

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col border-r border-slate-200 bg-white p-3">
      <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0 shrink-0">
          <h2 className="truncate text-lg font-bold text-slate-900">
            {section.label}
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Manage {records.length} {records.length === 1 ? "record" : "records"}
          </p>
        </div>

        <div className="ml-auto flex min-w-0 items-center justify-end gap-2">
          <div className="w-[190px] min-w-[150px] xl:w-[220px] 2xl:w-[250px]">
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search ledgers..."
              leftIcon={<Search size={15} className="text-slate-400" />}
              inputSize="sm"
              className="h-8 !pl-9 text-xs"
              fullWidth
            />
          </div>
          <ListSortMenu
            options={sortOptions}
            value={sortValue}
            direction={sortDirection}
            compact
            onChange={(value, direction) => {
              setSortValue(value);
              setSortDirection(direction);
            }}
          />
        </div>
      </div>

      <ListBulkActions
        selectedCount={selectedIds.length}
        itemLabel="ledger"
        onEdit={
          selectedIds.length === 1 && selectedRecord
            ? () => onEdit(selectedRecord)
            : undefined
        }
        onDelete={deleteSelected}
      />

      <ListTable className="min-h-[260px]" density="compact">
        <table className="w-full min-w-[400px] table-fixed border-collapse text-left text-xs">
          <thead className="sticky top-0 z-20 bg-slate-50 text-xs font-semibold text-slate-600">
            <tr className="border-b border-slate-200">
              <th className="sticky left-0 z-30 w-12 bg-slate-50 text-center">
                <ListCheckbox
                  label="Select all ledgers on this page"
                  checked={allOnPageSelected}
                  indeterminate={
                    selectedOnPage.length > 0 && !allOnPageSelected
                  }
                  onChange={toggleAll}
                />
              </th>
              <th className="w-[36%]">Ledger Name</th>
              <th>Description</th>
              <th className="sticky right-0 z-30 w-20 bg-slate-50 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-slate-600">
            {pageRecords.map((record) => {
              const selected = selectedIds.includes(record.id);

              return (
                <tr
                  key={record.id}
                  className={`h-10 border-b border-slate-100 transition-colors last:border-0 ${
                    selected ? "bg-primary/[0.045]" : "hover:bg-slate-50/70"
                  }`}
                >
                  <td
                    className={`sticky left-0 z-10 text-center ${
                      selected ? "bg-[#f7f7ff]" : "bg-white"
                    }`}
                  >
                    <ListCheckbox
                      label={`Select ${record.name}`}
                      checked={selected}
                      onChange={() => toggleRecord(record.id)}
                    />
                  </td>
                  <td className="truncate font-semibold text-slate-800">
                    {record.name}
                  </td>
                  <td className="truncate text-xs" title={record.description}>
                    {record.description}
                  </td>
                  <td
                    className={`sticky right-0 z-10 ${
                      selected ? "bg-[#f7f7ff]" : "bg-white"
                    }`}
                  >
                    <ListRowActions
                      editLabel={`Edit ${record.name}`}
                      deleteLabel={`Delete ${record.name}`}
                      onEdit={() => onEdit(record)}
                      onDelete={() => onDelete([record.id])}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {pageRecords.length === 0 && (
          <div className="flex min-h-48 items-center justify-center text-center">
            <div>
              <p className="text-sm font-medium text-slate-600">
                No ledger records found
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Try another search or create a new entry.
              </p>
            </div>
          </div>
        )}
      </ListTable>

      <Pagination
        page={currentPage}
        pageSize={pageSize}
        totalItems={visibleRecords.length}
        pageSizeOptions={[10, 25, 50]}
        compact
        onPageChange={setPage}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize);
          setPage(1);
        }}
      />
    </section>
  );
};

export default LedgerListPanel;
