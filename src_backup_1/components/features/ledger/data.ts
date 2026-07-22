import type {
  LedgerRecord,
  LedgerSection,
  LedgerSectionId,
} from "./types";

export const ledgerSections: LedgerSection[] = [
  {
    id: "unit",
    label: "Unit Ledger",
    description: "Business unit and operating ledgers",
  },
  {
    id: "expense",
    label: "Expense Ledger",
    description: "Recurring and operational expenses",
  },
  {
    id: "bank",
    label: "Bank Accounts",
    description: "Connected business bank accounts",
  },
];

const createRecords = (
  section: LedgerSectionId,
  rows: Array<[name: string, description: string, createdAt: string]>,
): LedgerRecord[] =>
  rows.map(([name, description, createdAt], index) => ({
    id: `${section}-${index + 1}`,
    name,
    description,
    createdAt,
  }));

export const initialLedgerRecords: Record<LedgerSectionId, LedgerRecord[]> = {
  unit: createRecords("unit", [
    ["Head Office", "Primary administration and operations unit", "18 Jul 2026"],
    ["Pollachi Branch", "Pollachi sales and service operations", "16 Jul 2026"],
    ["Warehouse Unit", "Inventory receiving and dispatch unit", "12 Jul 2026"],
    ["Coimbatore Branch", "Regional sales and customer support", "10 Jul 2026"],
    ["Chennai Office", "Corporate sales and client servicing", "08 Jul 2026"],
    ["Madurai Branch", "Southern region business operations", "06 Jul 2026"],
    ["Production Unit", "Manufacturing and production activities", "04 Jul 2026"],
    ["Service Center", "Product service and maintenance unit", "02 Jul 2026"],
    ["Retail Outlet", "Direct retail sales operations", "30 Jun 2026"],
    ["Project Office", "Project planning and execution team", "28 Jun 2026"],
    ["Training Center", "Employee learning and development", "25 Jun 2026"],
    ["Quality Unit", "Quality assurance and compliance", "22 Jun 2026"],
    ["Dispatch Center", "Order packing and dispatch operations", "20 Jun 2026"],
    ["Support Office", "Internal administration support", "18 Jun 2026"],
  ]),
  expense: createRecords("expense", [
    ["Office Rent", "Monthly office and workspace rental", "15 Jul 2026"],
    ["Utilities", "Electricity, water and internet charges", "10 Jul 2026"],
    ["Travel Expense", "Employee and operational travel costs", "08 Jul 2026"],
    ["Staff Welfare", "Employee welfare and engagement costs", "06 Jul 2026"],
    ["Office Supplies", "Stationery and daily office consumables", "04 Jul 2026"],
    ["Vehicle Expense", "Fuel, toll and vehicle maintenance", "02 Jul 2026"],
    ["Marketing", "Campaign and promotional activities", "30 Jun 2026"],
    ["Software Subscription", "Business software subscription fees", "28 Jun 2026"],
    ["Professional Fees", "Consulting and professional services", "25 Jun 2026"],
    ["Repairs", "Office equipment repair and maintenance", "22 Jun 2026"],
    ["Courier Charges", "Document and parcel delivery charges", "20 Jun 2026"],
    ["Insurance", "Business asset and employee insurance", "18 Jun 2026"],
    ["Telephone", "Business mobile and telephone expenses", "15 Jun 2026"],
    ["Bank Charges", "Transaction and account service charges", "12 Jun 2026"],
  ]),
  bank: createRecords("bank", [
    ["HDFC Current Account", "Primary current account for collections", "14 Jul 2026"],
    ["ICICI Business Account", "Vendor and operating payment account", "09 Jul 2026"],
    ["Petty Cash Account", "Daily low-value business transactions", "05 Jul 2026"],
    ["SBI Current Account", "Government and institutional transactions", "02 Jul 2026"],
    ["Axis Collection Account", "Online and branch customer collections", "30 Jun 2026"],
    ["Kotak Payment Account", "Recurring vendor payment operations", "28 Jun 2026"],
    ["Canara Bank Account", "Local branch banking transactions", "25 Jun 2026"],
    ["Payroll Account", "Monthly salary and employee payments", "22 Jun 2026"],
    ["Tax Payment Account", "GST and statutory tax payments", "20 Jun 2026"],
    ["Security Deposit Account", "Refundable business deposits", "18 Jun 2026"],
    ["Cash in Hand", "Physical cash maintained by accounts", "15 Jun 2026"],
    ["UPI Collection Account", "Business UPI customer receipts", "12 Jun 2026"],
    ["POS Settlement Account", "Card machine settlement receipts", "10 Jun 2026"],
    ["Reserve Account", "Emergency and business reserve funds", "08 Jun 2026"],
  ]),
};
