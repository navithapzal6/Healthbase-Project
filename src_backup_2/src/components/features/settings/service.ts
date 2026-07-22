import { mandatoryRecords, userAccessRecords } from "./data";
import type { MandatoryRecord, UserAccessRecord } from "./types";

const wait = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

export const settingsService = {
  async listUserAccess(): Promise<UserAccessRecord[]> {
    await wait(300);
    return userAccessRecords;
  },
  async listMandatories(): Promise<MandatoryRecord[]> {
    await wait(300);
    return mandatoryRecords;
  },
  async assignUserAccess(
    records: UserAccessRecord[],
  ): Promise<UserAccessRecord[]> {
    await wait(250);
    return records;
  },
  async removeUserAccess(recordId: string): Promise<string> {
    await wait(200);
    return recordId;
  },
  async updateMandatoryAssignments(
    recordIds: string[],
    assigned: boolean,
  ): Promise<{ recordIds: string[]; assigned: boolean }> {
    await wait(250);
    return { recordIds, assigned };
  },
};
