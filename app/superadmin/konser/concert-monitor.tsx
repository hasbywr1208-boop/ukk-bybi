"use client";

import { useMemo, useState } from "react";

import { AdminIcon } from "../icons";
import { adminConcerts, type ConcertStatus } from "../superadmin-data";
import {
  Card,
  Pill,
  ProgressBar,
  StatCard,
  concertStatusStyles,
} from "../ui";
import { formatCompactRupiah, formatNumber } from "../utils";

type StatusFilter = "Semua" | ConcertStatus;

const statusFilters: StatusFilter[] = ["Semua", "Aktif", "Menunggu", "Selesai", "Dibatalkan"];

const totalTickets = adminConcerts.reduce((sum, item) => sum + item.ticketsSold, 0);
const totalRevenue = adminConcerts.reduce((sum, item) => sum + item.revenue, 0);
const totalCapacity = adminConcerts.reduce((sum, item) => sum + item.capacity, 0);

export function ConcertMonitor() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return adminConcerts.filter((concert) => {
      const matchesStatus = statusFilter === "Semua" || concert.status === statusFilter;
      const matchesQuery =
        keyword.length === 0 ||
        [concert.title, concert.organizer, concert.city, concert.venue, concert.id].some(
          (value) => value.toLowerCase().includes(keyword),
        );

      return matchesStatus && matchesQuery;
    });
  }, [query, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Konser"
          value={String(adminConcerts.length)}
          hint={`${adminConcerts.filter((item) => item.status === "Aktif").length} sedang aktif`}
          icon={<AdminIcon name="calendar" className="h-5 w-5" />}
          tone="purple"
        />
        <StatCard
          label="Tiket Terjual"
          value={formatNumber(totalTickets)}
          hint={`dari ${formatNumber(totalCapacity)} kapasitas`}
          icon={<AdminIcon name="ticket" className="h-5 w-5" />}
          tone="sky"
        />
        <StatCard
          label="Pendapatan Konser"
          value={formatCompactRupiah(totalRevenue)}
          hint="Akumulasi seluruh konser"
          icon={<AdminIcon name="wallet" className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard
          label="Menunggu Publikasi"
          value={String(adminConcerts.filter((item) => item.status === "Menunggu").length)}
          hint="Belum tayang di situs"
          icon={<AdminIcon name="clock" className="h-5 w-5" />}
          tone="amber"
        />
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-sky-500/20 bg-sky-500/5 px-4 py-3 text-xs text-sky-200">
        <AdminIcon name="eye" className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Mode monitoring — data konser bersifat read-only. Perubahan detail konser dilakukan
          oleh organizer melalui dashboard mereka.
        </p>
      </div>

      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {statusFilters.map((status) => {
              const count =
                status === "Semua"
                  ? adminConcerts.length
                  : adminConcerts.filter((item) => item.status === status).length;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    statusFilter === status
                      ? "bg-purple-600 text-white"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {status}
                  <span
                    className={`rounded-full px-1.5 text-[10px] ${
                      statusFilter === status ? "bg-white/20" : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            <label className="relative ml-auto min-w-0 flex-1 sm:max-w-xs">
              <span className="sr-only">Cari konser</span>
              <AdminIcon
                name="search"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari konser, organizer, atau kota..."
                className="w-full rounded-lg border border-white/10 bg-[#070910] py-2 pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-medium">Konser</th>
                  <th className="pb-3 font-medium">Organizer</th>
                  <th className="pb-3 font-medium">Jadwal</th>
                  <th className="pb-3 font-medium">Terjual</th>
                  <th className="pb-3 font-medium">Pendapatan</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((concert) => {
                  const percent = Math.round((concert.ticketsSold / concert.capacity) * 100);

                  return (
                    <tr key={concert.id} className="transition hover:bg-white/[0.02]">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 text-purple-300">
                            <AdminIcon name="music" className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">{concert.title}</p>
                            <p className="truncate text-[11px] text-slate-500">
                              {concert.venue} · {concert.city}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-xs text-slate-400">{concert.organizer}</td>
                      <td className="py-3 pr-4 text-xs text-slate-400">{concert.date}</td>
                      <td className="py-3 pr-4">
                        <div className="w-36">
                          <div className="mb-1 flex items-center justify-between text-[10px]">
                            <span className="text-slate-300">{formatNumber(concert.ticketsSold)}</span>
                            <span className="text-slate-500">{percent}%</span>
                          </div>
                          <ProgressBar
                            value={percent}
                            color={percent >= 90 ? "#34d399" : percent >= 50 ? "#8b5cf6" : "#f59e0b"}
                          />
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-xs font-medium text-slate-300">
                        {concert.revenue > 0 ? formatCompactRupiah(concert.revenue) : "—"}
                      </td>
                      <td className="py-3">
                        <Pill className={concertStatusStyles[concert.status]}>
                          {concert.status}
                        </Pill>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
              <p className="text-sm font-medium text-slate-300">Konser tidak ditemukan</p>
              <p className="mt-1 text-xs text-slate-500">
                Coba ubah filter status atau kata kunci pencarian.
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">
              Menampilkan {filtered.length} dari {adminConcerts.length} konser
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
