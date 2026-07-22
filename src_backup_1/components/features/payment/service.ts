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

export const transactionService = {
  async list(module: TransactionModule): Promise<PaymentRecord[]> {
    await wait(450);
    return [...stores[module]];
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
    console.log(`${config.singular} API payload`, payload);
    return record;
  },
};

export const paymentService = {
  list: () => transactionService.list("payment"),
  create: (payload: NewPaymentPayload) => transactionService.create("payment", payload),
};
