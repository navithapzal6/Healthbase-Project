"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { ConfirmationDialog, toast } from "@/src/components/ui";
import { ListBulkActions, Pagination } from "@/src/components/page/list";
import { SplitModal } from "@/src/components/templates";
import { paymentModes } from "./data";
import PaymentEntryForm from "./PaymentEntryForm";
import PaymentTable from "./PaymentTable";
import { transactionService } from "./service";
import { transactionConfigs } from "./moduleConfig";
import type { TransactionModule } from "./moduleConfig";
import type { PaymentFormValues, PaymentRecord } from "./types";

interface PendingSave {
  values: PaymentFormValues;
  clear: () => void;
}

interface PaymentWorkspaceProps {
  module?: TransactionModule;
}

const PaymentWorkspace = ({ module = "payment" }: PaymentWorkspaceProps) => {
  const config = transactionConfigs[module];
  const ModuleIcon = config.icon;
  const [records, setRecords] = useState<PaymentRecord[]>(() => [
    ...config.initialRecords,
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pendingSave, setPendingSave] = useState<PendingSave | null>(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    setRecords([...transactionConfigs[module].initialRecords]);
    setSelectedIds([]);
    setPage(1);

    transactionService.list(module).then((data) => {
      if (active) setRecords(data);
    });

    return () => {
      active = false;
    };
  }, [module]);

  useEffect(() => {
    const recordIds = new Set(records.map((record) => record.id));
    setSelectedIds((current) => current.filter((id) => recordIds.has(id)));
  }, [records]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return records.filter(
      (record) =>
        (!term ||
          `${record.contactName} ${record.category} ${record.description} ${record.paymentMode}`
            .toLowerCase()
            .includes(term)) &&
        (!mode || record.paymentMode === mode),
    );
  }, [mode, records, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRecords = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const contactHistory = useMemo(
    () => records.filter((record) => record.contactId === selectedContactId),
    [records, selectedContactId],
  );
  const selectedRecord = records.find((record) =>
    selectedIds.includes(record.id),
  );

  useEffect(() => setPage(1), [search, mode, pageSize]);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const saveTransaction = async () => {
    if (!pendingSave) return;
    setSaving(true);

    try {
      const { values, clear } = pendingSave;
      const created = await transactionService.create(module, {
        date: values.date,
        contactId: values.contactId,
        category: values.category,
        paymentMode: values.paymentMode as PaymentRecord["paymentMode"],
        description: values.description.trim(),
        amount: Number(values.amount),
      });

      setRecords((current) => [created, ...current]);
      clear();
      setPendingSave(null);
      toast.success({
        title: `${config.singular} saved`,
        description: `${created.contactName} ${config.singular.toLowerCase()} was added successfully.`,
      });
    } catch (error) {
      toast.error({
        title: "Unable to save",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const editTransaction = (record: PaymentRecord) => {
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
    await new Promise((resolve) => setTimeout(resolve, 300));

    setRecords((current) =>
      current.filter((record) => !pendingDeleteIds.includes(record.id)),
    );
    setSelectedIds((current) =>
      current.filter((id) => !pendingDeleteIds.includes(id)),
    );

    toast.success({
      title: `${config.singular} deleted`,
      description: `${pendingDeleteIds.length} ${
        pendingDeleteIds.length === 1
          ? config.singular.toLowerCase()
          : config.plural.toLowerCase()
      } removed.`,
    });

    setPendingDeleteIds([]);
    setDeleting(false);
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
            {filtered.length} of {records.length}{" "}
            {config.singular.toLowerCase()} records
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${config.plural.toLowerCase()}...`}
              className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value)}
            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary"
          >
            <option value="">All modes</option>
            {paymentModes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-white shadow-sm transition hover:bg-primary/85"
          >
            <Plus className="h-4 w-4" />
            New {config.singular}
          </button>
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
        <PaymentTable
          records={pageRecords}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onEdit={editTransaction}
          onDelete={setPendingDeleteIds}
        />
      </div>
      <div className="shrink-0 pt-3">
        <Pagination
          page={currentPage}
          pageSize={pageSize}
          totalItems={filtered.length}
          pageSizeOptions={[10, 20, 50]}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      <SplitModal
        open={modalOpen}
        title={`New ${config.singular}`}
        subtitle={config.modalSubtitle}
        leftTitle={
          selectedContactId
            ? `${config.singular} History · ${contactHistory.length} records`
            : `${config.singular} History`
        }
        rightTitle={`${config.singular} Entry`}
        onClose={() => {
          if (!saving) setModalOpen(false);
        }}
        left={
          selectedContactId ? (
            <PaymentTable records={contactHistory} hideContact compact />
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
          <PaymentEntryForm
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

export default PaymentWorkspace;
