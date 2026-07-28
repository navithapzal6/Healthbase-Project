import type { CachePolicy } from "@/src/core/cache";

export type QueryPrimitive = string | number | boolean | null | undefined;
export type ListSortDirection = "asc" | "desc";
export type ListPaginationMode = "offset" | "cursor";

export interface ListChunkRequest<TFilters = Record<string, never>> {
  offset: number;
  limit: number;
  cursor?: string | null;
  includeTotal?: boolean;
  search: string;
  sortBy: string;
  sortDirection: ListSortDirection;
  filters: TFilters;
  signal: AbortSignal;
}

export interface ListChunkResult<TItem> {
  items: TItem[];
  totalItems?: number;
  nextCursor?: string | null;
  hasMore?: boolean;
}

export type ListChunkFetcher<TItem, TFilters = Record<string, never>> = (
  request: ListChunkRequest<TFilters>,
) => Promise<ListChunkResult<TItem>>;

export interface ChunkedListCacheValue<TItem> {
  items: TItem[];
  totalItems: number;
  nextCursor?: string | null;
  hasMore?: boolean;
}

export interface UseChunkedListOptions<
  TItem,
  TFilters = Record<string, never>,
> {
  cacheKey: string;
  fetchChunk: ListChunkFetcher<TItem, TFilters>;
  paginationMode?: ListPaginationMode;
  search?: string;
  sortBy?: string;
  sortDirection?: ListSortDirection;
  filters?: TFilters;
  chunkSize?: number;
  searchDebounceMs?: number;
  initialPage?: number;
  initialPageSize?: number;
  cachePolicy?: CachePolicy;
  cacheTtlMs?: number;
  enabled?: boolean;
  sourceVersion?: QueryPrimitive;
  getItemKey?: (item: TItem) => string | number;
}

export interface ChunkedListState<TItem> {
  items: TItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  loading: boolean;
  loadingMore: boolean;
  hasMoreInPage: boolean;
  error: string;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  loadMore: () => Promise<void>;
  refresh: () => void;
  clearCache: () => void;
}

export interface ArrayListSourceOptions<TItem, TFilters> {
  items: readonly TItem[];
  searchableText?: (item: TItem) => string;
  compare?: (
    first: TItem,
    second: TItem,
    sortBy: string,
  ) => number;
  filter?: (item: TItem, filters: TFilters) => boolean;
  delayMs?: number;
}
