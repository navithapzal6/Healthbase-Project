import type { BreadcrumbItem, HeaderRouteConfig } from "./types";

const dashboardBreadcrumb: BreadcrumbItem = {
  label: "Dashboard",
  href: "/dashboard",
};

const routeConfigs: Record<string, HeaderRouteConfig> = {
  "/dashboard": {
    title: "Dashboard",
    greeting: true,
  },
  "/ledger": {
    title: "Ledger",
    breadcrumbs: [dashboardBreadcrumb, { label: "Ledger Workspace" }],
  },
  "/payment": {
    title: "Payments",
    breadcrumbs: [dashboardBreadcrumb, { label: "Payments" }],
  },
  "/receipt": {
    title: "Receipts",
    breadcrumbs: [dashboardBreadcrumb, { label: "Receipts" }],
  },
  "/expense": {
    title: "Expense",
    breadcrumbs: [dashboardBreadcrumb, { label: "Expense" }],
  },
  "/user-log": {
    title: "User Log",
    breadcrumbs: [dashboardBreadcrumb, { label: "User Log" }],
  },
  "/purchase": {
    title: "Purchase",
    breadcrumbs: [dashboardBreadcrumb, { label: "Purchase" }],
  },
  "/out-patient": {
    title: "Out Patient",
    breadcrumbs: [dashboardBreadcrumb, { label: "Out Patient" }],
  },
  "/settings": {
    title: "Settings",
    breadcrumbs: [dashboardBreadcrumb, { label: "Settings Workspace" }],
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
  const breadcrumbs: BreadcrumbItem[] = [dashboardBreadcrumb];

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    const href = `/${segments.slice(0, index + 1).join("/")}`;

    if (href === "/dashboard") return;

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
