import { createTransactionService } from "@/src/components/templates/transaction";

import { expenseConfig } from "./config";
import { expenseContacts } from "./data";

export const expenseService = createTransactionService(
  expenseConfig,
  expenseContacts,
);
