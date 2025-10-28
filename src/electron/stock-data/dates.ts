import { format } from "date-fns";

// Stooq date format is YYYYMMDD

export function convertStringDateToStooqDate(date: string) {
  return date.replaceAll("-", "");
}

export function convertNativeDateToStooqDate(date: Date) {
  return format(date, 'yyyyMMdd');
}