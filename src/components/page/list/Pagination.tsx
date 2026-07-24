"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button, Select } from "@/src/components/ui";

import type { PaginationProps } from "./types";

const Pagination = ({
  page = 1,
  pageSize = 10,
  totalItems = 0,
  pageSizeOptions = [10, 25, 50],
  compact = false,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={`mt-3 flex shrink-0 items-center justify-between ${compact ? "gap-2" : "flex-col gap-3 sm:flex-row"}`}>
      <p className={`${compact ? "whitespace-nowrap text-xs" : "text-sm"} text-slate-500`}>
        Showing {start}-{end} of {totalItems} results
      </p>

      <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
        {onPageSizeChange && (
          <label className={`flex items-center text-slate-500 ${compact ? "gap-1 text-xs" : "gap-2 text-sm"}`}>
            Show
            <Select unstyled
              aria-label="Rows per page"
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className={`rounded-lg border border-slate-200 bg-white font-medium text-slate-700 transition-colors hover:border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/10 ${compact ? "h-7 px-1.5 text-xs" : "h-8 px-2 text-sm"}`}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option} / page
                </option>
              ))}
            </Select>
          </label>
        )}

        <div className={`flex items-center ${compact ? "gap-1" : "gap-2"}`}>
          <Button unstyled
            type="button"
            aria-label="Previous page"
            disabled={currentPage <= 1}
            onClick={() => onPageChange?.(currentPage - 1)}
            className={`${compact ? "h-7 w-7" : "h-8 w-8"} flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <ChevronLeft size={16} />
          </Button>

          <span className={`${compact ? "min-w-10 text-xs" : "min-w-16 text-sm"} text-center font-medium text-slate-700`}>
            {currentPage} / {totalPages}
          </span>

          <Button unstyled
            type="button"
            aria-label="Next page"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
            className={`${compact ? "h-7 w-7" : "h-8 w-8"} flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
