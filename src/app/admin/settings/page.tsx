"use client";

import { useEffect, useState } from "react";
import { Settings, DollarSign, Users, Eye, EyeOff, Trash2, Plus, Save, CheckCircle } from "lucide-react";

interface Villa {
  id: string;
  name: string;
  pricePerNight: number;
  cleaningFee: number;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

type Tab = "pricing" | "admins";

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("pricing");
  const [villas, setVillas] = useState<Villa[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [currentAdminId, setCurrentAdminId] = useState<string>("");
  const [pricingDraft, setPricingDraft] = useState<Record<string, { pricePerNight: string; cleaningFee: string }>>({});
  const [pricingSaving, setPricingSaving] = useState<Record<string, boolean>>({});
  const [pricingSaved, setPricingSaved] = useState<Record<string, boolean>>({});
  const [pricingError, setPricingError] = useState<Record<string, string>>({});

  // Password change
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwShow, setPwShow] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // New admin
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPwShow, setNewPwShow] = useState(false);
  const [addSaving, setAddSaving] = useState(false);
  const [addMsg, setAddMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/villas").then(r => r.json()).then((data: Villa[]) => {
      setVillas(data);
      const draft: Record<string, { pricePerNight: string; cleaningFee: string }> = {};
      data.forEach(v => { draft[v.id] = { pricePerNight: String(v.pricePerNight), cleaningFee: String(v.cleaningFee) }; });
      setPricingDraft(draft);
    });
    fetch("/api/admin/admins").then(r => r.json()).then((data: AdminUser[]) => setAdmins(data));
    // Get current admin id from session
    fetch("/api/admin/me").then(r => r.json()).then((d: { id: string }) => setCurrentAdminId(d.id)).catch(() => {});
  }, []);

  async function savePricing(villaId: string) {
    const draft = pricingDraft[villaId];
    const pricePerNight = parseFloat(draft.pricePerNight);
    const cleaningFee = parseFloat(draft.cleaningFee);
    if (isNaN(pricePerNight) || isNaN(cleaningFee) || pricePerNight <= 0 || cleaningFee < 0) {
      setPricingError(e => ({ ...e, [villaId]: "Please enter valid prices" }));
      return;
    }
    setPricingError(e => ({ ...e, [villaId]: "" }));
    setPricingSaving(s => ({ ...s, [villaId]: true }));
    const res = await fetch(`/api/admin/villas/${villaId}/pricing`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pricePerNight, cleaningFee }),
    });
    setPricingSaving(s => ({ ...s, [villaId]: false }));
    if (res.ok) {
      setPricingSaved(s => ({ ...s, [villaId]: true }));
      setTimeout(() => setPricingSaved(s => ({ ...s, [villaId]: false })), 2500);
      setVillas(vs => vs.map(v => v.id === villaId ? { ...v, pricePerNight, cleaningFee } : v));
    } else {
      const d = await res.json();
      setPricingError(e => ({ ...e, [villaId]: d.error ?? "Save failed" }));
    }
  }

  async function changePassword() {
    if (pwNew !== pwConfirm) { setPwMsg({ ok: false, text: "New passwords do not match" }); return; }
    setPwSaving(true); setPwMsg(null);
    const res = await fetch(`/api/admin/admins/${currentAdminId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }),
    });
    const d = await res.json();
    setPwSaving(false);
    if (res.ok) { setPwMsg({ ok: true, text: "Password changed successfully" }); setPwCurrent(""); setPwNew(""); setPwConfirm(""); }
    else { setPwMsg({ ok: false, text: d.error ?? "Failed" }); }
  }

  async function addAdmin() {
    if (!newName || !newEmail || !newPassword) { setAddMsg({ ok: false, text: "All fields required" }); return; }
    setAddSaving(true); setAddMsg(null);
    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, email: newEmail, password: newPassword }),
    });
    const d = await res.json();
    setAddSaving(false);
    if (res.ok) {
      setAdmins(a => [...a, d]);
      setNewName(""); setNewEmail(""); setNewPassword("");
      setAddMsg({ ok: true, text: "Admin added" });
    } else {
      setAddMsg({ ok: false, text: d.error ?? "Failed" });
    }
  }

  async function deleteAdmin(id: string) {
    if (!confirm("Remove this admin user?")) return;
    const res = await fetch(`/api/admin/admins/${id}`, { method: "DELETE" });
    if (res.ok) setAdmins(a => a.filter(x => x.id !== id));
    else { const d = await res.json(); alert(d.error ?? "Failed"); }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-gray-500" />
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
        {([["pricing", DollarSign, "Pricing"], ["admins", Users, "Admin Users"]] as const).map(([key, Icon, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as Tab)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
          >
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {/* Pricing tab */}
      {tab === "pricing" && (
        <div className="space-y-6">
          {villas.map(villa => (
            <div key={villa.id} className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-5">{villa.name}</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price per night (€)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">€</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={pricingDraft[villa.id]?.pricePerNight ?? ""}
                      onChange={e => setPricingDraft(d => ({ ...d, [villa.id]: { ...d[villa.id], pricePerNight: e.target.value } }))}
                      className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cleaning fee (€)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">€</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={pricingDraft[villa.id]?.cleaningFee ?? ""}
                      onChange={e => setPricingDraft(d => ({ ...d, [villa.id]: { ...d[villa.id], cleaningFee: e.target.value } }))}
                      className="w-full pl-7 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>
              {pricingError[villa.id] && <p className="text-red-500 text-sm mb-3">{pricingError[villa.id]}</p>}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => savePricing(villa.id)}
                  disabled={pricingSaving[villa.id]}
                  className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {pricingSaving[villa.id] ? "Saving…" : "Save Prices"}
                </button>
                {pricingSaved[villa.id] && (
                  <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                    <CheckCircle className="w-4 h-4" /> Saved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admins tab */}
      {tab === "admins" && (
        <div className="space-y-6">

          {/* Change password */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-5">Change Your Password</h2>
            <div className="space-y-3 max-w-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Current password</label>
                <div className="relative">
                  <input
                    type={pwShow ? "text" : "password"}
                    value={pwCurrent}
                    onChange={e => setPwCurrent(e.target.value)}
                    className="w-full pr-10 px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button onClick={() => setPwShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {pwShow ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New password</label>
                <input
                  type={pwShow ? "text" : "password"}
                  value={pwNew}
                  onChange={e => setPwNew(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm new password</label>
                <input
                  type={pwShow ? "text" : "password"}
                  value={pwConfirm}
                  onChange={e => setPwConfirm(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              {pwMsg && <p className={`text-sm font-medium ${pwMsg.ok ? "text-green-600" : "text-red-500"}`}>{pwMsg.text}</p>}
              <button
                onClick={changePassword}
                disabled={pwSaving || !pwCurrent || !pwNew || !pwConfirm}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                <Save className="w-4 h-4" />
                {pwSaving ? "Saving…" : "Update Password"}
              </button>
            </div>
          </div>

          {/* Admin list */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-5">Admin Users</h2>
            <div className="space-y-3 mb-6">
              {admins.map(a => (
                <div key={a.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{a.name}</p>
                    <p className="text-gray-500 text-xs">{a.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {a.id === currentAdminId && <span className="text-xs bg-sky-100 text-sky-600 font-semibold px-2 py-0.5 rounded-full">You</span>}
                    {a.id !== currentAdminId && (
                      <button onClick={() => deleteAdmin(a.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add new admin */}
            <h3 className="font-semibold text-gray-800 text-sm mb-3">Add New Admin</h3>
            <div className="grid grid-cols-2 gap-3 max-w-lg">
              <input
                placeholder="Full name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <input
                placeholder="Email address"
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <div className="relative">
                <input
                  placeholder="Password (min 8 chars)"
                  type={newPwShow ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full pr-10 px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button onClick={() => setNewPwShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {newPwShow ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={addAdmin}
                disabled={addSaving}
                className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                {addSaving ? "Adding…" : "Add Admin"}
              </button>
            </div>
            {addMsg && <p className={`text-sm font-medium mt-3 ${addMsg.ok ? "text-green-600" : "text-red-500"}`}>{addMsg.text}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
