"use client";

import { useState, useEffect, useRef } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { differenceInDays, format } from "date-fns";
import { Users, Calendar, ArrowRight, Loader2, CreditCard, Building2 } from "lucide-react";
import "react-day-picker/dist/style.css";
import { useCurrency } from "@/context/CurrencyContext";
import { useTranslations } from "next-intl";

interface Props {
  villaId: string;
  villaName: string;
  pricePerNight: number;
  cleaningFee: number;
  maxGuests: number;
  bookedDates: string[];
}

type PaymentMethod = "stripe" | "paypal" | "bank_transfer";

export default function BookingWidget({
  villaId,
  villaName,
  pricePerNight,
  cleaningFee,
  maxGuests,
  bookedDates,
}: Props) {
  const { currency, convert, format: fmtPrice, symbol } = useCurrency();
  const t = useTranslations("booking");
  const [range, setRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"dates" | "details" | "payment">("dates");
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [error, setError] = useState("");
  const paypalRef = useRef<HTMLDivElement>(null);
  const paypalRendered = useRef(false);

  const disabledDays = [
    { before: new Date() },
    ...bookedDates.map((d) => new Date(d)),
  ];

  const nights = range?.from && range?.to ? differenceInDays(range.to, range.from) : 0;
  const subtotal = nights * pricePerNight;
  const total = subtotal + (nights > 0 ? cleaningFee : 0);
  const deposit = Math.round(total / 2 * 100) / 100;
  const balance = Math.round((total - deposit) * 100) / 100;

  // Load PayPal SDK and render buttons when payment step + paypal selected
  useEffect(() => {
    if (step !== "payment" || paymentMethod !== "paypal") return;
    if (paypalRendered.current) return;

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) return;

    const existingScript = document.getElementById("paypal-sdk");
    if (existingScript) {
      renderPayPalButtons();
      return;
    }

    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR`;
    script.onload = renderPayPalButtons;
    document.head.appendChild(script);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, paymentMethod]);

  function renderPayPalButtons() {
    if (!paypalRef.current || paypalRendered.current) return;
    paypalRendered.current = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const paypal = (window as any).paypal;
    if (!paypal) return;

    paypal.Buttons({
      createOrder: async () => {
        setError("");
        const res = await fetch("/api/bookings/create-paypal-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            villaId,
            guestName: form.name,
            guestEmail: form.email,
            guestPhone: form.phone,
            checkIn: range?.from?.toISOString(),
            checkOut: range?.to?.toISOString(),
            guests,
            notes: form.notes,
          }),
        });
        const data = await res.json();
        if (!data.paypalOrderId) throw new Error(data.error || "Failed to create order");
        // Store bookingId for capture step
        sessionStorage.setItem("pendingBookingId", data.bookingId);
        return data.paypalOrderId;
      },
      onApprove: async (data: { orderID: string }) => {
        setLoading(true);
        const bookingId = sessionStorage.getItem("pendingBookingId");
        const res = await fetch("/api/bookings/capture-paypal-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId, paypalOrderId: data.orderID }),
        });
        const result = await res.json();
        if (result.success) {
          window.location.href = `/booking/success?bookingId=${result.bookingId}`;
        } else {
          setError(result.error || "Payment failed. Please try again.");
          setLoading(false);
        }
      },
      onError: () => {
        setError("PayPal payment failed. Please try another payment method.");
      },
    }).render(paypalRef.current);
  }

  async function handleStripeBook() {
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
          checkIn: range?.from?.toISOString(),
          checkOut: range?.to?.toISOString(),
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

  async function handleBankTransfer() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings/bank-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          villaId,
          guestName: form.name,
          guestEmail: form.email,
          guestPhone: form.phone,
          checkIn: range?.from?.toISOString(),
          checkOut: range?.to?.toISOString(),
          guests,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (data.bookingId) {
        window.location.href = `/booking/bank-transfer?bookingId=${data.bookingId}`;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function validateDetails() {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = "Full name is required";
    else if (form.name.trim().length < 2) errors.name = "Please enter your full name";

    if (!form.email.trim()) errors.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Please enter a valid email address";

    if (!form.phone.trim()) errors.phone = "Phone number is required";
    else if (!/^[+\d\s\-().]{7,20}$/.test(form.phone.trim())) errors.phone = "Please enter a valid phone number";
    return errors;
  }

  function handleConfirm() {
    if (paymentMethod === "stripe") handleStripeBook();
    else if (paymentMethod === "bank_transfer") handleBankTransfer();
    // PayPal is handled by the PayPal button click
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
      <div className="bg-sky-500 text-white px-6 py-5">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold">{fmtPrice(pricePerNight)}</span>
          <span className="text-sky-100">/night</span>
        </div>
        <p className="text-sky-100 text-sm mt-1">{villaName}</p>
      </div>

      <div className="p-6">
        {error && (
          <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm mb-4">{error}</div>
        )}

        {step === "dates" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {t("selectDates")}
              </label>
              <div className="border rounded-xl overflow-hidden">
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  disabled={disabledDays}
                  modifiers={{ booked: bookedDates.map((d) => new Date(d)) }}
                  numberOfMonths={1}
                  className="!p-2"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" /> {t("guests")}
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
                  <span>{fmtPrice(pricePerNight)} × {nights} nights</span>
                  <span>{fmtPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("cleaningFee")}</span>
                  <span>{fmtPrice(cleaningFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2 mt-2">
                  <span>{t("total")}</span>
                  <span>{fmtPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sky-600 font-semibold">
                  <span>{t("depositToday")}</span>
                  <span>{fmtPrice(deposit)}</span>
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
              {t("continue")} <ArrowRight className="w-5 h-5" />
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
              <p>{nights} nights · {guests} guest{guests > 1 ? "s" : ""} · <strong>{fmtPrice(total)} total</strong></p>
            </div>

            <div className="space-y-3 mb-5">
              <div>
                <input
                  type="text"
                  placeholder={t("fullName")}
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                    if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: "" }));
                  }}
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 ${fieldErrors.name ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                {fieldErrors.name && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.name}</p>}
              </div>
              <div>
                <input
                  type="email"
                  placeholder={t("email")}
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: "" }));
                  }}
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 ${fieldErrors.email ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                {fieldErrors.email && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.email}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder={t("phone")}
                  value={form.phone}
                  onChange={(e) => {
                    setForm({ ...form, phone: e.target.value });
                    if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: "" }));
                  }}
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400 ${fieldErrors.phone ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                {fieldErrors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.phone}</p>}
              </div>
              <textarea
                placeholder={t("message")}
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
                {t("back")}
              </button>
              <button
                onClick={() => {
                  const errors = validateDetails();
                  if (Object.keys(errors).length > 0) {
                    setFieldErrors(errors);
                    return;
                  }
                  setFieldErrors({});
                  setError("");
                  paypalRendered.current = false;
                  setStep("payment");
                }}
                className="flex-grow bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                {t("choosePayment")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {step === "payment" && (
          <>
            <div className="bg-sky-50 rounded-xl p-4 mb-5 text-sm text-gray-700">
              <p className="font-semibold">
                {range?.from && format(range.from, "d MMM yyyy")} —{" "}
                {range?.to && format(range.to, "d MMM yyyy")}
              </p>
              <p>{nights} nights · {guests} guest{guests > 1 ? "s" : ""}</p>
              <div className="flex justify-between mt-2 pt-2 border-t">
                <span className="font-bold">{t("depositDueNow")}</span>
                <span className="font-bold text-sky-700">{fmtPrice(deposit)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{t("balanceDue")}</span>
                <span>{fmtPrice(balance)}</span>
              </div>
            </div>

            <p className="text-sm font-semibold text-gray-700 mb-3">{t("howToPay")}</p>

            <div className="space-y-2 mb-5">
              {/* Bank Transfer */}
              <button
                onClick={() => setPaymentMethod("bank_transfer")}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  paymentMethod === "bank_transfer"
                    ? "border-sky-500 bg-sky-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Building2 className={`w-5 h-5 shrink-0 ${paymentMethod === "bank_transfer" ? "text-sky-500" : "text-gray-400"}`} />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t("bankTransfer")}</p>
                  <p className="text-xs text-gray-500">{t("bankTransferDesc")}</p>
                </div>
                {paymentMethod === "bank_transfer" && (
                  <span className="ml-auto text-xs bg-sky-500 text-white px-2 py-0.5 rounded-full">{t("selected")}</span>
                )}
              </button>

              {/* Credit/Debit Card */}
              <button
                onClick={() => setPaymentMethod("stripe")}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  paymentMethod === "stripe"
                    ? "border-sky-500 bg-sky-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <CreditCard className={`w-5 h-5 shrink-0 ${paymentMethod === "stripe" ? "text-sky-500" : "text-gray-400"}`} />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t("card")}</p>
                  <p className="text-xs text-gray-500">{t("cardDesc")}</p>
                </div>
                {paymentMethod === "stripe" && (
                  <span className="ml-auto text-xs bg-sky-500 text-white px-2 py-0.5 rounded-full">{t("selected")}</span>
                )}
              </button>

              {/* PayPal */}
              <button
                onClick={() => setPaymentMethod("paypal")}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                  paymentMethod === "paypal"
                    ? "border-sky-500 bg-sky-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className={`text-lg font-black leading-none ${paymentMethod === "paypal" ? "text-sky-500" : "text-gray-400"}`}>P</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t("paypal")}</p>
                  <p className="text-xs text-gray-500">{t("paypalDesc")}</p>
                </div>
                {paymentMethod === "paypal" && (
                  <span className="ml-auto text-xs bg-sky-500 text-white px-2 py-0.5 rounded-full">{t("selected")}</span>
                )}
              </button>
            </div>

            {/* PayPal button container */}
            {paymentMethod === "paypal" && (
              <div ref={paypalRef} className="mb-4" />
            )}

            {paymentMethod !== "paypal" && (
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors mb-3"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> {t("processing")}</>
                ) : paymentMethod === "bank_transfer" ? (
                  <><Building2 className="w-5 h-5" /> {t("reserveBank")}</>
                ) : (
                  <><CreditCard className="w-5 h-5" /> {t("payDeposit", { amount: fmtPrice(deposit) })}</>
                )}
              </button>
            )}

            <button
              onClick={() => setStep("details")}
              className="w-full text-gray-500 text-sm py-2 hover:text-gray-700"
            >
              ← {t("back")}
            </button>

            <p className="text-xs text-gray-400 text-center mt-2">
              {t("depositNote")}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
