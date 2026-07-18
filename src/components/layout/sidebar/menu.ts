import type { SidebarMenuItem } from "./types";

import {
  Home,
  Users,
  BookOpen,
  Target,
  Wallet,
  ShoppingBag,
  BarChart3,
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
    label: "Lead",
    route: "/lead",
    icon: Target,
  },

  {
    label: "Purchase",
    route: "/purchase",
    icon: ShoppingBag,
  },

  {
    label: "Expense",
    route: "/expense",
    icon: Wallet,
  },

  {
    label: "Reports",
    icon: BarChart3,
    children: [
      {
        name: "Stocks",
        route: "/reports/stocks",
      },
      {
        name: "Day Book",
        route: "/reports/day-book",
      },
      {
        name: "Cash Book",
        route: "/reports/cash-book",
      },
    ],
  },

  {
    label: "Settings",
    route: "/settings",
    icon: Settings,
  },
];
