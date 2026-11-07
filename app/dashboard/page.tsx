"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode, SVGProps } from "react";

import { formatRupiah } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  eventDateLabel,
  eventPriceLabel,
  eventStartsAt,
  fetchMyTransactions,
  fetchPublishedEvents,
  toPurchase,
  toUserTicket,
  type EventRow,
  type TransactionRow,
  type UserTicketView,
} from "@/lib/customer";
import { Countdown, CountdownBadge } from "./countdown";
import type { StatIconName } from "./dashboard-data";
import { HeaderActions } from "./header-actions";
import { PurchaseHistory } from "./purchase-history";
import { Card, QrBlock } from "./ui";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ name, className, ...props }: IconProps & { name: string }) {
  const paths: Record<string, ReactNode> = {
    badgeCheck: (
      <>
        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    calendarCheck: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
        <path d="m9 16 2 2 4-4" />
      </>
    ),
    calendarDays: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
      </>
    ),
    chevronRight: <path d="m9 18 6-6-6-6" />,
    creditCard: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </>
    ),
    gift: (
      <>
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M12 8v13M5 12v9h14v-9" />
        <path d="M12 8a3 3 0 1 0-3-3c0 2 3 3 3 3Zm0 0a3 3 0 1 1 3-3c0 2-3 3-3 3Z" />
      </>
    ),
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />,
    history: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    mapPin: (
      <>
        <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    qrCode: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3h-3zM20 14h1M20 20h1M14 20h3" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4L7.3 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 2Z" />
      </>
    ),
    shieldCheck: (
      <>
        <path d="M12 3l7 3v5c0 4.2-2.8 7.9-7 10-4.2-2.1-7-5.8-7-10V6l7-3z" />
        <path d="m9.5 12.5 1.5 1.5 3.5-4" />
      </>
    ),
    shoppingBag: (
      <>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" />
        <path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" />
      </>
    ),
    ticket: (
      <>
        <path d="M2 9a3 3 0 0 0 0 6v3h20v-3a3 3 0 0 1 0-6V6H2z" />
        <path d="M13 6v2m0 4v2m0 4v1" />
      </>
    ),
    ticketCheck: (
      <>
        <path d="M2 9a3 3 0 0 0 0 6v3h20v-3a3 3 0 0 1 0-6V6H2z" />
        <path d="m9 14 2 2 4-4" />
      </>
    ),
    wallet: (
      <>
        <path d="M20 12V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-5Z" />
        <path d="M3 8V6a2 2 0 0 1 2-2h12" />
        <path d="M18 13h.01" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}

const BadgeCheck = (props: IconProps) => <Icon name="badgeCheck" {...props} />;
const CalendarCheck = (props: IconProps) => <Icon name="calendarCheck" {...props} />;
const CalendarDays = (props: IconProps) => <Icon name="calendarDays" {...props} />;
const ChevronRight = (props: IconProps) => <Icon name="chevronRight" {...props} />;
const CreditCard = (props: IconProps) => <Icon name="creditCard" {...props} />;
const Download = (props: IconProps) => <Icon name="download" {...props} />;
const Gift = (props: IconProps) => <Icon name="gift" {...props} />;
const Heart = (props: IconProps) => <Icon name="heart" {...props} />;
const History = (props: IconProps) => <Icon name="history" {...props} />;
const MapPin = (props: IconProps) => <Icon name="mapPin" {...props} />;
const QrCode = (props: IconProps) => <Icon name="qrCode" {...props} />;
const Search = (props: IconProps) => <Icon name="search" {...props} />;
const Settings = (props: IconProps) => <Icon name="settings" {...props} />;
const ShieldCheck = (props: IconProps) => <Icon name="shieldCheck" {...props} />;
const ShoppingBag = (props: IconProps) => <Icon name="shoppingBag" {...props} />;
const Sparkles = (props: IconProps) => <Icon name="sparkles" {...props} />;
const TicketCheck = (props: IconProps) => <Icon name="ticketCheck" {...props} />;
const TicketIcon = (props: IconProps) => <Icon name="ticket" {...props} />;
const Wallet = (props: IconProps) => <Icon name="wallet" {...props} />;

const statIcons: Record<StatIconName, typeof TicketIcon> = {
  ticket: TicketIcon,
  calendar: CalendarCheck,
  bag: ShoppingBag,
  wallet: Wallet,
};

const statTones = {
  purple: "bg-purple-600/15 text-purple-300",
  emerald: "bg-emerald-500/15 text-emerald-300",
  amber: "bg-amber-500/15 text-amber-300",
  sky: "bg-sky-500/15 text-sky-300",
} as const;

type Stat = {
  id: string;
  label: string;
  value: string;
  hint: string;
  icon: StatIconName;
  tone: "purple" | "emerald" | "amber" | "sky";
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function daysUntil(date: string) {
  const target = new Date(`${String(date).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(target.getTime())) return Number.POSITIVE_INFINITY;
  return Math.ceil((target.getTime() - Date.now()) / 86_400_000);
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([fetchMyTransactions(), fetchPublishedEvents(4)])
      .then(([rows, eventRows]) => {
        if (!active) return;
        setTransactions(rows ?? []);
        setEvents((eventRows ?? []).slice(0, 4));
        setError(null);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Gagal memuat data dashboard.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const paid = useMemo(
    () => transactions.filter((row) => row.status === "paid"),
    [transactions],
  );
  const purchases = useMemo(() => transactions.map(toPurchase), [transactions]);

  const activeTickets = useMemo(
    () => paid.filter((row) => row.check_in_status !== "checked_in").length,
    [paid],
  );
  const upcomingTickets = useMemo(
    () =>
      paid
        .filter((row) => String(row.event_date).slice(0, 10) >= todayISO())
        .sort((a, b) => String(a.event_date).localeCompare(String(b.event_date))),
    [paid],
  );
  const upcomingSoon = useMemo(
    () =>
      new Set(
        upcomingTickets
          .filter((row) => daysUntil(row.event_date) <= 90)
          .map((row) => row.event_id),
      ).size,
    [upcomingTickets],
  );
  const totalSpent = useMemo(
    () => paid.reduce((total, row) => total + Number(row.total_price ?? 0), 0),
    [paid],
  );

  const stats: Stat[] = [
    {
      id: "active-tickets",
      label: "Tiket Aktif",
      value: String(activeTickets),
      hint: "siap dipakai",
      icon: "ticket",
      tone: "purple",
    },
    {
      id: "upcoming",
      label: "Konser Mendatang",
      value: String(upcomingSoon),
      hint: "dalam 90 hari",
      icon: "calendar",
      tone: "sky",
    },
    {
      id: "orders",
      label: "Total Pembelian",
      value: String(transactions.length),
      hint: "sejak bergabung",
      icon: "bag",
      tone: "amber",
    },
    {
      id: "spending",
      label: "Total Pengeluaran",
      value: loading ? "…" : formatRupiah(totalSpent),
      hint: "transaksi lunas",
      icon: "wallet",
      tone: "emerald",
    },
  ];

  const featured = upcomingTickets[0] ?? paid[0] ?? null;
  const featuredTicket = featured ? toUserTicket(featured) : null;
  const recommended = events
    .map((event) => ({
      id: event.id,
      title: event.title,
      poster: event.poster_url || "/posters/coldplay.svg",
      posterAlt: `Poster ${event.title}`,
      date: eventDateLabel(event),
      startsAt: eventStartsAt(event),
      venue: event.venue,
      city: event.city,
      genre: event.category_name,
      price: eventPriceLabel(event),
    }));

  return (
    <>
      <PageHeader
        name={authLoading ? null : user?.name ?? ""}
        memberTier={user?.member_tier ?? "Silver Member"}
      />
      {error ? (
        <p className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}
      <StatsStrip stats={stats} />
      <QuickAccess />
      <UpcomingTicketCard ticket={featuredTicket} loading={loading} />
      <RecommendedConcertsCard concerts={recommended} loading={loading} />
      <PurchaseHistory purchases={purchases} limit={5} />
      <PromoBanner />
      <DashboardFooter />
    </>
  );
}

function PageHeader({ name, memberTier }: { name: string | null; memberTier: string }) {
  const firstName = name ? name.trim().split(/\s+/)[0] : "";

  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-600/10 px-3 py-1 text-xs font-medium text-purple-300">
          <BadgeCheck className="h-3.5 w-3.5" />
          {memberTier}
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          {name === null ? "Memuat..." : `Halo ${firstName || "Sobat Konser"} ✨`}
        </h1>
        <p className="mt-1.5 text-sm text-slate-400">
          Semoga harimu menyenangkan
        </p>
      </div>

      <div className="flex items-center gap-3">
        <form action="/" className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            name="keyword"
            placeholder="Cari konser..."
            aria-label="Cari konser"
            className="w-56 rounded-lg border border-white/5 bg-[#121422] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none"
          />
        </form>

        <HeaderActions />
      </div>
    </header>
  );
}

function StatsStrip({ stats }: { stats: Stat[] }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((stat) => {
        const StatIcon = statIcons[stat.icon];

        return (
          <div
            key={stat.id}
            className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#121422] p-4 transition hover:border-purple-500/30"
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                statTones[stat.tone]
              }`}
            >
              <StatIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-slate-400">{stat.label}</p>
              <p className="mt-0.5 truncate text-lg font-bold">{stat.value}</p>
              <p className="truncate text-[11px] text-slate-500">{stat.hint}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const quickLinks = [
  {
    href: "/dashboard/tiket-saya",
    label: "Tiket Saya",
    description: "Lihat e-ticket aktif",
    icon: TicketIcon,
    tone: "bg-purple-600/15 text-purple-300",
  },
  {
    href: "/dashboard/wishlist",
    label: "Wishlist",
    description: "Konser yang kamu simpan",
    icon: Heart,
    tone: "bg-pink-500/15 text-pink-300",
  },
  {
    href: "/dashboard/riwayat-pembelian",
    label: "Riwayat Pembelian",
    description: "Pantau semua transaksi",
    icon: History,
    tone: "bg-amber-500/15 text-amber-300",
  },
  {
    href: "/dashboard/pengaturan",
    label: "Pengaturan",
    description: "Akun & preferensi",
    icon: Settings,
    tone: "bg-sky-500/15 text-sky-300",
  },
];

function QuickAccess() {
  return (
    <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {quickLinks.map((link) => {
        const LinkIcon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-[#121422] p-4 transition hover:border-purple-500/40 hover:bg-[#15182a]"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${link.tone}`}
            >
              <LinkIcon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{link.label}</span>
              <span className="block truncate text-[11px] text-slate-500">
                {link.description}
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-purple-400" />
          </Link>
        );
      })}
    </section>
  );
}

function UpcomingTicketCard({
  ticket,
  loading,
}: {
  ticket: UserTicketView | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <Card
        title="Tiket Mendatang"
        icon={<TicketCheck className="h-5 w-5" />}
        className="mt-5"
      >
        <div className="mt-4 rounded-xl border border-white/5 bg-[#0f1122] px-6 py-14 text-center text-sm text-slate-500">
          Memuat tiket...
        </div>
      </Card>
    );
  }

  if (!ticket) {
    return (
      <Card
        title="Tiket Mendatang"
        icon={<TicketCheck className="h-5 w-5" />}
        className="mt-5"
      >
        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-white/5 bg-[#0f1122] px-6 py-12 text-center">
          <TicketIcon className="h-10 w-10 text-slate-600" />
          <p className="text-sm font-medium text-slate-300">Belum ada tiket aktif</p>
          <p className="max-w-sm text-xs text-slate-500">
            Jelajahi konser favoritmu dan pesan tiket pertamamu sekarang.
          </p>
          <Link
            href="/"
            className="mt-1 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
          >
            Cari Konser
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </Card>
    );
  }

  const isCheckedIn = ticket.status === "Terpakai";
  const steps = [
    { id: "order", label: "Pesanan dibuat", done: true },
    { id: "payment", label: "Pembayaran berhasil", done: true },
    { id: "checkin", label: "Scan tiket di gate", done: isCheckedIn },
  ];

  return (
    <Card
      title="Tiket Mendatang"
      icon={<TicketCheck className="h-5 w-5" />}
      action={<CountdownBadge target={ticket.startsAt} />}
      className="mt-5"
    >
      <div className="mt-4 grid grid-cols-1 gap-5 rounded-xl border border-white/5 bg-[#0f1122] p-4 sm:p-5 xl:grid-cols-[1fr_auto]">
        <div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-44">
              <Image
                src={ticket.poster}
                alt={ticket.posterAlt}
                fill
                sizes="(min-width: 640px) 176px, 100vw"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium tracking-wider text-slate-500">
                {ticket.orderId}
              </p>
              <h3 className="mt-1 truncate text-lg font-semibold">{ticket.title}</h3>
              <p className="mt-0.5 truncate text-sm text-slate-400">
                {ticket.tourName}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                <CalendarDays className="h-4 w-4 shrink-0 text-slate-500" />
                {ticket.date}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
                <span className="truncate">
                  {ticket.venue}, {ticket.city}
                </span>
              </p>
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/5 pt-4 sm:grid-cols-4">
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">
                Kategori
              </dt>
              <dd className="mt-0.5 text-sm font-medium">{ticket.category}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">
                Jumlah
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-purple-400">
                {ticket.quantity} Tiket
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">
                Area
              </dt>
              <dd className="mt-0.5 text-sm font-medium">{ticket.seatLabel}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-slate-500">
                Total
              </dt>
              <dd className="mt-0.5 text-sm font-medium">{ticket.totalPrice}</dd>
            </div>
          </dl>

          <div className="mt-4">
            <p className="mb-2 text-[11px] uppercase tracking-wide text-slate-500">
              Status tiket
            </p>
            <ol className="flex flex-wrap gap-2">
              {steps.map((step) => (
                <li
                  key={step.id}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                    step.done
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "border border-white/5 text-slate-500"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      step.done ? "bg-emerald-400" : "bg-slate-600"
                    }`}
                  />
                  {step.label}
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center">
            <Link
              href="/dashboard/tiket-saya"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
            >
              <QrCode className="h-4 w-4" />
              Lihat E-Ticket
            </Link>
            <Link
              href="/dashboard/tiket-saya"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-purple-500 px-4 py-2.5 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/10"
            >
              <Download className="h-4 w-4" />
              Unduh Tiket
            </Link>
            <p className="inline-flex items-center gap-1.5 text-xs text-slate-500 sm:ml-auto">
              <CreditCard className="h-3.5 w-3.5" />
              Dibayar dengan {ticket.paymentMethod}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-white/5 pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
          <div className="w-full max-w-[220px]">
            <p className="mb-2 text-center text-[11px] uppercase tracking-wide text-slate-500">
              Mulai dalam
            </p>
            <Countdown target={ticket.startsAt} />
          </div>

          <div className="hidden h-px w-full bg-white/5 xl:block" />

          {ticket.qrCode ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={ticket.qrCode}
              alt={`QR code e-ticket ${ticket.title}`}
              className="h-40 w-40 rounded-lg bg-white p-2"
            />
          ) : (
            <QrBlock value={ticket.orderId} label={`QR code e-ticket ${ticket.title}`} />
          )}

          <p className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Tiket terverifikasi &amp; resmi
          </p>
        </div>
      </div>
    </Card>
  );
}

type RecommendedConcert = {
  id: string;
  title: string;
  poster: string;
  posterAlt: string;
  date: string;
  startsAt: string;
  venue: string;
  city: string;
  genre: string;
  price: string;
};

function RecommendedConcertsCard({
  concerts,
  loading,
}: {
  concerts: RecommendedConcert[];
  loading: boolean;
}) {
  return (
    <Card
      title="Rekomendasi Konser"
      icon={<Sparkles className="h-5 w-5" />}
      action={
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-purple-400 transition hover:text-purple-300"
        >
          Lihat semua
          <ChevronRight className="h-4 w-4" />
        </Link>
      }
      className="mt-5"
    >
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading ? (
          <p className="col-span-full rounded-xl border border-white/5 bg-[#0f1122] px-4 py-10 text-center text-sm text-slate-500">
            Memuat rekomendasi...
          </p>
        ) : null}
        {!loading && concerts.length === 0 ? (
          <p className="col-span-full rounded-xl border border-white/5 bg-[#0f1122] px-4 py-10 text-center text-sm text-slate-500">
            Belum ada konser yang tersedia.
          </p>
        ) : null}
        {concerts.map((concert) => (
          <article
            key={concert.id}
            className="group flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#0f1122] transition hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-950/30"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src={concert.poster}
                alt={concert.posterAlt}
                fill
                sizes="(min-width: 1024px) 220px, (min-width: 640px) 45vw, 45vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur">
                {concert.genre}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-3">
              <h3 className="text-sm font-semibold leading-snug">{concert.title}</h3>
              <p className="mt-1 text-xs text-slate-400">{concert.date}</p>
              <p className="mt-1 truncate text-[11px] text-slate-500">
                {concert.venue}
                {concert.city ? `, ${concert.city}` : ""}
              </p>
              <p className="mt-2 text-sm font-bold text-purple-400">
                {concert.price}
              </p>
              <Link
                href={`/events/${concert.id}`}
                className="mt-3 w-full rounded-lg border border-purple-500 px-3 py-2 text-center text-xs font-semibold text-purple-300 transition hover:bg-purple-500/10"
              >
                Lihat Detail
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function PromoBanner() {
  return (
    <section className="relative mt-5 overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-900/60 via-purple-800/40 to-[#121422] p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-600">
            <Gift className="h-6 w-6 text-white" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
              Promo untuk Gold Member
            </p>
            <h3 className="mt-1.5 text-xl font-bold">
              Diskon 20% untuk konser berikutnya
            </h3>
            <p className="mt-1 text-sm text-slate-300">
              Gunakan kode <span className="font-semibold text-white">KONSER20</span>{" "}
              saat checkout. Berlaku sampai 31 Oktober 2026.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="shrink-0 rounded-lg bg-purple-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-purple-500"
        >
          Klaim Sekarang
        </Link>
      </div>
    </section>
  );
}

function DashboardFooter() {
  return (
    <footer className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-slate-500 sm:flex-row">
      <p>&copy; 2026 KONSERVIBE. Semua hak dilindungi.</p>
      <div className="flex items-center gap-4">
        <button type="button" className="transition hover:text-white">
          Bantuan
        </button>
        <button type="button" className="transition hover:text-white">
          Syarat &amp; Ketentuan
        </button>
        <button type="button" className="transition hover:text-white">
          Kebijakan Privasi
        </button>
      </div>
    </footer>
  );
}
