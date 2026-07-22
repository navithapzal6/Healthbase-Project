"use client";

import { TransactionWorkspace } from "@/src/components/templates/transaction";

import { expenseConfig } from "./config";
import ExpenseEntryForm from "./ExpenseEntryForm";
import { expenseService } from "./service";
import ExpenseTable from "./ExpenseTable";

const ExpenseWorkspace = () => (
  <TransactionWorkspace
    config={expenseConfig}
    service={expenseService}
    EntryForm={ExpenseEntryForm}
    TableView={ExpenseTable}
  />
);

export default ExpenseWorkspace;
