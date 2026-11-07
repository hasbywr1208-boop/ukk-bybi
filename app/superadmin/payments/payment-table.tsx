"use client";

import { useMemo, useState } from "react";

import { AdminIcon } from "../icons";
import {
  adminPayments as initialPayments,
  type AdminPayment,
  type PaymentStatus,
} from "../superadmin-data";
import { Card, Pill, StatCard, paymentStatusStyles } from "../ui";
import { formatCompactRupiah, formatRupiah } from "../utils";

type StatusFilter = "Semua" | PaymentStatus;

const statusFilters: StatusFilter[] = ["Semua", "Berhasil", "Menunggu", "Gagal", "Refund"];

export function PaymentTable() {
  const [payments, setPayments] = useState<AdminPayment[]>(initialPayments);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesStatus = statusFilter === "Semua" || payment.status === statusFilter;
      const matchesQuery =
        keyword.length === 0 ||
        [payment.id, payment.user, payment.email, payment.concert, payment.method].some(
          (value) => value.toLowerCase().includes(keyword),
        );

      return matchesStatus && matchesQuery;
    });
  }, [payments, query, statusFilter]);

  const selected = payments.find((payment) => payment.id === selectedId) ?? null;
  const pending = payments.filter((payment) => payment.status === "Menunggu");

  const totalAmount = payments
    .filter((payment) => payment.status === "Berhasil")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const totalFee = payments
    .filter((payment) => payment.status === "Berhasil")
    .reduce((sum, payment) => sum + payment.fee, 0);

  function updateStatus(payment: AdminPayment, status: PaymentStatus) {
    setPayments((current) =>
      current.map((item) => (item.id === payment.id ? { ...item, status } : item)),
    );

    const messages: Record<PaymentStatus, string> = {
      Berhasil: `Pembayaran ${payment.id} berhasil diverifikasi.`,
      Menunggu: `Pembayaran ${payment.id} dikembalikan ke status menunggu.`,
      Gagal: `Pembayaran ${payment.id} ditolak.`,
      Refund: `Refund untuk ${payment.id} diproses.`,
    };
    setNotice(messages[status]);
  }

  function verifyAll() {
    if (pending.length === 0) return;

    setPayments((current) =>
      current.map((item) =>
        item.status === "Menunggu" ? { ...item, status: "Berhasil" } : item,
      ),
    );
    setNotice(`${pending.length} pembayaran berhasil diverifikasi.`);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Diterima"
          value={formatCompactRupiah(totalAmount)}
          hint="Pembayaran berhasil"
          icon={<AdminIcon name="wallet" className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard
          label="Biaya Platform"
          value={formatCompactRupiah(totalFee)}
          hint="Dari transaksi berhasil"
          icon={<AdminIcon name="percent" className="h-5 w-5" />}
          tone="purple"
        />
        <StatCard
          label="Menunggu Verifikasi"
          value={String(pending.length)}
          hint="Perlu ditinjau manual"
          icon={<AdminIcon name="clock" className="h-5 w-5" />}
          tone="amber"
        />
        <StatCard
          label="Refund"
          value={String(payments.filter((item) => item.status === "Refund").length)}
          hint="Pengembalian dana"
          icon={<AdminIcon name="refresh" className="h-5 w-5" />}
          tone="sky"
        />
      </div>

      {notice ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
          <span className="flex items-center gap-2">
            <AdminIcon name="check" className="h-4 w-4" />
            {notice}
          </span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Tutup pemberitahuan"
            className="text-emerald-300/70 transition hover:text-emerald-200"
          >
            <AdminIcon name="close" className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {statusFilters.map((status) => {
              const count =
                status === "Semua"
                  ? payments.length
                  : payments.filter((item) => item.status === status).length;

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

            <div className="ml-auto flex flex-1 flex-wrap items-center justify-end gap-2 sm:flex-nowrap">
              <label className="relative min-w-0 flex-1 sm:max-w-56">
                <span className="sr-only">Cari pembayaran</span>
                <AdminIcon
                  name="search"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari transaksi..."
                  className="w-full rounded-lg border border-white/10 bg-[#070910] py-2 pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60"
                />
              </label>

              {pending.length > 0 ? (
                <button
                  type="button"
                  onClick={verifyAll}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-emerald-500"
                >
                  <AdminIcon name="check" className="h-3.5 w-3.5" />
                  Verifikasi semua
                </button>
              ) : null}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-medium">Transaksi</th>
                  <th className="pb-3 font-medium">Pengguna</th>
                  <th className="pb-3 font-medium">Konser</th>
                  <th className="pb-3 font-medium">Nominal</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Waktu</th>
                  <th className="pb-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((payment) => (
                  <tr key={payment.id} className="transition hover:bg-white/[0.02]">
                    <td className="py-3 pr-4">
                      <p className="font-mono text-xs font-medium text-white">{payment.id}</p>
                      <p className="text-[11px] text-slate-500">{payment.method}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-xs font-medium text-slate-200">{payment.user}</p>
                      <p className="text-[11px] text-slate-500">{payment.email}</p>
                    </td>
                    <td className="max-w-44 truncate py-3 pr-4 text-xs text-slate-400">
                      {payment.concert}
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-xs font-semibold text-white">
                        {formatRupiah(payment.amount)}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Fee {formatRupiah(payment.fee)}
                      </p>
                    </td>
                    <td className="py-3 pr-4">
                      <Pill className={paymentStatusStyles[payment.status]}>
                        {payment.status}
                      </Pill>
                    </td>
                    <td className="py-3 pr-4 text-[11px] text-slate-500">{payment.date}</td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedId(payment.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 transition hover:border-purple-500/40 hover:text-white"
                      >
                        <AdminIcon name="eye" className="h-3.5 w-3.5" />
                        Kelola
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
              <p className="text-sm font-medium text-slate-300">Transaksi tidak ditemukan</p>
              <p className="mt-1 text-xs text-slate-500">
                Coba ubah filter status atau kata kunci pencarian.
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">
              Menampilkan {filtered.length} dari {payments.length} transaksi
            </p>
          )}
        </div>
      </Card>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Tutup detail pembayaran"
            onClick={() => setSelectedId(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Detail pembayaran ${selected.id}`}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0f1320] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/5 p-5">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500">
                  Detail transaksi
                </p>
                <p className="mt-0.5 font-mono text-lg font-bold">{selected.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Tutup"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <AdminIcon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <Pill className={paymentStatusStyles[selected.status]}>{selected.status}</Pill>
                <span className="text-[11px] text-slate-500">{selected.date}</span>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Nominal</span>
                  <span className="font-semibold">{formatRupiah(selected.amount)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Biaya platform</span>
                  <span className="text-slate-300">{formatRupiah(selected.fee)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-sm">
                  <span className="font-medium text-slate-300">Diterima organizer</span>
                  <span className="font-bold text-emerald-400">
                    {formatRupiah(selected.amount - selected.fee)}
                  </span>
                </div>
              </div>

              <dl className="space-y-2 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Pengguna</dt>
                  <dd className="text-right font-medium text-slate-200">{selected.user}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Email</dt>
                  <dd className="truncate text-right text-slate-300">{selected.email}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Konser</dt>
                  <dd className="truncate text-right text-slate-300">{selected.concert}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Metode</dt>
                  <dd className="text-right text-slate-300">{selected.method}</dd>
                </div>
              </dl>

              {selected.status === "Menunggu" ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateStatus(selected, "Gagal")}
                    className="flex-1 rounded-lg border border-rose-500/30 px-3 py-2.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/10"
                  >
                    Tolak pembayaran
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(selected, "Berhasil")}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-500"
                  >
                    <AdminIcon name="check" className="h-3.5 w-3.5" />
                    Verifikasi
                  </button>
                </div>
              ) : selected.status === "Berhasil" ? (
                <button
                  type="button"
                  onClick={() => updateStatus(selected, "Refund")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-sky-500/30 px-3 py-2.5 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/10"
                >
                  <AdminIcon name="refresh" className="h-3.5 w-3.5" />
                  Proses refund
                </button>
              ) : (
                <p className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 text-[11px] text-slate-500">
                  Tidak ada tindakan lanjutan untuk transaksi berstatus {selected.status}.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
