"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  bookingId: string;
  currentStatus: string;
}

export default function AdminBookingActions({ bookingId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function update(status: string) {
    setLoading(true);
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bookingId, status }),
    });
    setLoading(false);
    router.refresh();
  }

  if (loading) return <span className="text-xs text-gray-400">Updating…</span>;

  return (
    <div className="flex gap-2">
      {currentStatus === "pending" && (
        <button
          onClick={() => update("confirmed")}
          className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded-lg font-medium transition-colors"
        >
          Confirm
        </button>
      )}
      {currentStatus !== "cancelled" && currentStatus !== "refunded" && (
        <button
          onClick={() => update("cancelled")}
          className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
