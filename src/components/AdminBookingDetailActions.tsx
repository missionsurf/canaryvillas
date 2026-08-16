"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, RefreshCw, Loader2, Send } from "lucide-react";

interface Props {
  bookingId: string;
  status: string;
  stripePaymentId: string | null;
}

export default function AdminBookingDetailActions({ bookingId, status, stripePaymentId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const confirmAndSendPayment = async () => {
    if (!confirm("Confirm this enquiry and send the guest a payment link?")) return;
    setLoading("confirm");
    setError("");
    const res = await fetch(`/api/admin/bookings/${bookingId}/confirm`, { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setConfirmed(true);
      router.refresh();
    } else {
      setError(data.error || "Failed to confirm booking");
    }
    setLoading(null);
  };

  const updateStatus = async (newStatus: string) => {
    setLoading(newStatus);
    setError("");
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bookingId, status: newStatus }),
    });
    if (res.ok) router.refresh();
    else setError("Failed to update status");
    setLoading(null);
  };

  const refund = async () => {
    if (!confirm("Issue a full refund via Stripe? This cannot be undone.")) return;
    setLoading("refund");
    setError("");
    const res = await fetch(`/api/admin/bookings/${bookingId}/refund`, { method: "POST" });
    const data = await res.json();
    if (res.ok) router.refresh();
    else setError(data.error || "Refund failed");
    setLoading(null);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {status === "enquiry" && (
        <button
          onClick={confirmAndSendPayment}
          disabled={!!loading || confirmed}
          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          {loading === "confirm" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {confirmed ? "Payment link sent ✓" : "Confirm & Send Payment Link"}
        </button>
      )}
      {status === "confirmed" && (
        <button
          onClick={() => updateStatus("confirmed")}
          disabled
          className="flex items-center gap-1.5 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-lg opacity-60 cursor-default"
        >
          <CheckCircle2 className="w-4 h-4" /> Confirmed
        </button>
      )}
      {status !== "cancelled" && status !== "enquiry" && (
        <button
          onClick={() => updateStatus("cancelled")}
          disabled={!!loading}
          className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          {loading === "cancelled" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
          Cancel
        </button>
      )}
      {status === "enquiry" && (
        <button
          onClick={() => updateStatus("cancelled")}
          disabled={!!loading}
          className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          {loading === "cancelled" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
          Decline
        </button>
      )}
      {stripePaymentId && status !== "refunded" && (
        <button
          onClick={refund}
          disabled={!!loading}
          className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          {loading === "refund" ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refund via Stripe
        </button>
      )}
      {error && <p className="w-full text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
}
