"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AdminIcon, type AdminIconName } from "./icons";
import { adminConcerts, adminPayments, organizers } from "./superadmin-data";

type NavItem = {
  label: string;
  href: string;
  icon: AdminIconName;
  badge?: number;
};

const pendingOrganizers = organizers.filter((item) => item.status === "Menunggu").length;
const pendingConcerts = adminConcerts.filter((item) => item.status === "Menunggu").length;
const pendingPayments = adminPayments.filter((item) => item.status === "Menunggu").length;

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/superadmin", icon: "home" },
  { label: "Manage User", href: "/superadmin/users", icon: "users" },
  { label: "Verifikasi Organizer", href: "/superadmin/organizers", icon: "shield", badge: pendingOrganizers },
  { label: "Monitor Konser", href: "/superadmin/konser", icon: "calendar", badge: pendingConcerts },
  { label: "Manage Payment", href: "/superadmin/payments", icon: "creditCard", badge: pendingPayments },
  { label: "Laporan Pendapatan", href: "/superadmin/reports", icon: "fileText" },
  { label: "Analytic", href: "/superadmin/analytics", icon: "chart" },
  { label: "Sistem Settings", href: "/superadmin/settings", icon: "settings" },
];

function isActive(pathname: string | null, href: string) {
  if (pathname === null) return false;
  if (href === "/superadmin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-purple-700 text-white shadow-lg shadow-purple-950/50"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <AdminIcon name={item.icon} className="h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {item.badge ? (
              <span
                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                  active ? "bg-white/20 text-white" : "bg-amber-500/15 text-amber-300"
                }`}
              >
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/superadmin" className="flex min-w-0 items-center gap-2.5 px-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600">
        <AdminIcon name="music" className="h-5 w-5 text-white" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold tracking-[0.15em] text-white">
          KONSERVIBE
        </span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-400">
          Superadmin
        </span>
      </span>
    </Link>
  );
}

function BottomLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-2">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:border-purple-500/40 hover:text-white"
      >
        <AdminIcon name="globe" className="h-4 w-4" />
        Lihat Situs
      </Link>
      <Link
        href="/login"
        onClick={onNavigate}
        className="flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
      >
        <AdminIcon name="logout" className="h-4 w-4" />
        Logout
      </Link>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/5 bg-[#0a0d18] lg:flex">
      <div className="flex h-20 items-center border-b border-white/5">
        <Brand />
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto p-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          Manajemen Platform
        </p>
        <NavLinks />
      </div>

      <div className="border-t border-white/5 p-4">
        <BottomLinks />
      </div>
    </aside>
  );
}

export function AdminMobileSidebar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/5 bg-[#0a0d18]/90 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buka menu navigasi"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          <AdminIcon name="menu" className="h-5 w-5" />
        </button>
        <Brand />
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu navigasi"
            onClick={close}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <aside className="relative flex h-full w-72 max-w-[80vw] flex-col border-r border-white/5 bg-[#0a0d18]">
            <div className="flex h-20 items-center justify-between border-b border-white/5">
              <Brand />
              <button
                type="button"
                onClick={close}
                aria-label="Tutup menu navigasi"
                className="mr-4 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <AdminIcon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
              <NavLinks onNavigate={close} />
            </div>

            <div className="border-t border-white/5 p-4">
              <BottomLinks onNavigate={close} />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
