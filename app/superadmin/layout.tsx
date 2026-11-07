import type { ReactNode } from "react";

import { AdminMobileSidebar, AdminSidebar } from "./sidebar";

export default function SuperadminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070910] font-sans text-white">
      <AdminSidebar />
      <AdminMobileSidebar />

      <main className="lg:pl-72">
        <div className="pointer-events-none fixed right-0 top-0 -z-10 h-96 w-96 rounded-full bg-indigo-700/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
