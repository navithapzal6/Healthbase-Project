import type { ReactNode } from "react";

export interface CollapsiblePanelProps {
  children: ReactNode;
  collapsed: boolean;
  onToggle: () => void;
  collapseLabel?: string;
  expandLabel?: string;
  expandedWidth?: number;
  collapsedWidth?: number;
  togglePosition?: "top" | "center";
  className?: string;
}
