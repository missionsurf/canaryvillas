import { redirect } from "next/navigation";
import { getGuestSession } from "@/lib/guest-auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { Palmtree, CalendarDays, LogOut, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

const statusColour: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-gray-100 text-gray-500",
  refunded: "bg-gray-100 text-gray-500",
};

export default async function AccountPage() {
  const email = await getGuestSession();
  if (!email) redirect("/account/login");

  const bookings = await prisma.booking.findMany({
    where: { guestEmail: email },
    include: { villa: true },
    orderBy: { checkIn: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Palmtree className="w-6 h-6 text-sky-500" />
            <span className="font-bold text-sky-700 text-lg">Canary Villas</span>
          </div>
          <form action="/api/account/logout" method="POST">
            <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </form>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Your bookings</h1>
        <p className="text-gray-500 text-sm mb-8">{email}</p>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No bookings found for this email address.</p>
            <p className="text-sm text-gray-400 mt-1">
              Questions?{" "}
              <a href="mailto:info@canaryvillas.com" className="text-sky-500 hover:underline">
                Contact us
              </a>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const now = new Date();
              const isUpcoming = b.checkIn > now;
              const isPast = b.checkOut < now;
              return (
                <Link
                  key={b.id}
                  href={`/account/booking/${b.id}`}
                  className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColour[b.status] ?? "bg-gray-100 text-gray-500"}`}>
                          {b.status}
                        </span>
                        {isUpcoming && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-600">
                            upcoming
                          </span>
                        )}
                        {isPast && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-50 text-gray-400">
                            past
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-gray-900 text-base leading-snug">{b.villa.name}</p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {format(b.checkIn, "d MMM yyyy")} → {format(b.checkOut, "d MMM yyyy")} · {b.nights} nights
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className={b.depositPaid ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>
                          Deposit {b.depositPaid ? "paid" : "pending"}
                        </span>
                        <span className="text-gray-300">·</span>
                        <span className={b.balancePaid ? "text-green-600 font-medium" : b.depositPaid ? "text-yellow-600 font-medium" : "text-gray-400"}>
                          Balance {b.balancePaid ? "paid" : "outstanding"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-lg font-bold text-gray-900">€{b.totalPrice.toFixed(0)}</span>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-sky-500 transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-10 bg-sky-600 rounded-2xl p-6 text-white text-center">
          <p className="font-bold mb-1">Need to make a new booking?</p>
          <p className="text-sky-100 text-sm mb-4">Browse our villas and book directly for the best price.</p>
          <Link href="/villas" className="inline-block bg-white text-sky-600 font-bold px-6 py-2.5 rounded-full text-sm hover:bg-sky-50 transition-colors">
            View villas
          </Link>
        </div>
      </div>
    </div>
  );
}
