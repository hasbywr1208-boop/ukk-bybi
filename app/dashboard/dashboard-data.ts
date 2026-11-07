export type PurchaseStatus = "Selesai" | "Diproses" | "Dibatalkan";

export type StatIconName = "ticket" | "calendar" | "bag" | "wallet";

export interface UserProfile {
  firstName: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  favoriteGenre: string;
  memberTier: string;
  memberSince: string;
  initials: string;
}

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  hint: string;
  icon: StatIconName;
  tone: "purple" | "emerald" | "amber" | "sky";
}

export interface UpcomingTicket {
  id: string;
  orderId: string;
  title: string;
  tourName: string;
  poster: string;
  posterAlt: string;
  date: string;
  /** ISO string, dipakai untuk hitung mundur. */
  startsAt: string;
  venue: string;
  city: string;
  category: string;
  quantity: number;
  seatLabel: string;
  gate: string;
  totalPrice: string;
  paymentMethod: string;
}

export interface TicketStep {
  id: string;
  label: string;
  done: boolean;
}

export interface RecommendedConcert {
  id: string;
  title: string;
  poster: string;
  posterAlt: string;
  date: string;
  venue: string;
  genre: string;
  price: string;
}

export interface Purchase {
  id: string;
  concert: string;
  date: string;
  quantity: number;
  totalPrice: string;
  status: PurchaseStatus;
  hasEticket: boolean;
}

export interface Notification {
  id: string;
  text: string;
  time: string;
  unread: boolean;
}

export const user: UserProfile = {
  firstName: "Chiara",
  fullName: "Chiara Anindya",
  email: "chiara@konservibe.id",
  phone: "+62 812 3456 7890",
  city: "Jakarta, Indonesia",
  bio: "Pecinta musik live yang selalu siap berburu tiket konser favorit bareng teman-teman.",
  favoriteGenre: "Pop & Indie",
  memberTier: "Gold Member",
  memberSince: "Januari 2025",
  initials: "CA",
};

export const stats: DashboardStat[] = [
  {
    id: "active-tickets",
    label: "Tiket Aktif",
    value: "2",
    hint: "siap dipakai",
    icon: "ticket",
    tone: "purple",
  },
  {
    id: "upcoming",
    label: "Konser Mendatang",
    value: "3",
    hint: "dalam 90 hari",
    icon: "calendar",
    tone: "sky",
  },
  {
    id: "orders",
    label: "Total Pembelian",
    value: "12",
    hint: "sejak bergabung",
    icon: "bag",
    tone: "amber",
  },
  {
    id: "spending",
    label: "Total Pengeluaran",
    value: "Rp3,4 jt",
    hint: "tahun ini",
    icon: "wallet",
    tone: "emerald",
  },
];

export const upcomingTicket: UpcomingTicket = {
  id: "tkt-coldplay-01",
  orderId: "KBE-240915-01",
  title: "Coldplay World Tour",
  tourName: "Music of the Spheres World Tour",
  poster: "/posters/coldplay.svg",
  posterAlt: "Poster Coldplay World Tour",
  date: "20 Des 2026, 19.30 WIB",
  startsAt: "2026-12-20T19:30:00+07:00",
  venue: "Jakarta International Stadium",
  city: "Jakarta",
  category: "Festival",
  quantity: 2,
  seatLabel: "Festival Gate 2",
  gate: "Gate 2",
  totalPrice: "Rp1.500.000",
  paymentMethod: "GoPay",
};

export const ticketSteps: TicketStep[] = [
  { id: "order", label: "Pesanan dibuat", done: true },
  { id: "payment", label: "Pembayaran berhasil", done: true },
  { id: "checkin", label: "Scan tiket di gate", done: false },
];

export type TicketStatus = "Aktif" | "Terpakai";

export interface UserTicket extends UpcomingTicket {
  status: TicketStatus;
}

export const myTickets: UserTicket[] = [
  { ...upcomingTicket, status: "Aktif" },
  {
    id: "tkt-taeyong-01",
    orderId: "KBE-241106-02",
    title: "Taeyong City Light Tour",
    tourName: "City Light Tour 2026",
    poster: "/posters/taeyong.svg",
    posterAlt: "Poster Taeyong City Light Tour",
    date: "6 Des 2026, 20.00 WIB",
    startsAt: "2026-12-06T20:00:00+07:00",
    venue: "JIS Hall",
    city: "Jakarta",
    category: "VIP",
    quantity: 1,
    seatLabel: "VIP A - Row 3",
    gate: "Gate 1",
    totalPrice: "Rp1.100.000",
    paymentMethod: "Virtual Account BCA",
    status: "Aktif",
  },
  {
    id: "tkt-niki-01",
    orderId: "KBE-240812-03",
    title: "NIKI Nicole World Tour",
    tourName: "Nicole World Tour",
    poster: "/posters/niki.svg",
    posterAlt: "Poster NIKI Nicole World Tour",
    date: "12 Agt 2026, 20.00 WIB",
    startsAt: "2026-08-12T20:00:00+07:00",
    venue: "Candi Prambanan",
    city: "Yogyakarta",
    category: "Regular",
    quantity: 2,
    seatLabel: "Regular Zone",
    gate: "Main Gate",
    totalPrice: "Rp1.100.000",
    paymentMethod: "QRIS",
    status: "Terpakai",
  },
];

export const recommendedConcerts: RecommendedConcert[] = [
  {
    id: "rec-lany-01",
    title: "LANY Soft world tour",
    poster: "/posters/lany.svg",
    posterAlt: "Poster LANY Soft World Tour",
    date: "29 - 30 Okt 2026",
    venue: "Istora Senayan, Jakarta",
    genre: "Indie Pop",
    price: "Rp500.000",
  },
  {
    id: "rec-niki-01",
    title: "NIKI Nicole world tour",
    poster: "/posters/niki.svg",
    posterAlt: "Poster NIKI Nicole World Tour",
    date: "12 Agustus 2026",
    venue: "Candi Prambanan, Yogyakarta",
    genre: "Pop",
    price: "Rp550.000",
  },
  {
    id: "rec-ariana-01",
    title: "Ariana Grande Summertime Ball",
    poster: "/posters/ariana.svg",
    posterAlt: "Poster Ariana Grande The Summertime Ball",
    date: "22 April 2026",
    venue: "New York Stadium",
    genre: "Pop",
    price: "Rp1.250.000",
  },
  {
    id: "rec-taeyong-01",
    title: "Taeyong City Light tour",
    poster: "/posters/taeyong.svg",
    posterAlt: "Poster Taeyong City Light Tour",
    date: "6 Desember 2026",
    venue: "JIS Hall, Jakarta",
    genre: "K-Pop",
    price: "Rp1.100.000",
  },
];

export interface WishlistItem extends RecommendedConcert {
  addedAt: string;
}

export const wishlistConcerts: WishlistItem[] = [
  { ...recommendedConcerts[0], addedAt: "2 hari lalu" },
  { ...recommendedConcerts[1], addedAt: "5 hari lalu" },
  { ...recommendedConcerts[3], addedAt: "1 minggu lalu" },
];

export const purchaseHistory: Purchase[] = [
  {
    id: "KBE-240915-01",
    concert: "Coldplay World Tour",
    date: "15 Okt 2026",
    quantity: 2,
    totalPrice: "Rp1.500.000",
    status: "Selesai",
    hasEticket: true,
  },
  {
    id: "KBE-240901-02",
    concert: "Lany",
    date: "29 Okt 2026",
    quantity: 1,
    totalPrice: "Rp500.000",
    status: "Selesai",
    hasEticket: true,
  },
  {
    id: "KBE-240828-03",
    concert: "Taeyong City Light",
    date: "6 Des 2026",
    quantity: 4,
    totalPrice: "Rp4.400.000",
    status: "Diproses",
    hasEticket: false,
  },
  {
    id: "KBE-240712-04",
    concert: "NIKI Nicole world tour",
    date: "12 Agt 2026",
    quantity: 2,
    totalPrice: "Rp1.100.000",
    status: "Dibatalkan",
    hasEticket: false,
  },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    text: "E-ticket Coldplay siap diunduh",
    time: "5 menit lalu",
    unread: true,
  },
  {
    id: "n2",
    text: "Tiket LANY kurang dari 8% tersisa",
    time: "2 jam lalu",
    unread: true,
  },
  {
    id: "n3",
    text: "Pembayaran KBE-240828-03 diproses",
    time: "1 hari lalu",
    unread: false,
  },
];