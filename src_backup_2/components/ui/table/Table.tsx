"use client";

import { forwardRef } from "react";

import { cn } from "@/src/lib/utils";

import type {
  TableCellProps,
  TableContainerProps,
  TableEmptyStateProps,
  TableHeadProps,
  TableProps,
  TableRowProps,
  TableSectionProps,
} from "./types";

const densityClasses = {
  dense: [
    "[&_thead_tr]:h-8 [&_thead_th]:!px-2.5 [&_thead_th]:!py-1.5",
    "[&_tbody_tr]:h-8 [&_tbody_td]:!px-2.5 [&_tbody_td]:!py-0",
  ],
  compact: [
    "[&_thead_tr]:h-9 [&_thead_th]:!px-3 [&_thead_th]:!py-2",
    "[&_tbody_tr]:h-9 [&_tbody_td]:!px-3 [&_tbody_td]:!py-0",
  ],
  comfortable: [
    "[&_thead_th]:!px-4 [&_thead_th]:!py-3.5",
    "[&_tbody_tr]:h-12 [&_tbody_td]:!px-4 [&_tbody_td]:!py-3.5",
  ],
};

const stickyHeaderClasses = {
  left: [
    "sticky left-0 z-30 bg-slate-50",
    "shadow-[8px_0_12px_-12px_rgba(15,23,42,0.35)]",
  ],
  right: [
    "sticky right-0 z-30 bg-slate-50",
    "shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.35)]",
  ],
};

const stickyBodyClasses = {
  left: [
    "sticky left-0 z-10",
    "shadow-[8px_0_12px_-12px_rgba(15,23,42,0.35)]",
  ],
  right: [
    "sticky right-0 z-10",
    "shadow-[-8px_0_12px_-12px_rgba(15,23,42,0.35)]",
  ],
};

/**
 * Shared viewport for every list table. Horizontal overflow stays disabled by
 * default; dense rows keep a complete ten-record page visible without an
 * inner scrollbar on standard laptop viewports.
 */
export const TableContainer = forwardRef<HTMLDivElement, TableContainerProps>(
  (
    {
      children,
      density = "compact",
      viewportClassName,
      allowHorizontalScroll = false,
      className,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white",
        densityClasses[density],
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full min-h-0 overscroll-contain",
          allowHorizontalScroll
            ? "overflow-auto"
            : "overflow-x-hidden overflow-y-auto",
          viewportClassName,
        )}
      >
        {children}
      </div>
    </div>
  ),
);

TableContainer.displayName = "TableContainer";

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <table
      ref={ref}
      className={cn(
        "w-full min-w-0 table-fixed border-collapse text-left text-xs",
        className,
      )}
      {...props}
    />
  ),
);

Table.displayName = "Table";

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  TableSectionProps
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "sticky top-0 z-20 bg-slate-50 text-slate-600",
      className,
    )}
    {...props}
  />
));

TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef<HTMLTableSectionElement, TableSectionProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("text-slate-600", className)} {...props} />
  ),
);

TableBody.displayName = "TableBody";

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    { selected = false, hoverable = false, className, ...props },
    ref,
  ) => (
    <tr
      ref={ref}
      className={cn(
        "group border-b border-slate-100 transition-colors last:border-0",
        selected && "bg-primary/[0.04]",
        hoverable && !selected && "hover:bg-primary/[0.025]",
        className,
      )}
      {...props}
    />
  ),
);

TableRow.displayName = "TableRow";

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ sticky, className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "min-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-3 font-semibold",
        sticky && stickyHeaderClasses[sticky],
        className,
      )}
      {...props}
    />
  ),
);

TableHead.displayName = "TableHead";

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ sticky, selected = false, className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "min-w-0 overflow-hidden text-ellipsis whitespace-nowrap px-3",
        sticky && stickyBodyClasses[sticky],
        sticky &&
          (selected
            ? "bg-primary-surface"
            : "bg-white group-hover:bg-[#fcfcff]"),
        className,
      )}
      {...props}
    />
  ),
);

TableCell.displayName = "TableCell";

export const TableEmptyState = ({
  title,
  description,
  className,
  ...props
}: TableEmptyStateProps) => (
  <div
    className={cn(
      "flex min-h-48 items-center justify-center px-6 text-center",
      className,
    )}
    {...props}
  >
    <div>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      )}
    </div>
  </div>
);
