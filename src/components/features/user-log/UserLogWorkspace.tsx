"use client";

import { Filter, History, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  ListBulkActions,
  ListFilterPanel,
  ListSortMenu,
  Pagination,
  type ListSortDirection,
  type ListSortOption,
} from "@/src/components/page/list";
import { Button, ConfirmationDialog, Input, toast } from "@/src/components/ui";
import { logger } from "@/src/core/logger";

import UserLogFilterFields from "./UserLogFilterFields";
import UserLogTable from "./UserLogTable";
import { userLogRecords } from "./data";
import { userLogService } from "./service";
import type { UserLogFilters, UserLogRecord } from "./types";

const emptyFilters: UserLogFilters = {
  search: "",
  userId: "",
};

const userLogLogger = logger.child("user-log");

const sortOptions: ListSortOption[] = [
  { label: "Date", value: "date" },
  { label: "User", value: "user" },
  { label: "Log In", value: "logIn" },
  { label: "Log Out", value: "logOut" },
];

const UserLogWorkspace = () => {
  const [records, setRecords] = useState<UserLogRecord[]>(() => [
    ...userLogRecords,
  ]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] =
    useState<UserLogFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<UserLogFilters>(emptyFilters);
  const [sortValue, setSortValue] = useState("date");
  const [sortDirection, setSortDirection] =
    useState<ListSortDirection>("desc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    let active = true;

    userLogService
      .list()
      .then((data) => {
        if (active) setRecords(data);
      })
      .catch((error) => {
        userLogLogger.error("Unable to load user logs", error);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const recordIds = new Set(records.map((record) => record.id));
    setSelectedIds((current) => current.filter((id) => recordIds.has(id)));
  }, [records]);

  const visibleRecords = useMemo(() => {
    const search = appliedFilters.search.trim().toLowerCase();
    const filtered = records.filter((record) => {
      const matchesSearch =
        !search ||
        record.user.toLowerCase().includes(search) ||
        record.date.toLowerCase().includes(search) ||
        record.logIn.toLowerCase().includes(search) ||
        record.logOut.toLowerCase().includes(search);
      const matchesUser =
        !appliedFilters.userId || record.userId === appliedFilters.userId;

      return matchesSearch && matchesUser;
    });

    return [...filtered].sort((first, second) => {
      const firstValue = String(
        first[sortValue as keyof UserLogRecord],
      ).toLowerCase();
      const secondValue = String(
        second[sortValue as keyof UserLogRecord],
      ).toLowerCase();
      const result = firstValue.localeCompare(secondValue);

      return sortDirection === "asc" ? result : -result;
    });
  }, [appliedFilters, records, sortDirection, sortValue]);

  const totalPages = Math.max(1, Math.ceil(visibleRecords.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRecords = visibleRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const filterCount = appliedFilters.userId ? 1 : 0;
  const selectedRecord = records.find((record) =>
    selectedIds.includes(record.id),
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const editUserLog = (record: UserLogRecord) => {
    userLogLogger.debug("User log selected for edit", { id: record.id });
    toast.info({
      title: "User log selected",
      description: `${record.user} · ${formatLogReference(record)} is ready for the API edit flow.`,
    });
  };

  const deleteUserLogs = async () => {
    if (!pendingDeleteIds.length) return;
    setDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    setRecords((current) =>
      current.filter((record) => !pendingDeleteIds.includes(record.id)),
    );
    setSelectedIds((current) =>
      current.filter((id) => !pendingDeleteIds.includes(id)),
    );

    userLogLogger.info("User log records deleted", {
      count: pendingDeleteIds.length,
      ids: pendingDeleteIds,
    });

    toast.success({
      title: "User log deleted",
      description: `${pendingDeleteIds.length} ${
        pendingDeleteIds.length === 1 ? "record" : "records"
      } removed.`,
    });

    setPendingDeleteIds([]);
    setDeleting(false);
  };

  const updateSearch = (value: string) => {
    setDraftFilters((current) => ({ ...current, search: value }));
    setAppliedFilters((current) => ({ ...current, search: value }));
    setSelectedIds([]);
    setPage(1);
  };

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        <div className="mb-4 flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <History className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                User Log List
              </h2>
            </div>
            <p className="ml-11 mt-0.5 text-xs text-slate-500">
              {visibleRecords.length} of {records.length} user log records
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="w-full sm:w-64">
              <Input
                value={appliedFilters.search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Search user logs..."
                leftIcon={<Search size={16} className="text-slate-400" />}
                inputSize="sm"
                className="h-9"
                fullWidth
              />
            </div>

            <Button unstyled
              type="button"
              onClick={() => setFilterOpen((current) => !current)}
              aria-expanded={filterOpen}
              className={`inline-flex h-9 items-center justify-center gap-2 rounded-xl px-4 text-sm font-medium shadow-sm transition-all duration-200 ${
                filterOpen
                  ? "bg-primary text-white"
                  : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
              }`}
            >
              <Filter size={16} />
              Filter
              {filterCount > 0 && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-semibold ${
                    filterOpen
                      ? "bg-white text-primary"
                      : "bg-primary text-white"
                  }`}
                >
                  {filterCount}
                </span>
              )}
            </Button>

            <ListSortMenu
              options={sortOptions}
              value={sortValue}
              direction={sortDirection}
              onChange={(value, direction) => {
                setSortValue(value);
                setSortDirection(direction);
                setSelectedIds([]);
                setPage(1);
              }}
            />
          </div>
        </div>

        <ListBulkActions
          selectedCount={selectedIds.length}
          itemLabel="user log"
          onEdit={
            selectedIds.length === 1 && selectedRecord
              ? () => editUserLog(selectedRecord)
              : undefined
          }
          onDelete={() => setPendingDeleteIds(selectedIds)}
        />

        <div className="flex min-h-0 flex-1 gap-4">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="min-h-0 flex-1">
              <UserLogTable
                records={pageRecords}
                page={currentPage}
                pageSize={pageSize}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onEdit={editUserLog}
                onDelete={setPendingDeleteIds}
              />
            </div>

            <div className="shrink-0 pt-3">
              <Pagination
                page={currentPage}
                pageSize={pageSize}
                totalItems={visibleRecords.length}
                pageSizeOptions={[10, 20, 50]}
                onPageChange={(nextPage) => {
                  setPage(nextPage);
                  setSelectedIds([]);
                }}
                onPageSizeChange={(nextPageSize) => {
                  setPageSize(nextPageSize);
                  setPage(1);
                  setSelectedIds([]);
                }}
              />
            </div>
          </div>

          <ListFilterPanel
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            onApply={() => {
              setAppliedFilters((current) => ({
                ...current,
                userId: draftFilters.userId,
              }));
              setSelectedIds([]);
              setPage(1);
              setFilterOpen(false);
            }}
            onReset={() => {
              setDraftFilters((current) => ({ ...current, userId: "" }));
              setAppliedFilters((current) => ({ ...current, userId: "" }));
              setSelectedIds([]);
              setPage(1);
            }}
          >
            <UserLogFilterFields
              values={draftFilters}
              onChange={setDraftFilters}
            />
          </ListFilterPanel>
        </div>
      </div>

      <ConfirmationDialog
        open={pendingDeleteIds.length > 0}
        title="Delete user log records?"
        description={`You are about to delete ${pendingDeleteIds.length} ${
          pendingDeleteIds.length === 1 ? "record" : "records"
        }. This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={deleteUserLogs}
        onCancel={() => !deleting && setPendingDeleteIds([])}
      />
    </>
  );
};

const formatLogReference = (record: UserLogRecord) =>
  `${record.date}, ${record.logIn}`;

export default UserLogWorkspace;
