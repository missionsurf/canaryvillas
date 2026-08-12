import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de", "es", "fr", "nl", "it"],
  defaultLocale: "en",
  localePrefix: "as-needed", // /en is omitted, /de shows prefix
});
