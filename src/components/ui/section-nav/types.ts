import type { ComponentType } from "react";

export interface SectionNavIconProps {
  size?: number;
  className?: string;
}

export interface SectionNavItem<TId extends string = string> {
  id: TId;
  label: string;
  icon: ComponentType<SectionNavIconProps>;
}

export interface SectionNavProps<TId extends string = string> {
  activeSection: TId;
  items: readonly SectionNavItem<TId>[];
  menuLabel: string;
  ariaLabel: string;
  collapseLabel: string;
  expandLabel: string;
  collapsed?: boolean;
  onToggle?: () => void;
  onChange: (section: TId) => void;
}
