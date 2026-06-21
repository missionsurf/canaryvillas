export const dynamic = "force-dynamic";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Holiday Villas to Rent in Fuerteventura | Beachfront Villas Corralejo",
  description: "Luxury holiday villas to rent in Fuerteventura. Beachfront villas in Corralejo with private terraces, sea views & year-round sunshine. Book direct — best price guaranteed.",
alternates: { canonical: "https://canaryvillas.com" },
  openGraph: {
    title: "Holiday Villas to Rent in Fuerteventura | Canary Villas",
    description: "Luxury beachfront villas in Corralejo, Fuerteventura. Direct booking, best price guaranteed.",
    url: "https://canaryvillas.com",
    type: "website",
    images: [{ url: "https://canaryvillas.com/wp-content/uploads/2024/11/header-1.jpg", width: 1200, height: 630, alt: "Beachfront holiday villa in Fuerteventura" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Holiday Villas to Rent in Fuerteventura | Canary Villas",
    description: "Luxury beachfront villas in Corralejo, Fuerteventura. Direct booking, best price guaranteed.",
  },
};

import Image from "next/image";
import Link from "next/link";
import { getAllVillas } from "@/lib/villas";
import VillaCard from "@/components/VillaCard";
import {
  Waves,
  Sun,
  Wind,
  Star,
  ShieldCheck,
  CreditCard,
  Headphones,
  Quote,
  BadgeCheck,

  Phone,
} from "lucide-react";

const reviews = [
  {
    author: "Sarah M.",
    location: "London, UK",
    rating: 5,
    date: "2025-02-10",
    text: "Absolutely stunning villa — the terrace and sea views were breathtaking. Everything was spotless and exactly as described. The team were incredibly helpful when we had a question on arrival. Will definitely be back!",
    villa: "Corralejo beachfront villa",
  },
  {
    author: "Marco V.",
    location: "Munich, Germany",
    rating: 5,
    date: "2025-01-18",
    text: "Wir haben unseren Familienurlaub hier verbracht und können es nur empfehlen. Perfect location, incredible value booking direct — saved over €400 vs Airbnb prices. The kids loved the pool.",
    villa: "Corralejo villa",
  },
  {
    author: "James & Claire H.",
    location: "Manchester, UK",
    rating: 5,
    date: "2024-12-28",
    text: "Third time staying with Canary Villas — says it all really. The villa is immaculate, the booking process is easy, and the team go above and beyond. Fuerteventura in January beats anywhere in the UK!",
    villa: "Corralejo beachfront villa",
  },
  {
    author: "Annika L.",
    location: "Stockholm, Sweden",
    rating: 5,
    date: "2025-03-05",
    text: "We kitesurfed every day at Flag Beach — 5 minutes from the villa. The property itself is beautiful and extremely well equipped. We'll be recommending Canary Villas to all our friends.",
    villa: "Corralejo villa",
  },
];

const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Canary Villas",
  url: "https://canaryvillas.com",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "47",
    bestRating: "5",
    worstRating: "1",
  },
  review: reviews.map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.author },
    datePublished: r.date,
    reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
    reviewBody: r.text,
  })),
};

export default async function HomePage() {
  const villas = await getAllVillas();

  const features = [
    { icon: ShieldCheck, title: "Secure Direct Booking", desc: "Book directly with us for the best price. No middleman fees." },
    { icon: CreditCard, title: "Flexible Payment", desc: "Pay securely online via card. Simple and straightforward." },
    { icon: Headphones, title: "24/7 Support", desc: "Our local team is always on hand before and during your stay." },
  ];

  const activities = [
    { icon: Waves, title: "Surfing & Windsurfing", desc: "World-class conditions at Corralejo and Flag Beach." },
    { icon: Wind, title: "Kite Surfing", desc: "Fuerteventura is one of Europe's top kite surfing destinations." },
    { icon: Sun, title: "Beach & Relaxation", desc: "Miles of pristine white sandy beaches with year-round sunshine." },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }} />

      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center text-white">
        <Image
          src="https://canaryvillas.com/wp-content/uploads/2024/11/header-1.jpg"
          alt="Beachfront villa in Fuerteventura"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-sky-300 text-sm font-semibold uppercase tracking-widest mb-4">
            Corralejo, Fuerteventura
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
            Your Perfect Canary Islands Escape
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stunning beachfront villas with sea views, private terraces, and
            direct beach access. Book direct for the best price.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/villas"
              className="bg-sky-500 hover:bg-sky-400 text-white px-8 py-4 rounded-full text-lg font-bold transition-colors shadow-lg"
            >
              Browse Villas
            </Link>
            <a
              href="#why-fuerteventura"
              className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors"
            >
              Learn More
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 mt-10 text-amber-400">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
            <span className="text-white ml-2 font-medium">5.0 — Rated Excellent</span>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4 items-start p-6 rounded-2xl bg-sky-50">
                <div className="bg-sky-500 p-3 rounded-xl shrink-0">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
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
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Our Holiday Villas
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Hand-picked properties in the best locations in Corralejo, from beachfront
              villas to charming private bungalows.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {villas.map((v) => (
              <VillaCard key={v.id} villa={v} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/villas"
              className="inline-block bg-gray-900 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-semibold transition-colors"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Why Fuerteventura */}
      <section id="why-fuerteventura" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sky-500 font-semibold uppercase tracking-wide text-sm mb-3">The Island</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
                Why Fuerteventura?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Fuerteventura is a gem of the Canary Islands, famed for its miles of pristine
                white sandy beaches, crystal-clear Atlantic waters, and sunshine virtually
                every day of the year.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Corralejo, our base, is a vibrant town with an authentic local feel —
                great restaurants, lively bars, boutique shops, and a relaxed atmosphere
                that keeps guests returning year after year.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                With warm water temperatures year-round, it&apos;s a world-class destination for
                water sports including surfing, windsurfing, wing foiling and kite surfing —
                as well as simply unwinding on some of Europe&apos;s finest beaches.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { stat: "320+", label: "Sunny days per year" },
                  { stat: "22°C", label: "Average temperature" },
                  { stat: "5★", label: "Guest rated" },
                ].map((s) => (
                  <div key={s.stat} className="bg-sky-50 rounded-2xl p-4">
                    <div className="text-2xl font-extrabold text-sky-600">{s.stat}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-96 lg:h-full min-h-80 rounded-3xl overflow-hidden">
              <Image
                src="https://canaryvillas.com/wp-content/uploads/2024/11/trees1.jpg"
                alt="Palm trees and beaches in Fuerteventura"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Book Direct */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Why Book Direct with Canary Villas?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">We&apos;re an independent family-run villa agency based in Corralejo. When you book direct, every penny goes to the people who actually look after your villa.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BadgeCheck, title: "Best Price Guaranteed", desc: "Book direct and pay less than any OTA. No platform commission added to your price." },
              { icon: Phone, title: "Local Team on the Ground", desc: "We're based in Corralejo. Call us any time before or during your stay." },
              { icon: ShieldCheck, title: "Secure Card Payments", desc: "Stripe-powered checkout. Your payment is protected and fully encrypted." },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-start p-6 rounded-2xl border border-gray-100 bg-gray-50">
                <div className="bg-sky-100 p-3 rounded-xl mb-4">
                  <item.icon className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corralejo intro — content depth for Google */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Corralejo, Fuerteventura — The Perfect Villa Holiday Base</h2>
          <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
            <p>
              Corralejo sits on the northern tip of <strong>Fuerteventura</strong>, the second-largest of the Canary Islands, just a short ferry ride from Lanzarote and three and a half hours by plane from the UK. It enjoys over 320 days of sunshine per year and average temperatures of 22°C — making it one of Europe&apos;s most reliable year-round sun destinations.
            </p>
            <p>
              The town is home to the spectacular <strong>Corralejo Dunes Natural Park</strong>, a protected UNESCO-recognised reserve of rolling white sand dunes that stretch for kilometres along the coast. Just beyond are some of the best <Link href="/blog/kitesurfing-fuerteventura-guide" className="text-sky-600 hover:underline">kitesurfing</Link> and <Link href="/blog/windsurfing-fuerteventura" className="text-sky-600 hover:underline">windsurfing</Link> conditions in the world — Flag Beach and Sotavento regularly host world championship events.
            </p>
            <p>
              Staying in a villa here gives you space and freedom that a hotel simply can&apos;t match. Private terraces for morning coffee with ocean views, room for the whole family or a group of friends, and the flexibility to cook fresh local fish from the market or head out to one of Corralejo&apos;s excellent restaurants whenever you please. Our villas put you within walking distance of the beach, the shops, and the water sports schools — everything you need for a <Link href="/blog/things-to-do-corralejo" className="text-sky-600 hover:underline">perfect holiday in Fuerteventura</Link>.
            </p>
            <p>
              Whether you&apos;re planning a <Link href="/blog/family-holidays-fuerteventura" className="text-sky-600 hover:underline">family holiday</Link>, a watersports trip, a winter sun escape, or a romantic getaway, Canary Villas has the right property for you — and our direct booking guarantee means you&apos;ll always get the best price.
            </p>
          </div>
          <div className="text-center mt-8">
            <Link href="/blog" className="inline-block border-2 border-sky-500 text-sky-600 hover:bg-sky-50 px-6 py-3 rounded-full font-semibold text-sm transition-colors">
              Read our Fuerteventura Travel Guides
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">What Our Guests Say</h2>
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-2">
              {[1,2,3,4,5].map((i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <p className="text-gray-500">4.9 / 5 — based on 47 verified guest reviews</p>
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
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
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
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Things to Do
            </h2>
            <p className="text-sky-200 text-lg max-w-2xl mx-auto">
              Whether you&apos;re an adrenaline seeker or prefer to relax, Fuerteventura has it all.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activities.map((a) => (
              <div key={a.title} className="bg-sky-800 rounded-2xl p-8 text-center">
                <div className="inline-flex bg-sky-600 p-4 rounded-2xl mb-5">
                  <a.icon className="w-8 h-8 text-white" />
                </div>
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
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Ready to Book Your Dream Holiday?
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Book direct and save. No booking fees, flexible cancellation, and the
            best rates guaranteed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/villas"
              className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-colors"
            >
              Check Availability
            </Link>
            <a
              href="mailto:info@canaryvillas.com"
              className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
