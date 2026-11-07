"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/lib/auth";

type IconProps = { className?: string };

function Icon({ name, className }: IconProps & { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    Heart: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" /></>,
    History: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 2" /></>,
    Home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-6h6v6" /></>,
    LogOut: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></>,
    Menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    Mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" /></>,
    Music: <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>,
    Settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4L7.3 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 2Z" /></>,
    Ticket: <><path d="M2 9a3 3 0 0 0 0 6v4h20v-4a3 3 0 0 1 0-6V5H2z" /><path d="M13 5v2m0 4v2m0 4v2" /></>,
    User: <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
    X: <><path d="m18 6-12 12M6 6l12 12" /></>,
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{paths[name]}</svg>;
}

const Heart = (props: IconProps) => <Icon name="Heart" {...props} />;
const History = (props: IconProps) => <Icon name="History" {...props} />;
const Home = (props: IconProps) => <Icon name="Home" {...props} />;
const LogOut = (props: IconProps) => <Icon name="LogOut" {...props} />;
const Menu = (props: IconProps) => <Icon name="Menu" {...props} />;
const Mic = (props: IconProps) => <Icon name="Mic" {...props} />;
const Music = (props: IconProps) => <Icon name="Music" {...props} />;
const Settings = (props: IconProps) => <Icon name="Settings" {...props} />;
const Ticket = (props: IconProps) => <Icon name="Ticket" {...props} />;
const User = (props: IconProps) => <Icon name="User" {...props} />;
const X = (props: IconProps) => <Icon name="X" {...props} />;

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Tiket Saya", href: "/dashboard/tiket-saya", icon: Ticket },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { label: "Riwayat Pembelian", href: "/dashboard/riwayat-pembelian", icon: History },
  { label: "Profil", href: "/dashboard/profile", icon: User },
  { label: "Pengaturan", href: "/dashboard/pengaturan", icon: Settings },
];

function isActive(pathname: string | null, href: string) {
  return pathname !== null && (pathname === href || pathname.startsWith(`${href}/`));
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-purple-800 text-white shadow-lg shadow-purple-950/50"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function ExploreLink({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      className="flex items-center justify-center gap-2 rounded-lg border border-purple-500/40 px-3 py-2.5 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/10"
    >
      <Mic className="h-4 w-4" />
      Jelajahi Konser
    </Link>
  );
}

function LogoutButton({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        onNavigate?.();
        await logout();
        router.replace("/login");
      }}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
    >
      <LogOut className="h-4 w-4 shrink-0" />
      Logout
    </button>
  );
}

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5 px-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-600">
        <Music className="h-5 w-5 text-white" />
      </span>
      <span className="text-base font-bold tracking-[0.2em] text-white">KONSERVIBE</span>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/5 bg-[#0c0e1a] lg:flex">
      <div className="flex h-20 items-center border-b border-white/5">
        <Brand />
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        <NavLinks />
      </div>

      <div className="flex flex-col gap-2 border-t border-white/5 p-4">
        <ExploreLink />
        <LogoutButton />
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/5 bg-[#0c0e1a]/90 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buka menu navigasi"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Brand />
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu navigasi"
            onClick={close}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <aside className="relative flex h-full w-72 max-w-[80vw] flex-col border-r border-white/5 bg-[#0c0e1a]">
            <div className="flex h-20 items-center justify-between border-b border-white/5">
              <Brand />
              <button
                type="button"
                onClick={close}
                aria-label="Tutup menu navigasi"
                className="mr-4 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
              <NavLinks onNavigate={close} />
            </div>

            <div className="flex flex-col gap-2 border-t border-white/5 p-4">
              <ExploreLink onNavigate={close} />
              <LogoutButton onNavigate={close} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}