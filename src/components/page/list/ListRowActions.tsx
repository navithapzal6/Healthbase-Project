"use client";

import { Pencil, Trash2 } from "lucide-react";

import type { ListActionButtonProps, ListRowActionsProps } from "./types";

const ActionButton = ({
  label,
  children,
  className = "",
  ...props
}: ListActionButtonProps) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

const ListRowActions = ({
  editLabel = "Edit",
  deleteLabel = "Delete",
  onEdit,
  onDelete,
}: ListRowActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-1">
      {onEdit && (
        <ActionButton
          label={editLabel}
          onClick={onEdit}
          className="text-slate-500 hover:bg-primary/10 hover:text-primary"
        >
          <Pencil size={15} />
        </ActionButton>
      )}

      {onDelete && (
        <ActionButton
          label={deleteLabel}
          onClick={onDelete}
          className="text-slate-500 hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={15} />
        </ActionButton>
      )}
    </div>
  );
};

export default ListRowActions;
