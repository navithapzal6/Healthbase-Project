"use client";

import { TransactionWorkspace } from "@/src/components/templates/transaction";

import { receiptConfig } from "./config";
import ReceiptEntryForm from "./ReceiptEntryForm";
import { receiptService } from "./service";
import ReceiptTable from "./ReceiptTable";

const ReceiptWorkspace = () => (
  <TransactionWorkspace
    config={receiptConfig}
    service={receiptService}
    EntryForm={ReceiptEntryForm}
    TableView={ReceiptTable}
  />
);

export default ReceiptWorkspace;
