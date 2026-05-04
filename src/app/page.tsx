export const dynamic = "force-dynamic";

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
} from "lucide-react";

export default async function HomePage() {
  const villas = await getAllVillas();

  const features = [
    { icon: ShieldCheck, title: "Secure Direct Booking", desc: "Book directly with us for the best price. No middleman fees." },
    { icon: CreditCard, title: "Flexible Payment", desc: "Pay securely online via card. Full refund if cancelled 60+ days out." },
    { icon: Headphones, title: "24/7 Support", desc: "Our local team is always on hand before and during your stay." },
  ];

  const activities = [
    { icon: Waves, title: "Surfing & Windsurfing", desc: "World-class conditions at Corralejo and Flag Beach." },
    { icon: Wind, title: "Kite Surfing", desc: "Fuerteventura is one of Europe's top kite surfing destinations." },
    { icon: Sun, title: "Beach & Relaxation", desc: "Miles of pristine white sandy beaches with year-round sunshine." },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1600&q=80"
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
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                alt="Fuerteventura beach"
                fill
                className="object-cover"
              />
            </div>
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
