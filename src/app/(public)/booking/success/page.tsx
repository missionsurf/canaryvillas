import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle2, Calendar, Users, Mail, Phone } from "lucide-react";
import { format } from "date-fns";

interface Props {
  searchParams: Promise<{ bookingId?: string }>;
}

export default async function BookingSuccessPage({ searchParams }: Props) {
  const { bookingId } = await searchParams;

  const booking = bookingId
    ? await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { villa: true },
      })
    : null;

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-10 text-center">
        <div className="inline-flex bg-green-100 p-4 rounded-full mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for booking with Canary Villas. A confirmation email has been sent to you.
        </p>

        {booking && (
          <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8">
            <h2 className="font-bold text-gray-900 mb-4 text-lg">{booking.villa.name}</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-sky-500 shrink-0" />
                <span>
                  {format(booking.checkIn, "d MMM yyyy")} →{" "}
                  {format(booking.checkOut, "d MMM yyyy")} ({booking.nights} nights)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-sky-500 shrink-0" />
                <span>{booking.guests} guest{booking.guests > 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                <span>{booking.guestEmail}</span>
              </div>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-gray-900">
              <span>Total paid</span>
              <span>€{booking.totalPrice.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Booking ref: {booking.id.toUpperCase()}
            </p>
          </div>
        )}

        <div className="space-y-3 mb-8 text-sm text-gray-600 bg-sky-50 rounded-2xl p-5 text-left">
          <p className="font-semibold text-gray-800">What happens next?</p>
          <p>✅ You will receive a confirmation email within a few minutes.</p>
          <p>📞 Our team will be in touch with property access details closer to your stay.</p>
          <p>💬 Any questions? Contact us anytime:</p>
          <div className="flex gap-4 mt-2">
            <a href="mailto:info@canaryvillas.com" className="flex items-center gap-1 text-sky-600 hover:text-sky-700">
              <Mail className="w-4 h-4" /> Email
            </a>
            <a href="tel:+447809870561" className="flex items-center gap-1 text-sky-600 hover:text-sky-700">
              <Phone className="w-4 h-4" /> Call
            </a>
          </div>
        </div>

        <Link
          href="/"
          className="inline-block bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
