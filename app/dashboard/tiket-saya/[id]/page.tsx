"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { api, formatDateID, formatRupiah } from "@/lib/api";

type TicketDetail = {
  id: string;
  booking_code: string;
  quantity: number;
  total_price: number | string;
  status: "pending" | "paid" | "cancelled" | "expired" | "refunded";
  payment_method: string | null;
  paid_at: string | null;
  ticket_qr_code: string | null;
  check_in_status: "not_checked_in" | "checked_in";
  event_title: string;
  event_date: string;
  start_time: string;
  venue: string;
  location: string;
  city: string;
  poster_url: string | null;
  ticket_name: string;
  customer_name: string;
};

const statusLabels: Record<TicketDetail["status"], string> = {
  pending: "Menunggu pembayaran",
  paid: "Lunas",
  cancelled: "Dibatalkan",
  expired: "Kedaluwarsa",
  refunded: "Dikembalikan",
};

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get<TicketDetail>(`/transactions/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then((result) => setTicket(result))
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(requestError instanceof Error ? requestError.message : "Gagal memuat detail tiket.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  async function continuePayment() {
    setPaying(true);
    setError("");
    try {
      const payment = await api.post<{ redirect_url: string }>("/payments", {
        transaction_id: id,
      });
      window.location.assign(payment.redirect_url);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Tidak dapat membuka pembayaran.");
      setPaying(false);
    }
  }

  if (loading) {
    return <p className="py-16 text-center text-sm text-slate-400">Memuat detail tiket...</p>;
  }

  if (error && !ticket) {
    return (
      <section className="mx-auto max-w-xl py-12 text-center">
        <p role="alert" className="text-sm text-rose-300">{error}</p>
        <Link href="/dashboard/tiket-saya" className="mt-5 inline-block text-sm font-semibold text-purple-300">Kembali ke Tiket Saya</Link>
      </section>
    );
  }

  if (!ticket) return null;

  const isPaid = ticket.status === "paid";

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard/tiket-saya" className="text-sm text-slate-400 transition hover:text-white">&larr; Tiket Saya</Link>

      <header className="mt-6 flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-300">Detail E-Ticket</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{ticket.event_title}</h1>
          <p className="mt-2 text-sm text-slate-400">Kode booking: <span className="font-semibold text-white">{ticket.booking_code}</span></p>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${isPaid ? "bg-emerald-500/10 text-emerald-300" : "bg-amber-500/10 text-amber-300"}`}>
          {statusLabels[ticket.status]}
        </span>
      </header>

      <div className="grid gap-8 py-7 md:grid-cols-[minmax(0,1fr)_250px]">
        <section className="space-y-6">
          <div className="grid gap-5 border-b border-white/10 pb-6 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Tanggal & waktu</p>
              <p className="mt-2 font-semibold">{formatDateID(ticket.event_date)}</p>
              <p className="mt-1 text-sm text-slate-400">{String(ticket.start_time).slice(0, 5)} WIB</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Lokasi</p>
              <p className="mt-2 font-semibold">{ticket.venue}</p>
              <p className="mt-1 text-sm text-slate-400">{ticket.location}, {ticket.city}</p>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">Jenis tiket</dt>
              <dd className="mt-1 font-semibold">{ticket.ticket_name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">Jumlah</dt>
              <dd className="mt-1 font-semibold">{ticket.quantity} tiket</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">Total</dt>
              <dd className="mt-1 font-semibold">{formatRupiah(ticket.total_price)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">Pemilik tiket</dt>
              <dd className="mt-1 font-semibold">{ticket.customer_name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">Pembayaran</dt>
              <dd className="mt-1 font-semibold">{ticket.payment_method || "-"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">Status masuk</dt>
              <dd className="mt-1 font-semibold">{ticket.check_in_status === "checked_in" ? "Sudah digunakan" : "Belum digunakan"}</dd>
            </div>
          </dl>

          {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
          {ticket.status === "pending" && (
            <button
              type="button"
              onClick={continuePayment}
              disabled={paying}
              className="bg-purple-600 px-5 py-3 text-sm font-semibold transition hover:bg-purple-500 disabled:opacity-60"
            >
              {paying ? "Membuka pembayaran..." : "Lanjutkan pembayaran QRIS"}
            </button>
          )}
        </section>

        <aside className="flex flex-col items-center border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pl-7 md:pt-0">
          {isPaid && ticket.ticket_qr_code ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Tiket aktif</p>
              {/* QR image is generated by the backend after Midtrans confirms payment. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ticket.ticket_qr_code}
                alt={`QR e-ticket ${ticket.booking_code}`}
                className="mt-4 h-48 w-48 rounded-lg bg-white p-2"
              />
              <p className="mt-4 text-center text-xs leading-5 text-slate-400">Tunjukkan QR ini kepada petugas saat check-in. Jangan bagikan kepada orang lain.</p>
            </>
          ) : isPaid ? (
            <div className="py-8 text-center">
              <p className="font-semibold">QR tiket sedang disiapkan</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">Muat ulang halaman beberapa saat lagi untuk mengambil QR dari backend.</p>
              <button type="button" onClick={() => window.location.reload()} className="mt-4 text-sm font-semibold text-purple-300 hover:text-purple-200">Muat ulang</button>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="font-semibold">QR tiket belum aktif</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">QR e-ticket dibuat backend setelah pembayaran Midtrans berhasil.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}