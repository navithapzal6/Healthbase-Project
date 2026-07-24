"use client";

import { ListChecks, UserCog } from "lucide-react";

import { SectionNav, type SectionNavItem } from "@/src/components/ui";

import { settingsSections } from "./data";
import type { SettingsSectionId, SettingsSectionNavProps } from "./types";

const sectionIcons = {
  "user-access": UserCog,
  mandatories: ListChecks,
};

const items: SectionNavItem<SettingsSectionId>[] = settingsSections.map(
  (section) => ({
    id: section.id,
    label: section.label,
    icon: sectionIcons[section.id],
  }),
);

const SettingsSectionNav = ({
  activeSection,
  collapsed = false,
  onToggle,
  onChange,
}: SettingsSectionNavProps) => (
  <SectionNav
    activeSection={activeSection}
    items={items}
    menuLabel="Settings Menu"
    ariaLabel="Settings sections"
    collapseLabel="Collapse settings menu"
    expandLabel="Expand settings menu"
    collapsed={collapsed}
    onToggle={onToggle}
    onChange={onChange}
  />
);

export default SettingsSectionNav;
