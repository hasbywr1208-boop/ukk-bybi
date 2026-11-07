"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { formatRupiah } from "@/lib/api";
import { fetchMyTransactions, toPurchase, type PurchaseView } from "@/lib/customer";
import { PageHeading } from "../page-heading";
import { PurchaseHistory } from "../purchase-history";

export function OrderHistory() {
  const [purchases, setPurchases] = useState<PurchaseView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchMyTransactions()
      .then((rows) => {
        if (active) {
          setPurchases(rows.map(toPurchase));
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Gagal memuat riwayat.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const totalSpent = purchases
    .filter((purchase) => purchase.status !== "Dibatalkan")
    .reduce((total, purchase) => total + purchase.totalValue, 0);
  const completed = purchases.filter((purchase) => purchase.status === "Selesai").length;
  const processing = purchases.filter((purchase) => purchase.status === "Diproses").length;

  return (
    <>
      <PageHeading
        eyebrow="Transaksi"
        title="Riwayat Pembelian"
        description="Pantau status pesanan dan unduh e-ticket dari pembelian sebelumnya."
        action={
          <Link
            href="/dashboard/tiket-saya"
            className="inline-flex items-center gap-2 rounded-lg border border-purple-500 px-4 py-2.5 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/10"
          >
            Tiket Saya
          </Link>
        }
      />

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/5 bg-[#121422] p-4">
          <p className="text-xs text-slate-400">Total Pesanan</p>
          <p className="mt-1 text-2xl font-bold">{loading ? "…" : purchases.length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#121422] p-4">
          <p className="text-xs text-slate-400">Selesai</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">{loading ? "…" : completed}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#121422] p-4">
          <p className="text-xs text-slate-400">Diproses</p>
          <p className="mt-1 text-2xl font-bold text-amber-400">{loading ? "…" : processing}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-[#121422] p-4">
          <p className="text-xs text-slate-400">Total Pengeluaran</p>
          <p className="mt-1 truncate text-xl font-bold text-purple-400">
            {loading ? "…" : formatRupiah(totalSpent)}
          </p>
        </div>
      </div>

      {error ? (
        <p className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="mt-5">
        <PurchaseHistory purchases={purchases} title="Semua Pembelian" />
      </div>
    </>
  );
}
