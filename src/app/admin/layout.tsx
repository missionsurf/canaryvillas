import { getAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  // Login page — no sidebar
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar userName={session.name} />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
