import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import type { ListChunkFetcher } from "@/src/core/query";

export type TransactionPaymentMode =
  | "Cash"
  | "UPI"
  | "Bank Transfer"
  | "Cheque"
  | "Card";

export interface TransactionContact {
  id: string;
  name: string;
  reference: string;
}

export interface TransactionRecord {
  id: string;
  date: string;
  contactId: string;
  contactName: string;
  category: string;
  paymentMode: TransactionPaymentMode;
  description: string;
  amount: number;
}

export type NewTransactionPayload = Omit<
  TransactionRecord,
  "id" | "contactName"
>;

export interface TransactionFormValues {
  date: string;
  contactId: string;
  category: string;
  paymentMode: TransactionPaymentMode | "";
  description: string;
  amount: string;
}

export interface TransactionListFilters {
  paymentMode?: string;
  contactId?: string;
}

export interface TransactionConfig {
  singular: string;
  plural: string;
  prefix: string;
  icon: LucideIcon;
  categories: string[];
  paymentModes: TransactionPaymentMode[];
  loadingLabel: string;
  modalSubtitle: string;
  descriptionPlaceholder: string;
  initialRecords: TransactionRecord[];
}

export interface TransactionService {
  listChunk: ListChunkFetcher<TransactionRecord, TransactionListFilters>;
  listByContactChunk: ListChunkFetcher<
    TransactionRecord,
    TransactionListFilters
  >;
  create: (payload: NewTransactionPayload) => Promise<TransactionRecord>;
  remove: (recordIds: string[]) => Promise<number>;
}

export interface TransactionEntryFormProps {
  singular?: string;
  categories?: string[];
  descriptionPlaceholder?: string;
  selectedContactId: string;
  saving?: boolean;
  onContactChange: (contactId: string) => void;
  onSubmit: (values: TransactionFormValues, clear: () => void) => void;
}

export interface TransactionFormRendererProps
  extends TransactionEntryFormProps {
  contacts: TransactionContact[];
  paymentModes: TransactionPaymentMode[];
}

export interface TransactionTableProps {
  records: TransactionRecord[];
  selectedIds?: string[];
  hideContact?: boolean;
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  onEdit?: (record: TransactionRecord) => void;
  onDelete?: (recordIds: string[]) => void;
  onLoadMore?: () => void | Promise<void>;
}

export type TransactionEntryFormComponent =
  ComponentType<TransactionEntryFormProps>;
export type TransactionTableComponent = ComponentType<TransactionTableProps>;

export interface TransactionWorkspaceProps {
  config: TransactionConfig;
  service: TransactionService;
  EntryForm: TransactionEntryFormComponent;
  TableView: TransactionTableComponent;
}
