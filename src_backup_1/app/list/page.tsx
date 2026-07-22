"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ConfirmationDialog,
  Input,
  ListCheckbox,
  ListPage,
  ListRowActions,
  ListTable,
  Pagination,
  startNavigationLoading,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from "@/src/components";
import type { ListSortDirection, ListSortOption } from "@/src/components";

interface Contact {
  id: string;
  name: string;
  email: string;
  department: string;
  status: "Active" | "Inactive";
  phone: string;
  designation: string;
  location: string;
  joinedDate: string;
}

type BaseContact = Pick<
  Contact,
  "id" | "name" | "email" | "department" | "status"
>;

interface ContactFilters {
  search: string;
  department: string;
  status: string;
}

const baseContacts: BaseContact[] = [
  {
    id: "contact-1",
    name: "Navith",
    email: "navith@gmail.com",
    department: "Accounts",
    status: "Active",
  },
  {
    id: "contact-2",
    name: "Ajay",
    email: "ajay@gmail.com",
    department: "Sales",
    status: "Active",
  },
  {
    id: "contact-3",
    name: "Hari",
    email: "hari@gmail.com",
    department: "HR",
    status: "Inactive",
  },
  {
    id: "contact-4",
    name: "Praveen",
    email: "praveen@gmail.com",
    department: "Operations",
    status: "Active",
  },
  {
    id: "contact-5",
    name: "Karthik",
    email: "karthik@gmail.com",
    department: "Sales",
    status: "Active",
  },
  {
    id: "contact-6",
    name: "Sathish",
    email: "sathish@gmail.com",
    department: "Accounts",
    status: "Inactive",
  },
  {
    id: "contact-7",
    name: "Arun",
    email: "arun@gmail.com",
    department: "HR",
    status: "Active",
  },
  {
    id: "contact-8",
    name: "Vijay",
    email: "vijay@gmail.com",
    department: "Operations",
    status: "Active",
  },
  {
    id: "contact-9",
    name: "Rahul",
    email: "rahul@gmail.com",
    department: "Sales",
    status: "Inactive",
  },
  {
    id: "contact-10",
    name: "Manoj",
    email: "manoj@gmail.com",
    department: "Accounts",
    status: "Active",
  },
  {
    id: "contact-11",
    name: "Suresh",
    email: "suresh@gmail.com",
    department: "Operations",
    status: "Active",
  },
  {
    id: "contact-12",
    name: "Dinesh",
    email: "dinesh@gmail.com",
    department: "Accounts",
    status: "Active",
  },
  {
    id: "contact-13",
    name: "Ramesh",
    email: "ramesh@gmail.com",
    department: "Sales",
    status: "Inactive",
  },
  {
    id: "contact-14",
    name: "Surya",
    email: "surya@gmail.com",
    department: "HR",
    status: "Active",
  },
  {
    id: "contact-15",
    name: "Naveen",
    email: "naveen@gmail.com",
    department: "Operations",
    status: "Active",
  },
  {
    id: "contact-16",
    name: "Deepak",
    email: "deepak@gmail.com",
    department: "Sales",
    status: "Active",
  },
  {
    id: "contact-17",
    name: "Bala",
    email: "bala@gmail.com",
    department: "Accounts",
    status: "Inactive",
  },
  {
    id: "contact-18",
    name: "Vignesh",
    email: "vignesh@gmail.com",
    department: "HR",
    status: "Active",
  },
  {
    id: "contact-19",
    name: "Santhosh",
    email: "santhosh@gmail.com",
    department: "Operations",
    status: "Active",
  },
  {
    id: "contact-20",
    name: "Gokul",
    email: "gokul@gmail.com",
    department: "Sales",
    status: "Inactive",
  },
];

const locations = ["Chennai", "Coimbatore", "Madurai", "Trichy"];
const joinedDates = ["12 Jan 2024", "08 Mar 2024", "21 Jun 2024", "05 Sep 2024"];
const designations: Record<string, string> = {
  Accounts: "Accountant",
  Sales: "Sales Executive",
  HR: "HR Executive",
  Operations: "Operations Executive",
};

const contactsData: Contact[] = Array.from({ length: 30 }, (_, index) => {
  const contact = baseContacts[index % baseContacts.length];

  return {
    ...contact,
    id: `contact-${index + 1}`,
    phone: `+91 ${9876500000 + index}`,
    designation: designations[contact.department],
    location: locations[index % locations.length],
    joinedDate: joinedDates[index % joinedDates.length],
  };
});

const emptyFilters: ContactFilters = {
  search: "",
  department: "",
  status: "",
};

const sortOptions: ListSortOption[] = [
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Department", value: "department" },
  { label: "Phone", value: "phone" },
  { label: "Designation", value: "designation" },
  { label: "Location", value: "location" },
  { label: "Joined Date", value: "joinedDate" },
  { label: "Status", value: "status" },
];

const selectClassName = `
  h-11 w-full rounded-xl border border-border bg-white px-4
  text-sm text-foreground transition-all duration-200
  focus:border-primary focus:ring-4 focus:ring-primary/10
`;

export default function Page() {
  const router = useRouter();
  const [contacts, setContacts] = useState(contactsData);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] =
    useState<ContactFilters>(emptyFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<ContactFilters>(emptyFilters);
  const [sortValue, setSortValue] = useState("name");
  const [sortDirection, setSortDirection] = useState<ListSortDirection>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const visibleContacts = useMemo(() => {
    const search = appliedFilters.search.trim().toLowerCase();

    const filtered = contacts.filter((contact) => {
      const matchesSearch =
        !search ||
        contact.name.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        contact.phone.toLowerCase().includes(search) ||
        contact.designation.toLowerCase().includes(search) ||
        contact.location.toLowerCase().includes(search);
      const matchesDepartment =
        !appliedFilters.department ||
        contact.department === appliedFilters.department;
      const matchesStatus =
        !appliedFilters.status || contact.status === appliedFilters.status;

      return matchesSearch && matchesDepartment && matchesStatus;
    });

    return [...filtered].sort((first, second) => {
      const firstValue = String(
        first[sortValue as keyof Contact],
      ).toLowerCase();
      const secondValue = String(
        second[sortValue as keyof Contact],
      ).toLowerCase();
      const result = firstValue.localeCompare(secondValue);

      return sortDirection === "asc" ? result : -result;
    });
  }, [appliedFilters, contacts, sortDirection, sortValue]);

  const totalPages = Math.max(1, Math.ceil(visibleContacts.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageContacts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return visibleContacts.slice(start, start + pageSize);
  }, [page, pageSize, visibleContacts]);

  const allVisibleSelected =
    pageContacts.length > 0 &&
    pageContacts.every((contact) => selectedIds.includes(contact.id));
  const someVisibleSelected =
    !allVisibleSelected &&
    pageContacts.some((contact) => selectedIds.includes(contact.id));

  const filterCount = Object.values(appliedFilters).filter(Boolean).length;

  const toggleContact = (contactId: string) => {
    setSelectedIds((current) =>
      current.includes(contactId)
        ? current.filter((id) => id !== contactId)
        : [...current, contactId],
    );
  };

  const toggleAllVisible = () => {
    const visibleIds = pageContacts.map((contact) => contact.id);

    setSelectedIds((current) => {
      if (allVisibleSelected) {
        return current.filter((id) => !visibleIds.includes(id));
      }

      return Array.from(new Set([...current, ...visibleIds]));
    });
  };

  const editContact = (contactId: string) => {
    startNavigationLoading("Loading contact form...");
    router.push(`/form?mode=edit&id=${contactId}`);
  };

  const requestDelete = (contactIds: string[]) => {
    setPendingDeleteIds(contactIds);
  };

  const confirmDelete = async () => {
    const contactIds = pendingDeleteIds;

    if (contactIds.length === 0) return;

    setDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    setContacts((current) =>
      current.filter((contact) => !contactIds.includes(contact.id)),
    );
    setSelectedIds((current) =>
      current.filter((id) => !contactIds.includes(id)),
    );
    setPendingDeleteIds([]);
    setDeleting(false);

    toast.success({
      title: "Contact Deleted",
      description:
        contactIds.length === 1
          ? "The selected contact was deleted."
          : `${contactIds.length} contacts were deleted.`,
    });
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setSelectedIds([]);
    setPage(1);
    setFilterOpen(false);
  };

  const resetFilters = () => {
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setSelectedIds([]);
    setPage(1);
  };

  return (
    <>
      <ListPage
        title="Contact List"
        addLabel="Add Contact"
        filterOpen={filterOpen}
        filterCount={filterCount}
        selectedCount={selectedIds.length}
        sortOptions={sortOptions}
        sortValue={sortValue}
        sortDirection={sortDirection}
        onAdd={() => {
          startNavigationLoading("Loading contact form...");
          router.push("/form");
        }}
        onFilter={() => setFilterOpen((current) => !current)}
        onFilterClose={() => setFilterOpen(false)}
        onFilterApply={applyFilters}
        onFilterReset={resetFilters}
        onSortChange={(value, direction) => {
          setSortValue(value);
          setSortDirection(direction);
          setPage(1);
        }}
        onBulkEdit={() => {
          if (selectedIds[0]) editContact(selectedIds[0]);
        }}
        onBulkDelete={() => requestDelete(selectedIds)}
        filterContent={
          <>
            <Input
              label="Search Contact"
              placeholder="Search by name or email"
              value={draftFilters.search}
              onChange={(event) =>
                setDraftFilters((current) => ({
                  ...current,
                  search: event.target.value,
                }))
              }
            />

            <div>
              <label
                htmlFor="department-filter"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Department
              </label>
              <select
                id="department-filter"
                className={selectClassName}
                value={draftFilters.department}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    department: event.target.value,
                  }))
                }
              >
                <option value="">All departments</option>
                <option value="Accounts">Accounts</option>
                <option value="Sales">Sales</option>
                <option value="HR">Human Resources</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="status-filter"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Status
              </label>
              <select
                id="status-filter"
                className={selectClassName}
                value={draftFilters.status}
                onChange={(event) =>
                  setDraftFilters((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
              >
                <option value="">All statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </>
        }
      >
        <ListTable density="compact">
          <Table className="text-sm">
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead sticky="left" className="w-12 text-center">
                  <ListCheckbox
                    label="Select all visible contacts"
                    checked={allVisibleSelected}
                    indeterminate={someVisibleSelected}
                    onChange={toggleAllVisible}
                  />
                </TableHead>
                <TableHead className="w-[10%] text-slate-700">Name</TableHead>
                <TableHead className="w-[15%] text-slate-700">
                  Email
                </TableHead>
                <TableHead className="w-[10%] text-slate-700">
                  Department
                </TableHead>
                <TableHead className="w-[12%] text-slate-700">
                  Phone
                </TableHead>
                <TableHead className="w-[11%] text-slate-700">
                  Designation
                </TableHead>
                <TableHead className="w-[9%] text-slate-700">
                  Location
                </TableHead>
                <TableHead className="w-[11%] text-slate-700">
                  Joined Date
                </TableHead>
                <TableHead className="w-[8%] text-slate-700">
                  Status
                </TableHead>
                <TableHead
                  sticky="right"
                  className="w-24 text-right text-slate-700"
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageContacts.map((contact) => {
                const selected = selectedIds.includes(contact.id);

                return (
                  <TableRow key={contact.id} selected={selected} hoverable>
                    <TableCell
                      sticky="left"
                      selected={selected}
                      className="text-center"
                    >
                      <ListCheckbox
                        label={`Select ${contact.name}`}
                        checked={selected}
                        onChange={() => toggleContact(contact.id)}
                      />
                    </TableCell>
                    <TableCell
                      className="font-medium text-slate-800"
                      title={contact.name}
                    >
                      {contact.name}
                    </TableCell>
                    <TableCell
                      className="text-slate-600"
                      title={contact.email}
                    >
                      {contact.email}
                    </TableCell>
                    <TableCell
                      className="text-slate-600"
                      title={contact.department}
                    >
                      {contact.department}
                    </TableCell>
                    <TableCell
                      className="text-slate-600"
                      title={contact.phone}
                    >
                      {contact.phone}
                    </TableCell>
                    <TableCell
                      className="text-slate-600"
                      title={contact.designation}
                    >
                      {contact.designation}
                    </TableCell>
                    <TableCell
                      className="text-slate-600"
                      title={contact.location}
                    >
                      {contact.location}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {contact.joinedDate}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          contact.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {contact.status}
                      </span>
                    </TableCell>
                    <TableCell sticky="right" selected={selected}>
                      <ListRowActions
                        editLabel={`Edit ${contact.name}`}
                        deleteLabel={`Delete ${contact.name}`}
                        onEdit={() => editContact(contact.id)}
                        onDelete={() => requestDelete([contact.id])}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}

              {pageContacts.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="!px-6 !py-16 text-center text-sm text-slate-500"
                  >
                    No contacts match the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ListTable>

        <Pagination
          page={page}
          pageSize={pageSize}
          totalItems={visibleContacts.length}
          onPageChange={(nextPage) => {
            setPage(nextPage);
            setSelectedIds([]);
          }}
          onPageSizeChange={(nextPageSize) => {
            setPageSize(nextPageSize);
            setPage(1);
            setSelectedIds([]);
          }}
        />
      </ListPage>

      <ConfirmationDialog
        open={pendingDeleteIds.length > 0}
        variant="danger"
        title={
          pendingDeleteIds.length === 1
            ? "Delete this contact?"
            : `Delete ${pendingDeleteIds.length} contacts?`
        }
        description="This action removes the selected contact data from the list. Please confirm before continuing."
        confirmText="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setPendingDeleteIds([])}
      />
    </>
  );
}
