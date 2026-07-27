import { Eraser, Save } from "lucide-react";

import { Button } from "@/src/components/ui";

interface FormActionsProps {
  saving?: boolean;
  submitLabel?: string;
  onClear: () => void;
}

const FormActions = ({
  saving = false,
  submitLabel = "Save",
  onClear,
}: FormActionsProps) => (
  <div className="mt-4 flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 pt-4">
    <Button
      type="button"
      variant="outline"
      size="sm"
      leftIcon={<Eraser size={16} />}
      disabled={saving}
      onClick={onClear}
    >
      Clear
    </Button>
    <Button
      type="submit"
      size="sm"
      leftIcon={<Save size={16} />}
      loading={saving}
    >
      {submitLabel}
    </Button>
  </div>
);

export default FormActions;
