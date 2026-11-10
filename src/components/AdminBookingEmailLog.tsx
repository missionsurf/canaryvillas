"use client";

import { useState } from "react";
import { format } from "date-fns";
import { X, Eye } from "lucide-react";

interface EmailEntry {
  id: string;
  subject: string;
  type: string;
  html: string;
  sentAt: string;
}

const TYPE_LABELS: Record<string, { label: string; colour: string }> = {
  booking_confirmation:       { label: "Booking Confirmed",  colour: "bg-green-100 text-green-700" },
  bank_transfer_instructions: { label: "Bank Transfer",      colour: "bg-blue-100 text-blue-700" },
  balance_reminder:           { label: "Balance Reminder",   colour: "bg-amber-100 text-amber-700" },
  balance_paid:               { label: "Balance Paid",       colour: "bg-green-100 text-green-700" },
  enquiry_received:           { label: "Enquiry",            colour: "bg-sky-100 text-sky-700" },
  payment_request:            { label: "Payment Request",    colour: "bg-purple-100 text-purple-700" },
  arrival_instructions:       { label: "Arrival Info",       colour: "bg-indigo-100 text-indigo-700" },
  special_offer:              { label: "Special Offer",      colour: "bg-pink-100 text-pink-700" },
  custom:                     { label: "Custom",             colour: "bg-gray-100 text-gray-700" },
};

export default function AdminBookingEmailLog({ emails }: { emails: EmailEntry[] }) {
  const [preview, setPreview] = useState<EmailEntry | null>(null);

  if (emails.length === 0) {
    return <p className="text-gray-400 text-sm">No emails sent yet.</p>;
  }

  return (
    <>
      <ol className="space-y-2">
        {emails.map((email) => {
          const { label, colour } = TYPE_LABELS[email.type] ?? { label: email.type, colour: "bg-gray-100 text-gray-700" };
          return (
            <li key={email.id} className="flex items-start gap-3">
              <div className="mt-1.5 w-2 h-2 rounded-full bg-sky-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${colour}`}>
                    {label}
                  </span>
                  <button
                    onClick={() => setPreview(email)}
                    className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800 font-medium"
                  >
                    <Eye className="w-3 h-3" /> View
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{format(new Date(email.sentAt), "d MMM yyyy, HH:mm")}</p>
              </div>
            </li>
          );
        })}
      </ol>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-200">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">{preview.subject}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {format(new Date(preview.sentAt), "d MMM yyyy 'at' HH:mm")}
                </p>
              </div>
              <button onClick={() => setPreview(null)} className="shrink-0 text-gray-400 hover:text-gray-700 mt-0.5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                srcDoc={preview.html}
                className="w-full h-full border-0"
                sandbox="allow-same-origin"
                title="Email preview"
                style={{ minHeight: "500px" }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
