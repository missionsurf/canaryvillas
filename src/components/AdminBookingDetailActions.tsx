"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, RefreshCw, Loader2 } from "lucide-react";

interface Props {
  bookingId: string;
  status: string;
  stripePaymentId: string | null;
}

export default function AdminBookingDetailActions({ bookingId, status, stripePaymentId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

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
      {status !== "confirmed" && (
        <button
          onClick={() => updateStatus("confirmed")}
          disabled={!!loading}
          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          {loading === "confirmed" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          Confirm
        </button>
      )}
      {status !== "cancelled" && (
        <button
          onClick={() => updateStatus("cancelled")}
          disabled={!!loading}
          className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          {loading === "cancelled" ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
          Cancel
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
