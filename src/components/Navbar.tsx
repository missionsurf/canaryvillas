"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Palmtree, Phone, Globe } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
  en: "EN",
  de: "DE",
  es: "ES",
  fr: "FR",
  nl: "NL",
  it: "IT",
};

const localeFlags: Record<string, string> = {
  en: "🇬🇧",
  de: "🇩🇪",
  es: "🇪🇸",
  fr: "🇫🇷",
  nl: "🇳🇱",
  it: "🇮🇹",
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function switchLocale(newLocale: string) {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    const locales = routing.locales as readonly string[];
    let path = pathname;
    for (const loc of locales) {
      if (path.startsWith(`/${loc}/`)) { path = path.slice(loc.length + 1); break; }
      if (path === `/${loc}`) { path = "/"; break; }
    }
    const newPath = newLocale === routing.defaultLocale ? path : `/${newLocale}${path}`;
    window.location.href = newPath;
    setLangOpen(false);
  }

  const links = [
    { href: "/villas", label: t("villas") },
    { href: "/blog", label: t("blog") },
    { href: "/#why-fuerteventura", label: t("why") },
    { href: "/contact", label: t("contact") },
  ];

  const localizedHref = (href: string) =>
    locale === routing.defaultLocale ? href : `/${locale}${href}`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={localizedHref("/")} className="flex items-center gap-2 font-bold text-xl">
            <Palmtree className="w-6 h-6 text-sky-500" />
            <span className="text-sky-700">Canary Villas</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={localizedHref(l.href)}
                className="text-sm font-medium text-gray-700 transition-colors hover:text-sky-500"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="tel:+447809870561"
              className="flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              <Phone className="w-4 h-4" />
              +44 7809 870561
            </a>

            {/* Currency toggle */}
            <div className="flex items-center rounded-full border border-gray-200 overflow-hidden text-sm font-semibold">
              <button
                onClick={() => setCurrency("EUR")}
                className={`px-3 py-1.5 transition-colors ${currency === "EUR" ? "bg-sky-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                € EUR
              </button>
              <button
                onClick={() => setCurrency("GBP")}
                className={`px-3 py-1.5 transition-colors ${currency === "GBP" ? "bg-sky-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                £ GBP
              </button>
            </div>

            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-sky-500 border border-gray-200 rounded-full px-3 py-1.5"
              >
                <Globe className="w-4 h-4" />
                {localeFlags[locale]} {localeLabels[locale]}
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50 min-w-[130px]">
                  {routing.locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => switchLocale(loc)}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-sky-50 ${locale === loc ? "bg-sky-50 text-sky-600 font-semibold" : "text-gray-700"}`}
                    >
                      {localeFlags[loc]} {localeLabels[loc]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={localizedHref("/villas")}
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              {t("bookNow")}
            </Link>
          </div>

          <button
            className="md:hidden text-gray-700 hover:text-sky-500 p-1"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={localizedHref(l.href)}
                className="block text-gray-700 font-medium py-2"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {/* Language options on mobile */}
            <div className="flex flex-wrap gap-2 py-2">
              {routing.locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => { switchLocale(loc); setOpen(false); }}
                  className={`text-xs px-3 py-1.5 rounded-full border ${locale === loc ? "bg-sky-500 text-white border-sky-500" : "border-gray-200 text-gray-600"}`}
                >
                  {localeFlags[loc]} {localeLabels[loc]}
                </button>
              ))}
            </div>
            <Link
              href={localizedHref("/villas")}
              className="block bg-sky-500 text-white text-center px-4 py-3 rounded-full font-semibold mt-2"
              onClick={() => setOpen(false)}
            >
              {t("bookNow")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
