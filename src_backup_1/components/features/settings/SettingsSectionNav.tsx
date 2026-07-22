"use client";

import { ListChecks, UserCog } from "lucide-react";

import { CollapsiblePanel } from "@/src/components/ui";

import { settingsSections } from "./data";
import type {
  SettingsSectionId,
  SettingsSectionNavProps,
} from "./types";

const sectionIcons = {
  "user-access": UserCog,
  mandatories: ListChecks,
};

const SettingsSectionNav = ({
  activeSection,
  collapsed = false,
  onToggle,
  onChange,
}: SettingsSectionNavProps) => {
  return (
    <CollapsiblePanel
      collapsed={collapsed}
      onToggle={onToggle ?? (() => undefined)}
      collapseLabel="Collapse settings menu"
      expandLabel="Expand settings menu"
      expandedWidth={180}
      collapsedWidth={56}
      togglePosition="top"
      className="p-2"
    >
      <div
        className={`mb-3 flex h-9 items-center px-2 ${
          collapsed ? "invisible" : ""
        }`}
      >
        <p className="whitespace-nowrap text-sm font-semibold text-slate-900">
          Settings Menu
        </p>
      </div>

      <nav className="space-y-2" aria-label="Settings sections">
        {settingsSections.map((section) => {
          const Icon = sectionIcons[section.id];
          const active = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onChange(section.id as SettingsSectionId)}
              aria-label={section.label}
              title={collapsed ? section.label : undefined}
              className={`group flex h-10 w-full items-center gap-2.5 rounded-xl px-2.5 text-left transition-all ${
                collapsed ? "justify-center !px-1.5" : ""
              } ${
                active
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-slate-600 hover:bg-white hover:text-primary hover:shadow-sm"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  active ? "bg-white/15" : "text-primary"
                }`}
              >
                <Icon size={16} />
              </span>

              <span className={`min-w-0 flex-1 ${collapsed ? "hidden" : ""}`}>
                <span className="block whitespace-nowrap text-xs font-semibold">
                  {section.label}
                </span>
              </span>
            </button>
          );
        })}
      </nav>
    </CollapsiblePanel>
  );
};

export default SettingsSectionNav;
