export type OrganizerConcertStatus = "Aktif" | "Draft" | "Selesai" | "Dibatalkan";
export type TicketTypeStatus = "Aktif" | "Nonaktif" | "Habis";
export type SeatLayoutStatus = "Aktif" | "Draft";
export type CheckInStatus = "Valid" | "Duplikat" | "Tidak valid";
export type PromoStatus = "Aktif" | "Berakhir" | "Dijadwalkan";
export type OrderStatus = "Dibayar" | "Pending" | "Cancel" | "Refund";
export type WithdrawalStatus = "Diproses" | "Berhasil" | "Ditolak";

export interface ChartPoint {
  label: string;
  value: number;
}

export interface ShareItem {
  label: string;
  value: number;
  color: string;
}

export interface OrganizerConcert {
  id: string;
  title: string;
  poster: string;
  venue: string;
  city: string;
  date: string;
  dateISO: string;
  time: string;
  category: string;
  status: OrganizerConcertStatus;
  ticketsSold: number;
  capacity: number;
  revenue: number;
  checkIns: number;
}

export interface TicketType {
  id: string;
  concertId: string;
  concert: string;
  name: string;
  description: string;
  price: number;
  quota: number;
  sold: number;
  status: TicketTypeStatus;
  color: string;
}

export interface SeatSection {
  id: string;
  name: string;
  rows: number;
  seatsPerRow: number;
  price: number;
  color: string;
}

export interface SeatLayout {
  id: string;
  name: string;
  concert: string;
  venue: string;
  status: SeatLayoutStatus;
  updatedAt: string;
  sections: SeatSection[];
}

export interface CheckInRecord {
  id: string;
  code: string;
  holder: string;
  concert: string;
  ticketType: string;
  gate: string;
  time: string;
  status: CheckInStatus;
}

export interface Promo {
  id: string;
  code: string;
  concert: string;
  type: "Persentase" | "Nominal";
  value: number;
  minSpend: number;
  quota: number;
  used: number;
  validUntil: string;
  status: PromoStatus;
}

export interface OrganizerOrder {
  id: string;
  buyer: string;
  email: string;
  concert: string;
  ticketType: string;
  qty: number;
  total: number;
  status: OrderStatus;
  date: string;
  method: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  fee: number;
  net: number;
  method: string;
  account: string;
  status: WithdrawalStatus;
  date: string;
}

export interface OrganizerNotification {
  id: string;
  text: string;
  time: string;
  unread: boolean;
  tone: "info" | "warning" | "success";
}

export const organizerProfile = {
  companyName: "Euphoria Live",
  picName: "Nadia Putri",
  email: "nadia@euphorialive.id",
  phone: "+62 811 2233 4455",
  city: "Jakarta",
  address: "Jl. Sudirman Kav. 52-53, SCBD, Jakarta Selatan",
  instagram: "@euphorialive.id",
  website: "https://euphorialive.id",
  bio: "Promotor konser musik nasional dan internasional dengan pengalaman lebih dari 8 tahun. Fokus pada pengalaman live music yang premium dan aman.",
  initials: "EL",
  verified: true,
  memberSince: "12 Jan 2025",
  npwp: "01.234.567.8-901.000",
  bankName: "Bank Central Asia (BCA)",
  bankAccount: "1234567890",
  accountName: "PT Euphoria Live Indonesia",
};

export const organizerConcerts: OrganizerConcert[] = [
  {
    id: "KNS-001",
    title: "Coldplay World Tour",
    poster: "/posters/coldplay.svg",
    venue: "Jakarta International Stadium",
    city: "Jakarta",
    date: "20 Des 2026",
    dateISO: "2026-12-20",
    time: "19:30 WIB",
    category: "Pop / Rock",
    status: "Aktif",
    ticketsSold: 38_400,
    capacity: 45_000,
    revenue: 31_050_000_000,
    checkIns: 35_200,
  },
  {
    id: "KNS-002",
    title: "Taeyong City Light Tour",
    poster: "/posters/taeyong.svg",
    venue: "JIS Hall",
    city: "Jakarta",
    date: "6 Des 2026",
    dateISO: "2026-12-06",
    time: "18:00 WIB",
    category: "K-Pop",
    status: "Aktif",
    ticketsSold: 7_200,
    capacity: 8_000,
    revenue: 6_847_500_000,
    checkIns: 6_700,
  },
  {
    id: "KNS-003",
    title: "K-Pop Nation",
    poster: "/posters/ariana.svg",
    venue: "Indonesia Arena",
    city: "Jakarta",
    date: "18 Feb 2027",
    dateISO: "2027-02-18",
    time: "17:00 WIB",
    category: "K-Pop",
    status: "Draft",
    ticketsSold: 0,
    capacity: 20_000,
    revenue: 0,
    checkIns: 0,
  },
  {
    id: "KNS-004",
    title: "Jazz Night 2026",
    poster: "/posters/niki.svg",
    venue: "Plenary Hall",
    city: "Jakarta",
    date: "12 Okt 2026",
    dateISO: "2026-10-12",
    time: "20:00 WIB",
    category: "Jazz",
    status: "Selesai",
    ticketsSold: 4_800,
    capacity: 5_000,
    revenue: 2_400_000_000,
    checkIns: 4_650,
  },
  {
    id: "KNS-005",
    title: "Indie Weekend",
    poster: "/posters/lany.svg",
    venue: "Kota Lama",
    city: "Semarang",
    date: "22 Nov 2026",
    dateISO: "2026-11-22",
    time: "16:00 WIB",
    category: "Indie",
    status: "Aktif",
    ticketsSold: 3_200,
    capacity: 4_000,
    revenue: 940_000_000,
    checkIns: 0,
  },
];

export const ticketTypes: TicketType[] = [
  { id: "TT-01", concertId: "KNS-001", concert: "Coldplay World Tour", name: "VIP", description: "Front row + merchandise eksklusif", price: 1_500_000, quota: 3_000, sold: 2_900, status: "Aktif", color: "#8b5cf6" },
  { id: "TT-02", concertId: "KNS-001", concert: "Coldplay World Tour", name: "CAT 1", description: "Tribun utama dekat panggung", price: 1_000_000, quota: 12_000, sold: 11_200, status: "Aktif", color: "#22d3ee" },
  { id: "TT-03", concertId: "KNS-001", concert: "Coldplay World Tour", name: "CAT 2", description: "Tribun samping dengan view luas", price: 750_000, quota: 15_000, sold: 13_400, status: "Aktif", color: "#f472b6" },
  { id: "TT-04", concertId: "KNS-001", concert: "Coldplay World Tour", name: "Festival", description: "Area berdiri di depan panggung", price: 500_000, quota: 15_000, sold: 10_900, status: "Aktif", color: "#f59e0b" },
  { id: "TT-05", concertId: "KNS-002", concert: "Taeyong City Light Tour", name: "VIP", description: "Soundcheck access + photocard", price: 1_500_000, quota: 1_000, sold: 980, status: "Aktif", color: "#8b5cf6" },
  { id: "TT-06", concertId: "KNS-002", concert: "Taeyong City Light Tour", name: "CAT 1", description: "Seating area utama", price: 1_000_000, quota: 3_000, sold: 2_850, status: "Aktif", color: "#22d3ee" },
  { id: "TT-07", concertId: "KNS-002", concert: "Taeyong City Light Tour", name: "CAT 2", description: "Seating area reguler", price: 750_000, quota: 4_000, sold: 3_370, status: "Aktif", color: "#f472b6" },
  { id: "TT-08", concertId: "KNS-003", concert: "K-Pop Nation", name: "VIP", description: "Meet & greet + merchandise", price: 1_500_000, quota: 2_000, sold: 0, status: "Nonaktif", color: "#8b5cf6" },
  { id: "TT-09", concertId: "KNS-003", concert: "K-Pop Nation", name: "CAT 1", description: "Seating area utama", price: 1_000_000, quota: 8_000, sold: 0, status: "Nonaktif", color: "#22d3ee" },
  { id: "TT-10", concertId: "KNS-003", concert: "K-Pop Nation", name: "CAT 2", description: "Seating area reguler", price: 750_000, quota: 10_000, sold: 0, status: "Nonaktif", color: "#f472b6" },
  { id: "TT-11", concertId: "KNS-004", concert: "Jazz Night 2026", name: "Festival", description: "Open seating dengan dinner", price: 500_000, quota: 5_000, sold: 4_800, status: "Habis", color: "#f59e0b" },
  { id: "TT-12", concertId: "KNS-005", concert: "Indie Weekend", name: "Presale", description: "Harga khusus pembelian awal", price: 250_000, quota: 2_000, sold: 1_800, status: "Aktif", color: "#22d3ee" },
  { id: "TT-13", concertId: "KNS-005", concert: "Indie Weekend", name: "Regular", description: "Tiket reguler festival", price: 350_000, quota: 2_000, sold: 1_400, status: "Aktif", color: "#8b5cf6" },
];

export const seatLayouts: SeatLayout[] = [
  {
    id: "SL-01",
    name: "JIS Stadium - Coldplay",
    concert: "Coldplay World Tour",
    venue: "Jakarta International Stadium",
    status: "Aktif",
    updatedAt: "2 hari lalu",
    sections: [
      { id: "SC-01", name: "VIP A", rows: 4, seatsPerRow: 20, price: 1_500_000, color: "#8b5cf6" },
      { id: "SC-02", name: "CAT 1", rows: 6, seatsPerRow: 24, price: 1_000_000, color: "#22d3ee" },
      { id: "SC-03", name: "CAT 2", rows: 8, seatsPerRow: 30, price: 750_000, color: "#f472b6" },
      { id: "SC-04", name: "Festival", rows: 10, seatsPerRow: 40, price: 500_000, color: "#f59e0b" },
    ],
  },
  {
    id: "SL-02",
    name: "JIS Hall - Taeyong",
    concert: "Taeyong City Light Tour",
    venue: "JIS Hall",
    status: "Aktif",
    updatedAt: "5 hari lalu",
    sections: [
      { id: "SC-05", name: "VIP", rows: 3, seatsPerRow: 12, price: 1_500_000, color: "#8b5cf6" },
      { id: "SC-06", name: "CAT 1", rows: 5, seatsPerRow: 16, price: 1_000_000, color: "#22d3ee" },
      { id: "SC-07", name: "CAT 2", rows: 6, seatsPerRow: 18, price: 750_000, color: "#f472b6" },
    ],
  },
  {
    id: "SL-03",
    name: "Indonesia Arena - K-Pop Nation",
    concert: "K-Pop Nation",
    venue: "Indonesia Arena",
    status: "Draft",
    updatedAt: "1 jam lalu",
    sections: [
      { id: "SC-08", name: "VIP", rows: 4, seatsPerRow: 14, price: 1_500_000, color: "#8b5cf6" },
      { id: "SC-09", name: "CAT 1", rows: 6, seatsPerRow: 18, price: 1_000_000, color: "#22d3ee" },
      { id: "SC-10", name: "CAT 2", rows: 8, seatsPerRow: 22, price: 750_000, color: "#f472b6" },
    ],
  },
];

export const checkInRecords: CheckInRecord[] = [
  { id: "CI-01", code: "TKT-CP-8821", holder: "Chiara Anindya", concert: "Coldplay World Tour", ticketType: "VIP", gate: "Gate A", time: "18:42", status: "Valid" },
  { id: "CI-02", code: "TKT-CP-8822", holder: "Bagas Saputra", concert: "Coldplay World Tour", ticketType: "CAT 1", gate: "Gate B", time: "18:45", status: "Valid" },
  { id: "CI-03", code: "TKT-CP-8823", holder: "Kirana Larasati", concert: "Coldplay World Tour", ticketType: "CAT 1", gate: "Gate A", time: "18:47", status: "Valid" },
  { id: "CI-04", code: "TKT-CP-8821", holder: "Chiara Anindya", concert: "Coldplay World Tour", ticketType: "VIP", gate: "Gate C", time: "18:51", status: "Duplikat" },
  { id: "CI-05", code: "TKT-CP-8899", holder: "Tidak dikenal", concert: "Coldplay World Tour", ticketType: "—", gate: "Gate B", time: "18:54", status: "Tidak valid" },
  { id: "CI-06", code: "TKT-CP-8824", holder: "Alya Ramadhani", concert: "Coldplay World Tour", ticketType: "CAT 2", gate: "Gate D", time: "18:56", status: "Valid" },
];

export const validCheckInCodes: Record<string, { holder: string; ticketType: string; gate: string }> = {
  "TKT-CP-8821": { holder: "Chiara Anindya", ticketType: "VIP", gate: "Gate A" },
  "TKT-CP-8822": { holder: "Bagas Saputra", ticketType: "CAT 1", gate: "Gate B" },
  "TKT-CP-8823": { holder: "Kirana Larasati", ticketType: "CAT 1", gate: "Gate A" },
  "TKT-CP-8824": { holder: "Alya Ramadhani", ticketType: "CAT 2", gate: "Gate D" },
  "TKT-CP-8825": { holder: "Sinta Dewi", ticketType: "Festival", gate: "Gate C" },
};

export const promos: Promo[] = [
  { id: "PR-01", code: "EARLYBIRD10", concert: "Coldplay World Tour", type: "Persentase", value: 10, minSpend: 500_000, quota: 1_000, used: 632, validUntil: "31 Des 2026", status: "Aktif" },
  { id: "PR-02", code: "COLDPLAY50", concert: "Coldplay World Tour", type: "Nominal", value: 50_000, minSpend: 750_000, quota: 2_000, used: 1_284, validUntil: "20 Des 2026", status: "Aktif" },
  { id: "PR-03", code: "TAEYONG15", concert: "Taeyong City Light Tour", type: "Persentase", value: 15, minSpend: 1_000_000, quota: 500, used: 184, validUntil: "6 Des 2026", status: "Aktif" },
  { id: "PR-04", code: "INDIEHEBAT", concert: "Indie Weekend", type: "Persentase", value: 20, minSpend: 200_000, quota: 800, used: 800, validUntil: "22 Nov 2026", status: "Berakhir" },
  { id: "PR-05", code: "JAZZNEW", concert: "Jazz Night 2026", type: "Nominal", value: 25_000, minSpend: 250_000, quota: 300, used: 300, validUntil: "12 Okt 2026", status: "Berakhir" },
  { id: "PR-06", code: "KPOPEARLY", concert: "K-Pop Nation", type: "Persentase", value: 12, minSpend: 1_000_000, quota: 1_500, used: 0, validUntil: "1 Feb 2027", status: "Dijadwalkan" },
];

export const organizerOrders: OrganizerOrder[] = [
  { id: "ORD-1042", buyer: "Chiara Anindya", email: "chiara@konservibe.id", concert: "Coldplay World Tour", ticketType: "VIP", qty: 2, total: 3_000_000, status: "Dibayar", date: "6 Nov 2026, 14:22", method: "GoPay" },
  { id: "ORD-1041", buyer: "Bagas Saputra", email: "bagas@konservibe.id", concert: "Taeyong City Light Tour", ticketType: "CAT 1", qty: 2, total: 2_000_000, status: "Dibayar", date: "6 Nov 2026, 13:05", method: "Virtual Account BCA" },
  { id: "ORD-1040", buyer: "Sinta Dewi", email: "sinta@konservibe.id", concert: "Coldplay World Tour", ticketType: "CAT 2", qty: 1, total: 750_000, status: "Pending", date: "6 Nov 2026, 11:48", method: "QRIS" },
  { id: "ORD-1039", buyer: "Rizky Maulana", email: "rizky@konservibe.id", concert: "Indie Weekend", ticketType: "Presale", qty: 2, total: 500_000, status: "Cancel", date: "6 Nov 2026, 10:32", method: "Kartu Kredit" },
  { id: "ORD-1038", buyer: "Kirana Larasati", email: "kirana@konservibe.id", concert: "Coldplay World Tour", ticketType: "CAT 1", qty: 2, total: 2_000_000, status: "Dibayar", date: "5 Nov 2026, 20:15", method: "OVO" },
  { id: "ORD-1037", buyer: "Alya Ramadhani", email: "alya@konservibe.id", concert: "Jazz Night 2026", ticketType: "Festival", qty: 2, total: 1_000_000, status: "Refund", date: "5 Nov 2026, 18:40", method: "Dana" },
  { id: "ORD-1036", buyer: "Melati Sari", email: "melati@konservibe.id", concert: "Taeyong City Light Tour", ticketType: "CAT 2", qty: 1, total: 750_000, status: "Pending", date: "5 Nov 2026, 16:12", method: "Virtual Account Mandiri" },
  { id: "ORD-1035", buyer: "Dimas Prakoso", email: "dimas@konservibe.id", concert: "Indie Weekend", ticketType: "Regular", qty: 1, total: 350_000, status: "Dibayar", date: "5 Nov 2026, 14:55", method: "GoPay" },
  { id: "ORD-1034", buyer: "Chiara Anindya", email: "chiara@konservibe.id", concert: "Taeyong City Light Tour", ticketType: "VIP", qty: 1, total: 1_500_000, status: "Dibayar", date: "4 Nov 2026, 21:08", method: "QRIS" },
  { id: "ORD-1033", buyer: "Bagas Saputra", email: "bagas@konservibe.id", concert: "Coldplay World Tour", ticketType: "Festival", qty: 4, total: 2_000_000, status: "Dibayar", date: "4 Nov 2026, 19:33", method: "Kartu Debit" },
  { id: "ORD-1032", buyer: "Nadia Putri", email: "nadia@euphorialive.id", concert: "Coldplay World Tour", ticketType: "VIP", qty: 2, total: 3_000_000, status: "Pending", date: "4 Nov 2026, 10:20", method: "Virtual Account BNI" },
  { id: "ORD-1031", buyer: "Sinta Dewi", email: "sinta@konservibe.id", concert: "Jazz Night 2026", ticketType: "Festival", qty: 1, total: 500_000, status: "Dibayar", date: "3 Nov 2026, 17:45", method: "QRIS" },
  { id: "ORD-1030", buyer: "Rizky Maulana", email: "rizky@konservibe.id", concert: "Taeyong City Light Tour", ticketType: "CAT 1", qty: 2, total: 2_000_000, status: "Cancel", date: "3 Nov 2026, 15:10", method: "Kartu Kredit" },
  { id: "ORD-1029", buyer: "Kirana Larasati", email: "kirana@konservibe.id", concert: "Indie Weekend", ticketType: "Presale", qty: 4, total: 1_000_000, status: "Refund", date: "2 Nov 2026, 12:25", method: "OVO" },
  { id: "ORD-1028", buyer: "Alya Ramadhani", email: "alya@konservibe.id", concert: "Coldplay World Tour", ticketType: "CAT 2", qty: 2, total: 1_500_000, status: "Dibayar", date: "2 Nov 2026, 09:18", method: "Dana" },
];

export const withdrawals: Withdrawal[] = [
  { id: "WD-0091", amount: 1_250_000_000, fee: 6_250_000, net: 1_243_750_000, method: "BCA", account: "1234567890", status: "Diproses", date: "6 Nov 2026" },
  { id: "WD-0090", amount: 2_000_000_000, fee: 10_000_000, net: 1_990_000_000, method: "BCA", account: "1234567890", status: "Berhasil", date: "30 Okt 2026" },
  { id: "WD-0089", amount: 750_000_000, fee: 3_750_000, net: 746_250_000, method: "Mandiri", account: "0987654321", status: "Berhasil", date: "16 Okt 2026" },
  { id: "WD-0088", amount: 500_000_000, fee: 2_500_000, net: 497_500_000, method: "BCA", account: "1234567890", status: "Ditolak", date: "2 Okt 2026" },
];

export const availableBalance = 2_450_000_000;
export const pendingWithdrawal = 1_250_000_000;
export const totalWithdrawn = 8_200_000_000;
export const minimumWithdrawal = 500_000;

export const revenueByMonth: ChartPoint[] = [
  { label: "Jan", value: 1_800_000_000 },
  { label: "Feb", value: 2_100_000_000 },
  { label: "Mar", value: 2_400_000_000 },
  { label: "Apr", value: 2_200_000_000 },
  { label: "Mei", value: 2_800_000_000 },
  { label: "Jun", value: 3_100_000_000 },
  { label: "Jul", value: 3_400_000_000 },
  { label: "Agu", value: 3_900_000_000 },
  { label: "Sep", value: 3_600_000_000 },
  { label: "Okt", value: 4_600_000_000 },
  { label: "Nov", value: 5_200_000_000 },
  { label: "Des", value: 6_137_500_000 },
];

export const ticketsByMonth: ChartPoint[] = [
  { label: "Jan", value: 2_600 },
  { label: "Feb", value: 3_100 },
  { label: "Mar", value: 3_400 },
  { label: "Apr", value: 3_200 },
  { label: "Mei", value: 4_100 },
  { label: "Jun", value: 4_400 },
  { label: "Jul", value: 4_800 },
  { label: "Agu", value: 5_200 },
  { label: "Sep", value: 4_900 },
  { label: "Okt", value: 5_800 },
  { label: "Nov", value: 6_200 },
  { label: "Des", value: 5_900 },
];

export const salesByConcert: ShareItem[] = [
  { label: "Coldplay", value: 75, color: "#8b5cf6" },
  { label: "Taeyong", value: 17, color: "#22d3ee" },
  { label: "Jazz Night", value: 6, color: "#f472b6" },
  { label: "Indie Weekend", value: 2, color: "#f59e0b" },
];

export const trafficSources: ShareItem[] = [
  { label: "Instagram", value: 44, color: "#ec4899" },
  { label: "TikTok", value: 24, color: "#22d3ee" },
  { label: "Google Search", value: 15, color: "#38bdf8" },
  { label: "Komunitas", value: 10, color: "#a78bfa" },
  { label: "Direct", value: 7, color: "#34d399" },
];

export const audienceCities: ShareItem[] = [
  { label: "Jakarta", value: 52, color: "#8b5cf6" },
  { label: "Bandung", value: 14, color: "#a78bfa" },
  { label: "Surabaya", value: 10, color: "#f472b6" },
  { label: "Yogyakarta", value: 8, color: "#22d3ee" },
  { label: "Bali", value: 6, color: "#34d399" },
  { label: "Medan", value: 5, color: "#fbbf24" },
  { label: "Lainnya", value: 5, color: "#64748b" },
];

export const hourlyCheckIns: ChartPoint[] = [
  { label: "16:00", value: 620 },
  { label: "17:00", value: 1_240 },
  { label: "18:00", value: 2_180 },
  { label: "19:00", value: 1_620 },
  { label: "20:00", value: 760 },
];

export const organizerNotifications: OrganizerNotification[] = [
  { id: "on1", text: "Pesanan ORD-1038 sudah dibayar dan tiket dikirim.", time: "12 menit lalu", unread: true, tone: "success" },
  { id: "on2", text: "Withdraw WD-0091 senilai Rp1.250.000.000 sedang diproses.", time: "48 menit lalu", unread: true, tone: "info" },
  { id: "on3", text: "Check-in Coldplay World Tour mencapai 92% dari target.", time: "2 jam lalu", unread: true, tone: "warning" },
  { id: "on4", text: "Promo COLDPLAY50 tersisa 716 kuota penggunaan.", time: "1 hari lalu", unread: false, tone: "info" },
];
