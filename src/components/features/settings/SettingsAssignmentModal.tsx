"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleMinus,
  ListChecks,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";

import { ListCheckbox } from "@/src/components/page/list";
import { SplitModal } from "@/src/components/templates";
import { Button } from "@/src/components/ui";

import type { SettingsAssignmentItem } from "./types";

interface SettingsAssignmentModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  subject: string | null;
  subjectType: "user" | "menu";
  itemLabel: "menu" | "field";
  items: SettingsAssignmentItem[];
  saving?: boolean;
  onClose: () => void;
  onAssign: (itemIds: string[]) => void;
  onRemove: (itemId: string) => void;
}

interface AssignmentGroup {
  name: string;
  items: SettingsAssignmentItem[];
}

const groupItems = (items: SettingsAssignmentItem[]): AssignmentGroup[] => {
  const groups = new Map<string, SettingsAssignmentItem[]>();

  items.forEach((item) => {
    const groupName = item.group ?? "";
    const group = groups.get(groupName) ?? [];
    group.push(item);
    groups.set(groupName, group);
  });

  return Array.from(groups, ([name, group]) => ({ name, items: group }));
};

const SettingsAssignmentModal = ({
  open,
  title,
  subtitle,
  subject,
  subjectType,
  itemLabel,
  items,
  saving = false,
  onClose,
  onAssign,
  onRemove,
}: SettingsAssignmentModalProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const assignedItems = useMemo(
    () => items.filter((item) => item.assigned),
    [items],
  );
  const unassignedItems = useMemo(
    () => items.filter((item) => !item.assigned),
    [items],
  );
  const assignedGroups = useMemo(
    () => groupItems(assignedItems),
    [assignedItems],
  );
  const unassignedGroups = useMemo(
    () => groupItems(unassignedItems),
    [unassignedItems],
  );

  useEffect(() => {
    if (!open) return;
    setSelectedIds([]);
  }, [open, subject]);

  useEffect(() => {
    const availableIds = new Set(unassignedItems.map((item) => item.id));
    setSelectedIds((current) =>
      current.filter((itemId) => availableIds.has(itemId)),
    );
  }, [unassignedItems]);

  const toggleItem = (itemId: string) => {
    setSelectedIds((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId],
    );
  };

  const assignSelected = () => {
    if (!selectedIds.length) return;
    onAssign(selectedIds);
  };

  const SubjectIcon = subjectType === "user" ? UserRound : ListChecks;
  const pluralLabel = itemLabel === "menu" ? "menus" : "fields";

  const renderDetails = (details?: readonly string[]) => {
    if (!details?.length) return null;

    return (
      <div className="mt-2 flex flex-wrap gap-1.5">
        {details.map((detail) => (
          <span
            key={detail}
            className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-500"
          >
            {detail}
          </span>
        ))}
      </div>
    );
  };

  return (
    <SplitModal
      open={open}
      title={title}
      subtitle={subtitle}
      leftTitle={`Assigned ${pluralLabel} · ${assignedItems.length}`}
      rightTitle={`Unassigned ${pluralLabel} · ${unassignedItems.length}`}
      onClose={onClose}
      left={
        <div className="flex h-full min-h-0 flex-col gap-4">
          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <SubjectIcon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {subject ?? "Selected item"}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {assignedItems.length} assigned · {unassignedItems.length}{" "}
                unassigned
              </p>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">
              {assignedItems.length} assigned
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white">
            {assignedGroups.map((group) => (
              <div key={group.name || "assigned"}>
                {group.name && (
                  <div className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
                    <p className="text-xs font-semibold text-slate-700">
                      {group.name}
                    </p>
                  </div>
                )}

                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex min-h-14 items-start gap-3 border-b border-slate-100 px-4 py-3 transition last:border-0 hover:bg-green-50/40"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {item.label}
                      </p>
                      {item.description && (
                        <p className="mt-0.5 text-xs leading-5 text-slate-500">
                          {item.description}
                        </p>
                      )}
                      {renderDetails(item.details)}
                    </div>
                    <Button unstyled
                      type="button"
                      aria-label={`Remove ${item.label}`}
                      title={`Remove ${item.label}`}
                      disabled={saving}
                      onClick={() => onRemove(item.id)}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ))}

            {assignedItems.length === 0 && (
              <div className="flex min-h-56 flex-col items-center justify-center px-6 py-8 text-center">
                <ShieldCheck className="mb-3 h-9 w-9 text-slate-300" />
                <p className="text-sm font-semibold text-slate-700">
                  No assigned {pluralLabel}
                </p>
                <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                  Select the required {pluralLabel} from the right side and
                  assign them here.
                </p>
              </div>
            )}
          </div>
        </div>
      }
      right={
        <div className="flex min-h-full flex-col gap-4">
          <div className="flex shrink-0 items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50/60 px-4 py-3">
            <div>
              <p className="text-xs font-semibold text-slate-700">
                Available {pluralLabel}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Select one or more {pluralLabel} to assign
              </p>
            </div>
            <span className="rounded-full bg-red-100 px-3 py-1 text-[11px] font-semibold text-red-700">
              {unassignedItems.length} unassigned
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-slate-200 bg-white">
            {unassignedGroups.map((group) => (
              <div key={group.name || "unassigned"}>
                {group.name && (
                  <div className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
                    <p className="text-xs font-semibold text-slate-700">
                      {group.name}
                    </p>
                  </div>
                )}

                {group.items.map((item) => {
                  const checked = selectedIds.includes(item.id);

                  return (
                    <label
                      key={item.id}
                      className={`flex min-h-14 cursor-pointer items-start gap-3 border-b border-slate-100 px-4 py-3 transition last:border-0 ${
                        checked
                          ? "bg-primary/[0.05]"
                          : "hover:bg-red-50/35"
                      }`}
                    >
                      <span className="mt-1">
                        <ListCheckbox
                          label={`Assign ${item.label}`}
                          checked={checked}
                          onChange={() => toggleItem(item.id)}
                        />
                      </span>
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                        <CircleMinus className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {item.label}
                        </p>
                        {item.description && (
                          <p className="mt-0.5 text-xs leading-5 text-slate-500">
                            {item.description}
                          </p>
                        )}
                        {renderDetails(item.details)}
                      </div>
                      {checked && (
                        <CheckCircle2 className="mt-2 h-4 w-4 shrink-0 text-primary" />
                      )}
                    </label>
                  );
                })}
              </div>
            ))}

            {unassignedItems.length === 0 && (
              <div className="flex min-h-56 flex-col items-center justify-center px-6 py-8 text-center">
                <CheckCircle2 className="mb-3 h-9 w-9 text-green-500" />
                <p className="text-sm font-semibold text-slate-700">
                  Everything is assigned
                </p>
                <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                  There are no remaining {pluralLabel} to assign.
                </p>
              </div>
            )}
          </div>

          <div className="mt-auto flex shrink-0 items-center justify-end gap-2 border-t border-slate-200 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={saving}
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              loading={saving}
              disabled={!selectedIds.length}
              onClick={assignSelected}
            >
              Assign Selected
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default SettingsAssignmentModal;
