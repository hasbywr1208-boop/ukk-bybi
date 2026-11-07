"use client";

import Link from "next/link";

import { useAuth } from "@/lib/auth";
import { NotificationBell } from "./notifications";

export function HeaderActions() {
  const { user, loading } = useAuth();

  return (
    <div className="flex items-center gap-3">
      <NotificationBell />

      <Link
        href="/dashboard/profile"
        className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#121422] px-3 py-2 transition hover:border-purple-500/40"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 text-xs font-bold">
          {loading ? "…" : user?.initials ?? "?"}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block truncate text-sm font-medium">
            {loading ? "Memuat..." : user?.name ?? "Pengunjung"}
          </span>
          <span className="block truncate text-xs text-slate-500">
            Member sejak {user?.member_since ?? "-"}
          </span>
        </span>
      </Link>
    </div>
  );
}
