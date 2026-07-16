import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Building2, Calendar, Mail, Phone, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface Props {
  searchParams: Promise<{ bookingId?: string }>;
}

function BankAccountCard({
  flag,
  currency,
  label,
  amount,
  rows,
  reference,
}: {
  flag: string;
  currency: string;
  label: string;
  amount?: string;
  rows: { label: string; value: string }[];
  reference?: string;
}) {
  return (
    <div className="bg-sky-50 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{flag}</span>
        <div>
          <p className="font-bold text-gray-900 text-sm">{label}</p>
          {amount && <p className="text-sky-700 font-semibold text-sm">{currency}{amount}</p>}
        </div>
      </div>
      <div className="space-y-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4">
            <span className="text-gray-500 shrink-0">{row.label}</span>
            <span className="font-mono font-medium text-gray-900 text-right text-xs">{row.value}</span>
          </div>
        ))}
        {reference && (
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="text-gray-500">Reference</span>
            <span className="font-bold text-gray-900 font-mono">{reference}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function BankTransferPage({ searchParams }: Props) {
  const { bookingId } = await searchParams;

  const booking = bookingId
    ? await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { villa: true },
      })
    : null;

  const depositAmount = booking?.depositAmount ?? (booking ? booking.totalPrice / 2 : 0);
  const ref = booking?.id.slice(-8).toUpperCase() ?? "";

  // EUR account (Spanish/EU bank)
  const eurBank = process.env.BANK_NAME || "";
  const eurAccountName = process.env.BANK_ACCOUNT_NAME || "Villas de Corralejho 2023";
  const eurIban = process.env.BANK_IBAN || "";
  const eurBic = process.env.BANK_BIC || "";

  // GBP account (UK bank)
  const gbpBank = process.env.BANK_GBP_NAME || "";
  const gbpAccountName = process.env.BANK_GBP_ACCOUNT_NAME || "Villas de Corralejho 2023";
  const gbpSortCode = process.env.BANK_GBP_SORT_CODE || "";
  const gbpAccountNumber = process.env.BANK_GBP_ACCOUNT_NUMBER || "";

  const eurRows = [
    ...(eurBank ? [{ label: "Bank", value: eurBank }] : []),
    { label: "Account name", value: eurAccountName },
    ...(eurIban ? [{ label: "IBAN", value: eurIban }] : []),
    ...(eurBic ? [{ label: "BIC/SWIFT", value: eurBic }] : []),
  ];

  const gbpRows = [
    ...(gbpBank ? [{ label: "Bank", value: gbpBank }] : []),
    { label: "Account name", value: gbpAccountName },
    ...(gbpSortCode ? [{ label: "Sort code", value: gbpSortCode }] : []),
    ...(gbpAccountNumber ? [{ label: "Account number", value: gbpAccountNumber }] : []),
  ];

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
            <h2 className="font-bold text-gray-900 mb-3">{booking.villa.name}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Calendar className="w-4 h-4 text-sky-500" />
              <span>{format(booking.checkIn, "d MMM yyyy")} → {format(booking.checkOut, "d MMM yyyy")} ({booking.nights} nights)</span>
            </div>
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Total holiday cost</span>
                <span>€{booking.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sky-700 text-base">
                <span>50% deposit due now</span>
                <span>€{depositAmount.toFixed(2)}</span>
              </div>
              {booking.balanceDueDate && (
                <div className="flex justify-between text-gray-500 text-xs">
                  <span>Balance due</span>
                  <span>€{(booking.balanceAmount ?? booking.totalPrice / 2).toFixed(2)} by {format(booking.balanceDueDate, "d MMM yyyy")}</span>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-1">Ref: {ref}</p>
            </div>
          </div>
        )}

        <p className="text-sm font-semibold text-gray-700 mb-3">
          Transfer to either account — choose the currency that suits you:
        </p>

        <div className="space-y-3 mb-6">
          <BankAccountCard
            flag="🇪🇺"
            currency="€"
            label="Euro account (recommended)"
            amount={booking ? depositAmount.toFixed(2) : undefined}
            rows={eurRows}
            reference={ref || undefined}
          />
          <BankAccountCard
            flag="🇬🇧"
            currency="£"
            label="UK Sterling account"
            amount={undefined}
            rows={gbpRows}
            reference={ref || undefined}
          />
        </div>

        <p className="text-xs text-gray-400 mb-6 text-center">
          If paying in £, please transfer the £ equivalent of €{booking ? depositAmount.toFixed(2) : "the deposit amount"} at your bank&apos;s exchange rate. Always include your reference number.
        </p>

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
