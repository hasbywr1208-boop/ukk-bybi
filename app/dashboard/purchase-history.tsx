"use client";

import { useMemo, useState } from "react";
type IconProps = { className?: string };

function Icon({ name, className }: IconProps & { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    chevron: <path d="m9 18 6-6-6-6" />,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 2" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    ticket: <><path d="M2 9a3 3 0 0 0 0 6v3h20v-3a3 3 0 0 1 0-6V6H2z" /><path d="M13 6v2m0 4v2m0 4v1" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

const ChevronRight = (props: IconProps) => <Icon name="chevron" {...props} />;
const History = (props: IconProps) => <Icon name="history" {...props} />;
const Search = (props: IconProps) => <Icon name="search" {...props} />;
const Ticket = (props: IconProps) => <Icon name="ticket" {...props} />;
const X = (props: IconProps) => <Icon name="close" {...props} />;

import Link from "next/link";

import type { PurchaseStatus, PurchaseView } from "@/lib/customer";
import { Card, statusStyles } from "./ui";

type FilterKey = "Semua" | PurchaseStatus;

const filters: FilterKey[] = ["Semua", "Selesai", "Diproses", "Dibatalkan"];

export function PurchaseHistory({
  purchases = [],
  limit,
  title = "Riwayat Pembelian Terbaru",
}: {
  purchases?: PurchaseView[];
  limit?: number;
  title?: string;
}) {
  const [filter, setFilter] = useState<FilterKey>("Semua");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const map: Record<FilterKey, number> = {
      Semua: purchases.length,
      Selesai: 0,
      Diproses: 0,
      Dibatalkan: 0,
    };

    for (const purchase of purchases) {
      map[purchase.status] += 1;
    }

    return map;
  }, [purchases]);

  const rows = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    const filtered = purchases.filter((purchase) => {
      const matchStatus = filter === "Semua" || purchase.status === filter;
      const matchQuery =
        keyword === "" ||
        purchase.concert.toLowerCase().includes(keyword) ||
        purchase.id.toLowerCase().includes(keyword);

      return matchStatus && matchQuery;
    });

    return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
  }, [filter, limit, purchases, query]);

  return (
    <Card
      title={title}
      icon={<History className="h-5 w-5" />}
      action={
        <Link
          href="/dashboard/riwayat-pembelian"
          className="inline-flex items-center gap-1 text-sm font-medium text-purple-400 transition hover:text-purple-300"
        >
          Lihat semua
          <ChevronRight className="h-4 w-4" />
        </Link>
      }
    >
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => {
            const active = filter === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                aria-pressed={active}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-purple-800 text-white"
                    : "border border-white/5 text-slate-400 hover:border-purple-500/40 hover:text-white"
                }`}
              >
                {item}
                <span className={active ? "ml-1.5 text-purple-200" : "ml-1.5 text-slate-600"}>
                  {counts[item]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari konser atau ID pesanan"
            aria-label="Cari riwayat pembelian"
            className="w-full rounded-lg border border-white/5 bg-[#0f1122] py-2 pl-9 pr-9 text-sm text-white placeholder:text-slate-500 focus:border-purple-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Bersihkan pencarian"
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-slate-500 transition hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-slate-500">
              <th scope="col" className="pb-3 pr-4 font-medium">
                Konser
              </th>
              <th scope="col" className="pb-3 pr-4 font-medium">
                Tanggal
              </th>
              <th scope="col" className="hidden pb-3 pr-4 font-medium lg:table-cell">
                Tiket
              </th>
              <th scope="col" className="hidden pb-3 pr-4 font-medium sm:table-cell">
                Total
              </th>
              <th scope="col" className="pb-3 pr-4 font-medium">
                Status
              </th>
              <th scope="col" className="pb-3 font-medium">
                Ticket
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((purchase) => (
              <tr key={purchase.id} className="transition hover:bg-white/[0.02]">
                <td className="py-4 pr-4">
                  <p className="font-medium">{purchase.concert}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{purchase.id}</p>
                </td>
                <td className="py-4 pr-4 whitespace-nowrap text-slate-400">
                  {purchase.date}
                </td>
                <td className="hidden py-4 pr-4 whitespace-nowrap text-slate-400 lg:table-cell">
                  {purchase.quantity} tiket
                </td>
                <td className="hidden py-4 pr-4 whitespace-nowrap font-medium sm:table-cell">
                  {purchase.totalPrice}
                </td>
                <td className="py-4 pr-4">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusStyles[purchase.status]
                    }`}
                  >
                    {purchase.status}
                  </span>
                </td>
                <td className="py-4">
                  {purchase.hasEticket ? (
                    <Link
                      href={`/dashboard/tiket-saya/${encodeURIComponent(purchase.transactionId)}`}
                      className="inline-flex items-center gap-1.5 font-medium text-purple-400 transition hover:text-purple-300"
                    >
                      <Ticket className="h-4 w-4" />
                      Lihat E-Ticket
                    </Link>
                  ) : (
                    <span className="text-xs text-slate-600">
                      Belum tersedia
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm text-slate-500">
                  Tidak ada pesanan yang cocok dengan filter ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}