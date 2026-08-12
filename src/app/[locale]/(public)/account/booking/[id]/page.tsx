import { redirect, notFound } from "next/navigation";
import { getGuestSession } from "@/lib/guest-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import {
  ArrowLeft, CalendarDays, Users, CreditCard, FileText,
  CheckCircle2, Clock, AlertCircle, MapPin
} from "lucide-react";
import PayBalanceButton from "./PayBalanceButton";

export const dynamic = "force-dynamic";

export default async function AccountBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ paid?: string }>;
}) {
  const email = await getGuestSession();
  if (!email) redirect("/account/login");

  const { id } = await params;
  const { paid } = await searchParams;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { villa: true },
  });

  if (!booking || booking.guestEmail.toLowerCase() !== email.toLowerCase()) notFound();

  const ref = booking.id.slice(-8).toUpperCase();
  const now = new Date();
  const daysUntilCheckIn = differenceInDays(booking.checkIn, now);
  const isUpcoming = booking.checkIn > now;
  const showArrivalInfo = isUpcoming && daysUntilCheckIn <= 7;
  const balanceDue = !booking.balancePaid && booking.depositPaid && booking.status === "confirmed";

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> All bookings
        </Link>

        {paid === "true" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <p className="text-green-700 text-sm font-medium">Balance payment received — your booking is fully paid!</p>
          </div>
        )}

        {/* Status header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Booking ref #{ref}</p>
              <h1 className="text-xl font-extrabold text-gray-900">{booking.villa.name}</h1>
              <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Corralejo, Fuerteventura
              </p>
            </div>
            <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${
              booking.status === "confirmed" ? "bg-green-100 text-green-700" :
              booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
              "bg-gray-100 text-gray-500"
            }`}>
              {booking.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Check-in</p>
              <p className="text-sm font-semibold text-gray-900">{format(booking.checkIn, "EEE d MMM yyyy")}</p>
              <p className="text-xs text-gray-400">from 15:00</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Check-out</p>
              <p className="text-sm font-semibold text-gray-900">{format(booking.checkOut, "EEE d MMM yyyy")}</p>
              <p className="text-xs text-gray-400">by 10:00</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Duration</p>
              <p className="text-sm font-semibold text-gray-900">{booking.nights} nights</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-0.5">Guests</p>
              <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-gray-400" /> {booking.guests}
              </p>
            </div>
          </div>

          {isUpcoming && daysUntilCheckIn > 0 && (
            <div className="mt-4 bg-sky-50 rounded-xl px-4 py-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-sky-500 shrink-0" />
              <p className="text-sky-700 text-sm font-medium">
                {daysUntilCheckIn === 1 ? "Check-in is tomorrow!" : `${daysUntilCheckIn} days until check-in`}
              </p>
            </div>
          )}
        </div>

        {/* Payment summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-sky-500" /> Payments
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {booking.depositPaid
                  ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                  : <Clock className="w-4 h-4 text-yellow-500" />}
                <span className="text-sm text-gray-700">Deposit (50%)</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">
                  €{(booking.depositAmount ?? booking.totalPrice / 2).toFixed(2)}
                </span>
                <span className={`ml-2 text-xs font-semibold ${booking.depositPaid ? "text-green-600" : "text-yellow-600"}`}>
                  {booking.depositPaid ? "paid" : "pending"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {booking.balancePaid
                  ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                  : balanceDue
                  ? <AlertCircle className="w-4 h-4 text-orange-500" />
                  : <Clock className="w-4 h-4 text-gray-300" />}
                <span className="text-sm text-gray-700">
                  Balance
                  {booking.balanceDueDate && !booking.balancePaid && (
                    <span className="text-xs text-gray-400 ml-1">
                      (due {format(booking.balanceDueDate, "d MMM yyyy")})
                    </span>
                  )}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">
                  €{(booking.balanceAmount ?? booking.totalPrice / 2).toFixed(2)}
                </span>
                <span className={`ml-2 text-xs font-semibold ${
                  booking.balancePaid ? "text-green-600" :
                  balanceDue ? "text-orange-600" : "text-gray-400"
                }`}>
                  {booking.balancePaid ? "paid" : "outstanding"}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="text-base font-bold text-gray-900">€{booking.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {balanceDue && !booking.balancePaid && (
            <div className="mt-4">
              <PayBalanceButton bookingId={booking.id} amount={booking.balanceAmount ?? booking.totalPrice / 2} />
            </div>
          )}
        </div>

        {/* Arrival info — only shown 7 days before check-in */}
        {showArrivalInfo && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-4">
            <h2 className="font-bold text-amber-900 mb-2">Arrival information</h2>
            <p className="text-amber-700 text-sm">
              Full arrival instructions including access codes and WiFi details will be sent to your email address closer to check-in, or you can contact us at{" "}
              <a href="mailto:info@canaryvillas.com" className="underline">info@canaryvillas.com</a>.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-500" /> Documents
          </h2>
          <a
            href={`/api/account/bookings/${booking.id}/invoice`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-sky-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Invoice #{ref}</p>
              <p className="text-xs text-gray-400">Open in browser · print or save as PDF</p>
            </div>
            <ArrowLeft className="w-4 h-4 text-gray-300 group-hover:text-sky-500 rotate-180 ml-auto transition-colors" />
          </a>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Questions?{" "}
          <a href="mailto:info@canaryvillas.com" className="text-sky-500 hover:underline">info@canaryvillas.com</a>
          {" "}·{" "}
          <a href="tel:+447809870561" className="text-sky-500 hover:underline">+44 7809 870561</a>
        </p>
      </div>
    </div>
  );
}
