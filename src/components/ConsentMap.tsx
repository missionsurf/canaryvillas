"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { getConsent, setConsent, type CookieConsent } from "./CookieBanner";

interface Props {
  lat: number;
  lng: number;
  title: string;
}

export default function ConsentMap({ lat, lng, title }: Props) {
  const [consent, setConsentState] = useState<CookieConsent>(null);

  useEffect(() => {
    setConsentState(getConsent());
    const handler = () => setConsentState(getConsent());
    window.addEventListener("cv_consent_change", handler);
    return () => window.removeEventListener("cv_consent_change", handler);
  }, []);

  function enableMaps() {
    setConsent("accepted");
  }

  if (consent === "accepted") {
    return (
      <iframe
        title={title}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
      />
    );
  }

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-3 text-center p-6">
      <MapPin className="w-10 h-10 text-sky-400" />
      <p className="font-medium text-gray-700 text-sm">
        Map hidden — Google Maps uses cookies
      </p>
      <button
        onClick={enableMaps}
        className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
      >
        Enable maps &amp; accept cookies
      </button>
    </div>
  );
}
