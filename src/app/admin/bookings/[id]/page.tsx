import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format, differenceInDays } from "date-fns";
import {
  ArrowLeft, User, Home, Calendar, CreditCard,
  Mail, Phone, FileText, Clock, ExternalLink, ChevronRight
} from "lucide-react";
import AdminBookingDetailActions from "@/components/AdminBookingDetailActions";
import AdminEmailComposer from "@/components/AdminEmailComposer";
import AdminNotesEditor from "@/components/AdminNotesEditor";

export const dynamic = "force-dynamic";

const statusColour: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { villa: true },
  });
  if (!booking) notFound();

  const daysUntilCheckIn = differenceInDays(booking.checkIn, new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/bookings" className="hover:text-gray-900 flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Bookings</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-gray-900">#{booking.id.slice(-8).toUpperCase()}</span>
        <span className={`ml-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColour[booking.status] || "bg-gray-100 text-gray-600"}`}>
          {booking.status}
        </span>
        <div className="ml-auto">
          <a
            href={`/api/admin/bookings/${booking.id}/invoice`}
            target="_blank"
            className="flex items-center gap-1.5 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" /> Invoice
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column — main info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Status banner */}
            {daysUntilCheckIn > 0 && daysUntilCheckIn <= 14 && booking.status === "confirmed" && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-sm text-amber-800 font-medium">
                  Check-in is in <strong>{daysUntilCheckIn} day{daysUntilCheckIn !== 1 ? "s" : ""}</strong> — consider sending arrival instructions.
                </p>
              </div>
            )}

            {/* Guest info */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-sky-500" /> Guest Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Name</p>
                  <p className="font-semibold text-gray-900 text-base">{booking.guestName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Guests</p>
                  <p className="font-semibold text-gray-900">{booking.guests} guest{booking.guests > 1 ? "s" : ""}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Email</p>
                  <a href={`mailto:${booking.guestEmail}`} className="text-sky-600 hover:text-sky-700 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {booking.guestEmail}
                  </a>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Phone</p>
                  {booking.guestPhone ? (
                    <a href={`tel:${booking.guestPhone}`} className="text-sky-600 hover:text-sky-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> {booking.guestPhone}
                    </a>
                  ) : <p className="text-gray-400">Not provided</p>}
                </div>
              </div>
            </div>

            {/* Booking details */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Home className="w-5 h-5 text-sky-500" /> Booking Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Villa</p>
                  <Link href={`/villas/${booking.villa.slug}`} target="_blank" className="font-semibold text-gray-900 hover:text-sky-600 flex items-center gap-1">
                    {booking.villa.name} <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Source</p>
                  <p className="font-semibold text-gray-900 capitalize">{booking.source}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Check-in</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    {format(booking.checkIn, "EEE d MMM yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Check-out</p>
                  <p className="font-semibold text-gray-900 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    {format(booking.checkOut, "EEE d MMM yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Duration</p>
                  <p className="font-semibold text-gray-900">{booking.nights} nights</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Booked on</p>
                  <p className="font-semibold text-gray-900">{format(booking.createdAt, "d MMM yyyy, HH:mm")}</p>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>€{booking.pricePerNight.toFixed(2)} × {booking.nights} nights</span>
                  <span>€{(booking.pricePerNight * booking.nights).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Cleaning fee</span>
                  <span>€{booking.cleaningFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 border-t pt-2 text-base">
                  <span>Total</span>
                  <span>€{booking.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-sky-500" /> Payment
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Stripe Session</p>
                  {booking.stripeSessionId ? (
                    <a
                      href={`https://dashboard.stripe.com/payments/${booking.stripePaymentId || ""}`}
                      target="_blank"
                      className="text-sky-600 hover:text-sky-700 font-mono text-xs flex items-center gap-1"
                    >
                      {booking.stripeSessionId.slice(0, 24)}… <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : <p className="text-gray-400">Manual / offline</p>}
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Payment ID</p>
                  <p className="font-mono text-xs text-gray-600">{booking.stripePaymentId || "—"}</p>
                </div>
              </div>
              <div className="mt-5">
                <AdminBookingDetailActions
                  bookingId={booking.id}
                  status={booking.status}
                  stripePaymentId={booking.stripePaymentId}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-sky-500" /> Internal Notes
              </h2>
              <AdminNotesEditor bookingId={booking.id} initialNotes={booking.notes || ""} />
            </div>
          </div>

          {/* Right column — email */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-sky-500" /> Send Email to Guest
              </h2>
              <AdminEmailComposer
                bookingId={booking.id}
                guestName={booking.guestName}
                guestEmail={booking.guestEmail}
                villaName={booking.villa.name}
                villaAddress={booking.villa.location}
              />
            </div>

            {/* Quick stats */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide text-gray-500">Quick Info</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking ref</span>
                  <span className="font-mono font-bold text-gray-900">{booking.id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Days until check-in</span>
                  <span className={`font-bold ${daysUntilCheckIn < 0 ? "text-gray-400" : daysUntilCheckIn <= 7 ? "text-amber-600" : "text-gray-900"}`}>
                    {daysUntilCheckIn < 0 ? "Past" : `${daysUntilCheckIn}d`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Revenue</span>
                  <span className="font-bold text-green-600">€{booking.totalPrice.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
