"use client";

import { useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";

export default function AdminSyncButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  async function sync() {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/admin/sync", { method: "POST" });
      const data = await res.json();
      if (data.results) {
        setResult(`Synced ${data.results.length} villa(s) successfully.`);
      } else {
        setResult(data.error || "Sync completed.");
      }
    } catch {
      setResult("Sync failed. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={sync}
        disabled={loading}
        className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Syncing…</>
        ) : (
          <><RefreshCw className="w-4 h-4" /> Sync Now</>
        )}
      </button>
      {result && <p className="text-xs text-gray-500">{result}</p>}
    </div>
  );
}
