export type PaymentMode = "Cash" | "UPI" | "Bank Transfer" | "Cheque" | "Card";

export interface PaymentContact {
  id: string;
  name: string;
  reference: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  contactId: string;
  contactName: string;
  category: string;
  paymentMode: PaymentMode;
  description: string;
  amount: number;
}

export type NewPaymentPayload = Omit<PaymentRecord, "id" | "contactName">;

export interface PaymentFormValues {
  date: string;
  contactId: string;
  category: string;
  paymentMode: PaymentMode | "";
  description: string;
  amount: string;
}
