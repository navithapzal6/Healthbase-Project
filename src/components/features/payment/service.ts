import { createTransactionService } from "@/src/components/templates/transaction";

import { paymentConfig } from "./config";
import { paymentContacts } from "./data";

export const paymentService = createTransactionService(
  paymentConfig,
  paymentContacts,
);
