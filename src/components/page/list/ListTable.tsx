"use client";

import { cn } from "@/src/lib/utils";

import type { ListTableProps } from "./types";

const densityClasses = {
  compact: [
    "[&_thead_tr]:h-10 [&_thead_th]:!px-4 [&_thead_th]:!py-2",
    "[&_tbody_td]:!px-4 [&_tbody_td]:!py-0",
  ],
  comfortable: [
    "[&_thead_th]:px-4 [&_thead_th]:py-3.5",
    "[&_tbody_td]:px-4 [&_tbody_td]:py-3.5",
  ],
};

const ListTable = ({
  children,
  density = "compact",
  className,
}: ListTableProps) => {
  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white",
        densityClasses[density],
        className,
      )}
    >
      <div className="h-full overflow-auto">{children}</div>
    </div>
  );
};

export default ListTable;
