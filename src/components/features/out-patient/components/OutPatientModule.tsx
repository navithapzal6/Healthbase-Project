"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil } from "lucide-react";

import {
  ListBulkActions,
  Pagination,
  type ListSortDirection,
} from "@/src/components/page/list";
import { ConfirmationDialog, toast } from "@/src/components/ui";
import { logger } from "@/src/core/logger";
import {
  useChunkedList,
  type ListChunkFetcher,
} from "@/src/core/query";

import OutPatientTable from "./OutPatientTable";
import OutPatientToolbar from "./OutPatientToolbar";
import type { OutPatientModuleProps, OutPatientViewId } from "../types";

const moduleLogger = logger.child("out-patient");

const OutPatientModule = <
  TRecord extends { id: number },
  TValues extends object,
>({
  config,
  columns,
  EntryForm,
  list,
  create,
  update,
  remove,
  toFormValues,
  loadPatientOptions,
  toPatientOption,
}: OutPatientModuleProps<TRecord, TValues>) => {
  const [view, setView] = useState<OutPatientViewId>("list");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortValue, setSortValue] = useState(config.defaultSort);
  const [sortDirection, setSortDirection] = useState<ListSortDirection>(
    config.defaultSortDirection,
  );
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [editingRecord, setEditingRecord] = useState<TRecord | null>(null);
  const [pendingEditRecord, setPendingEditRecord] =
    useState<TRecord | null>(null);
  const [pendingSave, setPendingSave] = useState<TValues | null>(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchChunk = useCallback<ListChunkFetcher<TRecord>>(
    async ({
      limit,
      cursor,
      includeTotal,
      search: query,
      sortBy,
      sortDirection: direction,
      signal,
    }) => {
      const result = await list({
        cursor,
        limit,
        includeTotal,
        search: query,
        sortBy,
        sortDirection: direction,
        signal,
      });

      return {
        items: result.items,
        totalItems: result.pagination.totalItems,
        nextCursor: result.pagination.nextCursor ?? null,
        hasMore: result.pagination.hasMore,
      };
    },
    [list],
  );

  const {
    items: records,
    page,
    pageSize,
    totalItems,
    loading,
    loadingMore,
    hasMoreInPage,
    error: loadError,
    setPage,
    setPageSize,
    loadMore,
    clearCache,
  } = useChunkedList<TRecord>({
    cacheKey: `out-patient:${config.id}`,
    fetchChunk,
    paginationMode: "cursor",
    search,
    sortBy: sortValue,
    sortDirection,
    chunkSize: 10,
    searchDebounceMs: 0,
    initialPageSize: 10,
    cachePolicy: "session",
    cacheTtlMs: 5 * 60 * 1000,
    getItemKey: (record) => record.id,
  });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const recordIds = new Set(records.map((record) => record.id));
    setSelectedIds((current) =>
      current.filter((id) => recordIds.has(id)),
    );
  }, [records]);

  const changeView = (nextView: OutPatientViewId) => {
    setPendingSave(null);
    setPendingEditRecord(null);

    if (nextView === "entry") {
      setEditingRecord(null);
    }

    if (nextView === "list") {
      setEditingRecord(null);
    }

    setView(nextView);
  };

  const beginEdit = (record: TRecord) => {
    setPendingEditRecord(record);
  };

  const confirmEdit = () => {
    if (!pendingEditRecord) return;

    setEditingRecord(pendingEditRecord);
    setPendingEditRecord(null);
    setView("entry");
  };

  const confirmSave = async () => {
    if (!pendingSave) return;
    setSaving(true);

    try {
      const saved = editingRecord
        ? await update(editingRecord.id, pendingSave)
        : await create(pendingSave);

      moduleLogger.info("Out patient record saved", {
        section: config.id,
        id: saved.id,
        mode: editingRecord ? "update" : "create",
      });

      toast.success({
        title: `${config.singular} ${editingRecord ? "updated" : "saved"}`,
        description: `${config.singular} record was saved successfully.`,
      });

      setPendingSave(null);
      setEditingRecord(null);
      setSelectedIds([]);
      setView("list");
      clearCache();
      setPage(1);
    } catch (error) {
      moduleLogger.error("Unable to save out patient record", error, {
        section: config.id,
      });
      toast.error({
        title: `Unable to save ${config.singular.toLowerCase()}`,
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
      setPendingSave(null);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDeleteIds.length) return;
    setDeleting(true);

    try {
      const deletedCount = await remove(pendingDeleteIds);

      toast.success({
        title: `${config.singular} deleted`,
        description: `${deletedCount} ${
          deletedCount === 1 ? "record" : "records"
        } removed.`,
      });

      const deletingWholePage =
        pendingDeleteIds.length >= records.length && page > 1;

      setPendingDeleteIds([]);
      setSelectedIds([]);

      if (deletingWholePage) {
        clearCache();
        setPage(Math.max(1, page - 1));
      } else {
        clearCache();
      }
    } catch (error) {
      moduleLogger.error("Unable to delete out patient records", error, {
        section: config.id,
        ids: pendingDeleteIds,
      });
      toast.error({
        title: "Unable to delete",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const selectedRecord = records.find((record) =>
    selectedIds.includes(record.id),
  );
  const formValues = editingRecord
    ? toFormValues(editingRecord)
    : undefined;
  const editingPatientOption =
    editingRecord && toPatientOption
      ? toPatientOption(editingRecord)
      : undefined;
  const availablePatientOptions = editingPatientOption
    ? [editingPatientOption]
    : [];
  const title =
    view === "list"
      ? config.listTitle
      : editingRecord
        ? `Edit ${config.singular}`
        : config.createTitle;

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-white p-4">
      <OutPatientToolbar
        title={title}
        totalItems={totalItems}
        view={view}
        createLabel={`New ${config.singular}`}
        search={searchInput}
        searchPlaceholder={config.searchPlaceholder}
        sortOptions={config.sortOptions}
        sortValue={sortValue}
        sortDirection={sortDirection}
        onViewChange={changeView}
        onSearchChange={setSearchInput}
        onSortChange={(value, direction) => {
          setSortValue(value);
          setSortDirection(direction);
          setPage(1);
        }}
      />

      {view === "list" ? (
        <>
          <ListBulkActions
            selectedCount={selectedIds.length}
            itemLabel={config.singular.toLowerCase()}
            onEdit={
              selectedIds.length === 1 && selectedRecord
                ? () => beginEdit(selectedRecord)
                : undefined
            }
            onDelete={() => setPendingDeleteIds(selectedIds)}
          />

          <div className="min-h-0 flex-1">
            <OutPatientTable
              records={records}
              columns={columns}
              selectedIds={selectedIds}
              loading={loading}
              tableMinWidth={config.tableMinWidth}
              loadingMore={loadingMore}
              hasMore={hasMoreInPage}
              emptyTitle={
                loadError
                  ? "Unable to load records"
                  : `No ${config.plural.toLowerCase()} found`
              }
              emptyDescription={
                loadError ||
                `Try another search or add a new ${config.singular.toLowerCase()}.`
              }
              getRecordLabel={(record) =>
                String(
                  columns.find(
                    (column) =>
                      column.id === "patientName" ||
                      column.id === "consultationNumber" ||
                      column.id === "prescriptionNumber",
                  )?.render(record) ?? record.id,
                )
              }
              onSelectionChange={setSelectedIds}
              onEdit={beginEdit}
              onDelete={setPendingDeleteIds}
              onLoadMore={loadMore}
            />
          </div>

          <Pagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            loadedItems={records.length}
            pageSizeOptions={[10, 20, 50]}
            compact
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      ) : (
        <div className="min-h-0 flex-1 rounded-2xl border border-slate-200 bg-white p-4">
          <EntryForm
            key={`${config.id}-${editingRecord?.id ?? "new"}`}
            initialValues={formValues}
            patientOptions={availablePatientOptions}
            loadPatientOptions={loadPatientOptions}
            saving={saving}
            submitLabel={editingRecord ? "Update" : "Save"}
            onSubmit={setPendingSave}
          />
        </div>
      )}

      <ConfirmationDialog
        open={pendingEditRecord !== null}
        title={`Edit this ${config.singular.toLowerCase()}?`}
        description={`You are about to edit the selected ${config.singular.toLowerCase()} record. Do you want to continue?`}
        confirmText="Continue"
        variant="primary"
        icon={<Pencil size={24} />}
        onConfirm={confirmEdit}
        onCancel={() => setPendingEditRecord(null)}
      />

      <ConfirmationDialog
        open={pendingSave !== null}
        title={`${editingRecord ? "Update" : "Save"} ${config.singular}?`}
        description={`Confirm the ${config.singular.toLowerCase()} details before saving to MySQL.`}
        confirmText={editingRecord ? "Update" : "Save"}
        variant="primary"
        loading={saving}
        onConfirm={confirmSave}
        onCancel={() => !saving && setPendingSave(null)}
      />

      <ConfirmationDialog
        open={pendingDeleteIds.length > 0}
        title={`Delete selected ${config.plural.toLowerCase()}?`}
        description={`You are about to remove ${pendingDeleteIds.length} ${
          pendingDeleteIds.length === 1 ? "record" : "records"
        }. This action will be stored as a soft delete.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setPendingDeleteIds([])}
      />

    </section>
  );
};

export default OutPatientModule;
