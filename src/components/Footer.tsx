"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Palmtree } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Palmtree className="w-6 h-6 text-sky-400" />
              <span className="text-white font-bold text-xl">Canary Villas</span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-sm">{t("desc")}</p>
            <div className="mt-6 space-y-2">
              <a href="mailto:info@canaryvillas.com" className="flex items-center gap-2 text-gray-400 hover:text-sky-400 transition-colors">
                <Mail className="w-4 h-4" /> info@canaryvillas.com
              </a>
              <a href="tel:+447809870561" className="flex items-center gap-2 text-gray-400 hover:text-sky-400 transition-colors">
                <Phone className="w-4 h-4" /> +44 7809 870561
              </a>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" /> Corralejo, Fuerteventura, Spain
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t("villas")}</h3>
            <ul className="space-y-2">
              <li><Link href={`${prefix}/villas/beach-house`} className="hover:text-sky-400 transition-colors">The Beach House</Link></li>
              <li><Link href={`${prefix}/villas/bungalow-apartment`} className="hover:text-sky-400 transition-colors">Bungalow Apartment</Link></li>
              <li><Link href={`${prefix}/villas`} className="hover:text-sky-400 transition-colors">{t("villas")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">{t("info")}</h3>
            <ul className="space-y-2">
              <li><Link href={`${prefix}/contact`} className="hover:text-sky-400 transition-colors">{t("contact")}</Link></li>
              <li><Link href={`${prefix}/privacy`} className="hover:text-sky-400 transition-colors">{t("privacy")}</Link></li>
              <li><Link href={`${prefix}/terms`} className="hover:text-sky-400 transition-colors">{t("terms")}</Link></li>
              <li><Link href={`${prefix}/blog`} className="hover:text-sky-400 transition-colors">{t("blog")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">{t("rights", { year: new Date().getFullYear() })}</p>
          <p className="text-gray-500 text-sm">Corralejo, Fuerteventura, Canary Islands, Spain</p>
        </div>
      </div>
    </footer>
  );
}
