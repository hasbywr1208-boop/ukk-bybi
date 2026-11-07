import { BarChart, DonutChart, HorizontalBreakdown } from "../charts";
import { AdminIcon } from "../icons";
import { AdminPageHeading } from "../page-heading";
import {
  adminConcerts,
  deviceSplit,
  genreSplit,
  revenueByMonth,
  topCities,
  trafficSources,
} from "../superadmin-data";
import { Card, ProgressBar, StatCard } from "../ui";
import { formatCompactRupiah, formatNumber } from "../utils";

const topConcerts = [...adminConcerts]
  .filter((concert) => concert.revenue > 0)
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 5);

const totalTraffic = trafficSources.reduce((sum, item) => sum + item.value, 0);
const mobileShare = deviceSplit.find((item) => item.label === "Mobile")?.value ?? 0;

export default function SuperadminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeading
        eyebrow="Analytic"
        title="Analitik Platform"
        description="Pahami perilaku pengunjung, sumber trafik, dan performa penjualan tiket."
        action={
          <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#0f1320] px-4 py-2.5 text-xs font-medium text-slate-300">
            <AdminIcon name="calendar" className="h-4 w-4 text-purple-300" />
            Jan – Des 2026
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Tayangan"
          value="1.284.000"
          hint="Halaman dilihat"
          icon={<AdminIcon name="eye" className="h-5 w-5" />}
          tone="purple"
          trend={{ value: "24,8%", positive: true }}
        />
        <StatCard
          label="Pengunjung Unik"
          value="386.400"
          hint="30% dari total tayangan"
          icon={<AdminIcon name="users" className="h-5 w-5" />}
          tone="sky"
          trend={{ value: "18,2%", positive: true }}
        />
        <StatCard
          label="Conversion Rate"
          value="4,8%"
          hint="Pengunjung yang membeli"
          icon={<AdminIcon name="trendUp" className="h-5 w-5" />}
          tone="emerald"
          trend={{ value: "0,6%", positive: true }}
        />
        <StatCard
          label="Rata-rata Transaksi"
          value={formatCompactRupiah(1_250_000)}
          hint="Per pembelian tiket"
          icon={<AdminIcon name="creditCard" className="h-5 w-5" />}
          tone="amber"
          trend={{ value: "5,4%", positive: true }}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card
          title="Tren Nilai Transaksi"
          description="Perbandingan nilai transaksi per bulan"
          className="xl:col-span-2"
          action={
            <div className="text-right">
              <p className="text-lg font-bold">
                {formatCompactRupiah(revenueByMonth.reduce((sum, item) => sum + item.value, 0))}
              </p>
              <p className="text-[11px] text-emerald-400">+18,4% YoY</p>
            </div>
          }
        >
          <div className="mt-6">
            <BarChart data={revenueByMonth} formatValue={formatCompactRupiah} height="h-52" />
          </div>
        </Card>

        <Card
          title="Sumber Trafik"
          description={`${totalTraffic}% pengunjung terkategori`}
          action={<AdminIcon name="globe" className="h-4 w-4 text-slate-500" />}
        >
          <div className="mt-5">
            <HorizontalBreakdown items={trafficSources} />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card title="Genre Favorit" description="Distribusi penjualan tiket">
          <div className="mt-5">
            <DonutChart items={genreSplit} centerLabel="Pop" centerValue="38%" />
          </div>
        </Card>

        <Card title="Kota Teratas" description="Konsumen berdasarkan domisili">
          <div className="mt-5">
            <HorizontalBreakdown items={topCities} />
          </div>
        </Card>

        <Card
          title="Perangkat Pengunjung"
          description="Akses berdasarkan perangkat"
          action={
            <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-[10px] font-medium text-purple-300">
              {mobileShare}% mobile
            </span>
          }
        >
          <div className="mt-5">
            <DonutChart items={deviceSplit} centerLabel="Mobile" centerValue={`${mobileShare}%`} />
          </div>
        </Card>
      </div>

      <Card
        title="Konser Paling Laris"
        description="Berdasarkan nilai transaksi tertinggi"
        action={
          <span className="text-[11px] text-slate-500">Top {topConcerts.length} konser</span>
        }
      >
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">Konser</th>
                <th className="pb-3 font-medium">Organizer</th>
                <th className="pb-3 font-medium">Okupansi</th>
                <th className="pb-3 text-right font-medium">Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topConcerts.map((concert, index) => {
                const percent = Math.round((concert.ticketsSold / concert.capacity) * 100);

                return (
                  <tr key={concert.id} className="transition hover:bg-white/[0.02]">
                    <td className="py-3 pr-3 text-xs font-bold text-slate-500">
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-white">{concert.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {concert.city} · {concert.date}
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-400">{concert.organizer}</td>
                    <td className="py-3 pr-4">
                      <div className="w-40">
                        <div className="mb-1 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">
                            {formatNumber(concert.ticketsSold)} / {formatNumber(concert.capacity)}
                          </span>
                          <span className="text-slate-500">{percent}%</span>
                        </div>
                        <ProgressBar
                          value={percent}
                          color={percent >= 90 ? "#34d399" : "#8b5cf6"}
                        />
                      </div>
                    </td>
                    <td className="py-3 text-right text-xs font-semibold text-emerald-400">
                      {formatCompactRupiah(concert.revenue)}
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
