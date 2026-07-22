"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  ListBulkActions,
  ListCheckbox,
  ListRowActions,
  ListSortMenu,
  ListTable,
  Pagination,
  type ListSortDirection,
} from "@/src/components/page/list";
import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableEmptyState,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui";

import type {
  MandatoryMenuOption,
  MandatoryRecord,
  SettingsEditTarget,
  SettingsSection,
  UserAccessMenuOption,
  UserAccessRecord,
} from "./types";

interface SettingsListPanelProps {
  section: SettingsSection;
  userOptions: readonly string[];
  userAccessMenuOptions: readonly UserAccessMenuOption[];
  mandatoryMenuOptions: readonly MandatoryMenuOption[];
  userAccessRecords: UserAccessRecord[];
  mandatoryRecords: MandatoryRecord[];
  onEdit: (target: SettingsEditTarget) => void;
  onDelete: (recordIds: string[]) => void;
}

interface SettingsSummaryRecord {
  id: string;
  label: string;
  assignedCount: number;
  unassignedCount: number;
  recordIds: string[];
  editTarget: SettingsEditTarget;
}

const summarySortOptions = [
  { label: "Name", value: "label" },
  { label: "Assigned", value: "assignedCount" },
  { label: "Unassigned", value: "unassignedCount" },
];

const SettingsListPanel = ({
  section,
  userOptions,
  userAccessMenuOptions,
  mandatoryMenuOptions,
  userAccessRecords,
  mandatoryRecords,
  onEdit,
  onDelete,
}: SettingsListPanelProps) => {
  const [search, setSearch] = useState("");
  const [sortValue, setSortValue] = useState("label");
  const [sortDirection, setSortDirection] =
    useState<ListSortDirection>("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const isUserAccess = section.id === "user-access";

  const summaryRecords = useMemo<SettingsSummaryRecord[]>(() => {
    if (isUserAccess) {
      return userOptions.map((user) => {
        const userRecords = userAccessRecords.filter(
          (record) => record.user === user,
        );
        const assignedMenuIds = new Set(
          userRecords.map((record) => record.menuId),
        );

        return {
          id: `user-summary-${user.toLowerCase().replaceAll(" ", "-")}`,
          label: user,
          assignedCount: assignedMenuIds.size,
          unassignedCount: Math.max(
            0,
            userAccessMenuOptions.length - assignedMenuIds.size,
          ),
          recordIds: userRecords.map((record) => record.id),
          editTarget: {
            section: "user-access",
            user,
          },
        };
      });
    }

    return mandatoryMenuOptions.map((menu) => {
      const menuRecords = mandatoryRecords.filter(
        (record) => record.menuId === menu.id,
      );
      const assignedRecords = menuRecords.filter((record) => record.assigned);

      return {
        id: `mandatory-summary-${menu.id}`,
        label: menu.label,
        assignedCount: assignedRecords.length,
        unassignedCount: Math.max(
          0,
          menuRecords.length - assignedRecords.length,
        ),
        recordIds: assignedRecords.map((record) => record.id),
        editTarget: {
          section: "mandatories",
          menuId: menu.id,
          menu: menu.label,
        },
      };
    });
  }, [
    isUserAccess,
    mandatoryMenuOptions,
    mandatoryRecords,
    userAccessMenuOptions.length,
    userAccessRecords,
    userOptions,
  ]);

  useEffect(() => {
    setSearch("");
    setSortValue("label");
    setSortDirection("asc");
    setSelectedIds([]);
    setPage(1);
  }, [section.id]);

  useEffect(() => {
    const recordIds = new Set(summaryRecords.map((record) => record.id));
    setSelectedIds((current) => current.filter((id) => recordIds.has(id)));
  }, [summaryRecords]);

  const visibleRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = summaryRecords.filter((record) =>
      [record.label, record.assignedCount, record.unassignedCount].some(
        (value) => String(value).toLowerCase().includes(query),
      ),
    );

    return [...filtered].sort((first, second) => {
      const firstValue = first[sortValue as keyof SettingsSummaryRecord];
      const secondValue = second[sortValue as keyof SettingsSummaryRecord];
      const result =
        typeof firstValue === "number" && typeof secondValue === "number"
          ? firstValue - secondValue
          : String(firstValue).localeCompare(String(secondValue));

      return sortDirection === "asc" ? result : -result;
    });
  }, [search, sortDirection, sortValue, summaryRecords]);

  const totalPages = Math.max(1, Math.ceil(visibleRecords.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRecords = visibleRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const pageIds = pageRecords.map((record) => record.id);
  const selectedOnPage = pageIds.filter((id) => selectedIds.includes(id));
  const allOnPageSelected =
    pageIds.length > 0 && selectedOnPage.length === pageIds.length;
  const selectedRecord = summaryRecords.find((record) =>
    selectedIds.includes(record.id),
  );
  const selectedSourceRecordIds = summaryRecords
    .filter((record) => selectedIds.includes(record.id))
    .flatMap((record) => record.recordIds);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const toggleAll = () => {
    setSelectedIds((current) =>
      allOnPageSelected
        ? current.filter((id) => !pageIds.includes(id))
        : Array.from(new Set([...current, ...pageIds])),
    );
  };

  const toggleRecord = (recordId: string) => {
    setSelectedIds((current) =>
      current.includes(recordId)
        ? current.filter((id) => id !== recordId)
        : [...current, recordId],
    );
  };

  const nameColumn = isUserAccess ? "User" : "Menu";
  const assignedColumn = isUserAccess ? "Assigned Menus" : "Assigned Fields";
  const unassignedColumn = isUserAccess
    ? "Unassigned Menus"
    : "Unassigned Fields";
  const itemLabel = isUserAccess ? "user" : "menu";

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-white p-4">
      <div className="mb-4 flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{section.label}</h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Manage {visibleRecords.length}{" "}
            {isUserAccess ? "user access records" : "menu field configurations"}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="w-full sm:w-64">
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder={`Search ${
                isUserAccess ? "users" : "menus"
              }...`}
              leftIcon={<Search size={16} className="text-slate-400" />}
              inputSize="md"
              className="h-9 !pl-9 text-sm"
              fullWidth
            />
          </div>
          <ListSortMenu
            options={summarySortOptions}
            value={sortValue}
            direction={sortDirection}
            onChange={(value, direction) => {
              setSortValue(value);
              setSortDirection(direction);
              setPage(1);
            }}
          />
        </div>
      </div>

      <ListBulkActions
        selectedCount={selectedIds.length}
        itemLabel={itemLabel}
        onEdit={
          selectedIds.length === 1 && selectedRecord
            ? () => onEdit(selectedRecord.editTarget)
            : undefined
        }
        onDelete={
          selectedSourceRecordIds.length
            ? () => onDelete(selectedSourceRecordIds)
            : undefined
        }
      />

      <ListTable className="min-h-[260px]" density="compact">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200">
              <TableHead sticky="left" className="w-12 text-center">
                <ListCheckbox
                  label={`Select all ${itemLabel} records on this page`}
                  checked={allOnPageSelected}
                  indeterminate={
                    selectedOnPage.length > 0 && !allOnPageSelected
                  }
                  onChange={toggleAll}
                />
              </TableHead>
              <TableHead className="w-[10%]">S.No</TableHead>
              <TableHead>{nameColumn}</TableHead>
              <TableHead className="w-[22%] text-center">
                {assignedColumn}
              </TableHead>
              <TableHead className="w-[22%] text-center">
                {unassignedColumn}
              </TableHead>
              <TableHead sticky="right" className="w-20 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRecords.map((record, index) => {
              const selected = selectedIds.includes(record.id);

              return (
                <TableRow
                  key={record.id}
                  selected={selected}
                  hoverable
                  className="h-11"
                >
                  <TableCell
                    sticky="left"
                    selected={selected}
                    className="text-center"
                  >
                    <ListCheckbox
                      label={`Select ${record.label}`}
                      checked={selected}
                      onChange={() => toggleRecord(record.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-slate-700">
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800">
                    {record.label}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex min-w-16 items-center justify-center rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">
                      {record.assignedCount}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex min-w-16 items-center justify-center rounded-full bg-red-100 px-3 py-1 text-[11px] font-semibold text-red-700">
                      {record.unassignedCount}
                    </span>
                  </TableCell>
                  <TableCell
                    sticky="right"
                    selected={selected}
                  >
                    <ListRowActions
                      editLabel={`Edit ${record.label}`}
                      deleteLabel={`Clear ${record.label}`}
                      onEdit={() => onEdit(record.editTarget)}
                      onDelete={
                        record.recordIds.length
                          ? () => onDelete(record.recordIds)
                          : undefined
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {pageRecords.length === 0 && (
          <TableEmptyState
            title={`No ${section.label.toLowerCase()} records found.`}
          />
        )}
      </ListTable>

      <Pagination
        page={currentPage}
        pageSize={pageSize}
        totalItems={visibleRecords.length}
        pageSizeOptions={[10, 25, 50]}
        compact
        onPageChange={setPage}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize);
          setPage(1);
        }}
      />
    </section>
  );
};

export default SettingsListPanel;
