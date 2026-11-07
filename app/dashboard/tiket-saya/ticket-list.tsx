"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  fetchMyTransactions,
  toUserTicket,
  type TicketStatus,
  type UserTicketView,
} from "@/lib/customer";
import { Countdown } from "../countdown";
import { QrBlock } from "../ui";

type Filter = "Semua" | TicketStatus;

const filters: Filter[] = ["Semua", "Aktif", "Terpakai"];

type IconProps = { className?: string };

function Icon({ name, className }: IconProps & { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    download: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
    mapPin: <><path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></>,
    qr: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3v3h-3zM20 14h1M20 20h1M14 20h3" /></>,
    ticket: <><path d="M2 9a3 3 0 0 0 0 6v3h20v-3a3 3 0 0 1 0-6V6H2z" /><path d="M13 6v2m0 4v2m0 4v1" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

const CalendarIcon = (props: IconProps) => <Icon name="calendar" {...props} />;
const CloseIcon = (props: IconProps) => <Icon name="close" {...props} />;
const DownloadIcon = (props: IconProps) => <Icon name="download" {...props} />;
const MapPinIcon = (props: IconProps) => <Icon name="mapPin" {...props} />;
const QrIcon = (props: IconProps) => <Icon name="qr" {...props} />;
const TicketIcon = (props: IconProps) => <Icon name="ticket" {...props} />;

const statusTone: Record<TicketStatus, string> = {
  Aktif: "bg-emerald-500/10 text-emerald-400",
  Terpakai: "bg-slate-500/10 text-slate-400",
};

export function TicketList() {
  const [filter, setFilter] = useState<Filter>("Semua");
  const [selected, setSelected] = useState<UserTicketView | null>(null);
  const [myTickets, setMyTickets] = useState<UserTicketView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchMyTransactions()
      .then((rows) => {
        if (active) {
          const tickets = rows
            .filter((row) => row.status === "paid")
            .map(toUserTicket);
          setMyTickets(tickets);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Gagal memuat tiket.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const counts = useMemo(
    () => ({
      Semua: myTickets.length,
      Aktif: myTickets.filter((ticket) => ticket.status === "Aktif").length,
      Terpakai: myTickets.filter((ticket) => ticket.status === "Terpakai").length,
    }),
    [myTickets],
  );

  const rows = useMemo(
    () => myTickets.filter((ticket) => filter === "Semua" || ticket.status === filter),
    [filter, myTickets],
  );

  function downloadTicket(ticket: UserTicketView) {
    const lines = [
      "KONSERVIBE — E-TICKET",
      "=====================",
      `Konser     : ${ticket.title}`,
      `Kode Pesanan: ${ticket.orderId}`,
      `Tanggal    : ${ticket.date}`,
      `Lokasi     : ${ticket.venue}, ${ticket.city}`,
      `Kategori   : ${ticket.category}`,
      `Jumlah     : ${ticket.quantity} tiket`,
      `Total      : ${ticket.totalPrice}`,
      "=====================",
      "Tunjukkan e-ticket ini bersama identitas asli di gate.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `e-ticket-${ticket.orderId}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
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

      {error ? (
        <p className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="mt-5 grid grid-cols-1 gap-4">
        {loading ? (
          <div className="rounded-2xl border border-white/5 bg-[#121422] px-6 py-14 text-center text-sm text-slate-500">
            Memuat tiket...
          </div>
        ) : null}
        {rows.map((ticket) => (
          <article
            key={ticket.id}
            className="overflow-hidden rounded-2xl border border-white/5 bg-[#121422] transition hover:border-purple-500/30"
          >
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
              <div className="relative aspect-[3/2] w-full shrink-0 overflow-hidden rounded-xl sm:h-40 sm:w-28 sm:aspect-auto">
                <Image
                  src={ticket.poster}
                  alt={ticket.posterAlt}
                  fill
                  sizes="(min-width: 640px) 112px, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusTone[ticket.status]}`}
                  >
                    {ticket.status}
                  </span>
                  <span className="text-[11px] font-medium tracking-wider text-slate-500">
                    {ticket.orderId}
                  </span>
                </div>

                <h2 className="mt-2 truncate text-lg font-semibold">{ticket.title}</h2>
                <p className="truncate text-sm text-slate-400">{ticket.tourName}</p>

                <div className="mt-3 flex flex-col gap-1.5 text-sm text-slate-400">
                  <p className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 shrink-0 text-slate-500" />
                    {ticket.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 shrink-0 text-slate-500" />
                    <span className="truncate">
                      {ticket.venue}, {ticket.city}
                    </span>
                  </p>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/5 pt-4 sm:grid-cols-4">
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-slate-500">Kategori</dt>
                    <dd className="mt-0.5 text-sm font-medium">{ticket.category}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-slate-500">Jumlah</dt>
                    <dd className="mt-0.5 text-sm font-medium text-purple-400">
                      {ticket.quantity} tiket
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-slate-500">Area</dt>
                    <dd className="mt-0.5 text-sm font-medium">{ticket.seatLabel}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-slate-500">Total</dt>
                    <dd className="mt-0.5 text-sm font-medium">{ticket.totalPrice}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/5 bg-[#0f1122] p-4 sm:flex-row sm:items-center sm:px-5">
              {ticket.status === "Aktif" ? (
                <div className="sm:w-64">
                  <p className="mb-1.5 text-[10px] uppercase tracking-wider text-slate-500">
                    Mulai dalam
                  </p>
                  <Countdown target={ticket.startsAt} />
                </div>
              ) : (
                <p className="inline-flex items-center gap-2 text-xs text-slate-500">
                  <TicketIcon className="h-4 w-4" />
                  Tiket ini sudah digunakan di {ticket.gate}.
                </p>
              )}

              <div className="flex flex-wrap gap-2 sm:ml-auto">
                <Link
                  href={`/dashboard/tiket-saya/${encodeURIComponent(ticket.id)}`}
                  className="inline-flex items-center justify-center rounded-lg border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
                >
                  Detail
                </Link>
                {ticket.status === "Aktif" ? (
                  <button
                    type="button"
                    onClick={() => setSelected(ticket)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
                  >
                    <QrIcon className="h-4 w-4" />
                    Lihat E-Ticket
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => downloadTicket(ticket)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-purple-500 px-4 py-2.5 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/10"
                >
                  <DownloadIcon className="h-4 w-4" />
                  Unduh
                </button>
              </div>
            </div>
          </article>
        ))}

        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#121422] px-6 py-14 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/15 text-purple-300">
              <TicketIcon className="h-6 w-6" />
            </span>
            <p className="mt-4 text-sm font-medium">Belum ada tiket di kategori ini.</p>
            <p className="mt-1 text-xs text-slate-500">
              Yuk cari konser seru dan amankan tiketmu sekarang.
            </p>
          </div>
        ) : null}
      </div>

      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Tutup e-ticket"
            onClick={() => setSelected(null)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={`E-ticket ${selected.title}`}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#121422] shadow-2xl shadow-black/60"
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/5 p-5">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-slate-500">E-Ticket</p>
                <h2 className="mt-0.5 truncate text-lg font-semibold">{selected.title}</h2>
                <p className="truncate text-xs text-slate-500">{selected.orderId}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Tutup"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 p-5">
              {selected.qrCode ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.qrCode}
                  alt={`QR code e-ticket ${selected.title}`}
                  className="h-40 w-40 rounded-lg bg-white p-2"
                />
              ) : (
                <QrBlock value={selected.orderId} label={`QR code e-ticket ${selected.title}`} />
              )}

              <dl className="grid w-full grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-slate-500">Tanggal</dt>
                  <dd className="mt-0.5 font-medium">{selected.date}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-slate-500">Jumlah</dt>
                  <dd className="mt-0.5 font-medium text-purple-400">
                    {selected.quantity} tiket
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-slate-500">Area</dt>
                  <dd className="mt-0.5 font-medium">{selected.seatLabel}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-slate-500">Gate</dt>
                  <dd className="mt-0.5 font-medium">{selected.gate}</dd>
                </div>
              </dl>

              <p className="text-center text-[11px] leading-relaxed text-slate-500">
                Tunjukkan QR code ini ke petugas di gate. Jangan bagikan ke orang lain.
              </p>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
