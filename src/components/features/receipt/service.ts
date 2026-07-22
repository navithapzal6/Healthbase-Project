import { createTransactionService } from "@/src/components/templates/transaction";

import { receiptConfig } from "./config";
import { receiptContacts } from "./data";

export const receiptService = createTransactionService(
  receiptConfig,
  receiptContacts,
);
