import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format, differenceInDays } from "date-fns";
import {
  ArrowLeft, Users, Mail, Phone, Globe, Calendar,
  FileText, TrendingUp, Star, ExternalLink, ChevronRight
} from "lucide-react";
import AdminGuestEditor from "@/components/AdminGuestEditor";
import AdminGuestEmailComposer from "@/components/AdminGuestEmailComposer";

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

const statusColour: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

interface Props { params: Promise<{ id: string }> }

export default async function GuestDetailPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const { id } = await params;
  const guest = await prisma.guest.findUnique({ where: { id } });
  if (!guest) notFound();

  const bookings = await prisma.booking.findMany({
    where: { guestEmail: guest.email },
    include: { villa: { select: { name: true, slug: true } } },
    orderBy: { checkIn: "desc" },
  });

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "refunded");
  const totalSpend = confirmedBookings.reduce((s, b) => s + b.totalPrice, 0);
  const tags = guest.tags ? JSON.parse(guest.tags) as string[] : [];
  const lastStay = confirmedBookings[0]?.checkIn ?? null;
  const daysUntilNext = bookings.find((b) => b.status === "confirmed" && b.checkIn > new Date())
    ? differenceInDays(bookings.find((b) => b.status === "confirmed" && b.checkIn > new Date())!.checkIn, new Date())
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/guests" className="hover:text-gray-900 flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Guests</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-gray-900">{guest.name}</span>
        {tags.map((t) => (
          <span key={t} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tagClass(t)}`}>{t}</span>
        ))}
        {!guest.marketingOptIn && (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">opted out</span>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: profile + bookings */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact info */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-5">
                <Users className="w-5 h-5 text-sky-500" /> Guest Profile
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Email</p>
                  <a href={`mailto:${guest.email}`} className="text-sky-600 hover:text-sky-700 flex items-center gap-1 font-medium">
                    <Mail className="w-3.5 h-3.5" /> {guest.email}
                  </a>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Phone</p>
                  {guest.phone
                    ? <a href={`tel:${guest.phone}`} className="text-sky-600 hover:text-sky-700 flex items-center gap-1 font-medium"><Phone className="w-3.5 h-3.5" /> {guest.phone}</a>
                    : <p className="text-gray-400">Not provided</p>}
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Nationality</p>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-gray-400" /> {guest.nationality || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {tags.length > 0
                      ? tags.map((t) => <span key={t} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tagClass(t)}`}>{t}</span>)
                      : <span className="text-gray-400">None</span>}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Marketing</p>
                  <p className={`font-semibold text-sm ${guest.marketingOptIn ? "text-green-600" : "text-gray-400"}`}>
                    {guest.marketingOptIn ? "✓ Opted in" : "Opted out"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Guest since</p>
                  <p className="font-medium text-gray-900">{format(guest.createdAt, "d MMM yyyy")}</p>
                </div>
              </div>
            </div>

            {/* Booking history */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-sky-500" /> Booking History
                </h2>
                <span className="text-sm text-gray-400">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</span>
              </div>
              {bookings.length === 0 ? (
                <p className="px-6 py-8 text-center text-gray-400 text-sm">No bookings found for this guest.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide text-left">
                      <th className="px-6 py-3">Villa</th>
                      <th className="px-6 py-3">Dates</th>
                      <th className="px-6 py-3">Guests</th>
                      <th className="px-6 py-3">Total</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3">
                          <Link href={`/admin/bookings/${b.id}`} className="font-medium text-gray-900 hover:text-sky-600 flex items-center gap-1">
                            {b.villa.name} <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                        <td className="px-6 py-3 text-gray-600">
                          <div>{format(b.checkIn, "d MMM yy")}</div>
                          <div className="text-gray-400 text-xs">→ {format(b.checkOut, "d MMM yy")} · {b.nights}n</div>
                        </td>
                        <td className="px-6 py-3 text-gray-600">{b.guests}</td>
                        <td className="px-6 py-3 font-semibold text-gray-900">€{b.totalPrice.toFixed(0)}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColour[b.status] ?? "bg-gray-100 text-gray-600"}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Edit profile */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-5">
                <FileText className="w-5 h-5 text-sky-500" /> Edit Profile & Notes
              </h2>
              <AdminGuestEditor
                guestId={guest.id}
                initialName={guest.name}
                initialPhone={guest.phone ?? ""}
                initialNationality={guest.nationality ?? ""}
                initialTags={tags}
                initialNotes={guest.notes ?? ""}
                initialMarketing={guest.marketingOptIn}
              />
            </div>
          </div>

          {/* Right: stats + email */}
          <div className="space-y-6">
            {/* Quick stats */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide text-gray-500">Overview</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> Total spend</span>
                  <span className="font-bold text-green-600">€{totalSpend.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Confirmed stays</span>
                  <span className="font-bold text-gray-900">{confirmedBookings.length}</span>
                </div>
                {confirmedBookings.length > 1 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 flex items-center gap-1"><Star className="w-3.5 h-3.5" /> Repeat guest</span>
                    <span className="font-bold text-amber-500">Yes</span>
                  </div>
                )}
                {lastStay && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last stay</span>
                    <span className="font-bold text-gray-900">{format(lastStay, "d MMM yyyy")}</span>
                  </div>
                )}
                {daysUntilNext !== null && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Next check-in</span>
                    <span className="font-bold text-sky-600">in {daysUntilNext}d</span>
                  </div>
                )}
              </div>
            </div>

            {/* Email composer */}
            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-sky-500" /> Send Email
              </h2>
              <AdminGuestEmailComposer
                guestId={guest.id}
                guestName={guest.name}
                guestEmail={guest.email}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
