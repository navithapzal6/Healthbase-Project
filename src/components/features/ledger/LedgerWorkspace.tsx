"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

import { ConfirmationDialog, toast } from "@/src/components/ui";
import { logger } from "@/src/core/logger";

import { initialLedgerRecords, ledgerSections } from "./data";
import LedgerEntryForm from "./LedgerEntryForm";
import LedgerListPanel from "./LedgerListPanel";
import LedgerSectionNav from "./LedgerSectionNav";
import type {
  LedgerFormValues,
  LedgerRecord,
  LedgerSectionId,
} from "./types";

const isLedgerSection = (value: string | null): value is LedgerSectionId =>
  value === "unit" || value === "expense" || value === "bank";

const ledgerLogger = logger.child("ledger");

type PendingAction =
  | { type: "edit"; record: LedgerRecord }
  | { type: "delete"; recordIds: string[] }
  | null;

const LedgerWorkspace = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] =
    useState<LedgerSectionId>("unit");
  const [records, setRecords] = useState(initialLedgerRecords);
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const section = new URLSearchParams(window.location.search).get("section");

    if (isLedgerSection(section)) setActiveSection(section);
  }, []);

  const section = useMemo(
    () =>
      ledgerSections.find((item) => item.id === activeSection) ??
      ledgerSections[0],
    [activeSection],
  );

  const counts = useMemo(
    () => ({
      unit: records.unit.length,
      expense: records.expense.length,
      bank: records.bank.length,
    }),
    [records],
  );

  const changeSection = (nextSection: LedgerSectionId) => {
    setActiveSection(nextSection);
    router.replace(`/ledger?section=${nextSection}`, { scroll: false });
  };

  const saveLedger = (values: LedgerFormValues) => {
    const payload = {
      ledgerType: activeSection,
      ledgerName: values.ledgerName,
      description: values.description,
    };

    ledgerLogger.info("Ledger save requested", {
      ledgerType: payload.ledgerType,
      ledgerName: payload.ledgerName,
    });

    const newRecord: LedgerRecord = {
      id: `${activeSection}-${Date.now()}`,
      name: values.ledgerName,
      description: values.description,
      createdAt: "Just now",
    };

    setRecords((current) => ({
      ...current,
      [activeSection]: [newRecord, ...current[activeSection]],
    }));

    toast.success({
      title: `${section.label} Saved`,
      description: `${values.ledgerName} was added to the list.`,
    });
  };

  const confirmEditLedger = (record: LedgerRecord) => {
    ledgerLogger.debug("Ledger selected for edit", {
      ledgerType: activeSection,
      id: record.id,
    });
    toast.info({
      title: "Ledger Selected",
      description: `${record.name} is ready to edit.`,
    });
  };

  const confirmDeleteLedgers = (recordIds: string[]) => {
    ledgerLogger.info("Ledger records deleted", {
      ledgerType: activeSection,
      count: recordIds.length,
      ids: recordIds,
    });
    setRecords((current) => ({
      ...current,
      [activeSection]: current[activeSection].filter(
        (record) => !recordIds.includes(record.id),
      ),
    }));

    toast.success({
      title: "Ledger Deleted",
      description: `${recordIds.length} ${recordIds.length === 1 ? "record" : "records"} removed.`,
    });
  };

  const confirmPendingAction = async () => {
    if (!pendingAction) return;

    setActionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (pendingAction.type === "edit") {
      confirmEditLedger(pendingAction.record);
    } else {
      confirmDeleteLedgers(pendingAction.recordIds);
    }

    setPendingAction(null);
    setActionLoading(false);
  };

  const pendingEditName =
    pendingAction?.type === "edit" ? pendingAction.record.name : "";
  const pendingDeleteCount =
    pendingAction?.type === "delete" ? pendingAction.recordIds.length : 0;

  return (
    <div className="flex h-full min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <LedgerSectionNav
        activeSection={activeSection}
        counts={counts}
        collapsed={menuCollapsed}
        onToggle={() => setMenuCollapsed((current) => !current)}
        onChange={changeSection}
      />
      <div className="h-full min-w-[320px] flex-1">
        <LedgerListPanel
          section={section}
          records={records[activeSection]}
          onEdit={(record) => setPendingAction({ type: "edit", record })}
          onDelete={(recordIds) =>
            setPendingAction({ type: "delete", recordIds })
          }
        />
      </div>
      <div className="h-full w-[260px] shrink-0 xl:w-[280px]">
        <LedgerEntryForm section={section} onSave={saveLedger} />
      </div>

      <ConfirmationDialog
        open={pendingAction !== null}
        title={
          pendingAction?.type === "edit"
            ? "Edit this ledger?"
            : "Delete ledger records?"
        }
        description={
          pendingAction?.type === "edit"
            ? `You are about to edit ${pendingEditName}. Do you want to continue?`
            : `You are about to delete ${pendingDeleteCount} ${pendingDeleteCount === 1 ? "ledger" : "ledgers"}. This action cannot be undone.`
        }
        confirmText={pendingAction?.type === "edit" ? "Continue" : "Delete"}
        variant={pendingAction?.type === "edit" ? "primary" : "danger"}
        icon={pendingAction?.type === "edit" ? <Pencil size={24} /> : undefined}
        loading={actionLoading}
        onConfirm={confirmPendingAction}
        onCancel={() => !actionLoading && setPendingAction(null)}
      />
    </div>
  );
};

export default LedgerWorkspace;
