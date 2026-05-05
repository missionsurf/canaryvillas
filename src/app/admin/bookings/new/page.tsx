import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft, ChevronRight } from "lucide-react";
import AdminCreateBookingForm from "@/components/AdminCreateBookingForm";

export const dynamic = "force-dynamic";

export default async function NewBookingPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const villas = await prisma.villa.findMany({
    select: { id: true, name: true, pricePerNight: true, cleaningFee: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/bookings" className="hover:text-gray-900 flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Bookings</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-gray-900">New Booking</span>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Create Manual Booking</h1>
          <AdminCreateBookingForm villas={villas} />
        </div>
      </div>
    </div>
  );
}
