import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";

type Locale = "en" | "de" | "es" | "fr" | "nl" | "it";

const localeMeta: Record<Locale, { title: string; description: string; lang: string }> = {
  en: {
    title: "Canary Villas — Luxury Holiday Villas in Fuerteventura",
    description: "Book stunning beachfront holiday villas in Corralejo, Fuerteventura. Direct booking, best price guaranteed.",
    lang: "en",
  },
  de: {
    title: "Canary Villas — Luxus Ferienvillen auf Fuerteventura",
    description: "Strandvillen in Corralejo, Fuerteventura buchen. Direktbuchung, Bestpreisgarantie.",
    lang: "de",
  },
  es: {
    title: "Canary Villas — Villas de Lujo en Fuerteventura",
    description: "Reserve villas vacacionales frente al mar en Corralejo, Fuerteventura. Reserva directa, mejor precio garantizado.",
    lang: "es",
  },
  fr: {
    title: "Canary Villas — Villas de Luxe à Fuerteventura",
    description: "Réservez des villas de vacances en bord de mer à Corralejo, Fuerteventura. Réservation directe, meilleur prix garanti.",
    lang: "fr",
  },
  nl: {
    title: "Canary Villas — Luxe Vakantievilla's op Fuerteventura",
    description: "Boek strandvilla's in Corralejo, Fuerteventura. Direct boeken, beste prijs gegarandeerd.",
    lang: "nl",
  },
  it: {
    title: "Canary Villas — Ville di Lusso a Fuerteventura",
    description: "Prenota ville vacanza fronte mare a Corralejo, Fuerteventura. Prenotazione diretta, miglior prezzo garantito.",
    lang: "it",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = localeMeta[locale as Locale] ?? localeMeta.en;
  const base = "https://canaryvillas.com";
  return {
    title: { default: meta.title, template: "%s | Canary Villas" },
    description: meta.description,
    alternates: {
      canonical: locale === "en" ? base : `${base}/${locale}`,
      languages: {
        en: base,
        de: `${base}/de`,
        es: `${base}/es`,
        fr: `${base}/fr`,
        nl: `${base}/nl`,
        it: `${base}/it`,
        "x-default": base,
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();

  const messages = await getMessages({ locale } as { locale: string });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
