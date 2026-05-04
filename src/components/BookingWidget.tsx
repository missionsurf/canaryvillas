"use client";

import { useState, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { differenceInDays, format, isBefore, startOfDay } from "date-fns";
import { Users, Calendar, ArrowRight, Loader2 } from "lucide-react";
import "react-day-picker/dist/style.css";

interface Props {
  villaId: string;
  villaName: string;
  pricePerNight: number;
  cleaningFee: number;
  maxGuests: number;
  bookedDates: string[];
}

export default function BookingWidget({
  villaId,
  villaName,
  pricePerNight,
  cleaningFee,
  maxGuests,
  bookedDates,
}: Props) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"dates" | "details" | "confirm">("dates");
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [error, setError] = useState("");

  const disabledDays = [
    { before: new Date() },
    ...bookedDates.map((d) => new Date(d)),
  ];

  const nights =
    range?.from && range?.to ? differenceInDays(range.to, range.from) : 0;
  const subtotal = nights * pricePerNight;
  const total = subtotal + (nights > 0 ? cleaningFee : 0);

  async function handleBook() {
    if (!range?.from || !range?.to || nights < 1) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    if (!form.name || !form.email) {
      setError("Please fill in your name and email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          villaId,
          guestName: form.name,
          guestEmail: form.email,
          guestPhone: form.phone,
          checkIn: range.from.toISOString(),
          checkOut: range.to.toISOString(),
          guests,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
      <div className="bg-sky-500 text-white px-6 py-5">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold">€{pricePerNight}</span>
          <span className="text-sky-100">/night</span>
        </div>
        <p className="text-sky-100 text-sm mt-1">{villaName}</p>
      </div>

      <div className="p-6">
        {error && (
          <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm mb-4">
            {error}
          </div>
        )}

        {step === "dates" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Select Dates
              </label>
              <div className="border rounded-xl overflow-hidden">
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  disabled={disabledDays}
                  numberOfMonths={1}
                  className="!p-2"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" /> Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                {Array.from({ length: maxGuests }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>

            {nights > 0 && (
              <div className="border-t pt-4 mb-5 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>€{pricePerNight} × {nights} nights</span>
                  <span>€{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>€{cleaningFee}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>€{total}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (!range?.from || !range?.to) {
                  setError("Please select your dates first.");
                  return;
                }
                setError("");
                setStep("details");
              }}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </>
        )}

        {step === "details" && (
          <>
            <div className="bg-sky-50 rounded-xl p-4 mb-5 text-sm text-gray-700">
              <p className="font-semibold">
                {range?.from && format(range.from, "d MMM yyyy")} —{" "}
                {range?.to && format(range.to, "d MMM yyyy")}
              </p>
              <p>{nights} nights · {guests} guest{guests > 1 ? "s" : ""} · <strong>€{total} total</strong></p>
            </div>

            <div className="space-y-3 mb-5">
              <input
                type="text"
                placeholder="Full name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <input
                type="email"
                placeholder="Email address *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <textarea
                placeholder="Special requests or notes (optional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("dates")}
                className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleBook}
                disabled={loading}
                className="flex-2 flex-grow bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
                ) : (
                  "Pay & Confirm →"
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-3">
              Secure payment via Stripe. You won&apos;t be charged until the next step.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
