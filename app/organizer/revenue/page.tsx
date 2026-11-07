"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";
import { BarChart, DonutChart } from "../../superadmin/charts";
import { OrganizerIcon } from "../icons";
import { OrganizerPageHeading } from "../page-heading";
import type { ChartPoint, OrganizerConcert, ShareItem } from "../organizer-data";
import { Card, Pill, ProgressBar, StatCard } from "../ui";
import { formatCompactRupiah, formatNumber, formatRupiah } from "../utils";
import { RevenueExportButton } from "./export-button";

type RevenueConcert = {
  id: string;
  title: string;
  ticketsSold: number;
  revenue: number;
  net: number;
};

type RevenueBalance = {
  gross: number;
  fee: number;
  net: number;
  feePercent: number;
  totalTickets: number;
  totalWithdrawn: number;
  pendingWithdrawal: number;
  availableBalance: number;
};

type RevenueResponse = {
  summary: {
    totalRevenue: number;
    platformFee: number;
    netRevenue: number;
    availableBalance: number;
    totalTickets: number;
  };
  revenueByMonth: ChartPoint[];
  ticketsByMonth: ChartPoint[];
  salesByConcert: ShareItem[];
  concerts: RevenueConcert[];
  balance: RevenueBalance;
};

type ProfileSummary = {
  bankName: string;
  bankAccount: string;
  accountName: string;
};

export default function OrganizerRevenuePage() {
  const [data, setData] = useState<RevenueResponse | null>(null);
  const [concerts, setConcerts] = useState<OrganizerConcert[]>([]);
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      api.get<RevenueResponse>("/organizer/revenue"),
      api.get<OrganizerConcert[]>("/organizer/concerts"),
      api.get<ProfileSummary>("/organizer/profile"),
    ])
      .then(([revenue, concertRows, profileData]) => {
        if (!active) return;
        setData(revenue);
        setConcerts(concertRows ?? []);
        setProfile(profileData ?? null);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Gagal memuat data pendapatan.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const paidConcerts = useMemo(() => {
    const byId = new Map(concerts.map((item) => [item.id, item]));
    return (data?.concerts ?? [])
      .filter((item) => item.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .map((item) => {
        const detail = byId.get(item.id);
        return {
          ...item,
          venue: detail?.venue ?? "-",
          city: detail?.city ?? "",
          date: detail?.date ?? "-",
          capacity: detail?.capacity ?? 0,
        };
      });
  }, [data, concerts]);

  if (loading) {
    return (
      <Card>
        <p className="py-10 text-center text-xs text-slate-500">Memuat data pendapatan...</p>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
          {error ?? "Data pendapatan tidak tersedia."}
        </p>
      </Card>
    );
  }

  const { summary, balance, revenueByMonth, ticketsByMonth, salesByConcert } = data;
  const totalRevenue = summary.totalRevenue;
  const totalTickets = summary.totalTickets;
  const platformFee = summary.platformFee;
  const netRevenue = summary.netRevenue;
  const availableBalance = summary.availableBalance;
  const topShare = salesByConcert.reduce<ShareItem | null>(
    (top, item) => (top === null || item.value > top.value ? item : top),
    null,
  );
  const bankLabel = profile?.bankName
    ? `${profile.bankName}${profile.bankAccount ? ` •••• ${profile.bankAccount.slice(-4)}` : ""}`
    : "-";

  return (
    <div className="space-y-6">
      <OrganizerPageHeading
        eyebrow="Revenue"
        title="Pendapatan Penjualan"
        description="Lihat pendapatan tiket, komisi platform, dan performa finansial setiap konser."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/organizer/withdraw"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-purple-500/40 hover:text-white"
            >
              <OrganizerIcon name="arrowDownLeft" className="h-4 w-4" />
              Withdraw
            </Link>
            <RevenueExportButton />
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pendapatan Kotor"
          value={formatCompactRupiah(totalRevenue)}
          hint={`${formatNumber(totalTickets)} tiket terjual`}
          icon={<OrganizerIcon name="wallet" className="h-5 w-5" />}
          tone="purple"
        />
        <StatCard
          label="Komisi Platform"
          value={formatCompactRupiah(platformFee)}
          hint={`${balance.feePercent}% dari pendapatan kotor`}
          icon={<OrganizerIcon name="percent" className="h-5 w-5" />}
          tone="amber"
        />
        <StatCard
          label="Pendapatan Bersih"
          value={formatCompactRupiah(netRevenue)}
          hint="Hak organizer"
          icon={<OrganizerIcon name="trendUp" className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard
          label="Saldo Tersedia"
          value={formatCompactRupiah(availableBalance)}
          hint="Siap dicairkan"
          icon={<OrganizerIcon name="landmark" className="h-5 w-5" />}
          tone="sky"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card
          title={`Pendapatan ${new Date().getFullYear()}`}
          description="Pendapatan tiket per bulan"
          action={
            <div className="text-right">
              <p className="text-lg font-bold">{formatCompactRupiah(totalRevenue)}</p>
              <p className="text-[11px] text-slate-500">Akumulasi tahun ini</p>
            </div>
          }
        >
          <div className="mt-6">
            <BarChart data={revenueByMonth} formatValue={formatCompactRupiah} height="h-52" />
          </div>
        </Card>

        <Card title="Kontribusi Konser" description="Porsi pendapatan per konser">
          <div className="mt-5">
            <DonutChart
              items={salesByConcert}
              centerLabel={topShare?.label ?? "-"}
              centerValue={topShare ? `${topShare.value}%` : "0%"}
            />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Volume Tiket"
          description="Tiket terjual per bulan"
          action={<span className="text-[11px] text-slate-500">{formatNumber(totalTickets)} tiket</span>}
        >
          <div className="mt-6">
            <BarChart
              data={ticketsByMonth}
              color="#22d3ee"
              formatValue={formatNumber}
              height="h-44"
            />
          </div>
        </Card>

        <Card title="Ringkasan Pencairan" description="Dana yang sudah dan akan dicairkan">
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
              <p className="text-[10px] uppercase tracking-wider text-purple-200/70">
                Saldo tersedia
              </p>
              <p className="mt-1 text-xl font-bold">{formatRupiah(availableBalance)}</p>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">Sedang diproses</span>
              <span className="font-medium text-amber-300">
                {formatRupiah(balance.pendingWithdrawal)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">Total dicairkan</span>
              <span className="font-medium text-slate-200">
                {formatRupiah(balance.totalWithdrawn)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">Rekening tujuan</span>
              <span className="font-medium text-slate-200">{bankLabel}</span>
            </div>
            <Link
              href="/organizer/withdraw"
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-purple-500"
            >
              <OrganizerIcon name="arrowDownLeft" className="h-4 w-4" />
              Ajukan Withdraw
            </Link>
          </div>
        </Card>
      </div>

      <Card
        title="Pendapatan per Konser"
        description="Rincian penjualan tiket seluruh konser"
        action={<span className="text-[11px] text-slate-500">{paidConcerts.length} konser</span>}
      >
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="pb-3 font-medium">Konser</th>
                <th className="pb-3 font-medium">Jadwal</th>
                <th className="pb-3 font-medium">Tiket</th>
                <th className="pb-3 font-medium">Okupansi</th>
                <th className="pb-3 font-medium">Pendapatan</th>
                <th className="pb-3 text-right font-medium">Porsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paidConcerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                    Belum ada pendapatan tercatat.
                  </td>
                </tr>
              ) : null}
              {paidConcerts.map((concert) => {
                const percent =
                  concert.capacity > 0
                    ? Math.round((concert.ticketsSold / concert.capacity) * 100)
                    : 0;
                const share =
                  totalRevenue > 0 ? Math.round((concert.revenue / totalRevenue) * 100) : 0;

                return (
                  <tr key={concert.id} className="transition hover:bg-white/[0.02]">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-white">{concert.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {concert.venue}
                        {concert.city ? ` · ${concert.city}` : ""}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-400">{concert.date}</td>
                    <td className="py-3 pr-4 text-xs text-slate-400">
                      {formatNumber(concert.ticketsSold)}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="w-36">
                        <div className="mb-1 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">{percent}%</span>
                          <span className="text-slate-600">
                            {formatNumber(concert.capacity)}
                          </span>
                        </div>
                        <ProgressBar value={percent} />
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-xs font-semibold text-emerald-400">
                      {formatCompactRupiah(concert.revenue)}
                    </td>
                    <td className="py-3 text-right">
                      <Pill className="bg-white/5 text-slate-300">{share}%</Pill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
