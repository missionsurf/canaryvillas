import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Building2, Calendar, Mail, Phone, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface Props {
  searchParams: Promise<{ bookingId?: string }>;
}

export default async function BankTransferPage({ searchParams }: Props) {
  const { bookingId } = await searchParams;

  const booking = bookingId
    ? await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { villa: true },
      })
    : null;

  const bankName = process.env.BANK_NAME || "Your bank";
  const bankAccountName = process.env.BANK_ACCOUNT_NAME || "Villas de Corralejho 2023";
  const bankIban = process.env.BANK_IBAN || "Please contact us for bank details";
  const bankBic = process.env.BANK_BIC || "";
  const bankSortCode = process.env.BANK_SORT_CODE || "";
  const bankAccountNumber = process.env.BANK_ACCOUNT_NUMBER || "";

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-10">
        <div className="inline-flex bg-blue-100 p-4 rounded-full mb-6">
          <Building2 className="w-12 h-12 text-blue-600" />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Dates Reserved!</h1>
        <p className="text-gray-500 mb-6">
          Your dates are held for 48 hours. Please transfer your 50% deposit to confirm your booking.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Your booking is <strong>not confirmed</strong> until we receive your deposit. Dates will be released after 48 hours if payment is not received.
          </p>
        </div>

        {booking && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h2 className="font-bold text-gray-900 mb-4">{booking.villa.name}</h2>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-500" />
                <span>{format(booking.checkIn, "d MMM yyyy")} → {format(booking.checkOut, "d MMM yyyy")} ({booking.nights} nights)</span>
              </div>
            </div>
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Total holiday cost</span>
                <span>€{booking.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sky-700 text-base">
                <span>50% deposit due now</span>
                <span>€{(booking.depositAmount ?? booking.totalPrice / 2).toFixed(2)}</span>
              </div>
              {booking.balanceDueDate && (
                <div className="flex justify-between text-gray-500 text-xs">
                  <span>Balance due</span>
                  <span>€{(booking.balanceAmount ?? booking.totalPrice / 2).toFixed(2)} by {format(booking.balanceDueDate, "d MMM yyyy")}</span>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-2">Ref: {booking.id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
        )}

        <div className="bg-sky-50 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-500" /> Bank Transfer Details
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Bank</span>
              <span className="font-medium text-gray-900">{bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Account name</span>
              <span className="font-medium text-gray-900">{bankAccountName}</span>
            </div>
            {bankIban && (
              <div className="flex justify-between">
                <span className="text-gray-500">IBAN</span>
                <span className="font-mono font-medium text-gray-900 text-xs">{bankIban}</span>
              </div>
            )}
            {bankBic && (
              <div className="flex justify-between">
                <span className="text-gray-500">BIC/SWIFT</span>
                <span className="font-mono font-medium text-gray-900">{bankBic}</span>
              </div>
            )}
            {bankSortCode && (
              <div className="flex justify-between">
                <span className="text-gray-500">Sort code</span>
                <span className="font-mono font-medium text-gray-900">{bankSortCode}</span>
              </div>
            )}
            {bankAccountNumber && (
              <div className="flex justify-between">
                <span className="text-gray-500">Account number</span>
                <span className="font-mono font-medium text-gray-900">{bankAccountNumber}</span>
              </div>
            )}
            {booking && (
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-500">Reference</span>
                <span className="font-bold text-gray-900">{booking.id.slice(-8).toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-sm text-gray-600 space-y-2">
          <p className="font-semibold text-gray-800">What happens next?</p>
          <p>📧 We&apos;ve sent full details to your email.</p>
          <p>✅ Once we receive your deposit, we&apos;ll confirm your booking within 24 hours.</p>
          <p>💬 Questions? Contact us:</p>
          <div className="flex gap-4 mt-2">
            <a href="mailto:info@canaryvillas.com" className="flex items-center gap-1 text-sky-600">
              <Mail className="w-4 h-4" /> Email
            </a>
            <a href="tel:+447809870561" className="flex items-center gap-1 text-sky-600">
              <Phone className="w-4 h-4" /> Call
            </a>
          </div>
        </div>

        <Link href="/" className="block text-center text-sky-600 hover:text-sky-700 font-medium text-sm">
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
}
