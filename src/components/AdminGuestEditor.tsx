"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, X, Plus } from "lucide-react";

const PRESET_TAGS = ["VIP", "repeat", "new", "corporate", "family"];

interface Props {
  guestId: string;
  initialName: string;
  initialPhone: string;
  initialNationality: string;
  initialTags: string[];
  initialNotes: string;
  initialMarketing: boolean;
}

export default function AdminGuestEditor({
  guestId, initialName, initialPhone, initialNationality,
  initialTags, initialNotes, initialMarketing,
}: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [nationality, setNationality] = useState(initialNationality);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [notes, setNotes] = useState(initialNotes);
  const [marketing, setMarketing] = useState(initialMarketing);
  const [customTag, setCustomTag] = useState("");

  const addTag = (t: string) => {
    const tag = t.trim();
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
    setCustomTag("");
  };
  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));

  const save = async () => {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/admin/guests/${guestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, nationality, tags, notes, marketingOptIn: marketing }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+34 600 000 000"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nationality / Country</label>
          <input
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            placeholder="e.g. British"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Marketing</label>
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-sky-600"
            />
            <span className="text-sm text-gray-700">Opted in to marketing emails</span>
          </label>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((t) => (
            <span key={t} className="flex items-center gap-1 bg-sky-100 text-sky-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {t}
              <button onClick={() => removeTag(t)} className="hover:text-sky-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {PRESET_TAGS.filter((t) => !tags.includes(t)).map((t) => (
            <button
              key={t}
              onClick={() => addTag(t)}
              className="text-xs border border-gray-200 hover:border-sky-300 hover:bg-sky-50 text-gray-600 px-2.5 py-1 rounded-full transition-colors"
            >
              + {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag(customTag)}
            placeholder="Custom tag…"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          />
          <button
            onClick={() => addTag(customTag)}
            className="border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Internal Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Notes about this guest (not visible to them)…"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:ring-2 focus:ring-sky-500 outline-none"
        />
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
      >
        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
        {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
      </button>
    </div>
  );
}
