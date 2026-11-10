import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Mail } from "lucide-react";
import AdminEmailLogViewer from "@/components/AdminEmailLogViewer";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, { label: string; colour: string }> = {
  booking_confirmation:     { label: "Booking Confirmed",    colour: "bg-green-100 text-green-700" },
  bank_transfer_instructions: { label: "Bank Transfer",      colour: "bg-blue-100 text-blue-700" },
  balance_reminder:         { label: "Balance Reminder",     colour: "bg-amber-100 text-amber-700" },
  balance_paid:             { label: "Balance Paid",         colour: "bg-green-100 text-green-700" },
  enquiry_received:         { label: "Enquiry",              colour: "bg-sky-100 text-sky-700" },
  payment_request:          { label: "Payment Request",      colour: "bg-purple-100 text-purple-700" },
  arrival_instructions:     { label: "Arrival Info",         colour: "bg-indigo-100 text-indigo-700" },
  special_offer:            { label: "Special Offer",        colour: "bg-pink-100 text-pink-700" },
  custom:                   { label: "Custom",               colour: "bg-gray-100 text-gray-700" },
};

export default async function EmailsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  let emails: Awaited<ReturnType<typeof prisma.emailLog.findMany>> = [];
  try {
    emails = await prisma.emailLog.findMany({
      orderBy: { sentAt: "desc" },
      take: 200,
    });
  } catch {
    // email_logs table may not exist yet — migration pending
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-sky-100 p-2.5 rounded-xl">
          <Mail className="w-5 h-5 text-sky-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Email Log</h1>
          <p className="text-sm text-gray-500">{emails.length} emails sent</p>
        </div>
      </div>

      {emails.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Mail className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No emails logged yet. Emails sent to guests will appear here.</p>
        </div>
      ) : (
        <AdminEmailLogViewer
          emails={emails.map((e) => ({
            id: e.id,
            to: e.to,
            subject: e.subject,
            type: e.type,
            bookingId: e.bookingId,
            html: e.html,
            sentAt: e.sentAt.toISOString(),
          }))}
          typeLabels={TYPE_LABELS}
        />
      )}
    </div>
  );
}
