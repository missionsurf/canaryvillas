"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Tag } from "lucide-react";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isToday, isSameDay, parseISO, isWithinInterval,
  addMonths, subMonths, startOfWeek, endOfWeek,
} from "date-fns";

interface Villa { id: string; name: string; pricePerNight: number; }
interface Booking {
  id: string; villaId: string; guestName: string;
  checkIn: string; checkOut: string; status: string;
  villa: { name: string };
}
interface Rate {
  id: string; villaId: string; name: string;
  startDate: string; endDate: string; pricePerNight: number;
  isSpecialOffer: boolean;
}

const VILLA_COLORS: Record<number, { bg: string; text: string; light: string }> = {
  0: { bg: "bg-sky-500", text: "text-sky-700", light: "bg-sky-100" },
  1: { bg: "bg-violet-500", text: "text-violet-700", light: "bg-violet-100" },
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-green-500",
  pending: "bg-amber-400",
  cancelled: "bg-red-400",
};

export default function CalendarPage() {
  const [current, setCurrent] = useState(new Date());
  const [villas, setVillas] = useState<Villa[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [offerForm, setOfferForm] = useState({ villaId: "", name: "", startDate: "", endDate: "", pricePerNight: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    fetch("/api/admin/villas").then(r => r.json()).then(d => { if (Array.isArray(d)) setVillas(d); });
    fetch("/api/admin/bookings").then(r => r.json()).then(d => { if (Array.isArray(d)) setBookings(d); });
    fetch("/api/admin/seasonal-rates").then(r => r.json()).then(d => { if (Array.isArray(d)) setRates(d); });
  }, []);

  useEffect(() => { load(); }, [load]);

  // Build calendar grid (6 weeks)
  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  function getBookingsForDay(day: Date) {
    return bookings.filter(b => {
      if (b.status === "cancelled") return false;
      const ci = parseISO(b.checkIn);
      const co = parseISO(b.checkOut);
      return isWithinInterval(day, { start: ci, end: co }) || isSameDay(day, ci);
    });
  }

  function getRatesForDay(day: Date) {
    return rates.filter(r => {
      const s = parseISO(r.startDate);
      const e = parseISO(r.endDate);
      return isWithinInterval(day, { start: s, end: e });
    });
  }

  async function addOffer(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/admin/seasonal-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...offerForm, pricePerNight: Number(offerForm.pricePerNight), isSpecialOffer: true }),
      });
      if (res.ok) {
        const data = await res.json();
        setRates(r => [...r, data]);
        setOfferForm(f => ({ ...f, name: "", startDate: "", endDate: "", pricePerNight: "" }));
      } else {
        const d = await res.json();
        setError(d.error || "Failed");
      }
    } finally { setSaving(false); }
  }

  async function deleteRate(id: string) {
    await fetch("/api/admin/seasonal-rates", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setRates(r => r.filter(x => x.id !== id));
  }

  const villaIndex = (id: string) => villas.findIndex(v => v.id === id);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Booking Calendar</h1>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        {villas.map((v, i) => (
          <div key={v.id} className="flex items-center gap-2 text-sm">
            <span className={`w-3 h-3 rounded-full ${VILLA_COLORS[i % 2]?.bg}`} />
            <span className="text-gray-600">{v.name}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-green-500" /><span className="text-gray-600">Confirmed</span></div>
        <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-amber-400" /><span className="text-gray-600">Pending</span></div>
        <div className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-orange-400" /><span className="text-gray-600">Special offer</span></div>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrent(subMonths(current, 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
        <h2 className="text-lg font-bold text-gray-900">{format(current, "MMMM yyyy")}</h2>
        <button onClick={() => setCurrent(addMonths(current, 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
        <div className="grid grid-cols-7 border-b">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
            <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map(day => {
            const dayBookings = getBookingsForDay(day);
            const dayRates = getRatesForDay(day);
            const inMonth = isSameMonth(day, current);
            const today = isToday(day);
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[80px] p-1 border-b border-r border-gray-100 ${!inMonth ? "bg-gray-50" : ""} ${today ? "bg-sky-50" : ""}`}
              >
                <span className={`text-xs font-medium block mb-1 w-6 h-6 flex items-center justify-center rounded-full ${today ? "bg-sky-500 text-white" : inMonth ? "text-gray-700" : "text-gray-300"}`}>
                  {format(day, "d")}
                </span>
                <div className="space-y-0.5">
                  {dayBookings.map(b => {
                    const idx = villaIndex(b.villaId);
                    const col = VILLA_COLORS[idx % 2];
                    const statusDot = STATUS_COLORS[b.status] || "bg-gray-400";
                    return (
                      <div key={b.id} className={`${col?.light} rounded px-1 py-0.5 flex items-center gap-1 truncate`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot}`} />
                        <span className={`text-[10px] font-medium truncate ${col?.text}`}>{b.guestName.split(" ")[0]}</span>
                      </div>
                    );
                  })}
                  {dayRates.filter(r => r.isSpecialOffer).map(r => (
                    <div key={r.id} className="bg-orange-100 rounded px-1 py-0.5 truncate">
                      <span className="text-[10px] font-medium text-orange-700 truncate">€{r.pricePerNight}/n</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Offers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Tag className="w-5 h-5 text-orange-500" /> Add Special Offer</h2>
          <form onSubmit={addOffer} className="space-y-3">
            <select value={offerForm.villaId} onChange={e => setOfferForm(f => ({ ...f, villaId: e.target.value }))} required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400">
              <option value="">Select villa…</option>
              {villas.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            <input type="text" placeholder="Offer name (e.g. Early Bird Deal)" value={offerForm.name} onChange={e => setOfferForm(f => ({ ...f, name: e.target.value }))} required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">From</label>
                <input type="date" value={offerForm.startDate} onChange={e => setOfferForm(f => ({ ...f, startDate: e.target.value }))} required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">To</label>
                <input type="date" value={offerForm.endDate} onChange={e => setOfferForm(f => ({ ...f, endDate: e.target.value }))} required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>
            </div>
            <input type="number" placeholder="Special price per night (€)" value={offerForm.pricePerNight} onChange={e => setOfferForm(f => ({ ...f, pricePerNight: e.target.value }))} required min="1" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={saving} className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> {saving ? "Saving…" : "Add Special Offer"}
            </button>
          </form>
        </div>

        {/* Active special offers list */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Active Special Offers</h2>
          {rates.filter(r => r.isSpecialOffer).length === 0 ? (
            <p className="text-gray-400 text-sm">No special offers yet.</p>
          ) : (
            <div className="space-y-2">
              {rates.filter(r => r.isSpecialOffer).map(r => {
                const villa = villas.find(v => v.id === r.villaId);
                return (
                  <div key={r.id} className="flex items-center justify-between gap-3 bg-orange-50 rounded-xl px-4 py-3">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-500">{villa?.name} · {format(parseISO(r.startDate), "d MMM")} – {format(parseISO(r.endDate), "d MMM yyyy")} · <span className="text-orange-600 font-medium">€{r.pricePerNight}/night</span></p>
                    </div>
                    <button onClick={() => deleteRate(r.id)} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 className="w-4 h-4" /></button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Also show seasonal rates (non-offer) */}
          {rates.filter(r => !r.isSpecialOffer).length > 0 && (
            <>
              <h3 className="text-sm font-semibold text-gray-700 mt-6 mb-2">Seasonal Rates</h3>
              <div className="space-y-2">
                {rates.filter(r => !r.isSpecialOffer).map(r => {
                  const villa = villas.find(v => v.id === r.villaId);
                  return (
                    <div key={r.id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-4 py-3">
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-500">{villa?.name} · {format(parseISO(r.startDate), "d MMM")} – {format(parseISO(r.endDate), "d MMM yyyy")} · <span className="font-medium">€{r.pricePerNight}/night</span></p>
                      </div>
                      <button onClick={() => deleteRate(r.id)} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
