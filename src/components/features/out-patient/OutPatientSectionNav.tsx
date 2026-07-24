"use client";

import { ClipboardList, Pill, User } from "lucide-react";

import { SectionNav, type SectionNavItem } from "@/src/components/ui";

import { outPatientSections } from "./data";
import type { OutPatientSectionId, OutPatientSectionNavProps } from "./types";

const sectionIcons = {
  patient: User,
  consultation: ClipboardList,
  pharmacy: Pill,
};

const items: SectionNavItem<OutPatientSectionId>[] = outPatientSections.map(
  (section) => ({
    id: section.id,
    label: section.label,
    icon: sectionIcons[section.id],
  }),
);

const OutPatientSectionNav = ({
  activeSection,
  collapsed = false,
  onToggle,
  onChange,
}: OutPatientSectionNavProps) => (
  <SectionNav
    activeSection={activeSection}
    items={items}
    menuLabel="Out Patient Menu"
    ariaLabel="Out Patient sections"
    collapseLabel="Collapse out patient menu"
    expandLabel="Expand out patient menu"
    collapsed={collapsed}
    onToggle={onToggle}
    onChange={onChange}
  />
);

export default OutPatientSectionNav;
