import type { OutPatientContentProps } from "./types";

const OutPatientContent = ({ section }: OutPatientContentProps) => {
  return (
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-white p-4">
      <div className="shrink-0 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900">{section.label}</h2>
      </div>

      <div className="min-h-0 flex-1" />
    </section>
  );
};

export default OutPatientContent;
