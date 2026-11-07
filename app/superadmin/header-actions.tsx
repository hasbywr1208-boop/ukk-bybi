import Link from "next/link";

import { AdminIcon } from "./icons";
import { AdminNotifications } from "./notifications";
import { adminProfile } from "./superadmin-data";

export function AdminHeaderActions() {
  return (
    <div className="flex items-center gap-3">
      <AdminNotifications />

      <Link
        href="/superadmin/settings"
        className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#0f1320] px-3 py-2 transition hover:border-purple-500/40"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-xs font-bold">
          {adminProfile.initials}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block truncate text-sm font-medium">{adminProfile.name}</span>
          <span className="flex items-center gap-1 text-[11px] text-purple-300">
            <AdminIcon name="shield" className="h-3 w-3" />
            {adminProfile.role}
          </span>
        </span>
      </Link>
    </div>
  );
}
