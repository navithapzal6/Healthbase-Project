import type { ReactNode } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface HeaderUser {
  firstName: string;
  lastName?: string;
  email?: string;
  role?: string;
  avatar?: string;
}

export interface HeaderProps {
  title?: string;
  greeting?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  user?: HeaderUser;
  backHref?: string;
  backLabel?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
  showSettings?: boolean;
  showNotification?: boolean;
  onSearch?: (value: string) => void;
  onSettingsClick?: () => void;
  onNotificationClick?: () => void;
  onLogout?: () => void;
  actions?: ReactNode;
  className?: string;
}

export interface HeaderRouteConfig {
  title: string;
  greeting?: boolean;
  breadcrumbs?: BreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
  showSearch?: boolean;
}
