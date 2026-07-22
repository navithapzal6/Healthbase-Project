import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

export type TableDensity = "dense" | "compact" | "comfortable";
export type TableStickySide = "left" | "right";

export interface TableContainerProps extends HTMLAttributes<HTMLDivElement> {
  density?: TableDensity;
  viewportClassName?: string;
  allowHorizontalScroll?: boolean;
}

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {}

export interface TableSectionProps
  extends HTMLAttributes<HTMLTableSectionElement> {}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  hoverable?: boolean;
}

export interface TableHeadProps
  extends ThHTMLAttributes<HTMLTableCellElement> {
  sticky?: TableStickySide;
}

export interface TableCellProps
  extends TdHTMLAttributes<HTMLTableCellElement> {
  sticky?: TableStickySide;
  selected?: boolean;
}

export interface TableEmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}
