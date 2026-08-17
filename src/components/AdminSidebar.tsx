"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Calendar, Users, Home, RefreshCw,
  LogOut, TreePalm, Plus, ChevronRight
} from "lucide-react";

interface Props {
  userName: string;
}

const nav = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/bookings", icon: Calendar },
  { label: "Guests", href: "/admin/guests", icon: Users },
  { label: "Properties", href: "/admin/properties", icon: Home },
];

export default function AdminSidebar({ userName }: Props) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin/dashboard") return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-60 shrink-0 bg-gray-950 flex flex-col h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="bg-sky-500 rounded-lg p-1.5">
            <TreePalm className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Canary Villas</p>
            <p className="text-gray-500 text-xs mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive(href)
                ? "bg-sky-600 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
            {isActive(href) && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
          </Link>
        ))}

        <div className="pt-4 pb-1">
          <p className="px-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Quick actions</p>
        </div>
        <Link
          href="/admin/bookings/new"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4 shrink-0" />
          New Booking
        </Link>
        <Link
          href="/admin/guests/new"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4 shrink-0" />
          Add Guest
        </Link>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 px-5 py-4">
        <p className="text-gray-400 text-xs mb-0.5">Signed in as</p>
        <p className="text-white text-sm font-semibold truncate mb-3">{userName}</p>
        <button
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "DELETE" });
            window.location.href = "/admin";
          }}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}
