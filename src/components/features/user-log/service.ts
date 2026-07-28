import { logger } from "@/src/core/logger";
import {
  createArrayListSource,
  type ListChunkRequest,
} from "@/src/core/query";

import { userLogRecords } from "./data";
import type { UserLogFilters, UserLogRecord } from "./types";

const wait = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const userLogLogger = logger.child("user-log-service");
let records = [...userLogRecords];

export const userLogService = {
  listChunk(request: ListChunkRequest<UserLogFilters>) {
    return createArrayListSource<UserLogRecord, UserLogFilters>({
      items: records,
      searchableText: (record) =>
        `${record.user} ${record.date} ${record.logIn} ${record.logOut}`,
      filter: (record, filters) =>
        !filters.userId || record.userId === filters.userId,
      compare: (first, second, sortBy) =>
        String(first[sortBy as keyof UserLogRecord]).localeCompare(
          String(second[sortBy as keyof UserLogRecord]),
        ),
      delayMs: 350,
    })(request);
  },

  async remove(recordIds: string[]): Promise<number> {
    await wait(300);
    const idSet = new Set(recordIds);
    const before = records.length;
    records = records.filter((record) => !idSet.has(record.id));
    const removed = before - records.length;
    userLogLogger.info("User log records removed", {
      count: removed,
      recordIds,
    });
    return removed;
  },
};
