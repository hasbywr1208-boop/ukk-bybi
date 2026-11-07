import type { ReactNode } from "react";

import { RoleGuard } from "@/lib/auth";
import { MobileSidebar, Sidebar } from "./sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard roles={["customer"]}>
      <div className="min-h-screen bg-[#090b13] font-sans text-white">
        <Sidebar />
        <MobileSidebar />

        <main className="lg:pl-72">
          <div className="pointer-events-none fixed right-0 top-0 -z-10 h-96 w-96 rounded-full bg-purple-700/10 blur-3xl" />

          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}
