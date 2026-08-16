import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Plus, Search } from "lucide-react";
import AdminBookingActions from "@/components/AdminBookingActions";

export const dynamic = "force-dynamic";

const statusColour: Record<string, string> = {
  enquiry: "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

interface SearchParams { status?: string; villaId?: string; q?: string }

export default async function BookingsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const sp = await searchParams;
  const statusFilter = sp.status ?? "";
  const villaFilter = sp.villaId ?? "";
  const q = sp.q?.toLowerCase() ?? "";

  const [villas, allBookings] = await Promise.all([
    prisma.villa.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.booking.findMany({
      where: {
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(villaFilter ? { villaId: villaFilter } : {}),
      },
      include: { villa: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const bookings = q
    ? allBookings.filter((b) =>
        b.guestName.toLowerCase().includes(q) ||
        b.guestEmail.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q)
      )
    : allBookings;

  const counts = {
    all: allBookings.length,
    pending: allBookings.filter((b) => b.status === "pending").length,
    confirmed: allBookings.filter((b) => b.status === "confirmed").length,
    cancelled: allBookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Bookings</h1>
            <p className="text-gray-500 text-sm mt-0.5">{counts.all} total · {counts.pending} pending · {counts.confirmed} confirmed</p>
          </div>
          <Link
            href="/admin/bookings/new"
            className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> New Booking
          </Link>
        </div>

        {/* Quick status tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { label: `All (${counts.all})`, value: "" },
            { label: `Pending (${counts.pending})`, value: "pending" },
            { label: `Confirmed (${counts.confirmed})`, value: "confirmed" },
            { label: `Cancelled (${counts.cancelled})`, value: "cancelled" },
          ].map(({ label, value }) => (
            <Link
              key={value}
              href={`/admin/bookings${value ? `?status=${value}` : ""}`}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                statusFilter === value
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Filters */}
        <form className="bg-white rounded-2xl border shadow-sm p-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search guest name, email or booking ref…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
          <select
            name="villaId"
            defaultValue={villaFilter}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
          >
            <option value="">All villas</option>
            {villas.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
          {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
          <button type="submit" className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
            Filter
          </button>
          {(q || villaFilter || statusFilter) && (
            <Link href="/admin/bookings" className="text-sm text-gray-400 hover:text-gray-700">Clear</Link>
          )}
        </form>

        {/* Table */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-6 py-3">Ref</th>
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
                      <Link href={`/admin/bookings/${b.id}`} className="block font-mono text-xs text-gray-500">
                        #{b.id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/bookings/${b.id}`} className="block">
                        <div className="font-semibold text-gray-900 group-hover:text-sky-700">{b.guestName}</div>
                        <div className="text-gray-400 text-xs">{b.guestEmail}</div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <Link href={`/admin/bookings/${b.id}`} className="block">{b.villa.name}</Link>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <Link href={`/admin/bookings/${b.id}`} className="block">
                        <div>{format(b.checkIn, "d MMM yy")}</div>
                        <div className="text-gray-400 text-xs">→ {format(b.checkOut, "d MMM yy")} · {b.nights}n</div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      <Link href={`/admin/bookings/${b.id}`} className="block">€{b.totalPrice.toFixed(0)}</Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/bookings/${b.id}`} className="block">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColour[b.status] ?? "bg-gray-100 text-gray-600"}`}>
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
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      No bookings match your filters.
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
