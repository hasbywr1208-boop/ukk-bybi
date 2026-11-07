"use client";

import { useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";
import { BarChart, DonutChart, HorizontalBreakdown } from "../../superadmin/charts";
import { OrganizerIcon } from "../icons";
import { OrganizerPageHeading } from "../page-heading";
import type { ChartPoint, OrganizerConcert, ShareItem } from "../organizer-data";
import { Card, Pill, ProgressBar, StatCard } from "../ui";
import { formatCompactRupiah, formatNumber, formatRupiah } from "../utils";

type AnalyticsResponse = {
  revenueByMonth: ChartPoint[];
  ticketsByMonth: ChartPoint[];
  salesByConcert: ShareItem[];
  audienceCities: ShareItem[];
  hourlyCheckIns: ChartPoint[];
  trafficSources: ShareItem[];
  summary: {
    totalRevenue: number;
    totalTickets: number;
    totalConcerts: number;
    activeConcerts: number;
  };
};

export default function OrganizerAnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [concerts, setConcerts] = useState<OrganizerConcert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      api.get<AnalyticsResponse>("/organizer/analytics"),
      api.get<OrganizerConcert[]>("/organizer/concerts"),
    ])
      .then(([analytics, concertRows]) => {
        if (!active) return;
        setData(analytics);
        setConcerts(concertRows ?? []);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Gagal memuat data analitik.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const soldConcerts = useMemo(
    () => concerts.filter((concert) => concert.ticketsSold > 0),
    [concerts],
  );

  if (loading) {
    return (
      <Card>
        <p className="py-10 text-center text-xs text-slate-500">Memuat data analitik...</p>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
          {error ?? "Data analitik tidak tersedia."}
        </p>
      </Card>
    );
  }

  const { summary, ticketsByMonth, salesByConcert, audienceCities, hourlyCheckIns, trafficSources } =
    data;
  const totalRevenue = summary.totalRevenue;
  const totalTickets = summary.totalTickets;
  const totalCheckIns = soldConcerts.reduce((sum, concert) => sum + concert.checkIns, 0);
  const averagePrice = totalTickets > 0 ? Math.round(totalRevenue / totalTickets) : 0;
  const checkInRate = totalTickets > 0 ? Math.round((totalCheckIns / totalTickets) * 100) : 0;
  const topConcert = soldConcerts.reduce<OrganizerConcert | null>(
    (top, concert) => (top === null || concert.revenue > top.revenue ? concert : top),
    null,
  );
  const topSource = trafficSources.reduce<ShareItem | null>(
    (top, item) => (top === null || item.value > top.value ? item : top),
    null,
  );
  const topCity = audienceCities.reduce<ShareItem | null>(
    (top, item) => (top === null || item.value > top.value ? item : top),
    null,
  );
  const peakHour = hourlyCheckIns.reduce<ChartPoint | null>(
    (top, point) => (top === null || point.value > top.value ? point : top),
    null,
  );

  return (
    <div className="space-y-6">
      <OrganizerPageHeading
        eyebrow="Analytics"
        title="Analitik Penjualan"
        description="Pahami perilaku penonton, sumber trafik, dan performa tiket setiap konser."
        action={
          <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-[11px] text-slate-400">
            <OrganizerIcon name="calendar" className="h-3.5 w-3.5" />
            Jan – Des {new Date().getFullYear()}
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Tiket Terjual"
          value={formatNumber(totalTickets)}
          hint="Akumulasi semua konser"
          icon={<OrganizerIcon name="ticket" className="h-5 w-5" />}
          tone="purple"
        />
        <StatCard
          label="Rata-rata Harga Tiket"
          value={formatCompactRupiah(averagePrice)}
          hint="Per tiket terjual"
          icon={<OrganizerIcon name="tag" className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard
          label="Tingkat Check-in"
          value={`${checkInRate}%`}
          hint={`${formatNumber(totalCheckIns)} tiket dipindai`}
          icon={<OrganizerIcon name="scan" className="h-5 w-5" />}
          tone="sky"
        />
        <StatCard
          label="Konser Aktif"
          value={`${summary.activeConcerts}/${summary.totalConcerts}`}
          hint="Konser aktif dari total konser"
          icon={<OrganizerIcon name="trendUp" className="h-5 w-5" />}
          tone="amber"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card
          title="Tren Tiket Terjual"
          description="Perbandingan volume tiket per bulan"
          action={
            <Pill className="bg-emerald-500/10 text-emerald-400">
              {formatNumber(totalTickets)} tiket
            </Pill>
          }
        >
          <div className="mt-6">
            <BarChart data={ticketsByMonth} color="#a855f7" formatValue={formatNumber} height="h-56" />
          </div>
        </Card>

        <Card title="Sumber Trafik" description="Asal kunjungan halaman konser">
          <div className="mt-5">
            <DonutChart
              items={trafficSources}
              centerLabel={topSource?.label ?? "-"}
              centerValue={topSource ? `${topSource.value}%` : "0%"}
            />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Asal Kota Penonton" description="Distribusi pembeli berdasarkan kota">
          <div className="mt-5">
            <HorizontalBreakdown items={audienceCities} />
          </div>
        </Card>

        <Card
          title="Jam Check-in Tersibuk"
          description="Volume pemindaian tiket di venue"
          action={
            <span className="text-[11px] text-slate-500">
              Puncak {peakHour?.label ?? "-"} · {formatNumber(peakHour?.value ?? 0)} tiket
            </span>
          }
        >
          <div className="mt-6">
            <BarChart data={hourlyCheckIns} color="#22d3ee" formatValue={formatNumber} height="h-44" />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card
          title="Performa per Konser"
          description="Okupansi, penjualan, dan tingkat kehadiran"
        >
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-medium">Konser</th>
                  <th className="pb-3 font-medium">Okupansi</th>
                  <th className="pb-3 font-medium">Check-in</th>
                  <th className="pb-3 font-medium">Pendapatan</th>
                  <th className="pb-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {soldConcerts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-slate-500">
                      Belum ada konser dengan penjualan tiket.
                    </td>
                  </tr>
                ) : null}
                {soldConcerts.map((concert) => {
                  const occupancy =
                    concert.capacity > 0
                      ? Math.round((concert.ticketsSold / concert.capacity) * 100)
                      : 0;
                  const attendance =
                    concert.ticketsSold > 0
                      ? Math.round((concert.checkIns / concert.ticketsSold) * 100)
                      : 0;

                  return (
                    <tr key={concert.id} className="transition hover:bg-white/[0.02]">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-white">{concert.title}</p>
                        <p className="text-[11px] text-slate-500">{concert.city}</p>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="w-32">
                          <div className="mb-1 text-[10px] text-slate-400">
                            {occupancy}% · {formatNumber(concert.ticketsSold)}
                          </div>
                          <ProgressBar value={occupancy} />
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`text-xs font-medium ${
                            attendance >= 90
                              ? "text-emerald-400"
                              : attendance >= 75
                                ? "text-amber-400"
                                : "text-slate-400"
                          }`}
                        >
                          {attendance}%
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-xs font-semibold text-white">
                        {formatCompactRupiah(concert.revenue)}
                      </td>
                      <td className="py-3 text-right">
                        <Pill
                          className={
                            concert.status === "Aktif"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-sky-500/10 text-sky-300"
                          }
                        >
                          {concert.status}
                        </Pill>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Porsi Pendapatan" description="Kontribusi tiap konser">
            <div className="mt-4">
              <DonutChart
                items={salesByConcert}
                centerLabel={salesByConcert[0]?.label ?? "-"}
                centerValue={salesByConcert[0] ? `${salesByConcert[0].value}%` : "0%"}
              />
            </div>
          </Card>

          <Card title="Insight Cepat">
            <ul className="mt-4 space-y-3 text-xs">
              <li className="flex gap-3 rounded-xl border border-purple-500/15 bg-purple-500/5 p-3">
                <OrganizerIcon name="trendUp" className="mt-0.5 h-4 w-4 shrink-0 text-purple-300" />
                <span className="text-slate-300">
                  <strong className="text-white">{topConcert?.title ?? "-"}</strong> menyumbang{" "}
                  {topConcert && totalRevenue > 0
                    ? Math.round((topConcert.revenue / totalRevenue) * 100)
                    : 0}
                  % dari total pendapatan.
                </span>
              </li>
              <li className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <OrganizerIcon name="users" className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                <span className="text-slate-300">
                  Penonton dari <strong className="text-white">{topCity?.label ?? "-"}</strong>{" "}
                  mendominasi dengan {topCity?.value ?? 0}% pembelian tiket.
                </span>
              </li>
              <li className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <OrganizerIcon name="wallet" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                <span className="text-slate-300">
                  Rata-rata transaksi bernilai{" "}
                  <strong className="text-white">{formatRupiah(averagePrice)}</strong> per tiket.
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
