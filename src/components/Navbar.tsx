"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Palmtree, Globe, ChevronDown } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
  en: "EN", de: "DE", es: "ES", fr: "FR", nl: "NL", it: "IT",
};
const localeFlags: Record<string, string> = {
  en: "🇬🇧", de: "🇩🇪", es: "🇪🇸", fr: "🇫🇷", nl: "🇳🇱", it: "🇮🇹",
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currency, setCurrency } = useCurrency();
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    if (!langOpen) return;
    const handler = () => setLangOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [langOpen]);

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm shadow-sm"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={localizedHref("/")} className="flex items-center gap-2 font-bold text-xl shrink-0">
            <Palmtree className="w-6 h-6 text-sky-500" />
            <span className="text-sky-700">Canary Villas</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={localizedHref(l.href)}
                className="text-sm font-medium text-gray-600 hover:text-sky-500 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop right controls */}
          <div className="hidden md:flex items-center gap-3">

            {/* Currency toggle */}
            <div className="flex items-center rounded-full border border-gray-200 overflow-hidden text-xs font-semibold">
              <button
                onClick={() => setCurrency("EUR")}
                className={`px-3 py-1.5 transition-colors ${currency === "EUR" ? "bg-sky-500 text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                € EUR
              </button>
              <button
                onClick={() => setCurrency("GBP")}
                className={`px-3 py-1.5 transition-colors ${currency === "GBP" ? "bg-sky-500 text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                £ GBP
              </button>
            </div>

            {/* Language switcher */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-sky-500 border border-gray-200 rounded-full px-3 py-1.5 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                {localeFlags[locale]} {localeLabels[locale]}
                <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50 min-w-[120px]">
                  {routing.locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => switchLocale(loc)}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-sky-50 transition-colors ${locale === loc ? "bg-sky-50 text-sky-600 font-semibold" : "text-gray-700"}`}
                    >
                      {localeFlags[loc]} {localeLabels[loc]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Book Now CTA */}
            <Link
              href={localizedHref("/villas")}
              className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              {t("bookNow")}
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 border border-gray-200 rounded-full px-2.5 py-1.5"
              >
                <Globe className="w-4 h-4" />
                {localeFlags[locale]}
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50 min-w-[120px]">
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
            <button className="text-gray-700 hover:text-sky-500 p-1" onClick={() => setOpen(!open)}>
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={localizedHref(l.href)}
                className="block text-gray-700 font-medium py-2.5 border-b border-gray-50 last:border-0"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 flex items-center gap-2">
              <div className="flex items-center rounded-full border border-gray-200 overflow-hidden text-xs font-semibold">
                <button onClick={() => setCurrency("EUR")} className={`px-3 py-1.5 ${currency === "EUR" ? "bg-sky-500 text-white" : "text-gray-500"}`}>€ EUR</button>
                <button onClick={() => setCurrency("GBP")} className={`px-3 py-1.5 ${currency === "GBP" ? "bg-sky-500 text-white" : "text-gray-500"}`}>£ GBP</button>
              </div>
            </div>
            <Link
              href={localizedHref("/villas")}
              className="block bg-sky-500 text-white text-center px-4 py-3 rounded-full font-semibold mt-3"
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
