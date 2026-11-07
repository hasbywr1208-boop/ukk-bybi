"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { api, formatDateID, formatRupiah, type PublicEvent } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type EventTicket = {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  quantity: number;
  sold: number;
  max_per_order: number;
};

type EventDetail = PublicEvent & {
  terms_conditions: string | null;
  refund_policy: string | null;
  tickets: EventTicket[];
};

type CheckoutResult = {
  transaction_id: string;
  booking_code: string;
  total_price: number;
};

type PaymentResult = {
  snap_token: string;
  redirect_url: string;
  snap_script_url: string;
  client_key: string | null;
};

type SnapCallbacks = {
  onSuccess: () => void;
  onPending: () => void;
  onError: () => void;
  onClose: () => void;
};

declare global {
  interface Window {
    snap?: {
      pay: (snapToken: string, callbacks: SnapCallbacks) => void;
    };
  }
}

let snapScriptPromise: Promise<void> | null = null;

function loadSnapScript(scriptUrl: string, clientKey: string): Promise<void> {
  if (window.snap) return Promise.resolve();
  if (!snapScriptPromise) {
    snapScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = scriptUrl;
      script.async = true;
      script.dataset.clientKey = clientKey;
      script.onload = () => resolve();
      script.onerror = () => {
        snapScriptPromise = null;
        reject(new Error("Checkout Midtrans gagal dimuat. Periksa koneksi lalu coba lagi."));
      };
      document.head.appendChild(script);
    });
  }
  return snapScriptPromise;
}

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [paymentNotice, setPaymentNotice] = useState("");
  const [pendingTransactionId, setPendingTransactionId] = useState<string | null>(null);
  const [paymentSession, setPaymentSession] = useState<PaymentResult | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get<EventDetail>(`/events/${encodeURIComponent(id)}`, {
        anonymous: true,
        signal: controller.signal,
      })
      .then((result) => setEvent(result))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setLoadError(error instanceof Error ? error.message : "Gagal memuat detail event.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  const availableTickets = (event?.tickets ?? []).filter(
    (ticket) => Number(ticket.quantity) > Number(ticket.sold),
  );
  const selectedTicket =
    availableTickets.find((ticket) => ticket.id === ticketId) ?? availableTickets[0];
  const remaining = selectedTicket
    ? Number(selectedTicket.quantity) - Number(selectedTicket.sold)
    : 0;
  const maxQuantity = selectedTicket
    ? Math.min(Number(selectedTicket.max_per_order) || 10, remaining)
    : 1;

  async function handleCheckout() {
    if (!selectedTicket || !event) return;
    setCheckoutError("");
    setPaymentNotice("");

    if (!user) {
      const next = `/konser/${encodeURIComponent(id)}`;
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    setCheckoutBusy(true);
    try {
      let transactionId = pendingTransactionId;
      if (!transactionId) {
        const transaction = await api.post<CheckoutResult>("/transactions/checkout", {
          ticket_id: selectedTicket.id,
          quantity,
        });
        transactionId = transaction.transaction_id;
        setPendingTransactionId(transactionId);
      }
      let session = paymentSession;
      if (!session) {
        session = await api.post<PaymentResult>("/payments", {
          transaction_id: transactionId,
        });
        setPaymentSession(session);
      }

      if (!session.client_key) {
        window.location.assign(session.redirect_url);
        return;
      }

      await loadSnapScript(session.snap_script_url, session.client_key);
      if (!window.snap) throw new Error("Checkout Midtrans tidak tersedia. Silakan coba lagi.");

      const finishUrl = `/payment/finish?transaction_id=${encodeURIComponent(transactionId)}`;
      window.snap.pay(session.snap_token, {
        onSuccess: () => window.location.assign(finishUrl),
        onPending: () => {
          setCheckoutBusy(false);
          setPaymentNotice("Pembayaran QRIS menunggu konfirmasi. Selesaikan pemindaian QR di checkout Midtrans.");
        },
        onError: () => {
          setCheckoutBusy(false);
          setCheckoutError("Pembayaran gagal diproses oleh Midtrans. Kamu bisa membuka QRIS lagi.");
        },
        onClose: () => {
          setCheckoutBusy(false);
          setPaymentNotice("Checkout ditutup. QRIS masih bisa dibuka kembali selama sesi pembayaran aktif.");
        },
      });
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Checkout gagal. Silakan coba lagi.");
      setCheckoutBusy(false);
    }
  }

  if (loading || authLoading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#0A0714] text-sm text-gray-300">Memuat event...</main>;
  }

  if (loadError || !event) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0A0714] px-5 text-center text-white">
        <p role="alert" className="text-gray-300">{loadError || "Event tidak ditemukan."}</p>
        <Link href="/#konser" className="text-sm font-semibold text-pink-400 hover:text-pink-300">Kembali ke konser</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0714] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 lg:px-8">
          <Link href="/" className="text-sm font-extrabold tracking-[0.2em]">KONSERVIBE</Link>
          <Link href="/#konser" className="text-sm text-gray-300 transition hover:text-white">Semua konser</Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-12">
        <div
          className="relative flex min-h-72 items-end overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-800 via-indigo-900 to-slate-950 bg-cover bg-center p-6 sm:min-h-96 sm:p-10"
          style={event.banner_url || event.poster_url ? {
            backgroundImage: `linear-gradient(0deg, rgba(10,7,20,.92), rgba(10,7,20,.08)), url("${event.banner_url || event.poster_url}")`,
          } : undefined}
        >
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-300">{event.category_name}</p>
            <h1 className="mt-3 text-3xl font-extrabold sm:text-5xl">{event.title}</h1>
            <p className="mt-3 text-sm text-gray-200">Diselenggarakan oleh {event.organizer_name}</p>
          </div>
        </div>

        <div className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-10">
          <section className="space-y-8">
            <div className="grid gap-5 border-b border-white/10 pb-7 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">Tanggal & waktu</p>
                <p className="mt-2 font-semibold">{formatDateID(event.date)}</p>
                <p className="mt-1 text-sm text-gray-400">{String(event.start_time).slice(0, 5)} WIB</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">Lokasi</p>
                <p className="mt-2 font-semibold">{event.venue}</p>
                <p className="mt-1 text-sm text-gray-400">{event.location}, {event.city}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold">Tentang event</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-300">{event.description}</p>
            </div>

            {event.terms_conditions && (
              <div>
                <h2 className="text-lg font-bold">Syarat & ketentuan</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-300">{event.terms_conditions}</p>
              </div>
            )}
            {event.refund_policy && (
              <div>
                <h2 className="text-lg font-bold">Kebijakan refund</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-300">{event.refund_policy}</p>
              </div>
            )}
          </section>

          <aside className="h-fit border-t border-white/10 pt-6 lg:sticky lg:top-8 lg:border-t-0 lg:pt-0">
            <h2 className="text-lg font-bold">Pilih tiket</h2>
            {availableTickets.length === 0 ? (
              <p className="mt-5 rounded-lg border border-white/10 p-4 text-sm text-gray-400">Tiket untuk event ini belum tersedia.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {availableTickets.map((ticket) => (
                  <label key={ticket.id} className={`block cursor-pointer border p-4 transition ${selectedTicket?.id === ticket.id ? "border-pink-400 bg-pink-500/10" : "border-white/10 hover:border-white/25"}`}>
                    <span className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="ticket"
                        value={ticket.id}
                        checked={selectedTicket?.id === ticket.id}
                        disabled={Boolean(pendingTransactionId)}
                        onChange={() => {
                          setTicketId(ticket.id);
                          setQuantity(1);
                        }}
                        className="mt-1 accent-pink-500"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex justify-between gap-3 font-semibold">
                          <span>{ticket.name}</span>
                          <span className="shrink-0">{formatRupiah(ticket.price)}</span>
                        </span>
                        {ticket.description && <span className="mt-1 block text-sm text-gray-400">{ticket.description}</span>}
                        <span className="mt-2 block text-xs text-gray-500">Sisa {Number(ticket.quantity) - Number(ticket.sold)} tiket</span>
                      </span>
                    </span>
                  </label>
                ))}

                {selectedTicket && (
                  <>
                    <div className="flex items-center justify-between border-b border-white/10 py-4">
                      <label htmlFor="ticket-quantity" className="text-sm text-gray-300">Jumlah tiket</label>
                      <input
                        id="ticket-quantity"
                        type="number"
                        min={1}
                        max={maxQuantity}
                        step={1}
                        value={quantity}
                        disabled={Boolean(pendingTransactionId)}
                        onChange={(inputEvent) => {
                          const nextQuantity = Number(inputEvent.target.value);
                          setQuantity(Math.max(1, Math.min(maxQuantity, Math.floor(nextQuantity) || 1)));
                        }}
                        className="w-20 border border-white/15 bg-transparent px-3 py-2 text-center"
                      />
                    </div>
                    <div className="flex justify-between py-2 font-bold">
                      <span>Total</span>
                      <span>{formatRupiah(Number(selectedTicket.price) * quantity)}</span>
                    </div>
                    {checkoutError && <p role="alert" className="text-sm text-rose-300">{checkoutError}</p>}
                    {paymentNotice && <p role="status" className="text-sm text-sky-200">{paymentNotice}</p>}
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={checkoutBusy}
                      className="w-full bg-pink-500 px-5 py-3 text-sm font-bold transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {checkoutBusy
                        ? "Menyiapkan pembayaran..."
                        : !user
                          ? "Masuk untuk membeli"
                          : paymentSession
                            ? "Buka QRIS Midtrans lagi"
                            : "Lanjutkan pembayaran"}
                    </button>
                    <p className="text-center text-xs text-gray-500">QRIS dibuat oleh Midtrans dan dapat dipindai melalui aplikasi pembayaran yang mendukung QRIS.</p>
                  </>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}