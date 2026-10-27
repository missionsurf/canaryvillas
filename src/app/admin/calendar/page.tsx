"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Trash2, Tag } from "lucide-react";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isToday, parseISO, isWithinInterval,
  addMonths, subMonths, startOfWeek, endOfWeek, isSameDay,
} from "date-fns";

interface Villa { id: string; name: string; pricePerNight: number; }
interface Booking {
  id: string; villaId: string; guestName: string;
  checkIn: string; checkOut: string; status: string;
}
interface Rate {
  id: string; villaId: string; name: string;
  startDate: string; endDate: string; pricePerNight: number;
  isSpecialOffer: boolean;
}

const STATUS: Record<string, { dot: string; pill: string; label: string }> = {
  confirmed: { dot: "bg-green-500", pill: "bg-green-100 text-green-800 border border-green-200", label: "Confirmed" },
  pending:   { dot: "bg-amber-400", pill: "bg-amber-100 text-amber-800 border border-amber-200",  label: "Pending" },
  cancelled: { dot: "bg-red-400",   pill: "bg-red-100 text-red-700 border border-red-200",         label: "Cancelled" },
};

export default function CalendarPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(new Date());
  const [villas, setVillas] = useState<Villa[]>([]);
  const [villaId, setVillaId] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [offerForm, setOfferForm] = useState({ name: "", startDate: "", endDate: "", pricePerNight: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [showOfferForm, setShowOfferForm] = useState(false);

  const load = useCallback(() => {
    fetch("/api/admin/villas").then(r => r.json()).then(d => {
      if (Array.isArray(d) && d.length) {
        setVillas(d);
        setVillaId(v => v || d[0].id);
      }
    });
    fetch("/api/admin/bookings").then(r => r.json()).then(d => { if (Array.isArray(d)) setBookings(d); });
    fetch("/api/admin/seasonal-rates").then(r => r.json()).then(d => { if (Array.isArray(d)) setRates(d); });
  }, []);

  useEffect(() => { load(); }, [load]);

  // Calendar grid
  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const villaBookings = bookings.filter(b => b.villaId === villaId && b.status !== "cancelled");
  const villaRates = rates.filter(r => r.villaId === villaId);

  function bookingForDay(day: Date) {
    return villaBookings.find(b => {
      const ci = parseISO(b.checkIn);
      const co = new Date(parseISO(b.checkOut).getTime() - 1); // exclusive checkout
      return isWithinInterval(day, { start: ci, end: co });
    });
  }

  function isCheckIn(day: Date, b: Booking) { return isSameDay(day, parseISO(b.checkIn)); }
  function isCheckOut(day: Date, b: Booking) { return isSameDay(day, new Date(parseISO(b.checkOut).getTime() - 86400000)); }

  function specialOfferForDay(day: Date) {
    return villaRates.find(r => r.isSpecialOffer && isWithinInterval(day, { start: parseISO(r.startDate), end: parseISO(r.endDate) }));
  }

  async function addOffer(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setFormError("");
    try {
      const res = await fetch("/api/admin/seasonal-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ villaId, ...offerForm, pricePerNight: Number(offerForm.pricePerNight), isSpecialOffer: true }),
      });
      if (res.ok) {
        const data = await res.json();
        setRates(r => [...r, data]);
        setOfferForm({ name: "", startDate: "", endDate: "", pricePerNight: "" });
        setShowOfferForm(false);
      } else {
        const d = await res.json();
        setFormError(d.error || "Failed to save");
      }
    } finally { setSaving(false); }
  }

  async function deleteRate(id: string) {
    await fetch("/api/admin/seasonal-rates", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setRates(r => r.filter(x => x.id !== id));
  }

  const activeOffers = villaRates.filter(r => r.isSpecialOffer);
  const selectedVilla = villas.find(v => v.id === villaId);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-xl font-bold text-gray-900">Booking Calendar</h1>

        {/* Villa switcher */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {villas.map(v => (
            <button
              key={v.id}
              onClick={() => setVillaId(v.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                villaId === v.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sky-100 border border-sky-300 inline-block" />Booked</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500 inline-block" />Confirmed</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-400 inline-block" />Pending</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-300 inline-block" />Special offer</span>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCurrent(subMonths(current, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-semibold text-gray-900">{format(current, "MMMM yyyy")}</h2>
        <button onClick={() => setCurrent(addMonths(current, 1))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
            <div key={d} className="text-center text-[11px] font-semibold text-gray-400 py-2">{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7">
          {days.map(day => {
            const booking = bookingForDay(day);
            const offer = specialOfferForDay(day);
            const inMonth = isSameMonth(day, current);
            const today = isToday(day);
            const status = booking ? (STATUS[booking.status] ?? STATUS.confirmed) : null;

            // Determine if this cell is check-in or check-out day for span visuals
            const isCI = booking ? isCheckIn(day, booking) : false;
            const isCO = booking ? isCheckOut(day, booking) : false;

            return (
              <div
                key={day.toISOString()}
                className={`
                  relative min-h-[72px] p-1.5 border-b border-r border-gray-100 last:border-r-0
                  ${!inMonth ? "bg-gray-50/60" : ""}
                  ${today ? "bg-sky-50" : ""}
                `}
              >
                {/* Date number */}
                <span className={`
                  text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1
                  ${today ? "bg-sky-500 text-white" : inMonth ? "text-gray-700" : "text-gray-300"}
                `}>
                  {format(day, "d")}
                </span>

                {/* Special offer indicator */}
                {offer && inMonth && (
                  <div className="absolute bottom-1 left-1 right-1 h-1 rounded-full bg-orange-300 opacity-80" />
                )}

                {/* Booking pill */}
                {booking && inMonth && (
                  <button
                    onClick={() => router.push(`/admin/bookings/${booking.id}`)}
                    title={`${booking.guestName} — click to view`}
                    className={`
                      w-full text-left rounded px-1.5 py-1 flex items-center gap-1.5
                      bg-sky-100 hover:bg-sky-200 transition-colors group
                      ${isCI ? "rounded-l-full" : ""}
                      ${isCO ? "rounded-r-full" : ""}
                    `}
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${status?.dot}`} />
                    <span className="text-[11px] font-medium text-sky-800 truncate leading-tight">
                      {isCI ? booking.guestName.split(" ")[0] : "·"}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming bookings list */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Upcoming bookings — {selectedVilla?.name}
        </h3>
        {villaBookings.length === 0 ? (
          <p className="text-sm text-gray-400">No bookings for this villa.</p>
        ) : (
          <div className="space-y-2">
            {villaBookings
              .filter(b => new Date(b.checkOut) >= new Date())
              .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
              .map(b => {
                const s = STATUS[b.status] ?? STATUS.confirmed;
                return (
                  <button
                    key={b.id}
                    onClick={() => router.push(`/admin/bookings/${b.id}`)}
                    className="w-full flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 hover:border-sky-300 hover:shadow-sm transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{b.guestName}</p>
                        <p className="text-xs text-gray-500">
                          {format(parseISO(b.checkIn), "d MMM")} → {format(parseISO(b.checkOut), "d MMM yyyy")}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.pill}`}>{s.label}</span>
                  </button>
                );
              })}
          </div>
        )}
      </div>

      {/* Special offers section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Tag className="w-4 h-4 text-orange-500" /> Special Offers — {selectedVilla?.name}
          </h3>
          <button
            onClick={() => setShowOfferForm(v => !v)}
            className="flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add offer
          </button>
        </div>

        {showOfferForm && (
          <form onSubmit={addOffer} className="space-y-3 mb-5 p-4 bg-orange-50 rounded-xl border border-orange-100">
            <input
              type="text"
              placeholder="Offer name (e.g. Early Bird Deal)"
              value={offerForm.name}
              onChange={e => setOfferForm(f => ({ ...f, name: e.target.value }))}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">From</label>
                <input type="date" value={offerForm.startDate} onChange={e => setOfferForm(f => ({ ...f, startDate: e.target.value }))} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">To</label>
                <input type="date" value={offerForm.endDate} onChange={e => setOfferForm(f => ({ ...f, endDate: e.target.value }))} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
              </div>
            </div>
            <input
              type="number"
              placeholder="Price per night (€)"
              value={offerForm.pricePerNight}
              onChange={e => setOfferForm(f => ({ ...f, pricePerNight: e.target.value }))}
              required min="1"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            {formError && <p className="text-red-600 text-sm">{formError}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-2 rounded-lg text-sm font-semibold">
                {saving ? "Saving…" : "Save Offer"}
              </button>
              <button type="button" onClick={() => setShowOfferForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">
                Cancel
              </button>
            </div>
          </form>
        )}

        {activeOffers.length === 0 ? (
          <p className="text-sm text-gray-400">No special offers for this villa.</p>
        ) : (
          <div className="space-y-2">
            {activeOffers.map(r => (
              <div key={r.id} className="flex items-center justify-between gap-3 bg-orange-50 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-500">
                    {format(parseISO(r.startDate), "d MMM")} – {format(parseISO(r.endDate), "d MMM yyyy")} ·{" "}
                    <span className="text-orange-600 font-medium">€{r.pricePerNight}/night</span>
                  </p>
                </div>
                <button onClick={() => deleteRate(r.id)} className="text-red-400 hover:text-red-600 shrink-0 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
