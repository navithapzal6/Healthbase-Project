import { logger } from "@/src/core/logger";

import { userLogRecords } from "./data";
import type { UserLogRecord } from "./types";

const wait = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const userLogLogger = logger.child("user-log-service");

export const userLogService = {
  async list(): Promise<UserLogRecord[]> {
    await wait(350);
    userLogLogger.debug("User log records loaded", {
      count: userLogRecords.length,
    });
    return userLogRecords;
  },
};
