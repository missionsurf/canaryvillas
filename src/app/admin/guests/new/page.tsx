import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { ArrowLeft, ChevronRight } from "lucide-react";
import AdminAddGuestForm from "@/components/AdminAddGuestForm";

export const dynamic = "force-dynamic";

export default async function NewGuestPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/guests" className="hover:text-gray-900 flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Guests</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-gray-900">Add Guest</span>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Add Guest to CRM</h1>
          <AdminAddGuestForm />
        </div>
      </div>
    </div>
  );
}
