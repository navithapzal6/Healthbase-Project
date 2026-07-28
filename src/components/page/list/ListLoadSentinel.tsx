"use client";

import { useEffect, useRef } from "react";

import { Loader } from "@/src/components/ui";

interface ListLoadSentinelProps {
  hasMore: boolean;
  loading?: boolean;
  label?: string;
  onLoadMore: () => void | Promise<void>;
}

const ListLoadSentinel = ({
  hasMore,
  loading = false,
  label = "Loading more records...",
  onLoadMore,
}: ListLoadSentinelProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const onLoadMoreRef = useRef(onLoadMore);
  const requestInProgressRef = useRef(false);

  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading) return;

    const loadNextChunk = async () => {
      if (requestInProgressRef.current) return;

      requestInProgressRef.current = true;
      const scrollViewport = sentinel.parentElement;
      const preservedScrollTop = scrollViewport?.scrollTop ?? 0;
      const preservedScrollLeft = scrollViewport?.scrollLeft ?? 0;

      try {
        await onLoadMoreRef.current();
      } finally {
        // React commits the appended rows after the request promise resolves.
        // Restore only an accidental backwards reset, so normal user scrolling
        // while the next chunk loads is not interrupted.
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            if (scrollViewport?.isConnected) {
              if (scrollViewport.scrollTop < preservedScrollTop) {
                scrollViewport.scrollTop = preservedScrollTop;
              }

              if (scrollViewport.scrollLeft !== preservedScrollLeft) {
                scrollViewport.scrollLeft = preservedScrollLeft;
              }
            }

            requestInProgressRef.current = false;
          });
        });
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void loadNextChunk();
        }
      },
      {
        rootMargin: "0px 0px 12px 0px",
        threshold: 0.8,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  if (!hasMore && !loading) return null;

  return (
    <div
      ref={sentinelRef}
      className="flex h-8 shrink-0 items-center justify-center border-t border-slate-100 bg-white text-primary"
      aria-hidden={!loading}
    >
      {loading && <Loader label={label} inline size="sm" tone="primary" />}
    </div>
  );
};

export default ListLoadSentinel;
