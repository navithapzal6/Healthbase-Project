import { paymentContacts } from "./data";
import { transactionConfigs } from "./moduleConfig";
import type { TransactionModule } from "./moduleConfig";
import type { NewPaymentPayload, PaymentRecord } from "./types";

const wait = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration));
const stores: Record<TransactionModule, PaymentRecord[]> = {
  payment: [...transactionConfigs.payment.initialRecords],
  receipt: [...transactionConfigs.receipt.initialRecords],
  expense: [...transactionConfigs.expense.initialRecords],
};

const historyStores: Record<
  TransactionModule,
  Map<string, PaymentRecord[]>
> = {
  payment: new Map(),
  receipt: new Map(),
  expense: new Map(),
};

const historyRecordCount = 50;

const createContactHistory = (
  module: TransactionModule,
  contactId: string,
): PaymentRecord[] => {
  const contact = paymentContacts.find((item) => item.id === contactId);
  if (!contact) return [];

  const config = transactionConfigs[module];
  const sourceRecords = stores[module];

  return Array.from({ length: historyRecordCount }, (_, index) => {
    const source = sourceRecords[index % sourceRecords.length];

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

export const transactionService = {
  async list(module: TransactionModule): Promise<PaymentRecord[]> {
    await wait(450);
    return [...stores[module]];
  },
  async listByContact(
    module: TransactionModule,
    contactId: string,
  ): Promise<PaymentRecord[]> {
    await wait(300);

    const existing = historyStores[module].get(contactId);
    if (existing) return [...existing];

    const history = createContactHistory(module, contactId);
    historyStores[module].set(contactId, history);
    return [...history];
  },
  async create(module: TransactionModule, payload: NewPaymentPayload): Promise<PaymentRecord> {
    await wait(500);
    const contact = paymentContacts.find((item) => item.id === payload.contactId);
    if (!contact) throw new Error("Selected contact was not found");
    const config = transactionConfigs[module];
    const record: PaymentRecord = {
      ...payload,
      id: `${config.prefix}-${String(stores[module].length + 1).padStart(4, "0")}`,
      contactName: contact.name,
    };
    stores[module] = [record, ...stores[module]];

    const contactHistory = historyStores[module].get(payload.contactId);
    if (contactHistory) {
      historyStores[module].set(payload.contactId, [record, ...contactHistory]);
    }

    console.log(`${config.singular} API payload`, payload);
    return record;
  },
};

export const paymentService = {
  list: () => transactionService.list("payment"),
  create: (payload: NewPaymentPayload) => transactionService.create("payment", payload),
};
