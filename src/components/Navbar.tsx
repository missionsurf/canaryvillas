"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Palmtree, Phone } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { href: "/villas", label: "Our Villas" },
    { href: "/blog", label: "Travel Guide" },
    { href: "/#why-fuerteventura", label: "Why Fuerteventura" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Palmtree className="w-6 h-6 text-sky-500" />
            <span className="text-sky-700">Canary Villas</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
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
            <Link
              href="/villas"
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              Book Now
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
                href={l.href}
                className="block text-gray-700 font-medium py-2"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/villas"
              className="block bg-sky-500 text-white text-center px-4 py-3 rounded-full font-semibold mt-2"
              onClick={() => setOpen(false)}
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
