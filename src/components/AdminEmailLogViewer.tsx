"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { X, ExternalLink } from "lucide-react";

interface EmailEntry {
  id: string;
  to: string;
  subject: string;
  type: string;
  bookingId: string | null;
  html: string;
  sentAt: string;
}

interface TypeMeta { label: string; colour: string }

interface Props {
  emails: EmailEntry[];
  typeLabels: Record<string, TypeMeta>;
}

export default function AdminEmailLogViewer({ emails, typeLabels }: Props) {
  const [preview, setPreview] = useState<EmailEntry | null>(null);

  function typeMeta(type: string): TypeMeta {
    return typeLabels[type] ?? { label: type, colour: "bg-gray-100 text-gray-700" };
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-600 w-44">Date</th>
              <th className="px-4 py-3 font-semibold text-gray-600 w-48">Recipient</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Subject</th>
              <th className="px-4 py-3 font-semibold text-gray-600 w-40">Type</th>
              <th className="px-4 py-3 font-semibold text-gray-600 w-24 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email, i) => {
              const { label, colour } = typeMeta(email.type);
              return (
                <tr
                  key={email.id}
                  className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/40"}`}
                >
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {format(new Date(email.sentAt), "d MMM yyyy, HH:mm")}
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-medium truncate max-w-[192px]">
                    {email.to}
                  </td>
                  <td className="px-4 py-3 text-gray-800 truncate max-w-xs">
                    {email.subject}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colour}`}>
                      {label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {email.bookingId && (
                        <Link
                          href={`/admin/bookings/${email.bookingId}`}
                          className="text-sky-600 hover:text-sky-800 text-xs font-medium"
                          title="View booking"
                        >
                          Booking
                        </Link>
                      )}
                      <button
                        onClick={() => setPreview(email)}
                        className="text-gray-500 hover:text-gray-900 text-xs font-medium flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setPreview(null)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-200">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">{preview.subject}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  To: <span className="text-gray-700">{preview.to}</span>
                  <span className="mx-2 text-gray-300">·</span>
                  {format(new Date(preview.sentAt), "d MMM yyyy 'at' HH:mm")}
                </p>
              </div>
              <button onClick={() => setPreview(null)} className="shrink-0 text-gray-400 hover:text-gray-700 mt-0.5">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email rendered in iframe */}
            <div className="flex-1 overflow-hidden">
              <iframe
                srcDoc={preview.html}
                className="w-full h-full border-0"
                sandbox="allow-same-origin"
                title="Email preview"
              />
            </div>

            {/* Footer */}
            {preview.bookingId && (
              <div className="border-t border-gray-200 px-5 py-3 flex justify-end">
                <Link
                  href={`/admin/bookings/${preview.bookingId}`}
                  className="text-sm text-sky-600 hover:text-sky-800 font-medium"
                  onClick={() => setPreview(null)}
                >
                  View booking →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
