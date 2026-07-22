export type LedgerSectionId = "unit" | "expense" | "bank";

export interface LedgerRecord {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface LedgerSection {
  id: LedgerSectionId;
  label: string;
  description: string;
}

export interface LedgerFormValues {
  ledgerName: string;
  description: string;
}

export interface LedgerSectionNavProps {
  activeSection: LedgerSectionId;
  counts: Record<LedgerSectionId, number>;
  collapsed?: boolean;
  onToggle?: () => void;
  onChange: (section: LedgerSectionId) => void;
}

export interface LedgerListPanelProps {
  section: LedgerSection;
  records: LedgerRecord[];
  onEdit: (record: LedgerRecord) => void;
  onDelete: (recordIds: string[]) => void;
}

export interface LedgerEntryFormProps {
  section: LedgerSection;
  onSave: (values: LedgerFormValues) => void;
}
