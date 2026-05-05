import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format, differenceInDays } from "date-fns";
import { Calendar, Home, Users, TrendingUp, Clock, ArrowRight, Star } from "lucide-react";

export const dynamic = "force-dynamic";

const statusColour: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const now = new Date();

  const [villas, bookings, guestCount] = await Promise.all([
    prisma.villa.findMany({ select: { id: true, name: true } }),
    prisma.booking.findMany({
      include: { villa: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.guest.count(),
  ]);

  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const pending = bookings.filter((b) => b.status === "pending");
  const totalRevenue = confirmed.reduce((s, b) => s + b.totalPrice, 0);

  const upcoming = confirmed
    .filter((b) => b.checkIn >= now)
    .sort((a, b) => a.checkIn.getTime() - b.checkIn.getTime())
    .slice(0, 5);

  const recentBookings = bookings.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Good {now.getHours() < 12 ? "morning" : now.getHours() < 18 ? "afternoon" : "evening"}, {session.name.split(" ")[0]} 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5">{format(now, "EEEE, d MMMM yyyy")}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: TrendingUp, label: "Total Revenue", value: `€${totalRevenue.toFixed(0)}`, colour: "text-green-600", bg: "bg-green-50", href: "/admin/bookings?status=confirmed" },
            { icon: Calendar, label: "Confirmed Stays", value: confirmed.length, colour: "text-sky-600", bg: "bg-sky-50", href: "/admin/bookings?status=confirmed" },
            { icon: Clock, label: "Pending Review", value: pending.length, colour: "text-amber-600", bg: "bg-amber-50", href: "/admin/bookings?status=pending" },
            { icon: Users, label: "Guests in CRM", value: guestCount, colour: "text-purple-600", bg: "bg-purple-50", href: "/admin/guests" },
          ].map((s) => (
            <Link key={s.label} href={s.href} className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-shadow group">
              <div className={`inline-flex p-2 rounded-xl ${s.bg} mb-3`}>
                <s.icon className={`w-5 h-5 ${s.colour}`} />
              </div>
              <div className={`text-3xl font-extrabold ${s.colour}`}>{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Upcoming check-ins */}
          <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-500" /> Upcoming Check-ins
              </h2>
              <Link href="/admin/bookings?status=confirmed" className="text-sky-600 text-sm hover:text-sky-700 flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <p className="px-6 py-8 text-center text-gray-400 text-sm">No upcoming check-ins.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {upcoming.map((b) => {
                  const days = differenceInDays(b.checkIn, now);
                  return (
                    <Link key={b.id} href={`/admin/bookings/${b.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-sky-50 transition-colors">
                      <div className={`shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-center ${days <= 3 ? "bg-red-100" : days <= 7 ? "bg-amber-100" : "bg-sky-100"}`}>
                        <span className={`text-xs font-bold ${days <= 3 ? "text-red-600" : days <= 7 ? "text-amber-600" : "text-sky-600"}`}>{days === 0 ? "TODAY" : `${days}d`}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{b.guestName}</p>
                        <p className="text-gray-400 text-xs">{b.villa.name} · {format(b.checkIn, "d MMM")} → {format(b.checkOut, "d MMM")} · {b.guests} guest{b.guests > 1 ? "s" : ""}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-bold text-gray-900">€{b.totalPrice.toFixed(0)}</p>
                        <p className="text-xs text-gray-400">{b.nights}n</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Pending */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" /> Needs Attention
              </h2>
              {pending.length === 0 ? (
                <p className="text-gray-400 text-sm">All caught up!</p>
              ) : (
                <div className="space-y-2">
                  {pending.slice(0, 4).map((b) => (
                    <Link key={b.id} href={`/admin/bookings/${b.id}`} className="flex items-center justify-between py-2 border-b last:border-0 hover:text-sky-600 transition-colors">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{b.guestName}</p>
                        <p className="text-xs text-gray-400">{b.villa.name}</p>
                      </div>
                      <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">pending</span>
                    </Link>
                  ))}
                  {pending.length > 4 && (
                    <Link href="/admin/bookings?status=pending" className="block text-center text-xs text-sky-600 hover:text-sky-700 pt-1">
                      +{pending.length - 4} more →
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide text-gray-500">Quick Links</h2>
              <div className="space-y-1">
                {[
                  { label: "All Bookings", href: "/admin/bookings", icon: Calendar },
                  { label: "Guest CRM", href: "/admin/guests", icon: Users },
                  { label: "Properties", href: "/admin/properties", icon: Home },
                  { label: "New Booking", href: "/admin/bookings/new", icon: Star },
                ].map(({ label, href, icon: Icon }) => (
                  <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-600 hover:text-sky-700 hover:bg-sky-50 transition-colors">
                    <Icon className="w-4 h-4" /> {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-sky-600 text-sm hover:text-sky-700 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-6 py-3">Guest</th>
                  <th className="px-6 py-3">Villa</th>
                  <th className="px-6 py-3">Check-in</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-sky-50 cursor-pointer group">
                    <td className="px-6 py-3">
                      <Link href={`/admin/bookings/${b.id}`} className="block">
                        <div className="font-semibold text-gray-900 group-hover:text-sky-700">{b.guestName}</div>
                        <div className="text-gray-400 text-xs">{b.guestEmail}</div>
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      <Link href={`/admin/bookings/${b.id}`} className="block">{b.villa.name}</Link>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      <Link href={`/admin/bookings/${b.id}`} className="block">{format(b.checkIn, "d MMM yyyy")}</Link>
                    </td>
                    <td className="px-6 py-3 font-semibold text-gray-900">
                      <Link href={`/admin/bookings/${b.id}`} className="block">€{b.totalPrice.toFixed(0)}</Link>
                    </td>
                    <td className="px-6 py-3">
                      <Link href={`/admin/bookings/${b.id}`} className="block">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColour[b.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {b.status}
                        </span>
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentBookings.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">No bookings yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
