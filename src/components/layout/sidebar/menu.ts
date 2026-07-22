import type { SidebarMenuItem } from "./types";

import {
  Home,
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
