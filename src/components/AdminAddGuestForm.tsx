"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function AdminAddGuestForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    nationality: "",
    notes: "",
    marketingOptIn: true,
  });

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Name and email are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create guest");
      setSuccess(true);
      setTimeout(() => router.push(`/admin/guests/${data.id}`), 1000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-green-600">
        <CheckCircle2 className="w-10 h-10" />
        <p className="font-semibold text-lg">Guest added! Redirecting…</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+34 600 000 000"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nationality / Country</label>
          <input
            value={form.nationality}
            onChange={(e) => set("nationality", e.target.value)}
            placeholder="e.g. British"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-sky-500 outline-none"
        />
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.marketingOptIn}
          onChange={(e) => set("marketingOptIn", e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-sky-600"
        />
        <span className="text-sm text-gray-700">Opted in to marketing emails</span>
      </label>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {loading ? "Adding…" : "Add Guest"}
      </button>
    </form>
  );
}
