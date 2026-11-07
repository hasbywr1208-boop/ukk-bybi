import Link from "next/link";

import { BarChart } from "./charts";
import { AdminIcon } from "./icons";
import { AdminPageHeading } from "./page-heading";
import {
  adminConcerts,
  adminPayments,
  organizers,
  organizerRevenue,
  revenueByMonth,
  ticketsByMonth,
} from "./superadmin-data";
import {
  Card,
  Pill,
  ProgressBar,
  StatCard,
  organizerStatusStyles,
  paymentStatusStyles,
} from "./ui";
import { formatCompactRupiah, formatNumber, formatRupiah } from "./utils";

const totalGmv = revenueByMonth.reduce((sum, point) => sum + point.value, 0);
const totalTickets = ticketsByMonth.reduce((sum, point) => sum + point.value, 0);
const verifiedOrganizers = organizers.filter((item) => item.status === "Terverifikasi").length;
const pendingOrganizers = organizers.filter((item) => item.status === "Menunggu");
const pendingConcerts = adminConcerts.filter((item) => item.status === "Menunggu");
const pendingPayments = adminPayments.filter((item) => item.status === "Menunggu");
const pendingActions =
  pendingOrganizers.length + pendingConcerts.length + pendingPayments.length;

const topOrganizers = [...organizerRevenue].sort((a, b) => b.gross - a.gross).slice(0, 4);
const maxOrganizerGross = topOrganizers[0]?.gross ?? 1;
const activeConcerts = adminConcerts.filter((item) => item.status === "Aktif").slice(0, 4);

export default function SuperadminDashboardPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeading
        eyebrow="Superadmin Dashboard"
        title="Ringkasan Platform"
        description="Pantau performa KONSERVIBE, verifikasi organizer, dan aktivitas transaksi terbaru."
        action={
          <Link
            href="/superadmin/reports"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
          >
            <AdminIcon name="download" className="h-4 w-4" />
            Unduh Laporan
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="GMV Tahun Ini"
          value={formatCompactRupiah(totalGmv)}
          hint="Nilai transaksi tiket 2026"
          icon={<AdminIcon name="wallet" className="h-5 w-5" />}
          tone="purple"
          trend={{ value: "18,4%", positive: true }}
        />
        <StatCard
          label="Tiket Terjual"
          value={formatNumber(totalTickets)}
          hint="Sepanjang tahun 2026"
          icon={<AdminIcon name="ticket" className="h-5 w-5" />}
          tone="sky"
          trend={{ value: "12,6%", positive: true }}
        />
        <StatCard
          label="Organizer Terverifikasi"
          value={`${verifiedOrganizers}/${organizers.length}`}
          hint="Mitra aktif di platform"
          icon={<AdminIcon name="shield" className="h-5 w-5" />}
          tone="emerald"
          trend={{ value: "3 baru", positive: true }}
        />
        <StatCard
          label="Butuh Tindakan"
          value={String(pendingActions)}
          hint="Verifikasi, approval & payment"
          icon={<AdminIcon name="alert" className="h-5 w-5" />}
          tone="amber"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <Card
          title="Nilai Transaksi 2026"
          description="Total nilai transaksi tiket per bulan"
          action={
            <div className="text-right">
              <p className="text-lg font-bold">{formatCompactRupiah(totalGmv)}</p>
              <p className="text-[11px] text-emerald-400">+18,4% dari tahun lalu</p>
            </div>
          }
        >
          <div className="mt-6">
            <BarChart data={revenueByMonth} formatValue={formatCompactRupiah} />
          </div>
        </Card>

        <Card
          title="Tindakan Diperlukan"
          description={`${pendingActions} item menunggu review`}
          action={
            <Link
              href="/superadmin/organizers"
              className="text-xs font-medium text-purple-300 transition hover:text-purple-200"
            >
              Lihat semua
            </Link>
          }
        >
          <div className="mt-4 flex flex-col gap-2.5">
            {pendingOrganizers.slice(0, 3).map((organizer) => (
              <Link
                key={organizer.id}
                href="/superadmin/organizers"
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-purple-500/30"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-xs font-bold text-amber-300">
                  {organizer.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{organizer.name}</span>
                  <span className="block truncate text-[11px] text-slate-500">
                    {organizer.city} · {organizer.submittedAt}
                  </span>
                </span>
                <AdminIcon name="chevronRight" className="h-4 w-4 shrink-0 text-slate-600" />
              </Link>
            ))}

            <Link
              href="/superadmin/payments"
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-purple-500/30"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300">
                <AdminIcon name="creditCard" className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {pendingPayments.length} pembayaran menunggu
                </span>
                <span className="block truncate text-[11px] text-slate-500">
                  Perlu verifikasi manual
                </span>
              </span>
              <AdminIcon name="chevronRight" className="h-4 w-4 shrink-0 text-slate-600" />
            </Link>

            <Link
              href="/superadmin/konser"
              className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-purple-500/30"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 text-purple-300">
                <AdminIcon name="calendar" className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {pendingConcerts.length} konser menunggu publikasi
                </span>
                <span className="block truncate text-[11px] text-slate-500">
                  Review detail sebelum tayang
                </span>
              </span>
              <AdminIcon name="chevronRight" className="h-4 w-4 shrink-0 text-slate-600" />
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        <Card
          title="Pembayaran Terbaru"
          description="5 transaksi terakhir di platform"
          action={
            <Link
              href="/superadmin/payments"
              className="text-xs font-medium text-purple-300 transition hover:text-purple-200"
            >
              Kelola payment
            </Link>
          }
        >
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-medium">Transaksi</th>
                  <th className="pb-3 font-medium">Konser</th>
                  <th className="pb-3 font-medium">Nominal</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {adminPayments.slice(0, 5).map((payment) => (
                  <tr key={payment.id} className="text-slate-300">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-white">{payment.user}</p>
                      <p className="text-[11px] text-slate-500">{payment.id}</p>
                    </td>
                    <td className="max-w-44 truncate py-3 pr-4 text-xs">{payment.concert}</td>
                    <td className="py-3 pr-4 text-xs font-medium">{formatRupiah(payment.amount)}</td>
                    <td className="py-3">
                      <Pill className={paymentStatusStyles[payment.status]}>{payment.status}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title="Top Organizer"
          description="Berdasarkan nilai transaksi"
          action={
            <Link
              href="/superadmin/reports"
              className="text-xs font-medium text-purple-300 transition hover:text-purple-200"
            >
              Laporan
            </Link>
          }
        >
          <div className="mt-4 flex flex-col gap-4">
            {topOrganizers.map((organizer, index) => (
              <div key={organizer.id}>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/5 text-[10px] font-bold text-slate-400">
                      {index + 1}
                    </span>
                    <span className="truncate text-xs font-medium text-slate-200">
                      {organizer.organizer}
                    </span>
                  </div>
                  <span className="shrink-0 text-[11px] font-medium text-slate-400">
                    {formatCompactRupiah(organizer.gross)}
                  </span>
                </div>
                <ProgressBar
                  value={(organizer.gross / maxOrganizerGross) * 100}
                  color={index === 0 ? "#8b5cf6" : "#4c1d95"}
                />
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-3 py-2.5">
            <span className="text-[11px] text-slate-400">Rata-rata pertumbuhan</span>
            <span className="text-xs font-semibold text-emerald-400">+9,6%</span>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          title="Tiket Terjual per Bulan"
          description="Volume tiket terjual sepanjang 2026"
          action={<span className="text-xs text-slate-500">Total {formatNumber(totalTickets)}</span>}
        >
          <div className="mt-6">
            <BarChart data={ticketsByMonth} color="#22d3ee" formatValue={formatNumber} height="h-44" />
          </div>
        </Card>

        <Card
          title="Konser Aktif"
          description="Konser yang sedang berjalan"
          action={
            <Link
              href="/superadmin/konser"
              className="text-xs font-medium text-purple-300 transition hover:text-purple-200"
            >
              Monitor
            </Link>
          }
        >
          <div className="mt-4 flex flex-col gap-2.5">
            {activeConcerts.map((concert) => (
              <div
                key={concert.id}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 text-purple-300">
                  <AdminIcon name="music" className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{concert.title}</p>
                  <p className="truncate text-[11px] text-slate-500">
                    {concert.venue} · {concert.date}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-semibold text-white">
                    {Math.round((concert.ticketsSold / concert.capacity) * 100)}%
                  </p>
                  <p className="text-[10px] text-slate-500">terjual</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card
        title="Organizer Menunggu Verifikasi"
        description="Review dokumen dan setujui organizer baru"
        action={
          <Link
            href="/superadmin/organizers"
            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-600/10 px-3 py-1.5 text-xs font-medium text-purple-300 transition hover:bg-purple-600/20"
          >
            Pusat verifikasi
            <AdminIcon name="arrowUpRight" className="h-3.5 w-3.5" />
          </Link>
        }
      >
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {pendingOrganizers.map((organizer) => (
            <div
              key={organizer.id}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-500/20 text-xs font-bold text-amber-300">
                  {organizer.initials}
                </span>
                <Pill className={organizerStatusStyles[organizer.status]}>
                  {organizer.status}
                </Pill>
              </div>
              <p className="mt-3 truncate text-sm font-semibold">{organizer.name}</p>
              <p className="mt-0.5 truncate text-[11px] text-slate-500">
                {organizer.category} · {organizer.city}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>{organizer.documents} dokumen</span>
                <span>{organizer.submittedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
