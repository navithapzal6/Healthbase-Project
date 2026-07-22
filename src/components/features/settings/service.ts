import { logger } from "@/src/core/logger";

import { mandatoryRecords, userAccessRecords } from "./data";
import type { MandatoryRecord, UserAccessRecord } from "./types";

const wait = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const settingsLogger = logger.child("settings-service");

export const settingsService = {
  async listUserAccess(): Promise<UserAccessRecord[]> {
    await wait(300);
    settingsLogger.debug("User access records loaded", {
      count: userAccessRecords.length,
    });
    return userAccessRecords;
  },

  async listMandatories(): Promise<MandatoryRecord[]> {
    await wait(300);
    settingsLogger.debug("Mandatory records loaded", {
      count: mandatoryRecords.length,
    });
    return mandatoryRecords;
  },

  async assignUserAccess(
    records: UserAccessRecord[],
  ): Promise<UserAccessRecord[]> {
    await wait(250);
    settingsLogger.info("User access assigned", {
      count: records.length,
      users: [...new Set(records.map((record) => record.user))],
      menuIds: records.map((record) => record.menuId),
    });
    return records;
  },

  async removeUserAccess(recordId: string): Promise<string> {
    await wait(200);
    settingsLogger.info("User access removed", { recordId });
    return recordId;
  },

  async updateMandatoryAssignments(
    recordIds: string[],
    assigned: boolean,
  ): Promise<{ recordIds: string[]; assigned: boolean }> {
    await wait(250);
    settingsLogger.info("Mandatory assignments updated", {
      count: recordIds.length,
      assigned,
      recordIds,
    });
    return { recordIds, assigned };
  },
};
