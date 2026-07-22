import type { BreadcrumbItem, HeaderRouteConfig } from "./types";

const routeConfigs: Record<string, HeaderRouteConfig> = {
  "/": {
    title: "Dashboard",
    greeting: true,
  },
  "/list": {
    title: "Contacts",
    breadcrumbs: [{ label: "Dashboard", href: "/" }, { label: "Contact List" }],
  },
  "/form": {
    title: "Add Contact",
    backHref: "/list",
    backLabel: "Back to Contacts",
    breadcrumbs: [
      { label: "Dashboard", href: "/" },
      { label: "Contact List", href: "/list" },
      { label: "Add Contact" },
    ],
  },
  "/ledger": {
    title: "Ledger",
    breadcrumbs: [
      { label: "Dashboard", href: "/" },
      { label: "Ledger Workspace" },
    ],
  },
  "/payment": {
    title: "Payments",
    breadcrumbs: [
      { label: "Dashboard", href: "/" },
      { label: "Payments" },
    ],
  },
  "/receipt": {
    title: "Receipts",
    breadcrumbs: [
      { label: "Dashboard", href: "/" },
      { label: "Receipts" },
    ],
  },
  "/expense": {
    title: "Expense",
    breadcrumbs: [
      { label: "Dashboard", href: "/" },
      { label: "Expense" },
    ],
  },
  "/user-log": {
    title: "User Log",
    breadcrumbs: [
      { label: "Dashboard", href: "/" },
      { label: "User Log" },
    ],
  },
  "/settings": {
    title: "Settings",
    breadcrumbs: [
      { label: "Dashboard", href: "/" },
      { label: "Settings Workspace" },
    ],
  },
};

const toLabel = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const buildFallbackConfig = (pathname: string): HeaderRouteConfig => {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Dashboard", href: "/" }];

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    const href = `/${segments.slice(0, index + 1).join("/")}`;

    breadcrumbs.push({
      label: toLabel(segment),
      href: isLast ? undefined : href,
    });
  });

  return {
    title: toLabel(segments.at(-1) ?? "Dashboard"),
    breadcrumbs,
  };
};

export const getHeaderRouteConfig = (pathname: string): HeaderRouteConfig => {
  const normalizedPath =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  return routeConfigs[normalizedPath] ?? buildFallbackConfig(normalizedPath);
};
