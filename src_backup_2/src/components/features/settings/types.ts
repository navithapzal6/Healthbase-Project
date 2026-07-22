export type SettingsSectionId = "user-access" | "mandatories";

export interface SettingsSection {
  id: SettingsSectionId;
  label: string;
  description: string;
}

export interface UserAccessMenuOption {
  id: string;
  label: string;
  description?: string;
  submenus?: readonly string[];
}

export interface UserAccessRecord {
  id: string;
  user: string;
  menuId: string;
  menu: string;
}

export interface MandatoryFieldOption {
  id: string;
  label: string;
}

export interface MandatoryFieldGroup {
  id: string;
  label: string;
  fields: readonly MandatoryFieldOption[];
}

export interface MandatoryMenuOption {
  id: string;
  label: string;
  groups: readonly MandatoryFieldGroup[];
}

export interface MandatoryRecord {
  id: string;
  menuId: string;
  menu: string;
  groupId: string;
  group: string;
  fieldId: string;
  field: string;
  assigned: boolean;
}

export type SettingsEditTarget =
  | {
      section: "user-access";
      user: string;
    }
  | {
      section: "mandatories";
      menuId: string;
      menu: string;
    };

export interface SettingsAssignmentItem {
  id: string;
  label: string;
  assigned: boolean;
  group?: string;
  description?: string;
  details?: readonly string[];
}

export interface SettingsSectionNavProps {
  activeSection: SettingsSectionId;
  collapsed?: boolean;
  onToggle?: () => void;
  onChange: (section: SettingsSectionId) => void;
}
