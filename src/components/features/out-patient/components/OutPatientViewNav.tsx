"use client";

import { List, Plus } from "lucide-react";

import { Button } from "@/src/components/ui";

import type { OutPatientViewId } from "../types";

interface OutPatientViewNavProps {
  activeView: OutPatientViewId;
  createLabel: string;
  onChange: (view: OutPatientViewId) => void;
}

const viewButtonClass = (
  activeView: OutPatientViewId,
  view: OutPatientViewId,
) =>
  `inline-flex h-8 min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold transition ${
    activeView === view
      ? "bg-primary text-white shadow-sm"
      : "text-slate-500 hover:bg-white hover:text-primary"
  }`;

const OutPatientViewNav = ({
  activeView,
  createLabel,
  onChange,
}: OutPatientViewNavProps) => (
  <div
    className="inline-flex w-[146px] shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-1"
    aria-label="Page view"
  >
    <Button
      unstyled
      type="button"
      onClick={() => onChange("list")}
      aria-pressed={activeView === "list"}
      className={`${viewButtonClass(activeView, "list")} w-[68px] shrink-0`}
    >
      <List size={15} />
      List
    </Button>

    <Button
      unstyled
      type="button"
      onClick={() => onChange("entry")}
      aria-pressed={activeView === "entry"}
      aria-label={createLabel}
      title={createLabel}
      className={`${viewButtonClass(activeView, "entry")} flex-1`}
    >
      <Plus size={15} />
      New
    </Button>
  </div>
);

export default OutPatientViewNav;
