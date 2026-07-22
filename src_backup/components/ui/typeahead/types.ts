export interface TypeaheadOption {
  value: string;
  label: string;
  description?: string;
}

export interface TypeaheadProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value: string;
  options: TypeaheadOption[];
  error?: string;
  disabled?: boolean;
  emptyMessage?: string;
  onChange: (value: string, option?: TypeaheadOption) => void;
}
