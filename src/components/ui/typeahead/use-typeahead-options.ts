"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  TypeaheadOption,
  TypeaheadOptionsLoader,
} from "./types";

interface UseTypeaheadOptionsParams {
  open: boolean;
  query: string;
  options: TypeaheadOption[];
  loadOptions?: TypeaheadOptionsLoader;
  pageSize: number;
  debounceMs: number;
  minimumQueryLength: number;
}

const uniqueOptions = (options: readonly TypeaheadOption[]) => {
  const values = new Set<string>();

  return options.filter((option) => {
    if (values.has(option.value)) return false;
    values.add(option.value);
    return true;
  });
};

export const useTypeaheadOptions = ({
  open,
  query,
  options,
  loadOptions,
  pageSize,
  debounceMs,
  minimumQueryLength,
}: UseTypeaheadOptionsParams) => {
  const normalizedPageSize = Math.max(1, pageSize);
  const normalizedQuery = query.trim();
  const queryAllowed =
    normalizedQuery.length >= Math.max(0, minimumQueryLength);

  const [visibleCount, setVisibleCount] = useState(normalizedPageSize);
  const [remoteOptions, setRemoteOptions] = useState<TypeaheadOption[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [remoteHasMore, setRemoteHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState("");

  const activeControllerRef = useRef<AbortController | null>(null);
  const requestNumberRef = useRef(0);
  const activeQueryRef = useRef(normalizedQuery);
  const loadedQueryRef = useRef<string | null>(null);
  const remoteOptionsRef = useRef<TypeaheadOption[]>([]);
  const nextCursorRef = useRef<string | null>(null);
  const remoteHasMoreRef = useRef(false);
  const loadingMoreRef = useRef(false);

  activeQueryRef.current = normalizedQuery;

  const localMatches = useMemo(() => {
    const term = normalizedQuery.toLowerCase();
    const deduplicated = uniqueOptions(options);

    if (!term) return deduplicated;

    return deduplicated.filter((option) =>
      `${option.label} ${option.description ?? ""}`
        .toLowerCase()
        .includes(term),
    );
  }, [normalizedQuery, options]);

  useEffect(() => {
    setVisibleCount(normalizedPageSize);
  }, [normalizedPageSize, normalizedQuery]);

  useEffect(() => {
    if (open) return;

    activeControllerRef.current?.abort();
    loadingMoreRef.current = false;
    setLoading(false);
    setLoadingMore(false);
  }, [open]);

  useEffect(() => {
    if (!loadOptions || !open) return;

    if (!queryAllowed) {
      activeControllerRef.current?.abort();
      remoteOptionsRef.current = [];
      nextCursorRef.current = null;
      remoteHasMoreRef.current = false;
      loadedQueryRef.current = null;
      setRemoteOptions([]);
      setNextCursor(null);
      setRemoteHasMore(false);
      setLoading(false);
      setLoadingMore(false);
      setLoadError("");
      return;
    }

    if (
      loadedQueryRef.current === normalizedQuery &&
      remoteOptionsRef.current.length > 0
    ) {
      return;
    }

    activeControllerRef.current?.abort();
    const controller = new AbortController();
    activeControllerRef.current = controller;
    const currentRequest = ++requestNumberRef.current;

    remoteOptionsRef.current = [];
    nextCursorRef.current = null;
    remoteHasMoreRef.current = false;
    setRemoteOptions([]);
    setNextCursor(null);
    setRemoteHasMore(false);
    setLoading(true);
    setLoadingMore(false);
    setLoadError("");

    const timeout = window.setTimeout(() => {
      void loadOptions({
        query: normalizedQuery,
        cursor: null,
        limit: normalizedPageSize,
        signal: controller.signal,
      })
        .then((result) => {
          if (
            controller.signal.aborted ||
            currentRequest !== requestNumberRef.current ||
            normalizedQuery !== activeQueryRef.current
          ) {
            return;
          }

          const firstOptions = uniqueOptions(result.options);
          const cursor = result.nextCursor ?? null;
          const hasMore =
            firstOptions.length > 0 &&
            result.hasMore &&
            Boolean(cursor);

          remoteOptionsRef.current = firstOptions;
          nextCursorRef.current = cursor;
          remoteHasMoreRef.current = hasMore;
          loadedQueryRef.current = normalizedQuery;
          setRemoteOptions(firstOptions);
          setNextCursor(cursor);
          setRemoteHasMore(hasMore);
        })
        .catch((requestError: unknown) => {
          if (
            controller.signal.aborted ||
            (requestError instanceof DOMException &&
              requestError.name === "AbortError")
          ) {
            return;
          }

          setLoadError(
            requestError instanceof Error
              ? requestError.message
              : "Unable to load options.",
          );
        })
        .finally(() => {
          if (
            !controller.signal.aborted &&
            currentRequest === requestNumberRef.current
          ) {
            setLoading(false);
          }
        });
    }, Math.max(0, debounceMs));

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [
    debounceMs,
    loadOptions,
    normalizedPageSize,
    normalizedQuery,
    open,
    queryAllowed,
  ]);

  const loadMore = useCallback(async () => {
    if (!loadOptions) {
      setVisibleCount((current) =>
        Math.min(current + normalizedPageSize, localMatches.length),
      );
      return;
    }

    const cursor = nextCursorRef.current;
    const requestQuery = activeQueryRef.current;

    if (
      loadingMoreRef.current ||
      !remoteHasMoreRef.current ||
      !cursor
    ) {
      return;
    }

    loadingMoreRef.current = true;
    setLoadingMore(true);
    setLoadError("");

    const controller = new AbortController();
    activeControllerRef.current = controller;

    try {
      const result = await loadOptions({
        query: requestQuery,
        cursor,
        limit: normalizedPageSize,
        signal: controller.signal,
      });

      if (
        controller.signal.aborted ||
        requestQuery !== activeQueryRef.current
      ) {
        return;
      }

      const mergedOptions = uniqueOptions([
        ...remoteOptionsRef.current,
        ...result.options,
      ]);
      const addedCount =
        mergedOptions.length - remoteOptionsRef.current.length;
      let resolvedCursor = result.nextCursor ?? null;
      let resolvedHasMore =
        addedCount > 0 && result.hasMore && Boolean(resolvedCursor);

      if (resolvedCursor === cursor) {
        resolvedCursor = null;
        resolvedHasMore = false;
      }

      remoteOptionsRef.current = mergedOptions;
      nextCursorRef.current = resolvedCursor;
      remoteHasMoreRef.current = resolvedHasMore;
      setRemoteOptions(mergedOptions);
      setNextCursor(resolvedCursor);
      setRemoteHasMore(resolvedHasMore);
    } catch (requestError) {
      if (
        controller.signal.aborted ||
        (requestError instanceof DOMException &&
          requestError.name === "AbortError")
      ) {
        return;
      }

      setLoadError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load more options.",
      );
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [loadOptions, localMatches.length, normalizedPageSize]);

  const displayedOptions = useMemo(
    () =>
      loadOptions
        ? remoteOptions
        : localMatches.slice(0, visibleCount),
    [loadOptions, localMatches, remoteOptions, visibleCount],
  );
  const hasMore = loadOptions
    ? remoteHasMore && Boolean(nextCursor)
    : visibleCount < localMatches.length;

  return {
    options: displayedOptions,
    hasMore,
    loading,
    loadingMore,
    loadError,
    loadMore,
  };
};
