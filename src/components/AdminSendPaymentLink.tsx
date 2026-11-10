"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, X, ChevronDown } from "lucide-react";

interface Props {
  bookingId: string;
  depositAmount: number;
  balanceAmount: number;
  totalPrice: number;
}

export default function AdminSendPaymentLink({ bookingId, depositAmount, balanceAmount, totalPrice }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<"bank" | "paypal">("bank");
  const [amountType, setAmountType] = useState<"deposit" | "balance" | "custom">("deposit");
  const [customAmount, setCustomAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const deposit = depositAmount ?? Math.round(totalPrice / 2 * 100) / 100;
  const balance = balanceAmount ?? Math.round(totalPrice / 2 * 100) / 100;

  const displayAmount =
    amountType === "deposit" ? deposit :
    amountType === "balance" ? balance :
    parseFloat(customAmount) || 0;

  async function send() {
    setSending(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/send-payment-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          amountType,
          customAmount: amountType === "custom" ? parseFloat(customAmount) : undefined,
        }),
      });
      let data: { error?: string } = {};
      try { data = await res.json(); } catch {}
      if (res.ok) {
        setSent(true);
        router.refresh();
        setTimeout(() => { setSent(false); setOpen(false); }, 2000);
      } else {
        setError(data.error || `Failed (${res.status})`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        <CreditCard className="w-4 h-4" /> Send Payment Link
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">Send Payment Link</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment method</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["bank", "paypal"] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${method === m ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                    >
                      {m === "bank" ? "🏦 Bank Transfer" : "💳 PayPal"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
                <div className="space-y-2">
                  {([
                    ["deposit", `50% Deposit — €${deposit.toFixed(2)}`],
                    ["balance", `Balance — €${balance.toFixed(2)}`],
                    ["custom", "Custom amount"],
                  ] as const).map(([val, label]) => (
                    <label key={val} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="amountType"
                        value={val}
                        checked={amountType === val}
                        onChange={() => setAmountType(val)}
                        className="text-indigo-600"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
                {amountType === "custom" && (
                  <div className="mt-2 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">€</span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                )}
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                onClick={send}
                disabled={sending || sent || (amountType === "custom" && !customAmount)}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : sent ? "Sent ✓" : `Send €${displayAmount > 0 ? displayAmount.toFixed(2) : "—"} link`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
