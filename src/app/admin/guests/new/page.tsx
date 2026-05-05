import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import AdminAddGuestForm from "@/components/AdminAddGuestForm";

export const dynamic = "force-dynamic";

export default async function NewGuestPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Link href="/admin/guests" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm">
            <ArrowLeft className="w-4 h-4" /> Guests
          </Link>
          <div className="h-5 border-l border-gray-200" />
          <span className="font-bold text-gray-900">Add Guest</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <AdminAddGuestForm />
        </div>
      </div>
    </div>
  );
}
