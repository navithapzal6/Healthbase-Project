import type {
  MandatoryMenuOption,
  MandatoryRecord,
  SettingsSection,
  UserAccessMenuOption,
  UserAccessRecord,
} from "./types";

export const settingsSections: SettingsSection[] = [
  {
    id: "user-access",
    label: "User Access",
    description: "User menu permissions",
  },
  {
    id: "mandatories",
    label: "Mandatories",
    description: "Required fields by menu and submenu",
  },
];

export const settingsUsers = [
  "Navith Apzal M",
  "Ajay",
  "Arun",
  "Bala",
  "Deepak",
  "Dinesh",
] as const;

export const userAccessMenuOptions: readonly UserAccessMenuOption[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Overview and summary workspace",
  },
  {
    id: "ledger",
    label: "Ledger",
    description: "Ledger workspace and account setup",
    submenus: ["Unit Ledger", "Expense Ledger", "Bank Accounts"],
  },
  {
    id: "payment",
    label: "Payment",
    description: "Payment list and transaction entry",
  },
  {
    id: "receipt",
    label: "Receipt",
    description: "Receipt list and transaction entry",
  },
  {
    id: "expense",
    label: "Expense",
    description: "Expense list and transaction entry",
  },
  {
    id: "user-log",
    label: "User Log",
    description: "User login and logout activity",
  },
];

const accessSeed = [
  ["Navith Apzal M", ["dashboard", "ledger", "payment", "user-log"]],
  ["Ajay", ["dashboard", "ledger", "payment", "receipt"]],
  ["Arun", ["dashboard", "receipt", "expense"]],
  ["Bala", ["dashboard", "ledger", "expense"]],
  ["Deepak", ["dashboard", "payment", "receipt"]],
  ["Dinesh", ["dashboard", "receipt", "user-log"]],
] as const;

const menuById = new Map(
  userAccessMenuOptions.map((menu) => [menu.id, menu] as const),
);

export const userAccessRecords: UserAccessRecord[] = accessSeed.flatMap(
  ([user, menuIds]) =>
    menuIds.map((menuId, index) => {
      const menu = menuById.get(menuId);

      return {
        id: `user-access-${user.toLowerCase().replaceAll(" ", "-")}-${index + 1}`,
        user,
        menuId,
        menu: menu?.label ?? menuId,
      };
    }),
);

export const mandatoryMenuOptions: readonly MandatoryMenuOption[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    groups: [
      {
        id: "dashboard-overview",
        label: "Dashboard",
        fields: [
          { id: "branch", label: "Branch" },
          { id: "date-range", label: "Date Range" },
          { id: "summary-view", label: "Summary View" },
        ],
      },
    ],
  },
  {
    id: "ledger",
    label: "Ledger",
    groups: [
      {
        id: "unit-ledger",
        label: "Unit Ledger",
        fields: [
          { id: "ledger-name", label: "Ledger Name" },
          { id: "ledger-description", label: "Description" },
        ],
      },
      {
        id: "expense-ledger",
        label: "Expense Ledger",
        fields: [
          { id: "expense-ledger-name", label: "Ledger Name" },
          { id: "expense-ledger-description", label: "Description" },
        ],
      },
      {
        id: "bank-accounts",
        label: "Bank Accounts",
        fields: [
          { id: "account-name", label: "Account Name" },
          { id: "bank-name", label: "Bank Name" },
          { id: "account-number", label: "Account Number" },
          { id: "ifsc-code", label: "IFSC Code" },
        ],
      },
    ],
  },
  {
    id: "payment",
    label: "Payment",
    groups: [
      {
        id: "payment-entry",
        label: "Payment",
        fields: [
          { id: "payment-contact", label: "Contact" },
          { id: "payment-ledger", label: "Ledger" },
          { id: "payment-amount", label: "Amount" },
          { id: "payment-mode", label: "Payment Mode" },
          { id: "payment-date", label: "Payment Date" },
          { id: "payment-reference", label: "Reference Number" },
        ],
      },
    ],
  },
  {
    id: "receipt",
    label: "Receipt",
    groups: [
      {
        id: "receipt-entry",
        label: "Receipt",
        fields: [
          { id: "receipt-contact", label: "Contact" },
          { id: "receipt-ledger", label: "Ledger" },
          { id: "receipt-amount", label: "Amount" },
          { id: "receipt-mode", label: "Receipt Mode" },
          { id: "receipt-date", label: "Receipt Date" },
          { id: "receipt-reference", label: "Reference Number" },
        ],
      },
    ],
  },
  {
    id: "expense",
    label: "Expense",
    groups: [
      {
        id: "expense-entry",
        label: "Expense",
        fields: [
          { id: "expense-contact", label: "Contact" },
          { id: "expense-category", label: "Category" },
          { id: "expense-date", label: "Date" },
          { id: "expense-payment-mode", label: "Payment Mode" },
          { id: "expense-description", label: "Description" },
          { id: "expense-amount", label: "Amount" },
        ],
      },
    ],
  },
  {
    id: "user-log",
    label: "User Log",
    groups: [
      {
        id: "user-log-list",
        label: "User Log",
        fields: [
          { id: "log-date", label: "Date" },
          { id: "log-user", label: "User" },
          { id: "log-in", label: "Log In" },
          { id: "log-out", label: "Log Out" },
        ],
      },
    ],
  },
];

const initiallyAssignedFields = new Set([
  "dashboard/dashboard-overview/branch",
  "dashboard/dashboard-overview/date-range",
  "ledger/unit-ledger/ledger-name",
  "ledger/unit-ledger/ledger-description",
  "ledger/expense-ledger/expense-ledger-name",
  "ledger/bank-accounts/account-name",
  "ledger/bank-accounts/bank-name",
  "payment/payment-entry/payment-contact",
  "payment/payment-entry/payment-amount",
  "payment/payment-entry/payment-mode",
  "payment/payment-entry/payment-date",
  "receipt/receipt-entry/receipt-contact",
  "receipt/receipt-entry/receipt-amount",
  "receipt/receipt-entry/receipt-date",
  "expense/expense-entry/expense-category",
  "expense/expense-entry/expense-date",
  "expense/expense-entry/expense-payment-mode",
  "expense/expense-entry/expense-amount",
  "user-log/user-log-list/log-date",
  "user-log/user-log-list/log-user",
]);

export const mandatoryRecords: MandatoryRecord[] = mandatoryMenuOptions.flatMap(
  (menu) =>
    menu.groups.flatMap((group) =>
      group.fields.map((field) => {
        const assignmentKey = `${menu.id}/${group.id}/${field.id}`;

        return {
          id: `mandatory-${menu.id}-${group.id}-${field.id}`,
          menuId: menu.id,
          menu: menu.label,
          groupId: group.id,
          group: group.label,
          fieldId: field.id,
          field: field.label,
          assigned: initiallyAssignedFields.has(assignmentKey),
        };
      }),
    ),
);
