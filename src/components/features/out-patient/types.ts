export type OutPatientSectionId = "patient" | "consultation" | "pharmacy";

export interface OutPatientSection {
  id: OutPatientSectionId;
  label: string;
  description: string;
}

export interface OutPatientSectionNavProps {
  activeSection: OutPatientSectionId;
  collapsed?: boolean;
  onToggle?: () => void;
  onChange: (section: OutPatientSectionId) => void;
}

export interface OutPatientContentProps {
  section: OutPatientSection;
}
