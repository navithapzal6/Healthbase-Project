import type { SidebarMenuItem } from "./types";

import {
  Home,
  Users,
  BookOpen,
  CreditCard,
  HandCoins,
  ReceiptIndianRupee,
  History,
  Settings,
} from "lucide-react";

export const menus: SidebarMenuItem[] = [
  {
    label: "Dashboard",
    route: "/",
    icon: Home,
  },

  {
    label: "Essentials",
    icon: Users,
    children: [
      {
        name: "Contacts",
        route: "/list",
        matchRoutes: ["/form"],
      },
      {
        name: "Materials",
        route: "/materials",
      },
      {
        name: "Equipments",
        route: "/equipments",
      },
      {
        name: "Warehouse",
        route: "/warehouse",
      },
    ],
  },

  {
    label: "Ledger",
    route: "/ledger",
    icon: BookOpen,
  },

  {
    label: "Payment",
    route: "/payment",
    icon: CreditCard,
  },

  {
    label: "Receipt",
    route: "/receipt",
    icon: HandCoins,
  },

  {
    label: "Expense",
    route: "/expense",
    icon: ReceiptIndianRupee,
  },

  {
    label: "User Log",
    route: "/user-log",
    icon: History,
  },

  {
    label: "Settings",
    route: "/settings",
    icon: Settings,
  },
];
