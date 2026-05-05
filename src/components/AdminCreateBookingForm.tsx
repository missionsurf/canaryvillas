"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

interface Villa {
  id: string;
  name: string;
  pricePerNight: number;
  cleaningFee: number;
}

interface Props {
  villas: Villa[];
}

export default function AdminCreateBookingForm({ villas }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    villaId: villas[0]?.id || "",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guests: "2",
    checkIn: "",
    checkOut: "",
    sendConfirmation: true,
    notes: "",
  });

  const selectedVilla = villas.find((v) => v.id === form.villaId);

  const nights =
    form.checkIn && form.checkOut
      ? Math.max(
          0,
          Math.round(
            (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  const subtotal = selectedVilla ? selectedVilla.pricePerNight * nights : 0;
  const total = selectedVilla ? subtotal + selectedVilla.cleaningFee : 0;

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.villaId || !form.guestName || !form.guestEmail || !form.checkIn || !form.checkOut) {
      setError("Please fill in all required fields.");
      return;
    }
    if (nights < 1) {
      setError("Check-out must be after check-in.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings/create-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          villaId: form.villaId,
          guestName: form.guestName,
          guestEmail: form.guestEmail,
          guestPhone: form.guestPhone || null,
          guests: Number(form.guests),
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          sendConfirmation: form.sendConfirmation,
          notes: form.notes || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create booking");
      setSuccess(true);
      setTimeout(() => router.push(`/admin/bookings/${data.bookingId}`), 1200);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-green-600">
        <CheckCircle2 className="w-10 h-10" />
        <p className="font-semibold text-lg">Booking created! Redirecting…</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Villa */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Villa *</label>
          <select
            value={form.villaId}
            onChange={(e) => set("villaId", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          >
            {villas.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* Guest name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guest name *</label>
          <input
            type="text"
            value={form.guestName}
            onChange={(e) => set("guestName", e.target.value)}
            placeholder="Full name"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>

        {/* Guests count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of guests *</label>
          <input
            type="number"
            min="1"
            max="20"
            value={form.guests}
            onChange={(e) => set("guests", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={form.guestEmail}
            onChange={(e) => set("guestEmail", e.target.value)}
            placeholder="guest@example.com"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={form.guestPhone}
            onChange={(e) => set("guestPhone", e.target.value)}
            placeholder="+34 600 000 000"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>

        {/* Check-in */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in *</label>
          <input
            type="date"
            value={form.checkIn}
            onChange={(e) => set("checkIn", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>

        {/* Check-out */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-out *</label>
          <input
            type="date"
            value={form.checkOut}
            onChange={(e) => set("checkOut", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>
      </div>

      {/* Price preview */}
      {nights > 0 && selectedVilla && (
        <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1.5 border">
          <div className="flex justify-between text-gray-600">
            <span>€{selectedVilla.pricePerNight.toFixed(2)} × {nights} nights</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Cleaning fee</span>
            <span>€{selectedVilla.cleaningFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 border-t pt-1.5">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Internal notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
          placeholder="Optional notes for this booking…"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-sky-500 outline-none"
        />
      </div>

      {/* Send confirmation */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.sendConfirmation}
          onChange={(e) => set("sendConfirmation", e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
        />
        <span className="text-sm text-gray-700">Send booking confirmation email to guest</span>
      </label>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {loading ? "Creating…" : "Create Booking"}
      </button>
    </form>
  );
}
