import type {
  ArrayListSourceOptions,
  ListChunkFetcher,
} from "./types";

const wait = (duration: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (duration <= 0) {
      resolve();
      return;
    }

    const timeout = window.setTimeout(resolve, duration);

    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeout);
        reject(new DOMException("Request aborted", "AbortError"));
      },
      { once: true },
    );
  });

export const createArrayListSource = <
  TItem,
  TFilters = Record<string, never>,
>({
  items,
  searchableText,
  compare,
  filter,
  delayMs = 0,
}: ArrayListSourceOptions<TItem, TFilters>): ListChunkFetcher<
  TItem,
  TFilters
> => {
  return async ({
    offset,
    limit,
    search,
    sortBy,
    sortDirection,
    filters,
    signal,
  }) => {
    await wait(delayMs, signal);

    const term = search.trim().toLowerCase();
    const filtered = items.filter(
      (item) =>
        (!term ||
          !searchableText ||
          searchableText(item).toLowerCase().includes(term)) &&
        (!filter || filter(item, filters)),
    );

    const sorted = compare
      ? [...filtered].sort((first, second) => {
          const result = compare(first, second, sortBy);
          return sortDirection === "asc" ? result : -result;
        })
      : filtered;

    return {
      items: sorted.slice(offset, offset + limit),
      totalItems: sorted.length,
    };
  };
};
