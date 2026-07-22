"use client";

import { TableContainer } from "@/src/components/ui";

import type { ListTableProps } from "./types";

const ListTable = ({
  children,
  density = "compact",
  className,
}: ListTableProps) => {
  return (
    <TableContainer density={density} className={className}>
      {children}
    </TableContainer>
  );
};

export default ListTable;
