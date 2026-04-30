import { format as formatFns } from "date-fns";
import { arSA } from "date-fns/locale";

/**
 * @file src/lib/formatters.ts
 * @description THE REINFORCED TIME RESOLVER (STERILIZED - SC-806 V5.8)
 * Protocol 16: Sterilized Universal Date Resolver.
 * NO 'use client' - Must be accessible by Server Components and Middleware.
 */

export const formatDate = (date: any, formatString: string = "d MMMM yyyy", locale: string): string => {
  if (!date) return "";
  try {
    let dateObj: Date;

    if (typeof date?.toDate === "function") {
      dateObj = date.toDate();
    } else if (typeof date?.seconds === "number") {
      dateObj = new Date(date.seconds * 1000);
    } else if (typeof date === "string") {
      dateObj = new Date(date);
    } else {
      dateObj = new Date(date);
    }

    if (isNaN(dateObj.getTime())) return "تاريخ غير صالح";

    return formatFns(dateObj, formatString, { locale: arSA });
  } catch {
    return "تاريخ غير صالح";
  }
};

export const combineDateAndTime = (date: Date, timeString: string): Date => {
  const [hours, minutes] = timeString.split(":");
  const newDate = new Date(date);
  newDate.setHours(parseInt(hours, 10));
  newDate.setMinutes(parseInt(minutes, 10));
  newDate.setSeconds(0, 0);
  return newDate;
};
