import type {
  CheckInStatus,
  OrderStatus,
  OrganizerConcertStatus,
  PromoStatus,
  SeatLayoutStatus,
  TicketTypeStatus,
  WithdrawalStatus,
} from "./organizer-data";

export { Card, EmptyState, Pill, ProgressBar, StatCard } from "../superadmin/ui";

export const concertStatusStyles: Record<OrganizerConcertStatus, string> = {
  Aktif: "bg-emerald-500/10 text-emerald-400",
  Draft: "bg-amber-500/10 text-amber-400",
  Selesai: "bg-sky-500/10 text-sky-300",
  Dibatalkan: "bg-rose-500/10 text-rose-400",
};

export const ticketStatusStyles: Record<TicketTypeStatus, string> = {
  Aktif: "bg-emerald-500/10 text-emerald-400",
  Nonaktif: "bg-slate-500/10 text-slate-400",
  Habis: "bg-amber-500/10 text-amber-400",
};

export const seatStatusStyles: Record<SeatLayoutStatus, string> = {
  Aktif: "bg-emerald-500/10 text-emerald-400",
  Draft: "bg-amber-500/10 text-amber-400",
};

export const checkInStatusStyles: Record<CheckInStatus, string> = {
  Valid: "bg-emerald-500/10 text-emerald-400",
  Duplikat: "bg-amber-500/10 text-amber-400",
  "Tidak valid": "bg-rose-500/10 text-rose-400",
};

export const promoStatusStyles: Record<PromoStatus, string> = {
  Aktif: "bg-emerald-500/10 text-emerald-400",
  Berakhir: "bg-slate-500/10 text-slate-400",
  Dijadwalkan: "bg-sky-500/10 text-sky-300",
};

export const orderStatusStyles: Record<OrderStatus, string> = {
  Dibayar: "bg-emerald-500/10 text-emerald-400",
  Pending: "bg-amber-500/10 text-amber-400",
  Cancel: "bg-rose-500/10 text-rose-400",
  Refund: "bg-sky-500/10 text-sky-300",
};

export const withdrawalStatusStyles: Record<WithdrawalStatus, string> = {
  Diproses: "bg-amber-500/10 text-amber-400",
  Berhasil: "bg-emerald-500/10 text-emerald-400",
  Ditolak: "bg-rose-500/10 text-rose-400",
};
