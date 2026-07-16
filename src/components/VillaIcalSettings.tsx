"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Loader2 } from "lucide-react";

interface Props {
  villaId: string;
  villaName: string;
  villaSlug: string;
  airbnbIcalUrl: string | null;
  baseUrl: string;
}

export default function VillaIcalSettings({ villaId, villaName, villaSlug, airbnbIcalUrl, baseUrl }: Props) {
  const [icalUrl, setIcalUrl] = useState(airbnbIcalUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const exportUrl = `${baseUrl}/api/ical?slug=${villaSlug}`;

  async function save() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/villas/${villaId}/ical-url`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ airbnbIcalUrl: icalUrl || null }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError("Failed to save. Please try again.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  function copyExportUrl() {
    navigator.clipboard.writeText(exportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="border rounded-xl p-5 space-y-4">
      <p className="font-semibold text-gray-900">{villaName}</p>

      {/* Export URL — paste into Airbnb */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Your iCal URL → paste into Airbnb
        </p>
        <div className="flex gap-2">
          <input
            readOnly
            value={exportUrl}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-600 select-all"
          />
          <button
            onClick={copyExportUrl}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0"
          >
            {copied ? <><Check className="w-3.5 h-3.5 text-green-600" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>
          <a
            href={exportUrl}
            target="_blank"
            className="flex items-center gap-1 text-sky-600 hover:text-sky-700 px-2"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-1">In Airbnb: Calendar → Availability → Export calendar → paste this URL</p>
      </div>

      {/* Import URL — Airbnb iCal to pull from */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Airbnb iCal URL → import into this site
        </p>
        <div className="flex gap-2">
          <input
            type="url"
            value={icalUrl}
            onChange={(e) => setIcalUrl(e.target.value)}
            placeholder="https://www.airbnb.com/calendar/ical/..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <><Check className="w-3.5 h-3.5" /> Saved</> : "Save & Sync"}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">In Airbnb: Calendar → Availability → Import calendar → copy that URL here</p>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    </div>
  );
}
