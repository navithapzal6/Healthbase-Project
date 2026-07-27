"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";

import {
  ListBulkActions,
  Pagination,
  type ListSortDirection,
} from "@/src/components/page/list";
import { ConfirmationDialog, toast } from "@/src/components/ui";
import { logger } from "@/src/core/logger";

import { outPatientService } from "../api/outPatientService";
import OutPatientTable from "./OutPatientTable";
import OutPatientToolbar from "./OutPatientToolbar";
import type {
  OutPatientModuleProps,
  OutPatientViewId,
  PaginatedResult,
  PatientOption,
} from "../types";

const moduleLogger = logger.child("out-patient");

const emptyPagination = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 1,
};

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
}: OutPatientModuleProps<TRecord, TValues>) => {
  const requestNumber = useRef(0);
  const [view, setView] = useState<OutPatientViewId>("list");
  const [records, setRecords] = useState<TRecord[]>([]);
  const [pagination, setPagination] = useState(emptyPagination);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
  const [patientOptions, setPatientOptions] = useState<PatientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    if (!config.needsPatientOptions) return;

    let active = true;
    outPatientService
      .listPatientOptions()
      .then((options) => {
        if (active) setPatientOptions(options);
      })
      .catch((error) => {
        moduleLogger.error("Unable to load patient options", error, {
          section: config.id,
        });
        if (active) {
          toast.error({
            title: "Unable to load patients",
            description: "Check that the Go API and MySQL are running.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [config.id, config.needsPatientOptions]);

  const loadRecords = useCallback(async () => {
    const currentRequest = ++requestNumber.current;
    setLoading(true);
    setLoadError("");

    try {
      const result: PaginatedResult<TRecord> = await list({
        page,
        pageSize,
        search,
        sortBy: sortValue,
        sortDirection,
      });

      if (currentRequest !== requestNumber.current) return;

      setRecords(result.items);
      setPagination(result.pagination);
      setSelectedIds((current) =>
        current.filter((id) =>
          result.items.some((record) => record.id === id),
        ),
      );

      if (
        result.pagination.totalPages > 0 &&
        page > result.pagination.totalPages
      ) {
        setPage(result.pagination.totalPages);
      }
    } catch (error) {
      if (currentRequest !== requestNumber.current) return;

      const message =
        error instanceof Error ? error.message : "Unable to load records.";
      setRecords([]);
      setPagination((current) => ({ ...current, totalItems: 0 }));
      setLoadError(message);
      moduleLogger.error("Unable to load records", error, {
        section: config.id,
      });
    } finally {
      if (currentRequest === requestNumber.current) setLoading(false);
    }
  }, [
    config.id,
    list,
    page,
    pageSize,
    reloadVersion,
    search,
    sortDirection,
    sortValue,
  ]);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

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

      if (page !== 1) {
        setPage(1);
      } else {
        setReloadVersion((current) => current + 1);
      }
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
        setPage((current) => Math.max(1, current - 1));
      } else {
        setReloadVersion((current) => current + 1);
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
        totalItems={pagination.totalItems}
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
            />
          </div>

          <Pagination
            page={pagination.page}
            pageSize={pageSize}
            totalItems={pagination.totalItems}
            pageSizeOptions={[10, 25, 50]}
            compact
            onPageChange={setPage}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize);
              setPage(1);
            }}
          />
        </>
      ) : (
        <div className="min-h-0 flex-1 rounded-2xl border border-slate-200 bg-white p-4">
          <EntryForm
            key={`${config.id}-${editingRecord?.id ?? "new"}`}
            initialValues={formValues}
            patientOptions={patientOptions}
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
