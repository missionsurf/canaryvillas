"use client";

import { useState } from "react";
import { Send, ChevronDown, Loader2, CheckCircle2 } from "lucide-react";

interface Props {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  villaName: string;
  villaAddress: string;
}

type EmailType = "confirmation" | "arrival" | "custom";

export default function AdminEmailComposer({ bookingId, guestName, guestEmail, villaName, villaAddress }: Props) {
  const [type, setType] = useState<EmailType>("arrival");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Arrival form state
  const [arrival, setArrival] = useState({
    address: villaAddress || "",
    accessCode: "",
    wifiName: "",
    wifiPassword: "",
    parking: "",
    checkInTime: "15:00",
    checkOutTime: "10:00",
    extraNotes: "",
  });

  // Custom email state
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const send = async () => {
    setLoading(true);
    setError("");
    setSent(false);
    try {
      const payload: Record<string, unknown> = { type };
      if (type === "arrival") payload.arrivalData = arrival;
      if (type === "custom") { payload.subject = subject; payload.htmlBody = body.replace(/\n/g, "<br/>"); }

      const res = await fetch(`/api/admin/bookings/${bookingId}/email`, {
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
      {/* Type selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email template</label>
        <div className="relative">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as EmailType)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm appearance-none bg-white pr-10 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          >
            <option value="confirmation">Booking Confirmation (resend)</option>
            <option value="arrival">Arrival Instructions</option>
            <option value="custom">Custom Email</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <p className="text-xs text-gray-400 mt-1">Sending to: {guestName} &lt;{guestEmail}&gt;</p>
      </div>

      {/* Arrival form */}
      {type === "arrival" && (
        <div className="space-y-3 bg-gray-50 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Check-in time</label>
              <input type="time" value={arrival.checkInTime} onChange={e => setArrival(a => ({ ...a, checkInTime: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Check-out time</label>
              <input type="time" value={arrival.checkOutTime} onChange={e => setArrival(a => ({ ...a, checkOutTime: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Property address</label>
            <input type="text" value={arrival.address} onChange={e => setArrival(a => ({ ...a, address: e.target.value }))} placeholder="Full address" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Access code / key box</label>
            <input type="text" value={arrival.accessCode} onChange={e => setArrival(a => ({ ...a, accessCode: e.target.value }))} placeholder="e.g. 1234 or key under mat" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">WiFi name</label>
              <input type="text" value={arrival.wifiName} onChange={e => setArrival(a => ({ ...a, wifiName: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">WiFi password</label>
              <input type="text" value={arrival.wifiPassword} onChange={e => setArrival(a => ({ ...a, wifiPassword: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Parking instructions</label>
            <input type="text" value={arrival.parking} onChange={e => setArrival(a => ({ ...a, parking: e.target.value }))} placeholder="e.g. Private space at front of property" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Additional notes / local tips</label>
            <textarea value={arrival.extraNotes} onChange={e => setArrival(a => ({ ...a, extraNotes: e.target.value }))} rows={3} placeholder="Bin collection days, nearest supermarket, emergency contacts..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
          </div>
        </div>
      )}

      {/* Custom email */}
      {type === "custom" && (
        <div className="space-y-3 bg-gray-50 rounded-xl p-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Email subject" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Message</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={6} placeholder="Type your message here..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
            <p className="text-xs text-gray-400 mt-1">Plain text — line breaks become paragraph breaks in the email.</p>
          </div>
        </div>
      )}

      {type === "confirmation" && (
        <div className="bg-blue-50 text-blue-700 rounded-xl px-4 py-3 text-sm">
          Resends the original booking confirmation with all booking details to the guest.
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
