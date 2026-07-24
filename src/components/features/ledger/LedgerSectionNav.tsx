"use client";

import { Building2, Landmark, ReceiptText } from "lucide-react";

import { SectionNav, type SectionNavItem } from "@/src/components/ui";

import { ledgerSections } from "./data";
import type { LedgerSectionId, LedgerSectionNavProps } from "./types";

const sectionIcons = {
  unit: Building2,
  expense: ReceiptText,
  bank: Landmark,
};

const items: SectionNavItem<LedgerSectionId>[] = ledgerSections.map((section) => ({
  id: section.id,
  label: section.label,
  icon: sectionIcons[section.id],
}));

const LedgerSectionNav = ({
  activeSection,
  collapsed = false,
  onToggle,
  onChange,
}: LedgerSectionNavProps) => (
  <SectionNav
    activeSection={activeSection}
    items={items}
    menuLabel="Ledger Menu"
    ariaLabel="Ledger sections"
    collapseLabel="Collapse ledger menu"
    expandLabel="Expand ledger menu"
    collapsed={collapsed}
    onToggle={onToggle}
    onChange={onChange}
  />
);

export default LedgerSectionNav;
