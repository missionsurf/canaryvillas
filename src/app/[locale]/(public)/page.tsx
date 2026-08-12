export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { getAllVillas } from "@/lib/villas";
import VillaCard from "@/components/VillaCard";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import {
  Waves, Sun, Wind, Star, ShieldCheck, CreditCard,
  Headphones, Quote, BadgeCheck, Phone,
} from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home.hero");
  return {
    title: "Holiday Villas to Rent in Fuerteventura | Beachfront Villas Corralejo",
    description: t("sub"),
    alternates: { canonical: "https://canaryvillas.com" },
    openGraph: {
      title: "Holiday Villas to Rent in Fuerteventura | Canary Villas",
      description: t("sub"),
      url: "https://canaryvillas.com",
      type: "website",
      images: [{ url: "https://canaryvillas.com/wp-content/uploads/2024/11/header-1.jpg", width: 1200, height: 630 }],
    },
  };
}

const reviews = [
  { author: "Sarah M.", location: "London, UK", rating: 5, date: "2025-02-10", text: "Absolutely stunning villa — the terrace and sea views were breathtaking. Everything was spotless and exactly as described. The team were incredibly helpful when we had a question on arrival. Will definitely be back!" },
  { author: "Marco V.", location: "Munich, Germany", rating: 5, date: "2025-01-18", text: "Wir haben unseren Familienurlaub hier verbracht und können es nur empfehlen. Perfect location, incredible value booking direct — saved over €400 vs Airbnb prices. The kids loved the pool." },
  { author: "James & Claire H.", location: "Manchester, UK", rating: 5, date: "2024-12-28", text: "Third time staying with Canary Villas — says it all really. The villa is immaculate, the booking process is easy, and the team go above and beyond. Fuerteventura in January beats anywhere in the UK!" },
  { author: "Annika L.", location: "Stockholm, Sweden", rating: 5, date: "2025-03-05", text: "We kitesurfed every day at Flag Beach — 5 minutes from the villa. The property itself is beautiful and extremely well equipped. We'll be recommending Canary Villas to all our friends." },
];

const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Canary Villas",
  url: "https://canaryvillas.com",
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "47", bestRating: "5", worstRating: "1" },
  review: reviews.map((r) => ({ "@type": "Review", author: { "@type": "Person", name: r.author }, datePublished: r.date, reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 }, reviewBody: r.text })),
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const villas = await getAllVillas();
  const t = await getTranslations("home");
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;

  const features = [
    { icon: ShieldCheck, title: t("features.secureBooking"), desc: t("features.secureBookingDesc") },
    { icon: CreditCard, title: t("features.flexPayment"), desc: t("features.flexPaymentDesc") },
    { icon: Headphones, title: t("features.support"), desc: t("features.supportDesc") },
  ];

  const activities = [
    { icon: Waves, title: t("activities.surf"), desc: t("activities.surfDesc") },
    { icon: Wind, title: t("activities.kite"), desc: t("activities.kiteDesc") },
    { icon: Sun, title: t("activities.beach"), desc: t("activities.beachDesc") },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />

      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center text-white">
        <Image src="https://canaryvillas.com/wp-content/uploads/2024/11/header-1.jpg" alt="Beachfront villa in Fuerteventura" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-sky-300 text-sm font-semibold uppercase tracking-widest mb-4">{t("hero.tagline")}</p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">{t("hero.h1")}</h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">{t("hero.sub")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`${prefix}/villas`} className="bg-sky-500 hover:bg-sky-400 text-white px-8 py-4 rounded-full text-lg font-bold transition-colors shadow-lg">{t("hero.browseVillas")}</Link>
            <a href="#why-fuerteventura" className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors">{t("hero.learnMore")}</a>
          </div>
          <div className="flex items-center justify-center gap-2 mt-10 text-amber-400">
            {[1,2,3,4,5].map((i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            <span className="text-white ml-2 font-medium">{t("hero.rated")}</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4 items-start p-6 rounded-2xl bg-sky-50">
                <div className="bg-sky-500 p-3 rounded-xl shrink-0"><f.icon className="w-6 h-6 text-white" /></div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-gray-600 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Villas */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{t("villas.heading")}</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">{t("villas.sub")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {villas.map((v) => <VillaCard key={v.id} villa={v} />)}
          </div>
          <div className="text-center mt-12">
            <Link href={`${prefix}/villas`} className="inline-block bg-gray-900 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-semibold transition-colors">{t("villas.viewAll")}</Link>
          </div>
        </div>
      </section>

      {/* Why Fuerteventura */}
      <section id="why-fuerteventura" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sky-500 font-semibold uppercase tracking-wide text-sm mb-3">{t("why.island")}</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">{t("why.heading")}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">{t("why.p1")}</p>
              <p className="text-gray-600 leading-relaxed mb-4">{t("why.p2")}</p>
              <p className="text-gray-600 leading-relaxed mb-8">{t("why.p3")}</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { stat: "320+", label: t("why.sunny") },
                  { stat: "22°C", label: t("why.avgTemp") },
                  { stat: "5★", label: t("why.guestRated") },
                ].map((s) => (
                  <div key={s.stat} className="bg-sky-50 rounded-2xl p-4">
                    <div className="text-2xl font-extrabold text-sky-600">{s.stat}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-96 lg:h-full min-h-80 rounded-3xl overflow-hidden">
              <Image src="https://canaryvillas.com/wp-content/uploads/2024/11/trees1.jpg" alt="Palm trees and beaches in Fuerteventura" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Book Direct */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">{t("direct.heading")}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">{t("direct.sub")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BadgeCheck, title: t("direct.bestPrice"), desc: t("direct.bestPriceDesc") },
              { icon: Phone, title: t("direct.local"), desc: t("direct.localDesc") },
              { icon: ShieldCheck, title: t("direct.secure"), desc: t("direct.secureDesc") },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-start p-6 rounded-2xl border border-gray-100 bg-gray-50">
                <div className="bg-sky-100 p-3 rounded-xl mb-4"><item.icon className="w-6 h-6 text-sky-600" /></div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corralejo content section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Corralejo, Fuerteventura — The Perfect Villa Holiday Base</h2>
          <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
            <p>Corralejo sits on the northern tip of <strong>Fuerteventura</strong>, the second-largest of the Canary Islands, just a short ferry ride from Lanzarote and three and a half hours by plane from the UK.</p>
            <p>The town is home to the spectacular <strong>Corralejo Dunes Natural Park</strong>, a protected reserve of rolling white sand dunes. Just beyond are some of the best <Link href={`${prefix}/blog/kitesurfing-fuerteventura-guide`} className="text-sky-600 hover:underline">kitesurfing</Link> and <Link href={`${prefix}/blog/windsurfing-fuerteventura`} className="text-sky-600 hover:underline">windsurfing</Link> conditions in the world.</p>
            <p>Our villas put you within walking distance of the beach, the shops, and the water sports schools — everything you need for a <Link href={`${prefix}/blog/things-to-do-corralejo`} className="text-sky-600 hover:underline">perfect holiday in Fuerteventura</Link>.</p>
          </div>
          <div className="text-center mt-8">
            <Link href={`${prefix}/blog`} className="inline-block border-2 border-sky-500 text-sky-600 hover:bg-sky-50 px-6 py-3 rounded-full font-semibold text-sm transition-colors">{t("hero.learnMore")}</Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">{t("reviews.heading")}</h2>
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
              {[1,2,3,4,5].map((i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <p className="text-gray-500">4.9 / 5 — {t("reviews.based")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div key={review.author} className="bg-gray-50 rounded-2xl p-7 border border-gray-100">
                <Quote className="w-8 h-8 text-sky-200 mb-3" />
                <p className="text-gray-700 leading-relaxed mb-5 italic">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{review.author}</p>
                    <p className="text-gray-400 text-xs">{review.location}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section id="activities" className="py-20 bg-sky-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{t("activities.heading")}</h2>
            <p className="text-sky-200 text-lg max-w-2xl mx-auto">{t("activities.sub")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activities.map((a) => (
              <div key={a.title} className="bg-sky-800 rounded-2xl p-8 text-center">
                <div className="inline-flex bg-sky-600 p-4 rounded-2xl mb-5"><a.icon className="w-8 h-8 text-white" /></div>
                <h3 className="text-xl font-bold mb-3">{a.title}</h3>
                <p className="text-sky-200">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{t("cta.heading")}</h2>
          <p className="text-gray-500 text-lg mb-8">{t("cta.sub")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`${prefix}/villas`} className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-colors">{t("cta.checkAvail")}</Link>
            <a href="mailto:info@canaryvillas.com" className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold transition-colors">{t("cta.contactUs")}</a>
          </div>
        </div>
      </section>
    </>
  );
}
