"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Tag } from "lucide-react";

interface Villa { id: string; name: string; pricePerNight: number; }
interface Rate { id: string; villaId: string; name: string; startDate: string; endDate: string; pricePerNight: number; villa: { name: string }; }

export default function PricingPage() {
  const [villas, setVillas] = useState<Villa[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [form, setForm] = useState({ villaId: "", name: "", startDate: "", endDate: "", pricePerNight: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/seasonal-rates").then(r => r.json()).then(setRates);
    fetch("/api/admin/villas").then(r => r.json()).then(setVillas);
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/seasonal-rates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const rate = await res.json();
      setRates(r => [...r, rate]);
      setForm({ villaId: form.villaId, name: "", startDate: "", endDate: "", pricePerNight: "" });
    } else {
      const d = await res.json();
      setError(d.error || "Failed to save");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this seasonal rate?")) return;
    await fetch("/api/admin/seasonal-rates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setRates(r => r.filter(x => x.id !== id));
  }

  const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const ratesByVilla = villas.map(v => ({
    villa: v,
    rates: rates.filter(r => r.villaId === v.id).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Seasonal Pricing</h1>
          <p className="text-gray-500 text-sm mt-0.5">Set date ranges with custom nightly rates. Dates not covered use the base price.</p>
        </div>

        {/* Add form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Season</h2>
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

        {/* Rates by villa */}
        {ratesByVilla.map(({ villa, rates }) => (
          <div key={villa.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900">{villa.name}</h2>
                <p className="text-xs text-gray-400 mt-0.5">Base price: €{villa.pricePerNight}/night</p>
              </div>
              <Tag className="w-4 h-4 text-gray-400" />
            </div>
            {rates.length === 0 ? (
              <p className="px-6 py-4 text-sm text-gray-400">No seasonal rates — base price applies to all dates.</p>
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
                  {rates.map(rate => (
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
        ))}
      </div>
    </div>
  );
}
