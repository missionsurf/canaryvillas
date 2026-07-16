"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CreditCard, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface BookingData {
  id: string;
  guestName: string;
  guestEmail: string;
  villaName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  depositAmount: number;
  balanceAmount: number;
  balanceDueDate: string;
  balancePaid: boolean;
}

export default function PayBalancePage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/bookings/balance-info?bookingId=${bookingId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setBooking(data);
      })
      .finally(() => setLoading(false));
  }, [bookingId]);

  async function payByCard() {
    setPaying(true);
    setError("");
    try {
      const res = await fetch("/api/bookings/pay-balance-stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setError(data.error || "Something went wrong");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 text-red-700 rounded-2xl p-8 max-w-md text-center">
          <p className="font-bold mb-2">Unable to load booking</p>
          <p className="text-sm">{error || "Booking not found"}</p>
        </div>
      </div>
    );
  }

  if (booking.balancePaid) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-10 text-center">
          <div className="inline-flex bg-green-100 p-4 rounded-full mb-6">
            <CreditCard className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Balance Already Paid</h1>
          <p className="text-gray-500">Your balance has been received. You&apos;re all set for your holiday!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Pay Your Balance</h1>
        <p className="text-gray-500 mb-6">Hi {booking.guestName}, your balance is now due for your upcoming stay.</p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">{booking.villaName}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Calendar className="w-4 h-4 text-sky-500" />
            <span>
              {format(new Date(booking.checkIn), "d MMM yyyy")} →{" "}
              {format(new Date(booking.checkOut), "d MMM yyyy")} ({booking.nights} nights)
            </span>
          </div>
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Total cost</span>
              <span>€{booking.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Deposit paid</span>
              <span className="text-green-600">−€{booking.depositAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base border-t pt-2">
              <span>Balance due</span>
              <span>€{booking.balanceAmount.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400">
              Due by {format(new Date(booking.balanceDueDate), "d MMMM yyyy")}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm mb-4">{error}</div>
        )}

        <button
          onClick={payByCard}
          disabled={paying}
          className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors mb-3"
        >
          {paying ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</>
          ) : (
            <><CreditCard className="w-5 h-5" /> Pay €{booking.balanceAmount.toFixed(2)} by Card</>
          )}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Secure payment via Stripe. Need help?{" "}
          <a href="mailto:info@canaryvillas.com" className="text-sky-500">info@canaryvillas.com</a>
        </p>
      </div>
    </div>
  );
}
