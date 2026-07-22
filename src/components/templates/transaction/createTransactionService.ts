import { logger } from "@/src/core/logger";

import type {
  NewTransactionPayload,
  TransactionConfig,
  TransactionContact,
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
    if (!contact) return [];

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
    async list() {
      await wait(450);
      serviceLogger.debug("Transaction records loaded", {
        count: records.length,
      });
      return [...records];
    },

    async listByContact(contactId: string) {
      await wait(300);

      const existing = historyStore.get(contactId);
      if (existing) {
        serviceLogger.debug("Contact history loaded from cache", {
          contactId,
          count: existing.length,
        });
        return [...existing];
      }

      const history = createContactHistory(contactId);
      historyStore.set(contactId, history);
      serviceLogger.debug("Contact history generated", {
        contactId,
        count: history.length,
      });
      return [...history];
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
  };
};
