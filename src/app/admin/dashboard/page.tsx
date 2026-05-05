import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import AdminSyncButton from "@/components/AdminSyncButton";
import AdminBookingActions from "@/components/AdminBookingActions";
import {
  Calendar,
  Home,
  Users,
  TrendingUp,
  RefreshCw,
  LogOut,
  Plus,
  UserCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const [villas, bookings] = await Promise.all([
    prisma.villa.findMany({ select: { id: true, name: true, slug: true } }),
    prisma.booking.findMany({
      include: { villa: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  const statusColour: Record<string, string> = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
    refunded: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5 text-sky-600" />
            <span className="font-bold text-gray-900">Canary Villas Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/guests"
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-sky-600 font-medium transition-colors"
            >
              <UserCircle className="w-4 h-4" /> Guests
            </Link>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm text-gray-500">{session.name}</span>
            <Link
              href="/api/admin/login"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
          {[
            { icon: TrendingUp, label: "Total Revenue", value: `€${totalRevenue.toFixed(0)}`, colour: "text-green-600" },
            { icon: Calendar, label: "Confirmed Bookings", value: confirmedBookings.length, colour: "text-sky-600" },
            { icon: Users, label: "Pending Bookings", value: pendingCount, colour: "text-amber-500" },
            { icon: Home, label: "Properties", value: villas.length, colour: "text-purple-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center gap-3 mb-2">
                <s.icon className={`w-5 h-5 ${s.colour}`} />
                <span className="text-sm text-gray-500">{s.label}</span>
              </div>
              <div className={`text-3xl font-extrabold ${s.colour}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Airbnb Sync */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-sky-500" /> Airbnb Calendar Sync
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Sync Airbnb iCal feeds to block dates and prevent double-bookings.
              </p>
            </div>
            <AdminSyncButton />
          </div>

          <div className="mt-5 space-y-3">
            {villas.map((v) => (
              <div key={v.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                <span className="font-medium text-gray-700">{v.name}</span>
                <div className="flex gap-3">
                  <a
                    href={`/api/ical?slug=${v.slug}`}
                    target="_blank"
                    className="text-sky-600 hover:text-sky-700 text-xs"
                  >
                    Export iCal →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Recent Bookings</h2>
            <Link
              href="/admin/bookings/new"
              className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> New Booking
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-6 py-3">Guest</th>
                  <th className="px-6 py-3">Villa</th>
                  <th className="px-6 py-3">Dates</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-sky-50 cursor-pointer group">
                    <td className="px-6 py-4">
                      <Link href={`/admin/bookings/${b.id}`} className="block">
                        <div className="font-medium text-gray-900 group-hover:text-sky-700">{b.guestName}</div>
                        <div className="text-gray-400 text-xs">{b.guestEmail}</div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <Link href={`/admin/bookings/${b.id}`} className="block">{b.villa.name}</Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <Link href={`/admin/bookings/${b.id}`} className="block">
                        <div>{format(b.checkIn, "d MMM yy")}</div>
                        <div className="text-gray-400">→ {format(b.checkOut, "d MMM yy")}</div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      <Link href={`/admin/bookings/${b.id}`} className="block">€{b.totalPrice.toFixed(0)}</Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/bookings/${b.id}`} className="block">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColour[b.status] || "bg-gray-100 text-gray-600"}`}>
                          {b.status}
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <AdminBookingActions bookingId={b.id} currentStatus={b.status} />
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                      No bookings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
