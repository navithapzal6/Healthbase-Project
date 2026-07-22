"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

import type { BreadcrumbItem } from "./types";

interface HeaderBreadcrumbProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
}

const HeaderBreadcrumb = ({
  title,
  breadcrumbs = [],
  backHref,
  backLabel = "Go back",
}: HeaderBreadcrumbProps) => {
  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex items-center gap-2">
        {backHref && (
          <Link
            href={backHref}
            aria-label={backLabel}
            title={backLabel}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <ArrowLeft size={18} strokeWidth={2.2} />
          </Link>
        )}

        <h1 className="truncate text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
      </div>

      {breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          className={`mt-1 flex flex-wrap items-center gap-0.5 text-xs ${
            backHref ? "pl-10" : ""
          }`}
        >
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <div key={`${item.label}-${index}`} className="flex items-center">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="font-medium text-primary transition-colors hover:text-primary/75 hover:underline"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium text-slate-800">
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <ChevronRight
                    size={13}
                    strokeWidth={2}
                    className="mx-1 text-slate-400"
                  />
                )}
              </div>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default HeaderBreadcrumb;
