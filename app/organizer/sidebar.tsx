"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { OrganizerIcon, type OrganizerIconName } from "./icons";

type NavItem = {
  label: string;
  href: string;
  icon: OrganizerIconName;
  badge?: number;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Ringkasan",
    items: [{ label: "Dashboard", href: "/organizer", icon: "home" }],
  },
  {
    title: "Konser",
    items: [
      { label: "Manage Konser", href: "/organizer/konser", icon: "calendar" },
      { label: "Tiket Management", href: "/organizer/tiket", icon: "ticket" },
      { label: "Seat Layout", href: "/organizer/seat-layout", icon: "grid" },
      { label: "Tiket Check-in", href: "/organizer/check-in", icon: "scan" },
    ],
  },
  {
    title: "Penjualan",
    items: [
      { label: "Orders", href: "/organizer/orders", icon: "fileText", badge: 0 },
      { label: "Promo", href: "/organizer/promo", icon: "tag" },
      { label: "Revenue", href: "/organizer/revenue", icon: "wallet" },
      { label: "Withdraw", href: "/organizer/withdraw", icon: "landmark" },
    ],
  },
  {
    title: "Insight",
    items: [
      { label: "Analytic", href: "/organizer/analytics", icon: "chart" },
      { label: "Profile", href: "/organizer/profile", icon: "user" },
    ],
  },
];

function isActive(pathname: string | null, href: string) {
  if (pathname === null) return false;
  if (href === "/organizer") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    let active = true;
    api
      .get<Array<{ status: string }>>("/organizer/orders")
      .then((rows) => {
        if (!active) return;
        setPendingOrders(
          (rows ?? []).filter((row) => row.status === "Pending").length,
        );
      })
      .catch(() => {
        if (active) setPendingOrders(0);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <nav className="flex flex-col gap-5">
      {navGroups.map((group) => (
        <div key={group.title}>
          <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
            {group.title}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href);
              const badge =
                item.href === "/organizer/orders" ? pendingOrders : item.badge;

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
                  <OrganizerIcon name={item.icon} className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {badge ? (
                    <span
                      className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                        active ? "bg-white/20 text-white" : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/organizer" className="flex min-w-0 items-center gap-2.5 px-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-fuchsia-600">
        <OrganizerIcon name="music" className="h-5 w-5 text-white" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold tracking-[0.15em] text-white">
          KONSERVIBE
        </span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-fuchsia-400">
          Organizer
        </span>
      </span>
    </Link>
  );
}

function BottomLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:border-purple-500/40 hover:text-white"
      >
        <OrganizerIcon name="globe" className="h-4 w-4" />
        Lihat Situs
      </Link>
      <button
        type="button"
        onClick={async () => {
          onNavigate?.();
          await logout();
          router.replace("/login");
        }}
        className="flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
      >
        <OrganizerIcon name="logout" className="h-4 w-4" />
        Logout
      </button>
    </div>
  );
}

export function OrganizerSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/5 bg-[#0a0d18] lg:flex">
      <div className="flex h-20 shrink-0 items-center border-b border-white/5">
        <Brand />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <NavLinks />
      </div>

      <div className="border-t border-white/5 p-4">
        <BottomLinks />
      </div>
    </aside>
  );
}

export function OrganizerMobileSidebar() {
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
          <OrganizerIcon name="menu" className="h-5 w-5" />
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
            <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/5">
              <Brand />
              <button
                type="button"
                onClick={close}
                aria-label="Tutup menu navigasi"
                className="mr-4 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <OrganizerIcon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
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
