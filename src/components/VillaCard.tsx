"use client";

import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Users, Star } from "lucide-react";
import type { Villa } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { useTranslations, useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

export default function VillaCard({ villa }: { villa: Villa }) {
  const { format } = useCurrency();
  const t = useTranslations("villas");
  const locale = useLocale();
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group flex flex-col">
      <Link href={`${prefix}/villas/${villa.slug}`} className="relative h-64 overflow-hidden block">
        <Image
          src={villa.images[0]}
          alt={villa.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4 bg-sky-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
          {t("fromPerNight", { price: format(villa.pricePerNight) })}
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">{villa.name}</h3>
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium text-gray-600">5.0</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-1">{villa.location}</p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{villa.shortDesc}</p>

        <div className="flex items-center gap-4 text-gray-500 text-sm mb-5">
          <span className="flex items-center gap-1">
            <Bed className="w-4 h-4" /> {villa.bedrooms} bed{villa.bedrooms > 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-4 h-4" /> {villa.bathrooms} bath{villa.bathrooms > 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" /> Up to {villa.maxGuests}
          </span>
        </div>

        <div className="mt-auto">
          <Link
            href={`${prefix}/villas/${villa.slug}`}
            className="block w-full bg-sky-500 hover:bg-sky-400 text-white text-center py-4 rounded-xl font-bold text-lg tracking-wide transition-all shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 hover:-translate-y-0.5"
          >
            {t("viewBook")}
          </Link>
        </div>
      </div>
    </div>
  );
}
