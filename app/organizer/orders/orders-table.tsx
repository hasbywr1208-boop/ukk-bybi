"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { api } from "@/lib/api";
import { OrganizerIcon } from "../icons";
import type { OrderStatus, OrganizerOrder } from "../organizer-data";
import { Card, Pill, StatCard, orderStatusStyles } from "../ui";
import { formatCompactRupiah, formatRupiah } from "../utils";

type StatusFilter = "Semua" | OrderStatus;

const statusFilters: StatusFilter[] = ["Semua", "Dibayar", "Pending", "Cancel", "Refund"];

const statusToBackend: Record<OrderStatus, string> = {
  Dibayar: "paid",
  Pending: "pending",
  Cancel: "cancelled",
  Refund: "refunded",
};

export function OrdersTable() {
  const [orders, setOrders] = useState<OrganizerOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Semua");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    const rows = await api.get<OrganizerOrder[]>("/organizer/orders");
    setOrders(rows ?? []);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    load()
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Gagal memuat pesanan.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [load]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = statusFilter === "Semua" || order.status === statusFilter;
      const matchesQuery =
        keyword.length === 0 ||
        [order.id, order.buyer, order.email, order.concert, order.ticketType].some((value) =>
          value.toLowerCase().includes(keyword),
        );

      return matchesStatus && matchesQuery;
    });
  }, [orders, statusFilter, query]);

  const selected = orders.find((order) => order.id === selectedId) ?? null;
  const paidRevenue = orders
    .filter((order) => order.status === "Dibayar")
    .reduce((sum, order) => sum + order.total, 0);
  const pendingRevenue = orders
    .filter((order) => order.status === "Pending")
    .reduce((sum, order) => sum + order.total, 0);
  const totalTickets = orders
    .filter((order) => order.status === "Dibayar")
    .reduce((sum, order) => sum + order.qty, 0);

  async function updateStatus(order: OrganizerOrder, status: OrderStatus) {
    const previous = orders;
    setOrders((current) =>
      current.map((item) => (item.id === order.id ? { ...item, status } : item)),
    );

    const messages: Record<OrderStatus, string> = {
      Dibayar: `${order.id} berhasil dikonfirmasi sebagai dibayar.`,
      Pending: `${order.id} dikembalikan ke status pending.`,
      Cancel: `${order.id} dibatalkan.`,
      Refund: `Refund untuk ${order.id} diproses.`,
    };

    setUpdating(true);
    setError(null);
    try {
      await api.patch(`/organizer/orders/${order.id}/status`, {
        status: statusToBackend[status],
      });
      setNotice(messages[status]);
      await load();
    } catch (err) {
      setOrders(previous);
      setError(err instanceof Error ? err.message : "Gagal mengubah status pesanan.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Pesanan"
          value={String(orders.length)}
          hint="Semua transaksi"
          icon={<OrganizerIcon name="fileText" className="h-5 w-5" />}
          tone="purple"
        />
        <StatCard
          label="Pendapatan Dibayar"
          value={formatCompactRupiah(paidRevenue)}
          hint={`${totalTickets} tiket terjual`}
          icon={<OrganizerIcon name="wallet" className="h-5 w-5" />}
          tone="emerald"
        />
        <StatCard
          label="Pending"
          value={String(orders.filter((item) => item.status === "Pending").length)}
          hint={`${formatRupiah(pendingRevenue)} menunggu`}
          icon={<OrganizerIcon name="clock" className="h-5 w-5" />}
          tone="amber"
        />
        <StatCard
          label="Refund"
          value={String(orders.filter((item) => item.status === "Refund").length)}
          hint="Pengembalian dana"
          icon={<OrganizerIcon name="refresh" className="h-5 w-5" />}
          tone="sky"
        />
      </div>

      {notice ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
          <span className="flex items-center gap-2">
            <OrganizerIcon name="check" className="h-4 w-4" />
            {notice}
          </span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Tutup pemberitahuan"
            className="text-emerald-300/70 transition hover:text-emerald-200"
          >
            <OrganizerIcon name="close" className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
          {error}
        </p>
      ) : null}

      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {statusFilters.map((status) => {
              const count =
                status === "Semua"
                  ? orders.length
                  : orders.filter((item) => item.status === status).length;

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

            <label className="relative ml-auto min-w-0 flex-1 sm:max-w-64">
              <span className="sr-only">Cari pesanan</span>
              <OrganizerIcon
                name="search"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari order, pembeli, atau konser..."
                className="w-full rounded-lg border border-white/10 bg-[#070910] py-2 pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-medium">Pesanan</th>
                  <th className="pb-3 font-medium">Pembeli</th>
                  <th className="pb-3 font-medium">Tiket</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Metode</th>
                  <th className="pb-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
                      Memuat pesanan...
                    </td>
                  </tr>
                ) : null}
                {filtered.map((order) => (
                  <tr key={order.id} className="transition hover:bg-white/[0.02]">
                    <td className="py-3 pr-4">
                      <p className="font-mono text-xs font-medium text-white">{order.id}</p>
                      <p className="text-[10px] text-slate-500">{order.date}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="text-xs font-medium text-slate-200">{order.buyer}</p>
                      <p className="text-[10px] text-slate-500">{order.email}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <p className="max-w-40 truncate text-xs text-slate-300">
                        {order.concert}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {order.ticketType} · {order.qty} tiket
                      </p>
                    </td>
                    <td className="py-3 pr-4 text-xs font-semibold text-white">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="py-3 pr-4">
                      <Pill className={orderStatusStyles[order.status]}>{order.status}</Pill>
                    </td>
                    <td className="py-3 pr-4 text-[11px] text-slate-400">{order.method}</td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedId(order.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 transition hover:border-purple-500/40 hover:text-white"
                      >
                        <OrganizerIcon name="eye" className="h-3.5 w-3.5" />
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
              <p className="text-sm font-medium text-slate-300">Pesanan tidak ditemukan</p>
              <p className="mt-1 text-xs text-slate-500">
                Coba ubah filter status atau kata kunci pencarian.
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">
              Menampilkan {filtered.length} dari {orders.length} pesanan
            </p>
          )}
        </div>
      </Card>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Tutup detail pesanan"
            onClick={() => setSelectedId(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Detail ${selected.id}`}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0f1320] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/5 p-5">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500">
                  Detail pesanan
                </p>
                <p className="mt-0.5 font-mono text-lg font-bold">{selected.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Tutup"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <OrganizerIcon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <Pill className={orderStatusStyles[selected.status]}>{selected.status}</Pill>
                <span className="text-[11px] text-slate-500">{selected.date}</span>
              </div>

              <dl className="space-y-2.5 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Pembeli</dt>
                  <dd className="font-medium text-slate-200">{selected.buyer}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Email</dt>
                  <dd className="truncate text-slate-300">{selected.email}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Konser</dt>
                  <dd className="truncate text-slate-300">{selected.concert}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Tipe tiket</dt>
                  <dd className="text-slate-300">
                    {selected.ticketType} · {selected.qty}x
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Metode</dt>
                  <dd className="text-slate-300">{selected.method}</dd>
                </div>
                <div className="flex justify-between gap-3 border-t border-white/5 pt-2.5">
                  <dt className="font-medium text-slate-300">Total</dt>
                  <dd className="font-bold text-white">{formatRupiah(selected.total)}</dd>
                </div>
              </dl>

              {selected.status === "Pending" ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => updateStatus(selected, "Cancel")}
                    className="flex-1 rounded-lg border border-rose-500/30 px-3 py-2.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Batalkan
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => updateStatus(selected, "Dibayar")}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <OrganizerIcon name="check" className="h-3.5 w-3.5" />
                    Konfirmasi
                  </button>
                </div>
              ) : selected.status === "Dibayar" ? (
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => updateStatus(selected, "Refund")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-sky-500/30 px-3 py-2.5 text-xs font-semibold text-sky-300 transition hover:bg-sky-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <OrganizerIcon name="refresh" className="h-3.5 w-3.5" />
                  Proses refund
                </button>
              ) : (
                <p className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 text-[11px] text-slate-500">
                  Tidak ada tindakan lanjutan untuk pesanan berstatus {selected.status}.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
