"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export type CookieConsent = "accepted" | "declined" | null;

const STORAGE_KEY = "cv_cookie_consent";

export function getConsent(): CookieConsent {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem(STORAGE_KEY) as CookieConsent) ?? null;
}

export function setConsent(value: "accepted" | "declined") {
  localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new Event("cv_consent_change"));
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsent() === null) setVisible(true);
  }, []);

  if (!visible) return null;

  function accept() {
    setConsent("accepted");
    setVisible(false);
  }

  function decline() {
    setConsent("declined");
    setVisible(false);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 flex justify-center">
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl max-w-2xl w-full px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Cookie className="w-8 h-8 text-sky-400 shrink-0 mt-0.5 sm:mt-0" />
        <div className="flex-1 text-sm text-gray-300 leading-relaxed">
          We use cookies to embed Google Maps on villa pages and to process secure payments via Stripe. Strictly necessary cookies (booking session) are always active.{" "}
          <Link href="/privacy" className="text-sky-400 hover:underline">
            Privacy Policy
          </Link>
        </div>
        <div className="flex gap-3 shrink-0 flex-wrap">
          <button
            onClick={decline}
            className="text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 px-4 py-2 rounded-full transition-colors"
          >
            Decline optional
          </button>
          <button
            onClick={accept}
            className="text-sm bg-sky-500 hover:bg-sky-400 text-white font-semibold px-5 py-2 rounded-full transition-colors"
          >
            Accept all
          </button>
        </div>
        <button
          onClick={decline}
          className="absolute top-3 right-3 sm:hidden text-gray-500 hover:text-white"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
