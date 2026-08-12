import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de", "es", "fr", "nl", "it"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeCookie: true, // persist chosen locale so Accept-Language doesn't override it
});
