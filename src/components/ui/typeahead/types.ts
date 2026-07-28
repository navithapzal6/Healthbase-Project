export interface TypeaheadOption {
  value: string;
  label: string;
  description?: string;
}

export interface TypeaheadLoadRequest {
  query: string;
  cursor?: string | null;
  limit: number;
  signal: AbortSignal;
}

export interface TypeaheadLoadResult {
  options: TypeaheadOption[];
  nextCursor?: string | null;
  hasMore: boolean;
}

export type TypeaheadOptionsLoader = (
  request: TypeaheadLoadRequest,
) => Promise<TypeaheadLoadResult>;

export interface TypeaheadProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value: string;
  options?: TypeaheadOption[];
  error?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingMessage?: string;
  loadingMoreMessage?: string;
  minimumQueryLength?: number;
  emptyMessage?: string;
  pageSize?: number;
  debounceMs?: number;
  loadOptions?: TypeaheadOptionsLoader;
  onSearch?: (query: string) => void;
  onChange: (value: string, option?: TypeaheadOption) => void;
}
