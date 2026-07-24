"use client";

import CollapsiblePanel from "../collapsible-panel/CollapsiblePanel";
import type { SectionNavProps } from "./types";

const SectionNav = <TId extends string>({
  activeSection,
  items,
  menuLabel,
  ariaLabel,
  collapseLabel,
  expandLabel,
  collapsed = false,
  onToggle,
  onChange,
}: SectionNavProps<TId>) => {
  return (
    <CollapsiblePanel
      collapsed={collapsed}
      onToggle={onToggle ?? (() => undefined)}
      collapseLabel={collapseLabel}
      expandLabel={expandLabel}
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
          {menuLabel}
        </p>
      </div>

      <nav className="space-y-2" aria-label={ariaLabel}>
        {items.map((section) => {
          const Icon = section.icon;
          const active = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onChange(section.id)}
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

export default SectionNav;
