import { TableCell, TableRow } from "./Table";

interface TableSkeletonRowsProps {
  rows?: number;
  columns: number;
  hasSelection?: boolean;
  hasActions?: boolean;
}

const TableSkeletonRows = ({
  rows = 10,
  columns,
  hasSelection = false,
  hasActions = false,
}: TableSkeletonRowsProps) => (
  <>
    {Array.from({ length: rows }, (_, rowIndex) => (
      <TableRow key={rowIndex}>
        {hasSelection && (
          <TableCell sticky="left" className="text-center">
            <span className="mx-auto block h-4 w-4 animate-pulse rounded bg-slate-200" />
          </TableCell>
        )}

        {Array.from({ length: columns }, (_, columnIndex) => (
          <TableCell key={columnIndex}>
            <span
              className="block h-3 animate-pulse rounded bg-slate-200"
              style={{
                width: `${58 + ((rowIndex + columnIndex) % 4) * 9}%`,
              }}
            />
          </TableCell>
        ))}

        {hasActions && (
          <TableCell sticky="right">
            <div className="ml-auto flex w-fit gap-2">
              <span className="block h-6 w-6 animate-pulse rounded-md bg-slate-200" />
              <span className="block h-6 w-6 animate-pulse rounded-md bg-slate-200" />
            </div>
          </TableCell>
        )}
      </TableRow>
    ))}
  </>
);

export default TableSkeletonRows;
