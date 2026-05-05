"use client";

import { useState } from "react";
import { RefreshCw, Loader2, CheckCircle2 } from "lucide-react";

export default function AdminGuestSyncButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ created: number; total: number } | null>(null);

  const sync = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/guests/sync", { method: "POST" });
      const data = await res.json();
      setResult(data);
      setTimeout(() => setResult(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={sync}
      disabled={loading}
      className="flex items-center gap-1.5 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : result ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <RefreshCw className="w-4 h-4" />}
      {loading ? "Syncing…" : result ? `Synced ${result.created} of ${result.total}` : "Sync from Bookings"}
    </button>
  );
}
