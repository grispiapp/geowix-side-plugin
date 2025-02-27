import { type ClassValue, clsx } from "clsx";
import { formatDistance as baseFormatDistance, format } from "date-fns";
import { tr } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

import { JwtToken } from "@/types/grispi.type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDistance(date: string) {
  return baseFormatDistance(new Date(date), new Date(), {
    addSuffix: true,
    locale: tr,
  });
}

export function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload) as JwtToken;
}

export const formatCallDate = (dateString: string) => {
  const timestamp = parseInt(dateString.match(/\d+/)?.[0] ?? "0");
  return format(new Date(timestamp), "dd.MM.yyyy HH:mm");
};
