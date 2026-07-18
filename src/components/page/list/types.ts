import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

export type { PaginationProps } from "../../ui/pagination/types";

export type ListSortDirection = "asc" | "desc";

export interface ListSortOption {
  label: string;
  value: string;
}

export interface ListPageProps {
  title: string;
  children: ReactNode;
  filterContent?: ReactNode;
  filterOpen?: boolean;
  filterCount?: number;
  selectedCount?: number;
  onFilterClose?: () => void;
  onFilterApply?: () => void;
  onFilterReset?: () => void;
  onBulkEdit?: () => void;
  onBulkDelete?: () => void;
}

export interface ListToolbarProps {
  showFilter?: boolean;
  showAdd?: boolean;
  addLabel?: string;
  filterOpen?: boolean;
  filterCount?: number;
  sortOptions?: ListSortOption[];
  sortValue?: string;
  sortDirection?: ListSortDirection;
  onFilter?: () => void;
  onAdd?: () => void;
  onSortChange?: (value: string, direction: ListSortDirection) => void;
}

export interface ListHeaderProps {
  title: string;
}

export interface ListContentProps {
  children: ReactNode;
}

export type ListTableDensity = "compact" | "comfortable";

export interface ListTableProps {
  children: ReactNode;
  density?: ListTableDensity;
  className?: string;
}

export interface ListFilterPanelProps {
  open: boolean;
  title?: string;
  children?: ReactNode;
  onClose?: () => void;
  onApply?: () => void;
  onReset?: () => void;
}

export interface ListBulkActionsProps {
  selectedCount: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface ListRowActionsProps {
  editLabel?: string;
  deleteLabel?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface ListCheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  indeterminate?: boolean;
  label: string;
}

export interface ListActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}
