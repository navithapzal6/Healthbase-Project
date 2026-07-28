"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button, ConfirmationDialog, Input, Select, toast } from "@/src/components/ui";
import { logger } from "@/src/core/logger";
import { useChunkedList } from "@/src/core/query";
import {
  ListBulkActions,
  ListSortMenu,
  Pagination,
  type ListSortDirection,
  type ListSortOption,
} from "@/src/components/page/list";
import { SplitModal } from "@/src/components/templates/split-modal";
import type {
  TransactionFormValues,
  TransactionListFilters,
  TransactionRecord,
  TransactionWorkspaceProps,
} from "./types";

interface PendingSave {
  values: TransactionFormValues;
  clear: () => void;
}

const historySortOptions: ListSortOption[] = [
  { label: "Date", value: "date" },
  { label: "Category", value: "category" },
  { label: "Amount", value: "amount" },
];

const historyPageSize = 10;

const transactionWorkspaceLogger = logger.child("transaction-workspace");

const TransactionWorkspace = ({
  config,
  service,
  EntryForm,
  TableView,
}: TransactionWorkspaceProps) => {
  const ModuleIcon = config.icon;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [historySelectedIds, setHistorySelectedIds] = useState<string[]>([]);
  const [historySortValue, setHistorySortValue] = useState("date");
  const [historySortDirection, setHistorySortDirection] =
    useState<ListSortDirection>("desc");
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("");
  const [pendingSave, setPendingSave] = useState<PendingSave | null>(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const listState = useChunkedList<
    TransactionRecord,
    TransactionListFilters
  >({
    cacheKey: `transaction:${config.prefix}:list`,
    fetchChunk: service.listChunk,
    search,
    sortBy: "date",
    sortDirection: "desc",
    filters: { paymentMode: mode },
    chunkSize: 10,
    initialPageSize: 10,
    cachePolicy: "memory",
  });

  const historyState = useChunkedList<
    TransactionRecord,
    TransactionListFilters
  >({
    cacheKey: `transaction:${config.prefix}:history:${selectedContactId}`,
    fetchChunk: service.listByContactChunk,
    sortBy: historySortValue,
    sortDirection: historySortDirection,
    filters: { contactId: selectedContactId },
    chunkSize: 10,
    initialPageSize: historyPageSize,
    cachePolicy: "memory",
    enabled: Boolean(selectedContactId),
  });

  const records = listState.items;
  const historyRecords = historyState.items;

  useEffect(() => {
    const recordIds = new Set(records.map((record) => record.id));
    setSelectedIds((current) => current.filter((id) => recordIds.has(id)));
  }, [records]);

  useEffect(() => {
    const historyIds = new Set(historyRecords.map((record) => record.id));
    setHistorySelectedIds((current) =>
      current.filter((id) => historyIds.has(id)),
    );
  }, [historyRecords]);

  useEffect(() => {
    setHistorySelectedIds([]);
    historyState.setPage(1);
  }, [selectedContactId]);

  const currentPage = listState.page;
  const pageRecords = records;
  const contactHistory = historyRecords;
  const currentHistoryPage = historyState.page;
  const historyPageRecords = historyRecords;
  const selectedRecord = records.find((record) =>
    selectedIds.includes(record.id),
  );
  const selectedHistoryRecord = contactHistory.find((record) =>
    historySelectedIds.includes(record.id),
  );

  useEffect(() => {
    listState.setPage(1);
    setSelectedIds([]);
  }, [search, mode]);

  const saveTransaction = async () => {
    if (!pendingSave) return;
    setSaving(true);

    try {
      const { values, clear } = pendingSave;
      const created = await service.create({
        date: values.date,
        contactId: values.contactId,
        category: values.category,
        paymentMode: values.paymentMode as TransactionRecord["paymentMode"],
        description: values.description.trim(),
        amount: Number(values.amount),
      });

      listState.clearCache();
      listState.setPage(1);
      if (created.contactId === selectedContactId) {
        historyState.clearCache();
        historyState.setPage(1);
      }
      clear();
      setPendingSave(null);
      transactionWorkspaceLogger.info("Transaction saved", {
        module: config.singular,
        id: created.id,
      });
      toast.success({
        title: `${config.singular} saved`,
        description: `${created.contactName} ${config.singular.toLowerCase()} was added successfully.`,
      });
    } catch (error) {
      transactionWorkspaceLogger.error(
        "Unable to save transaction",
        error,
        { module: config.singular },
      );
      toast.error({
        title: "Unable to save",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const editTransaction = (record: TransactionRecord) => {
    transactionWorkspaceLogger.debug("Transaction selected for edit", {
      module: config.singular,
      id: record.id,
    });
    setSelectedContactId(record.contactId);
    setModalOpen(true);
    toast.info({
      title: `${config.singular} selected`,
      description: `${record.id} is ready for the API edit flow.`,
    });
  };

  const deleteTransactions = async () => {
    if (!pendingDeleteIds.length) return;
    setDeleting(true);

    try {
      const deletedCount = await service.remove(pendingDeleteIds);
      listState.clearCache();
      historyState.clearCache();
      setSelectedIds([]);
      setHistorySelectedIds([]);

      transactionWorkspaceLogger.info("Transactions deleted", {
        module: config.singular,
        count: deletedCount,
        ids: pendingDeleteIds,
      });

      toast.success({
        title: `${config.singular} deleted`,
        description: `${pendingDeleteIds.length} ${
          pendingDeleteIds.length === 1
            ? config.singular.toLowerCase()
            : config.plural.toLowerCase()
        } removed.`,
      });
      setPendingDeleteIds([]);
    } catch (error) {
      transactionWorkspaceLogger.error(
        "Unable to delete transactions",
        error,
        { module: config.singular, ids: pendingDeleteIds },
      );
      toast.error({
        title: "Unable to delete",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ModuleIcon className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              {config.singular} List
            </h2>
          </div>
          <p className="ml-11 mt-0.5 text-xs text-slate-500">
            {records.length} of {listState.totalItems}{" "}
            {config.singular.toLowerCase()} records
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input unstyled
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${config.plural.toLowerCase()}...`}
              className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <Select unstyled
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary"
          >
            <option value="">All modes</option>
            {config.paymentModes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Button unstyled
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white shadow-sm transition hover:bg-primary/85"
          >
            <Plus className="h-4 w-4" />
            New {config.singular}
          </Button>
        </div>
      </div>

      <ListBulkActions
        selectedCount={selectedIds.length}
        itemLabel={config.singular.toLowerCase()}
        onEdit={
          selectedIds.length === 1 && selectedRecord
            ? () => editTransaction(selectedRecord)
            : undefined
        }
        onDelete={() => setPendingDeleteIds(selectedIds)}
      />

      <div className="min-h-0 flex-1">
        <TableView
          records={pageRecords}
          selectedIds={selectedIds}
          loading={listState.loading}
          loadingMore={listState.loadingMore}
          hasMore={listState.hasMoreInPage}
          onSelectionChange={setSelectedIds}
          onEdit={editTransaction}
          onDelete={setPendingDeleteIds}
          onLoadMore={listState.loadMore}
        />
      </div>
      <div className="shrink-0 pt-3">
        <Pagination
          page={currentPage}
          pageSize={listState.pageSize}
          totalItems={listState.totalItems}
          loadedItems={records.length}
          pageSizeOptions={[10, 20, 50]}
          onPageChange={listState.setPage}
          onPageSizeChange={listState.setPageSize}
        />
      </div>

      <SplitModal
        open={modalOpen}
        title={`New ${config.singular}`}
        subtitle={config.modalSubtitle}
        leftTitle={
          selectedContactId
            ? `${config.singular} History · ${historyState.totalItems} records`
            : `${config.singular} History`
        }
        leftHeaderAction={
          selectedContactId ? (
            <ListSortMenu
              options={historySortOptions}
              value={historySortValue}
              direction={historySortDirection}
              compact
              onChange={(value, direction) => {
                setHistorySortValue(value);
                setHistorySortDirection(direction);
                setHistorySelectedIds([]);
                historyState.setPage(1);
              }}
            />
          ) : undefined
        }
        rightTitle={`${config.singular} Entry`}
        onClose={() => {
          if (!saving) setModalOpen(false);
        }}
        left={
          selectedContactId ? (
            <div className="flex h-full min-h-0 flex-col">
              <ListBulkActions
                selectedCount={historySelectedIds.length}
                itemLabel={config.singular.toLowerCase()}
                onEdit={
                  historySelectedIds.length === 1 && selectedHistoryRecord
                    ? () => editTransaction(selectedHistoryRecord)
                    : undefined
                }
                onDelete={() => setPendingDeleteIds(historySelectedIds)}
              />

              <div className="min-h-0 flex-1">
                <TableView
                  records={historyPageRecords}
                  selectedIds={historySelectedIds}
                  hideContact
                  loading={historyState.loading}
                  loadingMore={historyState.loadingMore}
                  hasMore={historyState.hasMoreInPage}
                  onSelectionChange={setHistorySelectedIds}
                  onEdit={editTransaction}
                  onDelete={setPendingDeleteIds}
                  onLoadMore={historyState.loadMore}
                />
              </div>

              {historyState.totalItems > historyPageSize && (
                <Pagination
                  page={currentHistoryPage}
                  pageSize={historyPageSize}
                  totalItems={historyState.totalItems}
                  loadedItems={contactHistory.length}
                  compact
                  onPageChange={(nextPage) => {
                    historyState.setPage(nextPage);
                    setHistorySelectedIds([]);
                  }}
                />
              )}
            </div>
          ) : (
            <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
              <Search className="mb-3 h-8 w-8 text-primary/60" />
              <p className="text-sm font-semibold text-slate-700">
                Select a contact to view {config.singular.toLowerCase()} history
              </p>
              <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                Use the Contact Name typeahead in the entry form. Previous{" "}
                {config.plural.toLowerCase()} will appear here automatically.
              </p>
            </div>
          )
        }
        right={
          <EntryForm
            singular={config.singular}
            categories={config.categories}
            descriptionPlaceholder={config.descriptionPlaceholder}
            selectedContactId={selectedContactId}
            saving={saving}
            onContactChange={setSelectedContactId}
            onSubmit={(values, clear) => setPendingSave({ values, clear })}
          />
        }
      />

      <ConfirmationDialog
        open={Boolean(pendingSave)}
        title={`Save this ${config.singular.toLowerCase()}?`}
        description={`Please confirm the ${config.singular.toLowerCase()} details before adding this record.`}
        confirmText={`Save ${config.singular}`}
        variant="primary"
        loading={saving}
        onConfirm={saveTransaction}
        onCancel={() => !saving && setPendingSave(null)}
      />

      <ConfirmationDialog
        open={pendingDeleteIds.length > 0}
        title={`Delete ${config.singular.toLowerCase()} records?`}
        description={`You are about to delete ${pendingDeleteIds.length} ${
          pendingDeleteIds.length === 1
            ? config.singular.toLowerCase()
            : config.plural.toLowerCase()
        }. This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={deleteTransactions}
        onCancel={() => !deleting && setPendingDeleteIds([])}
      />
    </div>
  );
};

export default TransactionWorkspace;
