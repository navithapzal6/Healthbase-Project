import type { LucideIcon } from "lucide-react";

export interface SidebarSubItem {
  name: string;
  route: string;
  matchRoutes?: string[];
}

export interface SidebarMenuItem {
  label: string;
  route?: string;
  icon: LucideIcon;
  matchRoutes?: string[];
  children?: SidebarSubItem[];
}

export interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  route: string;
  active: boolean;
  collapsed?: boolean;
  onClick: (label: string, route: string) => void;
}

export interface SidebarGroupProps {
  icon: LucideIcon;
  label: string;
  items: SidebarSubItem[];
  normalizedPath: string;
  collapsed?: boolean;
  onExpand?: () => void;
  onMenuClick: (label: string, route: string) => void;
}
