"use client";

import { Filter, History, Search } from "lucide-react";
import { useEffect, useState } from "react";

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
import { useChunkedList } from "@/src/core/query";

import UserLogFilterFields from "./UserLogFilterFields";
import UserLogTable from "./UserLogTable";
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
  const listState = useChunkedList<UserLogRecord, UserLogFilters>({
    cacheKey: "user-log:list",
    fetchChunk: userLogService.listChunk,
    search: appliedFilters.search,
    sortBy: sortValue,
    sortDirection,
    filters: {
      search: "",
      userId: appliedFilters.userId,
    },
    chunkSize: 10,
    initialPageSize: 10,
    cachePolicy: "memory",
  });
  const records = listState.items;

  useEffect(() => {
    const recordIds = new Set(records.map((record) => record.id));
    setSelectedIds((current) => current.filter((id) => recordIds.has(id)));
  }, [records]);

  const filterCount = appliedFilters.userId ? 1 : 0;
  const selectedRecord = records.find((record) =>
    selectedIds.includes(record.id),
  );

  useEffect(() => {
    if (!listState.error) return;
    userLogLogger.error("Unable to load user logs", listState.error);
    toast.error({
      title: "Unable to load user logs",
      description: listState.error,
    });
  }, [listState.error]);

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
    try {
      const removed = await userLogService.remove(pendingDeleteIds);
      setSelectedIds((current) =>
        current.filter((id) => !pendingDeleteIds.includes(id)),
      );
      listState.clearCache();

      userLogLogger.info("User log records deleted", {
        count: removed,
        ids: pendingDeleteIds,
      });

      toast.success({
        title: "User log deleted",
        description: `${removed} ${
          removed === 1 ? "record" : "records"
        } removed.`,
      });
      setPendingDeleteIds([]);
    } catch (error) {
      userLogLogger.error("Unable to delete user log records", error);
      toast.error({
        title: "Delete failed",
        description: "Unable to delete the selected user log records.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const updateSearch = (value: string) => {
    setDraftFilters((current) => ({ ...current, search: value }));
    setAppliedFilters((current) => ({ ...current, search: value }));
    setSelectedIds([]);
    listState.setPage(1);
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
              {records.length} of {listState.totalItems} user log records
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
                listState.setPage(1);
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
                records={records}
                page={listState.page}
                pageSize={listState.pageSize}
                selectedIds={selectedIds}
                loading={listState.loading}
                loadingMore={listState.loadingMore}
                hasMore={listState.hasMoreInPage}
                onSelectionChange={setSelectedIds}
                onEdit={editUserLog}
                onDelete={setPendingDeleteIds}
                onLoadMore={listState.loadMore}
              />
            </div>

            <div className="shrink-0 pt-3">
              <Pagination
                page={listState.page}
                pageSize={listState.pageSize}
                totalItems={listState.totalItems}
                loadedItems={records.length}
                pageSizeOptions={[10, 20, 50]}
                onPageChange={(nextPage) => {
                  listState.setPage(nextPage);
                  setSelectedIds([]);
                }}
                onPageSizeChange={(nextPageSize) => {
                  listState.setPageSize(nextPageSize);
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
              listState.setPage(1);
              setFilterOpen(false);
            }}
            onReset={() => {
              setDraftFilters((current) => ({ ...current, userId: "" }));
              setAppliedFilters((current) => ({ ...current, userId: "" }));
              setSelectedIds([]);
              listState.setPage(1);
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
