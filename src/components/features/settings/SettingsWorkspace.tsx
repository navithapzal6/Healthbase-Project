"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmationDialog, toast } from "@/src/components/ui";
import { logger } from "@/src/core/logger";

import {
  mandatoryMenuOptions,
  mandatoryRecords as initialMandatoryRecords,
  settingsSections,
  settingsUsers,
  userAccessMenuOptions,
  userAccessRecords as initialUserAccessRecords,
} from "./data";
import { settingsService } from "./service";
import SettingsAssignmentModal from "./SettingsAssignmentModal";
import SettingsListPanel from "./SettingsListPanel";
import SettingsSectionNav from "./SettingsSectionNav";
import type {
  MandatoryRecord,
  SettingsAssignmentItem,
  SettingsEditTarget,
  SettingsSectionId,
  UserAccessRecord,
} from "./types";

const isSettingsSection = (
  value: string | null,
): value is SettingsSectionId =>
  value === "user-access" || value === "mandatories";

const createAccessId = (user: string, menuId: string) =>
  `user-access-${user.toLowerCase().replaceAll(" ", "-")}-${menuId}-${Date.now()}`;

type PendingAssignmentAction =
  | {
      type: "assign";
      section: SettingsSectionId;
      itemIds: string[];
    }
  | {
      type: "remove";
      section: SettingsSectionId;
      itemId: string;
      itemLabel: string;
    };

const settingsLogger = logger.child("settings");

const SettingsWorkspace = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] =
    useState<SettingsSectionId>("user-access");
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [userAccessRecords, setUserAccessRecords] = useState<
    UserAccessRecord[]
  >(() => [...initialUserAccessRecords]);
  const [mandatoryRecords, setMandatoryRecords] = useState<MandatoryRecord[]>(
    () => [...initialMandatoryRecords],
  );
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editingMandatoryMenuId, setEditingMandatoryMenuId] = useState<
    string | null
  >(null);
  const [savingAssignment, setSavingAssignment] = useState(false);
  const [pendingAssignmentAction, setPendingAssignmentAction] =
    useState<PendingAssignmentAction | null>(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const section = new URLSearchParams(window.location.search).get("section");

    if (isSettingsSection(section)) setActiveSection(section);
  }, []);

  useEffect(() => {
    let active = true;

    Promise.all([
      settingsService.listUserAccess(),
      settingsService.listMandatories(),
    ])
      .then(([accessData, mandatoryData]) => {
        if (!active) return;
        setUserAccessRecords(accessData);
        setMandatoryRecords(mandatoryData);
      })
      .catch((error) => {
        settingsLogger.error("Unable to load settings data", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const section = useMemo(
    () =>
      settingsSections.find((item) => item.id === activeSection) ??
      settingsSections[0],
    [activeSection],
  );

  const editingMandatoryMenu = useMemo(
    () =>
      mandatoryMenuOptions.find(
        (menu) => menu.id === editingMandatoryMenuId,
      ) ?? null,
    [editingMandatoryMenuId],
  );

  const userAssignmentItems = useMemo<SettingsAssignmentItem[]>(() => {
    const assignedMenuIds = new Set(
      userAccessRecords
        .filter((record) => record.user === editingUser)
        .map((record) => record.menuId),
    );

    return userAccessMenuOptions.map((menu) => ({
      id: menu.id,
      label: menu.label,
      description: menu.description,
      details: menu.submenus,
      assigned: assignedMenuIds.has(menu.id),
    }));
  }, [editingUser, userAccessRecords]);

  const mandatoryAssignmentItems = useMemo<SettingsAssignmentItem[]>(() => {
    if (!editingMandatoryMenu) return [];

    const hasSubmenus = editingMandatoryMenu.groups.length > 1;

    return mandatoryRecords
      .filter((record) => record.menuId === editingMandatoryMenu.id)
      .map((record) => ({
        id: record.id,
        label: record.field,
        group: hasSubmenus ? record.group : undefined,
        assigned: record.assigned,
      }));
  }, [editingMandatoryMenu, mandatoryRecords]);

  const changeSection = (nextSection: SettingsSectionId) => {
    setActiveSection(nextSection);
    setEditingUser(null);
    setEditingMandatoryMenuId(null);
    setPendingAssignmentAction(null);
    setPendingDeleteIds([]);
    router.replace(`/settings?section=${nextSection}`, { scroll: false });
  };

  const editSetting = (target: SettingsEditTarget) => {
    setPendingAssignmentAction(null);
    setPendingDeleteIds([]);

    if (target.section === "user-access") {
      setEditingMandatoryMenuId(null);
      setEditingUser(target.user);
      return;
    }

    setEditingUser(null);
    setEditingMandatoryMenuId(target.menuId);
  };

  const assignUserMenus = async (menuIds: string[]) => {
    if (!editingUser || !menuIds.length) return;

    const existingMenuIds = new Set(
      userAccessRecords
        .filter((record) => record.user === editingUser)
        .map((record) => record.menuId),
    );
    const newRecords = menuIds
      .filter((menuId) => !existingMenuIds.has(menuId))
      .map((menuId) => {
        const option = userAccessMenuOptions.find(
          (menu) => menu.id === menuId,
        );

        return {
          id: createAccessId(editingUser, menuId),
          user: editingUser,
          menuId,
          menu: option?.label ?? menuId,
        } satisfies UserAccessRecord;
      });

    if (!newRecords.length) return;
    setSavingAssignment(true);

    try {
      const created = await settingsService.assignUserAccess(newRecords);
      setUserAccessRecords((current) => [...current, ...created]);

      toast.success({
        title: "Menu access assigned",
        description: `${created.length} ${
          created.length === 1 ? "menu" : "menus"
        } assigned to ${editingUser}.`,
      });
    } catch (error) {
      settingsLogger.error("Unable to assign user access", error, {
        user: editingUser,
        menuIds,
      });
      toast.error({
        title: "Unable to assign access",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSavingAssignment(false);
    }
  };

  const removeUserMenu = async (menuId: string) => {
    const record = userAccessRecords.find(
      (item) => item.user === editingUser && item.menuId === menuId,
    );
    if (!record) return;

    setSavingAssignment(true);

    try {
      await settingsService.removeUserAccess(record.id);
      setUserAccessRecords((current) =>
        current.filter((item) => item.id !== record.id),
      );

      toast.success({
        title: "Menu access removed",
        description: `${record.menu} access removed from ${record.user}.`,
      });
    } catch (error) {
      settingsLogger.error("Unable to remove user access", error, {
        user: editingUser,
        menuId,
      });
      toast.error({
        title: "Unable to remove access",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSavingAssignment(false);
    }
  };

  const assignMandatoryFields = async (recordIds: string[]) => {
    if (!recordIds.length || !editingMandatoryMenu) return;
    setSavingAssignment(true);

    try {
      await settingsService.updateMandatoryAssignments(recordIds, true);
      setMandatoryRecords((current) =>
        current.map((record) =>
          recordIds.includes(record.id)
            ? { ...record, assigned: true }
            : record,
        ),
      );

      toast.success({
        title: "Mandatory fields assigned",
        description: `${recordIds.length} ${
          recordIds.length === 1 ? "field" : "fields"
        } assigned for ${editingMandatoryMenu.label}.`,
      });
    } catch (error) {
      settingsLogger.error("Unable to assign mandatory fields", error, {
        menuId: editingMandatoryMenu.id,
        recordIds,
      });
      toast.error({
        title: "Unable to assign fields",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSavingAssignment(false);
    }
  };

  const removeMandatoryField = async (recordId: string) => {
    const record = mandatoryRecords.find((item) => item.id === recordId);
    if (!record) return;
    setSavingAssignment(true);

    try {
      await settingsService.updateMandatoryAssignments([recordId], false);
      setMandatoryRecords((current) =>
        current.map((item) =>
          item.id === recordId ? { ...item, assigned: false } : item,
        ),
      );

      toast.success({
        title: "Mandatory field removed",
        description: `${record.field} is now unassigned for ${record.menu}.`,
      });
    } catch (error) {
      settingsLogger.error("Unable to remove mandatory field", error, {
        recordId,
      });
      toast.error({
        title: "Unable to remove field",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSavingAssignment(false);
    }
  };

  const deleteSettings = async () => {
    if (!pendingDeleteIds.length) return;
    setDeleting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (activeSection === "user-access") {
        setUserAccessRecords((current) =>
          current.filter((record) => !pendingDeleteIds.includes(record.id)),
        );
      } else {
        await settingsService.updateMandatoryAssignments(
          pendingDeleteIds,
          false,
        );
        setMandatoryRecords((current) =>
          current.map((record) =>
            pendingDeleteIds.includes(record.id)
              ? { ...record, assigned: false }
              : record,
          ),
        );
      }

      toast.success({
        title:
          activeSection === "user-access"
            ? "User access cleared"
            : "Mandatory fields cleared",
        description: `${pendingDeleteIds.length} ${
          pendingDeleteIds.length === 1 ? "assignment" : "assignments"
        } removed.`,
      });

      setPendingDeleteIds([]);
    } catch (error) {
      settingsLogger.error("Unable to clear settings assignments", error, {
        section: activeSection,
        recordIds: pendingDeleteIds,
      });
      toast.error({
        title: "Unable to clear assignments",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const confirmAssignmentAction = async () => {
    if (!pendingAssignmentAction) return;

    const action = pendingAssignmentAction;

    if (action.section === "user-access") {
      if (action.type === "assign") {
        await assignUserMenus(action.itemIds);
      } else {
        await removeUserMenu(action.itemId);
      }
    } else if (action.type === "assign") {
      await assignMandatoryFields(action.itemIds);
    } else {
      await removeMandatoryField(action.itemId);
    }

    setPendingAssignmentAction(null);
  };

  const pendingAssignmentItemName =
    pendingAssignmentAction?.section === "user-access" ? "menu" : "field";
  const pendingAssignmentCount =
    pendingAssignmentAction?.type === "assign"
      ? pendingAssignmentAction.itemIds.length
      : 1;

  return (
    <>
      <div className="flex h-full min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <SettingsSectionNav
          activeSection={activeSection}
          collapsed={menuCollapsed}
          onToggle={() => setMenuCollapsed((current) => !current)}
          onChange={changeSection}
        />

        <SettingsListPanel
          section={section}
          userOptions={settingsUsers}
          userAccessMenuOptions={userAccessMenuOptions}
          mandatoryMenuOptions={mandatoryMenuOptions}
          userAccessRecords={userAccessRecords}
          mandatoryRecords={mandatoryRecords}
          onEdit={editSetting}
          onDelete={setPendingDeleteIds}
        />
      </div>

      <SettingsAssignmentModal
        open={Boolean(editingUser)}
        title="Edit User Access"
        subtitle={
          editingUser ? `Manage menu access for ${editingUser}` : undefined
        }
        subject={editingUser}
        subjectType="user"
        itemLabel="menu"
        items={userAssignmentItems}
        saving={savingAssignment}
        onClose={() =>
          !savingAssignment &&
          !pendingAssignmentAction &&
          setEditingUser(null)
        }
        onAssign={(itemIds) =>
          setPendingAssignmentAction({
            type: "assign",
            section: "user-access",
            itemIds,
          })
        }
        onRemove={(itemId) => {
          const item = userAssignmentItems.find(
            (option) => option.id === itemId,
          );
          setPendingAssignmentAction({
            type: "remove",
            section: "user-access",
            itemId,
            itemLabel: item?.label ?? "menu access",
          });
        }}
      />

      <SettingsAssignmentModal
        open={Boolean(editingMandatoryMenu)}
        title="Edit Mandatories"
        subtitle={
          editingMandatoryMenu
            ? `Manage required fields for ${editingMandatoryMenu.label}`
            : undefined
        }
        subject={editingMandatoryMenu?.label ?? null}
        subjectType="menu"
        itemLabel="field"
        items={mandatoryAssignmentItems}
        saving={savingAssignment}
        onClose={() =>
          !savingAssignment &&
          !pendingAssignmentAction &&
          setEditingMandatoryMenuId(null)
        }
        onAssign={(itemIds) =>
          setPendingAssignmentAction({
            type: "assign",
            section: "mandatories",
            itemIds,
          })
        }
        onRemove={(itemId) => {
          const item = mandatoryAssignmentItems.find(
            (option) => option.id === itemId,
          );
          setPendingAssignmentAction({
            type: "remove",
            section: "mandatories",
            itemId,
            itemLabel: item?.label ?? "mandatory field",
          });
        }}
      />

      <ConfirmationDialog
        open={pendingAssignmentAction !== null}
        title={
          pendingAssignmentAction?.type === "remove"
            ? `Remove ${pendingAssignmentItemName}?`
            : `Assign selected ${pendingAssignmentItemName}${
                pendingAssignmentCount === 1 ? "" : "s"
              }?`
        }
        description={
          pendingAssignmentAction?.type === "remove"
            ? `${pendingAssignmentAction.itemLabel} will be removed from the current assignment.`
            : `${pendingAssignmentCount} selected ${
                pendingAssignmentCount === 1
                  ? pendingAssignmentItemName
                  : `${pendingAssignmentItemName}s`
              } will be assigned.`
        }
        confirmText={
          pendingAssignmentAction?.type === "remove" ? "Remove" : "Assign"
        }
        variant={
          pendingAssignmentAction?.type === "remove" ? "danger" : "primary"
        }
        loading={savingAssignment}
        onConfirm={confirmAssignmentAction}
        onCancel={() =>
          !savingAssignment && setPendingAssignmentAction(null)
        }
      />

      <ConfirmationDialog
        open={pendingDeleteIds.length > 0}
        title={
          activeSection === "user-access"
            ? "Clear selected user access?"
            : "Clear selected mandatory fields?"
        }
        description={`You are about to remove ${pendingDeleteIds.length} ${
          pendingDeleteIds.length === 1 ? "assignment" : "assignments"
        }. This action can be reassigned later.`}
        confirmText="Clear"
        variant="danger"
        loading={deleting}
        onConfirm={deleteSettings}
        onCancel={() => !deleting && setPendingDeleteIds([])}
      />
    </>
  );
};

export default SettingsWorkspace;
