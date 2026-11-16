"use client";

import { useEffect, useRef } from "react";

interface Props {
  propId: string;
  villaName: string;
  pricePerNight: number;
}

export default function Beds24Widget({ propId, villaName, pricePerNight }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Resize iframe to fit content
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (!containerRef.current) return;
      const iframe = containerRef.current.querySelector("iframe");
      if (!iframe) return;
      if (typeof e.data === "object" && e.data?.beds24Height) {
        iframe.style.height = `${e.data.beds24Height}px`;
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const iframeSrc = `https://beds24.com/booking3.php?propid=${propId}&target=iframe&lang=en`;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
      <div className="bg-sky-500 text-white px-6 py-5">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold">€{pricePerNight.toFixed(0)}</span>
          <span className="text-sky-100">/ night</span>
        </div>
        <p className="text-sky-100 text-sm mt-1">{villaName}</p>
      </div>
      <div ref={containerRef}>
        <iframe
          src={iframeSrc}
          style={{ width: "100%", minHeight: "600px", border: "none", display: "block" }}
          title={`Book ${villaName}`}
          loading="lazy"
          allow="payment"
        />
      </div>
    </div>
  );
}
