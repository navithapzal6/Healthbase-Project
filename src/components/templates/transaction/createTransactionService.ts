import { logger } from "@/src/core/logger";
import { createArrayListSource } from "@/src/core/query";
import { parseAppDate } from "@/src/core/date";

import type {
  NewTransactionPayload,
  TransactionConfig,
  TransactionContact,
  TransactionListFilters,
  TransactionRecord,
  TransactionService,
} from "./types";

const wait = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const historyRecordCount = 50;

export const createTransactionService = (
  config: TransactionConfig,
  contacts: TransactionContact[],
): TransactionService => {
  let records: TransactionRecord[] = [...config.initialRecords];
  const historyStore = new Map<string, TransactionRecord[]>();
  const serviceLogger = logger.child(
    `transaction-service:${config.prefix.toLowerCase()}`,
  );

  const createContactHistory = (contactId: string): TransactionRecord[] => {
    const contact = contacts.find((item) => item.id === contactId);
    if (!contact || !records.length || !config.categories.length) return [];

    return Array.from({ length: historyRecordCount }, (_, index) => {
      const source = records[index % records.length];

      return {
        ...source,
        id: `${config.prefix}-H-${contactId}-${String(index + 1).padStart(3, "0")}`,
        contactId,
        contactName: contact.name,
        category: config.categories[index % config.categories.length],
        amount: source.amount + ((index * 275) % 5000),
      };
    });
  };

  return {
    listChunk(request) {
      serviceLogger.debug("Transaction chunk requested", {
        offset: request.offset,
        limit: request.limit,
      });

      return createArrayListSource<
        TransactionRecord,
        TransactionListFilters
      >({
        items: records,
        searchableText: (record) =>
          `${record.contactName} ${record.category} ${record.description} ${record.paymentMode}`,
        filter: (record, filters) =>
          !filters.paymentMode ||
          record.paymentMode === filters.paymentMode,
        compare: (first, second, sortBy) => {
          if (sortBy === "amount") return first.amount - second.amount;
          if (sortBy === "date") {
            return (
              (parseAppDate(first.date)?.getTime() ?? 0) -
              (parseAppDate(second.date)?.getTime() ?? 0)
            );
          }

          return String(
            first[sortBy as keyof TransactionRecord],
          ).localeCompare(
            String(second[sortBy as keyof TransactionRecord]),
          );
        },
        delayMs: 350,
      })(request);
    },

    async listByContactChunk(request) {
      const contactId = request.filters.contactId ?? "";
      const existing = historyStore.get(contactId);
      const history = existing ?? createContactHistory(contactId);

      if (!existing && contactId) {
        historyStore.set(contactId, history);
      }

      return createArrayListSource<
        TransactionRecord,
        TransactionListFilters
      >({
        items: history,
        searchableText: (record) =>
          `${record.category} ${record.description} ${record.paymentMode}`,
        compare: (first, second, sortBy) => {
          if (sortBy === "amount") return first.amount - second.amount;
          if (sortBy === "date") {
            return (
              (parseAppDate(first.date)?.getTime() ?? 0) -
              (parseAppDate(second.date)?.getTime() ?? 0)
            );
          }

          return String(
            first[sortBy as keyof TransactionRecord],
          ).localeCompare(
            String(second[sortBy as keyof TransactionRecord]),
          );
        },
        delayMs: 250,
      })(request);
    },

    async create(payload: NewTransactionPayload) {
      await wait(500);
      const contact = contacts.find((item) => item.id === payload.contactId);

      if (!contact) {
        serviceLogger.warn("Transaction creation rejected", {
          reason: "contact-not-found",
          contactId: payload.contactId,
        });
        throw new Error("Selected contact was not found");
      }

      const record: TransactionRecord = {
        ...payload,
        id: `${config.prefix}-${String(records.length + 1).padStart(4, "0")}`,
        contactName: contact.name,
      };

      records = [record, ...records];

      const contactHistory = historyStore.get(payload.contactId);
      if (contactHistory) {
        historyStore.set(payload.contactId, [record, ...contactHistory]);
      }

      serviceLogger.info("Transaction created", {
        id: record.id,
        contactId: record.contactId,
        amount: record.amount,
      });

      return record;
    },

    async remove(recordIds: string[]) {
      await wait(300);
      const idSet = new Set(recordIds);
      const before = records.length;
      records = records.filter((record) => !idSet.has(record.id));

      for (const [contactId, history] of historyStore.entries()) {
        historyStore.set(
          contactId,
          history.filter((record) => !idSet.has(record.id)),
        );
      }

      const removed = before - records.length;
      serviceLogger.info("Transactions removed", {
        count: removed,
        recordIds,
      });
      return removed;
    },
  };
};
