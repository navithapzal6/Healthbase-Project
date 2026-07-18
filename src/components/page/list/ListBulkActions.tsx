"use client";

import { Pencil, Trash2 } from "lucide-react";

import type { ListBulkActionsProps } from "./types";

const ListBulkActions = ({
  selectedCount,
  onEdit,
  onDelete,
}: ListBulkActionsProps) => {
  if (selectedCount < 1) return null;

  return (
    <div className="mb-3 flex min-h-11 flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/15 bg-primary/[0.04] px-4 py-2">
      <p className="text-sm font-medium text-slate-700">
        <span className="text-primary">{selectedCount}</span>{" "}
        {selectedCount === 1 ? "contact" : "contacts"} selected
      </p>

      <div className="flex items-center gap-2">
        {selectedCount === 1 && onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-8 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:border-primary/30 hover:text-primary"
          >
            <Pencil size={14} />
            Edit
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-8 items-center gap-2 rounded-lg border border-red-100 bg-white px-3 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 size={14} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ListBulkActions;
