"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2, ChevronDown } from "lucide-react";

interface Props {
  guestId: string;
  guestName: string;
  guestEmail: string;
}

type EmailType = "offer" | "custom";

export default function AdminGuestEmailComposer({ guestId, guestName, guestEmail }: Props) {
  const [type, setType] = useState<EmailType>("offer");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const [offer, setOffer] = useState({
    subject: "Exclusive offer just for you — Canary Villas",
    headline: "A Special Offer, Just for You",
    body: `As one of our valued guests, we'd love to welcome you back to Fuerteventura.\n\nWe're offering you an exclusive discount on your next stay. Book before the deadline to lock in this special rate.`,
    discountCode: "",
    discountText: "Your exclusive discount code",
    validUntil: "",
    ctaText: "Book Your Stay",
    ctaUrl: "https://canaryvillas.com",
  });

  const [custom, setCustom] = useState({ subject: "", body: "" });

  const setO = (k: keyof typeof offer, v: string) => setOffer((o) => ({ ...o, [k]: v }));
  const setC = (k: keyof typeof custom, v: string) => setCustom((c) => ({ ...c, [k]: v }));

  const send = async () => {
    setLoading(true);
    setError("");
    setSent(false);
    try {
      const payload = type === "offer"
        ? { type, ...offer }
        : { type: "custom", subject: custom.subject, body: custom.body };

      const res = await fetch(`/api/admin/guests/${guestId}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400">To: {guestName} &lt;{guestEmail}&gt;</p>

      {/* Type selector */}
      <div className="relative">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as EmailType)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm appearance-none bg-white pr-10 focus:ring-2 focus:ring-sky-500 outline-none"
        >
          <option value="offer">Special Offer / Promotion</option>
          <option value="custom">Custom Email</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Special offer form */}
      {type === "offer" && (
        <div className="space-y-3 bg-gray-50 rounded-xl p-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email subject</label>
            <input value={offer.subject} onChange={(e) => setO("subject", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Hero headline</label>
            <input value={offer.headline} onChange={(e) => setO("headline", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Message body</label>
            <textarea value={offer.body} onChange={(e) => setO("body", e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-sky-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Discount code <span className="text-gray-400">(optional)</span></label>
              <input value={offer.discountCode} onChange={(e) => setO("discountCode", e.target.value)} placeholder="e.g. SUMMER15" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono uppercase focus:ring-2 focus:ring-sky-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Valid until <span className="text-gray-400">(optional)</span></label>
              <input value={offer.validUntil} onChange={(e) => setO("validUntil", e.target.value)} placeholder="e.g. 31 Dec 2026" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Discount label</label>
            <input value={offer.discountText} onChange={(e) => setO("discountText", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Button text</label>
              <input value={offer.ctaText} onChange={(e) => setO("ctaText", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Button URL</label>
              <input value={offer.ctaUrl} onChange={(e) => setO("ctaUrl", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* Custom email */}
      {type === "custom" && (
        <div className="space-y-3 bg-gray-50 rounded-xl p-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
            <input value={custom.subject} onChange={(e) => setC("subject", e.target.value)} placeholder="Email subject" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Message</label>
            <textarea value={custom.body} onChange={(e) => setC("body", e.target.value)} rows={6} placeholder="Type your message…" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-sky-500 outline-none" />
          </div>
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        onClick={send}
        disabled={loading || sent}
        className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : sent ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
        {loading ? "Sending…" : sent ? "Sent!" : "Send Email"}
      </button>
    </div>
  );
}
