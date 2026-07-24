"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { outPatientSections } from "./data";
import OutPatientContent from "./OutPatientContent";
import type { OutPatientSectionId } from "./types";

const isOutPatientSection = (
  value: string | null,
): value is OutPatientSectionId =>
  value === "patient" || value === "consultation" || value === "pharmacy";

const OutPatientWorkspace = () => {
  const searchParams = useSearchParams();
  const requestedSection = searchParams.get("section");
  const activeSection: OutPatientSectionId = isOutPatientSection(requestedSection)
    ? requestedSection
    : "patient";

  const section = useMemo(
    () =>
      outPatientSections.find((item) => item.id === activeSection) ??
      outPatientSections[0],
    [activeSection],
  );

  return (
    <div className="flex h-full min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <OutPatientContent section={section} />
    </div>
  );
};

export default OutPatientWorkspace;
