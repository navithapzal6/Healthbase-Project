import { ClipboardList } from "lucide-react";

interface EmptyModulePageProps { title: string; description: string }

const EmptyModulePage = ({ title, description }: EmptyModulePageProps) => (
  <div className="flex h-full items-center justify-center">
    <div className="max-w-md rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><ClipboardList className="h-6 w-6" /></span>
      <h2 className="mt-4 text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  </div>
);

export default EmptyModulePage;
