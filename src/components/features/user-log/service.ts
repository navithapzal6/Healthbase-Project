import { userLogRecords } from "./data";
import type { UserLogRecord } from "./types";

const wait = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

export const userLogService = {
  async list(): Promise<UserLogRecord[]> {
    await wait(350);
    return userLogRecords;
  },
};
