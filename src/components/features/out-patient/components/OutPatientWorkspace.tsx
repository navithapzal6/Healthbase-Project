"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { outPatientSections } from "../data";
import OutPatientContent from "./OutPatientContent";
import OutPatientSectionNav from "./OutPatientSectionNav";
import type { OutPatientSectionId } from "../types";

const isOutPatientSection = (
  value: string | null,
): value is OutPatientSectionId =>
  value === "patient" ||
  value === "consultation" ||
  value === "prescription";

const OutPatientWorkspace = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [menuCollapsed, setMenuCollapsed] = useState(false);
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

  const changeSection = (nextSection: OutPatientSectionId) => {
    router.replace(`/out-patient?section=${nextSection}`, {
      scroll: false,
    });
  };

  return (
    <div className="flex h-full min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <OutPatientSectionNav
        activeSection={activeSection}
        collapsed={menuCollapsed}
        onToggle={() => setMenuCollapsed((current) => !current)}
        onChange={changeSection}
      />
      <OutPatientContent section={section} />
    </div>
  );
};

export default OutPatientWorkspace;
