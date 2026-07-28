"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  ListBulkActions,
  ListCheckbox,
  ListLoadSentinel,
  ListRowActions,
  ListSortMenu,
  ListTable,
  Pagination,
  type ListSortDirection,
} from "@/src/components/page/list";
import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableEmptyState,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeletonRows,
} from "@/src/components/ui";
import {
  createArrayListSource,
  useChunkedList,
} from "@/src/core/query";

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

  const sourceVersion = useMemo(
    () =>
      records
        .map(
          (record) =>
            `${record.id}:${record.name}:${record.description}:${record.createdAt}`,
        )
        .join("|"),
    [records],
  );

  const fetchChunk = useMemo(
    () =>
      createArrayListSource<LedgerRecord, Record<string, never>>({
        items: records,
        searchableText: (record) =>
          `${record.name} ${record.description}`,
        compare: (first, second, field) =>
          String(first[field as keyof LedgerRecord]).localeCompare(
            String(second[field as keyof LedgerRecord]),
          ),
        delayMs: 150,
      }),
    [records],
  );

  const listState = useChunkedList<LedgerRecord>({
    cacheKey: `ledger:${section.id}`,
    fetchChunk,
    search,
    sortBy: sortValue,
    sortDirection,
    chunkSize: 10,
    initialPageSize: 10,
    sourceVersion,
  });

  useEffect(() => {
    setSelectedIds([]);
    listState.setPage(1);
    setSearch("");
  }, [section.id]);

  useEffect(() => {
    const recordIds = new Set(records.map((record) => record.id));
    setSelectedIds((current) => current.filter((id) => recordIds.has(id)));
  }, [records]);

  const currentPage = listState.page;
  const pageRecords = listState.items;
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
                listState.setPage(1);
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
              listState.setPage(1);
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

      <ListTable className="min-h-[260px]" density="dense">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200">
              <TableHead sticky="left" className="w-12 text-center">
                <ListCheckbox
                  label="Select all ledgers on this page"
                  checked={allOnPageSelected}
                  indeterminate={
                    selectedOnPage.length > 0 && !allOnPageSelected
                  }
                  onChange={toggleAll}
                />
              </TableHead>
              <TableHead className="w-[36%]">Ledger Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead sticky="right" className="w-20 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listState.loading ? (
              <TableSkeletonRows
                rows={10}
                columns={2}
                hasSelection
                hasActions
              />
            ) : pageRecords.map((record) => {
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
                      label={`Select ${record.name}`}
                      checked={selected}
                      onChange={() => toggleRecord(record.id)}
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    {record.name}
                  </TableCell>
                  <TableCell className="text-xs" title={record.description}>
                    {record.description}
                  </TableCell>
                  <TableCell
                    sticky="right"
                    selected={selected}
                  >
                    <ListRowActions
                      editLabel={`Edit ${record.name}`}
                      deleteLabel={`Delete ${record.name}`}
                      onEdit={() => onEdit(record)}
                      onDelete={() => onDelete([record.id])}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {!listState.loading && pageRecords.length === 0 && (
          <TableEmptyState
            title="No ledger records found"
            description="Try another search or create a new entry."
          />
        )}

        {!listState.loading && (
          <ListLoadSentinel
            hasMore={listState.hasMoreInPage}
            loading={listState.loadingMore}
            onLoadMore={listState.loadMore}
          />
        )}
      </ListTable>

      <Pagination
        page={currentPage}
        pageSize={listState.pageSize}
        totalItems={listState.totalItems}
        loadedItems={pageRecords.length}
        pageSizeOptions={[10, 20, 50]}
        compact
        onPageChange={listState.setPage}
        onPageSizeChange={listState.setPageSize}
      />
    </section>
  );
};

export default LedgerListPanel;
