"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Villa {
  id: string; name: string; slug: string; description: string; shortDesc: string;
  location: string; bedrooms: number; bathrooms: number; beds: string | null;
  maxGuests: number; amenities: string;
}

export default function EditVillaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [villa, setVilla] = useState<Villa | null>(null);
  const [form, setForm] = useState({ name: "", description: "", shortDesc: "", location: "", bedrooms: "", bathrooms: "", beds: "", maxGuests: "", amenities: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch(`/api/admin/villas/${id}`).then(r => r.json()).then((v: Villa) => {
      setVilla(v);
      const amenities = (() => { try { const a = JSON.parse(v.amenities); return Array.isArray(a) ? a.join("\n") : v.amenities; } catch { return v.amenities; } })();
      setForm({
        name: v.name,
        description: v.description,
        shortDesc: v.shortDesc,
        location: v.location,
        bedrooms: String(v.bedrooms),
        bathrooms: String(v.bathrooms),
        beds: v.beds ?? "",
        maxGuests: String(v.maxGuests),
        amenities,
      });
    });
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const amenitiesArr = form.amenities.split("\n").map(s => s.trim()).filter(Boolean);
    const res = await fetch(`/api/admin/villas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        maxGuests: Number(form.maxGuests),
        amenities: JSON.stringify(amenitiesArr),
      }),
    });
    if (res.ok) {
      setMsg("Saved!");
      setTimeout(() => setMsg(""), 2000);
    } else {
      setMsg("Failed to save");
    }
    setSaving(false);
  }

  if (!villa) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400">Loading…</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/properties" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-gray-900">{villa.name}</h1>
            <p className="text-gray-400 text-sm">{villa.location}</p>
          </div>
          <a href={`/villas/${villa.slug}`} target="_blank" className="text-sky-500 hover:text-sky-600 flex items-center gap-1 text-sm">
            View <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-bold text-gray-900">Basic Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Villa Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</label>
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bedrooms</label>
                <input type="number" min="1" value={form.bedrooms} onChange={e => setForm(f => ({ ...f, bedrooms: e.target.value }))} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bathrooms</label>
                <input type="number" min="1" value={form.bathrooms} onChange={e => setForm(f => ({ ...f, bathrooms: e.target.value }))} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Max Guests</label>
                <input type="number" min="1" value={form.maxGuests} onChange={e => setForm(f => ({ ...f, maxGuests: e.target.value }))} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Beds</label>
                <input value={form.beds} onChange={e => setForm(f => ({ ...f, beds: e.target.value }))} placeholder="e.g. 1 double, 2 singles, 1 sofa bed" className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-bold text-gray-900">Description</h2>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Short Description</label>
              <textarea value={form.shortDesc} onChange={e => setForm(f => ({ ...f, shortDesc: e.target.value }))} rows={2} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={8} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-bold text-gray-900">Amenities</h2>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">One amenity per line</label>
              <textarea value={form.amenities} onChange={e => setForm(f => ({ ...f, amenities: e.target.value }))} rows={10} placeholder={"WiFi\nPool\nAir conditioning\nParking"} className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
              <Save className="w-4 h-4" />{saving ? "Saving…" : "Save Changes"}
            </button>
            {msg && <span className={`text-sm font-medium ${msg === "Saved!" ? "text-green-600" : "text-red-600"}`}>{msg}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
