"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ListPage, ListTable, Pagination } from "@/src/components";
import type { ListSortDirection, ListSortOption } from "@/src/components";

const ledgerData = [
  {
    id: "ledger-1",
    name: "Cash Account",
    group: "Cash-in-Hand",
    type: "Asset",
    balance: "₹45,000.00",
    status: "Active",
  },
  {
    id: "ledger-2",
    name: "Sales Account",
    group: "Sales Accounts",
    type: "Income",
    balance: "₹1,28,500.00",
    status: "Active",
  },
  {
    id: "ledger-3",
    name: "Purchase Account",
    group: "Purchase Accounts",
    type: "Expense",
    balance: "₹82,300.00",
    status: "Active",
  },
];

const sortOptions: ListSortOption[] = [
  { label: "Ledger Name", value: "name" },
  { label: "Group", value: "group" },
  { label: "Type", value: "type" },
  { label: "Status", value: "status" },
];

export default function Page() {
  const router = useRouter();
  const [sortValue, setSortValue] = useState("name");
  const [sortDirection, setSortDirection] = useState<ListSortDirection>("asc");

  const ledgers = useMemo(() => {
    return [...ledgerData].sort((first, second) => {
      const firstValue = String(
        first[sortValue as keyof (typeof ledgerData)[number]],
      );
      const secondValue = String(
        second[sortValue as keyof (typeof ledgerData)[number]],
      );
      const result = firstValue.localeCompare(secondValue);

      return sortDirection === "asc" ? result : -result;
    });
  }, [sortDirection, sortValue]);

  return (
    <ListPage
      title="Ledger List"
      addLabel="Add Ledger"
      showFilter={false}
      sortOptions={sortOptions}
      sortValue={sortValue}
      sortDirection={sortDirection}
      onAdd={() => router.push("/ledger/add")}
      onSortChange={(value, direction) => {
        setSortValue(value);
        setSortDirection(direction);
      }}
    >
      <ListTable>
        <table className="w-full min-w-[760px] text-sm">
          <thead className="sticky top-0 bg-slate-50">
            <tr className="border-b border-slate-200">
              {[
                "Ledger Name",
                "Group",
                "Type",
                "Opening Balance",
                "Status",
              ].map((heading) => (
                <th
                  key={heading}
                  className="p-4 text-left font-semibold text-slate-700"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {ledgers.map((ledger) => (
              <tr
                key={ledger.id}
                className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50"
              >
                <td className="p-4 font-medium text-slate-800">
                  {ledger.name}
                </td>
                <td className="p-4 text-slate-600">{ledger.group}</td>
                <td className="p-4 text-slate-600">{ledger.type}</td>
                <td className="p-4 text-slate-600">{ledger.balance}</td>
                <td className="p-4">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    {ledger.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ListTable>

      <Pagination totalItems={ledgers.length} />
    </ListPage>
  );
}
