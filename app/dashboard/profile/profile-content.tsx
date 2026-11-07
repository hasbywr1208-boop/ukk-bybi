"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { formatRupiah } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  fetchMyTransactions,
  fetchWishlist,
  toPurchase,
  type PurchaseView,
} from "@/lib/customer";
import { PageHeading } from "../page-heading";

const statusTone: Record<string, string> = {
  Selesai: "bg-emerald-500/10 text-emerald-400",
  Diproses: "bg-amber-500/10 text-amber-400",
  Dibatalkan: "bg-rose-500/10 text-rose-400",
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 py-3 last:border-0 last:pb-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-200">{value}</span>
    </div>
  );
}

export function ProfileContent() {
  const { user, loading: authLoading } = useAuth();
  const [purchases, setPurchases] = useState<PurchaseView[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [activeTickets, setActiveTickets] = useState(0);

  useEffect(() => {
    let active = true;
    Promise.all([fetchMyTransactions(), fetchWishlist()])
      .then(([transactions, wishlist]) => {
        if (!active) return;
        setPurchases(transactions.map(toPurchase));
        setWishlistCount(wishlist.length);
        setActiveTickets(
          transactions.filter(
            (row) => row.status === "paid" && row.check_in_status !== "checked_in",
          ).length,
        );
      })
      .catch(() => {
        // ringkasan tetap tampil dengan nilai default
      });
    return () => {
      active = false;
    };
  }, []);

  const totalSpent = purchases
    .filter((purchase) => purchase.status === "Selesai")
    .reduce((total, purchase) => total + purchase.totalValue, 0);
  const recentOrders = purchases.slice(0, 3);

  const fullName = authLoading ? "Memuat..." : user?.name ?? "-";
  const memberTier = user?.member_tier ?? "Silver Member";
  const memberSince = user?.member_since ?? "-";

  return (
    <>
      <PageHeading
        eyebrow="Akun Saya"
        title="Profil"
        description="Kelola data diri dan lihat ringkasan aktivitas akunmu."
        action={
          <Link
            href="/dashboard/pengaturan"
            className="inline-flex items-center gap-2 rounded-lg border border-purple-500 px-4 py-2.5 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/10"
          >
            Edit Profil
          </Link>
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section className="overflow-hidden rounded-2xl border border-white/5 bg-[#121422] lg:col-span-1">
          <div className="h-24 bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-700" />

          <div className="-mt-10 px-5 pb-5">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-[#121422] bg-gradient-to-br from-purple-500 to-fuchsia-600 text-2xl font-bold shadow-lg shadow-purple-950/40">
              {authLoading ? "…" : user?.initials ?? "?"}
            </span>

            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-600/10 px-3 py-1 text-[11px] font-medium text-purple-300">
              {memberTier}
            </span>

            <h2 className="mt-2 text-xl font-bold">{fullName}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-400">
              {user?.bio || "Belum ada bio."}
            </p>

            <div className="mt-4">
              <InfoRow label="Email" value={user?.email ?? "-"} />
              <InfoRow label="Telepon" value={user?.phone || "-"} />
              <InfoRow label="Domisili" value={user?.city || "-"} />
              <InfoRow label="Genre favorit" value={user?.favorite_genre || "-"} />
              <InfoRow label="Member sejak" value={memberSince} />
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-5 lg:col-span-2">
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/5 bg-[#121422] p-4">
              <p className="text-xs text-slate-400">Tiket Aktif</p>
              <p className="mt-1 text-2xl font-bold text-purple-400">{activeTickets}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#121422] p-4">
              <p className="text-xs text-slate-400">Wishlist</p>
              <p className="mt-1 text-2xl font-bold text-pink-400">{wishlistCount}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#121422] p-4">
              <p className="text-xs text-slate-400">Pembelian</p>
              <p className="mt-1 text-2xl font-bold text-amber-400">{purchases.length}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[#121422] p-4">
              <p className="text-xs text-slate-400">Pengeluaran</p>
              <p className="mt-1 truncate text-lg font-bold text-emerald-400">
                {new Intl.NumberFormat("id-ID", {
                  notation: "compact",
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 1,
                }).format(totalSpent)}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-white/5 bg-[#121422] p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Pesanan Terbaru</h2>
              <Link
                href="/dashboard/riwayat-pembelian"
                className="text-xs font-medium text-purple-400 transition hover:text-purple-300"
              >
                Lihat semua
              </Link>
            </div>

            <ul className="mt-4 divide-y divide-white/5">
              {recentOrders.length === 0 ? (
                <li className="py-4 text-sm text-slate-500">Belum ada pesanan.</li>
              ) : null}
              {recentOrders.map((order) => (
                <li key={order.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600/15 text-purple-300">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 9a3 3 0 0 0 0 6v3h20v-3a3 3 0 0 1 0-6V6H2z" />
                      <path d="M13 6v2m0 4v2m0 4v1" />
                    </svg>
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{order.concert}</p>
                    <p className="text-[11px] text-slate-500">
                      {order.id} · {order.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium">{order.totalPrice}</p>
                    <span
                      className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        statusTone[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link
              href="/dashboard/tiket-saya"
              className="rounded-xl border border-white/5 bg-[#121422] p-4 text-sm font-medium transition hover:border-purple-500/40 hover:bg-[#15182a]"
            >
              Tiket Saya
              <span className="mt-1 block text-xs text-slate-500">Lihat e-ticket aktif</span>
            </Link>
            <Link
              href="/dashboard/wishlist"
              className="rounded-xl border border-white/5 bg-[#121422] p-4 text-sm font-medium transition hover:border-purple-500/40 hover:bg-[#15182a]"
            >
              Wishlist
              <span className="mt-1 block text-xs text-slate-500">Konser incaranmu</span>
            </Link>
            <Link
              href="/dashboard/pengaturan"
              className="rounded-xl border border-white/5 bg-[#121422] p-4 text-sm font-medium transition hover:border-purple-500/40 hover:bg-[#15182a]"
            >
              Pengaturan
              <span className="mt-1 block text-xs text-slate-500">Notifikasi & privasi</span>
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}

export const profileSpentFormatter = formatRupiah;
