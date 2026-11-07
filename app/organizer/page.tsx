"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { api } from "@/lib/api";
import { BarChart } from "../superadmin/charts";
import { OrganizerIcon, type OrganizerIconName } from "./icons";
import { OrganizerPageHeading } from "./page-heading";
import type {
  ChartPoint,
  OrganizerConcert,
  OrganizerOrder,
} from "./organizer-data";
import { Card, Pill, ProgressBar, StatCard, orderStatusStyles } from "./ui";
import { formatCompactRupiah, formatNumber, formatRupiah } from "./utils";

type DashboardResponse = {
  profile: {
    companyName: string;
    picName: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    instagram: string;
    website: string;
    bio: string;
    initials: string;
    verified: boolean;
    verificationStatus: string;
    memberSince: string;
    npwp: string;
    bankName: string;
    bankAccount: string;
    accountName: string;
  };
  stats: {
    totalRevenue: number;
    totalTickets: number;
    activeConcerts: number;
    totalConcerts: number;
    availableBalance: number;
    pendingWithdrawal: number;
    totalWithdrawn: number;
  };
  concerts: OrganizerConcert[];
  orders: OrganizerOrder[];
  revenueByMonth: ChartPoint[];
  ticketsByMonth: ChartPoint[];
};

const emptyStats: DashboardResponse["stats"] = {
  totalRevenue: 0,
  totalTickets: 0,
  activeConcerts: 0,
  totalConcerts: 0,
  availableBalance: 0,
  pendingWithdrawal: 0,
  totalWithdrawn: 0,
};

export default function OrganizerDashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .get<DashboardResponse>("/organizer/dashboard")
      .then((response) => {
        if (active) {
          setData(response);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Gagal memuat dashboard.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const profile = data?.profile;
  const stats = data?.stats ?? emptyStats;
  const concerts = data?.concerts ?? [];
  const orders = data?.orders ?? [];
  const revenueByMonth = data?.revenueByMonth ?? [];

  const activeConcerts = concerts.filter((item) => item.status === "Aktif");
  const pendingOrders = orders.filter((item) => item.status === "Pending");
  const upcoming = activeConcerts[0];

  const quickLinks: Array<{
    href: string;
    label: string;
    description: string;
    icon: OrganizerIconName;
  }> = [
    {
      href: "/organizer/konser",
      label: "Manage Konser",
      description: "Buat & atur jadwal konser",
      icon: "calendar",
    },
    {
      href: "/organizer/check-in",
      label: "Tiket Check-in",
      description: "Scan e-ticket pengunjung",
      icon: "scan",
    },
    {
      href: "/organizer/orders",
      label: "Orders",
      description: `${pendingOrders.length} pesanan menunggu`,
      icon: "fileText",
    },
    {
      href: "/organizer/withdraw",
      label: "Withdraw",
      description: "Tarik saldo pendapatan",
      icon: "landmark",
    },
  ];

  return (
    <div className="space-y-6">
      <OrganizerPageHeading
        eyebrow="Organizer Dashboard"
        title={`Selamat datang, ${profile?.companyName ?? "Organizer"}`}
        description="Pantau penjualan tiket, konser aktif, dan saldo pendapatan Anda hari ini."
        action={
          <Link
            href="/organizer/konser"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
          >
            <OrganizerIcon name="plus" className="h-4 w-4" />
            Buat Konser
          </Link>
        }
      />

      {error ? (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Pendapatan"
          value={loading ? "…" : formatCompactRupiah(stats.totalRevenue)}
          hint="Dari seluruh konser"
          icon={<OrganizerIcon name="wallet" className="h-5 w-5" />}
          tone="purple"
          trend={{ value: "18,4%", positive: true }}
        />
        <StatCard
          label="Tiket Terjual"
          value={loading ? "…" : formatNumber(stats.totalTickets)}
          hint="Akumulasi semua konser"
          icon={<OrganizerIcon name="ticket" className="h-5 w-5" />}
          tone="sky"
          trend={{ value: "12,6%", positive: true }}
        />
        <StatCard
          label="Konser Aktif"
          value={loading ? "…" : String(stats.activeConcerts)}
          hint={`${stats.totalConcerts} total konser`}
          icon={<OrganizerIcon name="music" className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard
          label="Saldo Tersedia"
          value={loading ? "…" : formatCompactRupiah(stats.availableBalance)}
          hint="Siap ditarik kapan saja"
          icon={<OrganizerIcon name="landmark" className="h-5 w-5" />}
          tone="amber"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <Card
          title="Pendapatan 2026"
          description="Pendapatan penjualan tiket per bulan"
          action={
            <div className="text-right">
              <p className="text-lg font-bold">
                {loading ? "…" : formatCompactRupiah(stats.totalRevenue)}
              </p>
              <p className="text-[11px] text-emerald-400">+18,4% dari tahun lalu</p>
            </div>
          }
        >
          <div className="mt-6">
            {loading ? (
              <div className="flex h-[220px] items-center justify-center text-sm text-slate-500">
                Memuat grafik...
              </div>
            ) : (
              <BarChart data={revenueByMonth} formatValue={formatCompactRupiah} />
            )}
          </div>
        </Card>

        <Card title="Saldo & Pencairan" description="Ringkasan dana organizer">
          <div className="mt-4 rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-600/20 to-fuchsia-600/5 p-4">
            <p className="text-[11px] uppercase tracking-wider text-purple-200/70">
              Saldo tersedia
            </p>
            <p className="mt-1 text-2xl font-bold">
              {formatRupiah(stats.availableBalance)}
            </p>
            <Link
              href="/organizer/withdraw"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-purple-900 transition hover:bg-purple-50"
            >
              <OrganizerIcon name="arrowDownLeft" className="h-4 w-4" />
              Tarik Dana
            </Link>
          </div>

          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Sedang diproses</span>
              <span className="font-medium text-amber-300">
                {formatRupiah(stats.pendingWithdrawal)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Total sudah dicairkan</span>
              <span className="font-medium text-slate-200">
                {formatRupiah(stats.totalWithdrawn)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500">Rekening utama</span>
              <span className="font-medium text-slate-200">
                {profile?.bankName
                  ? `${profile.bankName} •••• ${profile.bankAccount.slice(-4)}`
                  : "-"}
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <Card
          title="Pesanan Terbaru"
          description="5 transaksi terakhir"
          action={
            <Link
              href="/organizer/orders"
              className="text-xs font-medium text-fuchsia-300 transition hover:text-fuchsia-200"
            >
              Lihat semua
            </Link>
          }
        >
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[580px] text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-medium">Pembeli</th>
                  <th className="pb-3 font-medium">Tiket</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-xs text-slate-500">
                      Memuat pesanan...
                    </td>
                  </tr>
                ) : null}
                {!loading && orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-xs text-slate-500">
                      Belum ada pesanan.
                    </td>
                  </tr>
                ) : null}
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-white">{order.buyer}</p>
                      <p className="text-[11px] text-slate-500">{order.id}</p>
                    </td>
                    <td className="max-w-40 truncate py-3 pr-4 text-xs text-slate-400">
                      {order.ticketType} · {order.qty}x
                    </td>
                    <td className="py-3 pr-4 text-xs font-medium">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="py-3">
                      <Pill className={orderStatusStyles[order.status]}>{order.status}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title="Konser Mendatang"
          description={`${activeConcerts.length} konser aktif`}
          action={
            <Link
              href="/organizer/konser"
              className="text-xs font-medium text-fuchsia-300 transition hover:text-fuchsia-200"
            >
              Kelola
            </Link>
          }
        >
          <div className="mt-4 flex flex-col gap-3">
            {loading ? (
              <p className="py-6 text-center text-xs text-slate-500">Memuat konser...</p>
            ) : null}
            {!loading && activeConcerts.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-500">
                Belum ada konser aktif.
              </p>
            ) : null}
            {activeConcerts.map((concert) => {
              const percent =
                concert.capacity > 0
                  ? Math.round((concert.ticketsSold / concert.capacity) * 100)
                  : 0;

              return (
                <div key={concert.id} className="flex items-center gap-3">
                  <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={concert.poster}
                      alt={concert.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{concert.title}</p>
                    <p className="truncate text-[11px] text-slate-500">
                      {concert.date} · {concert.city}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <ProgressBar value={percent} className="flex-1" />
                      <span className="text-[10px] text-slate-500">{percent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Progress Check-in"
          description={
            upcoming
              ? `${upcoming.title} · ${upcoming.date}`
              : "Belum ada konser aktif"
          }
          action={<Pill className="bg-emerald-500/10 text-emerald-400">Live</Pill>}
        >
          {upcoming ? (
            <>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <p className="text-lg font-bold">{formatNumber(upcoming.checkIns)}</p>
                  <p className="text-[10px] text-slate-500">Sudah check-in</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <p className="text-lg font-bold">
                    {formatNumber(Math.max(upcoming.ticketsSold - upcoming.checkIns, 0))}
                  </p>
                  <p className="text-[10px] text-slate-500">Belum hadir</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <p className="text-lg font-bold text-emerald-400">
                    {upcoming.ticketsSold > 0
                      ? Math.round((upcoming.checkIns / upcoming.ticketsSold) * 100)
                      : 0}
                    %
                  </p>
                  <p className="text-[10px] text-slate-500">Tingkat kehadiran</p>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar
                  value={
                    upcoming.ticketsSold > 0
                      ? Math.round((upcoming.checkIns / upcoming.ticketsSold) * 100)
                      : 0
                  }
                  color="#34d399"
                  className="h-2"
                />
              </div>
            </>
          ) : (
            <p className="mt-5 py-6 text-center text-xs text-slate-500">
              Progress check-in akan muncul saat konser aktif tersedia.
            </p>
          )}
          <Link
            href="/organizer/check-in"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-fuchsia-300 transition hover:text-fuchsia-200"
          >
            Buka scanner check-in
            <OrganizerIcon name="chevronRight" className="h-3.5 w-3.5" />
          </Link>
        </Card>

        <Card title="Akses Cepat" description="Menu yang sering digunakan">
          <div className="mt-4 grid grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-fuchsia-500/30"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-fuchsia-500/15 text-fuchsia-300">
                  <OrganizerIcon name={link.icon} className="h-4 w-4" />
                </span>
                <p className="mt-2 text-xs font-semibold">{link.label}</p>
                <p className="mt-0.5 text-[10px] text-slate-500">{link.description}</p>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
