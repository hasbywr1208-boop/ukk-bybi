import { api, formatDateID, formatRupiah } from "./api";

export type PurchaseStatus = "Selesai" | "Diproses" | "Dibatalkan";
export type TicketStatus = "Aktif" | "Terpakai";

export type TransactionRow = {
  id: string;
  user_id: string;
  event_id: string;
  ticket_id: string;
  promo_id: string | null;
  booking_code: string;
  quantity: number;
  unit_price: string;
  discount_amount: string;
  total_price: string;
  status: "pending" | "paid" | "cancelled" | "expired" | "refunded";
  payment_method: string | null;
  paid_at: string | null;
  expired_at: string | null;
  ticket_qr_code: string | null;
  check_in_status: "not_checked_in" | "checked_in";
  checked_in_at: string | null;
  created_at: string;
  event_title: string;
  event_date: string;
  event_start_time?: string;
  venue: string;
  city?: string;
  poster_url: string | null;
  category_name?: string;
  ticket_name: string;
  customer_name?: string;
  customer_email?: string;
};

export type EventRow = {
  id: string;
  title: string;
  description: string;
  venue: string;
  location: string;
  city: string;
  date: string;
  start_time: string;
  end_time: string;
  poster_url: string | null;
  banner_url: string | null;
  status: "draft" | "published" | "cancelled" | "completed";
  category_id: string;
  category_name: string;
  organizer_name: string;
  min_price: string | null;
};

export type WishlistRow = {
  id: string;
  title: string;
  poster: string;
  posterAlt: string;
  date: string;
  dateISO: string;
  startsAt: string;
  venue: string;
  city: string;
  genre: string;
  price: string;
  priceValue: number;
  status: string;
  addedAt: string;
  addedAtISO: string;
};

const FALLBACK_POSTER = "/posters/coldplay.svg";

export function purchaseStatus(status: TransactionRow["status"]): PurchaseStatus {
  if (status === "paid") return "Selesai";
  if (status === "pending") return "Diproses";
  return "Dibatalkan";
}

export function ticketStatus(row: TransactionRow): TicketStatus {
  return row.check_in_status === "checked_in" ? "Terpakai" : "Aktif";
}

export function transactionDateLabel(row: TransactionRow): string {
  return formatDateID(row.event_date);
}

export function transactionTime(row: TransactionRow): string {
  const time = row.event_start_time?.slice(0, 5);
  return time ? `${transactionDateLabel(row)}, ${time.replace(":", ".")} WIB` : transactionDateLabel(row);
}

export function startsAtISO(row: TransactionRow): string {
  const time = row.event_start_time?.slice(0, 5) ?? "00:00";
  return `${String(row.event_date).slice(0, 10)}T${time}:00+07:00`;
}

export function toPurchase(row: TransactionRow) {
  return {
    id: row.booking_code || row.id,
    transactionId: row.id,
    concert: row.event_title,
    date: transactionDateLabel(row),
    quantity: Number(row.quantity),
    totalPrice: formatRupiah(row.total_price),
    totalValue: Number(row.total_price),
    status: purchaseStatus(row.status),
    hasEticket: row.status === "paid",
    checkInStatus: row.check_in_status,
  };
}

export type PurchaseView = ReturnType<typeof toPurchase>;

export function toUserTicket(row: TransactionRow) {
  return {
    id: row.id,
    orderId: row.booking_code || row.id,
    title: row.event_title,
    tourName: row.category_name ? `${row.category_name} · ${row.ticket_name}` : row.ticket_name,
    poster: row.poster_url || FALLBACK_POSTER,
    posterAlt: `Poster ${row.event_title}`,
    date: transactionTime(row),
    startsAt: startsAtISO(row),
    venue: row.venue,
    city: row.city || "",
    category: row.ticket_name,
    quantity: Number(row.quantity),
    seatLabel: row.ticket_name,
    gate: "Gate Utama",
    totalPrice: formatRupiah(row.total_price),
    paymentMethod: row.payment_method || "-",
    status: ticketStatus(row),
    qrCode: row.ticket_qr_code || null,
    checkedInAt: row.checked_in_at,
  };
}

export type UserTicketView = ReturnType<typeof toUserTicket>;

export function eventStartsAt(row: EventRow): string {
  return `${String(row.date).slice(0, 10)}T${String(row.start_time).slice(0, 5)}:00+07:00`;
}

export function eventDateLabel(row: EventRow): string {
  return formatDateID(row.date);
}

export function eventPriceLabel(row: EventRow): string {
  const value = Number(row.min_price ?? 0);
  return value > 0 ? formatRupiah(value) : "Gratis";
}

export function eventToWishlistCard(row: EventRow) {
  return {
    id: row.id,
    title: row.title,
    poster: row.poster_url || FALLBACK_POSTER,
    posterAlt: `Poster ${row.title}`,
    date: eventDateLabel(row),
    startsAt: eventStartsAt(row),
    venue: row.venue,
    city: row.city,
    genre: row.category_name,
    price: eventPriceLabel(row),
    priceValue: Number(row.min_price ?? 0),
  };
}

export async function fetchMyTransactions(): Promise<TransactionRow[]> {
  return api.get<TransactionRow[]>("/transactions/mine");
}

export async function fetchWishlist(): Promise<WishlistRow[]> {
  return api.get<WishlistRow[]>("/wishlist");
}

export async function fetchPublishedEvents(limit = 12): Promise<EventRow[]> {
  return api.get<EventRow[]>(`/events?limit=${limit}`, { anonymous: true });
}
