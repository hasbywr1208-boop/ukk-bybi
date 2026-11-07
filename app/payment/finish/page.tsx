"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { api } from "@/lib/api";

type PaymentStatus = {
  status: "pending" | "paid" | "cancelled" | "expired" | "refunded";
  paid_at: string | null;
};

const statusCopy: Record<PaymentStatus["status"], { title: string; detail: string }> = {
  pending: {
    title: "Pembayaran sedang diproses",
    detail: "Status belum terkonfirmasi. Periksa kembali beberapa saat lagi.",
  },
  paid: {
    title: "Pembayaran berhasil",
    detail: "E-ticket sudah tersedia di halaman Tiket Saya.",
  },
  cancelled: {
    title: "Pembayaran dibatalkan",
    detail: "Transaksi tidak selesai. Kamu dapat memilih event dan mencoba kembali.",
  },
  expired: {
    title: "Waktu pembayaran berakhir",
    detail: "Masa pembayaran transaksi ini sudah habis.",
  },
  refunded: {
    title: "Transaksi dikembalikan",
    detail: "Status pengembalian dana tercatat pada transaksi ini.",
  },
};

export default function PaymentFinishPage() {
  const router = useRouter();
  const [status, setStatus] = useState<PaymentStatus["status"] | null>(null);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(() => {
        const transactionId = new URLSearchParams(window.location.search).get("transaction_id");
        if (!transactionId) throw new Error("ID transaksi tidak ditemukan.");
        return api.get<PaymentStatus>(`/payments/status/${encodeURIComponent(transactionId)}`);
      })
      .then((result) => {
        if (active) setStatus(result.status);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Status pembayaran belum dapat diperiksa.");
        }
      })
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function recheckStatus() {
    const transactionId = new URLSearchParams(window.location.search).get("transaction_id");
    if (!transactionId) {
      setError("ID transaksi tidak ditemukan.");
      return;
    }

    setChecking(true);
    setError("");
    try {
      const result = await api.get<PaymentStatus>(`/payments/status/${encodeURIComponent(transactionId)}`);
      setStatus(result.status);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Status pembayaran belum dapat diperiksa.");
    } finally {
      setChecking(false);
    }
  }

  const copy = status ? statusCopy[status] : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0714] px-5 text-white">
      <section className="w-full max-w-lg border border-white/10 bg-white/[0.03] p-7 sm:p-10">
        <Link href="/" className="text-xs font-extrabold tracking-[0.2em] text-gray-400">KONSERVIBE</Link>
        <div className="mt-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-300">Status pembayaran</p>
          <h1 className="mt-3 text-2xl font-extrabold">{checking ? "Memeriksa pembayaran..." : copy?.title ?? "Status belum tersedia"}</h1>
          <p className="mt-3 text-sm leading-6 text-gray-400">
            {error || copy?.detail || "Pastikan kamu masuk dengan akun yang digunakan saat checkout."}
          </p>
        </div>

        {status === "pending" && !checking && (
          <button
            type="button"
            onClick={recheckStatus}
            className="mt-6 border border-white/20 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
          >
            Periksa status lagi
          </button>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {status === "paid" ? (
            <button
              type="button"
              onClick={() => {
                const transactionId = new URLSearchParams(window.location.search).get("transaction_id");
                if (transactionId) router.push(`/dashboard/tiket-saya/${encodeURIComponent(transactionId)}`);
              }}
              className="bg-pink-500 px-5 py-3 text-sm font-bold transition hover:bg-pink-600"
            >
              Lihat Detail E-Ticket
            </button>
          ) : (
            <Link href="/dashboard/riwayat-pembelian" className="border border-white/20 px-5 py-3 text-sm font-semibold transition hover:bg-white/10">
              Lihat riwayat pembelian
            </Link>
          )}
          <Link href="/#konser" className="px-5 py-3 text-sm font-semibold text-gray-300 transition hover:text-white">
            Kembali ke konser
          </Link>
        </div>
      </section>
    </main>
  );
}