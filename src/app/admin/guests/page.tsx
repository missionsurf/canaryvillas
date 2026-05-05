import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Users, Search, Mail, Star, Plus, TrendingUp } from "lucide-react";
import AdminGuestSyncButton from "@/components/AdminGuestSyncButton";

export const dynamic = "force-dynamic";

const TAG_COLOURS: Record<string, string> = {
  VIP: "bg-amber-100 text-amber-700",
  repeat: "bg-purple-100 text-purple-700",
  "new": "bg-blue-100 text-blue-700",
  corporate: "bg-gray-100 text-gray-700",
  family: "bg-green-100 text-green-700",
};

function tagClass(tag: string) {
  return TAG_COLOURS[tag] ?? "bg-sky-100 text-sky-700";
}

interface SearchParams { q?: string; tag?: string; marketing?: string }

export default async function GuestsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const sp = await searchParams;
  const q = sp.q ?? "";
  const tag = sp.tag ?? "";
  const marketing = sp.marketing ?? "";

  // Fetch guests with booking stats
  const guests = await prisma.guest.findMany({
    where: {
      ...(q ? {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
          { nationality: { contains: q } },
        ],
      } : {}),
      ...(marketing === "true" ? { marketingOptIn: true } : {}),
      ...(marketing === "false" ? { marketingOptIn: false } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const bookings = await prisma.booking.findMany({
    where: { guestEmail: { in: guests.map((g) => g.email) } },
    select: { guestEmail: true, totalPrice: true, status: true, checkIn: true },
  });

  const statsMap = new Map<string, { bookingCount: number; totalSpend: number; lastStay: Date | null }>();
  for (const b of bookings) {
    const s = statsMap.get(b.guestEmail) ?? { bookingCount: 0, totalSpend: 0, lastStay: null };
    if (b.status === "confirmed" || b.status === "refunded") {
      s.bookingCount++;
      s.totalSpend += b.totalPrice;
      if (!s.lastStay || b.checkIn > s.lastStay) s.lastStay = b.checkIn;
    }
    statsMap.set(b.guestEmail, s);
  }

  const enriched = guests
    .map((g) => ({
      ...g,
      tags: g.tags ? (JSON.parse(g.tags) as string[]) : [] as string[],
      ...(statsMap.get(g.email) ?? { bookingCount: 0, totalSpend: 0, lastStay: null }),
    }))
    .filter((g) => !tag || g.tags.includes(tag));

  const totalGuests = enriched.length;
  const marketingCount = enriched.filter((g) => g.marketingOptIn).length;
  const repeatCount = enriched.filter((g) => g.bookingCount > 1).length;
  const totalRevenue = enriched.reduce((s, g) => s + g.totalSpend, 0);

  const allTags = Array.from(new Set(enriched.flatMap((g) => g.tags))).sort();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-sky-500" /> Guest CRM
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">{totalGuests} guests · {marketingCount} opted in to marketing</p>
          </div>
          <div className="flex items-center gap-3">
            <AdminGuestSyncButton />
            <Link
              href="/admin/guests/new"
              className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Guest
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Guests", value: totalGuests, icon: Users, colour: "text-sky-600" },
            { label: "Marketing Opted In", value: marketingCount, icon: Mail, colour: "text-green-600" },
            { label: "Repeat Guests", value: repeatCount, icon: Star, colour: "text-amber-500" },
            { label: "Total Revenue", value: `€${totalRevenue.toFixed(0)}`, icon: TrendingUp, colour: "text-purple-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className={`w-4 h-4 ${s.colour}`} />
                <span className="text-xs text-gray-500">{s.label}</span>
              </div>
              <div className={`text-2xl font-extrabold ${s.colour}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border shadow-sm p-4">
          <form className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Search by name, email, nationality…"
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              />
            </div>
            <select
              name="tag"
              defaultValue={tag}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value="">All tags</option>
              {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              name="marketing"
              defaultValue={marketing}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value="">All guests</option>
              <option value="true">Marketing opted in</option>
              <option value="false">Opted out</option>
            </select>
            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              Filter
            </button>
            {(q || tag || marketing) && (
              <Link href="/admin/guests" className="text-sm text-gray-400 hover:text-gray-700">Clear</Link>
            )}
          </form>
        </div>

        {/* Guest table */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-gray-900">
              {enriched.length} guest{enriched.length !== 1 ? "s" : ""}
              {(q || tag || marketing) && <span className="text-gray-400 font-normal text-sm ml-2">(filtered)</span>}
            </h2>
            {marketingCount > 0 && (
              <span className="text-xs text-gray-400">{marketingCount} eligible for bulk emails</span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-6 py-3">Guest</th>
                  <th className="px-6 py-3">Tags</th>
                  <th className="px-6 py-3">Bookings</th>
                  <th className="px-6 py-3">Total Spend</th>
                  <th className="px-6 py-3">Last Stay</th>
                  <th className="px-6 py-3">Marketing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enriched.map((g) => (
                  <tr key={g.id} className="hover:bg-sky-50 cursor-pointer group">
                    <td className="px-6 py-4">
                      <Link href={`/admin/guests/${g.id}`} className="block">
                        <div className="font-semibold text-gray-900 group-hover:text-sky-700">{g.name}</div>
                        <div className="text-gray-400 text-xs">{g.email}</div>
                        {g.nationality && <div className="text-gray-400 text-xs">{g.nationality}</div>}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/guests/${g.id}`} className="flex flex-wrap gap-1">
                        {g.tags.map((t) => (
                          <span key={t} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tagClass(t)}`}>{t}</span>
                        ))}
                        {g.tags.length === 0 && <span className="text-gray-300 text-xs">—</span>}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/guests/${g.id}`} className="block font-semibold text-gray-900">
                        {g.bookingCount}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/guests/${g.id}`} className="block font-semibold text-green-600">
                        {g.totalSpend > 0 ? `€${g.totalSpend.toFixed(0)}` : "—"}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <Link href={`/admin/guests/${g.id}`} className="block">
                        {g.lastStay ? format(g.lastStay, "d MMM yyyy") : "—"}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/guests/${g.id}`} className="block">
                        {g.marketingOptIn
                          ? <span className="text-green-600 font-semibold text-xs">✓ Yes</span>
                          : <span className="text-gray-400 text-xs">No</span>}
                      </Link>
                    </td>
                  </tr>
                ))}
                {enriched.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      {q || tag || marketing ? "No guests match your filters." : "No guests yet. Use Sync to import from bookings."}
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
