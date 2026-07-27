export const APP_DATE_FORMAT = "DD/MM/YYYY";

const appDatePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const isoDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

const pad = (value: number) => String(value).padStart(2, "0");

const createDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

export const parseAppDate = (value: string) => {
  const normalizedValue = value.trim();
  const appDateMatch = appDatePattern.exec(normalizedValue);

  if (appDateMatch) {
    const [, day, month, year] = appDateMatch;
    return createDate(Number(year), Number(month), Number(day));
  }

  // Keeps existing ISO records readable while every new value uses DD/MM/YYYY.
  const isoDateMatch = isoDatePattern.exec(normalizedValue);
  if (!isoDateMatch) return null;

  const [, year, month, day] = isoDateMatch;
  return createDate(Number(year), Number(month), Number(day));
};

export const formatAppDate = (
  value: string | Date,
  fallback = "",
) => {
  const date = value instanceof Date ? value : parseAppDate(value);
  if (!date || Number.isNaN(date.getTime())) return fallback;

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
};

export const toNativeDateValue = (value: string) => {
  const date = parseAppDate(value);
  if (!date) return "";

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const fromNativeDateValue = (value: string) =>
  formatAppDate(value);

export const todayAppDate = () => formatAppDate(new Date());

export const formatAppDateInput = (value: string) => {
  if (isoDatePattern.test(value.trim())) {
    return formatAppDate(value);
  }

  const digits = value.replace(/\D/g, "").slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  return [day, month, year].filter(Boolean).join("/");
};

export const isAppDate = (value: string) =>
  appDatePattern.test(value.trim()) && parseAppDate(value) !== null;
