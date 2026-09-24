"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Tag, Save } from "lucide-react";

interface Villa { id: string; name: string; pricePerNight: number; cleaningFee: number; }
interface Rate { id: string; villaId: string; name: string; startDate: string; endDate: string; pricePerNight: number; }

export default function PricingPage() {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [form, setForm] = useState({ villaId: "", name: "", startDate: "", endDate: "", pricePerNight: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [basePrices, setBasePrices] = useState<Record<string, { pricePerNight: string; cleaningFee: string }>>({});
  const [baseSaving, setBaseSaving] = useState<Record<string, boolean>>({});
  const [baseMsg, setBaseMsg] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/admin/seasonal-rates").then(r => r.json()).then(data => {
      if (Array.isArray(data)) setRates(data);
    });
    fetch("/api/admin/villas").then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        setVillas(data);
        const prices: Record<string, { pricePerNight: string; cleaningFee: string }> = {};
        data.forEach((v: Villa) => { prices[v.id] = { pricePerNight: String(v.pricePerNight), cleaningFee: String(v.cleaningFee) }; });
        setBasePrices(prices);
      }
    });
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/seasonal-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setRates(r => [...r, data]);
        setForm(f => ({ ...f, name: "", startDate: "", endDate: "", pricePerNight: "" }));
      } else {
        setError(data.error || "Failed to save");
      }
    } catch {
      setError("Network error");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this seasonal rate?")) return;
    const res = await fetch("/api/admin/seasonal-rates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setRates(r => r.filter(x => x.id !== id));
  }

  async function handleBasePrice(villaId: string) {
    setBaseSaving(s => ({ ...s, [villaId]: true }));
    setBaseMsg(m => ({ ...m, [villaId]: "" }));
    const { pricePerNight, cleaningFee } = basePrices[villaId];
    const res = await fetch(`/api/admin/villas/${villaId}/pricing`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pricePerNight: Number(pricePerNight), cleaningFee: Number(cleaningFee) }),
    });
    if (res.ok) {
      setBaseMsg(m => ({ ...m, [villaId]: "Saved!" }));
      setTimeout(() => setBaseMsg(m => ({ ...m, [villaId]: "" })), 2000);
    } else {
      setBaseMsg(m => ({ ...m, [villaId]: "Failed to save" }));
    }
    setBaseSaving(s => ({ ...s, [villaId]: false }));
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Seasonal Pricing</h1>
          <p className="text-gray-500 text-sm mt-0.5">Set seasonal rates per villa. Dates not covered use the base price.</p>
        </div>

        {/* Base prices */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Base Prices</h2>
            <p className="text-xs text-gray-400 mt-0.5">Default nightly rate when no seasonal rate applies</p>
          </div>
          <div className="divide-y divide-gray-100">
            {villas.map(v => (
              <div key={v.id} className="px-6 py-4 flex flex-wrap items-center gap-4">
                <span className="font-medium text-gray-900 w-40">{v.name}</span>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500">Per night €</label>
                  <input
                    type="number"
                    value={basePrices[v.id]?.pricePerNight ?? ""}
                    onChange={e => setBasePrices(p => ({ ...p, [v.id]: { ...p[v.id], pricePerNight: e.target.value } }))}
                    className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500">Cleaning fee €</label>
                  <input
                    type="number"
                    value={basePrices[v.id]?.cleaningFee ?? ""}
                    onChange={e => setBasePrices(p => ({ ...p, [v.id]: { ...p[v.id], cleaningFee: e.target.value } }))}
                    className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <button
                  onClick={() => handleBasePrice(v.id)}
                  disabled={baseSaving[v.id]}
                  className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {baseSaving[v.id] ? "Saving…" : "Save"}
                </button>
                {baseMsg[v.id] && <span className={`text-sm font-medium ${baseMsg[v.id] === "Saved!" ? "text-green-600" : "text-red-600"}`}>{baseMsg[v.id]}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Add season form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Seasonal Rate</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Villa</label>
              <select
                value={form.villaId}
                onChange={e => setForm(f => ({ ...f, villaId: e.target.value }))}
                required
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">Select villa…</option>
                {villas.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Season Name</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. High Season, Christmas"
                required
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                required
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                required
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Price Per Night (€)</label>
              <input
                type="number"
                value={form.pricePerNight}
                onChange={e => setForm(f => ({ ...f, pricePerNight: e.target.value }))}
                placeholder="e.g. 250"
                min="1"
                required
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Add Season"}
              </button>
            </div>
          </form>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        {/* Seasonal rates by villa */}
        {villas.map(v => {
          const villaRates = rates.filter(r => r.villaId === v.id).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
          return (
            <div key={v.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900 flex items-center gap-2"><Tag className="w-4 h-4 text-gray-400" />{v.name} — Seasonal Rates</h2>
              </div>
              {villaRates.length === 0 ? (
                <p className="px-6 py-4 text-sm text-gray-400">No seasonal rates added yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Season</th>
                      <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Dates</th>
                      <th className="px-6 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Per Night</th>
                      <th className="px-6 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {villaRates.map(rate => (
                      <tr key={rate.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-900">{rate.name}</td>
                        <td className="px-6 py-3 text-gray-500">{fmt(rate.startDate)} – {fmt(rate.endDate)}</td>
                        <td className="px-6 py-3 text-right font-semibold text-gray-900">€{rate.pricePerNight}</td>
                        <td className="px-6 py-3 text-right">
                          <button onClick={() => handleDelete(rate.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
