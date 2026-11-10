"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Pencil, Loader2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  pricePerNight: number;
  cleaningFee: number;
  totalPrice: number;
  depositAmount: number | null;
  balanceAmount: number | null;
  status: string;
  villaName: string;
}

interface Props {
  booking: Booking;
}

const STATUSES = ["enquiry", "pending", "confirmed", "cancelled", "refunded"];

export default function AdminBookingEditor({ booking }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sendConfirmation, setSendConfirmation] = useState(false);
  const [recalcPricing, setRecalcPricing] = useState(true);

  const [form, setForm] = useState({
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone ?? "",
    checkIn: booking.checkIn.slice(0, 10),
    checkOut: booking.checkOut.slice(0, 10),
    guests: String(booking.guests),
    pricePerNight: booking.pricePerNight.toFixed(2),
    cleaningFee: booking.cleaningFee.toFixed(2),
    totalPrice: booking.totalPrice.toFixed(2),
    status: booking.status,
  });

  function field(key: keyof typeof form, value: string) {
    setForm(f => {
      const next = { ...f, [key]: value };
      // Auto-recalculate total when price fields change (unless recalcPricing is off)
      if (recalcPricing && (key === "pricePerNight" || key === "cleaningFee" || key === "checkIn" || key === "checkOut")) {
        const ppn = parseFloat(key === "pricePerNight" ? value : next.pricePerNight) || 0;
        const cf = parseFloat(key === "cleaningFee" ? value : next.cleaningFee) || 0;
        const ci = new Date(key === "checkIn" ? value : next.checkIn);
        const co = new Date(key === "checkOut" ? value : next.checkOut);
        const nights = Math.max(1, Math.round((co.getTime() - ci.getTime()) / 86400000));
        next.totalPrice = (ppn * nights + cf).toFixed(2);
      }
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setError("");

    try {
      const datesChanged = form.checkIn !== booking.checkIn.slice(0, 10) || form.checkOut !== booking.checkOut.slice(0, 10);

      const body: Record<string, unknown> = {
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        guestPhone: form.guestPhone,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
        status: form.status,
        sendConfirmation,
        // Always send pricing — server uses it directly (no recalc unless dates changed and no price sent)
        pricePerNight: parseFloat(form.pricePerNight),
        cleaningFee: parseFloat(form.cleaningFee),
        totalPrice: parseFloat(form.totalPrice),
        recalcPricing: datesChanged && recalcPricing,
      };

      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      let data: { error?: string } = {};
      try { data = await res.json(); } catch {}

      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        setError(data.error || `Save failed (${res.status})`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error — please try again");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" /> Edit Booking
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-bold text-gray-900">Edit Booking</h2>
                <p className="text-xs text-gray-500 mt-0.5">{booking.villaName} · #{booking.id.slice(-8).toUpperCase()}</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 px-6 py-5 space-y-5">

              {/* Guest details */}
              <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Guest</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      value={form.guestName}
                      onChange={e => field("guestName", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={form.guestEmail}
                      onChange={e => field("guestEmail", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        value={form.guestPhone}
                        onChange={e => field("guestPhone", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                      <input
                        type="number"
                        min={1}
                        value={form.guests}
                        onChange={e => field("guests", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Dates */}
              <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Dates</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                    <input
                      type="date"
                      value={form.checkIn}
                      onChange={e => field("checkIn", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                    <input
                      type="date"
                      value={form.checkOut}
                      onChange={e => field("checkOut", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 mt-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={recalcPricing}
                    onChange={e => setRecalcPricing(e.target.checked)}
                    className="rounded"
                  />
                  Auto-recalculate pricing from seasonal rates when dates change
                </label>
              </section>

              {/* Pricing */}
              <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Pricing</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Per night (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.pricePerNight}
                      onChange={e => field("pricePerNight", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cleaning (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.cleaningFee}
                      onChange={e => field("cleaningFee", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total (€)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.totalPrice}
                      onChange={e => field("totalPrice", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
                {booking.depositAmount && (
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Deposit of €{booking.depositAmount.toFixed(2)} already paid — balance will update automatically.
                  </p>
                )}
              </section>

              {/* Status */}
              <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Status</h3>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => field("status", s)}
                      className={`px-3 py-1.5 rounded-full text-sm font-semibold capitalize transition-colors ${
                        form.status === s
                          ? "bg-sky-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </section>

              {/* Email option */}
              <section className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendConfirmation}
                    onChange={e => setSendConfirmation(e.target.checked)}
                    className="mt-0.5 rounded"
                  />
                  <div>
                    <p className="text-sm font-semibold text-sky-900">Send updated confirmation to guest</p>
                    <p className="text-xs text-sky-700 mt-0.5">
                      Sends a fresh booking confirmation email to <strong>{form.guestEmail}</strong> with the updated details.
                    </p>
                  </div>
                </label>
              </section>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-4 flex gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold text-sm py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {saving ? "Saving…" : sendConfirmation ? "Save & Send Email" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
