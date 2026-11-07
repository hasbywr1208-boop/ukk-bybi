import type { ReactNode } from "react";

import { RoleGuard } from "@/lib/auth";
import { OrganizerMobileSidebar, OrganizerSidebar } from "./sidebar";

export default function OrganizerLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={["event_organizer"]}>
      <div className="min-h-screen bg-[#070910] font-sans text-white">
        <OrganizerSidebar />
        <OrganizerMobileSidebar />

        <main className="lg:pl-72">
          <div className="pointer-events-none fixed right-0 top-0 -z-10 h-96 w-96 rounded-full bg-fuchsia-700/10 blur-3xl" />

          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}
