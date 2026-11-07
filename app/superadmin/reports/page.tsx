import { BarChart } from "../charts";
import { AdminIcon } from "../icons";
import { AdminPageHeading } from "../page-heading";
import {
  organizerRevenue,
  revenueByMonth,
  ticketsByMonth,
} from "../superadmin-data";
import { Card, ProgressBar, StatCard } from "../ui";
import { formatCompactRupiah, formatNumber } from "../utils";
import { ReportExportButton } from "./export-button";

const totalGross = organizerRevenue.reduce((sum, item) => sum + item.gross, 0);
const totalFee = organizerRevenue.reduce((sum, item) => sum + item.fee, 0);
const totalNet = organizerRevenue.reduce((sum, item) => sum + item.net, 0);
const totalTickets = organizerRevenue.reduce((sum, item) => sum + item.tickets, 0);
const averageGrowth =
  organizerRevenue.reduce((sum, item) => sum + item.growth, 0) / organizerRevenue.length;

export default function SuperadminReportsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeading
        eyebrow="Laporan Pendapatan"
        title="Laporan Penghasilan Organizer"
        description="Rekap pendapatan kotor, komisi platform, dan penghasilan bersih seluruh organizer."
        action={<ReportExportButton />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pendapatan Kotor"
          value={formatCompactRupiah(totalGross)}
          hint="Nilai transaksi organizer"
          icon={<AdminIcon name="wallet" className="h-5 w-5" />}
          tone="purple"
          trend={{ value: "18,4%", positive: true }}
        />
        <StatCard
          label="Komisi Platform"
          value={formatCompactRupiah(totalFee)}
          hint="5% dari pendapatan kotor"
          icon={<AdminIcon name="percent" className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard
          label="Penghasilan Bersih"
          value={formatCompactRupiah(totalNet)}
          hint="Hak organizer"
          icon={<AdminIcon name="trendUp" className="h-5 w-5" />}
          tone="sky"
          trend={{ value: `${averageGrowth.toFixed(1)}%`, positive: averageGrowth >= 0 }}
        />
        <StatCard
          label="Tiket Terjual"
          value={formatNumber(totalTickets)}
          hint="Seluruh organizer"
          icon={<AdminIcon name="ticket" className="h-5 w-5" />}
          tone="amber"
          trend={{ value: "12,6%", positive: true }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Pendapatan Kotor 2026"
          description="Nilai transaksi per bulan"
          action={<span className="text-[11px] text-slate-500">Jan – Des 2026</span>}
        >
          <div className="mt-6">
            <BarChart data={revenueByMonth} formatValue={formatCompactRupiah} height="h-48" />
          </div>
        </Card>

        <Card
          title="Volume Tiket 2026"
          description="Tiket terjual per bulan"
          action={<span className="text-[11px] text-slate-500">{formatNumber(totalTickets)} tiket</span>}
        >
          <div className="mt-6">
            <BarChart data={ticketsByMonth} color="#22d3ee" formatValue={formatNumber} height="h-48" />
          </div>
        </Card>
      </div>

      <Card
        title="Rincian per Organizer"
        description="Periode Januari – Desember 2026"
        action={<span className="text-[11px] text-slate-500">{organizerRevenue.length} organizer</span>}
      >
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="pb-3 font-medium">Organizer</th>
                <th className="pb-3 font-medium">Event</th>
                <th className="pb-3 font-medium">Tiket</th>
                <th className="pb-3 font-medium">Pendapatan Kotor</th>
                <th className="pb-3 font-medium">Fee 5%</th>
                <th className="pb-3 font-medium">Bersih</th>
                <th className="pb-3 font-medium">Pertumbuhan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {organizerRevenue.map((row) => (
                <tr key={row.id} className="transition hover:bg-white/[0.02]">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/40 to-indigo-500/20 text-[10px] font-bold text-purple-200">
                        {row.organizer
                          .split(" ")
                          .slice(0, 2)
                          .map((word) => word[0])
                          .join("")}
                      </span>
                      <div>
                        <p className="font-medium text-white">{row.organizer}</p>
                        <p className="text-[11px] text-slate-500">{row.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate-400">{row.events}</td>
                  <td className="py-3 pr-4 text-xs text-slate-400">
                    {formatNumber(row.tickets)}
                  </td>
                  <td className="py-3 pr-4 text-xs font-medium text-slate-200">
                    {formatCompactRupiah(row.gross)}
                  </td>
                  <td className="py-3 pr-4 text-xs text-rose-300">
                    -{formatCompactRupiah(row.fee)}
                  </td>
                  <td className="py-3 pr-4 text-xs font-semibold text-emerald-400">
                    {formatCompactRupiah(row.net)}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold ${
                          row.growth >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {row.growth >= 0 ? "+" : ""}
                        {row.growth.toFixed(1)}%
                      </span>
                      <ProgressBar
                        value={Math.abs(row.growth) * 4}
                        color={row.growth >= 0 ? "#34d399" : "#f43f5e"}
                        className="w-14"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10 text-xs font-semibold">
                <td className="pt-3 pr-4" colSpan={2}>
                  Total
                </td>
                <td className="pt-3 pr-4 text-slate-300">{formatNumber(totalTickets)}</td>
                <td className="pt-3 pr-4 text-white">{formatCompactRupiah(totalGross)}</td>
                <td className="pt-3 pr-4 text-rose-300">-{formatCompactRupiah(totalFee)}</td>
                <td className="pt-3 pr-4 text-emerald-400">{formatCompactRupiah(totalNet)}</td>
                <td className="pt-3 pr-4">
                  <span
                    className={`${
                      averageGrowth >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {averageGrowth >= 0 ? "+" : ""}
                    {averageGrowth.toFixed(1)}%
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
}
