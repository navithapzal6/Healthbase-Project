"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  memoryCache,
  sessionCache,
  type CacheAdapter,
} from "@/src/core/cache";

import type {
  ChunkedListCacheValue,
  ChunkedListState,
  UseChunkedListOptions,
} from "./types";
import { useDebouncedValue } from "./use-debounced-value";

const DEFAULT_CHUNK_SIZE = 10;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

const noCache: CacheAdapter = {
  get: () => null,
  set: () => undefined,
  remove: () => undefined,
  clearScope: () => undefined,
  clear: () => undefined,
};

const cacheFor = (policy: UseChunkedListOptions<unknown>["cachePolicy"]) => {
  if (policy === "session") return sessionCache;
  if (policy === "none") return noCache;
  return memoryCache;
};

const stableSerialize = (value: unknown) => {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const pageCapacityFor = (
  pageStart: number,
  pageSize: number,
  totalItems: number,
) => Math.max(0, Math.min(pageSize, totalItems - pageStart));

const uniqueItems = <TItem,>(
  items: readonly TItem[],
  getItemKey?: (item: TItem) => string | number,
) => {
  if (!getItemKey) return [...items];

  const seen = new Set<string | number>();
  return items.filter((item) => {
    const key = getItemKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const mergeUniqueItems = <TItem,>(
  currentItems: readonly TItem[],
  incomingItems: readonly TItem[],
  getItemKey?: (item: TItem) => string | number,
) => {
  if (!getItemKey) return [...currentItems, ...incomingItems];

  const seen = new Set(currentItems.map(getItemKey));
  const uniqueIncoming = incomingItems.filter((item) => {
    const key = getItemKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return [...currentItems, ...uniqueIncoming];
};

export const useChunkedList = <
  TItem,
  TFilters = Record<string, never>,
>({
  cacheKey,
  fetchChunk,
  paginationMode = "offset",
  search = "",
  sortBy = "",
  sortDirection = "asc",
  filters = {} as TFilters,
  chunkSize = DEFAULT_CHUNK_SIZE,
  searchDebounceMs = 250,
  initialPage = 1,
  initialPageSize = DEFAULT_PAGE_SIZE,
  cachePolicy = "memory",
  cacheTtlMs = DEFAULT_CACHE_TTL,
  enabled = true,
  sourceVersion,
  getItemKey,
}: UseChunkedListOptions<TItem, TFilters>): ChunkedListState<TItem> => {
  const fetcherRef = useRef(fetchChunk);
  const filtersRef = useRef(filters);
  const getItemKeyRef = useRef(getItemKey);
  const requestNumber = useRef(0);
  const activeController = useRef<AbortController | null>(null);
  const loadingMoreRef = useRef(false);
  const itemsRef = useRef<TItem[]>([]);
  const totalItemsRef = useRef(0);
  const nextCursorRef = useRef<string | null>(null);
  const hasMoreAvailableRef = useRef(false);
  const criteriaKeyRef = useRef("");
  const cursorScopeRef = useRef("");
  const pageCursorsRef = useRef<Map<number, string | null>>(
    new Map([[1, null]]),
  );

  const [items, setItems] = useState<TItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPageState] = useState(
    paginationMode === "cursor" ? 1 : Math.max(1, initialPage),
  );
  const [pageSize, setPageSizeState] = useState(
    Math.max(1, initialPageSize),
  );
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMoreAvailable, setHasMoreAvailable] = useState(false);
  const [loading, setLoading] = useState(enabled);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  fetcherRef.current = fetchChunk;
  filtersRef.current = filters;
  getItemKeyRef.current = getItemKey;

  const normalizedChunkSize = Math.max(1, chunkSize);
  const debouncedSearch = useDebouncedValue(search, searchDebounceMs);
  const pageStart = (page - 1) * pageSize;
  const filtersKey = stableSerialize(filters);
  const cursorScopeKey = useMemo(
    () =>
      [
        cacheKey,
        `mode=${paginationMode}`,
        `search=${debouncedSearch.trim()}`,
        `sort=${sortBy}:${sortDirection}`,
        `filters=${filtersKey}`,
        `pageSize=${pageSize}`,
        `source=${String(sourceVersion ?? "")}`,
      ].join(":"),
    [
      cacheKey,
      debouncedSearch,
      filtersKey,
      pageSize,
      paginationMode,
      sortBy,
      sortDirection,
      sourceVersion,
    ],
  );
  const criteriaKey = useMemo(
    () => `${cursorScopeKey}:page=${page}`,
    [cursorScopeKey, page],
  );
  criteriaKeyRef.current = criteriaKey;
  const cache = cacheFor(cachePolicy);

  const saveCache = useCallback(
    (value: ChunkedListCacheValue<TItem>) => {
      cache.set(criteriaKey, value, cacheTtlMs);
    },
    [cache, cacheTtlMs, criteriaKey],
  );

  const rememberNextPageCursor = useCallback(
    (
      currentPage: number,
      currentPageStart: number,
      currentPageSize: number,
      loadedItems: number,
      knownTotal: number,
      cursor: string | null,
      hasMore: boolean,
    ) => {
      if (paginationMode !== "cursor") return;

      const capacity = pageCapacityFor(
        currentPageStart,
        currentPageSize,
        knownTotal,
      );
      if (
        capacity > 0 &&
        loadedItems >= capacity &&
        hasMore &&
        cursor
      ) {
        pageCursorsRef.current.set(currentPage + 1, cursor);
      } else {
        pageCursorsRef.current.delete(currentPage + 1);
      }
    },
    [paginationMode],
  );

  useEffect(() => {
    if (paginationMode !== "cursor") return;
    if (cursorScopeRef.current === cursorScopeKey) return;

    cursorScopeRef.current = cursorScopeKey;
    pageCursorsRef.current = new Map([[1, null]]);
    nextCursorRef.current = null;
    hasMoreAvailableRef.current = false;
    setNextCursor(null);
    setHasMoreAvailable(false);
    if (page !== 1) setPageState(1);
  }, [cursorScopeKey, page, paginationMode]);

  useEffect(() => {
    if (!enabled) {
      activeController.current?.abort();
      itemsRef.current = [];
      totalItemsRef.current = 0;
      nextCursorRef.current = null;
      hasMoreAvailableRef.current = false;
      setItems([]);
      setTotalItems(0);
      setNextCursor(null);
      setHasMoreAvailable(false);
      setLoading(false);
      setLoadingMore(false);
      setError("");
      return;
    }

    const pageCursor =
      paginationMode === "cursor"
        ? pageCursorsRef.current.get(page)
        : undefined;

    if (
      paginationMode === "cursor" &&
      page > 1 &&
      pageCursor === undefined
    ) {
      setLoading(false);
      return;
    }

    const currentRequest = ++requestNumber.current;
    activeController.current?.abort();

    let cached = cache.get<ChunkedListCacheValue<TItem>>(criteriaKey);

    if (cached) {
      const cachedItems = uniqueItems(
        cached.items,
        getItemKeyRef.current,
      );

      if (cachedItems.length !== cached.items.length) {
        cache.remove(criteriaKey);
        cached = null;
      }
    }

    if (cached) {
      const cachedItems = cached.items;
      const cachedHasMore =
        cached.hasMore ??
        pageStart + cachedItems.length < cached.totalItems;
      const cachedCursor = cached.nextCursor ?? null;

      itemsRef.current = cachedItems;
      totalItemsRef.current = cached.totalItems;
      nextCursorRef.current = cachedCursor;
      hasMoreAvailableRef.current = cachedHasMore;
      setItems(cachedItems);
      setTotalItems(cached.totalItems);
      setNextCursor(cachedCursor);
      setHasMoreAvailable(cachedHasMore);
      setLoading(false);
      setLoadingMore(false);
      setError("");
      rememberNextPageCursor(
        page,
        pageStart,
        pageSize,
        cachedItems.length,
        cached.totalItems,
        cachedCursor,
        cachedHasMore,
      );
      return;
    }

    const controller = new AbortController();
    activeController.current = controller;
    itemsRef.current = [];
    setItems([]);
    if (paginationMode === "offset" || page === 1) {
      totalItemsRef.current = 0;
      setTotalItems(0);
    }
    nextCursorRef.current = null;
    hasMoreAvailableRef.current = false;
    setNextCursor(null);
    setHasMoreAvailable(false);
    setLoading(true);
    setLoadingMore(false);
    setError("");

    void fetcherRef
      .current({
        offset: pageStart,
        limit: Math.min(normalizedChunkSize, pageSize),
        cursor:
          paginationMode === "cursor" ? (pageCursor ?? null) : undefined,
        includeTotal:
          paginationMode === "cursor"
            ? page === 1 && pageCursor === null
            : undefined,
        search: debouncedSearch,
        sortBy,
        sortDirection,
        filters: filtersRef.current,
        signal: controller.signal,
      })
      .then((result) => {
        if (
          controller.signal.aborted ||
          currentRequest !== requestNumber.current
        ) {
          return;
        }

        const resultItems = uniqueItems(
          result.items,
          getItemKeyRef.current,
        );
        const fallbackTotal =
          pageStart +
          resultItems.length +
          (result.hasMore ? 1 : 0);
        const resolvedTotal =
          result.totalItems ??
          Math.max(totalItemsRef.current, fallbackTotal);
        const resolvedHasMore =
          resultItems.length > 0 &&
          (result.hasMore ??
            pageStart + resultItems.length < resolvedTotal);
        const resolvedCursor = result.nextCursor ?? null;
        const cacheValue: ChunkedListCacheValue<TItem> = {
          items: resultItems,
          totalItems: resolvedTotal,
          nextCursor: resolvedCursor,
          hasMore: resolvedHasMore,
        };

        itemsRef.current = resultItems;
        totalItemsRef.current = resolvedTotal;
        nextCursorRef.current = resolvedCursor;
        hasMoreAvailableRef.current = resolvedHasMore;
        setItems(resultItems);
        setTotalItems(resolvedTotal);
        setNextCursor(resolvedCursor);
        setHasMoreAvailable(resolvedHasMore);
        rememberNextPageCursor(
          page,
          pageStart,
          pageSize,
          resultItems.length,
          resolvedTotal,
          resolvedCursor,
          resolvedHasMore,
        );
        saveCache(cacheValue);
      })
      .catch((requestError: unknown) => {
        if (
          controller.signal.aborted ||
          (requestError instanceof DOMException &&
            requestError.name === "AbortError")
        ) {
          return;
        }

        if (currentRequest !== requestNumber.current) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load records.",
        );
      })
      .finally(() => {
        if (
          !controller.signal.aborted &&
          currentRequest === requestNumber.current
        ) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [
    cache,
    criteriaKey,
    debouncedSearch,
    enabled,
    normalizedChunkSize,
    page,
    pageSize,
    pageStart,
    paginationMode,
    rememberNextPageCursor,
    revision,
    saveCache,
    sortBy,
    sortDirection,
  ]);

  const pageCapacity = pageCapacityFor(pageStart, pageSize, totalItems);
  const canContinueCursor =
    paginationMode !== "cursor" ||
    (hasMoreAvailable && Boolean(nextCursor));
  const hasMoreInPage =
    enabled && items.length < pageCapacity && canContinueCursor;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const loadMore = useCallback(async () => {
    const currentItems = itemsRef.current;
    const currentTotal = totalItemsRef.current;
    const currentPageCapacity = pageCapacityFor(
      pageStart,
      pageSize,
      currentTotal,
    );
    const requestCursor = nextCursorRef.current;
    const canContinue =
      paginationMode !== "cursor" ||
      (hasMoreAvailableRef.current && Boolean(requestCursor));

    if (
      !enabled ||
      loading ||
      loadingMoreRef.current ||
      currentItems.length >= currentPageCapacity ||
      !canContinue
    ) {
      return;
    }

    const remaining = currentPageCapacity - currentItems.length;
    if (remaining <= 0) return;
    if (paginationMode === "cursor" && !requestCursor) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    setError("");

    const controller = new AbortController();
    activeController.current = controller;
    const requestCriteria = criteriaKeyRef.current;
    const requestVersion = requestNumber.current;

    try {
      const result = await fetcherRef.current({
        offset: pageStart + currentItems.length,
        limit: Math.min(normalizedChunkSize, remaining),
        cursor:
          paginationMode === "cursor" ? requestCursor : undefined,
        includeTotal:
          paginationMode === "cursor" ? false : undefined,
        search: debouncedSearch,
        sortBy,
        sortDirection,
        filters: filtersRef.current,
        signal: controller.signal,
      });

      if (
        controller.signal.aborted ||
        requestCriteria !== criteriaKeyRef.current ||
        requestVersion !== requestNumber.current
      ) {
        return;
      }

      const latestItems = itemsRef.current;
      const nextItems = mergeUniqueItems(
        latestItems,
        result.items,
        getItemKeyRef.current,
      );
      const addedItemCount = nextItems.length - latestItems.length;
      const fallbackTotal =
        pageStart +
        nextItems.length +
        (result.hasMore ? 1 : 0);
      const resolvedTotal =
        result.totalItems ??
          Math.max(totalItemsRef.current, fallbackTotal);
      let resolvedHasMore =
        addedItemCount > 0 &&
        (result.hasMore ??
          pageStart + nextItems.length < resolvedTotal);
      let resolvedCursor = result.nextCursor ?? null;

      if (
        paginationMode === "cursor" &&
        resolvedHasMore &&
        (!resolvedCursor || resolvedCursor === requestCursor)
      ) {
        resolvedHasMore = false;
        resolvedCursor = null;
      }

      itemsRef.current = nextItems;
      totalItemsRef.current = resolvedTotal;
      nextCursorRef.current = resolvedCursor;
      hasMoreAvailableRef.current = resolvedHasMore;
      setItems(nextItems);
      setTotalItems(resolvedTotal);
      setNextCursor(resolvedCursor);
      setHasMoreAvailable(resolvedHasMore);
      rememberNextPageCursor(
        page,
        pageStart,
        pageSize,
        nextItems.length,
        resolvedTotal,
        resolvedCursor,
        resolvedHasMore,
      );
      saveCache({
        items: nextItems,
        totalItems: resolvedTotal,
        nextCursor: resolvedCursor,
        hasMore: resolvedHasMore,
      });
    } catch (requestError) {
      if (
        controller.signal.aborted ||
        (requestError instanceof DOMException &&
          requestError.name === "AbortError")
      ) {
        return;
      }

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load more records.",
      );
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [
    debouncedSearch,
    enabled,
    loading,
    normalizedChunkSize,
    page,
    pageSize,
    pageStart,
    paginationMode,
    rememberNextPageCursor,
    saveCache,
    sortBy,
    sortDirection,
  ]);

  const setPage = useCallback(
    (nextPage: number) => {
      const normalizedPage = Math.max(1, nextPage);
      if (
        paginationMode === "cursor" &&
        normalizedPage > 1 &&
        !pageCursorsRef.current.has(normalizedPage)
      ) {
        return;
      }
      setPageState(normalizedPage);
    },
    [paginationMode],
  );

  const setPageSize = useCallback(
    (nextPageSize: number) => {
      if (paginationMode === "cursor") {
        pageCursorsRef.current = new Map([[1, null]]);
      }
      setPageSizeState(Math.max(1, nextPageSize));
      setPageState(1);
    },
    [paginationMode],
  );

  const refresh = useCallback(() => {
    cache.remove(criteriaKey);
    setRevision((current) => current + 1);
  }, [cache, criteriaKey]);

  const clearCache = useCallback(() => {
    cache.clearScope(cacheKey);
    setRevision((current) => current + 1);
  }, [cache, cacheKey]);

  return {
    items,
    page,
    pageSize,
    totalItems,
    totalPages,
    loading,
    loadingMore,
    hasMoreInPage,
    error,
    setPage,
    setPageSize,
    loadMore,
    refresh,
    clearCache,
  };
};
