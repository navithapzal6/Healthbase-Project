import type { LucideIcon } from "lucide-react";

export interface SidebarMenuItem {
  label: string;
  route: string;
  icon: LucideIcon;
  matchRoutes?: string[];
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
