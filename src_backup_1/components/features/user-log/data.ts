import { contacts } from "@/src/dummy-data/contacts";

import type { UserLogRecord } from "./types";

const dates = [
  "2026-07-21",
  "2026-07-20",
  "2026-07-19",
  "2026-07-18",
  "2026-07-17",
  "2026-07-16",
];

const logInTimes = ["08:46 AM", "09:02 AM", "09:18 AM", "08:55 AM"];
const logOutTimes = ["06:12 PM", "06:34 PM", "07:05 PM", "06:48 PM"];

export const userLogRecords: UserLogRecord[] = Array.from(
  { length: 30 },
  (_, index) => {
    const contact = contacts[index % contacts.length];

    return {
      id: `user-log-${index + 1}`,
      date: dates[index % dates.length],
      userId: String(contact.id),
      user: contact.name,
      logIn: logInTimes[index % logInTimes.length],
      logOut: index % 7 === 0 ? "Active Session" : logOutTimes[index % logOutTimes.length],
    };
  },
);
