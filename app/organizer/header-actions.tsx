"use client";

import Link from "next/link";

import { useAuth } from "@/lib/auth";
import { OrganizerIcon } from "./icons";
import { OrganizerNotifications } from "./notifications";

export function OrganizerHeaderActions() {
  const { user, loading } = useAuth();
  const companyName = user?.organizer_profile?.company_name || user?.name || "Organizer";
  const verified =
    user?.is_verified ||
    user?.organizer_profile?.verification_status === "Terverifikasi";

  return (
    <div className="flex items-center gap-3">
      <OrganizerNotifications />

      <Link
        href="/organizer/profile"
        className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#0f1320] px-3 py-2 transition hover:border-purple-500/40"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 text-xs font-bold">
          {loading ? "…" : user?.initials ?? "?"}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block max-w-40 truncate text-sm font-medium">
            {loading ? "Memuat..." : companyName}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-fuchsia-300">
            <OrganizerIcon name="shield" className="h-3 w-3" />
            {verified ? "Verified Organizer" : "Menunggu verifikasi"}
          </span>
        </span>
      </Link>
    </div>
  );
}
