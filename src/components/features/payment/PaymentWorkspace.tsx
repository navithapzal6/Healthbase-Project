"use client";

import { TransactionWorkspace } from "@/src/components/templates/transaction";

import { paymentConfig } from "./config";
import PaymentEntryForm from "./PaymentEntryForm";
import { paymentService } from "./service";
import PaymentTable from "./PaymentTable";

const PaymentWorkspace = () => (
  <TransactionWorkspace
    config={paymentConfig}
    service={paymentService}
    EntryForm={PaymentEntryForm}
    TableView={PaymentTable}
  />
);

export default PaymentWorkspace;
